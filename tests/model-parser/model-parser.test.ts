import { ModelParser } from './../../lib/internal/tasks-scanner/bm-model-parser';
import { expect } from 'chai';
import { CryptoPlayGroup, FindMaxGroup } from '../tasks-group';

describe('ModelParser testing', function () {

    it('ModelParser.benchmarkerTasksGroupValidator should return all true', function() {
        expect(ModelParser.benchmarkerTasksGroupValidator(CryptoPlayGroup)).to.be.true;
        expect(ModelParser.benchmarkerTasksGroupValidator(FindMaxGroup)).to.be.true;
    });

    it('ModelParser.benchmarkerTasksGroupValidator should return all false', function() {
        const invalidFindMaxGroup = JSON.parse(JSON.stringify(FindMaxGroup));
        invalidFindMaxGroup.tasks[0].options.argsGen = undefined;

        const invalidCryptoPlayGroup = JSON.parse(JSON.stringify(CryptoPlayGroup));
        invalidCryptoPlayGroup.tasks[0].options.cycles = -1; 
        
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidFindMaxGroup)).to.be.false;
        expect(ModelParser.benchmarkerTasksGroupValidator(invalidCryptoPlayGroup)).to.be.false;
    });

});