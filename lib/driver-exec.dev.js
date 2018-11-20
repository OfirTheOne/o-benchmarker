#!/usr/bin/env node

// NOTE: this file will be dismissed on build  

const shell = require('shelljs');

const driverPath = './lib/driver.ts';

const passingArgs = process.argv.splice(2).join(' ');
const shCommand = `ts-node ${driverPath} ${passingArgs}`;

if (!shell.which('ts-node')) {
    shell.echo('Sorry, this script requires ts-node');
    shell.exit(1);
}
const execCode = shell.exec(shCommand).code;
if(execCode !== 0) {
    shell.echo('O-Benchmarker Error: o-benchmarker driver failed.');
    shell.exit(1);
}