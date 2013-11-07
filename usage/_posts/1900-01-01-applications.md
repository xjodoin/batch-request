---
title: applications
---

So when to use **Batch Request**?

Below are a few good examples:

#### Optimizing APIs for Mobile

We developed **Batch Requests** at [SocialRadar](http://www.socialradar.com) particularly for use with mobile devices connecting to our APIs written in Node.js.

For mobile devices particularly, spinning the cell modem up is an expensive operation and includes a fair amount of latency (we found an average of around 300ms from an iPhone 5s on LTE!).

We wanted to avoid that latency, but also spinning up the cell modem over and over to execute a chain of requests resulted in unnecessary battery drainage!

So we were taking a double hit anytime we sent multiple requests, not only was it slower but it was also but killing the battery faster.

We wrote this library to have a way to send API requests in batch from these mobile devices to our API to minimize these negative effects.

#### Maintaining RESTful purity

Further, there are situations where API developers are tempted to stray from RESTful principles in order to minimize requests. With **Batch Request** such compromises are unnecessary.

For example, let's say you have an application with an API and you have 3 different underlying model objects: `Users`, `Devices`, `Sessions`. `Users` have `Devices` and `Users` have `Sessions`, each of which is linked to a specific `Device`.

It's tempting to write a non-RESTful, more SOA endpoint such as `/updateDevicesAndSessions` in order to make all of these changes in one shot rather than operating on the resources one after the next in three pure RESTful calls to update each object.

However, with **Batch Request** you can maintain the benefits of a cheat like this (only one request to update multiple things) while maintainting REST purity.
