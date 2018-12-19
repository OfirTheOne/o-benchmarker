# **O-Benchmarker** 

[![Build Status](https://travis-ci.org/OfirTheOne/o-benchmarker.svg?branch=master)](https://travis-ci.org/OfirTheOne/o-benchmarker)
[![npm](https://img.shields.io/npm/v/o-benchmarker.svg)](https://www.npmjs.com/package/o-benchmarker)

O-Benchmarker - Node.js Benchmarking Framework. <br>
For an easy, with minimal efforts, performance measuring any function.
If you think of multiple ways to implement a specific action, or you found a couple of modules that preforms what you're looking for, and you want to evaluate which one is faster, this module provide you with a simple, easy-to-use API just for that.

### **Features** 

* High resolution performance measuring.
* Tasks are benchmarked serially, providing accurate reporting in a human-readable format.
* Build-in typescript support.
* Benchmark multiple functions to measure performance as a group.
* Benchmark sync and async functions and measure performance against each other.
* Build-in support by design of benchmarking Express API routes (using mocking tool, E.g supertest). 



### Table Of Contents 
+ [Installation](#installation)
+ [Short Intro](#short-tntro)
+ [Usage](#usage)
    + [Setup entrypoint script](#setup-entrypoint-script)
    + [Create BenchmarkerTask ](#create-benchmarkertask )
    + [Create BenchmarkerTasksGroup](#create-benchmarkertasksgroup)
+ [Inside The O-Benchmarker Flow](#inside-the-o-benchmarker-flow)
+ [API Reference](#api-reference)
+ [Example Use Cases](#example-use-cases)

<br><hr>

## **Installation**
#### NPM
```sh
npm i o-benchmarker
```
recommend to install with `-D` flag.

<br><hr>

## **Short Intro**
To first understand the general system interaction refers to any unfamiliar objects by there names (each one will be explained soon).<br>
The *O-Benchmarker* tool process any "benchmarker-tasks" existing in your project, benchmark them and provide a "benchmarking-report" with information about the benchmarking performance (the report is printed to current process terminal).<br>
Generally, the "benchmarker-task" file is exporting a specific object represent a tasks group to be measured against each other (a group can contain one task as well), the "benchmarker-task" file name follows some pattern, used by the tool to detect the task file.

<br><hr>

## **Usage**

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
   *      Stats : 
   *       • average : 0.019799838199999867
   *       • min : ...
   *       • max : ...
   *      Cycles : 1000
   *      Executed-Method : myMethodCaller
   *      Async : false
   *
   *
   * 2 - Other Calculation
   *      Stats : 
   *       • average : 0.045470597599990926
   *       • min : ...
   *       • max : ...
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
The tasks displayed in a sorted order by "stats.average" value.<br>
If multiple "benchmarker-tasks" files are processed, the reports will be printed one after the other.<br> 
As soon as a tasks group finished being benchmarked the resulted report will be printed (meaning that the reports will not be printed altogether).  


<br><hr>

## **Inside The O-Benchmarker Flow**

### Simplified Flow Chart start-to-end 

![`flow`](./README-res/o-benchmarker-flow-white-bg-border-2.svg)

([chart-img](https://github.com/OfirTheOne/o-benchmarker/blob/master/README-res/o-benchmarker-flow-white-bg-border-2.svg))
### Tasks Scanner Mechanism

To avoid any technical 'errors' (why the task/file is ignored ?) caused by unexplained internal behavior, read this .. <br>
*'tasks-scanner'* will refer to the module that scan, import, and parse the benchmarker tasks (tasks-groups) to be process by the O-Benchmarker.  

Executing the [`o-benchmarker`](#o-benchmarker---entrypoint-command) command will trigger the *tasks-scanner* to act. The command must be provided with `file-name-pattern` as its first argument, follows with any of the excepted flags.


*tasks-scanner* will use the `file-name-pattern` (first argument) provided to the [`o-benchmarker`](#o-benchmarker---entrypoint-command) command, it will look for all the files in your project directory with a name that match that glob-pattern.

To create the tasksGroup queue, *tasks-scanner* will iterate over the detected files and import what ever the file exports. after done importing, the *tasks-scanner* will iterate over the list of exports and attempt to parse and validated each object to `BenchmarkerTasksGroup` object, if the parsing failed that object will be ignored (will not cause an error) , and not be included in the tasksGroup queue.

From that point the tasksGroup queue will be passed to the benchmarker, and one after the other each taskGroup in the queue will be process and benchmark individually.

*Notes :* <br>
* The importing process of the matching files is done with the native promise-base [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports).
* File scanning by name pattern is done with [`glob`](https://www.npmjs.com/package/glob) module.

<br>

### Benchmarker Internal Logic
Benchmarker module internally constructed of two "body parts", two layers - "*dispatcher*" and "*engine*". <br>
The two layers communicate and interact with each other, back and forth, and handle the incoming input from the task-scanner. 

#### Dispatcher
The first level - *dispatcher*, prepare the incoming tasks-groups, it handle the high level, more technical configuration of the tasks, dismiss any tasks that marked with `ignore` flag, and any group with empty tasks array (or all ignored tasks), it attach (bind) context to tasks method with `options.context` value (if provided), and build the tasksGroup queue.  

After the *dispatcher* is done applying the high level configuration, it will dispatch the first group in the queue to be process by the *engine*, and wait / listen till the *engine* will finish processing it, then move to the next group in the queue.

Each time the *engine* done benchmarking a tasksGroup, it will provide the *dispatcher* a report with information about the current process, the *dispatcher* immediately send the report to be written to `process.stdout`.

In case an error occurred while the *engine* is processing a group, the *dispatcher* will handle that error (write or ignore it), and move to the text group, meaning, if an error was thrown from one task, the whole tasks-group process will be terminated, and the next tasks-group will be handled.   


#### Engine

The second level - *engine*, is the module that in charge of the continuous (one after the other, with no overlaps) execution of the task method on each cycle. <br>
By it's default, the *engine* takes a list of methods (with relevant data attached to each one), a single arguments structure (in form of array or generate function), and `cycles` value.<br>

The engine implement a single execution cycle in the following way - it iterate over the method list and execute each one with the same arguments (if a generate function provided, it's called before the cycle begins, and it's return value provided to each method).<br>  
This execution cycle repeat it self as the amount of the `cycles` parameter.

If a method in the list marked as `async`, that method wrapped in a `Promise`, and the execution cycle waits until that promise is resolved, if rejected, the engine stop everything and return with an error to the benchmarker. 
With in the `Promise` wrapper, using node `pref_hooks` module, the execution of the wrapped method is marked and measured.   

The interaction between the levels is done with certain "hooks" the *engine* implements, each hook is executed in a specific step in the *engine* benchmarking process, with that in place the *dispatcher* and the *engine* can cooperate in a single work flow while remaining separate.
 
<br><hr>

## **API Reference** 

### API Reference Table Of Contents
+ [CLI Commands](#cli-commands)
    + [O-Benchmarker - EntryPoint Command](#o-benchmarker---entrypoint-command)
+ [User Objects Interfaces and Types](#user-objects-interfaces)
    + [BenchmarkerTask](#benchmarkertask)
        + [BenchmarkerTaskOptions](#benchmarkertaskoptions)
        + [BenchmarkerMethod](#benchmarkermethod)
            + [Async Method](#&raquo;-async-method)
            + [Sync Method](#&raquo;-sync-method)
    + [BenchmarkerTasksGroup](#benchmarkertasksgroup)
        + [BenchmarkerTasksGroupOptions](#benchmarkertasksgroupoptions)
+ [System Objects Interfaces](#system-objects-interfaces)
    + [BenchmarkerTaskReport](#benchmarkertaskreport)
        + [DurationStats](#durationstats)
    + [BenchmarkerTasksGroupReport](#benchmarkertasksgroupreport)
        + [MachineInfo](#machineinfo)
+ [System Errors](#system-errors)
    + [NoTasksDetectedError](#notasksdetectederror)
    + [MissingFileNamePatternError](#missingFilenamepatternerror)
    + [RoundCallError](#roundcallerror)
    + [TimeoutError](#timeouterror)

<br>


### **CLI Commands**

#### O-Benchmarker - EntryPoint Command
```sh
o-benchmarker [file-name-pattern] [minfo-flag?, json-flag?]
```
By executing that command the benchmarking process will be triggered. <br>

`o-benchmarker` command takes the arguments (as shown above) : <br>

* `file-name-pattern` - [required] is a [glob pattern] to detect for any files to be processed as tasks and benchmark. If not provided a [MissingFileNamePatternError](#missingFilenamepatternerror) error will be thrown.
* `minfo-flag` - [optional] used as `--minfo`, if present the printed benchmarking report will include the executing machine info. 
* `json-flag` - [optional] used as `--json`, if present the printed benchmarking report will be in a simple json format. 

<br>


### **User Objects Interfaces**
Objects provided by the user, as an input of the benchmarker system. those objects will be parsed and validate. 

<br>

#### BenchmarkerTask

> An object that wrap together a method to benchmark, arguments to provide it, and options to configure the process. <br>
> `method` will be execute with whatever parameters resulted from spreading the `args` array (E.g `method(...args)`). <br>
> In case `options.async` set to true, `done` cb will be provided first and the rest of the `...args` after. <br>
> If `options.genArgs` is defined, `args` field will be ignored, and the returned value of `options.genArgs()` will be provided as the array of argument to `method` (E.g `method(...options.genArgs())`).
> If any error is thrown from `method` a [RoundCallError](#roundcallerror) will wrapped that error will be thrown instead.


| property | required | type | description |
| ------ | ------ | ------ | ------ |
| method | ✔ | BenchmarkerMethod | The targeted method to benchmark. |
| args | ✔ | any[] | Array of arguments provided to `method` while benchmarking.<br>  If the method dont take any arguments provide an empty array. If args value is `undefined`, `options.argsGen` will be used to provide arguments to `method` (therefor at least one of `args` and `options.argsGen` must be provided). |
| options | ✔ | BenchmarkerOptions | Task configuration options. |

<br>

#### BenchmarkerTaskOptions

> Task configuration options.

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| taskName | ✔ | string | A name that describe the task (same value will be include in the `BenchmarkerTaskReport` as `taskName`). |
| cycles | ✔ | number | The number of times the `BenchmarkerTask.method` will be called in the benchmark process. The value must be an integer value, larger then 0. |
| argsGen | ➖ | ()=>any | A method that generates arguments for `BenchmarkerTask.method`, it's repeatedly called on each execution cycle, it return value must be an array, and it will be spread when provided to the method (E.g `method(...argsGen())`). If it defined, `BenchmarkerTask.args` will be ignored. |
| async | ➖ | boolean | If set to `true`, the method on this task will be handled as async method [(more)](#BenchmarkerMethod). |
| timeout | ➖ | number | A number that will be used as ms, to time-limit the `BenchmarkerTask.method`. It will be ignored if `async` != `true`.<br> The value must be an integer value, larger then 0.<br> If the `method` execution time exceed the `timeout` value a [TimeoutError](#timeouterror) will be thrown. |
| ignore | ➖ | boolean | If set to `true`, the task will be completely ignored, (removed from the tasks queue).<br> The effect is as if the task was not included in the `BenchmarkerTasksGroup.tasks` array. |
| context | ➖ | any | The `BenchmarkerTask.method` `this` keyword set to the provided value, this is done with [`Function.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) (this will cause `BenchmarkerTask.method` to be override with a new bound function). |
<br>

#### BenchmarkerMethod

> This is the main objective of a task [BenchmarkerTask] to process.<br>
> The type of the method that will be repeatedly execute and benchmarked.<br> 
> A BenchmarkerMethod appeared only in  BenchmarkerTask.method, and can be an async or sync method.<br>
> In case of **async method** (when the `async` field in the task option is set to `true`), it will provided with `done` callback for the first argument, the rest of the argument configured (via `args` field or with `genArgs` field in the task options) will follow after.<br> 
> To resolve the method, just like a Promise, the `done` callback must be called, it takes `(err?: any, result?: any)`, to 'reject' / throw error, you need to provide it with a first argument (!= undefined), or just `throw` an error.<br>
> In case of a **sync method** (when the `async` field in the task option not defined, or set to `false`) it will provided with the argument configured (via `args` field or with `genArgs` field in the task options).

#### &raquo; Sync Method :
```ts
(...args: any[]) => any;
```

#### &raquo; Async Method : 

```ts
(done: (err?: any, result?: any) => any, ...args: any[]) => any;
```

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
| equalArgs | ➖ | boolean | If set to `true`, the arguments provided to the first task `method`, will be provided to all the tasks `method` in the group.<br>The backlash of using it will cause the benchmarking to apply the number of cycles of the first task to the entire group (ignore the other tasks cycles). |

[Abstract Example of group.options.equalArgs effects](#abstract-example-of-groupoptionsequalargs-effects)

<br>


### **System Objects Interfaces**
Objects provided to the user, as an output of the benchmarker system.

<br>

#### BenchmarkerTaskReport

> Object that contain all the relevant information gathered while benchmarking the current task.

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| stats | ✔ | DurationStats | statistics information about the benchmarked method duration. |
| cycles | ✔ | number | the number of times the `BenchmarkerTask.method` was called and benchmarked. |
| taskName | ➖ | string | if provided on `BenchmarkerOptions`, else `undefined`. |
| methodName | ✔ | string | `BenchmarkerTask.method.name` value. |
| async | ✔ | boolean | Indicate if the method in this task was handled as async method

<br>

#### DurationStats

> Object that contain statistics information about the benchmarked method duration. <br>
> All the values are in ms ,where the value under the floating point is micro-sec.

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| average | ✔ | number | The duration average of all the cycles elapsed time. |
| min | ✔ | number | The min duration from all the cycles elapsed time. |
| max | ✔ | number | The max duration from all the cycles elapsed time. |

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
|_env | ✔ | { nodeVersion: string, pid: number } | `nodeVersion` get the value of `process.versions.node`. <br>`pid` get the value of `process.pid`.| 

<br>

### **System Errors**

#### MissingFileNamePatternError
If the `o-benchmarker` command is called with no 'file-pattern' argument a `MissingFileNamePatternError` error will be thrown.

#### NoTasksDetectedError
When the task-scanner have not detected any valid tasks a `NoTasksDetectedError` error will be thrown.
the task-scanner scan for any files that matches the provided file-pattern, then attempt to parse each object that was export from those files. a `NoTasksDetectedError` can be thrown if all the detected files failed the parsing process.

#### RoundCallError
When an error is thrown from a task method, the error the original error will be catch, wrapped with a `RoundCallError` error and thrown, this will cause to the termination of the benchmarking process of the whole group this task is attached to.<br>
`RoundCallError` error object contains additional data about the 'round call' / cycle that the original error accrued, (the original error, arguments array, cycle number, etc). 

#### TimeoutError
If a timeout value defined on a async task options object, (), and the execution time of the task method exceeded (on any cycle, even one) a `TimeoutError` error will be thrown, this will cause to the termination of the benchmarking process of the whole group this task is attached to.  

<br><hr>


## **Example Use Cases**

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
   *      Stats :
   *       • average : 11.175916998147964
   *       • min : 11.19375491142273
   *       • max : 16.52028512954712
   *      Cycles : 1000
   *      Executed-Method : pbkdf2SyncRandomArray
   *      Async : false
   *
   *
   * 2 - PBKDF2 from random array
   *      Stats :
   *       • average : 11.520557561635972
   *       • min : 11.297967195510864
   *       • max : 19.861872911453247
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
   *      Stats :
   *       • average : 6.675018615000004
   *       • min : 6.122553110122681
   *       • max : 10.414806127548218
   *      Cycles : 1000
   *      Executed-Method : pbkdf2RandomArray
   *      Async : true
   *
   *
   * 2 - PBKDF2 sync from random array
   *      Stats :
   *       • average : 7.083556311000008
   *       • min : 6.31581506729126
   *       • max : 10.763312816619873
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

With all the great build-in function in Es6 there's a lot of short and fancy ways to do any action, <br>
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
   *      Stats :
   *       • average : 0.018990793228149415
   *       • min : 0.009816884994506836
   *       • max : 0.8303000926971436
   *      Cycles : 1000
   *      Executed-Method : findMaxOldSchool
   *      Async : false
   *
   *
   * 2 - Fancy style find max
   *      Stats :
   *       • average : 0.028814313650131224
   *       • min : 0.019633769989013672
   *       • max : 0.6951258182525635
   *      Cycles : 1000
   *      Executed-Method : findMaxFancy
   *      Async : false
   *
   *
   * 3 - Fancy Reduce style find max
   *      Stats :
   *       • average : 0.16180536580085755
   *       • min : 0.11704897880554199
   *       • max : 1.5752661228179932
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


<br>

### Abstract Example of group.options.equalArgs effects

Lets take the following :
```ts
... 

function sum(array) { // return the sum of the array }
function max(array) { // return the max in the array }
function min(array) { // return the min in the array }

const SumBenchmarkerTask : BenchmarkerTask = {
    method: sum, args: undefined, 
    options: { 
        taskName: 'sum of random array',
        cycles: 100, 
        argsGen: function () { return [randomArray(10)] } 
    }
};
const MaxBenchmarkerTask : BenchmarkerTask = {
    method: max, args: undefined, 
    options: { 
        taskName: 'max of random array',
        cycles: 50, 
        argsGen: function () { return [randomArray(10)] } 
    }
}; 
const MinBenchmarkerTask : BenchmarkerTask = {
    method: min, args: [2, 12, 3, 54, 4, 63], 
    options: { 
        taskName: 'min of random array',
        cycles: 70, 
    }
};
export const SimpleExampleGroup: BenchmarkerTasksGroup = {
    groupDescription: 'Simple Example',
    options: { equalArgs: true },
    tasks: [ SumBenchmarkerTask, MinBenchmarkerTask, MaxBenchmarkerTask ]
};
```
In case `SimpleExampleGroup.options.equalArgs` is not defined : <br>
In the tasks of `sum` and `max`, `args` field is `undefined`, so `options.argsGen` will be used to generate arguments on each execution cycle. <br>
In the task of `min`, `args` field is defined, so it will be provided on each execution cycle of this task.<br>
This will be resulted with **each task will be benchmark independently**, so :

| method \ cycle  | 0                 | 1                 | 2                 | ...   | 99                 |
| :---:           | :---:             | :---:             | :---:             | :---: | :---:              |
|  sum            | [rand_array_A_01] | [rand_array_A_02] | [rand_array_A_03] | ...   | [rand_array_A_100] |

| method \ cycle  | 0                 | 1                 | 2                 | ...   | 69                |
| :---:           | :---:             | :---:             | :---:             | :---: | :---:             |
|  max            | [rand_array_B_01] | [rand_array_B_02] | [rand_array_B_03] | ...   | [rand_array_B_70] |

| method \ cycle  | 0                    | 1                    | 2                    | ...   | 49                   |
| :---:           | :---:                | :---:                | :---:                | :---: | :---:                |
|  min            | [2, 12, 3, 54, 4, 63] | [2, 12, 3, 54, 4, 63] | [2, 12, 3, 54, 4, 63] | ...   | [2, 12, 3, 54, 4, 63] |

`sum` will be provided with a new random array on each cycle, same for `max`,  `min` provided with `[2, 12, 3, 54, 4, 63]` rapidity.


In a case `SimpleExampleGroup.options.equalArgs` is set to `true` : <br> 
The **tasks will be benchmark horizontally**, the first task `args` / `options.argsGen` and `options.cycles` will be applied to all the tasks :

| method \ cycle  | 0               | 1               | 2               | ...   | 99               |
| :---:           | :---:           | :---:           | :---:           | :---: | :---:            |
|  sum            | [rand_array_01] | [rand_array_02] | [rand_array_03] | ...   | [rand_array_100] |
|  min            | [rand_array_01] | [rand_array_02] | [rand_array_03] | ...   | [rand_array_100] |
|  max            | [rand_array_01] | [rand_array_02] | [rand_array_03] | ...   | [rand_array_100] |

`sum`, `min` and `max` will be provided with the same value returned from the **first task** `options.argsGen`, so on each cycle, sum, min, and max will be provided with the same array, additionally `sum`, `min` and `max` will be benchmarked for 100 cycles, according to the **first task** `options.cycles` value.

<br>



### Express & Supertest combo 

This example is a code piece (the relevant part) of a web-crawler app using `o-benchmarker` for time performance measuring.<br>
First there's a common and simple server setup using express, on that server there's a `GET: '/:lat,:lon'` route (get lat and lon and response with live data about the weather).<br>
In the second part there's benchmarker suite, with `invokeRouteLatLon` method to benchmark, in that method, using supertest, we mocking a request to `GET : '/:lat,:lon'` route, and wrapping it in a task object, and in a tasksGroup object.

```ts
class ExpressApp {
    app: express.Application;
    port = 3000;
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.get('/:lat,:lon', (req, res) => { ... }); // <-- benching target
    }
}
const { app, port } = new ExpressApp();
app.listen(port, () => {
//     console.log(`up on port ${port}.`);
});

export { app };
```

Notice, the `invokeRouteLatLon` method invoke an API route - an asynchronous action, there for the task is marked as an async, and the method receive a `done` callback as the first parameter, so it could be resolve/reject.
The cycles value for this task is relatively much more smaller then any other task, that because the invoked route perform a web-crawling action (meaning it send a request to a remote url & dom scanning), so the expected duration for a single cycle is relatively long, 0.5 -1.5 sc, 100 cycles can take up to 2 min. 
In cases where the expected duration for a single cycle is long, adjust the `cycles` amount accordingly.

```ts
import { BenchmarkerTask, BenchmarkerTasksGroup } from 'o-benchmarker';
import * as request from 'supertest';
import { app } from '../../../server'

function invokeRouteLatLon(done, lat: number, lon: number) {
    request(app).get(`/${lat},${lon}`)
    .expect(200, done);
};

const InvokeRouteLatLonTask: BenchmarkerTask = {
    method: invokeRouteLatLon,
    args: [40,120],
    options: {
        async : true,
        cycles: 10,
        taskName: `Invoke '/:lat,:lon' route`
    }
}

export const ApiTasksGroup: BenchmarkerTasksGroup = {
    groupDescription: 'Api Tasks Group',
    tasks: [ InvokeRouteLatLonTask ],
}
```

The resulted Tasks-Report from the above;

```sh
   *  -- Api Tasks Group --
   *
   * 1 - Invoke '/:lat,:lon' route
   *      Duration-Average : 1704.6427693128585
   *      Cycles : 10
   *      Executed-Method : invokeRouteLatLon
   *      Async : true
   *
   *
   * Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4
   * win32 x64 - Windows_NT
   ***
```

Note: Supertest module used here only to mock a request, you can use any mocking tool you've got, but you can see how they fit together.

[glob pattern]: <https://en.wikipedia.org/wiki/Glob_(programming)>


