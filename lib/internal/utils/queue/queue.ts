export class Queue<T> {

    private maxSize: number;
    private items: Array<T>;
    constructor(element?: T[])
    constructor(maxSize?: number)
    constructor(elementOrMaxSize?: number | T[]) {
        if(typeof elementOrMaxSize == 'number') {
            this.maxSize = elementOrMaxSize || -1;
            this.items = new Array<T>();
        } else if(Array.isArray(elementOrMaxSize)) {
            this.maxSize = -1;
            this.items = new Array<T>(...elementOrMaxSize);
        }
    }

    public isFull(): boolean {
        return this.items.length == this.maxSize;
    }

    public isEmpty(): boolean {
        return this.items.length == 0;
    }

    public add(element: T): boolean {
        if(!this.isFull()) {
            this.items.push(element);
            return true;
        } else {
            return false;
        }
    }

    public poll(): T {
        if(!this.isEmpty()) {
            const element = this.items[0];
            this.items = this.items.splice(1);
            return element;
        }
    }
}