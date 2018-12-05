"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(elementOrMaxSize) {
        if (typeof elementOrMaxSize == 'number') {
            this.maxSize = elementOrMaxSize || -1;
            this.items = new Array();
        }
        else if (Array.isArray(elementOrMaxSize)) {
            this.maxSize = -1;
            this.items = new Array(...elementOrMaxSize);
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
    poll() {
        if (!this.isEmpty()) {
            const element = this.items[0];
            this.items = this.items.splice(1);
            return element;
        }
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map