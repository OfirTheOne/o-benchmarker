import { BenchmarkerTask, BenchmarkerTasksGroup } from './../../../lib';
import { randomArray } from './../../helpers';
import { CYCLES } from './../../consts';

// ******************** def ************************* //
function findMaxFancy(array: number[]) { 
    if(!array) return;
    const max = Math.max(...array);
    return max;
}

function findMaxOldSchool(array: number[]) { 
    if(!array) return;
    let max = Number.MIN_SAFE_INTEGER; 
    for (let i = 0; i < array.length; i++) { 
        if(array[i] > max) {
            max = array[i];
        }
    }
    return max; 
}

function findMaxFancyReduce(array: number[]) { 
    if(!array) return;
    const max = array.reduce(((prvMax, num) => prvMax < num ? num : prvMax), Number.MIN_SAFE_INTEGER)
    return max; 
}



// ******************** benchmark ************************* 
const FindMaxOldSchoolBenchmarkerTask : BenchmarkerTask = {
    method: findMaxOldSchool, 
    args: undefined, 
    options: { 
        taskName: 'OldSchool style find max',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray(10000)] } 
    }
};
const FindMaxFancyBenchmarkerTask: BenchmarkerTask = {
    method: findMaxFancy, 
    args: undefined,
    options:  { 
        taskName: 'Fancy style find max',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray(10000)] } 
    }
};
const FindMaxFancyReduceBenchmarkerTask: BenchmarkerTask = {
    method: findMaxFancyReduce, 
    args: undefined,
    options:  { 
        taskName: 'Fancy Reduce style find max',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray(10000)] } 
    }
};
export const FindMaxGroup: BenchmarkerTasksGroup = {
    groupDescription: 'Find max playground',
    options: {
        equalArgs: true
    },
    tasks: [
        FindMaxOldSchoolBenchmarkerTask,
        FindMaxFancyBenchmarkerTask,
        FindMaxFancyReduceBenchmarkerTask
        
    ]
}
