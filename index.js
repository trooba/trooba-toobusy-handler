'use strict';

const Toobusy = require('hystrix-too-busy');

/*
    toobusy module is a singleton and should not be configured every request.
    It should be re-configured separately using configure method.
*/
module.exports = function toobusy(pipe, config) {
    pipe.once('request', (request, next) => {
        Toobusy.getStatus(pipe.context.command, busy => {
            if (busy) {
                return pipe.throw(new Error('TooBusy'));
            }
            next();
        });
    });
};

module.exports.configure = Toobusy.init;
module.exports.Toobusy = Toobusy;
module.Hystrix = Toobusy.Hystrix;
