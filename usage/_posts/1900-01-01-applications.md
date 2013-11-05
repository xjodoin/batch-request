---
title: applications
---

So when to use **Batch Request**?

Below are a few good examples:

#### Optimizing APIs for Mobile

We developed **Batch Requests** at [SocialRadar](http://www.socialradar.com) particularly for use with mobile devices connecting to our APIs written in Node.js.

For mobile devices particularly, spinning the cell modem up is an expensive operation and includes a fair amount of latency (we found an average of around 300ms from an iPhone 5s on LTE!).

So we needed a way to be able to send API requests in batch from these mobile devices to our API to minimize battery drainage and latency on the client.

#### Maintaining RESTful purity

Further, there are situations where API developers are tempted to stray from RESTful principles in order to minimize requests. With **Batch Request** such compromises are unnecessary.

For example, let's say you have an application with an API and you have 3 different underlying model objects: `Users`, `Devices`, `Sessions`. `Users` have `Devices` and `Users` have `Sessions` which are particular to a specific `Device`.

It's tempting to write a non-RESTful endpoint /updateDevicesAndSessions or something to make all of these requests in one shot rather than making three pure RESTful calls to update each object. 

However, with **Batch Request** you can maintain the benefits of a cheat like this (only one request to update multiple things) while maintainting REST purity.

Using **Batch Request** you can send a single request which represents many requests and receive the results of all those requests in a single reply.
