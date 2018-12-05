"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(message, name) {
        super(message);
        this.message = message;
        this.name = name;
        this.stack = new Error().stack;
    }
}
class NoTasksDetectedError extends BaseError {
    constructor() {
        super('No tasks detected by O-Benchmarker.', 'NoTasksDetected');
    }
}
exports.NoTasksDetectedError = NoTasksDetectedError;
class MissingFileNamePatternError extends BaseError {
    constructor() {
        super('o-benchmarker script expect file name pattern as a first argument.', 'MissingFileNamePatternError    ');
    }
}
exports.MissingFileNamePatternError = MissingFileNamePatternError;
class RoundCallError extends BaseError {
    constructor(error, method, args, sampleId, async) {
        super('The execution of the provided method cause an error.', 'RoundCallError');
        this.originalError = error;
        this.roundData = { method, args, sampleId, async };
    }
}
exports.RoundCallError = RoundCallError;
//# sourceMappingURL=errors.js.map