Batch Request
=============

A simple library for batching HTTP requests

[View Documentation](http://socialradar.github.io/batch-request/)

[![Build Status](https://travis-ci.org/socialradar/batch-request.png?branch=master)](https://travis-ci.org/socialradar/batch-request)

## QuickStart

Download via [NPM](http://npmjs.org)

    npm install --save batch-request

then in your app

    // Load Batch Request
    var batch = require('batch-request')(),
        express = require('express'),
        app = express.createServer();

    // Use Batch Request as middleware on an endpoint you want to service batch requests
    app.get('/batch', batch);

    app.listen(5000);
    console.log("Server started!");

And you're off!

See [the website](http://socialradar.github.io/batch-request/) for more detailed usage information and details.
