import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { PromiseBaseBenchmarkEngine } from './../../lib/internal/benchmarker/engine';
import { FindMaxGroup, ForTasksGroup } from './../test-resource/tasks-group'


const benchmarkerEngine = new PromiseBaseBenchmarkEngine();

describe('PromiseBaseBenchmarkEngine - sync task & equalArgs.', function() {
    const _usedGroup = FindMaxGroup;
    
    this.afterEach(() => {
        // after each 'it()' test clean all listeners.
        benchmarkerEngine.cleanupListeners();
    });

    it('Returned group-report should be structured as expected.', function(done){
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
    
        // #region - structure testing 
            // group report contains all expected keys.
            expect(groupReport).to.have.all.keys(
                'groupName', 'groupDescription', 'tasksReports', 'machineInfo'
            );
            // group report contains the expected values of groupName and groupDescription.
            expect(groupReport).to.include({groupName: _usedGroup.groupName, groupDescription: _usedGroup.groupDescription});
            // group report contains a tasksReports as an array with the same length of the tasks. 
            expect(groupReport.tasksReports).to.be.an('array').with.length(_usedGroup.tasks.length); 
            // each task report contains all expected keys. 
            groupReport.tasksReports.forEach(report => {
                expect(report.stats).to.deep.include.keys(['min', 'max', 'average']);
                expect(report.stats.min).to.be.a('number');
                expect(report.stats.max).to.be.a('number');
                expect(report.stats.average).to.be.a('number');

            }); 
            /** 
             * Tasks array (on TasksGroup object) and tasks-reports array (on GroupReport object) 
             * are not necessarily on the expected order. 
             * The assertion must be with no importance to order.
             * */
            const taskAndMethodNameInReports = groupReport.tasksReports.map((report) => { 
                return { taskName: report.taskName, methodName: report.methodName }; 
            });
            const taskAndMethodNameInTasks = _usedGroup.tasks.map((task) => { 
                return { taskName: task.options.taskName, methodName: task.method.name }; 
            });
            expect(taskAndMethodNameInReports).to.have.deep.members(taskAndMethodNameInTasks);
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value.
             *  else each task will follow it own cycles value. 
             * */ 
            // equalArgs is true
            if(groupReport.tasksReports.length > 0) {
                const firstTaskCycles = groupReport.tasksReports[0].cycles;
                groupReport.tasksReports.forEach(report => 
                    expect(report).to.include({cycles: firstTaskCycles}));
            }

        // #endregion
            done();
        });  
        benchmarkerEngine.on('benchmarking-group-error', done);    
        benchmarkerEngine.measureGroup(_usedGroup);
    })

    it('Each cb method should be called in the expected amount, with the expected arguments', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        // spy on each task cb method.
        const spies: SinonSpy<any[], any>[] = _usedGroup.tasks.map(task => spy(task, 'method'));

        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value,
             *  and receive the same arguments on each cycle. 
             *  else each task will follow it own cycles value. 
             * */ 
            // equalArgs is true
            if(groupReport.tasksReports.length > 0) {
                const firstTaskCycles = groupReport.tasksReports[0].cycles;
                // all the cb methods should be called as the number of first task cycles value. 
                spies.forEach((spy, i) =>  expect(spy.callCount).is.equal(firstTaskCycles));
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

            spies.forEach((spy, i) => spy.restore());
            done();
        });
        benchmarkerEngine.on('benchmarking-group-error', (err) =>{ 
            spies.forEach((spy, i) => spy.restore());
            done(err) 
        });    

        benchmarkerEngine.measureGroup(_usedGroup);
    });
})

describe('PromiseBaseBenchmarkEngine - sync task & not equalArgs.', function() {

    const _usedGroup = ForTasksGroup;
    this.afterEach(() => {
        // after each 'it()' test clean all listeners.
        benchmarkerEngine.cleanupListeners();
    });

    it('Returned group-report should be structured as expected.', function(done){
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
    
        // #region - structure testing 
            // group report contains all expected keys.
            expect(groupReport).to.have.all.keys(
                'groupName', 'groupDescription', 'tasksReports', 'machineInfo'
            );
            // group report contains the expected values of groupName and groupDescription.
            expect(groupReport).to.include({groupName: _usedGroup.groupName, groupDescription: _usedGroup.groupDescription});
            // group report contains a tasksReports as an array with the same length of the tasks. 
            expect(groupReport.tasksReports).to.be.an('array').with.length(_usedGroup.tasks.length); 
            // each task report contains all expected keys. 
            groupReport.tasksReports.forEach(report => {
                expect(report.stats).to.deep.include.keys(['min', 'max', 'average']);
                expect(report.stats.min).to.be.a('number');
                expect(report.stats.max).to.be.a('number');
                expect(report.stats.average).to.be.a('number');

            }); 
            /** 
             * Tasks array (on TasksGroup object) and tasks-reports array (on GroupReport object) 
             * are not necessarily on the expected order. 
             * The assertion must be with no importance to order.
             * */
            const taskAndMethodNameInReports = groupReport.tasksReports.map((report) => { 
                return { taskName: report.taskName, methodName: report.methodName }; 
            });
            const taskAndMethodNameInTasks = _usedGroup.tasks.map((task) => { 
                return { taskName: task.options.taskName, methodName: task.method.name }; 
            });
            expect(taskAndMethodNameInReports).to.have.deep.members(taskAndMethodNameInTasks);
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value.
             *  else each task will follow it own cycles value. 
             * */ 
            // equalArgs is false
            if(groupReport.tasksReports.length > 0) {
                groupReport.tasksReports.forEach((report, i) => 
                    expect(report).to.include({cycles: _usedGroup.tasks[i].options.cycles}));
            }

        // #endregion
            done();
        });  
        benchmarkerEngine.on('benchmarking-group-error',(err) => {
            console.log(err);
            done(err);
        });    
        benchmarkerEngine.measureGroup(_usedGroup);
    })

    it('Each cb method should be called in the expected amount, with the expected arguments', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        // spy on each task cb method.
        const spies: SinonSpy<any[], any>[] = _usedGroup.tasks.map(task => spy(task, 'method'));

        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value,
             *  and receive the same arguments on each cycle. 
             *  else each task will follow it own cycles value. 
             * */ 
            // equalArgs is false
            if(groupReport.tasksReports.length > 0) {
                spies.forEach((spy, i) => {
                    expect(spy.callCount).is.equal(_usedGroup.tasks[i].options.cycles)
                });
            }
            spies.forEach((spy, i) => spy.restore());
            done();
        });
        benchmarkerEngine.on('benchmarking-group-error', (err) =>{ 
            spies.forEach((spy, i) => spy.restore());
            done(err) 
        });    

        benchmarkerEngine.measureGroup(_usedGroup);
    });
})

