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

        it('rejects a blank request', function(done) {
            request(app)
                .post('/batch')
                .send({})
                .expect(400, function(err, res) {
                    expect(err).to.be.null;
                    expect(res.body.error).to.exist;
                    expect(res.body.error.message).to.equal('Cannot make a batch request with an empty request object');
                    done();
                });
        });
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
