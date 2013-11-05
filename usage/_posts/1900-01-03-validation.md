---
title: validation
---

**Batch Request** can also be used as validation middleware. This ensures that
base requirements are met prior to **Batch Request** itself being hit.

In your app

{% highlight js %}
  // Load Batch Request
  var batch = require('batch-request')(),
      express = require('express'),
      app = express.createServer();

  // Use Batch Request validation middleware along with batch request itself on
  // an endpoint you want to service batch requests. This will ensure only valid
  // requests make their way to batch.
  app.get('/batch', batch.validate, batch);

  app.listen(5000);
  console.log("Server started!");

{% endhighlight %}

Validation happens by the [options](#options) specified above. **Batch Request**
will check the request format generally and also ensure it meets the options.

Of course you can always ignore this and use your own validation middleware as
well, but be careful to prevent your server from being used as a proxy.
