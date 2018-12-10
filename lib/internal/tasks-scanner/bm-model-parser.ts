
import { BenchmarkerTasksGroup, BenchmarkerTask, BenchmarkerTaskOptions, BenchmarkerTasksGroupOptions } from '../../models';
import * as joi from 'joi';

type IntelligentSchemeMap<T> = {[key in keyof T] : (joi.SchemaLike | joi.SchemaLike[]) }

export class ModelParser {

    private static benchmarkerTaskOptionsScheme: joi.ObjectSchema = joi.object().keys({
        taskName: joi.string().required(),
        cycles:  joi.number().integer().min(1).required(),
        async: joi.boolean(),
        ignore: joi.boolean(),
        argsGen: joi.func(),
    } as IntelligentSchemeMap<BenchmarkerTaskOptions>);
  
    private static benchmarkerTaskScheme: joi.ObjectSchema = joi.object().keys({
        method: joi.func().required(),
        args: joi.array(),
        options: ModelParser.benchmarkerTaskOptionsScheme.required()
            .when('args', {
                is: joi.empty(),
                then: joi.object({ argsGen: joi.required() })
            })
        
    } as IntelligentSchemeMap<BenchmarkerTask>);

    private static benchmarkerTasksGroupOptionsScheme = joi.object().keys({
        equalArgs: joi.boolean(),
    } as IntelligentSchemeMap<BenchmarkerTasksGroupOptions>);

    private static benchmarkerTasksGroupScheme: joi.ObjectSchema = joi.object().keys({
        groupName: joi.string(),
        groupDescription: joi.string().required(),
        tasks: joi.array().items(ModelParser.benchmarkerTaskScheme).required(),
        options: ModelParser.benchmarkerTasksGroupOptionsScheme
    } as IntelligentSchemeMap<BenchmarkerTasksGroup>);

    
    public static benchmarkerTasksGroupValidator(tasksGroup): tasksGroup is BenchmarkerTasksGroup {
        const result = joi.validate(tasksGroup, this.benchmarkerTasksGroupScheme);
        return (result.error == null);
    }



/*
    public static isBenchmarkerTasksGroup(tasksGroup): tasksGroup is BenchmarkerTasksGroup {  
        return tasksGroup.hasOwnProperty('groupDescription')
            && (typeof tasksGroup.groupDescription === 'string')
            && (!(tasksGroup.hasOwnProperty('groupName') || typeof tasksGroup.groupName === 'string'))
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
*/
}

