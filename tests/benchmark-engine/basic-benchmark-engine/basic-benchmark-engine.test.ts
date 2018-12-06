import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { BasicBenchmarkEngine } from './../../../lib/internal/benchmarker/engine';
import { BenchmarkerTasksGroup, BenchmarkerTask } from './../../../lib';
import { randomArray } from './../../helpers';

// ******************** tasks setup ************************* //
function findMaxFancy(array: number[]) { 
    if(!array) return;
    const max = Math.max(...array);
    return max;
}
function findMaxOldSchool(array: number[]) { 
    if(!array) return;
    let max = Number.MIN_SAFE_INTEGER; 
    for (let i = 0; i < array.length; i++) { 
        if(array[i] > max) {
            max = array[i];
        }
    }
    return max; 
}
const FindMaxOldSchoolBenchmarkerTask : BenchmarkerTask = {
    method: findMaxOldSchool, 
    args: undefined, 
    options: { 
        taskName: 'OldSchool style find max',
        cycles: 100, 
        argsGen: function () { return [randomArray(100)] } 
    }
};
const FindMaxFancyBenchmarkerTask: BenchmarkerTask = {
    method: findMaxFancy, 
    args: undefined,
    options:  { 
        taskName: 'Fancy style find max',
        cycles: 100, 
        argsGen: function () { return [randomArray(100)] } 
    }
};
const FindMaxGroup: BenchmarkerTasksGroup = {
    groupDescription: 'Which FindMax is faster ??',
    options: {
        equalArgs: true
    },
    tasks: [
        FindMaxOldSchoolBenchmarkerTask,
        FindMaxFancyBenchmarkerTask,
    ]
}

describe('BasicBenchmarkEngine top-level functionalities, direct calling.', function() {
    const benchmarkerEngine = new BasicBenchmarkEngine();

    this.afterEach(() => {
        // after each 'it()' test clean all listeners.
        benchmarkerEngine.cleanupListeners();
    });

    it('Returned group-report should be structured as expected.', function(done){
        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
            
        // #region - structure testing 
            // group report contains all expected keys.
            expect(groupReport).to.have.all.keys(
                'groupName', 'groupDescription', 'tasksReports', 'machineInfo'
            );
            // group report contains the expected values of groupName and groupDescription.
            expect(groupReport).to.include({groupName: FindMaxGroup.groupName, groupDescription: FindMaxGroup.groupDescription});
            // group report contains a tasksReports as an array with the same length of the tasks. 
            expect(groupReport.tasksReports).to.be.an('array').with.length(FindMaxGroup.tasks.length); 
            // each task report contains all expected keys. 
            groupReport.tasksReports.forEach(report => expect(report).to.deep.include.keys(
                    ['durationAverage', 'cycles' ,'taskName', 'methodName']
                )
            ); 
            /** 
             * Tasks array (on TasksGroup object) and tasks-reports array (on GroupReport object) 
             * are not necessarily on the expected order. 
             * The assertion must be with no importance to order.
             * */
            const taskAndMethodNameInReports = groupReport.tasksReports.map((report) => { 
                return { taskName: report.taskName, methodName: report.methodName }; 
            });
            const taskAndMethodNameInTasks = FindMaxGroup.tasks.map((task) => { 
                return { taskName: task.options.taskName, methodName: task.method.name }; 
            });
            expect(taskAndMethodNameInReports).to.have.deep.members(taskAndMethodNameInTasks);
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value.
             *  else each task will follow it own cycles value. 
             * */ 
            if(FindMaxGroup.options && FindMaxGroup.options.equalArgs === true) {
                if(groupReport.tasksReports.length > 0) {
                    const firstTaskCycles = groupReport.tasksReports[0].cycles;
                    groupReport.tasksReports.forEach(report => 
                        expect(report).to.include({cycles: firstTaskCycles}));
                }
            } else if(!FindMaxGroup.options || !FindMaxGroup.options.equalArgs) {
                if(groupReport.tasksReports.length > 0) {
                    groupReport.tasksReports.forEach((report, i) => 
                        expect(report).to.include({cycles: FindMaxGroup.tasks[i].options.cycles}));
                }
            }

        // #endregion
            done();
        });       
        benchmarkerEngine.on('benchmarking-group-error', (err) =>{ done(err) });    

        benchmarkerEngine.measureGroup(FindMaxGroup);
    })

    it('Each cb method should be called in the expected amount, with the expected arguments', function(done) {
        // spy on each task cb method.
        const spies: SinonSpy<any[], any>[] = FindMaxGroup.tasks.map(task => spy(task, 'method'));

        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value,
             *  and receive the same arguments on each cycle. 
             *  else each task will follow it own cycles value. 
             * */ 
            if(FindMaxGroup.options && FindMaxGroup.options.equalArgs === true) {
                if(groupReport.tasksReports.length > 0) {
                    const firstTaskCycles = groupReport.tasksReports[0].cycles;
                    // all the cb methods should be called as the number of first task cycles value. 
                    spies.forEach((spy, i) => expect(spy.callCount).is.equal(firstTaskCycles));
                    // all the cb methods should receive the same arguments on same cycle.
                    for(let cycle = 0; cycle < firstTaskCycles; cycle++) {
                        const firstTaskArgsOnCurrentCycle = spies[0].args[cycle];
                        spies.forEach((spy, i) => {
                            if(i > 0) {
                                expect(firstTaskArgsOnCurrentCycle).to.be.deep.equal(spy.args[cycle]);
                            }
                        });
                    }
                }
            } 
            else if(!FindMaxGroup.options || !FindMaxGroup.options.equalArgs) {
                if(groupReport.tasksReports.length > 0) {
                    spies.forEach((spy, i) => 
                        expect(spy.callCount).is.equal(FindMaxGroup.tasks[i].options.cycles)
                    );
                }
            }
            spies.forEach((spy, i) => spy.restore());
            done();
        });
        benchmarkerEngine.on('benchmarking-group-error', (err) =>{ done(err) });    

        benchmarkerEngine.measureGroup(FindMaxGroup);
    });
})



