# o-benchmarker
O-Benchmarker - node.js benchmarking framework


## Installation
#### NPM
```sh
npm i o-benchmarker -S
```


## Usage
```sh
o-benchmarker [file-name-pattern] [minfo-flag?]
```

The benchmarking process trigerd by executing the `o-benchmarker` script (shipped with the package). <br>
`o-benchmarker` script takes two arguments (as shown above).<br>
The first argument [required] is a [glob pattern] to detact for files to procces and benchmark.<br>
The second argument [optional] is `minfo` flag, if present the benchmarking report will include the executing machine info. 


On `package.json` add new script (E.g. "benchmark") to the `scripts` property, exuting `o-benchmarker` script with the relevent parametes.<br>
```sh
"scripts" : {
  "benchmark" : "o-benchmarker **/*.benchmark.ts minfo" 
}
```
the following will look in your project for files matching the `**/*.benchmark.ts` glob pettern, process its exports and attempt to benchmark it, the preduces report will include the the executing machine info.


## Create BenchmarkerTask 


## Create BenchmarkerMeasureGroup


[glob pattern]: <https://en.wikipedia.org/wiki/Glob_(programming)>
