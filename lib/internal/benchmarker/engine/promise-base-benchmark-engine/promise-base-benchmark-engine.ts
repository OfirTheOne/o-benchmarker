import { SampleTimer } from './sample-timer';
import { BenchmarkerTasksGroup, BenchmarkerTaskReport, BenchmarkerTask } from './../../../../models';
import { AbstractBenchmarkEngine, createTaskReport, createTasksGroupReport } from './../abstract-benchmark-engine';
export class PromiseBaseBenchmarkEngine extends AbstractBenchmarkEngine {

    private sampleTimer: SampleTimer; // = new SampleTimer();

    constructor() {
        super();
        this.sampleTimer = new SampleTimer();
    }

    // #region - public
    public measureGroup(tasksGroup: BenchmarkerTasksGroup): void {
        this.sampleTimer.cleanupListeners();
        if (!tasksGroup) { return; }
        const reports: BenchmarkerTaskReport[] = [];

        const groupOptions = tasksGroup.options || { equalArgs: false };
        const tasks = tasksGroup.tasks;
        let taskIndex = 0;

        this.sampleTimer.on('sampling-process-success', (samplesDurationArray) => {
            if (/* groupOptions.equalArgs && */ samplesDurationArray.length > 1) { // tasks was equalized.
                // map contains all the tasks sampling duration.
                tasks.forEach((task, i) => {
                    const totalDuration = samplesDurationArray[i];
                    reports.push(taskToReport(task, tasks[0].options.cycles, totalDuration, task.options.async));
                });

            } else if (/*!groupOptions.equalArgs && */ samplesDurationArray.length == 1) { // tasks remained independent.
                const totalDuration = samplesDurationArray[0]; 
                reports.push(taskToReport(tasks[taskIndex], tasks[taskIndex].options.cycles, totalDuration, tasks[taskIndex].options.async));
                taskIndex++;
                if (taskIndex < tasks.length) {
                    this.sample(tasks, taskIndex, groupOptions.equalArgs);
                }
            }

            if (reports.length == tasks.length) {
                this.emitReports(tasksGroup, reports);
                // need to unsubscribe this listener
            }
        });
        this.sampleTimer.on('sampling-process-error', (error) => {
            this.eventHandler.emit(this.events.error, error);
        });
        this.sampleTimer.on('sampling-round-call-error', (error) => {
            this.eventHandler.emit(this.events.error, error);
        });

        // trigger the first event to start th event loop.
        this.sample(tasks, taskIndex, groupOptions.equalArgs);

        function taskToReport(task: BenchmarkerTask, usedCycles: number, totalDuration: number, async: boolean) {
            return createTaskReport(
                (totalDuration / usedCycles), usedCycles, task.options.taskName, task.method.name, async
            );
        }
    }

    public cleanupListeners(): void {
        if(this.sampleTimer) {
            this.sampleTimer.cleanupListeners();
        } 
        if (this.eventHandler) {
            this.eventHandler.eventNames()
                .forEach(event => this.eventHandler.removeAllListeners(event));
        }
    }
    // #endregion

    // #region - private
    private sample(tasks: BenchmarkerTask[], taskIndex: number, equalArgs: boolean) {
        const usedCycles = tasks[equalArgs ? 0 : taskIndex].options.cycles;
        const usedArgsGen: () => any = equalArgs ?
            (tasks[0].options.argsGen || (function () { return tasks[0].args; })) :
            (tasks[taskIndex].options.argsGen || (function () { return tasks[taskIndex].args; }));

        if (equalArgs) {
            const methods = tasks.map((task) => {
                return { cb: task.method, async: !!task.options.async };
            });
            // console.log('methods', methods);
            this.sampleTimer.horizontalSampling(methods, usedArgsGen, usedCycles);
        } else {
            this.sampleTimer.independentSampling(
                { cb: tasks[taskIndex].method, async: !!(tasks[taskIndex].options.async) },
                usedArgsGen,
                usedCycles
            );
        }

    }

    private emitReports(tasksGroup, reports) {
        const { groupName, groupDescription } = tasksGroup;
        reports.sort((a, b) => a.durationAverage - b.durationAverage);
        const groupReport = createTasksGroupReport(groupName, groupDescription, reports, this.machineInfo);
        this.eventHandler.emit(this.events.success, groupReport)

    }
    // #endregion

}
