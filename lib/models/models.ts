import {MachineInfo} from './internal'

// #region - Benchmarker Task related

export type BenchmarkerTask = { 
    method: BenchmarkerMethod, 
    args: any[], 
    options: BenchmarkerTaskOptions 
};


export type BenchmarkerMethod 
    = ((done:(err?: any, res?: any)=>void, ...args: any[]) => any)
    | ((...args: any[]) => any);


export interface BenchmarkerTaskOptions {
    taskName: string, 
    context?: any,
    async? : boolean, 
    cycles: number, 
    ignore?: boolean
    argsGen?: () => any
}


export interface BenchmarkerTaskReport {
    durationAverage: number, 
    cycles: number, 
    taskName: string, 
    methodName: string, 
    async: boolean
}


// #endregion

// #region - Benchmarker Tasks Group related

export interface BenchmarkerTasksGroup {
    groupName?: string,
    groupDescription: string,
    tasks: BenchmarkerTask[],
    options? :BenchmarkerTasksGroupOptions,
}

export interface BenchmarkerTasksGroupReport {
    groupName: string,
    groupDescription: string,
    tasksReports: BenchmarkerTaskReport[], // sorted by duration
    machineInfo: MachineInfo
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


// #endregion


// export interface BenchmarkerFlags {
//     minfo: boolean;
//     printas?: 'json' | 'default';
// }

export interface BenchTiming {
    start: number,
    end?: number,
    duration: number,
}


// export interface MachineInfo {
//     cpusModel: string,
//     numberOfCpus: number,
//     osPlatform: string, 
//     osName: string, 
//     osCpuArch: string 
// };

