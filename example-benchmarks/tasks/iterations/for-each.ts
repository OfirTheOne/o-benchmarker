import { BenchmarkerTask } from './../../../lib';
import { randomArray } from './../../helpers';
import { CYCLES } from './../../consts';

// ******************** def ************************* //
function forEachCaller(array: number[]) { 
    array.forEach((value, index) => { return value+3; }); 
}

// ******************** benchmark ************************* 
const forEachBenchmarkerTask : BenchmarkerTask = {
    method: forEachCaller, 
    args: undefined, 
    options: { 
        taskName: 'Native forEach',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray()] } 
    }
};

export {forEachBenchmarkerTask};


