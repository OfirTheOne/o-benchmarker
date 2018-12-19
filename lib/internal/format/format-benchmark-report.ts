import * as colors from 'colors/safe';
import { BenchmarkerTaskReport, BenchmarkerTasksGroupReport } from './../../models';
import { filterObject } from '../utils/common-untitled'

export class StringifyBenchmarkerObjects {
    public static formatGroupReports(groupReport: BenchmarkerTasksGroupReport, formatOptions: { machineInfo: boolean }): string {
        const mInfo = groupReport.machineInfo;
        return ( 
            (groupReport.groupDescription ? 
                `   *  -- ${this.transform(groupReport.groupDescription, [colors.blue, colors.bold])} -- \n` : 
                '   *' 
            ) +
            groupReport.tasksReports.reduce((acc, report, i) => acc + this.formatSingleReport(report, i+1), '') +            
            '   *\n' + 
            (formatOptions.machineInfo ? this.formatMachineInfo(mInfo) : '') +
            '   ***\n' 
        );
    }
    private static formatSingleReport (report: BenchmarkerTaskReport, position: number) {
        return (
    '   *' + '\n' +
    `   * ${position} - ${this.transform(report.taskName, [colors.green, colors.bold])}` + '\n' +
    `   *      ${colors.underline('Stats')} :`+ '\n' +
    `   *       \u2022 average : ${(report.stats.average)}` +'\n' +
    `   *       \u2022 min : ${(report.stats.min)}` +'\n' +
    `   *       \u2022 max : ${(report.stats.max)}` +'\n' +
    `   *      ${colors.underline('Cycles')} : ${report.cycles}` +'\n' +
    `   *      ${colors.underline('Executed-Method')} : ${report.methodName}` +'\n' +
    `   *      ${colors.underline('Async')} : ${(!!report.async)}` +'\n' +
    '   *\n'
            
        );
    }
    private static formatMachineInfo(mInfo): string {
        return (
            `   * ${mInfo.cpusModel} x${mInfo.numberOfCpus} \n` +
            `   * ${mInfo.osPlatform} ${mInfo.osCpuArch} - ${mInfo.osName} \n`
        );
    }

    public static groupReportsAsJson(groupReport: BenchmarkerTasksGroupReport, formatOptions: { machineInfo: boolean }): string {
        
        const groupReportToStringify : Partial<BenchmarkerTasksGroupReport> =
            !formatOptions.machineInfo ?
                filterObject(groupReport, ['machineInfo']) :
                groupReport;
        return JSON.stringify(groupReportToStringify, undefined, 2);
    }


    private static transform(text: string, transformations: ((text: string)=>string)[]) {
        return transformations.reduce((text , fn) => fn(text), text)
    }
}