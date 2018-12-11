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