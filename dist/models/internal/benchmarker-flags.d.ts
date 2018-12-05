export interface IBenchmarkerFlags {
    minfo: boolean;
    printas: 'json' | 'default';
}
export declare class BenchmarkerFlags {
    minfo: boolean;
    printas: 'json' | 'default';
    static DEFAULT_VALUES: IBenchmarkerFlags;
    constructor(flags?: IBenchmarkerFlags);
}
