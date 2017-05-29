'use strict';

const Toobusy = require('hystrix-too-busy');

/*
    toobusy module is a singleton and should not be configured every request.
    It should be re-configured separately using configure method.
*/
module.exports = function toobusy(pipe) {
    pipe.once('request', (request, next) => {
        Toobusy.getStatus(busy => {
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
