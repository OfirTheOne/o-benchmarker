# O-Benchmarker

[![Build Status](https://travis-ci.org/OfirTheOne/o-benchmarker.svg?branch=master)](https://travis-ci.org/OfirTheOne/o-benchmarker)
![npm](https://img.shields.io/npm/v/o-benchmarker.svg)

O-Benchmarker - Node.js Benchmarking Framework. <br>
To easily, and without excessive code writhing, profile the performance of any function.
If you think of multiple ways to implement a specific action, or you found a copal of modules that preform what you're looking for, and want to evaluate which one is faster, this module provide you with a simple, easy-to-use API just for that (aiming to be as easy as testing with Mocha).


### Table Of Contents 
+ [Installation](#Installation)
+ [Short Intro](#Short-Intro)
+ [Usage](#Usage)
    + [Setup entrypoint script](#Setup-entrypoint-script)
    + [Create BenchmarkerTask ](#Create-BenchmarkerTask )
    + [Create BenchmarkerTasksGroup](#Create-BenchmarkerTasksGroup)
+ [Inside The O-Benchmarker Flow](#Inside-The-O-Benchmarker-Flow)
+ [API Reference](#API-Reference)
+ [Example Use Cases](#Example-Use-Cases)

<br><hr>

## Installation
#### NPM
```sh
npm i o-benchmarker
```
recommend to install with `-D` flag.

<br><hr>

## Short Intro
To first understand the general system interaction refers to any unfamiliar objects by there names (each one will be explained soon).<br>
The *O-Benchmarker* tool process any "benchmarker-tasks" existing in your project, benchmark them and provide a "benchmarking-report" with information about the benchmarking performance (the report is printed to current process terminal).<br>
Generally, the "benchmarker-task" file is exporting a specific object represent a tasks group to be measured against each other (a group can contain one task as well), the "benchmarker-task" file name follows some pattern, used by the tool to detect the task file.

<br><hr>

## Usage

#### Setup entrypoint script 

*O-Benchmarker* package is shipped with the following command : [(more)](#O-Benchmarker%20-%20EntryPoint%20Script)
```sh
o-benchmarker [file-name-pattern] [minfo-flag?, json-flag?]
```



On `package.json`, add a new script (E.g. "benchmark") to the [`scripts`](https://docs.npmjs.com/files/package.json#scripts) property, executing the `o-benchmarker` command with the relevant parameters.<br>

Example :
```sh
"scripts" : {
  "benchmark" : "o-benchmarker **/*.benchmark.ts --minfo" 
}
```
The following will trigger the O-Benchmarker to look in your project for any files matching the `**/*.benchmark.ts` glob pattern, process their exported object and attempt to benchmark it. The produced report will include the executing machine info.


#### Create BenchmarkerTask 
Define a [`BenchMethod`](#BenchMethod) to benchmark, a good practice will be to wrap the actual targeted method with a "caller" method, to better handle unexpected behavior (E.g catching error ..).<br>

Once you define the method, move to define a [`BenchmarkerTask`](#BenchmarkerTask) object for that method.<br>
Provide an `args` array, and a [`BenchmarkerOptions`](#BenchmarkerOptions) object with a short `taskName`, number of cycles you want the method to be benchmarked, and an optional `argsGen` function, if `argsGen` provided, the `args` array can just be `undefined`.<br>

Example :
```ts
import { BenchmarkerTask } from 'o-benchmarker';
// assume we got a "randomArray" method that return us a random array of numbers.

function myMethodCaller(array: number[]) {  // <- BenchMethod
    // call the targeted method or just do something with the array.
}
export const myBenchmarkerTask : BenchmarkerTask = {
    method: myMethodCaller, 
    args: undefined, 
    options: { 
        taskName: 'Some Calculation',
        cycles: 1000, 
        argsGen: function () { return [randomArray()] } 
    }
};
```
 
#### Create BenchmarkerTasksGroup
When you got all the tasks you would like to group together, sort out, you can move to define the [`BenchmarkerTasksGroup`](#BenchmarkerTasksGroup) object. <br>
A good practice will be to define the group on a separate file (and to name that file according to the glob pattern you chose). 
Simply define the group object and export it for <br>

Example : (continue the previous)
```ts
import { myBenchmarkerTask } from './my-benchmarker-task';
import { otherBenchmarkerTask } from './other-benchmarker-task'; // assume we got another benchmark task

import { BenchmarkerTasksGroup } from 'o-benchmarker'

export const myBenchmarkerTasksGroup: BenchmarkerTasksGroup = {
    groupDescription: 'Example for tasks group benchmarking',
    tasks: [
        myBenchmarkerTask,
        otherBenchmarkerTask,
    ]
};
```

From there, executing the `o-benchmarker` command will trigger the benchmarking process.<br>
The `myBenchmarkerTasksGroup` object will be imported, process and benchmark.

This will result with a `BenchmarkerTasksGroupReport` object printed to the terminal : <br>
```
   *  -- Example for tasks group benchmarking --
   *
   * 1 - Some Calculation
   *      Duration-Average : 0.019799838199999867
   *      Cycles : 1000
   *      Executed-Method : myMethodCaller
   *      Async : false
   *
   *
   * 2 - Other Calculation
   *      Duration-Average : 0.045470597599990926
   *      Cycles : 1000
   *      Executed-Method : otherMethodCaller
   *      Async : false
   *
   *
   * Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4
   * win32 x64 - Windows_NT
   ***
```

*Notes* : <br>
At the bottom of the report, you can see the info of the executing machine (`--minfo` flag was provided to `o-benchmarker` command).<br>
The tasks displayed in a sorted order by "Duration-Average" value.<br>
If multiple "benchmarker-tasks" files are processed, the reports will be printed one after each the other.<br> 
As soon as a tasks group finished being benchmarked the resulted report will be printed (meaning that the reports will not be printed altogether).  


<br><hr>

## Inside The O-Benchmarker Flow
[soon]

<br><hr>

## API Reference 

### API Reference Table Of Contents 
+ [O-Benchmarker - EntryPoint Command](#O-Benchmarker---EntryPoint-Command)
+ [BenchmarkerTask](#BenchmarkerTask)
    + [BenchmarkerOptions](#BenchmarkerOptions)
    + [BenchmarkerMethod](#BenchmarkerMethod)
        + [Async Method](#&raquo;-Async-Method)
        + [Sync Method](#&raquo;-Sync-Method)
+ [BenchmarkerTaskReport](#BenchmarkerTaskReport)
+ [BenchmarkerTasksGroup](#BenchmarkerTasksGroup)
    + [BenchmarkerTasksGroupOptions](#BenchmarkerTasksGroupOptions)
+ [BenchmarkerTasksGroupReport](#BenchmarkerTasksGroupReport)
    + [MachineInfo](#MachineInfo)

<br>

#### O-Benchmarker - EntryPoint Command

```sh
o-benchmarker [file-name-pattern] [minfo-flag?, json-flag?]
```
By executing that command the benchmarking process will be triggered. <br>

`o-benchmarker` command takes the arguments (as shown above) : <br>

* `file-name-pattern` - [required] is a [glob pattern] to detect for any files to be processed as tasks and benchmark.
* `minfo-flag` - [optional] used as `--minfo`, if present the printed benchmarking report will include the executing machine info. 
* `json-flag` - [optional] used as `--json`, if present the printed benchmarking report will be in a simple json format. 

<br>

#### BenchmarkerTask

> An object that wrap together a method to benchmark, arguments to provide it, and options to configure the process. <br>
> `method` will be execute with whatever parameters resulted from spreading the `args` array (E.g `method(...args)`). <br>
> In case `options.async` set to true, `done` cb will be provided first and the rest of the `...args` after. <br>
> If `options.genArgs` is defined, `args` field will be ignored, and the returned value of `options.genArgs()` will be provided as the array of argument to `method` (E.g `method(...options.genArgs())`).


| property | required | type | description |
| ------ | ------ | ------ | ------ |
| method | ✔ | BenchmarkerMethod | The targeted method to benchmark. |
| args | ✔ | any[] | Arguments provided to the method while benchmarking. |
| options | ✔ | BenchmarkerOptions | Task configuration options. |

<br>

#### BenchmarkerOptions

> Task configuration options.

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| taskName | ✔ | string | A name that describe the task (same value will be include in the `BenchmarkerTaskReport` as `taskName`). |
| cycles | ✔ | number | The number of times the `BenchmarkerTask.method` will be called in the benchmark process. |
| argsGen | ➖ | ()=>any | A method that generates arguments for `BenchmarkerTask.method`, it's repeatedly called on each execution cycle, it return value must be an array, and it will be spread when provided to the method (E.g `method(...argsGen())`). If it defined, `BenchmarkerTask.args` will be ignored. |
| async | ➖ | boolean | If set to `true`, the method on this task will be handled as async method [(more)](#BenchmarkerMethod). |

<br>

#### BenchmarkerMethod

> This is the main objective of a task [BenchmarkerTask] to process.<br>
> The type of the method that will be repeatedly execute and benchmarked. <br> 
> A BenchmarkerMethod appeared only in  BenchmarkerTask.method, and can be an async or sync method.
<br>
> In case of **async method** (when the `async` field in the task option is set to `true`), it will provided with `done` callback for the first argument, the rest of the argument configured (via `args` field or with `genArgs` field in the task options) will follow after.<br> 
> To resolve the method, just like a Promise, the `done` callback must be called, it takes `(err?: any, result?: any)`, to 'reject' / throw error, you need to provide it with a first argument (!= undefined), or just `throw` an error. <br>
> In case of a **sync method** (when the `async` field in the task option not defined, or set to `false`) it will provided with the argument configured (via `args` field or with `genArgs` field in the task options)

#### &raquo; Sync Method :
```ts
(...args: any[]) => any;
```

#### &raquo; Async Method : 

```ts
(done: (err?: any, result?: any) => any, ...args: any[]) => any;
```

<br>

#### BenchmarkerTaskReport

> Object that contain all the relevant information gathered while benchmarking the current task.


| property | required | type | description |
| ------ | ------ | ------ | ------ |
| durationAverage | ✔ | number | the duration average resulted from summing the duration of each benchmark cycle measurement and dividing it by `BenchmarkerOptions.cycles`. |
| cycles | ✔ | number | the number of times the `BenchmarkerTask.method` was called and benchmarked. |
| taskName | ➖ | string | if provided on `BenchmarkerOptions`, else `undefined`. |
| methodName | ✔ | string | `BenchmarkerTask.method.name` value. |
| async | ✔ | boolean | Indicate if the method in this task was handled as async method

<br>

#### BenchmarkerTasksGroup

> Object that wraps an array of tasks, with additional configure properties.<br> 
> This is the object expected to be export from each "benchmark-task" file (a file with a name matching the glob pattern provided to `o-benchmarker` command).<br>
> If a different object will be exported the file will be ignored.

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| groupName | ➖ | string | A short name for the group displayed as a title in `BenchmarkerTasksGroupReport` printout. |
| groupDescription | ✔ | string | A short text to describe the tasks group. |
| tasks | ✔ | BenchmarkerTask[] | An array of tasks to be benchmarked and measured against each other. |
| options | ➖ | BenchmarkerTasksGroupOptions | Group configuration options. |

<br>

#### BenchmarkerTasksGroupOptions 

> Group configuration options.

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| equalArgs | ➖ | boolean | If true feed the arguments provided to the first task, to all the tasks in the group.<br>The backlash of using it will cause the benchmarking to apply the number of cycles provided to the first task to the entire group (ignore the other tasks cycles). |

<br>

#### BenchmarkerTasksGroupReport

> An object that wrap an array of tasks-report (BenchmarkerTaskReport), with additional information about the current group. 
> The field `machineInfo` contains static data about the current machine.
> The `tasksReports` array is sorted by the `report.durationAverage` value (smallest to largest).

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| groupName | ➖ | string | `BenchmarkerTasksGroupReport.groupName` value. |
| groupDescription | ✔ | string | `BenchmarkerTasksGroupReport.groupDescription` value. |
| tasksReports | ✔ | BenchmarkerTaskReport[] | Array of taskReports, each one for a task provided in the `BenchmarkerTasksGroup.tasks` array in the correspond groupReports object. |
| machineInfo | ✔ | MachineInfo | Static data about the current machine. |

<br>

#### MachineInfo

> Object used to store the executing machine information, the information obtained by the [standard `os` module.](https://nodejs.org/api/os.html) <br>
> This object will be included in the `BenchmarkerTasksGroupReport`, and in the printed report if the `--minfo` flag provided.    

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| cpusModel | ✔ | string | The value of `os.cpus[0].model`. |
| numberOfCpus | ✔ | number | The value of `os.cpus().length`. |
| osPlatform | ✔ | string | The value of `os.platform()`. |
| osName | ✔ | string | The value of `os.type()`. |
| osCpuArch | ✔ | string | The value of `os.arch()`. |

<br><hr>

## Example Use Cases

### Crypto playground

Two common methods from the standard `crypto` module, [`pbkdf2`](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback) and [`pbkdf2Sync`](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest) both do the same, the first is asynchronous the second synchronous. <br>
Which one of the them run faster? and under which conditions? - in this case, parameter size (E.g password or salt length, amount of iterations or keylen). <br>
In this example you can see different behavior when changing the value of `iterations` parameter. 

```ts
import * as crypto from 'crypto';
import { BenchmarkerTask, BenchmarkerTasksGroup } from 'o-benchmarker';
import { randomArray } from '...';

const CYCLES = 1000;

function pbkdf2RandomArray(done, arrayToPass: number[],  arrayToSalt: number[]) { 
    crypto.pbkdf2(arrayToPass.toString(), arrayToSalt.toString(), 10000, 64, 'sha512', 
        (err, derivedKey) => {  
            done(err, {haxKey: derivedKey.toString('hex')});
        }
    );
}

function pbkdf2SyncRandomArray(arrayToPass: number[],  arrayToSalt: number[]) { 
    const key = crypto.pbkdf2Sync(arrayToPass.toString(), arrayToSalt.toString(), 10000, 64, 'sha512');
    return key;
}

const CryptoPBKDF2BenchmarkerTask : BenchmarkerTask = {
    method: pbkdf2RandomArray, 
    args: undefined, 
    options: { 
        async: true,
        taskName: 'PBKDF2 from random array',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray(100), randomArray(100)] } 
    }
};

const CryptoPBKDF2SyncBenchmarkerTask : BenchmarkerTask = {
    method: pbkdf2SyncRandomArray, 
    args: undefined, 
    options: { 
        taskName: 'PBKDF2 sync from random array',
        cycles: CYCLES, 
        argsGen: function () { return [randomArray(100), randomArray(100)] } 
    }
};

export const CryptoPlayGroup: BenchmarkerTasksGroup = {
    groupDescription: 'Crypto playground',
    options: {
        equalArgs: true
    },
    tasks: [
        CryptoPBKDF2BenchmarkerTask,
        CryptoPBKDF2SyncBenchmarkerTask
    ]
};

```

The resulted Tasks-Report from the above;

```sh
   *  -- Crypto playground --
   *
   * 1 - PBKDF2 sync from random array
   *      Duration-Average : 10.914230677999994
   *      Cycles : 1000
   *      Executed-Method : pbkdf2SyncRandomArray
   *      Async : false
   *
   *
   * 2 - PBKDF2 from random array
   *      Duration-Average : 11.027489383999994
   *      Cycles : 1000
   *      Executed-Method : pbkdf2RandomArray
   *      Async : true
   *
   *
   * Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4
   * win32 x64 - Windows_NT
   ***
```
Here's the tasks-report after changing the `iterations` parameter from 10000 to 5000 .

```sh
   *  -- Crypto playground --
   *
   * 1 - PBKDF2 from random array
   *      Duration-Average : 6.675018615000004
   *      Cycles : 1000
   *      Executed-Method : pbkdf2RandomArray
   *      Async : true
   *
   *
   * 2 - PBKDF2 sync from random array
   *      Duration-Average : 7.083556311000008
   *      Cycles : 1000
   *      Executed-Method : pbkdf2SyncRandomArray
   *      Async : false
   *
   *
   * Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4
   * win32 x64 - Windows_NT
   ***
```


<br>

### Old-School VS Fancy-Sugar syntax 

with all the great build-in function in Es6 there's a lot of short and fancy ways to do any action, <br>
but new and shiny is not always better ... <br>
Here there are three pretty common implementations of finding max in an array of numbers, the first is the old school way, using simple `for` loop, the other ways is with the build-in Es6 functions. <br> 
So which one of the them run faster?

```ts
import { BenchmarkerTask, BenchmarkerTasksGroup } from 'o-benchmarker';
import { randomArray } from '...';

const CYCLES = 1000;

function findMaxFancy(array: number[]) { 
    if(!array) { return; }
    return Math.max(...array);
}
function findMaxOldSchool(array: number[]) { 
    if(!array) { return; }
    let max = Number.MIN_SAFE_INTEGER; 
    for (let i = 0; i < array.length; i++) { 
        if(array[i] > max) { max = array[i]; }
    }
    return max; 
}
function findMaxFancyReduce(array: number[]) { 
    if(!array) { return; }
    return array.reduce(((prvMax, num) => prvMax < num ? num : prvMax), Number.MIN_SAFE_INTEGER)
}

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
        FindMaxFancyBenchmarkerTask,
        FindMaxFancyReduceBenchmarkerTask
        FindMaxOldSchoolBenchmarkerTask,
    ]
};

```
The resulted Tasks-Report from the above;

```sh
   *  -- Find max playground --
   *
   * 1 - OldSchool style find max
   *      Duration-Average : 0.018328903000000007
   *      Cycles : 1000
   *      Executed-Method : findMaxOldSchool
   *      Async : false
   *
   *
   * 2 - Fancy style find max
   *      Duration-Average : 0.02725868300000005
   *      Cycles : 1000
   *      Executed-Method : findMaxFancy
   *      Async : false
   *
   *
   * 3 - Fancy Reduce style find max
   *      Duration-Average : 0.1253258280000014
   *      Cycles : 1000
   *      Executed-Method : findMaxFancyReduce
   *      Async : false
   *
   *
   * Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4
   * win32 x64 - Windows_NT
   ***
```
Interesting conclusions, you'll think the build-in one will be optimized ..


[glob pattern]: <https://en.wikipedia.org/wiki/Glob_(programming)>
