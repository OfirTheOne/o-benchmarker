import { EventEmitter } from "events";

class HookBase {
    protected _handler: EventEmitter = new EventEmitter();
    protected _hooks: Array<string>;
    constructor() {}
    protected _on(hook: string, listener: (...args: any[]) => void) {
        if(~this._hooks.indexOf(hook)) { throw 'Misspell hook name !'; }
        this._handler.on(hook as string, listener);
    }
    protected _emit(hook: string, ...args: any[]) {
        this._handler.emit(hook as string, ...args);
    }
    protected static _createHookEnum<T extends string>(o: Array<T>): { [K in T]: K } {
        return o.reduce((res, key) => {
            res[key] = key;
            return res;
        }, Object.create(null));
    }
};


class HookHand extends HookBase {
    private hookEnum = HookHand._createHookEnum(['done', 'fail']);

    constructor() {
        super();
        this._hooks = Object.keys(this.hookEnum);
    }

    onFail(listener: (arr: Array<string>, num: number) => void) {
        this._on(this.hookEnum.fail, listener);
    }

    onDone(listener: (arr: Array<string>, num: number) => void) {
        this._on(this.hookEnum.done, listener);
    }

    

}