// Batch Request

var _ = require('lodash'),
    Validator = require('validator').Validator;

var batchRequest = function(params) {

    // Set default option values
    params = params || {};
    params.localOnly = params.localOnly || true;
    params.httpsAlways = params.httpsAlways || false;
    params.max = params.max || 100;

    var batch = function(req, res, next) {
        
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
        next();
    };

    return batch;
};

module.exports = batchRequest;
