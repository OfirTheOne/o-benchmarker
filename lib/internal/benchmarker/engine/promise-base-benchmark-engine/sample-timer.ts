import { EventEmitter } from 'events';
// import { performance } from 'perf_hooks';
import { generateId } from './../../../utils/common-untitled';
import { PromiseLand, SyncCallback, AsyncCallback } from './../../../utils/promise-land';
import { RoundCallError } from '../../../sys-error';


interface TimerReport {
    start: number; 
    duration: number;
    sampleMethodName: string
}

class Timer {
    private _id: Readonly<string>;
    private lockdown: boolean = false;
    constructor() {
        this._id = generateId();
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
            // const startTime = performance.now();
            const promisedCallback = PromiseLand.timerifyCallback(cb, args);
            const {start, end , duration} = await promisedCallback;
            // const endTime  = performance.now();
            const timerReport: TimerReport = { start, duration, sampleMethodName: cb.name };
            this.lockdown = false;
            return timerReport;
        } catch (error) {
            this.lockdown = false;
            throw new RoundCallError(error, cb, args, sampleId, true); //{ error, method: cb, args, sampleId, async: true } as TimerError;
        }
    }

    private syncRoundCall(cb: SyncCallback, args: any[], sampleId: (string | number)): TimerReport {
        try {
            // const startTime = performance.now();
            // cb(...args);
            // const endTime  = performance.now(); 
            const {start, end , duration} = PromiseLand.timerifySync(cb, args);
            const timerReport: TimerReport = { start, duration, sampleMethodName: cb.name };
            this.lockdown = false;
            return timerReport;
        } catch (error) {
            this.lockdown = false;
            throw new RoundCallError(error, cb, args, sampleId, false);
            // throw { error, method: cb, args, sampleId, async: false } as TimerError;
        }
    }
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


