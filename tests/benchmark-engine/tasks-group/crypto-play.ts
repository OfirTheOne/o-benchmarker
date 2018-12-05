
import * as crypto from 'crypto';
import { BenchmarkerTasksGroup, BenchmarkerTask } from './../../../lib';
import { randomArray } from './../../helpers';

// import { CYCLES } from './../../consts';


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
        cycles: 100, 
        argsGen: function () { return [randomArray(100), randomArray(100)] } 
    }
};
const CryptoPBKDF2SyncBenchmarkerTask : BenchmarkerTask = {
    method: pbkdf2SyncRandomArray, 
    args: undefined, 
    options: { 
        taskName: 'PBKDF2 sync from random array',
        cycles: 100, 
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
}
