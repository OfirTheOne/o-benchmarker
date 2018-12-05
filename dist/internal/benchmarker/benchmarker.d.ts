import { IBenchmarkEngine } from './models';
import { BenchmarkerTasksGroup } from './../../models';
import { IBenchmarkerFlags } from './../../models/internal';
export declare class Benchmarker {
    private engine;
    private flags;
    constructor(flags?: IBenchmarkerFlags);
    echo(tasksGroups: BenchmarkerTasksGroup[]): void;
    getEngine(): Readonly<IBenchmarkEngine>;
    private writeResult;
    private process;
}
