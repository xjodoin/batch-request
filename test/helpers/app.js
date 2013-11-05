// Test app
var express = require('express'),
    app = module.exports = express(),
    batch = require('../../lib/batch-request')();

app.use(express.json());

app.post('/batch', batch.validate, batch);
app.listen(3000);
