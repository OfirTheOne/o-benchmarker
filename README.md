# o-benchmarker
O-Benchmarker - node.js benchmarking framework

## Installation
#### NPM
```sh
npm i o-benchmarker
```
recommend to install with `-D` flag.

## Short Intro
To first understand the general system interaction refers to any unfamiliar objects by there names (each one will be explained soon).<br>
The *O-Benchmarker* tool process any "benchmarker-tasks" existing in your project, benchmark them and provide a "benchmarking-report" with information about the benchmarking performance (the report is printed to current process terminal).<br>
Generally, the "benchmarker-task" file is exporting a specific object represent a tasks group to be measured against each other (a group can contain one task as well), the "benchmarker-task" file name follows some pattern, used by the tool to detect the task file.

<br>

## Usage

#### Setup entrypoint script : <br>

*O-Benchmarker* package is shipped with the following script :
```sh
o-benchmarker [file-name-pattern] [minfo-flag?]
```
By executing that script the benchmarking process will be triggered. <br>

`o-benchmarker` script takes two arguments (as shown above) : <br>

* `file-name-pattern` - [required] is a [glob pattern] to detect for any files to be processed as tasks and benchmark.
* `minfo-flag` - [optional] is flag with the literal name "minfo", if present the benchmarking report will include the executing machine info. 


On `package.json` add a new script (E.g. "benchmark") to the `scripts` property, executing the `o-benchmarker` script with the relevant  parameters.<br>

Example :
```sh
"scripts" : {
  "benchmark" : "o-benchmarker **/*.benchmark.ts minfo" 
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
        cycles: 10000, 
        argsGen: function () { return [randomArray()] } 
    }
};
```
 
#### Create BenchmarkerMeasureGroup
When you got all the tasks, you would like to group together, sort out, you can move to define the [`BenchmarkerMeasureGroup`](#BenchmarkerMeasureGroup) object. <br>
A good practice will be to define the group on a separate file (and to name that file according to the glob pattern you chose). 
Simply define the group object and export it for <br>

Example : (continue the previous)
```ts
import { myBenchmarkerTask } from './my-benchmarker-task';
import { otherBenchmarkerTask } from './other-benchmarker-task'; // assume we got another benchmark task

import { BenchmarkerMeasureGroup } from 'o-benmarker'

export const myBenchmarkerMeasureGroup: BenchmarkerMeasureGroup = {
    groupDescription: 'Example for tasks group benchmarking',
    tasks: [
        myBenchmarkerTask,
        otherBenchmarkerTask,
    ]
};
```

From there, executing the `o-benchmarker` script will trigger the benchmarking process.<br>
The `myBenchmarkerMeasureGroup` object will be imported, process and benchmark.

This will result with a `BenchmarkerMeasureGroupReport` object printed to the terminal : <br>
```
   * -- Example for tasks group benchmarking --
   *
   * 1 - Some Calculation
   *      Duration-Average : 0.019799838199999867
   *      Cycles : 10000
   *      Executed-Method : myMethodCaller
   *
   *
   * 2 - Other Calculation
   *      Duration-Average : 0.045470597599990926
   *      Cycles : 10000
   *      Executed-Method : otherMethodCaller
   *
   *
   * Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4
   * win32 x64 - Windows_NT
   ***
```

*Notes* : <br>
At the bottom of the report, you can see the info of the executed machine (`minfo` flag was provided to `o-benchmarker` script).<br>
The tasks displayed in a sorted order by "Duration-Average" value.<br>
If multiple "benchmarker-tasks" files are processed, the reports will be printed one after each the other.<br> 
As soon as a tasks group finished being benchmarked the resulted report will be printed (meaning that the reports will not be printed altogether).  


<br>

## API reference 

#### BenchmarkerTask

> doc soon

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| method | ✔ | BenchMethod | the targeted method to benchmark. |
| args | ✔ | any[] | arguments provided to the method while benchmarking. |
| options | ✔ | BenchmarkerOptions | options for a better-configured task.  |

<br>

#### BenchmarkerOptions

> doc soon

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| taskName | ✔ | string | name to describe the task, included in the `BenchmarkerReport`. |
| cycles | ✔ | number | the number of times the `BenchmarkerTask.method` will be called and benchmarked. |
| argsGen | ➖ | ()=>any | a method that generates arguments for `BenchmarkerTask.method`, it's repeatedly called on each benchmarking cycle, if defined `BenchmarkerTask.args` will be ignored. |

<br>

#### BenchMethod

> doc soon

```ts
(...args: any[]) => any;
```

<br>

#### BenchmarkerReport

> doc soon

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| durationAverage | ✔ | number | the duration average resulted from summing the duration of each benchmark cycle measurement and dividing it by `BenchmarkerOptions.cycles`. |
| cycles | ✔ | number | the number of times the `BenchmarkerTask.method` was called and benchmarked. |
| taskName | ➖ | string | if provided on `BenchmarkerOptions`, else `undefined`. |
| methodName | ✔ | string | `BenchmarkerTask.method.name` value. |

<br>

#### BenchmarkerMeasureGroup

> Object that wraps an array of tasks, with additional configure properties.<br> 
> This is the object expected to be export on each "benchmark task" file (a file with a name matching the glob pattern provided to `o-benchmarker script`).<br>
> If a different object will be exported the file will be ignored.

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| groupName | ➖ | string | a short name for the group displayed as a title in `BenchmarkerMeasureGroupReport` printout. |
| groupDescription | ✔ | string | a short text to describe the tasks group. |
| tasks | ✔ | BenchmarkerTask[] | an array of tasks to be benchmarked and measured against each other. |

<br>

#### BenchmarkerMeasureGroupReport

> doc soon

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| groupName | ➖ | string | doc soon |
| groupDescription | ✔ | string | doc soon |
| tasksReports | ✔ | BenchmarkerReport[] | doc soon |
| machineInfo | ✔ | MachineInfo | doc soon |

<br>

#### MachineInfo

> doc soon

| property | required | type | description |
| ------ | ------ | ------ | ------ |
| cpusModel | ✔ | string | doc soon |
| numberOfCpus | ✔ | number | doc soon |
| osPlatform | ✔ | string | doc soon |
| osName | ✔ | string | doc soon |
| osCpuArch | ✔ | string | doc soon |


<br>


[glob pattern]: <https://en.wikipedia.org/wiki/Glob_(programming)>

