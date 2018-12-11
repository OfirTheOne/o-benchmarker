import { IBenchmarkEngine } from './models';
import { BenchmarkerTasksGroup, BenchmarkerTasksGroupReport } from './../../models';
import { IBenchmarkerFlags } from './../../models/internal';
import { Queue } from '../utils/queue';
export declare class Benchmarker {
    private engine;
    private flags;
    private eventHandler;
    private switchLock;
    constructor(flags?: IBenchmarkerFlags);
    on(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): any;
    on(event: 'benchmarker-process-error', listener: (error: any) => void): any;
    once(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void): any;
    once(event: 'benchmarker-process-error', listener: (error: any) => void): any;
    echo(tasksGroups: BenchmarkerTasksGroup[]): void;
    getEngine(): Readonly<IBenchmarkEngine>;
    process(tasksGroups: BenchmarkerTasksGroup[], handler: (err: any, res: {
        indexInQueue: number;
        tasksGroup: BenchmarkerTasksGroup;
        groupReport: BenchmarkerTasksGroupReport;
    }) => void): void;
    private writeResult;
    private filterIgnoredAndEmpty;
    private attachContext;
}
