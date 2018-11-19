"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const benchmarker_1 = require("./benchmarker");
const tasks_scanner_1 = require("./tasks-scanner");
const ARGV = process.argv.splice(2);
const suffix = ARGV[0];
const _mInfo_flag = ~(ARGV.indexOf('minfo', 1));
const flags = {
    minfo: !!_mInfo_flag
};
tasks_scanner_1.tasksGroupImportScanner(suffix)
    .then((tasksGroups) => {
    if (tasksGroups.length > 0) {
        (new benchmarker_1.Benchmarker(flags).echo(tasksGroups));
    }
    else {
        throw ('O-Benchmarker : No benchmarker tasks was found.');
    }
});
//# sourceMappingURL=driver.js.map