
import { BenchmarkerTasksGroup, BenchmarkerTask, BenchmarkerTaskOptions } from '../../models';
import { isFunction } from 'util';


export class ModelParser {
    
    public static isBenchmarkerTasksGroup(tasksGroup): tasksGroup is BenchmarkerTasksGroup {   
        return tasksGroup.hasOwnProperty('groupDescription')
            && (typeof tasksGroup.groupDescription === 'string')
            && (!(tasksGroup.hasOwnProperty('taskName') || typeof tasksGroup.taskName === 'string'))
            && tasksGroup.hasOwnProperty('tasks') && Array.isArray(tasksGroup.tasks) 
            && (((tasksGroup.tasks) as any[])
                .every((task) => this.isBenchmarkerTask(task)))
    }
    
    public static isBenchmarkerTask(task): task is BenchmarkerTask { 
        return task.hasOwnProperty('method') && isFunction(task.method)
            && (task.args === undefined || Array.isArray(task.args)) 
            && task.hasOwnProperty('options') && (typeof task.options === 'object')
            && this.isBenchmarkerTaskOptions(task.options, task.args !== undefined);
    }
    
    public static isBenchmarkerTaskOptions(options, asArgs: boolean): options is BenchmarkerTaskOptions { 
        return options.hasOwnProperty('taskName') && (typeof options.taskName === 'string')
            && options.hasOwnProperty('cycles') && (typeof options.cycles === 'number')
            && (asArgs || (options.hasOwnProperty('argsGen') && options.argsGen !== undefined ))
            && (!options.argsGen || isFunction(options.argsGen)); 
        
    }
    
}

