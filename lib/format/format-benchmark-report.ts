import * as colors from 'colors/safe';
import { BenchmarkerReport, BenchmarkerMeasureGroupReport } from './../models';

export function formatMeasuredReports(measureGroup: BenchmarkerMeasureGroupReport, formatOptions: { machineInfo: boolean }): string {
    const mInfo = measureGroup.machineInfo;
    return ( 
        (measureGroup.groupDescription ? 
            `   * -- ${colors.bold(colors.blue(measureGroup.groupDescription))} -- \n` : 
            '   *' 
        ) +
        measureGroup.tasksReports.reduce((acc, report, i) => acc + formatSingleReport(report, i+1), '') +            
        '   *\n' + 
        (formatOptions.machineInfo ? formatMachineInfo(mInfo) : '') +
        '   ***\n' 
    );
}
function formatSingleReport (report: BenchmarkerReport, position: number) {
    return (
'   *' + '\n' +
`   * ${position} - ${colors.bold(colors.green(report.taskName))}` + '\n' +
`   *      ${colors.underline('Duration-Average')} : ${report.durationAverage}`+ '\n' +
`   *      ${colors.underline('Cycles')} : ${report.cycles}` +'\n' +
`   *      ${colors.underline('Executed-Method')} : ${report.methodName}` +'\n' +
'   *\n'
        
    );
}
function formatMachineInfo(mInfo): string {
    return (
        `   * ${mInfo.cpusModel} x${mInfo.numberOfCpus} \n` +
        `   * ${mInfo.osPlatform} ${mInfo.osCpuArch} - ${mInfo.osName} \n`
    );
}