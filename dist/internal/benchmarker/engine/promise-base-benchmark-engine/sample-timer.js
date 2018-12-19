"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const switch_lock_1 = require("./../../../utils/switch-lock/switch-lock");
const events_1 = require("events");
const common_untitled_1 = require("./../../../utils/common-untitled");
const promise_land_1 = require("./../../../utils/promise-land");
const sys_error_1 = require("../../../sys-error");
class Timer {
    constructor() {
        this.switchLock = new switch_lock_1.SwitchLock();
        this._id = common_untitled_1.generateId();
    }
    singleSample(cb, args, sampleId, roundCallData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.switchLock.isLocked()) {
                return;
            }
            this.switchLock.lock();
            let timerReport;
            if (roundCallData.async) {
                timerReport = yield this.asyncRoundCall(cb, args, sampleId, roundCallData.timeout);
            }
            else {
                timerReport = this.syncRoundCall(cb, args, sampleId);
            }
            this.switchLock.unlock();
            return timerReport;
        });
    }
    /**
     * @throws RoundCallError if any error raised from 'cb' callback, and the error is not of type TimeoutError.
     * @throws TimeoutError from timerifyCallback method, ('cb' callback was limit with timeout, and exceeded).
     *
     * @param cb an async callback to promisify and timerify - wrap in a promise and measure execution time.
     * @param args argument array for cb.
     * @param sampleId identify the current 'sample' (round call), usually the current cycle number.
     * @param timeout number in ms, to time limit the cb callback, it it exceeded a TimeoutError error will be raised.
     */
    asyncRoundCall(cb, args, sampleId, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promisedCallback = promise_land_1.PromiseLand.timerifyCallback(cb, args, true, {
                    timeout, errorCtor: sys_error_1.TimeoutError
                });
                const { start, duration } = yield promisedCallback;
                const timerReport = { start, duration, sampleMethodName: cb.name };
                return timerReport;
            }
            catch (error) {
                this.switchLock.unlock();
                if (error.hasOwnProperty('timeLimit')) {
                    throw error;
                }
                else {
                    throw new sys_error_1.RoundCallError(error, cb, args, sampleId, true);
                }
            }
        });
    }
    /**
     * @throws RoundCallError if any error raised from 'cb' callback, and the error is not of type TimeoutError.
     *
     * @param cb a sync callback timerify - measure execution time.
     * @param args argument array for cb.
     * @param sampleId identify the current 'sample' (round call), usually the current cycle number.
     */
    syncRoundCall(cb, args, sampleId) {
        try {
            const { start, duration } = promise_land_1.PromiseLand.timerifySync(cb, args);
            const timerReport = { start, duration, sampleMethodName: cb.name };
            return timerReport;
        }
        catch (error) {
            this.switchLock.unlock();
            throw new sys_error_1.RoundCallError(error, cb, args, sampleId, false);
        }
    }
}
class SampleTimer {
    constructor() {
        this.timer = new Timer();
        this.eventHandler = new events_1.EventEmitter();
    }
    on(event, listener) {
        this.eventHandler.on(event, listener);
    }
    independentRoundCall(methodRoundCall, genArgs, cycles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.horizontalRoundCall([methodRoundCall], genArgs, cycles);
        });
    }
    horizontalRoundCall(methodRoundCallArray, genArgs, cycles) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDurationArray = new Array(methodRoundCallArray.length).fill(0);
            const timerReportsMap = methodRoundCallArray
                .reduce((map, _, i) => { map[i] = []; return map; }, {});
            let roundCallError = false;
            try {
                const minArray = new Array(methodRoundCallArray.length).fill(Number.MAX_SAFE_INTEGER);
                const maxArray = new Array(methodRoundCallArray.length).fill(Number.MIN_SAFE_INTEGER);
                for (let cycle = 0; (cycle < cycles) && !roundCallError; cycle++) {
                    const usedArgs = genArgs();
                    for (let i = 0; (i < methodRoundCallArray.length) && !roundCallError; i++) {
                        const roundCall = methodRoundCallArray[i];
                        let report;
                        try {
                            report = yield this.timer.singleSample(roundCall.method, usedArgs, cycle, roundCall.data);
                        }
                        catch (error) {
                            this.eventHandler.emit('sampling-round-call-error', error);
                            roundCallError = true;
                            break;
                        }
                        timerReportsMap[i].push(report);
                        totalDurationArray[i] += report.duration;
                        if (report.duration < minArray[i]) {
                            minArray[i] = report.duration;
                        }
                        ;
                        if (report.duration > maxArray[i]) {
                            maxArray[i] = report.duration;
                        }
                        ;
                    }
                }
                if (!roundCallError) {
                    this.eventHandler.emit('sampling-process-success', { totalDurationArray, minArray, maxArray }, timerReportsMap);
                }
            }
            catch (error) {
                this.eventHandler.emit('sampling-process-error', error);
            }
        });
    }
    cleanupListeners() {
        if (this.eventHandler) {
            this.eventHandler.eventNames()
                .forEach(event => this.eventHandler.removeAllListeners(event));
        }
    }
}
exports.SampleTimer = SampleTimer;
//# sourceMappingURL=sample-timer.js.map