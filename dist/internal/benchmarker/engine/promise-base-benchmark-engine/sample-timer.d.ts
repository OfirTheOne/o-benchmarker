import { SyncCallback, AsyncCallback } from './../../../utils/promise-land';
import { RoundCallError } from '../../../sys-error';
interface TimerReport {
    start: number;
    duration: number;
    sampleMethodName: string;
}
export declare class SampleTimer {
    private timer;
    private eventHandler;
    constructor();
    on(event: 'sampling-process-success', listener: (totalDurationArray: number[], timerReportsMap: {
        [key: number]: TimerReport[];
    }) => void): any;
    on(event: 'sampling-process-error', listener: (error: any) => void): any;
    on(event: 'sampling-round-call-error', listener: (roundCallError: RoundCallError) => void): any;
    independentSampling(methodData: {
        cb: (AsyncCallback | SyncCallback);
        async: boolean;
    }, genArgs: () => any, cycles: number): Promise<void>;
    horizontalSampling(methodsDataArray: {
        cb: (AsyncCallback | SyncCallback);
        async: boolean;
    }[], genArgs: () => any, cycles: number): Promise<void>;
    cleanupListeners(): void;
}
export {};
