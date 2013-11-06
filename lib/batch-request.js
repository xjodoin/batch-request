// Batch Request

var _ = require('lodash'),
    methods = require('methods'),
    Promise = require('bluebird'),
    request = require('superagent'),
    url = require('url'),
    Validator = require('validator').Validator;

var batchRequest = function(params) {

    // Set default option values
    params = params || {};
    params.localOnly = params.localOnly || true;
    params.httpsAlways = params.httpsAlways || false;
    params.max = params.max || 100;

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
                var agent = request.agent();
                agent[r.method.toLowerCase()](r.url)
                    .end(function(response) {
                        var resp = {};
                        resp.key = key;
                        resp.data = {
                            statusCode: response.status,
                            body: response.body,
                            headers: response.headers
                        };
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
        if (req.method === 'POST' && !req.is('json')) {
            var err = {
                error: {
                    'message': 'Batch Request will only accept body as json',
                    'type': 'ValidationIssue',
                    'code': 100
                }
            };
            res.send(400, err);
            next(err);
        }

        var requests = req.body;

        _.each(requests, function(request, key) {
            // TODO: Ensure each request has a valid URL


            // If a method was provided, ensure it's legit
            if (_.has(request, 'method')) {
                if (!_.contains(methods, request.method)) {
                    var err = {
                        error: {
                            'message': 'Invalid method supplied.',
                            'type': 'ValidationIssue',
                            'code': 110
                        }
                    };
                    res.send(400, err);
                    next(err);
                }
            } else {
                // If no method was provided, default to GET
                requests[key].method = 'GET';
            }

            // TODO: Convert relative paths to full paths
            // var fullURL = req.protocol + "://" + req.get('host') + req.url;

        });

        next();
    };

    return batch;
};

module.exports = batchRequest;
