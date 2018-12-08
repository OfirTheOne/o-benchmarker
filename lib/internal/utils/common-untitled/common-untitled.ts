import {randomBytes} from 'crypto'

export function filterObject<T>(source, excludeFields: string[]): Partial<T> {
    const partialObject: Partial<T> = {};
    for (const field in source) {

        if ((~excludeFields.indexOf(field)) && source.hasOwnProperty(field)) {
            partialObject[field] = source[field];
        }
    }
    return partialObject;
}

export function generateId(size: number = 16, encoding: string = 'hex'): Readonly<string> {
    return Object.freeze(randomBytes(size).toString(encoding));
}
