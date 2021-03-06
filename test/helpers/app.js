// Test app
var express = require('express'),
    app = module.exports = express(),
    Chance = require('chance'),
    chance = new Chance(),
    batch = require('../../lib/batch-request')();

app.use(express.json());

// A POST endpoint to use the batch middleware
app.post('/batch', batch.validate, batch);
// A GET endpoint to use the batch middleware
app.get('/batch', batch.validate, batch);

// Let's make some fake endpoints
app.get('/users/:id/name', function(req, res) {
    res.json(chance.name());
});

app.post('/users/:id/name', function(req, res) {
    // If a first name is sent in, we will reflect it so we can test that it was
    // received correctly.
    if (req.body.first) {
        res.json(req.body.first);
    } else {
        res.json(chance.name());
    }
});

app.put('/users/:id/name', function(req, res) {
    res.json(chance.name());
});

app.post('/users/:id/deep', function(req, res) {
    res.json({
        email: chance.email(),
        mixed: {
            name: chance.name(),
            deep: {
                foo: 'bar'
            }
        }
    });
});

app.get('/users/:id/email', function(req, res) {
    res.json(chance.email());
});

app.get('/users/:id/company', function(req, res) {
    res.json(chance.capitalize(chance.word()));
});

app.get('/users/:id/hammertime', function(req, res) {
    res.json(new Date().getTime());
});

app.get('/users/:id/delay', function(req, res, next) {
    setTimeout(function() {
        res.json(new Date().getTime());
        next();
    }, 250);
});


app.listen(3000);
