"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const benchmarker_1 = require("./internal/benchmarker");
const command_parser_1 = require("./internal/utils/command-parser");
const tasks_scanner_1 = require("./internal/tasks-scanner");
const sys_error_1 = require("./internal/sys-error");
const parser = new command_parser_1.CommandParser();
const relevantArgs = process.argv.splice(2);
parser.parseCommand(relevantArgs);
const suffix = relevantArgs[0];
if (!suffix) {
    throw new sys_error_1.MissingFileNamePatternError();
}
const flags = {
    minfo: parser.hasFlag('--minfo'),
    printas: parser.hasFlag('--json') ? 'json' : 'default'
};
tasks_scanner_1.tasksGroupImportScanner(suffix)
    .then((tasksGroups) => {
    if (tasksGroups.length > 0) {
        (new benchmarker_1.Benchmarker(flags).echo(tasksGroups));
    }
    else {
        // no benchmarker tasks was found.
        throw new sys_error_1.NoTasksDetectedError();
    }
})
    .catch((err) => {
    throw err;
});
//# sourceMappingURL=driver.js.map