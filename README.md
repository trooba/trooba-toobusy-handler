# trooba-toobusy-handler

[![Greenkeeper badge](https://badges.greenkeeper.io/trooba/trooba-toobusy-handler.svg)](https://greenkeeper.io/)

The module provides trooba too-busy handler. The handler is based on [hystrix-too-busy module](https://github.com/trooba/hystrix-too-busy)

[![codecov](https://codecov.io/gh/trooba/trooba-toobusy-handler/branch/master/graph/badge.svg)](https://codecov.io/gh/trooba/trooba-toobusy-handler)
[![Build Status](https://travis-ci.org/trooba/trooba-toobusy-handler.svg?branch=master)](https://travis-ci.org/trooba/trooba-toobusy-handler) [![NPM](https://img.shields.io/npm/v/trooba-toobusy-handler.svg)](https://www.npmjs.com/package/trooba-toobusy-handler)
[![Downloads](https://img.shields.io/npm/dm/trooba-toobusy-handler.svg)](http://npm-stat.com/charts.html?package=trooba-toobusy-handler)
[![Known Vulnerabilities](https://snyk.io/test/github/trooba/trooba-toobusy-handler/badge.svg)](https://snyk.io/test/github/trooba/trooba-toobusy-handler)

### Install

```
$ npm install trooba-toobusy-handler -S
```

### Usage

```js
const toobusy = require('trooba-toobusy-handler');

toobusy.configure({
    latencyThreshold: 70,
    interval: 500,
    default: {
        circuitBreakerErrorThresholdPercentage: 50,
        circuitBreakerRequestVolumeThreshold: 20,
        circuitBreakerSleepWindowInMilliseconds: 5000
    }
});

require('trooba')
// optional: command resolver used by toobusy
.use(pipe => {
    pipe.on('request', request => {
        pipe.context.command =
            request.path === '/' ? 'homeCommand' : 'otherCommand';
    });
})
// add toobusy
.use(toobusy)
// add http transport
.use('trooba-http-transport', {
    protocol: 'http:',
    hostname: 'www.google.com'
})
.build('client:default')
.get({
    q: 'nike'
})
.set('some', 'header')
.end(function (err, response) {
    console.log(err, response && response.body)
});
```
