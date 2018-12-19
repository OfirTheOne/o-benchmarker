import { performance } from 'perf_hooks';
import * as fs from 'fs';
import { expect } from 'chai';
import { stub } from 'sinon';
import { PromiseLand, AsyncCallback, SyncCallback } from './../../lib/internal/utils/promise-land';
import { TimeoutError } from './../../lib/internal/sys-error/errors';

const findInText: SyncCallback = function findInText(text: string, subText: string): number {
    let index = -1;
    if(subText.length == text.length) { 
        index = (subText == text ? 0 : -1);
    } else if(subText.length < text.length) {
        index = text.search(subText);
    }
    return index;
}

const getFileState: AsyncCallback = function findInText(done, path: string): void {
    fs.stat(path, (err, state) => {
        done(err, state)
    })
}

describe('PromiseLand - promisifyCallback testing.', function () {
    it('PromiseLand.promisifyCallback should promisify a sync function that return the expected result.',  function (done) {
        // this.skip();
        // this.enableTimeouts();
        // this.timeout(5000);
        const originalMethod = findInText
        const args = ['hello everyone', 'llo ev'];
        const expectedResult = 2;

        const promisedMethod = PromiseLand.promisifyCallback(originalMethod, args, false);
        promisedMethod.then((result) => {
            expect(result).to.be.equal(expectedResult);
            done();
        })
        .catch((error) => {
            done(error)
        });
    });
    it('PromiseLand.promisifyCallback should promisify an async function that return the expected result.',  function (done) {
        // this.skip();
        // this.enableTimeouts();
        // this.timeout(5000);
        const originalMethod = getFileState;
        const args = ['./.gitignore'];

        const promisedMethod = PromiseLand.promisifyCallback(originalMethod, args);
        promisedMethod.then((result) => {
            expect(result).to.be.not.be.undefined;
            expect(result).to.have.any.keys(['uid', 'size', 'blksize', 'birthtime']);
            done();
        })
        .catch(done);
    });
    it('PromiseLand.promisifyCallback should promisify a sync function that throw an error.',  function (done) {
        // this.skip();
        const expectedError = new Error('fake error')
        const originalMethod = stub({findInText}, 'findInText').throws(expectedError); 
        
        const args = ['hello everyone', 'llo ev'];
        const promisedMethod = PromiseLand.promisifyCallback(originalMethod, args, false);
        promisedMethod.then(() => {
            originalMethod.restore();            
            done();
        })
        .catch((error) => {
            expect(error).to.be.not.be.undefined;
            expect(error).to.be.equal(expectedError);
            originalMethod.restore();
            done();
        });
    });
    it('PromiseLand.promisifyCallback should promisify an async function that that throw an error.',  function (done) {
        // this.skip();
        const expectedError = new Error('fake error');
        const originalMethod = stub({getFileState}, 'getFileState').throws(expectedError); 
        const args = ['./.gitignore'];

        const promisedMethod = PromiseLand.promisifyCallback(originalMethod, args);
        promisedMethod.then(() => {
            originalMethod.restore();            
            done();
        })
        .catch((error) => {
            expect(error).to.be.not.be.undefined;
            expect(error).to.be.equal(expectedError);
            done();
        });
    });
});

describe('PromiseLand - timerifyCallback testing.', function () {
    it('PromiseLand.timerifyCallback should promisify a sync function that return the expected result.',  function (done) {
        // this.enableTimeouts();
        // this.timeout(5000);
        const originalMethod = findInText
        const args = ['hello everyone', 'llo ev'];
        const expectedResult = 2;

        const beforeStart = performance.now();
        const promisedMethod = PromiseLand.timerifyCallback(originalMethod, args, false);
        const afterEnd = performance.now()

        promisedMethod.then((result) => {
            expect(result).to.include.keys(['resolvedWith', 'start' ,'end', 'duration']);
            expect(result.start).to.be.gt(beforeStart);
            expect(result.end).to.be.lt(afterEnd);
            expect(result.resolvedWith).to.be.equal(expectedResult);

            done();
        })
        .catch((error) => {
            done(error)
        });
    });
    it('PromiseLand.timerifyCallback should promisify an async function that return the expected result.',  function (done) {
        // this.enableTimeouts();
        // this.timeout(5000);
        const originalMethod = getFileState;
        const args = ['./.gitignore'];

        const beforeStart = performance.now();
        const promisedMethod = PromiseLand.timerifyCallback(originalMethod, args);
        
        promisedMethod.then((result) => {
            const afterEnd = performance.now();
            expect(result).to.be.not.be.undefined;
            expect(result).to.include.keys(['resolvedWith', 'start', 'end', 'duration']);
            expect(result.start).to.be.gt(beforeStart);
            expect(result.end).to.be.lt(afterEnd);
            expect(result.resolvedWith).to.have.any.keys(['uid', 'size', 'blksize', 'birthtime']);
            done();
        })
        .catch(done);
    });
    it('PromiseLand.timerifyCallback should promisify an async with timeout and resolve.',  function (done) {
        // this.enableTimeouts();
        this.timeout(2000);
        const originalMethod = function doWork(done, time: number) { 
            const now = Date.now();
            while(Date.now() - now < time) { } 
            done();
        };
        const args = ['1000'];

        const beforeStart = performance.now();
        const promisedMethod = PromiseLand.timerifyCallback(originalMethod, args, true, { timeout: 2000 });
        
        promisedMethod.then((result) => {
            const afterEnd = performance.now();
            expect(result).to.be.not.be.undefined;
            expect(result).to.include.keys(['resolvedWith', 'start', 'end', 'duration']);
            expect(result.start).to.be.gt(beforeStart);
            expect(result.end).to.be.lt(afterEnd);
            // expect(result.resolvedWith).to.have.any.keys(['uid', 'size', 'blksize', 'birthtime']);
            done();
        })
        .catch(done);
    });


    it('PromiseLand.timerifyCallback should promisify a sync function that throw an error.',  function (done) {
        const expectedError = new Error('fake error')
        const originalMethod = stub({findInText}, 'findInText').throws(expectedError); 
        
        const args = ['hello everyone', 'llo ev'];
        const promisedMethod = PromiseLand.timerifyCallback(originalMethod, args, false);
        promisedMethod.then(() => {
            originalMethod.restore();            
            done();
        })
        .catch((error) => {
            expect(error).to.be.not.be.undefined;
            expect(error).to.be.equal(expectedError);
            originalMethod.restore();
            done();
        });
    });
    it('PromiseLand.timerifyCallback should promisify an async function that throw an error.',  function (done) {
        const expectedError = new Error('fake error');
        const originalMethod = stub({getFileState}, 'getFileState').throws(expectedError); 
        const args = ['./.gitignore'];

        const promisedMethod = PromiseLand.timerifyCallback(originalMethod, args);
        promisedMethod.then(() => {
            originalMethod.restore();            
            done();
        })
        .catch((error) => {
            expect(error).to.be.not.be.undefined;
            expect(error).to.be.equal(expectedError);
            done();
        });
    });
    it('PromiseLand.timerifyCallback should promisify an async function and throw a timeout error.',  function (done) {
        const twoSecondsJob = function (done , a, b) {
            const clock = setTimeout(() => { 
                    clearTimeout(clock);
                    done(undefined, a+b); 
                }, 2000
            );
        }
        // const expectedErrorMessage = 'timeout excited !';
        const timeout = 500;
        const args = [5, 10];
        const expectedError = new TimeoutError(timeout);

        const promisedMethod = PromiseLand.timerifyCallback(twoSecondsJob, args, true, { 
            timeout, 
            errorCtor: TimeoutError 
        });
        promisedMethod.then( () => done(new Error('should not resolve.')) )
        .catch((error) => {
            expect(error).to.be.not.be.undefined;
            expect((error as Error).message).to.be.equal(expectedError.message);
            done();
        });
    });
});