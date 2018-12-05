"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BenchmarkerFlags {
    constructor(flags = BenchmarkerFlags.DEFAULT_VALUES) {
        this.minfo = flags.minfo || BenchmarkerFlags.DEFAULT_VALUES.minfo;
        this.printas = flags.printas || BenchmarkerFlags.DEFAULT_VALUES.printas;
    }
}
BenchmarkerFlags.DEFAULT_VALUES = {
    minfo: false,
    printas: 'default',
};
exports.BenchmarkerFlags = BenchmarkerFlags;
//# sourceMappingURL=benchmarker-flags.js.map