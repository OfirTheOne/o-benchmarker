import { MachineInfo } from './internal';
export declare type BenchmarkerTask = {
    method: BenchmarkerMethod;
    args: any[];
    options: BenchmarkerTaskOptions;
};
export declare type BenchmarkerMethod = ((done: (err?: any, res?: any) => void, ...args: any[]) => any) | ((...args: any[]) => any);
export interface BenchmarkerTaskOptions {
    taskName: string;
    async?: boolean;
    cycles: number;
    argsGen?: () => any;
}
export interface BenchmarkerTaskReport {
    durationAverage: number;
    cycles: number;
    taskName: string;
    methodName: string;
    async: boolean;
}
export interface BenchmarkerTasksGroup {
    groupName?: string;
    groupDescription: string;
    tasks: BenchmarkerTask[];
    options?: BenchmarkerTasksGroupOptions;
}
export interface BenchmarkerTasksGroupReport {
    groupName: string;
    groupDescription: string;
    tasksReports: BenchmarkerTaskReport[];
    machineInfo: MachineInfo;
}
export interface BenchmarkerTasksGroupOptions {
    /**
     * @description
     * If true feed the arguments provided to the first task, to all the tasks in the group.<br>
     * The backlash of using it will cause the benchmarking to apply the number of cycles provided to the first task to the entire group
     * (ignore the other tasks cycles).
     * */
    equalArgs?: boolean;
}
export interface BenchTiming {
    start: number;
    end?: number;
    duration: number;
}
