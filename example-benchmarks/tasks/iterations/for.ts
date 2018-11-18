import { BenchmarkerTask } from './../../../benchmarker';
import { randomArray } from './../../helpers';
import { CYCLES } from './../../consts';

// ******************** def ************************* //
function forCaller(array: number[]) { 
    let someVar = 1; 
    for (let i = 0; i < array.length; i++) { someVar; array[i]; } 
}

// ******************** benchmark ************************* //
const forBenchmarkerTask: BenchmarkerTask = {
    method: forCaller, 
    args: undefined,
    options:  { 
        taskName: 'Native for',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray()] } 
    }
}


export {forBenchmarkerTask};
