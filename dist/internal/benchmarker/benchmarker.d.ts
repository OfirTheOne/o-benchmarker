import { IBenchmarkEngine } from './models';
import { BenchmarkerTasksGroup, BenchmarkerTasksGroupReport } from './../../models';
import { IBenchmarkerFlags } from './../../models/internal';
import { Queue } from '../utils/queue';
declare type EngineProcessHandler = (err: {
    indexInQueue: number;
    tasksGroup: BenchmarkerTasksGroup;
    error: any;
}, res: {
    indexInQueue: number;
    tasksGroup: BenchmarkerTasksGroup;
    groupReport: BenchmarkerTasksGroupReport;
}) => void;
export declare class Benchmarker {
    private engine;
    private flags;
    private eventHandler;
    private switchLock;
    private hooks;
    constructor(flags?: IBenchmarkerFlags);
    on(event: 'benchmarker-done', listener: (args: any) => void): any;
    on(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): any;
    on(event: 'benchmarker-process-error', listener: (error: any) => void): any;
    once(event: 'benchmarker-done', listener: (args: any) => void): any;
    once(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): any;
    once(event: 'benchmarker-process-error', listener: (error: any) => void): any;
    onDone(listener: (args?: any) => void): void;
    onSuccess(listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): void;
    onError(listener: (error: any) => void): void;
    onceDone(listener: (args?: any) => void): void;
    onceSuccess(listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): void;
    onceError(listener: (error: any) => void): void;
    echo(tasksGroups: BenchmarkerTasksGroup[]): void;
    getEngine(): Readonly<IBenchmarkEngine>;
    process(tasksGroups: BenchmarkerTasksGroup[], handler: EngineProcessHandler): void;
    private writeResult;
    private writeError;
    private filterIgnoredAndEmpty;
    private attachContext;
}
export {};
