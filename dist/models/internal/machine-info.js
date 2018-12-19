"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
;
class MachineInfo {
    constructor() {
        const cpus = os.cpus();
        this.cpusModel = cpus[0].model;
        this.numberOfCpus = cpus.length;
        this.osPlatform = os.platform();
        this.osName = os.type();
        this.osCpuArch = os.arch();
        this._env = {
            nodeVersion: process.versions.node,
            pid: process.pid,
        };
    }
}
exports.MachineInfo = MachineInfo;
//# sourceMappingURL=machine-info.js.map