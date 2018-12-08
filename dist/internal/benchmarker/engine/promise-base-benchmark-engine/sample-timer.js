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
const events_1 = require("events");
const perf_hooks_1 = require("perf_hooks");
const common_untitled_1 = require("./../../../utils/common-untitled");
const promise_land_1 = require("./../../../utils/promise-land");
const sys_error_1 = require("../../../sys-error");
class Timer {
    constructor() {
        this.lockdown = false;
        this._id = common_untitled_1.generateId();
    }
    singleSample(cb, args, sampleId, async = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.lockdown) {
                return;
            }
            this.lockdown = true;
            let timerReport;
            if (async) {
                timerReport = yield this.asyncRoundCall(cb, args, sampleId);
            }
            else {
                timerReport = this.syncRoundCall(cb, args, sampleId);
            }
            return timerReport;
        });
    }
    asyncRoundCall(cb, args, sampleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promisedCallback = promise_land_1.PromiseLand.promisifyCallback(cb, args);
                const startTime = perf_hooks_1.performance.now();
                yield promisedCallback;
                const endTime = perf_hooks_1.performance.now();
                const timerReport = {
                    start: startTime,
                    duration: (endTime - startTime),
                    sampleMethodName: cb.name
                };
                this.lockdown = false;
                return timerReport;
            }
            catch (error) {
                this.lockdown = false;
                throw new sys_error_1.RoundCallError(error, cb, args, sampleId, true); //{ error, method: cb, args, sampleId, async: true } as TimerError;
            }
        });
    }
    syncRoundCall(cb, args, sampleId) {
        try {
            const startTime = perf_hooks_1.performance.now();
            cb(...args);
            const endTime = perf_hooks_1.performance.now();
            const timerReport = {
                start: startTime,
                duration: (endTime - startTime),
                sampleMethodName: cb.name
            };
            this.lockdown = false;
            return timerReport;
        }
        catch (error) {
            this.lockdown = false;
            throw new sys_error_1.RoundCallError(error, cb, args, sampleId, false);
            // throw { error, method: cb, args, sampleId, async: false } as TimerError;
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
    independentSampling(methodData, genArgs, cycles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.horizontalSampling([methodData], genArgs, cycles);
        });
    }
    horizontalSampling(methodsDataArray, genArgs, cycles) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDurationArray = new Array(methodsDataArray.length).fill(0);
            const timerReportsMap = methodsDataArray
                .reduce((map, _, i) => { map[i] = []; return map; }, {});
            let roundCallError = false;
            try {
                for (let cycle = 0; (cycle < cycles) && !roundCallError; cycle++) {
                    const usedArgs = genArgs();
                    for (let i = 0; (i < methodsDataArray.length) && !roundCallError; i++) {
                        const methodData = methodsDataArray[i];
                        let report;
                        try {
                            report = yield this.timer.singleSample(methodData.cb, usedArgs, cycle, methodData.async);
                        }
                        catch (error) {
                            this.eventHandler.emit('sampling-round-call-error', error);
                            roundCallError = true;
                            break;
                        }
                        timerReportsMap[i].push(report);
                        totalDurationArray[i] += report.duration;
                    }
                }
                if (!roundCallError) {
                    this.eventHandler.emit('sampling-process-success', totalDurationArray, timerReportsMap);
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