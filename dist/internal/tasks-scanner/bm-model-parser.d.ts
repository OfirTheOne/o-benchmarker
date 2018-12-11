import { BenchmarkerTasksGroup } from '../../models';
export declare class ModelParser {
    private static benchmarkerTaskOptionsScheme;
    private static benchmarkerTaskScheme;
    private static benchmarkerTasksGroupOptionsScheme;
    private static benchmarkerTasksGroupScheme;
    static benchmarkerTasksGroupValidator(tasksGroup: any): tasksGroup is BenchmarkerTasksGroup;
}
