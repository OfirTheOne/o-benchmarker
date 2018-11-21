# o-benchmarker
O-Benchmarker - node.js benchmarking framework

## Installation
#### NPM
```sh
npm i o-benchmarker -S
```


## Short Intro
To first understand the general system interaction refer to any unfamiliar objects by there names (each one will be explained soon).<br>
The **O-Benchmarker** tool process any "benchmarker-tasks" existing in your project, benchmark them and provide a "benchmarking-report" with information about the benchmarking performance (the report is printed to current procces terminal).<br>
Generaly, the "benchmarker-task" file is exporting a specific object represent a tasks group to be measure agains each other (a group can contain one task as well), the "benchmarker-task" file name follows some pattern, used by the tool to detect the task file.


## Usage

#### Setup entrypoint script : <br>

**O-Benchmarker** package is shipped with the following script :
```sh
o-benchmarker [file-name-pattern] [minfo-flag?]
```
By executing that script the benchmarking process will be trigerd. <br><br>

`o-benchmarker` script takes two arguments (as shown above) : <br>

* `file-name-pattern` - [required] is a [glob pattern] to detact for any files to be procces as tasks and benchmark.
* `minfo-flag` - [optional] is flag with the literal name "minfo", if present the benchmarking report will include the executing machine info. 


On `package.json` add a new script (E.g. "benchmark") to the `scripts` property, executing the `o-benchmarker` script with the relevent parameters.<br>

Example :
```sh
"scripts" : {
  "benchmark" : "o-benchmarker **/*.benchmark.ts minfo" 
}
```
The following will triger the O-Benchmarker to look in your project for any files matching the `**/*.benchmark.ts` glob pettern, process their exported object and attempt to benchmark it. The preduced report will include the executing machine info.


#### Create BenchmarkerTask 


#### Create BenchmarkerMeasureGroup

## API reference 

#### BenchmarkerTask

| property | required | type |description|
| ------ | ------ | ------ | ------ |
| method | ✔ | BenchMethod | the targeted method to benchmark. |
| args | ✔ | any[] | arguments provided to the method while benchmarking. |
| options | ✔ | BenchmarkerOptions | opitions for better configured task.  |

<br>

#### BenchmarkerOptions

| property | required | type |description|
| ------ | ------ | ------ | ------ |
| taskName | ➖ | string | name to describe the task, if defined, it will be included in the `BenchmarkerReport`. |
| cycles | ✔ | number | the number of times the `BenchmarkerTask.method` will be called and benchmarked. |
| argsGen | ➖ | ()=>any | method that ganerate arguments for `BenchmarkerTask.method`, it's repeatedly called on each benchmarking cycle, if defined `BenchmarkerTask.args` will be ignored. |

<br>

#### BenchMethod

```ts
(...args: any[]) => any;
```

<br>

#### BenchmarkerReport

| property | required | type |description|
| ------ | ------ | ------ | ------ |
| durationAverge | ✔ | number | the duration avareage resulted from summing the duration of each benchmark cycle measurment and dividing it by `BenchmarkerOptions.cycles`. |
| cycles | ✔ | number | the number of times the `BenchmarkerTask.method` was called and benchmarked. |
| taskName | ➖ | string | if provided on `BenchmarkerOptions`, else `undefined`. |
| methodName | ✔ | string | `BenchmarkerTask.method.name` value. |

<br>

#### BenchmarkerMeasureGroup

| property | required | type |description|
| ------ | ------ | ------ | ------ |
| groupName | ➖ | string | short name for the group, displayed as a title in `BenchmarkerMeasureGroupReport` printout. |
| groupDescription | ✔ | string | short text to describe the tasks group. |
| tasks | ✔ | BenchmarkerTask[] | array of tasks to be beanchmarked and measured agains each other. |










[glob pattern]: <https://en.wikipedia.org/wiki/Glob_(programming)>

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
```
TODOS : 

change BenchmarkerOptions to BenchmarkerTaskOptions
add contaxt property to BenchmarkerTask
```
