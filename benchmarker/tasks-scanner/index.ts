
import * as path from 'path';
import * as  glob  from 'glob';
import { BenchmarkerMeasureGroup, BenchmarkerTask, BenchmarkerOptions } from '../models';
import { isFunction } from 'util';

const pathToRoot = path.join(__dirname, '../../');

export async function tasksGroupImportScanner(suffixGlobPattern: string): Promise <BenchmarkerMeasureGroup[]> {
    const tasksModulesFiles = getAllFilesWithSuffix(suffixGlobPattern);
    const tasksGroups: BenchmarkerMeasureGroup[] = [];
    const modulesExport: {export: any, file: string}[] = [];

    for (let i = 0; i < tasksModulesFiles.length; i++) {
        const file = tasksModulesFiles[i];
        try {
            const moduleExport = await import(path.join(pathToRoot, file));
            modulesExport.push({ export: moduleExport, file});
        } catch (error) {
            console.log(`failed to import from ${file}`, error);
        }   
    }

    modulesExport.forEach((_module) => {
        try {
            for (const key in (_module.export)) {
                if (_module.export.hasOwnProperty(key)) {
                    const exportField = _module.export[key];
                    if(gaurdBenchmarkTasksGroup(exportField)) {
                        tasksGroups.push(exportField);
                    }
                }
            }
        } catch (error) {
            console.log(`module ${_module.file} must export a BenchmarkTasksGroup type object.`);                
        }
        
    })
    return tasksGroups;
}


function gaurdBenchmarkTasksGroup(tasksGroup): tasksGroup is BenchmarkerMeasureGroup {   
    return tasksGroup.hasOwnProperty('groupDescription')
        && tasksGroup.hasOwnProperty('tasks')
        && Array.isArray(tasksGroup.tasks) 
        && (((tasksGroup.tasks) as any[])
            .every((task) => gaurdBenchmarkTask(task)))
}

function gaurdBenchmarkTask(task): task is BenchmarkerTask { 
    return task.hasOwnProperty('method') && isFunction(task.method)
        && task.hasOwnProperty('args') 
        && ((task.args && Array.isArray(task.args)) || task.args === undefined) 
        && task.hasOwnProperty('options') && (typeof task.options === 'object')
        && gaurdBenchmarkOptions(task.options);
}

function gaurdBenchmarkOptions(options): options is BenchmarkerOptions { 
    return options.hasOwnProperty('taskName') && (typeof options.taskName === 'string')
        && options.hasOwnProperty('cycles') && (typeof options.cycles === 'number')
        && (!options.hasOwnProperty('argsGen')  ||
           (options.hasOwnProperty('argsGen') && isFunction(options.argsGen))); 
    
}

function getAllFilesWithSuffix(suffix: string): string[] {
    const fileList = glob.sync(suffix, {ignore: ['**/node_modules/**', 'node_modules/**']});
    return fileList;
}
