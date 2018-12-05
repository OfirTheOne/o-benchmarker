import { BenchmarkerTasksGroupReport, BenchmarkerTasksGroup } from "../../../models";
export declare type GROUP_SUCCESS = "benchmarking-group-success";
export declare type GROUP_ERROR = "benchmarking-group-error";
export interface IBenchmarkEngine {
    events: {
        success: GROUP_SUCCESS;
        error: GROUP_ERROR;
    };
    on(event: GROUP_ERROR, listener: (...args: any[]) => void): any;
    on(event: GROUP_SUCCESS, listener: (groupReport: BenchmarkerTasksGroupReport) => void): any;
    on(event: string, listener: (...args: any[]) => void): any;
    measureGroup(tasksGroup: BenchmarkerTasksGroup): void;
    cleanupListeners(): void;
}
