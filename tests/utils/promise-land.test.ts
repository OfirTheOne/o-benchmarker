import * as fs from 'fs';
import { expect } from 'chai';
import { stub } from 'sinon';
import { PromiseLand, AsyncCallback, SyncCallback } from './../../lib/internal/utils/promise-land';

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

describe('PromiseLand testing.', function () {
    it('PromiseLand.promisifyCallback should promisify a sync function that return the expected result.',  function (done) {
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