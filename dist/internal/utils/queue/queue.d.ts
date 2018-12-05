export declare class Queue<T> {
    private maxSize;
    private items;
    constructor(element?: T[]);
    constructor(maxSize?: number);
    isFull(): boolean;
    isEmpty(): boolean;
    add(element: T): boolean;
    poll(): T;
}
