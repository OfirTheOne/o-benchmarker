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
        this.cpusModel = cpus[0].model; 
        this.numberOfCpus = cpus.length;
        this.osPlatform = os.platform();
        this.osName = os.type(); 
        this.osCpuArch = os.arch();
        this._env = {
            nodeVersion: process.versions.node,
            pid: process.pid,
        } 
    }


}