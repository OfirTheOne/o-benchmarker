"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors/safe");
function formatMeasuredReports(measureGroup, formatOptions) {
    const mInfo = measureGroup.machineInfo;
    return ((measureGroup.groupDescription ?
        `   * -- ${colors.bold(colors.blue(measureGroup.groupDescription))} -- \n` :
        '   *') +
        measureGroup.tasksReports.reduce((acc, report, i) => acc + formatSingleReport(report, i + 1), '') +
        '   *\n' +
        (formatOptions.machineInfo ? formatMachineInfo(mInfo) : '') +
        '   ***\n');
}
exports.formatMeasuredReports = formatMeasuredReports;
function formatSingleReport(report, position) {
    return ('   *' + '\n' +
        `   * ${position} - ${colors.bold(colors.green(report.taskName))}` + '\n' +
        `   *      ${colors.underline('Duration-Averge')} : ${report.durationAverge}` + '\n' +
        `   *      ${colors.underline('Cycles')} : ${report.cycles}` + '\n' +
        `   *      ${colors.underline('Executed-Method')} : ${report.methodName}` + '\n' +
        '   *\n');
}
function formatMachineInfo(mInfo) {
    return (`   * ${mInfo.cpusModel} x${mInfo.numberOfCpus} \n` +
        `   * ${mInfo.osPlatform} ${mInfo.osCpuArch} - ${mInfo.osName} \n`);
}
//# sourceMappingURL=format-benchmark-report.js.map