"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors/safe");
const common_untitled_1 = require("../utils/common-untitled");
class StringifyBenchmarkerObjects {
    static formatGroupReports(groupReport, formatOptions) {
        const mInfo = groupReport.machineInfo;
        return ((groupReport.groupDescription ?
            `   *  -- ${colors.bold(colors.blue(groupReport.groupDescription))} -- \n` :
            '   *') +
            groupReport.tasksReports.reduce((acc, report, i) => acc + this.formatSingleReport(report, i + 1), '') +
            '   *\n' +
            (formatOptions.machineInfo ? this.formatMachineInfo(mInfo) : '') +
            '   ***\n');
    }
    static formatSingleReport(report, position) {
        return ('   *' + '\n' +
            `   * ${position} - ${colors.bold(colors.green(report.taskName))}` + '\n' +
            `   *      ${colors.underline('Duration-Average')} : ${report.durationAverage}` + '\n' +
            `   *      ${colors.underline('Cycles')} : ${report.cycles}` + '\n' +
            `   *      ${colors.underline('Executed-Method')} : ${report.methodName}` + '\n' +
            `   *      ${colors.underline('Async')} : ${(!!report.async)}` + '\n' +
            '   *\n');
    }
    static formatMachineInfo(mInfo) {
        return (`   * ${mInfo.cpusModel} x${mInfo.numberOfCpus} \n` +
            `   * ${mInfo.osPlatform} ${mInfo.osCpuArch} - ${mInfo.osName} \n`);
    }
    static groupReportsAsJson(groupReport, formatOptions) {
        const groupReportToStringify = !formatOptions.machineInfo ?
            common_untitled_1.filterObject(groupReport, ['machineInfo']) :
            groupReport;
        return JSON.stringify(groupReportToStringify, undefined, 2);
    }
}
exports.StringifyBenchmarkerObjects = StringifyBenchmarkerObjects;
//# sourceMappingURL=format-benchmark-report.js.map