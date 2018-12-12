interface IMachineInfo {
    cpusModel: string;
    numberOfCpus: number;
    osPlatform: string;
    osName: string;
    osCpuArch: string;
    _env: {
        nodeVersion: string;
        pid: number;
    };
}
export declare class MachineInfo implements IMachineInfo {
    cpusModel: string;
    numberOfCpus: number;
    osPlatform: string;
    osName: string;
    osCpuArch: string;
    _env: {
        nodeVersion: string;
        pid: number;
    };
    constructor();
}
export {};
