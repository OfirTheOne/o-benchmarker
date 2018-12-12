export declare class Queue<T> {
    private maxSize;
    private items;
    constructor(elements?: T[]);
    constructor(maxSize?: number);
    isFull(): boolean;
    isEmpty(): boolean;
    add(element: T): boolean;
    pull(): T;
    /**
     * @returns copy of the items array in the queue
     */
    toArray(): Array<T>;
    size(): number;
    iterate<R = any>(onPull: (pulledItem: T, iteration: number, lastResult: R) => Promise<R>, toPull: number, mutateQueue?: boolean): Promise<R>;
    syncIterate<R = any>(onPull: (pulledItem: T, iteration: number, lastResult: R) => R, toPull: number, mutateQueue?: boolean): R;
}
