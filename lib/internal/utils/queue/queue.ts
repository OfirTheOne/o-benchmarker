export class Queue<T> {

    private maxSize: number;
    private items: Array<T>;
    constructor(elements?: T[])
    constructor(maxSize?: number)
    constructor(elementOrMaxSize?: number | T[]) {
        if(typeof elementOrMaxSize == 'number') {
            this.maxSize = elementOrMaxSize || -1;
            this.items = new Array<T>();
        } else if(Array.isArray(elementOrMaxSize)) {
            this.items = new Array<T>(...elementOrMaxSize);
        } else if(arguments.length == 0) {
            this.maxSize = -1;
            this.items = new Array<T>()
        }
    }

    public isFull(): boolean { return this.items.length == this.maxSize; }

    public isEmpty(): boolean { return this.items.length == 0; }

    public add(element: T): boolean {
        if(!this.isFull()) {
            this.items.push(element);
            return true;
        } else {
            return false;
        }
    }

    public pull(): T {
        if(!this.isEmpty()) {
            const element = this.items.shift()
            return element;
        }
    }

    /**
     * @returns copy of the items array in the queue 
     */
    public toArray(): Array<T> { return this.items.splice(0); }

    public size() :number { return this.items.length; }

    public async iterate<R=any>(onPull: (pulledItem: T, iteration: number, lastResult:R) => Promise<R>, toPull: number, mutateQueue: boolean = true): Promise<R> {

        const _toPull = toPull > this.size() ? this.size() : toPull;
        let lastResult: R;
        for(let i = 0; i < _toPull; i++) {
            const item = mutateQueue ? this.pull() : this.items[i];
            lastResult = await onPull(item, 1, lastResult);
        }
        return lastResult;

    }
    public syncIterate<R=any>(onPull: (pulledItem: T, iteration: number, lastResult:R) => R, toPull: number, mutateQueue: boolean = true): R {
        const _toPull = toPull > this.size() ? this.size() : toPull;
        let lastResult: R;
        for(let i = 0; i < _toPull; i++) {
            const item = mutateQueue ? this.pull() : this.items[i];
            lastResult =  onPull(item, 1, lastResult);
        }
        return lastResult;
    }
}