import { ModelParser } from './../../lib/internal/tasks-scanner/bm-model-parser';
import { expect } from 'chai';
import { CryptoPlayGroup, FindMaxGroup } from '../tasks-group';
import { recursiveDeepClone } from '../helpers';

describe('ModelParser testing', function () {

    it('ModelParser.benchmarkerTasksGroupValidator should return all true', function() {
        expect(ModelParser.benchmarkerTasksGroupValidator(CryptoPlayGroup)).to.be.true;
        expect(ModelParser.benchmarkerTasksGroupValidator(FindMaxGroup)).to.be.true;
    });

    it('ModelParser.benchmarkerTasksGroupValidator should return all false', function() {
        // args & argsGen are undefined
        const invalidFindMaxGroup01 = recursiveDeepClone(FindMaxGroup);
        invalidFindMaxGroup01.tasks[0].options.argsGen = undefined;
        invalidFindMaxGroup01.tasks[0].args = undefined;
        // no casting
        const invalidFindMaxGroup02 = recursiveDeepClone(FindMaxGroup);
        invalidFindMaxGroup02.tasks[0].options.ignore = 'true';
        // no casting
        const invalidFindMaxGroup03 = recursiveDeepClone(FindMaxGroup);
        invalidFindMaxGroup03.tasks[0].options.cycles = '10';
        // cycles value < 1
        const invalidCryptoPlayGroup = recursiveDeepClone(CryptoPlayGroup);
        invalidCryptoPlayGroup.tasks[0].options.cycles = -1; 
        

        expect(ModelParser.benchmarkerTasksGroupValidator(invalidFindMaxGroup01)).to.be.false;
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidFindMaxGroup02)).to.be.false;
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidFindMaxGroup03)).to.be.false;
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidCryptoPlayGroup)).to.be.false;
    });



});