
import { performance }  from 'perf_hooks';
import * as os from 'os';
import { 
    BenchmarkerMeasureGroup, BenchmarkerMeasureGroupReport,
    BenchmarkerFlags, BenchmarkerReport, BenchmarkerTask, 
    BenchMethod, BenchmarkerOptions, BenchTiming, MachineInfo,
} from './models/models';

import { formatMeasuredReports } from './format/format-benchmark-report';

export class Benchmarker {
    private machineInfo;

    constructor(private flags: BenchmarkerFlags) { this.machineInfo = getMachineInfo(); }

    // #region - public
    public echo(tasksGroups: BenchmarkerMeasureGroup[]): void {
        tasksGroups.forEach((tasksGroup) => {
            const measureGroupReport: BenchmarkerMeasureGroupReport = this.measure(tasksGroup);
            console.log(
                formatMeasuredReports(measureGroupReport, {
                    machineInfo: this.flags.minfo
                })
            );
        });
        console.log("\x1b[0m"); // reset console style
    }

    public measure(tasksGroup: BenchmarkerTask[]): BenchmarkerMeasureGroupReport;
    public measure(tasksGroup: BenchmarkerMeasureGroup): BenchmarkerMeasureGroupReport;
    public measure(tasksGroup: BenchmarkerTask[] | BenchmarkerMeasureGroup): BenchmarkerMeasureGroupReport {
        const reports: BenchmarkerReport[] = [];
        let tasks: BenchmarkerTask[], groupName: string, groupDescription: string;
        if(Array.isArray(tasksGroup)) {
            tasks = tasksGroup;
        } else {
            tasks = tasksGroup.tasks;
            groupName = tasksGroup.groupName;
            groupDescription = tasksGroup.groupDescription;
        }      
        for(let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const report = this.exec(task.method, task.args, task.options);
            reports.push(report);
        }
        reports.sort((a, b) => a.durationAverge - b.durationAverge);
        return { groupName, groupDescription, tasksReports: reports, machineInfo: this.machineInfo }
    }

    public exec(method: BenchMethod, args: any[], options: BenchmarkerOptions): BenchmarkerReport {
        const totalDuration = this.sample(method, args, options);
        const durationAverge = totalDuration / options.cycles;
        const report: BenchmarkerReport = {
            durationAverge,
            cycles: options.cycles,
            taskName: options.taskName,
            methodName: method.name,
        }
        return report;
    }
    // #endregion

    // #region - private
    private sample(method: BenchMethod, args: any[], options: BenchmarkerOptions): number {
        let markingTotalDuration = 0
        for(let cycle = 0; cycle < options.cycles; cycle++) {
            const usedArgs = options.argsGen ? options.argsGen() : args;
            const markRange = this.mark(method, usedArgs, cycle);
            markingTotalDuration += markRange.duration;
        } 
        return markingTotalDuration;
    }

    private mark(cb: BenchMethod, args: any[], cycle: number): BenchTiming {
        performance.mark(`start:${cycle}`);
        cb(...args);
        performance.mark(`end:${cycle}`);
        performance.measure(`measure:${cycle}`,`start:${cycle}`, `end:${cycle}`);
        const curretntEntry = performance.getEntriesByName(`measure:${cycle}`, 'measure')[0];
        performance.clearMeasures();performance.clearMarks();
        return {
            start: curretntEntry.startTime, 
            duration: curretntEntry.duration
        };
    }
    // #endregion
}

function getMachineInfo(): MachineInfo {
    const cpus = os.cpus();
    return {
        cpusModel: cpus[0].model, // Intel ...
        numberOfCpus: cpus.length, // 4
        osPlatform: os.platform(), // win32
        osName: os.type(), // Windows_NT
        osCpuArch: os.arch() //x64
    };
}
