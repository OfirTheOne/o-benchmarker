declare type DoneFn = (err?: any, args?: any) => void;
export declare type AsyncCallback = (done: DoneFn, ...args: any[]) => any;
export declare type SyncCallback = (...args: any[]) => any;
declare type FreeCallback = AsyncCallback | SyncCallback;
interface TimerifyOptions {
    timeout?: number;
    errorCtor?: new (timeout: number) => Error;
}
interface Timerify {
    start: number;
    end: number;
    duration: number;
    resolvedWith: any;
}
/**
 * @description
 *  This class serve one purpose, to covert an async or sync function to a promise. <br>
 *  If the *target* function is perform async action it must receive a 'done' callback as it first parameter, <br>
 *  and call the 'done' callback when the async action as ended, any error wished to be thrown from the promisified <br>
 *  *target* method should be passed to 'done' as the first argument, the object to be returned passed as the <br>
 *  second argument.
 * */
export declare class PromiseLand {
    private static createDoneFn;
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
    static promisifyCallback(cb: AsyncCallback, args: any[]): Promise<any>;
    static promisifyCallback(cb: SyncCallback, args: any[], cbAsync: false): Promise<any>;
    private static createTimerDoneFn;
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
    static timerifyCallback(cb: AsyncCallback, args: any[]): Promise<Timerify>;
    static timerifyCallback(cb: SyncCallback, args: any[], cbAsync: false): Promise<Timerify>;
    static timerifyCallback(cb: FreeCallback, args: any[], cbAsync: true, options?: TimerifyOptions): Promise<Timerify>;
    static timerifySync(cb: SyncCallback, args: any[]): Timerify;
}
export {};
