import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { Benchmarker } from './../../lib/internal/benchmarker/benchmarker';
import { recursiveDeepClone } from '../helpers';
import { CryptoPlayGroup, FindMaxGroup } from '../tasks-group'
import { BenchmarkerTasksGroup } from '../../lib/models';

describe('Benchmarker testing', function() {
    
    const benchmarker = new Benchmarker();

    it('Benchmarker.process should bound context and dismiss ignored tasks', function(done) {
        this.enableTimeouts();
        this.timeout(5000);

        const FindMaxGroupClone = recursiveDeepClone(FindMaxGroup) as BenchmarkerTasksGroup;
        FindMaxGroupClone.tasks[0].options.context = { a: 10, b: 'test'};
        FindMaxGroupClone.tasks[1].options.context = { getArr: function() { return [1,2,3]; } }
        const findMaxGroupSpies: SinonSpy<any[], any>[] = FindMaxGroupClone.tasks.map(task => spy(task, 'method'));
        
        const CryptoPlayGroupClone = recursiveDeepClone(CryptoPlayGroup) as BenchmarkerTasksGroup;
        CryptoPlayGroupClone.tasks[1].options.ignore = true;
        const cryptoPlayGroupSpies: SinonSpy<any[], any>[] = CryptoPlayGroupClone.tasks.map(task => spy(task, 'method'));

        benchmarker.on('benchmarker-process-success', (reportsGroup) => {
            done();
        })
        benchmarker.on('benchmarker-process-error', (error) => {
            done(error);
        })
        benchmarker.process([FindMaxGroupClone, CryptoPlayGroupClone], (err, res) => {
            expect(err).to.be.undefined;
            const { indexInQueue, tasksGroup, groupReport} = res;
            if(indexInQueue == 0) { // FindMaxGroupClone
                // FindMaxGroupClone should be first
                expect(tasksGroup.groupDescription).to.be.equal(FindMaxGroupClone.groupDescription);
                const { tasks } = tasksGroup;
                expect(findMaxGroupSpies[0].calledOn(tasks[0].options.context)).to.be.true;
                expect(findMaxGroupSpies[1].calledOn(tasks[1].options.context)).to.be.true;
            
            } else if(indexInQueue == 1) { // CryptoPlayGroupClone
                // CryptoPlayGroupClone should be second
                expect(tasksGroup.groupDescription).to.be.equal(CryptoPlayGroupClone.groupDescription);
                const { tasks } = tasksGroup;
                // tasks[0] should be exec normally 
                expect(cryptoPlayGroupSpies[0].callCount).to.be.equal(tasks[0].options.cycles);
                // tasks[1] should be ignored 
                expect(cryptoPlayGroupSpies[1].called).to.be.false;
                // tasks[1] should be dismissed 
                expect(groupReport.tasksReports.length).to.be.equal(1);
            } 

        });

        
    })

    // it('', function() {
        
    // })

    // it('', function() {
        
    // })

})