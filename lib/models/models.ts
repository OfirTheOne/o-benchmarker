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
    /**
     * @description 
     *  in ms, will time limit the method with the provided value. 
     *  must be an integer value, larger then 0.
     *  will be ignored if async != true.
     */
    timeout?: number,
    cycles: number, 
    ignore?: boolean
    argsGen?: () => any
}


export interface DurationStats {
    average: number,
    min: number, 
    max: number,
    // median: number,
    // histogram: Array<any>,
}


export interface BenchmarkerTaskReport {
    stats: DurationStats,
    // config data
    cycles: number, 
    async: boolean
    taskName: string, 
    methodName: string, 
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

export interface BenchTiming {
    start: number,
    end?: number,
    duration: number,
}

