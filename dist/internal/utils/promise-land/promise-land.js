"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
/**
 * @description
 *  This class serve one purpose, to covert an async or sync function to a promise. <br>
 *  If the *target* function is perform async action it must receive a 'done' callback as it first parameter, <br>
 *  and call the 'done' callback when the async action as ended, any error wished to be thrown from the promisified <br>
 *  *target* method should be passed to 'done' as the first argument, the object to be returned passed as the <br>
 *  second argument.
 * */
class PromiseLand {
    // ================
    static createDoneFn(resolve, reject) {
        let canRun = true;
        return function (err, args) {
            if (canRun) {
                canRun = false;
                if (err != undefined) {
                    reject(err);
                }
                else {
                    resolve(args);
                }
            }
        };
    }
    static promisifyCallback(cb, args, cbAsync = true) {
        return (new Promise(function (resolve, reject) {
            try {
                if (cbAsync) {
                    const done = PromiseLand.createDoneFn(resolve, reject);
                    cb(done, ...args);
                }
                else {
                    const result = cb(...args);
                    resolve(result);
                }
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    // ================
    static createTimerDoneFn(resolve, reject, options) {
        let canRun = true;
        const start = perf_hooks_1.performance.now();
        let clock;
        if (options.timeout && options.timeout > 0) {
            clock = setTimeout(() => {
                canRun = false;
                clearTimeout(clock);
                clock = undefined;
                const err = options.errorCtor ?
                    new (options.errorCtor)(options.timeout) : new Error('timeout excited !');
                reject(err);
            }, options.timeout);
        }
        return function (err, args) {
            if (canRun) {
                canRun = false;
                if (clock) {
                    clearTimeout(clock);
                }
                const end = perf_hooks_1.performance.now();
                if (err != undefined) {
                    reject(err);
                }
                else {
                    resolve({ start, end, duration: (end - start), resolvedWith: args });
                }
            }
        };
    }
    static timerifyCallback(cb, args, cbAsync = true, options = {}) {
        return (new Promise(function (resolve, reject) {
            try {
                if (cbAsync) {
                    const done = PromiseLand.createTimerDoneFn(resolve, reject, options);
                    cb(done, ...args);
                }
                else {
                    const res = PromiseLand.timerifySync(cb, args);
                    resolve(res);
                }
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    // ================
    static timerifySync(cb, args) {
        if (typeof cb !== 'function') {
            return;
        }
        const start = perf_hooks_1.performance.now();
        const result = cb(...args);
        const end = perf_hooks_1.performance.now();
        return { start, end, duration: (end - start), resolvedWith: result };
    }
}
exports.PromiseLand = PromiseLand;
//# sourceMappingURL=promise-land.js.map