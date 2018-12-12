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
    constructor(flags?: IBenchmarkerFlags);
    on(event: 'benchmarker-done', listener: (args: any) => void): any;
    on(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): any;
    on(event: 'benchmarker-process-error', listener: (error: any) => void): any;
    once(event: 'benchmarker-done', listener: (args: any) => void): any;
    once(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): any;
    once(event: 'benchmarker-process-error', listener: (error: any) => void): any;
    echo(tasksGroups: BenchmarkerTasksGroup[]): void;
    getEngine(): Readonly<IBenchmarkEngine>;
    process(tasksGroups: BenchmarkerTasksGroup[], handler: EngineProcessHandler): void;
    private writeResult;
    private writeError;
    private filterIgnoredAndEmpty;
    private attachContext;
}
export {};
