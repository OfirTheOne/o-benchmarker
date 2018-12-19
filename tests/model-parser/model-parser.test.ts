import { ModelParser } from './../../lib/internal/tasks-scanner/bm-model-parser';
import { expect } from 'chai';
import { CryptoPlayGroup, FindMaxGroup } from '../test-resource/tasks-group';
import { recursiveDeepClone } from '../test-resource/helpers';

describe('ModelParser testing', function () {

    it('ModelParser.benchmarkerTasksGroupValidator should return all true', function() {
        const validCryptoPlayGroup02 = recursiveDeepClone(CryptoPlayGroup);
        validCryptoPlayGroup02.tasks[0].args = [[1,2,3,4], [2,3,4,5]]; 
        validCryptoPlayGroup02.tasks[0].options.argsGen = undefined;

        expect(ModelParser.benchmarkerTasksGroupValidator(CryptoPlayGroup)).to.be.true;
        expect(ModelParser.benchmarkerTasksGroupValidator(FindMaxGroup)).to.be.true;
        expect(ModelParser.benchmarkerTasksGroupValidator(validCryptoPlayGroup02)).to.be.true;

    });

    it('ModelParser.benchmarkerTasksGroupValidator should return all false', function() {
        // this.skip();
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
        const invalidCryptoPlayGroup01 = recursiveDeepClone(CryptoPlayGroup);
        invalidCryptoPlayGroup01.tasks[0].options.cycles = -1; 
        

        expect(ModelParser.benchmarkerTasksGroupValidator(invalidFindMaxGroup01)).to.be.false;
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidFindMaxGroup02)).to.be.false;
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidFindMaxGroup03)).to.be.false;
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidCryptoPlayGroup01)).to.be.false;
    });
});