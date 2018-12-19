import { expect } from 'chai';
import { ContinuousStatsProducer } from './../../experimental/computation/computation';

describe('ContinuousStatsProducer', function() {

    it('', function() {
        const stats = new ContinuousStatsProducer()
        const array = [5, 33, 21, 1092, 7, 459, 303, 2, 33, 9, 29, 17, 4, 87];
        const min = 2;
        const max = 1092;
        const mean = array.reduce((sum, val) => sum + val, 0) / array.length;
        
        array.forEach(val => stats.add(val));

        expect(min).to.be.equal(stats.produceMin());
        expect(max).to.be.equal(stats.produceMax());
        expect(mean).to.be.equal(stats.produceMean());


    });
    // it('', function() {

    // });
    // it('', function() {

    // });
    // it('', function() {

    // });
    


})