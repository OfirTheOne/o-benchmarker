import { MachineInfo } from './internal';
export declare type BenchmarkerTask = {
    method: BenchmarkerMethod;
    args: any[];
    options: BenchmarkerTaskOptions;
};
export declare type BenchmarkerMethod = ((done: (err?: any, res?: any) => void, ...args: any[]) => any) | ((...args: any[]) => any);
export interface BenchmarkerTaskOptions {
    taskName: string;
    context?: any;
    async?: boolean;
    /**
     * @description
     *  in ms, will time limit the method with the provided value.
     *  must be an integer value, larger then 0.
     *  will be ignored if async != true.
     */
    timeout?: number;
    cycles: number;
    ignore?: boolean;
    argsGen?: () => any;
}
export interface DurationStats {
    average: number;
    min: number;
    max: number;
}
export interface BenchmarkerTaskReport {
    stats: DurationStats;
    cycles: number;
    async: boolean;
    taskName: string;
    methodName: string;
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
