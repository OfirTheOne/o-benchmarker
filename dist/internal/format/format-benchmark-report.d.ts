import { BenchmarkerTasksGroupReport } from './../../models';
export declare class StringifyBenchmarkerObjects {
    static formatGroupReports(groupReport: BenchmarkerTasksGroupReport, formatOptions: {
        machineInfo: boolean;
    }): string;
    private static formatSingleReport;
    private static formatMachineInfo;
    static groupReportsAsJson(groupReport: BenchmarkerTasksGroupReport, formatOptions: {
        machineInfo: boolean;
    }): string;
}
