
import { BenchmarkerTasksGroup, BenchmarkerTask, BenchmarkerTaskOptions, BenchmarkerTasksGroupOptions } from '../../models';
import * as joi from 'joi';

type IntelligentSchemeMap<T> = {[key in keyof T] : (joi.SchemaLike | joi.SchemaLike[]) }

export class ModelParser {

    private static benchmarkerTaskOptionsScheme: joi.ObjectSchema = joi.object().keys({
        taskName: joi.string().required(),
        cycles:  joi.number().integer().min(1).strict().required(),
        context: joi.any(),
        async: joi.boolean().strict(),
        ignore: joi.boolean().strict(),
        argsGen: joi.func(),
    } as IntelligentSchemeMap<BenchmarkerTaskOptions>);//.strict();
  
    private static benchmarkerTaskScheme: joi.ObjectSchema = joi.object().keys({
        method: joi.func().required(),
        args: joi.array(),
        options: ModelParser.benchmarkerTaskOptionsScheme.required()
    } as IntelligentSchemeMap<BenchmarkerTask>).or('args','options.argsGen');

    private static benchmarkerTasksGroupOptionsScheme = joi.object().keys({
        equalArgs: joi.boolean().strict(),
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
}

