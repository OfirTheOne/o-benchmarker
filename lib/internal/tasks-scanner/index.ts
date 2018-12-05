
import { BenchmarkerTasksGroup } from '../../models';
import {ModelParser} from './bm-model-parser';

import {SeekAndImport} from '../utils/seek-and-import/seek-and-import';

export async function tasksGroupImportScanner(suffixGlobPattern: string): Promise <BenchmarkerTasksGroup[]> {
    const tasksGroups: BenchmarkerTasksGroup[] = [];
    const modulesExport = await SeekAndImport.importAll(suffixGlobPattern);

    modulesExport.forEach((_module) => {
            for (const key in (_module.exportObject)) {
                if (_module.exportObject.hasOwnProperty(key)) {
                    const exportField = _module.exportObject[key];
                    if(ModelParser.isBenchmarkerTasksGroup(exportField)) {
                        tasksGroups.push(exportField);
                    } 
                }
            }
        });
    return tasksGroups;
}

