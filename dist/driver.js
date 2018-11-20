"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const benchmarker_1 = require("./benchmarker");
const tasks_scanner_1 = require("./tasks-scanner");
const relevantArgs = process.argv.splice(2);
const suffix = relevantArgs[0];
if (!suffix) {
    throw new Error('O-Benchmarker Error: first argumanet must contain a file name pattern.');
}
const _mInfo_flag = ~(relevantArgs.indexOf('minfo', 1));
const flags = {
    minfo: !!_mInfo_flag
};
tasks_scanner_1.tasksGroupImportScanner(suffix)
    .then((tasksGroups) => {
    if (tasksGroups.length > 0) {
        (new benchmarker_1.Benchmarker(flags).echo(tasksGroups));
    }
    else {
        throw new Error('O-Benchmarker Error: No benchmarker tasks was found.');
    }
})
    .catch((err) => {
    throw err;
});
//# sourceMappingURL=driver.js.map