import { BenchmarkerFlags } from './models/models';
import { Benchmarker } from './benchmarker';
import { tasksGroupImportScanner } from "./tasks-scanner";

const relevantArgs = process.argv.splice(2);

const suffix = relevantArgs[0];
if(!suffix) {
    throw new Error('O-Benchmarker Error: first argumanet must contain a file name pattern.');
}

const _mInfo_flag = ~(relevantArgs.indexOf('minfo', 1));
const flags: BenchmarkerFlags = {
    minfo: !!_mInfo_flag
};

tasksGroupImportScanner(suffix)
    .then((tasksGroups) => {
        if (tasksGroups.length > 0) {
            (new Benchmarker(flags).echo(tasksGroups));
        } else {
            throw new Error('O-Benchmarker Error: No benchmarker tasks was found.')
        }
    })
    .catch((err) => {
        throw err
    });