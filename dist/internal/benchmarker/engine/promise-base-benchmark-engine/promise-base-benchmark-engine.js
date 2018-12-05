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
        this.sampleTimer.on('sampling-process-success', (samplesDurationArray) => {
            if ( /* groupOptions.equalArgs && */samplesDurationArray.length > 1) { // tasks was equalized.
                // map contains all the tasks sampling duration.
                tasks.forEach((task, i) => {
                    const totalDuration = samplesDurationArray[i];
                    reports.push(taskToReport(task, tasks[0].options.cycles, totalDuration, task.options.async));
                });
            }
            else if ( /*!groupOptions.equalArgs && */samplesDurationArray.length == 1) { // tasks remained independent.
                const totalDuration = samplesDurationArray[0];
                reports.push(taskToReport(tasks[taskIndex], tasks[taskIndex].options.cycles, totalDuration, tasks[taskIndex].options.async));
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
        function taskToReport(task, usedCycles, totalDuration, async) {
            return abstract_benchmark_engine_1.createTaskReport((totalDuration / usedCycles), usedCycles, task.options.taskName, task.method.name, async);
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
            const methods = tasks.map((task) => {
                return { cb: task.method, async: !!task.options.async };
            });
            // console.log('methods', methods);
            this.sampleTimer.horizontalSampling(methods, usedArgsGen, usedCycles);
        }
        else {
            this.sampleTimer.independentSampling({ cb: tasks[taskIndex].method, async: !!(tasks[taskIndex].options.async) }, usedArgsGen, usedCycles);
        }
    }
    emitReports(tasksGroup, reports) {
        const { groupName, groupDescription } = tasksGroup;
        reports.sort((a, b) => a.durationAverage - b.durationAverage);
        const groupReport = abstract_benchmark_engine_1.createTasksGroupReport(groupName, groupDescription, reports, this.machineInfo);
        this.eventHandler.emit(this.events.success, groupReport);
    }
}
exports.PromiseBaseBenchmarkEngine = PromiseBaseBenchmarkEngine;
//# sourceMappingURL=promise-base-benchmark-engine.js.map