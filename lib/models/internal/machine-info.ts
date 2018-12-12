import * as os from 'os';

interface IMachineInfo {
    cpusModel: string,
    numberOfCpus: number,
    osPlatform: string, 
    osName: string, 
    osCpuArch: string,
    _env: { 
        nodeVersion: string,
        pid: number,
    }
};

export class MachineInfo implements IMachineInfo {
    cpusModel: string;
    numberOfCpus: number;
    osPlatform: string;
    osName: string;
    osCpuArch: string;
    
    _env: { 
        nodeVersion: string;
        pid: number;
    };

    constructor() {
        const cpus = os.cpus(); 
        this.cpusModel = cpus[0].model; // Intel ...
        this.numberOfCpus = cpus.length; // 4
        this.osPlatform = os.platform(); // win32
        this.osName = os.type(); // Windows_NT
        this.osCpuArch = os.arch(); //x64
        this._env = {
            nodeVersion: process.versions.node,
            pid: process.pid,
        } 
    }


}