import { EventEmitter } from 'events';
import * as os from 'os';
import { BenchmarkerTaskReport, BenchmarkerTasksGroupReport, BenchmarkerTasksGroup } from './../../../../models';
import { IBenchmarkEngine, GROUP_SUCCESS, GROUP_ERROR } from './../../models/i-benchmark-engine';
import { MachineInfo } from '../../../../models/internal';

const EVENTS_NAMES = {
    success: "benchmarking-group-success" as GROUP_SUCCESS,
    error: "benchmarking-group-error" as GROUP_ERROR,
}


export abstract class AbstractBenchmarkEngine implements IBenchmarkEngine {
    protected eventHandler: EventEmitter;
    protected machineInfo: MachineInfo;
    public events = Object.freeze(EVENTS_NAMES);

    constructor() {
        this.machineInfo = new MachineInfo();
        this.eventHandler = new EventEmitter();
        process.on('exit', this.cleanupListeners);
    }

    public on(event: "benchmarking-group-error", listener: (error: any) => void);    
    public on(event: "benchmarking-group-success", listener: (groupReport: BenchmarkerTasksGroupReport) => void);
    public on(event: string, listener: (...args: any[]) => void) {
        this.eventHandler.on(event, listener);
    }

    /**
     * @description 
     * the engine entry point, start the benchmarking process.
     * */
    abstract measureGroup(tasksGroup: BenchmarkerTasksGroup): void;
    abstract cleanupListeners(): void;


}

export function createTaskReport(durationAverage: number, cycles: number, taskName: string, methodName: string, async: boolean): BenchmarkerTaskReport {
    return { durationAverage, cycles, taskName, methodName, async } as BenchmarkerTaskReport;
}
export function createTasksGroupReport(groupName: string, groupDescription: string, tasksReports: BenchmarkerTaskReport[], machineInfo: MachineInfo) {
    return { groupName, groupDescription, tasksReports, machineInfo } as BenchmarkerTasksGroupReport;
}
