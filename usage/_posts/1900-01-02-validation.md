---
title: validation
---

We also recommend enabling the bundled validation middleware we include which will
ensure the request sent to be batched has the right format. To do so, just update
the routing line as follows:

{% highlight js %}
  // Adding the Batch Request validation middleware
  app.post('/batch', batch.validate, batch);
{% endhighlight %}

And that's it! 

Validation happens by some sanity checks and the [options](#options) specified
below.

Of course you can always ignore this and use your own validation middleware as
well, but be careful to prevent your server from being used as a proxy.
