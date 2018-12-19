import { SyncCallback, AsyncCallback } from './../../../utils/promise-land';
import { RoundCallError, TimeoutError } from '../../../sys-error';
interface TimerReport {
    start: number;
    duration: number;
    sampleMethodName: string;
}
interface RoundCallData {
    async: boolean;
    timeout?: number;
}
export declare class SampleTimer {
    private timer;
    private eventHandler;
    constructor();
    on(event: 'sampling-process-success', listener: (stats: {
        totalDurationArray: number[];
        minArray: number[];
        maxArray: number[];
    }, timerReportsMap: {
        [key: number]: TimerReport[];
    }) => void): any;
    on(event: 'sampling-process-error', listener: (error: any) => void): any;
    on(event: 'sampling-round-call-error', listener: (roundCallError: RoundCallError | TimeoutError) => void): any;
    independentRoundCall(methodRoundCall: {
        method: (AsyncCallback | SyncCallback);
        data: RoundCallData;
    }, genArgs: () => any, cycles: number): Promise<void>;
    horizontalRoundCall(methodRoundCallArray: {
        method: (AsyncCallback | SyncCallback);
        data: RoundCallData;
    }[], genArgs: () => any, cycles: number): Promise<void>;
    cleanupListeners(): void;
}
export {};
