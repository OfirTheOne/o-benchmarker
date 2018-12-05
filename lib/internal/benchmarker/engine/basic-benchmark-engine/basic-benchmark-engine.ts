
import { performance } from 'perf_hooks';

import {
    BenchmarkerTasksGroup, BenchmarkerTasksGroupReport,
    BenchmarkerTaskReport, BenchmarkerTask, BenchmarkerMethod,
    BenchmarkerTasksGroupOptions, BenchTiming
} from './../../../../models';
import { AbstractBenchmarkEngine, createTaskReport, createTasksGroupReport } from './../abstract-benchmark-engine';


// *********************************

/** 
 * @deprecated
 *  at the moment this implementation dont support async benchmark.
 */
export class BasicBenchmarkEngine extends AbstractBenchmarkEngine {

    constructor() {
        super()
    }

    // #region - public
    /**
     * @description 
     * the engine entry point, start the benchmarking process.
     * */
    public measureGroup(tasksGroup: BenchmarkerTasksGroup): void {
        if (!tasksGroup) { return; }

        const { groupName, groupDescription } = tasksGroup;
        const groupOptions = tasksGroup.options || { equalArgs: false };
        const reports = this.processTasks(tasksGroup.tasks, groupOptions);

        reports.sort((a, b) => a.durationAverage - b.durationAverage);
        const groupReport = createTasksGroupReport(groupName, groupDescription, reports, this.machineInfo);

        this.eventHandler.emit(this.events.success, groupReport)
    }

    public cleanupListeners(): void {
        if (this.eventHandler) {
            this.eventHandler.eventNames()
                .forEach(event => this.eventHandler.removeAllListeners(event));
        }
    }
    // #endregion

    // #region - private
    private processTasks(tasks: BenchmarkerTask[], groupOptions: BenchmarkerTasksGroupOptions): BenchmarkerTaskReport[] {
        const totalDurationArray: number[] = groupOptions.equalArgs ?
            this.equalizeTasksMarking(tasks) : this.independentTasksMarking(tasks);


        const reports: BenchmarkerTaskReport[] = tasks.map((task, i) => {
            const { method, options } = task;
            const cycles = groupOptions.equalArgs ? tasks[0].options.cycles : options.cycles;
            return (cycles <= 0) ?
                createTaskReport(0, cycles, options.taskName, method.name, options.async) :
                createTaskReport(totalDurationArray[i] / cycles, cycles, options.taskName, method.name, options.async);
        })
        return reports;
    }

    private equalizeTasksMarking(tasks: BenchmarkerTask[]): number[] {
        const totalDurationArray = new Array(tasks.length).fill(0);
        const options = tasks[0].options;
        const args: () => any = options.argsGen ? options.argsGen : (function () { return tasks[0].args; });
        const cycles = options.cycles;
        try {
            for (let cycle = 0; cycle < cycles; cycle++) {
                const usedArgs = args();
                tasks.forEach((task, index) => {
                    const markRange = this.cycleMark(task.method, usedArgs, cycle);
                    totalDurationArray[index] += markRange.duration;
                });
            }
        } catch (error) {
            // new Error('executing the targeted BenchMethod caused an error.')
            throw error;
        }
        return totalDurationArray;
    }
    private independentTasksMarking(tasks: BenchmarkerTask[]): number[] {
        const totalDurationArray = new Array(tasks.length).fill(0);
        try {
            tasks.forEach((task, index) => {
                const { method, options } = task;
                const args: () => any = options.argsGen ? options.argsGen : (function () { return task.args; });
                for (let cycle = 0; cycle < options.cycles; cycle++) {
                    const usedArgs = args();
                    const markRange = this.cycleMark(method, usedArgs, cycle);
                    totalDurationArray[index] += markRange.duration;
                }
            });
        } catch (error) {
            // new Error('executing the targeted BenchMethod caused an error.')
            throw error;
        }
        return totalDurationArray;
    }
    private cycleMark(cb: BenchmarkerMethod, args: any[], cycle: number): BenchTiming {
        performance.mark(`start:${cycle}`);
        (cb as Function)(...args);
        performance.mark(`end:${cycle}`);
        performance.measure(`measure:${cycle}`, `start:${cycle}`, `end:${cycle}`);
        const currentEntry = performance.getEntriesByName(`measure:${cycle}`, 'measure')[0];
        performance.clearMeasures(); performance.clearMarks();
        return { start: currentEntry.startTime, duration: currentEntry.duration };
    }
    // #endregion
}
