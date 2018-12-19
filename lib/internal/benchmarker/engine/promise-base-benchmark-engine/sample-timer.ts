import { SwitchLock } from './../../../utils/switch-lock/switch-lock';
import { EventEmitter } from 'events';
import { generateId } from './../../../utils/common-untitled';
import { PromiseLand, SyncCallback, AsyncCallback } from './../../../utils/promise-land';
import { RoundCallError, TimeoutError } from '../../../sys-error';


interface TimerReport {
    start: number; 
    duration: number;
    sampleMethodName: string
}

interface RoundCallData {
    async: boolean,
    timeout?: number,
}


class Timer {
    private _id: Readonly<string>;
    private switchLock = new SwitchLock();
    constructor() {
        this._id = generateId();
    }

    public async singleSample(cb: AsyncCallback | SyncCallback, args: any[], sampleId: (string | number), roundCallData: RoundCallData ){//async: boolean = false) {
        if (this.switchLock.isLocked()) { return; }
        this.switchLock.lock();
        let timerReport;
        if (roundCallData.async) {
            timerReport = await this.asyncRoundCall(cb, args, sampleId, roundCallData.timeout);
        } else {
            timerReport = this.syncRoundCall(cb, args, sampleId);
        }
        this.switchLock.unlock();
        return timerReport;
    }

    /**
     * @throws RoundCallError if any error raised from 'cb' callback, and the error is not of type TimeoutError.
     * @throws TimeoutError from timerifyCallback method, ('cb' callback was limit with timeout, and exceeded).
     * 
     * @param cb an async callback to promisify and timerify - wrap in a promise and measure execution time.
     * @param args argument array for cb.
     * @param sampleId identify the current 'sample' (round call), usually the current cycle number.
     * @param timeout number in ms, to time limit the cb callback, it it exceeded a TimeoutError error will be raised.
     */
    private async asyncRoundCall(cb: AsyncCallback, args: any[], sampleId: (string | number), timeout: number): Promise<TimerReport> {
        try {
            const promisedCallback = PromiseLand.timerifyCallback(cb, args, true, {
                timeout, errorCtor: TimeoutError
            });
            const {start, duration} = await promisedCallback;
            const timerReport: TimerReport = { start, duration, sampleMethodName: cb.name };
            return timerReport;
        } catch (error) {
            this.switchLock.unlock();
            if(error.hasOwnProperty('timeLimit')) {
                throw error;
            } else {
                throw new RoundCallError(error, cb, args, sampleId, true);
            }
        }
    }

    /**
     * @throws RoundCallError if any error raised from 'cb' callback, and the error is not of type TimeoutError.
     * 
     * @param cb a sync callback timerify - measure execution time.
     * @param args argument array for cb.
     * @param sampleId identify the current 'sample' (round call), usually the current cycle number.
     */
    private syncRoundCall(cb: SyncCallback, args: any[], sampleId: (string | number)): TimerReport {
        try {
            const {start, duration} = PromiseLand.timerifySync(cb, args);
            const timerReport: TimerReport = { start, duration, sampleMethodName: cb.name };
            return timerReport;
        } catch (error) {
            this.switchLock.unlock();
            throw new RoundCallError(error, cb, args, sampleId, false);
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

    public on(event: 'sampling-process-success', listener: (
        stats: { totalDurationArray: number[], minArray: number[], maxArray: number[] }, 
        timerReportsMap: {[key: number] : TimerReport[]}) => void);
    public on(event: 'sampling-process-error', listener: (error: any) => void);
    public on(event: 'sampling-round-call-error', listener: (roundCallError: RoundCallError | TimeoutError) => void);
    public on(event: string, listener: (...args: any[]) => void) {
        this.eventHandler.on(event, listener);
    }

    public async independentRoundCall(methodRoundCall: { method: (AsyncCallback | SyncCallback), data: RoundCallData }, genArgs:() => any, cycles: number) {
        await this.horizontalRoundCall([methodRoundCall], genArgs, cycles);
    }

    public async horizontalRoundCall(methodRoundCallArray: { method: (AsyncCallback | SyncCallback), data: RoundCallData }[], genArgs:() => any, cycles: number): Promise<void> {

        const totalDurationArray: number[] = new Array(methodRoundCallArray.length).fill(0);
        const timerReportsMap: {[key: number] : TimerReport[]} = methodRoundCallArray
            .reduce<{[key: number] : TimerReport[]}>((map ,_ , i) => { map[i] = []; return map; },{});
        
        let roundCallError = false;
        try {
            const minArray = new Array<number>(methodRoundCallArray.length).fill(Number.MAX_SAFE_INTEGER);
            const maxArray = new Array<number>(methodRoundCallArray.length).fill(Number.MIN_SAFE_INTEGER);
            
            for(let cycle = 0; (cycle < cycles) && !roundCallError; cycle++) {

                const usedArgs = genArgs();
                for(let i = 0; (i < methodRoundCallArray.length) && !roundCallError; i++) {
                    const roundCall = methodRoundCallArray[i];
                    let report: TimerReport;
                    try {
                        report = await this.timer.singleSample(roundCall.method, usedArgs, cycle, roundCall.data);
                    } catch (error) {
                        this.eventHandler.emit('sampling-round-call-error', error);
                        roundCallError = true;
                        break;
                    }
                    timerReportsMap[i].push(report)
                    totalDurationArray[i] += report.duration;
                    if(report.duration < minArray[i]) { minArray[i] = report.duration };
                    if(report.duration > maxArray[i]) { maxArray[i] = report.duration };  

                }
            }
            if(!roundCallError) {
                this.eventHandler.emit('sampling-process-success', 
                    { totalDurationArray, minArray, maxArray } , timerReportsMap
                );            
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


