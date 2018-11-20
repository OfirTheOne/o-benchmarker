#!/usr/bin/env node
import * as shell from 'shelljs';
import * as path from 'path';
import * as appRoot from 'app-root-path';

const driverPath = path.join(appRoot.toString(), '/node_modules/o-benchmarker/dist/driver.js'); 
const passingArgs = process.argv.splice(2).join(' ');
const shCommand = `ts-node \"${driverPath}\" ${passingArgs}`;

if (!shell.which('ts-node')) {
    shell.echo('Sorry, this script requires ts-node');
    shell.exit(1);
}
const execCode = shell.exec(shCommand).code;
if(execCode !== 0) {
    shell.echo('O-Benchmarker Error: o-benchmarker driver failed.');
    shell.exit(1);
}