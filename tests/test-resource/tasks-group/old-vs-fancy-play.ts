import { BenchmarkerTasksGroup, BenchmarkerTask } from './../../../lib';
import { randomArray } from './../helpers';

// ******************** tasks setup ************************* //
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
const FindMaxOldSchoolBenchmarkerTask : BenchmarkerTask = {
    method: findMaxOldSchool, 
    args: undefined, 
    options: { 
        taskName: 'OldSchool style find max',
        cycles: 100, 
        argsGen: function () { return [randomArray(100)] } 
    }
};
const FindMaxFancyBenchmarkerTask: BenchmarkerTask = {
    method: findMaxFancy, 
    args: undefined,
    options:  { 
        taskName: 'Fancy style find max',
        cycles: 100, 
        argsGen: function () { return [randomArray(100)] } 
    }
};
export const FindMaxGroup: BenchmarkerTasksGroup = {
    groupDescription: 'Which FindMax is faster ??',
    options: {
        equalArgs: true
    },
    tasks: [
        FindMaxFancyBenchmarkerTask,
        FindMaxOldSchoolBenchmarkerTask,
    ]
}
