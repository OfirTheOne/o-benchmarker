

import {BenchmarkerTasksGroup, BenchmarkerTask} from '../../../lib';
import { randomArray } from './../helpers';

const CYCLES = 1000;

function forEachCaller(array: number[]) { 
    array.forEach((value, index) => { return value+3; }); 
}
function forCaller(array: number[]) { 
    let someVar = 1; 
    for (let i = 0; i < array.length; i++) { someVar; array[i]; } 
}

const forEachBenchmarkerTask : BenchmarkerTask = {
    method: forEachCaller, 
    args: undefined, 
    options: { 
        taskName: 'Native forEach',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray()] } 
    }
};
const forBenchmarkerTask: BenchmarkerTask = {
    method: forCaller, 
    args: undefined,
    options:  { 
        taskName: 'Native for',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray()] } 
    }
};

export const ForTasksGroup: BenchmarkerTasksGroup = {
    groupDescription: 'For / ForEach method',
    options: {
        equalArgs: false
    },
    tasks: [
        forEachBenchmarkerTask,
        forBenchmarkerTask,
    ]
}

