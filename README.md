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
A little setup is needed : <br>

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


## Create BenchmarkerTask 


## Create BenchmarkerMeasureGroup


[glob pattern]: <https://en.wikipedia.org/wiki/Glob_(programming)>
