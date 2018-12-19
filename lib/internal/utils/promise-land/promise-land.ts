import {performance} from 'perf_hooks'; 

type ResolveCallback = (value?: any | PromiseLike<any>) => void;
type RejectCallback = (reason?: any) => void;
type DoneFn = (err?: any, args?: any) => void;
export type AsyncCallback = (done: DoneFn, ...args: any[]) => any;
export type SyncCallback = (...args: any[]) => any;
type FreeCallback = AsyncCallback | SyncCallback;

interface TimerifyOptions { timeout?: number, errorCtor?: new(timeout: number) => Error }

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

    // ================

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
    /**
     * @description This method uses PromiseConstructor internally, there for 'cb' callback runs 
     * automatically 
     * 
     * @param cb The callback to wrap in a Promise. 
     * If it 'AsyncCallback' it must call 'done' method to be resolved.
     * If it 'SyncCallback' there are no spacial requests.
     * @param args The arguments array to provide to 'cb', it will be spread (... args).
     * if 'cb' is of 'AsyncCallback' type, first argument will be 'done' callback.
     */
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

    // ================

    private static createTimerDoneFn(resolve: ResolveCallback, reject: RejectCallback, options: TimerifyOptions): DoneFn {
        let canRun = true
        const start = performance.now();
        let clock: NodeJS.Timeout; 
        if(options.timeout && options.timeout > 0) {
            clock = setTimeout(() => {
                canRun = false;
                clearTimeout(clock);
                clock = undefined;
                const err = options.errorCtor ? 
                    new (options.errorCtor)(options.timeout) : new Error('timeout excited !');
                reject(err);
            }, options.timeout)
        }
        return function (err, args) {
            if(canRun) {
                canRun = false;
                if (clock) { clearTimeout(clock); }
                const end = performance.now();
                if(err != undefined) {
                    reject(err)
                } else {
                    resolve({start, end, duration: (end-start), resolvedWith: args});
                }
            }
        }
    }

    /**
     * @description 
     * this method uses PromiseConstructor internally, there for 'cb' callback runs automatically.
     * creat timestamp just before 'cb' start, and what it finished (but before it resolved).
     * @param cb the callback to wrap in a Promise. 
     * If it 'AsyncCallback' it must call 'done' method to be resolved.
     * If it 'SyncCallback' there are no spacial requests .
     * @param args the arguments array to provide to 'cb', it will be spread (... args).
     * if 'cb' is of 'AsyncCallback' type, first argument will be 'done' callback.
     */
    public static timerifyCallback(cb: AsyncCallback, args: any[]): Promise<Timerify>
    public static timerifyCallback(cb: SyncCallback, args: any[], cbAsync: false): Promise<Timerify>
    public static timerifyCallback(cb: FreeCallback, args: any[], cbAsync: true, options?: TimerifyOptions): Promise<Timerify> 
    public static timerifyCallback(cb: FreeCallback, args: any[], cbAsync: boolean = true, options: TimerifyOptions = {} ): Promise<Timerify> {
        return (new Promise<Timerify>(function (resolve, reject) {
            try {
                if(cbAsync) {
                    const done = PromiseLand.createTimerDoneFn(resolve, reject, options);
                    (cb as AsyncCallback)(done, ...args);
                } else {
                    const res = PromiseLand.timerifySync(cb, args);
                    resolve(res);
                }
            } catch (error) {
                reject(error);
            }
        }));
    }
    
    // ================

    public static timerifySync(cb: SyncCallback, args: any[]): Timerify {
        if(typeof cb !== 'function') { return; } 
        const start = performance.now();
        const result = (cb as SyncCallback)(...args);  
        const end = performance.now();
        
        return {start, end, duration: (end-start), resolvedWith: result}
    }
}

