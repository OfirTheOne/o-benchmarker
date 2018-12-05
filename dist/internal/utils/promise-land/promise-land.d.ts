declare type DoneFn = (err?: any, args?: any) => void;
export declare type AsyncCallback = (done: DoneFn, ...args: any[]) => any;
export declare type SyncCallback = (...args: any[]) => any;
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
    static promisifyCallback(cb: AsyncCallback, args: any[]): Promise<any>;
    static promisifyCallback(cb: SyncCallback, args: any[], cbAsync: false): Promise<any>;
}
export {};
