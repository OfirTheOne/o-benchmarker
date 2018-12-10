import { expect } from 'chai';
import { stub,  spy, SinonSpy, SinonStub } from 'sinon';
import { SampleTimer } from './../../lib/internal/benchmarker/engine/promise-base-benchmark-engine/sample-timer';
import { CryptoPlayGroup } from '../tasks-group/crypto-play'

describe('SampleTimer - async task & equalArgs', function () {

    const sampleTimer = new SampleTimer();
    this.afterEach(function () {
        sampleTimer.cleanupListeners();
    });

    it('SampleTimer.horizontalSampling should execute async-callbacks with no overlaps.', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);

        const methods = CryptoPlayGroup.tasks.map(task => {return { cb: task.method, async: task.options.async }})
        const usedArgs = CryptoPlayGroup.tasks[0].args || CryptoPlayGroup.tasks[0].options.argsGen(); 
        const usedCycles = CryptoPlayGroup.tasks[0].options.cycles;
        const genArgs = function () { return usedArgs;}

        sampleTimer.on('sampling-process-success', (durationArray: number[], reportsMap) => {
            
            expect(durationArray.length).to.be.equal(Object.keys(reportsMap).length);
            // for each method there is a report array, for each cycle there is a report.
            for(let i = 0; i < durationArray.length; i++) {
                const reports = reportsMap[i];
                expect(reports.length).to.be.equal(usedCycles);
            }

            // no overlap in the method execution time.
            /** NOTE : 
             *  methods execution is horizontal : 
             *  reportsMap[0][0] -> reportsMap[1][0] -> reportsMap[2][0] -> reportsMap[0][1] -> ...
             * */ 
            for(let cycle = 0; cycle < usedCycles; cycle++) {
                for (let j = 0; j < durationArray.length; j++) {
                    if(cycle < usedCycles-1 && j == durationArray.length-1) {
                        const curReport = reportsMap[j][cycle];
                        const nextReport = reportsMap[0][cycle+1];
                        const curEndTime = curReport.start + curReport.duration;
                        expect(curEndTime).to.be.lt(nextReport.start);
                    } else if(j !== durationArray.length-1) {
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
        

        sampleTimer.horizontalSampling(methods, genArgs, usedCycles);
    });


    it('SampleTimer should emit an error on sampling-round-call-error event.', function(done) {
        // this.skip();
        this.enableTimeouts();
        this.timeout(5000);

        const stubMethod = stub(CryptoPlayGroup.tasks[0], 'method').throws('fake error');
        const methods = CryptoPlayGroup.tasks.map(task => {return { cb: task.method, async: task.options.async }})
        const usedArgs = CryptoPlayGroup.tasks[0].args || CryptoPlayGroup.tasks[0].options.argsGen(); 
        const usedCycles = CryptoPlayGroup.tasks[0].options.cycles;
        const genArgs = function () { return usedArgs;}

        sampleTimer.on('sampling-process-success', (durationArray: number[], reportsMap) => {
            stubMethod.restore()
            done();
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

        sampleTimer.horizontalSampling(methods, genArgs, usedCycles);

    });

});