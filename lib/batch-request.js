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
    params.validateRespond = (typeof params.validateRespond === 'undefined') ? true : params.validateRespond;

    var batch = function(req, res, next) {
        // Here we assume it the request has already been validated, either by
        // our included middleware or otherwise by the app developer.

        // We also assume it has been run through some middleware like
        // express.bodyParser() or express.json() to parse the request.

        // We want a deep clone here as we're going to destroy this object.
        var requests = _.cloneDeep(req.body);

        // First, let's fire off all calls without any dependencies, accumulate their promises
        var requestPromises = _.reduce(requests, function(promises, r, key) {
            if (!r.dependency || r.dependency === 'none') {
                promises[key] = new Promise(function(resolve, reject) {
                    request(r, function(error, response, body) {
                        var resp = {};
                        resp.key = key;
                        resp.data = response;
                        resolve(resp);
                    });
                });
            }
            return promises;
        }, {});

        // And while we do that, build the dependency object with those items as keys
        // { key: Promise }

        // Then recursively iterate over all items with dependencies, resolving some at each pass

        // Then flatten out the chain with Promise.all(_.values(promises)).then( ... );


        // Temporarily ignoring dependencies

        // Wait for all to complete before responding
        Promise.all(_.values(requestPromises)).then(function(results) {
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
        var requests = req.body;

        // Validation on Request object as a whole
        try {
            check(_.size(requests), 'Cannot make a batch request with an empty request object').min(1);
            check(_.size(requests), 'Over the max request limit. Please limit batches to ' + params.max + ' requests').max(params.max);
            if (req.method === 'POST' && !req.is('json')) {
                throw new Error('Batch Request will only accept body as json');
            }
        } catch (e) {
            err = {
                error: {
                    'message': e.message,
                    'type': 'ValidationError'
                }
            };
        }

        // Validation on each request object
        _.each(requests, function(r, key) {

            // If no method provided, default to GET
            r.method = (typeof r.method === 'string') ? r.method.toLowerCase() : 'get';

            // Accept either uri or url (this is what request does, we just mirror)
            r.url = r.url || r.uri;

            try {
                check(r.url, 'Invalid URL').isUrl();
                check(r.method, 'Invalid method').isIn(methods);
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
