import { BenchmarkerFlags } from './models/models';
import { Benchmarker } from './benchmarker';
import { tasksGroupImportScanner } from "./tasks-scanner";

const ARGV = process.argv.splice(2);

const suffix = ARGV[0];
const _mInfo_flag = ~(ARGV.indexOf('minfo', 1));
const flags: BenchmarkerFlags = {
    minfo: !!_mInfo_flag
};

tasksGroupImportScanner(suffix)
    .then((tasksGroups) => {
        if (tasksGroups.length > 0) {
            (new Benchmarker(flags).echo(tasksGroups));
        } else {
            throw ('O-Benchmarker : No benchmarker tasks was found.')
        }
    });