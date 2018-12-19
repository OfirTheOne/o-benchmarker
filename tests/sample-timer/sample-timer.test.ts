import { expect } from 'chai';
import { stub } from 'sinon';
import { SampleTimer } from './../../lib/internal/benchmarker/engine/promise-base-benchmark-engine/sample-timer';
import { FindMaxGroup, CryptoPlayGroup, ForTasksGroup } from '../test-resource/tasks-group'
import { minOfArray, maxOfArray} from '../test-resource/helpers'

describe('SampleTimer - async task & equalArgs', function () {

    const sampleTimer = new SampleTimer();
    this.afterEach(function () {
        sampleTimer.cleanupListeners();
    });

    it('SampleTimer.horizontalSampling should execute async-callbacks with no overlaps.', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);

        const methods = CryptoPlayGroup.tasks.map(task => {
            return { method: task.method, data: { async: task.options.async } };
        });
        const usedArgs = CryptoPlayGroup.tasks[0].args || CryptoPlayGroup.tasks[0].options.argsGen(); 
        const usedCycles = CryptoPlayGroup.tasks[0].options.cycles;
        const genArgs = function () { return usedArgs;}

        sampleTimer.on('sampling-process-success', (stats, reportsMap) => {
            const { totalDurationArray, minArray, maxArray } = stats;
            expect(totalDurationArray.length).to.be.equal(Object.keys(reportsMap).length);
            // for each method there is a report array, for each cycle there is a report.
            for(let i = 0; i < totalDurationArray.length; i++) {
                const reports = reportsMap[i];
                expect(reports.length).to.be.equal(usedCycles);
                const min = minOfArray(reports, (report) => report.duration);
                const max = maxOfArray(reports, (report) => report.duration);

                expect(min.duration).to.be.equal(minArray[i]);
                expect(max.duration).to.be.equal(maxArray[i]);

            }

            // no overlap in the method execution time.
            /** NOTE : 
             *  methods execution is horizontal : 
             *  reportsMap[0][0] -> reportsMap[1][0] -> reportsMap[2][0] -> reportsMap[0][1] -> ...
             * */ 
            for(let cycle = 0; cycle < usedCycles; cycle++) {
                for (let j = 0; j < totalDurationArray.length; j++) {
                    if(cycle < usedCycles-1 && j == totalDurationArray.length-1) {
                        const curReport = reportsMap[j][cycle];
                        const nextReport = reportsMap[0][cycle+1];
                        const curEndTime = curReport.start + curReport.duration;
                        expect(curEndTime).to.be.lt(nextReport.start);
                    } else if(j !== totalDurationArray.length-1) {
                        const curReport = reportsMap[j][cycle];
                        const nextReport = reportsMap[j+1][cycle];
                        const curEndTime = curReport.start + curReport.duration;
                        expect(curEndTime).to.be.lt(nextReport.start);
                    } 
                }
            }

            done();
        });

        sampleTimer.on('sampling-process-error', (error) => {
            done(error);
        });
        sampleTimer.on('sampling-round-call-error', (error) => {
            done(error);
        });
        

        sampleTimer.horizontalRoundCall(methods, genArgs, usedCycles);
    });


    it('SampleTimer should emit an error on sampling-round-call-error event.', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);

        const stubMethod = stub(CryptoPlayGroup.tasks[0], 'method').throws('fake error');
        const methods = CryptoPlayGroup.tasks.map(task => {
            return { method: task.method, data: { async: task.options.async } };
        });
        const usedArgs = CryptoPlayGroup.tasks[0].args || CryptoPlayGroup.tasks[0].options.argsGen(); 
        const usedCycles = CryptoPlayGroup.tasks[0].options.cycles;
        const genArgs = function () { return usedArgs;}

        sampleTimer.on('sampling-process-success', () => {
            stubMethod.restore()
            done( new Error('should not success'));
        })
        sampleTimer.on('sampling-round-call-error', (error) => {
            expect(error).to.not.be.undefined;
            expect(error).to.have.all.keys( 'name', 'roundData', 'originalError');

            // TODO : assertion on values in error object.

            stubMethod.restore();
            done();
        });
        sampleTimer.on('sampling-process-error', (error) => {
            stubMethod.restore()
            done(error);
        });

        sampleTimer.horizontalRoundCall(methods, genArgs, usedCycles);

    });

});


describe('SampleTimer - sync task & equalArgs', function () {

    const sampleTimer = new SampleTimer();
    this.afterEach(function () {
        sampleTimer.cleanupListeners();
    });

    it('SampleTimer.horizontalSampling should execute sync-callbacks with no overlaps.', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);

        const methods = FindMaxGroup.tasks.map(task => {
            return { method: task.method, data: { async: task.options.async, timeout: task.options.timeout } };
        });
        const usedArgs = FindMaxGroup.tasks[0].args || FindMaxGroup.tasks[0].options.argsGen(); 
        const usedCycles = FindMaxGroup.tasks[0].options.cycles;
        const genArgs = function () { return usedArgs;}

        sampleTimer.on('sampling-process-success', (stats, reportsMap) => {
            const { totalDurationArray, minArray, maxArray } = stats;
            expect(totalDurationArray.length).to.be.equal(Object.keys(reportsMap).length);
            // for each method there is a report array, for each cycle there is a report.
            for(let i = 0; i < totalDurationArray.length; i++) {
                const reports = reportsMap[i];
                expect(reports.length).to.be.equal(usedCycles);
                const min = minOfArray(reports, (report) => report.duration);
                const max = maxOfArray(reports, (report) => report.duration);
                expect(min.duration).to.be.equal(minArray[i]);
                expect(max.duration).to.be.equal(maxArray[i]);
            }

            // no overlap in the method execution time.
            /** NOTE : 
             *  methods execution is horizontal : 
             *  reportsMap[0][0] -> reportsMap[1][0] -> reportsMap[2][0] -> reportsMap[0][1] -> ...
             * */ 
            for(let cycle = 0; cycle < usedCycles; cycle++) {
                for (let j = 0; j < totalDurationArray.length; j++) {
                    if(cycle < usedCycles-1 && j == totalDurationArray.length-1) {
                        const curReport = reportsMap[j][cycle];
                        const nextReport = reportsMap[0][cycle+1];
                        const curEndTime = curReport.start + curReport.duration;
                        expect(curEndTime).to.be.lt(nextReport.start);
                    } else if(j !== totalDurationArray.length-1) {
                        const curReport = reportsMap[j][cycle];
                        const nextReport = reportsMap[j+1][cycle];
                        const curEndTime = curReport.start + curReport.duration;
                        expect(curEndTime).to.be.lt(nextReport.start);
                    } 
                }
            }

            done();
        });

        sampleTimer.on('sampling-process-error', (error) => {
            done(error);
        });
        sampleTimer.on('sampling-round-call-error', (error) => {
            done(error);
        });
        

        sampleTimer.horizontalRoundCall(methods, genArgs, usedCycles);
    });


    it('SampleTimer should emit an error on sampling-round-call-error event.', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);

        const stubMethod = stub(FindMaxGroup.tasks[1], 'method').throws('fake error');
        const methods = FindMaxGroup.tasks.map(task => {
            return { method: task.method, data: { async: task.options.async, timeout: task.options.timeout } };
        });
        const usedArgs = FindMaxGroup.tasks[0].args || FindMaxGroup.tasks[0].options.argsGen(); 
        const usedCycles = FindMaxGroup.tasks[0].options.cycles;
        const genArgs = function () { return usedArgs;}

        sampleTimer.on('sampling-process-success', () => {
            stubMethod.restore()
            done( new Error('should not success'));
        })
        sampleTimer.on('sampling-round-call-error', (error) => {
            expect(error).to.not.be.undefined;
            expect(error).to.have.all.keys( 'name', 'roundData', 'originalError');

            // TODO : assertion on values in error object.

            stubMethod.restore();
            done();
        });
        sampleTimer.on('sampling-process-error', (error) => {
            stubMethod.restore()
            done(error);
        });

        sampleTimer.horizontalRoundCall(methods, genArgs, usedCycles);

    });

});