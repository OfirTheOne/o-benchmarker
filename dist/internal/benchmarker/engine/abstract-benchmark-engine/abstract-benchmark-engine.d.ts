/// <reference types="node" />
import { EventEmitter } from 'events';
import { BenchmarkerTaskReport, BenchmarkerTasksGroupReport, BenchmarkerTasksGroup } from './../../../../models';
import { IBenchmarkEngine } from './../../models/i-benchmark-engine';
import { MachineInfo } from '../../../../models/internal';
export declare abstract class AbstractBenchmarkEngine implements IBenchmarkEngine {
    protected eventHandler: EventEmitter;
    protected machineInfo: MachineInfo;
    events: Readonly<{
        success: "benchmarking-group-success";
        error: "benchmarking-group-error";
    }>;
    constructor();
    on(event: "benchmarking-group-error", listener: (error: any) => void): any;
    on(event: "benchmarking-group-success", listener: (groupReport: BenchmarkerTasksGroupReport) => void): any;
    /**
     * @description
     * the engine entry point, start the benchmarking process.
     * */
    abstract measureGroup(tasksGroup: BenchmarkerTasksGroup): void;
    abstract cleanupListeners(): void;
}
export declare function createTaskReport(cycles: number, taskName: string, methodName: string, async: boolean, stats: {
    min: number;
    max: number;
}): BenchmarkerTaskReport;
export declare function createTasksGroupReport(groupName: string, groupDescription: string, tasksReports: BenchmarkerTaskReport[], machineInfo: MachineInfo): BenchmarkerTasksGroupReport;
