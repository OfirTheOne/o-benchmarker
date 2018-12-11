export class SwitchLock {
    private _locked: boolean;
    constructor(initStatus: boolean = false) { this._locked = initStatus; }
    public isLocked() { return this._locked; }
    public lock() { this._locked = true; }
    public unlock() { this._locked = false; }
}