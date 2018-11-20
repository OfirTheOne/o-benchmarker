"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const util_1 = require("util");
const appRoot = require("app-root-path");
function tasksGroupImportScanner(suffixGlobPattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const tasksModulesFiles = getAllFilesWithSuffix(suffixGlobPattern);
        const tasksGroups = [];
        const modulesExport = [];
        for (let i = 0; i < tasksModulesFiles.length; i++) {
            const file = tasksModulesFiles[i];
            try {
                const moduleExport = yield Promise.resolve().then(() => require(appRoot.resolve(file)));
                modulesExport.push({ export: moduleExport, file });
            }
            catch (error) {
                throw new Error(`failed to import task module from ${file}`);
            }
        }
        modulesExport.forEach((_module) => {
            for (const key in (_module.export)) {
                if (_module.export.hasOwnProperty(key)) {
                    const exportField = _module.export[key];
                    if (gaurdBenchmarkTasksGroup(exportField)) {
                        tasksGroups.push(exportField);
                    }
                    // else {
                    //     throw new Error(`module ${_module.file} must export a BenchmarkTasksGroup type object.`);
                    // }
                }
            }
        });
        return tasksGroups;
    });
}
exports.tasksGroupImportScanner = tasksGroupImportScanner;
function gaurdBenchmarkTasksGroup(tasksGroup) {
    return tasksGroup.hasOwnProperty('groupDescription')
        && tasksGroup.hasOwnProperty('tasks')
        && Array.isArray(tasksGroup.tasks)
        && ((tasksGroup.tasks)
            .every((task) => gaurdBenchmarkTask(task)));
}
function gaurdBenchmarkTask(task) {
    return task.hasOwnProperty('method') && util_1.isFunction(task.method)
        && task.hasOwnProperty('args')
        && ((task.args && Array.isArray(task.args)) || task.args === undefined)
        && task.hasOwnProperty('options') && (typeof task.options === 'object')
        && gaurdBenchmarkOptions(task.options);
}
function gaurdBenchmarkOptions(options) {
    return options.hasOwnProperty('taskName') && (typeof options.taskName === 'string')
        && options.hasOwnProperty('cycles') && (typeof options.cycles === 'number')
        && (!options.hasOwnProperty('argsGen') ||
            (options.hasOwnProperty('argsGen') && util_1.isFunction(options.argsGen)));
}
function getAllFilesWithSuffix(suffix) {
    const fileList = glob.sync(suffix, { ignore: ['**/node_modules/**', 'node_modules/**'] });
    return fileList;
}
//# sourceMappingURL=index.js.map