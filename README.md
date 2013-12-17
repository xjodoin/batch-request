Batch Request
=============

A simple library for batching HTTP requests

[View Documentation](http://batch-request.socialradar.com)

[![Build Status](https://travis-ci.org/socialradar/batch-request.png?branch=master)](https://travis-ci.org/socialradar/batch-request) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## QuickStart

Download via [NPM](http://npmjs.org)

[![NPM](https://nodei.co/npm/batch-request.png?compact=true)](https://nodei.co/npm/batch-request/)

then in your app

    // Use Batch Request as middleware on an endpoint you want to service batch requests
    app.get('/batch', batch);


Optionally use our included middleware to check the validity of your batch request

    // Include the batch.validate middleware before batch middleware
    app.get('/batch', batch.validate, batch);

And that's it!

Proudly written in Washington, D.C. by:

[![SocialRadar](https://raw.github.com/socialradar/batch-request/master/social-radar-black-orange.png)](http://socialradar.com)
