"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
;
class MachineInfo {
    constructor() {
        const cpus = os.cpus();
        this.cpusModel = cpus[0].model; // Intel ...
        this.numberOfCpus = cpus.length; // 4
        this.osPlatform = os.platform(); // win32
        this.osName = os.type(); // Windows_NT
        this.osCpuArch = os.arch(); //x64
    }
}
exports.MachineInfo = MachineInfo;
//# sourceMappingURL=machine-info.js.map