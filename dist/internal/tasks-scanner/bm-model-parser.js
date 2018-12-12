"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
class ModelParser {
    static benchmarkerTasksGroupValidator(tasksGroup) {
        const result = joi.validate(tasksGroup, this.benchmarkerTasksGroupScheme);
        return (result.error == null);
    }
}
ModelParser.benchmarkerTaskOptionsScheme = joi.object().keys({
    taskName: joi.string().required(),
    cycles: joi.number().integer().min(1).strict().required(),
    context: joi.any(),
    async: joi.boolean().strict(),
    ignore: joi.boolean().strict(),
    argsGen: joi.func(),
}); //.strict();
ModelParser.benchmarkerTaskScheme = joi.object().keys({
    method: joi.func().required(),
    args: joi.array(),
    options: ModelParser.benchmarkerTaskOptionsScheme.required()
}).or('args', 'options.argsGen');
ModelParser.benchmarkerTasksGroupOptionsScheme = joi.object().keys({
    equalArgs: joi.boolean().strict(),
});
ModelParser.benchmarkerTasksGroupScheme = joi.object().keys({
    groupName: joi.string(),
    groupDescription: joi.string().required(),
    tasks: joi.array().items(ModelParser.benchmarkerTaskScheme).required(),
    options: ModelParser.benchmarkerTasksGroupOptionsScheme
});
exports.ModelParser = ModelParser;
//# sourceMappingURL=bm-model-parser.js.map