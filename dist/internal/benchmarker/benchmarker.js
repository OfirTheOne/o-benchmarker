"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const internal_1 = require("./../../models/internal");
const engine_1 = require("./engine");
const format_benchmark_report_1 = require("../format/format-benchmark-report");
const queue_1 = require("../utils/queue");
const switch_lock_1 = require("./../utils/switch-lock");
class Benchmarker {
    constructor(flags) {
        this.switchLock = new switch_lock_1.SwitchLock(); // process
        this.flags = new internal_1.BenchmarkerFlags(flags);
        this.eventHandler = new events_1.EventEmitter();
        this.engine = Object.freeze(new engine_1.PromiseBaseBenchmarkEngine());
    }
    on(event, listener) {
        this.eventHandler.on(event, listener);
    }
    once(event, listener) {
        this.eventHandler.once(event, listener);
    }
    // #region - public
    echo(tasksGroups) {
        this.process(tasksGroups, (err, res) => {
            this.writeResult(res.groupReport);
        });
    }
    getEngine() {
        return this.engine;
    }
    process(tasksGroups, handler) {
        if (this.switchLock.isLocked()) {
            return;
        }
        if (!tasksGroups || tasksGroups.length == 0) {
            return;
        }
        // allowing the code bellow to run only when the queue is empty. 
        this.switchLock.lock();
        const filteredTasksGroups = this.filterIgnoredAndEmpty(tasksGroups);
        this.attachContext(filteredTasksGroups);
        const groupsQueue = new queue_1.Queue(filteredTasksGroups);
        const reportQueue = new queue_1.Queue();
        // if the filtered array is empty, emitting success and unlocking.
        if (filteredTasksGroups.length == 0) {
            this.eventHandler.emit('benchmarker-process-success', reportQueue);
            this.switchLock.unlock();
            return;
        }
        let indexInQueue = 0;
        let tasksGroup = groupsQueue.pull();
        this.engine.on(this.engine.events.success, (groupReport) => {
            reportQueue.add(groupReport);
            if (handler) {
                handler(undefined, { indexInQueue, tasksGroup, groupReport });
            }
            tasksGroup = groupsQueue.pull();
            indexInQueue++;
            if (tasksGroup) { // continue to the next tasksGroup in queue, in process.
                this.engine.measureGroup(tasksGroup);
            }
            else { // the queue is empty, process finished.
                this.eventHandler.emit('benchmarker-process-success', reportQueue);
                this.switchLock.unlock();
            }
        });
        this.engine.on(this.engine.events.error, (error) => {
            this.eventHandler.emit('benchmarker-process-error', error);
            handler(error, undefined);
            this.switchLock.unlock();
            this.engine.cleanupListeners();
        });
        this.engine.measureGroup(tasksGroup);
    }
    // #endregion
    // #region
    writeResult(groupReport) {
        if (this.flags.printas == 'json') {
            console.log(format_benchmark_report_1.StringifyBenchmarkerObjects.groupReportsAsJson(groupReport, { machineInfo: this.flags.minfo }));
        }
        else {
            console.log(format_benchmark_report_1.StringifyBenchmarkerObjects.formatGroupReports(groupReport, { machineInfo: this.flags.minfo }));
        }
        console.log("\x1b[0m"); // reset console style
    }
    filterIgnoredAndEmpty(tasksGroups) {
        for (let i = 0; i < tasksGroups.length; i++) {
            const tasksGroup = tasksGroups[i];
            tasksGroup.tasks = tasksGroup.tasks.filter(task => !task.options.ignore);
        }
        return tasksGroups.filter((group => group.tasks.length > 0));
    }
    attachContext(tasksGroups) {
        tasksGroups.forEach(group => {
            group.tasks.forEach(task => {
                const { method, options } = task;
                if (options.context !== undefined) {
                    const boundedMethod = method.bind(options.context);
                    task.method = boundedMethod;
                }
            });
        });
    }
}
exports.Benchmarker = Benchmarker;
//# sourceMappingURL=benchmarker.js.map