---
title: middleware
---

It is primarily built to be used in [Node.js](http://nodejs.org) as middleware
with [Connect](http://www.senchalabs.org/connect/) or [Express](http://expressjs.com).


{% highlight bash %}
  npm install batch-request
{% endhighlight %}

then in your app

{% highlight js %}
  // Load Batch Request
  var batch = require('batch-request')();

  // Use Batch Request as middleware on an endpoint you want to service batch requests
  app.post('/batch', batch);
{% endhighlight %}

and that's it! Any POSTs to the `'/batch'` endpoint will be handled by **Batch Request**.
