"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
const internal_1 = require("./../../models/internal");
const format_benchmark_report_1 = require("../format/format-benchmark-report");
const queue_1 = require("../utils/queue");
class Benchmarker {
    constructor(flags) {
        this.flags = new internal_1.BenchmarkerFlags(flags);
        this.engine = Object.freeze(new engine_1.PromiseBaseBenchmarkEngine());
    }
    // #region - public
    echo(tasksGroups) {
        this.process(tasksGroups, (res) => {
            this.writeResult(res);
        });
    }
    getEngine() {
        return this.engine;
    }
    // #endregion
    writeResult(groupReport) {
        if (this.flags.printas == 'json') {
            console.log(format_benchmark_report_1.StringifyBenchmarkerObjects.groupReportsAsJson(groupReport, { machineInfo: this.flags.minfo }));
        }
        else {
            console.log(format_benchmark_report_1.StringifyBenchmarkerObjects.formatGroupReports(groupReport, { machineInfo: this.flags.minfo }));
        }
        console.log("\x1b[0m"); // reset console style
    }
    process(tasksGroups, handler) {
        if (!tasksGroups) {
            return;
        }
        const groupsQueue = new queue_1.Queue(tasksGroups);
        let tasksGroup = groupsQueue.poll();
        this.engine.on(this.engine.events.success, (groupReport) => {
            handler(groupReport);
            tasksGroup = groupsQueue.poll();
            tasksGroup ? this.engine.measureGroup(tasksGroup) : 0;
        });
        this.engine.on(this.engine.events.error, (error) => {
            console.log(error);
            this.engine.cleanupListeners();
        });
        tasksGroup ? this.engine.measureGroup(tasksGroup) : 0;
    }
}
exports.Benchmarker = Benchmarker;
//# sourceMappingURL=benchmarker.js.map