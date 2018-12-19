declare class BaseError extends Error {
    message: string;
    constructor(message: string, name: string);
}
export declare class NoTasksDetectedError extends BaseError {
    constructor();
}
export declare class MissingFileNamePatternError extends BaseError {
    constructor();
}
export declare class RoundCallError extends BaseError {
    originalError: any;
    roundData: {
        method: Function;
        args: any[];
        sampleId: number | string;
        async: boolean;
    };
    constructor(error: any, method: Function, args: any[], sampleId: number | string, async: boolean);
}
export declare class TimeoutError extends BaseError {
    timeLimit: number;
    constructor(timeLimit: number);
}
export {};
