'use strict';

const Assert = require('assert');
const Async = require('async');
const Trooba = require('trooba');
const Toobusy = require('hystrix-too-busy');
const handler = require('..');

describe(__filename, () => {
    it('should pass', next => {
        Trooba
        .use(handler)
        .use(pipe => pipe.on('request', request => {
            pipe.respond('ok');
        }))
        .build()
        .create()
        .request('hi', (err, res) => {
            Assert.ok(!err, err && err.stack);
            Assert.equal('ok', res);
            next();
        });
    });

    it('should throw busy error', next => {
        handler.configure({
            default: {
                circuitBreakerRequestVolumeThreshold: 1
            }
        });

        Toobusy.deps.toobusy = () => true;

        const pipe = Trooba
        .use(handler)
        .use(pipe => pipe.on('request', request => {
            pipe.respond('ok');
        }))
        .build();

        Async.series([
            next => {
                pipe.create()
                .request('hi', (err, res) => {
                    Assert.ok(!err, err && err.stack);
                    next();
                });
            },

            next => {
                pipe.create()
                .request('hi', (err, res) => {
                    Assert.ok(err);
                    Assert.equal('TooBusy', err.message);
                    next();
                });
            }
        ], next);
    });

    it('should pick up command specific config and throw busy error', next => {
        handler.configure({
            default: {
                circuitBreakerRequestVolumeThreshold: 10
            },
            commands: {
                hi: {
                    circuitBreakerRequestVolumeThreshold: 1
                }
            }
        });

        Toobusy.deps.toobusy = () => true;

        const pipe = Trooba
        .use(pipe => pipe.on('request', (request, next) => {
            pipe.context.command = request;
            next();
        }))
        .use(handler)
        .use(pipe => pipe.on('request', request => {
            pipe.respond('ok');
        }))
        .build();

        Async.series([
            next => {
                pipe.create()
                .request('hi', (err, res) => {
                    Assert.ok(!err, err && err.stack);
                    next();
                });
            },

            next => {
                pipe.create()
                .request('hi', (err, res) => {
                    Assert.ok(err);
                    Assert.equal('TooBusy', err.message);
                    next();
                });
            }
        ], next);
    });
});
