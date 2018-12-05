import { BenchmarkerTasksGroup } from './../../../../models';
import { AbstractBenchmarkEngine } from './../abstract-benchmark-engine';
/**
 * @deprecated
 *  at the moment this implementation dont support async benchmark.
 */
export declare class BasicBenchmarkEngine extends AbstractBenchmarkEngine {
    constructor();
    /**
     * @description
     * the engine entry point, start the benchmarking process.
     * */
    measureGroup(tasksGroup: BenchmarkerTasksGroup): void;
    cleanupListeners(): void;
    private processTasks;
    private equalizeTasksMarking;
    private independentTasksMarking;
    private cycleMark;
}
