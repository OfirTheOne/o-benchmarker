"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(elementOrMaxSize) {
        if (typeof elementOrMaxSize == 'number') {
            this.maxSize = elementOrMaxSize || -1;
            this.items = new Array();
        }
        else if (Array.isArray(elementOrMaxSize)) {
            this.items = new Array(...elementOrMaxSize);
        }
        else if (arguments.length == 0) {
            this.maxSize = -1;
            this.items = new Array();
        }
    }
    isFull() {
        return this.items.length == this.maxSize;
    }
    isEmpty() {
        return this.items.length == 0;
    }
    add(element) {
        if (!this.isFull()) {
            this.items.push(element);
            return true;
        }
        else {
            return false;
        }
    }
    pull() {
        if (!this.isEmpty()) {
            const element = this.items.shift();
            return element;
        }
    }
    /**
     * @returns copy of the items array in the queue
     */
    toArray() {
        return this.items.splice(0);
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map