import {EventEmitter} from 'events';

import { IBenchmarkEngine } from './models'
import { BenchmarkerTasksGroup, BenchmarkerTasksGroupReport } from './../../models';
import { BenchmarkerFlags, IBenchmarkerFlags } from './../../models/internal'

import { PromiseBaseBenchmarkEngine } from './engine';
import { StringifyBenchmarkerObjects as SBO } from '../format/format-benchmark-report';
import { Queue } from '../utils/queue';
import { SwitchLock } from './../utils/switch-lock';


type EngineProcessHandler = (
    err: {
        indexInQueue: number, 
        tasksGroup: BenchmarkerTasksGroup, 
        error: any 
    }, 
    res: {
        indexInQueue: number, 
        tasksGroup: BenchmarkerTasksGroup, 
        groupReport: BenchmarkerTasksGroupReport 
    })=>void;

export class Benchmarker {

    private engine: Readonly<IBenchmarkEngine>;
    private flags: BenchmarkerFlags;
    private eventHandler: EventEmitter;
    private switchLock = new SwitchLock(); // process

    constructor(flags?: IBenchmarkerFlags) {
        this.flags = new BenchmarkerFlags(flags);
        this.eventHandler = new EventEmitter();
        this.engine = Object.freeze(new PromiseBaseBenchmarkEngine());
    }

    public on(event: 'benchmarker-done', listener: (args: any) => void);
    public on(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void);
    public on(event: 'benchmarker-process-error', listener: (error: any) => void);
    public on(event: string, listener: (...args: any[]) => void) {
        this.eventHandler.on(event, listener);
    }
    public once(event: 'benchmarker-done', listener: (args: any) => void);
    public once(event: 'benchmarker-process-success', listener: (reportsQueue: Queue<BenchmarkerTasksGroupReport>) => void);
    public once(event: 'benchmarker-process-error', listener: (error: any) => void);
    public once(event: string, listener: (...args: any[]) => void) {
        this.eventHandler.once(event, listener);
    }


    // #region - public
    public echo(tasksGroups: BenchmarkerTasksGroup[]): void {
        this.process(tasksGroups, (err, res) => {
            if(err) {
                this.writeError(err);
            } else if(res) {
                this.writeResult(res.groupReport);
            }
        });
    }   
    public getEngine() {
        return this.engine;
    }
    public process(tasksGroups: BenchmarkerTasksGroup[], handler: EngineProcessHandler) {
        // preconditions
        if (this.switchLock.isLocked()) { return; }        
        if (!tasksGroups || tasksGroups.length == 0) { return; }
        
        // allowing the code bellow to run only when the queue is empty. 
        this.switchLock.lock(); 
        
        const filteredTasksGroups = this.filterIgnoredAndEmpty(tasksGroups);
        this.attachContext(filteredTasksGroups);
        
        const groupsQueue = new Queue<BenchmarkerTasksGroup>(filteredTasksGroups);
        const reportQueue = new Queue<BenchmarkerTasksGroupReport>();
        
        // if the filtered array is empty, emitting success with empty queue and unlocking.
        if (filteredTasksGroups.length == 0) { 
            this.eventHandler.emit('benchmarker-done', reportQueue);
            this.switchLock.unlock();
            return; 
        }
        
        let indexInQueue = 0;
        let tasksGroup = groupsQueue.pull();

        const nextInQueue =  () => {
            tasksGroup = groupsQueue.pull();
            indexInQueue++;
            if(tasksGroup) { // continue to the next tasksGroup in queue, in process.
                 this.engine.measureGroup(tasksGroup);
            } else { // the queue is empty, process finished.
                this.eventHandler.emit('benchmarker-done');
                this.switchLock.unlock();
            } 
        }

        this.engine.on(this.engine.events.success, (groupReport: BenchmarkerTasksGroupReport) => {
            reportQueue.add(groupReport);
            if(handler) { handler(undefined, {indexInQueue, tasksGroup, groupReport}); }
            this.eventHandler.emit('benchmarker-process-success', reportQueue);
            nextInQueue(); 
        });

        this.engine.on(this.engine.events.error, (error) => {
            if(handler) { handler({indexInQueue, tasksGroup, error}, undefined); }
            this.eventHandler.emit('benchmarker-process-error', error);
            nextInQueue();
        })
        
        this.engine.measureGroup(tasksGroup);

    } 
    // #endregion
   
    // #region

    private writeResult(groupReport: BenchmarkerTasksGroupReport) {
        if(this.flags.printas == 'json') {
            console.log(
                SBO.groupReportsAsJson(groupReport, { machineInfo: this.flags.minfo })
            );
        } else {
            console.log(
                SBO.formatGroupReports(groupReport, { machineInfo: this.flags.minfo })
            );
        }
        console.log("\x1b[0m"); // reset console style
    }

    private writeError(error: any) {
        console.error(error);
    }

    // dispatcher - step 1
    private filterIgnoredAndEmpty(tasksGroups: BenchmarkerTasksGroup[]) {
        for(let i = 0; i < tasksGroups.length; i++) {
            const tasksGroup = tasksGroups[i];       
            tasksGroup.tasks = tasksGroup.tasks.filter(task => !task.options.ignore);
        }
        return tasksGroups.filter((group => group.tasks.length > 0))
    }
    // dispatcher - step 2
    private attachContext(tasksGroups: BenchmarkerTasksGroup[]) {
        tasksGroups.forEach(group => {
            group.tasks.forEach(task => {
                const { method, options } = task;
                if(options.context !== undefined) {
                    const boundedMethod = (method as Function).bind(options.context);
                    task.method = boundedMethod;
                }
            })
        })
    }
    // #endregion
}
