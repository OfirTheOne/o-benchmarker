"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
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
function createTaskReport(cycles, taskName, methodName, async, stats) {
    return { cycles, taskName, methodName, async, stats };
}
exports.createTaskReport = createTaskReport;
function createTasksGroupReport(groupName, groupDescription, tasksReports, machineInfo) {
    return { groupName, groupDescription, tasksReports, machineInfo };
}
exports.createTasksGroupReport = createTasksGroupReport;
//# sourceMappingURL=abstract-benchmark-engine.js.map