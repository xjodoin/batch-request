// Test app
var express = require('express'),
    app = module.exports = express(),
    Chance = require('chance'),
    chance = new Chance(),
    batch = require('../../lib/batch-request')();

app.use(express.json());

// An endpoint to use the batch middleware
app.post('/batch', batch.validate, batch);

// Let's make some fake endpoints
app.get('/users/:id/name', function(req, res) {
    res.json(chance.name());
});

app.get('/users/:id/email', function(req, res) {
    res.json(chance.email());
});

app.get('/users/:id/company', function(req, res) {
    res.json(chance.capitalze(chance.word()));
});

app.listen(4000);
