---
title: strictSSL
---

This is an option which, if `true` will require that SSL certs be valid. If you
generate your own cert, having this set to `true` will likely cause the request
to fail.

{% highlight json %}
{
    "myRequest1": {
        "method": "GET",
        "strictSSL": false,
        "uri": "https://api.mysite.com/users/1"
    }
}
{% endhighlight %}


*default: true*
