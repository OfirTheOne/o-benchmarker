#!/usr/bin/env node
const shell = require('shelljs');
const os = require('os');


const SUPPORTED_OS_PLATFORM = { lin: 'linux', mac: 'darwin', win: 'win32', };

const mochaScript = 'mocha --require ts-node/register tests/**/*.test.ts';
const testWin = `SET NODE_ENV=test&& ${mochaScript}`;
const testLinOrMac = `NODE_ENV=test&& ${mochaScript}`;

const currentOs = os.platform();
let testScript = '';

switch (currentOs) {
    case SUPPORTED_OS_PLATFORM.mac:
    case SUPPORTED_OS_PLATFORM.lin:
        testScript = testLinOrMac
        break;

    case SUPPORTED_OS_PLATFORM.win:
        testScript = testWin;
        break;
    default:
        break;
}

const statusCode = shell.exec(testScript).code;
if(statusCode != 0) {
    shell.echo('exec test script failed');
    shell.exit(1);
}