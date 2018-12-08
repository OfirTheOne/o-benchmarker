import {performance} from 'perf_hooks'; 

type ResolveCallback = (value?: any | PromiseLike<any>) => void;
type RejectCallback = (reason?: any) => void;
type DoneFn = (err?: any, args?: any) => void;
export type AsyncCallback = (done: DoneFn, ...args: any[]) => any;
export type SyncCallback = (...args: any[]) => any;
type FreeCallback = AsyncCallback | SyncCallback;

interface Timerify {start: number, end: number, duration: number, resolvedWith: any}

/**
 * @description
 *  This class serve one purpose, to covert an async or sync function to a promise. <br>
 *  If the *target* function is perform async action it must receive a 'done' callback as it first parameter, <br> 
 *  and call the 'done' callback when the async action as ended, any error wished to be thrown from the promisified <br>
 *  *target* method should be passed to 'done' as the first argument, the object to be returned passed as the <br>
 *  second argument.
 * */
export class PromiseLand {

    private static createDoneFn(resolve: ResolveCallback, reject: RejectCallback): DoneFn {
        let canRun = true;
        return function (err, args) {
            if (canRun) {
                canRun = false;
                if(err != undefined) {
                    reject(err)
                } else {
                    resolve(args);
                }
            }
        }
    }
    public static promisifyCallback(cb: AsyncCallback, args: any[]): Promise<any>
    public static promisifyCallback(cb: SyncCallback, args: any[], cbAsync: false): Promise<any>
    public static promisifyCallback(cb: FreeCallback, args: any[], cbAsync: boolean = true): Promise<any> {
        return (new Promise<any>(function (resolve, reject) {
            try {
                if(cbAsync) {
                    const done = PromiseLand.createDoneFn(resolve, reject);
                    (cb as AsyncCallback)(done, ...args);
                } else {
                    const result = (cb as SyncCallback)(...args);
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        }));
    }



    private static createTimerDoneFn(resolve: ResolveCallback, reject: RejectCallback): DoneFn {
        let canRun = true;
        const start = performance.now();
        return function (err, args) {
            if (canRun) {
                canRun = false;
                const end = performance.now();
                if(err != undefined) {
                    reject(err)
                } else {
                    resolve({start, end, duration: (end-start), resolvedWith: args});
                }
            }
        }
    }
    public static timerifyCallback(cb: AsyncCallback, args: any[]): Promise<Timerify>
    public static timerifyCallback(cb: SyncCallback, args: any[], cbAsync: false): Promise<Timerify>
    public static timerifyCallback(cb: FreeCallback, args: any[], cbAsync: boolean = true): Promise<Timerify> {
        return (new Promise<Timerify>(function (resolve, reject) {
            try {
                if(cbAsync) {
                    const done = PromiseLand.createTimerDoneFn(resolve, reject);
                    (cb as AsyncCallback)(done, ...args);
                } else {
                    const start = performance.now();
                    const result = (cb as SyncCallback)(...args);
                    const end = performance.now();
                    resolve({start, end, duration: (end-start), resolvedWith: result});
                }
            } catch (error) {
                reject(error);
            }
        }));
    }
}

