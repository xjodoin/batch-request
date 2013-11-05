// Validation middleware tests

process.env.NODE_ENV = 'test';

var Chance = require('chance'),
    chance = new Chance(),
    expect = require('chai').expect,
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
    });

    describe('options', function() {
        it('obeys the max option default at 100');
        it('obeys the localOnly option when set as true');
        it('obeys the httpsOnly option when set as true');
    });
});
