import { BenchmarkerMeasureGroup, BenchmarkerMeasureGroupReport, BenchmarkerFlags, BenchmarkerReport, BenchmarkerTask, BenchMethod, BenchmarkerOptions } from './models/models';
export declare class Benchmarker {
    private flags;
    private machineInfo;
    constructor(flags: BenchmarkerFlags);
    echo(tasksGroups: BenchmarkerMeasureGroup[]): void;
    measure(tasksGroup: BenchmarkerTask[]): BenchmarkerMeasureGroupReport;
    measure(tasksGroup: BenchmarkerMeasureGroup): BenchmarkerMeasureGroupReport;
    exec(method: BenchMethod, args: any[], options: BenchmarkerOptions): BenchmarkerReport;
    private sample;
    private mark;
}
