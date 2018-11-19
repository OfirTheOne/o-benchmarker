"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const os = require("os");
const format_benchmark_report_1 = require("./format/format-benchmark-report");
class Benchmarker {
    constructor(flags) {
        this.flags = flags;
        this.machineInfo = getMachineInfo();
    }
    // #region - public
    echo(tasksGroups) {
        tasksGroups.forEach((tasksGroup) => {
            const measureGroupReport = this.measure(tasksGroup);
            console.log(format_benchmark_report_1.formatMeasuredReports(measureGroupReport, {
                machineInfo: this.flags.minfo
            }));
        });
        console.log("\x1b[0m"); // reset console style
    }
    measure(tasksGroup) {
        const reports = [];
        let tasks, groupName, groupDescription;
        if (Array.isArray(tasksGroup)) {
            tasks = tasksGroup;
        }
        else {
            tasks = tasksGroup.tasks;
            groupName = tasksGroup.groupName;
            groupDescription = tasksGroup.groupDescription;
        }
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const report = this.exec(task.method, task.args, task.options);
            reports.push(report);
        }
        reports.sort((a, b) => a.durationAverge - b.durationAverge);
        return { groupName, groupDescription, tasksReports: reports, machineInfo: this.machineInfo };
    }
    exec(method, args, options) {
        const totalDuration = this.sample(method, args, options);
        const durationAverge = totalDuration / options.cycles;
        const report = {
            durationAverge,
            cycles: options.cycles,
            taskName: options.taskName,
            methodName: method.name,
        };
        return report;
    }
    // #endregion
    // #region - private
    sample(method, args, options) {
        let markingTotalDuration = 0;
        for (let cycle = 0; cycle < options.cycles; cycle++) {
            const usedArgs = options.argsGen ? options.argsGen() : args;
            const markRange = this.mark(method, usedArgs, cycle);
            markingTotalDuration += markRange.duration;
        }
        return markingTotalDuration;
    }
    mark(cb, args, cycle) {
        perf_hooks_1.performance.mark(`start:${cycle}`);
        cb(...args);
        perf_hooks_1.performance.mark(`end:${cycle}`);
        perf_hooks_1.performance.measure(`measure:${cycle}`, `start:${cycle}`, `end:${cycle}`);
        const curretntEntry = perf_hooks_1.performance.getEntriesByName(`measure:${cycle}`, 'measure')[0];
        perf_hooks_1.performance.clearMeasures();
        perf_hooks_1.performance.clearMarks();
        return {
            start: curretntEntry.startTime,
            duration: curretntEntry.duration
        };
    }
}
exports.Benchmarker = Benchmarker;
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
//# sourceMappingURL=benchmarker.js.map