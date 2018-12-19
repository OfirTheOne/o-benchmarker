
/* common math */
export class CommonMath {
    public static min(list: number[]): number | undefined {
        if (!list || list.length == 0) { return; }
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i] < min) { min = list[i]; }
        }
        return min;
    }

    public static minOf(a: number, b: number, c: number): number;
    public static minOf(a: number, b: number): number;
    public static minOf(a: number, b: number, c?: number): number {
        let min = a;
        if (a > b) { min = b; }
        if (arguments.length == 3) {
            if (min > c) { min = c; }
        }
        return min;
    }

    public static max(list: number[]): number | undefined {
        if (!list || list.length == 0) { return; }
        let max = Number.MIN_SAFE_INTEGER;
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i] > max) { max = list[i]; }
        }
        return max;
    }

    public static maxOf(a: number, b: number, c: number): number;
    public static maxOf(a: number, b: number): number;
    public static maxOf(a: number, b: number, c?: number): number {
        let max = a;
        if (a < b) { max = b; }
        if (arguments.length == 3) {
            if (max < c) { max = c; }
        }
        return max;
    }

    public static toFixedNumber(num: number): number {
        return Number.parseFloat(num.toFixed(5));
    }

}

type Bucket = { low: number, high: number, count: number };
class Histogram {
    private static histogram(min: number, max: number, list: number[], bucketsAmount: number = 10): Array<Bucket> {
        bucketsAmount = bucketsAmount > list.length ? list.length : bucketsAmount;
        const bucketSize = CommonMath.toFixedNumber((max - min) / bucketsAmount);
        const buckets: Array<Bucket> = [];
        let lowBound = min;
        for (let i = 0; i < bucketsAmount; i++) {
            const highBound = CommonMath.toFixedNumber(lowBound + bucketSize);
            buckets.push({ low: lowBound, high: highBound, count: 0 });
            lowBound = highBound;
        }
        for (let i = list.length; i--; i >= 0) { this.insertToBucket(list[i], buckets); }
        return buckets;
    }
    private static insertToBucket(num: number, buckets: Array<Bucket>) {
        let insert = false;
        for (let i = 0; (i < buckets.length) && !insert; i++) {
            if (buckets[i].low <= num && num < buckets[i].high) {
                buckets[i].count++;
                insert = true;
            }
        }
        if (!insert && num == buckets[buckets.length - 1].high) {
            buckets[buckets.length - 1].count++;
            insert = true;
        }
        return insert;
    }
    public static produce(min: number, max: number, list: number[], bucketsAmount?: number): Array<Bucket> {
        if (max >= min) { return; }
        if (!list || list.length == 0) { return; }

        return Histogram.histogram(min, max, list, bucketsAmount);
    }
}

export class ContinuousStatsProducer {
    
    private itemsRecord: Array<number>

    private _lastItem: number;

    private _itemsCount: number
    private _min: number;
    private _max: number;
    private _sum: number;
    private _dec: number;
    private _inc: number;

    constructor() {
        this._itemsCount = 0;
        this._inc = 0;
        this._dec = 0

        this.itemsRecord = new Array<number>();
    }

    // #region - private 
    private evalItem(item: number) {
        this.evalMin(item);
        this.evalMax(item);
        this.evalSum(item);
        this.evalTrendCount(item);
    }
    private evalMin(num: number) {
        if (this._min != undefined) {
            if (this._min > num) {
                this._min = num;
            }
        } else {
            this._min = num;
        }
    }
    private evalMax(num: number) {
        if (this._max != undefined) {
            if (this._max < num) {
                this._max = num;
            }
        } else {
            this._max = num;
        }
    }
    private evalSum(num: number) {
        if (this._sum != undefined) {
            this._sum += num;
        } else {
            this._sum = num;
        }
    }
    private evalTrendCount(num: number) {
        if(this._lastItem < num) {
            this._dec = 0;
            this._inc++;
        } else if(this._lastItem > num) {
            this._inc = 0;
            this._dec++;
        }

    }
    // #endregion
    
    // #region - public     
    public add(item: number) {
        if (item != undefined) {
            this._itemsCount++;
            this.itemsRecord.push(item);
            if(this._lastItem == undefined) { this._lastItem = item; }
            this.evalItem(item);
            this._lastItem = item;
        }
    }

    public getItems() { return this.itemsRecord; }
    public produceMin() { return this._min; }
    public produceMax() { return this._max; }
    public produceSum() { return this._sum; }
    public produceTrendsCount() { return {dec: this._dec, inc: this._inc}; }
    public produceMean() { return this._sum / this._itemsCount; }
    public produceMid() { 
        if(this._itemsCount > 0) {
            const sorted = this.itemsRecord.sort();
            if(this._itemsCount % 2 != 0) {
                return sorted[(this._itemsCount) / 2];
            } else {
                return (sorted[(this._itemsCount - 1) / 2] + sorted[(this._itemsCount) / 2]) / 2;
            }
        } 
     }
    public produceHistogram() { return Histogram.produce(this._min, this._max, this.itemsRecord) }
    // #endregion
}


