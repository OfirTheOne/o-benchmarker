import { expect } from 'chai';

import { CommandParser } from './../../lib/internal/utils/command-parser';

describe('CommandParser testing', function () {

    it('basic data fetching testing, command as a string.', function () {
        const parser = new CommandParser();
        parser.parseCommand("node ./lib/driver-exec.dev.js **/*.benchmark.ts minfo --json printas=json")
        expect(parser.hasFlag('--json')).to.be.true;

        expect(parser.getParam('printas')).to.be.equal('json');
        expect(parser.getParam('printas=json')).to.be.undefined;

        expect(parser.hasPhrase('node')).to.be.true;
        expect(parser.hasPhrase('./lib/driver-exec.dev.js')).to.be.true;
        expect(parser.hasPhrase('**/*.benchmark.ts')).to.be.true;
        expect(parser.hasPhrase('minfo')).to.be.true;
        expect(parser.hasPhrase('printas')).to.be.false;
        expect(parser.hasPhrase('nodejs')).to.be.false;
    });

    it('basic data fetching testing, command as a string array', function () {
        const parser = new CommandParser();
        parser.parseCommand([ '**/*.benchmark.ts', '--json', '--minfo'])
        expect(parser.hasFlag('--json')).to.be.true;
        expect(parser.hasPhrase('**/*.benchmark.ts')).to.be.true;
        expect(parser.hasFlag('--minfo')).to.be.true; 
    });

    it('complex data fetching testing.', function () {
        const parser = new CommandParser();
        parser.parseCommand("node ./lib/driver-exec.dev.js **/*.benchmark.ts minfo --json printas=json")
        
        expect(parser.getPosition({name: 'node', role: 'phrase'})).to.be.equal(0);
        expect(parser.getPosition({name: 'node', role: 'flag'})).to.be.equal(-1);
        expect(parser.getPosition({name: 'printas', role: 'param'})).to.be.equal(5);
        expect(parser.getPosition({name: 'printas=json', role: 'param'})).to.be.equal(-1);
        expect(parser.getPosition({name: '--json', role: 'flag'})).to.be.equal(4);

        expect(parser.getAllAfterPosition(['flags', 'phrases'], 2)).to.be.deep.equal({
            flags: ['--json'],
            phrases: ['minfo']
        });
        expect(parser.getAllAfterPosition(['params'], 1)).to.be.deep.equal({
            params: [['printas','json']]
        });
        expect(parser.getAllAfterPosition(['flags', 'phrases', 'aliases', 'params'], -1)).to.be.deep.equal({
            flags: ['--json'],
            phrases: ['node', './lib/driver-exec.dev.js','**/*.benchmark.ts', 'minfo'],
            aliases: [],
            params: [['printas','json']]
        });
        expect(parser.getAllAfterPosition(['flags', 'phrases', 'params'], 10)).to.be.deep.equal({
            flags: [],
            phrases: [],
            params: [],
        });

        expect(parser.getAllAfter(['flags', 'phrases'], {name: 'minfo', role: 'phrase'})).to.be.deep.equal({
            flags: ['--json'],
            phrases: []
        });
        expect(parser.getAllAfter(['params'], {name: '--json', role: 'flag'})).to.be.deep.equal({
            params: [['printas','json']]
        });
        expect(parser.getAllAfter(['flags', 'aliases', 'params'], {name: 'fake', role: 'param'})).to.be.deep.equal({
            flags: [],
            aliases: [],
            params: []
        });
        expect(parser.getAllAfter(['flags', 'phrases', 'aliases'], {name: 'printas', role: 'param'})).to.be.deep.equal({
            flags: [],
            phrases: [],
            aliases: [],
        });
    });

})