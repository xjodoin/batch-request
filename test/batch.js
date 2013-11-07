// Batch tests

process.env.NODE_ENV = 'test';

var Chance = require('chance'),
    chance = new Chance(),
    expect = require('chai').expect,
    request = require('supertest');

var app = require('./helpers/app');

var batch = require('../lib/batch-request')();

describe('batch', function() {
    describe('basic', function() {
        it('looks good', function() {
            expect(batch).to.be.a('function');
        });
    });

    describe('test our app helper', function() {
        it('has a /users/1/name endpoint', function(done) {
            request(app)
                .get('/users/1/name')
                .expect(200, function(err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.exist;
                    done();
                });
        });
    });

    describe('basic', function() {
        it('can handle a single request, without a method', function(done) {
            request(app)
                .post('/batch')
                .send({
                    getName: {
                        url: 'http://localhost:3000/users/1/name'
                    }
                })
                .expect(200, function(err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('getName');
                    expect(res.body.getName.statusCode).to.equal(200);
                    expect(res.body.getName.body).to.be.a('string');
                    done();
                });
        });
        describe('can handle multiple requests', function() {
            it('without a method', function(done) {
                request(app)
                    .post('/batch')
                    .send({
                        getName: {
                            url: 'http://localhost:3000/users/1/name'
                        },
                        getEmail: {
                            url: 'http://localhost:3000/users/1/email'
                        },
                        getCompany: {
                            url: 'http://localhost:3000/users/1/company'
                        }
                    })
                    .expect(200, function(err, res) {
                        expect(err).to.not.exist;
                        expect(res.body).to.have.property('getName');
                        expect(res.body.getName.statusCode).to.equal(200);
                        expect(res.body.getName.body).to.be.a('string');
                        expect(res.body.getEmail.statusCode).to.equal(200);
                        expect(res.body.getEmail.body).to.be.a('string');
                        expect(res.body.getCompany.statusCode).to.equal(200);
                        expect(res.body.getCompany.body).to.be.a('string');
                        done();
                    });
            });

            it('one of which is bogus', function(done) {
                request(app)
                    .post('/batch')
                    .send({
                        getName: {
                            url: 'http://localhost:3000/users/1/name'
                        },
                        getEmail: {
                            url: 'http://localhost:3000/users/1/' + chance.word()
                        },
                        getCompany: {
                            url: 'http://localhost:3000/users/1/company'
                        }
                    })
                    .expect(200, function(err, res) {
                        expect(err).to.not.exist;
                        expect(res.body).to.have.property('getName');
                        expect(res.body.getName.statusCode).to.equal(200);
                        expect(res.body.getName.body).to.be.a('string');
                        expect(res.body.getEmail.statusCode).to.equal(404);
                        expect(res.body.getCompany.statusCode).to.equal(200);
                        expect(res.body.getCompany.body).to.be.a('string');
                        done();
                    });
            });
        });
    });
});
