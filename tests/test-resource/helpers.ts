
export function randomArray(size = 10000) {
    const arr = [];
    for(let i = 0; i < size; i++) {
        const num = Math.floor(Math.random() * size);
        arr.push(num);
    }
    return arr;
}

export function recursiveDeepClone(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj) {
        return obj;
    }
    let temp;
    if (obj instanceof Date) {
        temp = obj.constructor(); //or new Date(obj);
    } else {
        temp = obj.constructor();
    }

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = recursiveDeepClone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}


export function minOfArray(array: Array<number>): number;
export function minOfArray<T>(array: Array<T>, numericSelector: (item: T) => number): T;
export function minOfArray<T>(array: Array<T>, numericSelector?: (item: T | number) => number ): T | number {
    if(numberArrayGourd(array)) {
        let min = array[0];
        for(let i = 1; i < array.length; i++ ) {             
            if(min > array[i]) {
                min = array[i];
            }   
        }
        return min;
    } else { 
        let minItem = array[0], minValue = numericSelector(array[0]);
        for(let i = 1; i < array.length; i++ ) {  
            let curValue = numericSelector(array[i]);
            if(minValue > curValue) {
                minValue = curValue;
                minItem = array[i];
            }   
        }
        return minItem;
    }     
}


export function maxOfArray(array: Array<number>): number;
export function maxOfArray<T>(array: Array<T>, numericSelector: (item: T) => number): T;
export function maxOfArray<T>(array: Array<T>, numericSelector?: (item: T | number) => number ): T | number {
    if(numberArrayGourd(array)) {
        let max = array[0];
        for(let i = 1; i < array.length; i++ ) {             
            if(max < array[i]) {
                max = array[i];
            }   
        }
        return max;
    } else { 
        let maxItem = array[0], maxValue = numericSelector(array[0]);
        for(let i = 1; i < array.length; i++ ) {  
            let curValue = numericSelector(array[i]);
            if(maxValue < curValue) {
                maxValue = curValue;
                maxItem = array[i];
            }   
        }
        return maxItem;
    }     
}

export function minOfCollection<T>(collection: IterableIterator<T>, numericSelector: (item: T) => number ): IteratorResult<T|number> {
        let minItem: IteratorResult<T> = collection.next();
        let minValue = numericSelector(minItem.value)
        let item: IteratorResult<T>;
        while((item = collection.next()).value != undefined) {            
            const curValue = numericSelector(item.value);
            if(minValue > curValue) {
                minValue = curValue;
                minItem = item;
            }   
        }
        return minItem;
    
}
export function maxOfCollection<T>(collection: IterableIterator<T>, numericSelector: (item: T) => number ): IteratorResult<T|number> {
    let maxItem: IteratorResult<T> = collection.next();
    let maxValue = numericSelector(maxItem.value)
    let item: IteratorResult<T>;
    while((item = collection.next()).value != undefined) {            
        const curValue = numericSelector(item.value);
        if(maxValue < curValue) {
            maxValue = curValue;
            maxItem = item;
        }   
    }
    return maxItem;

}

function numberGourd(num): num is number { return typeof num == 'number'; }
function numberArrayGourd(array): array is Array<number> { 
    return Array.isArray(array) && numberGourd(array[0]); 
}