import { BenchmarkerTasksGroupReport, BenchmarkerTasksGroup } from "../../../models";

export type GROUP_SUCCESS = "benchmarking-group-success";
export type GROUP_ERROR = "benchmarking-group-error";

export interface IBenchmarkEngine {
    events: { success: GROUP_SUCCESS, error: GROUP_ERROR };
    on(event: GROUP_ERROR, listener: (...args: any[]) => void);
    on(event: GROUP_SUCCESS, listener: (groupReport: BenchmarkerTasksGroupReport) => void)
    on(event: string, listener: (...args: any[]) => void);
    measureGroup(tasksGroup: BenchmarkerTasksGroup): void;
    cleanupListeners(): void;
}