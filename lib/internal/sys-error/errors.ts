

class BaseError extends Error {
    constructor(public message: string, name: string) {
        super(message);
        this.name = name;
        this.stack = (<any> new Error()).stack;
      }
}


export class NoTasksDetectedError extends BaseError {
    constructor() { 
        super(
            'No tasks detected by O-Benchmarker.',
            'NoTasksDetected'
        )
    }
} 

export class MissingFileNamePatternError extends BaseError {
    constructor() { 
        super(
            'o-benchmarker script expect file name pattern as a first argument.',
            'MissingFileNamePatternError    '
        )
    }
} 

export class RoundCallError extends BaseError {
    originalError: any;
    roundData: { method: Function, args: any[], sampleId: number | string, async: boolean };  
    constructor(error: any, method: Function, args: any[], sampleId: number | string, async: boolean) { 
        super(
            'The execution of the provided method cause an error.',
            'RoundCallError'
        );
        this.originalError = error;
        this.roundData = { method, args, sampleId, async };

    }
}