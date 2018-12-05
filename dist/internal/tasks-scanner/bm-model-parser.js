"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class ModelParser {
    static isBenchmarkerTasksGroup(tasksGroup) {
        return tasksGroup.hasOwnProperty('groupDescription')
            && (typeof tasksGroup.groupDescription === 'string')
            && (!(tasksGroup.hasOwnProperty('taskName') || typeof tasksGroup.taskName === 'string'))
            && tasksGroup.hasOwnProperty('tasks') && Array.isArray(tasksGroup.tasks)
            && ((tasksGroup.tasks)
                .every((task) => this.isBenchmarkerTask(task)));
    }
    static isBenchmarkerTask(task) {
        return task.hasOwnProperty('method') && util_1.isFunction(task.method)
            && (task.args === undefined || Array.isArray(task.args))
            && task.hasOwnProperty('options') && (typeof task.options === 'object')
            && this.isBenchmarkerTaskOptions(task.options, task.args !== undefined);
    }
    static isBenchmarkerTaskOptions(options, asArgs) {
        return options.hasOwnProperty('taskName') && (typeof options.taskName === 'string')
            && options.hasOwnProperty('cycles') && (typeof options.cycles === 'number')
            && (asArgs || (options.hasOwnProperty('argsGen') && options.argsGen !== undefined))
            && (!options.argsGen || util_1.isFunction(options.argsGen));
    }
}
exports.ModelParser = ModelParser;
//# sourceMappingURL=bm-model-parser.js.map