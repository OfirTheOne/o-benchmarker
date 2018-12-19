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
        this.switchLock = new switch_lock_1.SwitchLock();
        this.hooks = {
            done: 'benchmarker-done',
            success: 'benchmarker-process-success',
            error: 'benchmarker-process-error'
        };
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
    // #endregion
    // #region - hooks
    onDone(listener) { this.on('benchmarker-done', listener); }
    onSuccess(listener) { this.on('benchmarker-process-success', listener); }
    onError(listener) { this.on('benchmarker-process-error', listener); }
    onceDone(listener) { this.once('benchmarker-done', listener); }
    onceSuccess(listener) { this.once('benchmarker-process-success', listener); }
    onceError(listener) { this.once('benchmarker-process-error', listener); }
    // #endregion
    // #region - public
    echo(tasksGroups) {
        this.process(tasksGroups, (err, res) => {
            if (err) {
                this.writeError(err);
            }
            else if (res) {
                this.writeResult(res.groupReport);
            }
        });
    }
    getEngine() {
        return this.engine;
    }
    process(tasksGroups, handler) {
        // preconditions
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
        // if the filtered array is empty, emitting success with empty queue and unlocking.
        if (filteredTasksGroups.length == 0) {
            this.eventHandler.emit(this.hooks.done, reportQueue);
            this.switchLock.unlock();
            return;
        }
        let indexInQueue = 0;
        let tasksGroup = groupsQueue.pull();
        const nextInQueue = () => {
            tasksGroup = groupsQueue.pull();
            indexInQueue++;
            if (tasksGroup) { // continue to the next tasksGroup in queue, in process.
                this.engine.measureGroup(tasksGroup);
            }
            else { // the queue is empty, process finished.
                this.eventHandler.emit(this.hooks.done);
                this.switchLock.unlock();
            }
        };
        this.engine.on(this.engine.events.success, (groupReport) => {
            reportQueue.add(groupReport);
            if (handler) {
                handler(undefined, { indexInQueue, tasksGroup, groupReport });
            }
            this.eventHandler.emit(this.hooks.success, reportQueue);
            nextInQueue();
        });
        this.engine.on(this.engine.events.error, (error) => {
            if (handler) {
                handler({ indexInQueue, tasksGroup, error }, undefined);
            }
            this.eventHandler.emit('benchmarker-process-error', error);
            nextInQueue();
        });
        this.engine.measureGroup(tasksGroup);
    }
    // #endregion
    // #region - private
    writeResult(groupReport) {
        if (this.flags.printas == 'json') {
            console.log(format_benchmark_report_1.StringifyBenchmarkerObjects.groupReportsAsJson(groupReport, { machineInfo: this.flags.minfo }));
        }
        else {
            console.log(format_benchmark_report_1.StringifyBenchmarkerObjects.formatGroupReports(groupReport, { machineInfo: this.flags.minfo }));
        }
        console.log("\x1b[0m"); // reset console style
    }
    writeError(error) {
        console.error(error);
    }
    // dispatcher - step 1
    filterIgnoredAndEmpty(tasksGroups) {
        for (let i = 0; i < tasksGroups.length; i++) {
            const tasksGroup = tasksGroups[i];
            tasksGroup.tasks = tasksGroup.tasks.filter(task => !task.options.ignore);
        }
        return tasksGroups.filter((group => group.tasks.length > 0));
    }
    // dispatcher - step 2
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