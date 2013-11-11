---
title: followRedirect
---

This is an option which, if `true` will follow HTTP 3XX responses as redirects.

To disallow following redirects, set to `false`

{% highlight json %}
{
    "myRequest1": {
        "followRedirect": false,
        "uri": "http://api.mysite.com/users/1"
    }
}
{% endhighlight %}

*default: true*
