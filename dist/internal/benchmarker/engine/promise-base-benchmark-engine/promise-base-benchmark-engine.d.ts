import { BenchmarkerTasksGroup } from './../../../../models';
import { AbstractBenchmarkEngine } from './../abstract-benchmark-engine';
export declare class PromiseBaseBenchmarkEngine extends AbstractBenchmarkEngine {
    private sampleTimer;
    constructor();
    measureGroup(tasksGroup: BenchmarkerTasksGroup): void;
    cleanupListeners(): void;
    private sample;
    private emitReports;
}
