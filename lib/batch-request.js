// Batch Request

var _ = require('lodash'),
    check = require('validator').check,
    methods = require('methods'),
    Promise = require('bluebird'),
    request = require('request'),
    url = require('url');

var batchRequest = function(params) {

    // Set default option values
    params = params || {};
    params.localOnly = (typeof params.localOnly === 'undefined') ? true : params.localOnly;
    params.httpsAlways = (typeof params.localOnly === 'undefined') ? false : params.localOnly;
    params.max = (typeof params.max === 'undefined') ? 20 : params.max;

    var batch = function(req, res, next) {
        // Here we assume it the request has already been validated, either by
        // our included middleware or otherwise by the app developer.

        // We also assume it has been run through some middleware like
        // express.bodyParser() or express.json() to parse the request.


        var requests = req.body;
        var requestPromises = [];

        // First suss out dependencies

        // Temporarily ignoring dependencies
        _.each(requests, function(r, key) {
            // push a Promise for each request
            requestPromises.push(new Promise(function(resolve, reject) {
                request(r, function(error, response, body) {
                    var resp = {};
                    resp.key = key;
                    resp.data = response;
                    resolve(resp);
                });
            }));
        });

        // Wait for all to complete before responding
        Promise.all(requestPromises).then(function(results) {
            var result = {};
            results.forEach(function(item) {
                result[item.key] = item.data;
            });
            res.json(result);
            next();
        });
    };

    batch.validate = function(req, res, next) {
        var err = null;

        if (req.method === 'POST' && !req.is('json')) {
            err = {
                error: {
                    'message': 'Batch Request will only accept body as json',
                    'type': 'ValidationError'
                }
            };
        }

        var requests = req.body;

        _.each(requests, function(request, key) {

            // If no method provided, default to GET
            request.method = (typeof request.method === 'string') ? request.method.toLowerCase() : 'get';

            // Accept either uri or url (this is what request does, we just mirror)
            request.url = request.url || request.uri;

            try {
                check(request.url, 'Invalid URL').isUrl();
                check(request.method, 'Invalid method').isIn(methods);
            } catch (e) {
                err = {
                    error: {
                        'message': e.message,
                        'request': key,
                        'type': 'ValidationError'
                    }
                };
            }

            // TODO: Convert relative paths to full paths
            // var fullURL = req.protocol + "://" + req.get('host') + req.url;

        });

        if (err !== null) {
            res.send(400, err);
            next(err);
        } else {
            next();
        }
    };

    return batch;
};

module.exports = batchRequest;
