"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const os = require("os");
const internal_1 = require("../../../../models/internal");
const EVENTS_NAMES = {
    success: "benchmarking-group-success",
    error: "benchmarking-group-error",
};
class AbstractBenchmarkEngine {
    constructor() {
        this.events = Object.freeze(EVENTS_NAMES);
        this.machineInfo = new internal_1.MachineInfo();
        this.eventHandler = new events_1.EventEmitter();
        process.on('exit', this.cleanupListeners);
    }
    on(event, listener) {
        this.eventHandler.on(event, listener);
    }
}
exports.AbstractBenchmarkEngine = AbstractBenchmarkEngine;
function createTaskReport(durationAverage, cycles, taskName, methodName, async) {
    return { durationAverage, cycles, taskName, methodName, async };
}
exports.createTaskReport = createTaskReport;
function createTasksGroupReport(groupName, groupDescription, tasksReports, machineInfo) {
    return { groupName, groupDescription, tasksReports, machineInfo };
}
exports.createTasksGroupReport = createTasksGroupReport;
function getMachineInfo() {
    const cpus = os.cpus();
    return {
        cpusModel: cpus[0].model,
        numberOfCpus: cpus.length,
        osPlatform: os.platform(),
        osName: os.type(),
        osCpuArch: os.arch() //x64
    };
}
//# sourceMappingURL=abstract-benchmark-engine.js.map