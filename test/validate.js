// Validation middleware tests

process.env.NODE_ENV = 'test';

var _ = require('lodash'),
    Chance = require('chance'),
    chance = new Chance(),
    expect = require('chai').expect,
    methods = require('methods'),
    request = require('supertest');

var app = require('./helpers/app');

var batch = require('../lib/batch-request')();

// Add a Chance mixin for creating a fake batch-request object
chance.mixin({
    batchRequest: function(params) {
        params = params || {};
        params.size = params.size || chance.d12();

        var batchRequest = {};

        _.times(params.size, function() {
            var opts = _.clone(params);
            opts.endpoint = chance.pick([
                '/users/' + chance.natural({max: 5000}) + '/name',
                '/users/' + chance.natural({max: 5000}) + '/email',
                '/users/' + chance.natural({max: 5000}) + '/company'
            ]);

            opts.method = params.method || chance.pick(methods);

            opts.host = params.host || chance.domain();
            opts.protocol = params.protocol || chance.pick(['http', 'https']);
            opts.port = params.port || chance.pick([80, 3000, 4000, 5000]);

            batchRequest[chance.word()] = {
                url: _.template('${ protocol }://${ host }:${ port }${ endpoint }', opts),
                method: opts.method
            };
        });
        return batchRequest;
    }
});

describe('validate', function() {
    describe('basic', function() {
        it('looks good', function() {
            expect(batch).to.be.a('function');
        });

        it('has a validate method', function() {
            expect(batch).to.have.property('validate');
            expect(batch.validate).to.be.a('function');
        });

        it('rejects non-object JSON', function(done) {
            request(app)
                .post('/batch')
                .send(chance.word())
                .expect(400, function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.error).to.exist;
                    done();
                });
        });
    });

    describe('options', function() {
        it('obeys the max option default at 20', function(done) {
            var requestObject = chance.batchRequest({method: 'get', size: 25, host: 'localhost', port: 4000});
            request(app)
                .post('/batch')
                .send(requestObject)
                .expect(400, function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.error).to.exist;
                    expect(res.body.error.type).to.equal('ValidationError');
                    done();
                });
        });
        it('obeys the localOnly option when set as true');
        it('obeys the httpsOnly option when set as true');
    });

    describe('other validation', function() {
        it('rejects request with bogus method', function(done) {
            request(app)
                .post('/batch')
                .send({
                    bogusMethod: {
                        method: chance.word() + chance.word(),
                        url: 'http://localhost:4000/users/1/name'
                    }
                })
                .expect(400, function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.error).to.exist;
                    expect(res.body.error.type).to.equal('ValidationError');
                    done();
                });
        });

        it('rejects request with bogus url', function(done) {
            request(app)
                .post('/batch')
                .send({
                    bogusUrl: {
                        url: chance.word()
                    }
                })
                .expect(400, function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.error).to.exist;
                    expect(res.body.error.type).to.equal('ValidationError');
                    expect(res.body.error.message).to.equal('Invalid URL');
                    expect(res.body.error.request).to.equal('bogusUrl');
                    done();
                });
        });
    });
});
