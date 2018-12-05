import { BenchmarkerTasksGroup, BenchmarkerTask, BenchmarkerTaskOptions } from '../../models';
export declare class ModelParser {
    static isBenchmarkerTasksGroup(tasksGroup: any): tasksGroup is BenchmarkerTasksGroup;
    static isBenchmarkerTask(task: any): task is BenchmarkerTask;
    static isBenchmarkerTaskOptions(options: any, asArgs: boolean): options is BenchmarkerTaskOptions;
}
