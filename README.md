# o-benchmarker
O-Benchmarker - node.js benchmarking framework

## Installation
#### NPM
```sh
npm i o-benchmarker -S
```


## Short Intro
To first understand the general system interaction refer to any unfamiliar objects by there names (each one will be explained soon).<br>
The **O-Benchmarker** tool process "benchmarker-tasks" existing on your project, benchmark them and provide a "benchmarking-report" about the the benchmarking performance (the report is printed to current procces terminal).<br>
Generaly, the "benchmarker-task" file is exporting a specific object represent a tasks group to be measure agains each other (a group can contain one task as well), the "benchmarker-task" file name follows some pattern, used by the tool to detect for tasks.


## Usage
A little setup before creating a "benchmarker-task".

**O-Benchmarker** package is shipped with the following script :
```sh
o-benchmarker [file-name-pattern] [minfo-flag?]
```

By executing that script the benchmarking process will be trigerd. <br>
`o-benchmarker` script takes two arguments (as shown above) : <br>
The first argument [required] is a [glob pattern] to detact for files to procces and benchmark.<br>
The second argument [optional] is `minfo` flag, if present the benchmarking report will include the executing machine info. 


On `package.json` add a new script (E.g. "benchmark") to the `scripts` property, executing `o-benchmarker` script with the relevent parameters.<br>

Example
```sh
"scripts" : {
  "benchmark" : "o-benchmarker **/*.benchmark.ts minfo" 
}
```
the following will look in your project for files matching the `**/*.benchmark.ts` glob pettern, process its exports and attempt to benchmark it, the preduces report will include the the executing machine info.


## Create BenchmarkerTask 


## Create BenchmarkerMeasureGroup


[glob pattern]: <https://en.wikipedia.org/wiki/Glob_(programming)>
