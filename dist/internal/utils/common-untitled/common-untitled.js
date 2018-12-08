"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function filterObject(source, excludeFields) {
    const partialObject = {};
    for (const field in source) {
        if ((~excludeFields.indexOf(field)) && source.hasOwnProperty(field)) {
            partialObject[field] = source[field];
        }
    }
    return partialObject;
}
exports.filterObject = filterObject;
function generateId(size = 16, encoding = 'hex') {
    return Object.freeze(crypto_1.randomBytes(size).toString(encoding));
}
exports.generateId = generateId;
//# sourceMappingURL=common-untitled.js.map