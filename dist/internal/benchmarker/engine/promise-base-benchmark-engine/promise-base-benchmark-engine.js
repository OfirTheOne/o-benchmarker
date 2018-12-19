"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sample_timer_1 = require("./sample-timer");
const abstract_benchmark_engine_1 = require("./../abstract-benchmark-engine");
class PromiseBaseBenchmarkEngine extends abstract_benchmark_engine_1.AbstractBenchmarkEngine {
    constructor() {
        super();
        this.sampleTimer = new sample_timer_1.SampleTimer();
    }
    // #region - public
    measureGroup(tasksGroup) {
        this.sampleTimer.cleanupListeners();
        if (!tasksGroup) {
            return;
        }
        const reports = [];
        const groupOptions = tasksGroup.options || { equalArgs: false };
        const tasks = tasksGroup.tasks;
        let taskIndex = 0;
        this.sampleTimer.on('sampling-process-success', (stats) => {
            const { totalDurationArray, minArray, maxArray } = stats;
            if (totalDurationArray.length > 1) { // tasks was equalized.
                // map contains all the tasks sampling duration.
                tasks.forEach((task, i) => {
                    const totalDuration = totalDurationArray[i], min = minArray[i], max = maxArray[i];
                    const average = totalDuration / tasks[0].options.cycles;
                    reports.push(taskToReport(task, tasks[0].options.cycles, task.options.async, { average, min, max }));
                });
            }
            else if (totalDurationArray.length == 1) { // tasks remained independent.
                const totalDuration = totalDurationArray[0], min = minArray[0], max = maxArray[0];
                const average = totalDuration / tasks[taskIndex].options.cycles;
                reports.push(taskToReport(tasks[taskIndex], tasks[taskIndex].options.cycles, tasks[taskIndex].options.async, { average, min, max }));
                taskIndex++;
                if (taskIndex < tasks.length) {
                    this.sample(tasks, taskIndex, groupOptions.equalArgs);
                }
            }
            if (reports.length == tasks.length) {
                this.emitReports(tasksGroup, reports);
                // need to unsubscribe this listener
            }
        });
        this.sampleTimer.on('sampling-process-error', (error) => {
            this.eventHandler.emit(this.events.error, error);
        });
        this.sampleTimer.on('sampling-round-call-error', (error) => {
            this.eventHandler.emit(this.events.error, error);
        });
        // trigger the first event to start th event loop.
        this.sample(tasks, taskIndex, groupOptions.equalArgs);
        function taskToReport(task, usedCycles, async, stats) {
            return abstract_benchmark_engine_1.createTaskReport(usedCycles, task.options.taskName, task.method.name, async, stats);
        }
    }
    cleanupListeners() {
        if (this.sampleTimer) {
            this.sampleTimer.cleanupListeners();
        }
        if (this.eventHandler) {
            this.eventHandler.eventNames()
                .forEach(event => this.eventHandler.removeAllListeners(event));
        }
    }
    // #endregion
    // #region - private
    sample(tasks, taskIndex, equalArgs) {
        const usedCycles = tasks[equalArgs ? 0 : taskIndex].options.cycles;
        const usedArgsGen = equalArgs ?
            (tasks[0].options.argsGen || (function () { return tasks[0].args; })) :
            (tasks[taskIndex].options.argsGen || (function () { return tasks[taskIndex].args; }));
        if (equalArgs) {
            const roundCallMethods = tasks.map((task) => {
                return { method: task.method, data: {
                        async: !!task.options.async,
                        timeout: task.options.timeout
                    } };
            });
            this.sampleTimer.horizontalRoundCall(roundCallMethods, usedArgsGen, usedCycles);
        }
        else {
            this.sampleTimer.independentRoundCall({
                method: tasks[taskIndex].method,
                data: {
                    async: !!(tasks[taskIndex].options.async),
                    timeout: tasks[taskIndex].options.timeout
                }
            }, usedArgsGen, usedCycles);
        }
    }
    emitReports(tasksGroup, reports) {
        const { groupName, groupDescription } = tasksGroup;
        reports.sort((a, b) => a.stats.average - b.stats.average);
        const groupReport = abstract_benchmark_engine_1.createTasksGroupReport(groupName, groupDescription, reports, this.machineInfo);
        this.eventHandler.emit(this.events.success, groupReport);
    }
}
exports.PromiseBaseBenchmarkEngine = PromiseBaseBenchmarkEngine;
//# sourceMappingURL=promise-base-benchmark-engine.js.map