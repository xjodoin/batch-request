// Batch Request

var _ = require('lodash'),
    request = require('request'),
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
        var responses = {};

        _.each(requests, function(r, key) {
            console.log(r);
            r.url = url.resolve(r.url);
            console.log(r);
            // request(r, function(error, response, body) {
            //     console.log(error);
            //     console.log(response);
            //     console.log(body);
            //     responses[key]['statusCode'] = response.statusCode;
            //     responses[key]['body'] = body;
                
            // });
        });

        next();
    };

    batch.validate = function(req, res, next) {
        if (!req.is('json')) {
            res.send(400, {
                error: {
                    'message': 'Batch Request will only accept body as json',
                    'type': 'ValidationIssue',
                    'code': '100'
                }
            });
        }

        // TODO: Ensure each request has a URL
        next();
    };

    return batch;
};

module.exports = batchRequest;
