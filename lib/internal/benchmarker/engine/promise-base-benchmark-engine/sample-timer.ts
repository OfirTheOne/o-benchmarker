import { EventEmitter } from 'events';
import { PerformanceObserver, performance } from 'perf_hooks';
import * as crypto from 'crypto';
import { PromiseLand, SyncCallback, AsyncCallback } from './../../../utils/promise-land';
import { RoundCallError } from '../../../sys-error/index';


interface TimerReport {
    start: number; 
    duration: number;
    sampleMethodName: string
}

interface TimerError {
    error: any;
    method: AsyncCallback | SyncCallback; 
    args: any; 
    sampleId: number; 
    async: boolean;
}

class Timer {
    private _id: Readonly<string>;
    private lockdown: boolean = false;
    constructor() {
        this._id = Object.freeze(crypto.randomBytes(16).toString("hex"));
    }

    public async singleSample(cb: AsyncCallback | SyncCallback, args: any[], sampleId: (string | number), async: boolean = false) {
        if (this.lockdown) { return; }
        this.lockdown = true;
        let timerReport;
        if (async) {
            timerReport = await this.asyncRoundCall(cb, args, sampleId);
        } else {
            timerReport = this.syncRoundCall(cb, args, sampleId);
        }
        return timerReport;
    }

    private async asyncRoundCall(cb: AsyncCallback, args: any[], sampleId: (string | number)): Promise<TimerReport> {
        try {
            const promisedCallback = PromiseLand.promisifyCallback(cb, args);
            const startTime = performance.now(); //performance.mark(`start:${this._id}-${sampleId}`);
            await promisedCallback;
            const endTime  = performance.now();// performance.mark(`end:${this._id}-${sampleId}`);

            const timerReport: TimerReport = { 
                start: startTime, 
                duration: (endTime - startTime), 
                sampleMethodName: cb.name
            };
            // const timerReport = this.pollMeasureCreateReport(cb.name, sampleId)
            this.lockdown = false;
            return timerReport;
        } catch (error) {
            this.lockdown = false;
            throw new RoundCallError(error, cb, args, sampleId, true); //{ error, method: cb, args, sampleId, async: true } as TimerError;
        }
    }

    private syncRoundCall(cb: SyncCallback, args: any[], sampleId: (string | number)): TimerReport {
        try {
            // performance.mark(`start:${this._id}-${sampleId}`);
            const startTime = performance.now();
            cb(...args);
            const endTime  = performance.now(); // = performance.mark(`end:${this._id}-${sampleId}`);

            const timerReport: TimerReport = { 
                start: startTime, 
                duration: (endTime - startTime), 
                sampleMethodName: cb.name
            };
            // const sampleReport = this.pollMeasureCreateReport(cb.name, sampleId);
            this.lockdown = false;
            return timerReport;
        } catch (error) {
            this.lockdown = false;
            throw new RoundCallError(error, cb, args, sampleId, false);
            // throw { error, method: cb, args, sampleId, async: false } as TimerError;
        }
    }


    // private pollMeasureCreateReport(methodName: string, sampleId: string | number): TimerReport {
    //     performance.measure(
    //         `measure:${this._id}-${sampleId}`,
    //         `start:${this._id}-${sampleId}`,
    //         `end:${this._id}-${sampleId}`
    //     );
    //     const currentEntry = performance.getEntriesByName(`measure:${this._id}-${sampleId}`, 'measure')[0];
    //     performance.clearMeasures(); performance.clearMarks();
    //     const sampleReport: TimerReport = { 
    //         start: currentEntry.startTime, 
    //         duration: currentEntry.duration, 
    //         sampleMethodName: methodName
    //     };
    //     return sampleReport;
    // }
}


export class SampleTimer {
    private timer: Timer;
    private eventHandler: EventEmitter;

    constructor() {
        this.timer = new Timer();
        this.eventHandler = new EventEmitter();
    }

    public on(event: 'sampling-process-success', listener: (totalDurationArray: number[], timerReportsMap: {[key: number] : TimerReport[]}) => void);
    public on(event: 'sampling-process-error', listener: (error: any) => void);
    public on(event: 'sampling-round-call-error', listener: (roundCallError: RoundCallError) => void);

    public on(event: string, listener: (...args: any[]) => void) {
        this.eventHandler.on(event, listener);
    }

    public async independentSampling(methodData: { cb: (AsyncCallback | SyncCallback), async: boolean }, genArgs:() => any, cycles: number) {
        await this.horizontalSampling([methodData], genArgs, cycles);
    }

    public async horizontalSampling(methodsDataArray: { cb: (AsyncCallback | SyncCallback), async: boolean }[], genArgs:() => any, cycles: number): Promise<void> {

        const totalDurationArray: number[] = new Array(methodsDataArray.length).fill(0);
        const timerReportsMap: {[key: number] : TimerReport[]} = methodsDataArray
            .reduce<{[key: number] : TimerReport[]}>((map ,_ , i) => { map[i] = []; return map; },{});
        
        let roundCallError = false;
        try {
            for(let cycle = 0; (cycle < cycles) && !roundCallError; cycle++) {
                const usedArgs = genArgs();
                for(let i = 0; (i < methodsDataArray.length) && !roundCallError; i++) {
                    const methodData = methodsDataArray[i];
                    let report: TimerReport;
                    try {
                        report = await this.timer.singleSample(methodData.cb, usedArgs, cycle, methodData.async);
                    } catch (error) {
                        this.eventHandler.emit('sampling-round-call-error', error);
                        roundCallError = true;
                        break;
                    }
                    timerReportsMap[i].push(report)
                    totalDurationArray[i] += report.duration;
                }
            }
            if(!roundCallError) {
                this.eventHandler.emit('sampling-process-success', totalDurationArray, timerReportsMap);            
            }
        } catch (error) {
            this.eventHandler.emit('sampling-process-error', error);
        }
    }

    public cleanupListeners() {
        if(this.eventHandler) {
            this.eventHandler.eventNames()
                .forEach(event => this.eventHandler.removeAllListeners(event));
        }    
    }
}


