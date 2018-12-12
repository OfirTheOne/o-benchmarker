"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    isFull() { return this.items.length == this.maxSize; }
    isEmpty() { return this.items.length == 0; }
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
    toArray() { return this.items.splice(0); }
    size() { return this.items.length; }
    iterate(onPull, toPull, mutateQueue = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const _toPull = toPull > this.size() ? this.size() : toPull;
            let lastResult;
            for (let i = 0; i < _toPull; i++) {
                const item = mutateQueue ? this.pull() : this.items[i];
                lastResult = yield onPull(item, 1, lastResult);
            }
            return lastResult;
        });
    }
    syncIterate(onPull, toPull, mutateQueue = true) {
        const _toPull = toPull > this.size() ? this.size() : toPull;
        let lastResult;
        for (let i = 0; i < _toPull; i++) {
            const item = mutateQueue ? this.pull() : this.items[i];
            lastResult = onPull(item, 1, lastResult);
        }
        return lastResult;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map