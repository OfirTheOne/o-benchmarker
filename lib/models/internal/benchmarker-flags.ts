
export interface IBenchmarkerFlags {
    minfo: boolean;
    printas: 'json' | 'default';
}

export class BenchmarkerFlags {
        minfo: boolean;
        printas: 'json' | 'default';

        static DEFAULT_VALUES: IBenchmarkerFlags = {
            minfo: false,
            printas : 'default', 
        }
        constructor(flags: IBenchmarkerFlags = BenchmarkerFlags.DEFAULT_VALUES) {
            this.minfo = flags.minfo || BenchmarkerFlags.DEFAULT_VALUES.minfo;
            this.printas = flags.printas || BenchmarkerFlags.DEFAULT_VALUES.printas;
        }
}