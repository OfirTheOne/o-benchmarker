import { BenchmarkerTasksGroup } from './../../lib/models';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { PromiseBaseBenchmarkEngine } from './../../lib/internal/benchmarker/engine';
import { CryptoPlayGroup } from './../test-resource/tasks-group/crypto-play';
import { recursiveDeepClone } from '../test-resource/helpers';

describe('PromiseBaseBenchmarkEngine - async task & equalArgs.', function () {
    const benchmarkerEngine = new PromiseBaseBenchmarkEngine();

    this.afterEach(() => {
        // after each 'it()' test clean all listeners.
        benchmarkerEngine.cleanupListeners();
    });

    it('Returned group-report should be structured as expected.', function (done) {
        //  this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {

            // #region - structure testing 
            // group report contains all expected keys.
            expect(groupReport).to.have.all.keys(
                'groupName', 'groupDescription', 'tasksReports', 'machineInfo'
            );
            // group report contains the expected values of groupName and groupDescription.
            expect(groupReport).to.include({ groupName: CryptoPlayGroup.groupName, groupDescription: CryptoPlayGroup.groupDescription });
            // group report contains a tasksReports as an array with the same length of the tasks. 
            expect(groupReport.tasksReports).to.be.an('array').with.length(CryptoPlayGroup.tasks.length);
            // each task report contains all expected keys. 
            groupReport.tasksReports.forEach(report => {
                expect(report).to.deep.include.keys(
                    ['cycles', 'taskName', 'methodName', 'async', 'stats']
                );
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
            const taskAndMethodNameInTasks = CryptoPlayGroup.tasks.map((task) => {
                return { taskName: task.options.taskName, methodName: task.method.name };
            });
            expect(taskAndMethodNameInReports).to.have.deep.members(taskAndMethodNameInTasks);
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value.
             *  else each task will follow it own cycles value. 
             * */
            if (CryptoPlayGroup.options && CryptoPlayGroup.options.equalArgs === true) {
                if (groupReport.tasksReports.length > 0) {
                    const firstTaskCycles = groupReport.tasksReports[0].cycles;
                    groupReport.tasksReports.forEach(report =>
                        expect(report).to.include({ cycles: firstTaskCycles }));
                }
            } else if (!CryptoPlayGroup.options || !CryptoPlayGroup.options.equalArgs) {
                if (groupReport.tasksReports.length > 0) {
                    groupReport.tasksReports.forEach((report, i) =>
                        expect(report).to.include({ cycles: CryptoPlayGroup.tasks[i].options.cycles }));
                }
            }

            // #endregion
            done();
        });
        benchmarkerEngine.on('benchmarking-group-error', (err) => { done(err) });
        benchmarkerEngine.measureGroup(CryptoPlayGroup);
    });

    it('Each cb method should be called in the expected amount, with the expected arguments.', function (done) {
        //  this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        // spy on each task cb method.
        const spies: SinonSpy<any[], any>[] = CryptoPlayGroup.tasks.map(task => spy(task, 'method'));

        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
            /**
             *  The wanted behavior : 
             *  if Group.options.equalArgs is true all task are benchmarked be the first task cycles value,
             *  and receive the same arguments on each cycle. 
             *  else each task will follow it own cycles value. 
             * */
            if (CryptoPlayGroup.options && CryptoPlayGroup.options.equalArgs === true) {
                if (groupReport.tasksReports.length > 0) {
                    const firstTaskToLineUp = CryptoPlayGroup.tasks[0];

                    const firstTaskCycles = firstTaskToLineUp.options.cycles;
                    // all the cb methods should be called as the number of first task cycles value. 
                    spies.forEach((spy, i) => expect(spy.callCount).is.equal(firstTaskCycles));
                    // all the cb methods should receive the same arguments on same cycle.
                    for (let cycle = 0; cycle < firstTaskCycles; cycle++) {

                        // const firstTaskArgsOnCurrentCycle = spies[0].args[cycle];
                        const arrayOfArgsOnThisCycle = spies.map((spy, i) => {
                            return CryptoPlayGroup.tasks[i].options.async ?
                                (spy.args[cycle]).slice(1) : (spy.args[cycle])
                        })

                        arrayOfArgsOnThisCycle.forEach((args, i) => {
                            if (i > 0) {
                                expect(args).to.be.deep.equal((arrayOfArgsOnThisCycle[i - 1]));
                            }
                        });
                    }
                }
            }
            else if (!CryptoPlayGroup.options || !(CryptoPlayGroup.options.equalArgs)) {
                if (groupReport.tasksReports.length > 0) {
                    spies.forEach((spy, i) => {
                        expect(spy.callCount).is.equal(CryptoPlayGroup.tasks[i].options.cycles)
                    });
                }
            }
            spies.forEach((spy, i) => spy.restore());
            done();
        });
        benchmarkerEngine.on('benchmarking-group-error', (err) => { done(err) });

        benchmarkerEngine.measureGroup(CryptoPlayGroup);
    });


    it('First task should raised a TimeoutError after 1 sc and terminate.', function (done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(2000);
        const cloneCryptoPlayGroup = recursiveDeepClone(CryptoPlayGroup) as BenchmarkerTasksGroup;

        const stubTask = cloneCryptoPlayGroup.tasks[0];
        stubTask.method = function (_done, arg01, arg02) { setTimeout(() => { _done(); }, 2000) };
        stubTask.options.timeout = 1000;
        cloneCryptoPlayGroup.tasks[0] = stubTask;
        // spy on each task cb method.
        const spies: SinonSpy<any[], any>[] = cloneCryptoPlayGroup.tasks.map(task => spy(task, 'method'));

        benchmarkerEngine.on('benchmarking-group-success', () => done(new Error('should not success.')));

        benchmarkerEngine.on('benchmarking-group-error', (err) => {
            expect(err).to.not.be.undefined;
            expect(err).to.have.keys(['timeLimit', 'name']);
            expect(err.name).to.be.equal('TimeoutError');
            expect(err.timeLimit).to.be.equal(stubTask.options.timeout);

            spies.forEach((spy, i) => expect(spy.callCount).is.equal(i == 0 ? 1 : 0));

            spies.forEach((spy, i) => spy.restore());
            done();
        });


        benchmarkerEngine.measureGroup(cloneCryptoPlayGroup);
    });

    it('Each cb method should be called in the expected amount, no error - invalid timeout value.', function (done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        const cloneCryptoPlayGroup = recursiveDeepClone(CryptoPlayGroup) as BenchmarkerTasksGroup;
        cloneCryptoPlayGroup.tasks[0].options.timeout = -5;
        cloneCryptoPlayGroup.options = undefined; // no equalArgs
        // spy on each task cb method.
        const spies: SinonSpy<any[], any>[] = cloneCryptoPlayGroup.tasks.map(task => spy(task, 'method'));

        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
            if (groupReport.tasksReports.length > 0) {
                spies.forEach((spy, i) => {
                    expect(spy.callCount).is.equal(CryptoPlayGroup.tasks[i].options.cycles)
                });
            }
            spies.forEach((spy, i) => spy.restore());
            done();
        });

        benchmarkerEngine.on('benchmarking-group-error', (err) => {
            spies.forEach((spy, i) => spy.restore());
            done(err);
        });

        benchmarkerEngine.measureGroup(cloneCryptoPlayGroup);
    });

    it('No TimeoutError should be raised - high timeout value.', function (done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);
        const cloneCryptoPlayGroup = recursiveDeepClone(CryptoPlayGroup) as BenchmarkerTasksGroup;
        cloneCryptoPlayGroup.tasks[0].options.timeout = 1000;
        cloneCryptoPlayGroup.options = undefined; // no equalArgs
        // spy on each task cb method.
        const spies: SinonSpy<any[], any>[] = cloneCryptoPlayGroup.tasks.map(task => spy(task, 'method'));

        benchmarkerEngine.on('benchmarking-group-success', (groupReport) => {
            if (groupReport.tasksReports.length > 0) {
                spies.forEach((spy, i) => {
                    expect(spy.callCount).is.equal(CryptoPlayGroup.tasks[i].options.cycles)
                });
            }
            spies.forEach((spy, i) => spy.restore());
            done();
        });

        benchmarkerEngine.on('benchmarking-group-error', (err) => {
            spies.forEach((spy, i) => spy.restore());
            done(err);
        });

        benchmarkerEngine.measureGroup(cloneCryptoPlayGroup);
    }); 

})
