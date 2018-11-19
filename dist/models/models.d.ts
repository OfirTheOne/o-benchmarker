export interface BenchmarkerTask {
    method: BenchMethod;
    args: any[];
    options: BenchmarkerOptions;
}
export interface BenchmarkerReport {
    durationAverge: number;
    cycles: number;
    taskName: string;
    methodName: string;
}
export interface BenchmarkerMeasureGroup {
    groupName?: string;
    groupDescription: string;
    tasks: BenchmarkerTask[];
}
export interface BenchmarkerMeasureGroupReport {
    groupName: string;
    groupDescription: string;
    tasksReports: BenchmarkerReport[];
    machineInfo: MachineInfo;
}
export interface BenchmarkerFlags {
    minfo: boolean;
}
export declare type BenchMethod = (...args: any[]) => any;
export interface BenchTiming {
    start: number;
    end?: number;
    duration: number;
}
export interface BenchmarkerOptions {
    taskName: string;
    cycles: number;
    argsGen?: () => any;
}
export interface MachineInfo {
    cpusModel: string;
    numberOfCpus: number;
    osPlatform: string;
    osName: string;
    osCpuArch: string;
}
