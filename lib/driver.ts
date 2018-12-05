import { BenchmarkerFlags, IBenchmarkerFlags } from './models/internal';
import { Benchmarker } from './internal/benchmarker';
import { CommandParser } from './internal/utils/command-parser';

import { tasksGroupImportScanner } from "./internal/tasks-scanner";
import { NoTasksDetectedError, MissingFileNamePatternError } from './internal/sys-error'

const parser = new CommandParser(); 
const relevantArgs = process.argv.splice(2);
parser.parseCommand(relevantArgs);

const suffix = relevantArgs[0];
if(!suffix) {
    throw new MissingFileNamePatternError();
}

const flags: IBenchmarkerFlags = {
    minfo: parser.hasFlag('--minfo'),
    printas: parser.hasFlag('--json') ? 'json' : 'default'
};

tasksGroupImportScanner(suffix)
    .then((tasksGroups) => {
        if (tasksGroups.length > 0) {
            (new Benchmarker(flags).echo(tasksGroups));
        } else {
            // no benchmarker tasks was found.
            throw new NoTasksDetectedError(); 
        }
    })
    .catch((err) => {
        throw err
    });