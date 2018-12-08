"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const abstract_benchmark_engine_1 = require("./../abstract-benchmark-engine");
// *********************************
/**
 * @deprecated
 *  at the moment this implementation dont support async benchmark.
 */
class BasicBenchmarkEngine extends abstract_benchmark_engine_1.AbstractBenchmarkEngine {
    constructor() {
        super();
    }
    // #region - public
    /**
     * @description
     * the engine entry point, start the benchmarking process.
     * */
    measureGroup(tasksGroup) {
        if (!tasksGroup) {
            return;
        }
        const { groupName, groupDescription } = tasksGroup;
        const groupOptions = tasksGroup.options || { equalArgs: false };
        const reports = this.processTasks(tasksGroup.tasks, groupOptions);
        reports.sort((a, b) => a.durationAverage - b.durationAverage);
        const groupReport = abstract_benchmark_engine_1.createTasksGroupReport(groupName, groupDescription, reports, this.machineInfo);
        this.eventHandler.emit(this.events.success, groupReport);
    }
    cleanupListeners() {
        if (this.eventHandler) {
            this.eventHandler.eventNames()
                .forEach(event => this.eventHandler.removeAllListeners(event));
        }
    }
    // #endregion
    // #region - private
    processTasks(tasks, groupOptions) {
        const totalDurationArray = groupOptions.equalArgs ?
            this.equalizeTasksMarking(tasks) : this.independentTasksMarking(tasks);
        const reports = tasks.map((task, i) => {
            const { method, options } = task;
            const cycles = groupOptions.equalArgs ? tasks[0].options.cycles : options.cycles;
            return (cycles <= 0) ?
                abstract_benchmark_engine_1.createTaskReport(0, cycles, options.taskName, method.name, options.async) :
                abstract_benchmark_engine_1.createTaskReport(totalDurationArray[i] / cycles, cycles, options.taskName, method.name, options.async);
        });
        return reports;
    }
    equalizeTasksMarking(tasks) {
        const totalDurationArray = new Array(tasks.length).fill(0);
        const options = tasks[0].options;
        const args = options.argsGen ? options.argsGen : (function () { return tasks[0].args; });
        const cycles = options.cycles;
        try {
            for (let cycle = 0; cycle < cycles; cycle++) {
                const usedArgs = args();
                tasks.forEach((task, index) => {
                    const markRange = this.cycleMark(task.method, usedArgs, cycle);
                    totalDurationArray[index] += markRange.duration;
                });
            }
        }
        catch (error) {
            // new Error('executing the targeted BenchMethod caused an error.')
            throw error;
        }
        return totalDurationArray;
    }
    independentTasksMarking(tasks) {
        const totalDurationArray = new Array(tasks.length).fill(0);
        try {
            tasks.forEach((task, index) => {
                const { method, options } = task;
                const args = options.argsGen ? options.argsGen : (function () { return task.args; });
                for (let cycle = 0; cycle < options.cycles; cycle++) {
                    const usedArgs = args();
                    const markRange = this.cycleMark(method, usedArgs, cycle);
                    totalDurationArray[index] += markRange.duration;
                }
            });
        }
        catch (error) {
            // new Error('executing the targeted BenchMethod caused an error.')
            throw error;
        }
        return totalDurationArray;
    }
    cycleMark(cb, args, cycle) {
        const startTime = perf_hooks_1.performance.now();
        cb(...args);
        const endTime = perf_hooks_1.performance.now();
        return { start: startTime, duration: (endTime - startTime) };
    }
}
exports.BasicBenchmarkEngine = BasicBenchmarkEngine;
//# sourceMappingURL=basic-benchmark-engine.js.map