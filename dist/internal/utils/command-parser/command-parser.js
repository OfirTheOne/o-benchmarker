"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParserOptions {
    constructor(options = {}) {
        this.flagMark = options.flagMark || ParserOptions.DEFAULT_VALUES.flagMark;
        this.aliasMark = options.aliasMark || ParserOptions.DEFAULT_VALUES.aliasMark;
        this.strict = options.strict || ParserOptions.DEFAULT_VALUES.strict;
        this.caseSensitive = options.caseSensitive || ParserOptions.DEFAULT_VALUES.caseSensitive;
    }
}
ParserOptions.DEFAULT_VALUES = {
    flagMark: '--',
    aliasMark: '-',
    strict: false,
    caseSensitive: false,
};
class MapParsedCommand {
    constructor(rawParsedCommand) {
        this.flags = new Map(rawParsedCommand.flags.splice(0));
        this.aliases = new Map(rawParsedCommand.aliases.splice(0));
        this.phrases = new Map(rawParsedCommand.phrases.splice(0));
        this.params = new Map();
        rawParsedCommand.params.forEach(param => {
            this.params.set(param.key, { value: param.value, position: param.position });
        });
    }
}
class CommandParser {
    constructor() {
        this.parserRegExp = {
            params: RegExp(/((?:^|\s)\w+\=\S+)/, 'gm'),
            flags: RegExp(/((?:^|\s)\-\-\w+)/, 'gm'),
            aliases: RegExp(/((?:^|\s)\-\w+)/, 'gm'),
            phrases: RegExp(/(\S+)/, 'gm')
        };
    }
    parseCommand(command, options) {
        // this.parserOptions = new ParserOptions(options);
        // this.setRegExp(this.parserOptions);
        let allCommandPhrases;
        if (Array.isArray(command)) {
            this.command = command.join(' ');
            allCommandPhrases = command.map((phrase, i) => [phrase, i]);
        }
        else {
            this.command = command;
            allCommandPhrases = this.breakToPhrases(command);
        }
        const commandFlags = this.filterMatches(allCommandPhrases, this.parserRegExp.flags);
        const commandAliases = this.filterMatches(commandFlags.filtered, this.parserRegExp.aliases);
        const commandParams = this.filterMatches(commandAliases.filtered, this.parserRegExp.params);
        const parsedParams = this.parseKeyValueString(commandParams.matches);
        this.rawParsedCommand = {
            flags: commandFlags.matches,
            aliases: commandAliases.matches,
            params: parsedParams,
            phrases: commandParams.filtered
        };
        this.mapParsedCommand = new MapParsedCommand(this.rawParsedCommand);
        return this.rawParsedCommand;
    }
    // #region - used on 'parseCommand' method
    /*
    private setRegExp(options: ParserOptions) {
        if(options) {
            this.parserRegExp.flags = new RegExp('((?:^|\\s)(?:'+ options.flagMark + ')\\w+)', 'g');
            this.parserRegExp.aliases = new RegExp('((?:^|\\s)(?:'+ options.aliasMark + ')\\w+)', 'g');
        }
    }
    */
    breakToPhrases(command) {
        return CommandParser.getMatches(command, this.parserRegExp.phrases)
            .map((phrase, i) => [phrase, i]);
    }
    filterMatches(phrasesToFiler, regexp) {
        const matches = [];
        const filtered = [];
        phrasesToFiler.forEach((phrase, i) => {
            if (regexp.test(phrase[0])) {
                matches.push(phrase);
            }
            else {
                filtered.push(phrase);
            }
            regexp.lastIndex = 0;
        });
        return { filtered, matches };
    }
    parseKeyValueString(keyValue) {
        const parsedKeysValues = keyValue.map(keyValue => {
            const split = keyValue[0].split('=');
            return (split.length == 2) ?
                { key: split[0], value: split[1], position: keyValue[1] } :
                { key: undefined, value: undefined, position: keyValue[1] };
        });
        return parsedKeysValues;
    }
    // #endregion
    // #region - getters [seasonal]
    getParserOptions() {
        return Object.freeze(this.parserOptions);
    }
    getParserRegExp() {
        return Object.freeze(this.parserRegExp);
    }
    getCommand() {
        return Object.freeze(this.command || '');
    }
    getRawParsedCommand() {
        return this.rawParsedCommand ? Object.freeze(this.rawParsedCommand) : undefined;
    }
    // #endregion
    // #region - command data fetch. [seasonal]
    // basic fetching
    hasFlag(flag, alias) {
        return this.mapParsedCommand && (this.mapParsedCommand.flags.has(flag) || this.mapParsedCommand.aliases.has(alias));
    }
    hasAlias(alias) {
        return this.mapParsedCommand ? this.mapParsedCommand.aliases.has(alias) : false;
    }
    hasPhrase(phrase) {
        return this.mapParsedCommand ? this.mapParsedCommand.phrases.has(phrase) : false;
    }
    getParam(param) {
        return this.mapParsedCommand && this.mapParsedCommand.params.has(param) ?
            this.mapParsedCommand.params.get(param).value : undefined;
    }
    commandIncludes(text) {
        return this.command ? this.command.includes(text) : false;
    }
    // complex fetching
    getAllAfter(all, after) {
        if (!this.mapParsedCommand) {
            return;
        }
        const targetPosition = this.getPosition(after);
        if (targetPosition > -1) {
            return this.getAllAfterPosition(all, targetPosition);
        }
        else {
            const emptyResult = {};
            ~all.indexOf('flags') ? emptyResult['flags'] = [] : undefined;
            ~all.indexOf('aliases') ? emptyResult['aliases'] = [] : undefined;
            ~all.indexOf('params') ? emptyResult['params'] = [] : undefined;
            ~all.indexOf('phrases') ? emptyResult['phrases'] = [] : undefined;
            return emptyResult;
        }
    }
    getAllAfterPosition(all, position) {
        if (!this.mapParsedCommand) {
            return;
        }
        const allAfter = {};
        if (~all.indexOf('flags')) {
            const flags = [];
            this.mapParsedCommand.flags
                .forEach((pos, flag) => pos > position ? flags.push(flag) : 0);
            allAfter.flags = flags;
        }
        if (~all.indexOf('aliases')) {
            const aliases = [];
            this.mapParsedCommand.aliases
                .forEach((pos, alias) => pos > position ? aliases.push(alias) : 0);
            allAfter.aliases = aliases;
        }
        if (~all.indexOf('phrases')) {
            const phrases = [];
            this.mapParsedCommand.phrases
                .forEach((pos, phrase) => pos > position ? phrases.push(phrase) : 0);
            allAfter.phrases = phrases;
        }
        if (~all.indexOf('params')) {
            const params = [];
            this.mapParsedCommand.params.forEach((param, key) => param.position > position ? params.push([key, param.value]) : 0);
            allAfter.params = params;
        }
        return allAfter;
    }
    getPosition(target) {
        if (!this.mapParsedCommand) {
            return;
        }
        switch (target.role) {
            case 'flag':
                return this.mapParsedCommand.flags.has(target.name) ?
                    this.mapParsedCommand.flags.get(target.name) : -1;
            case 'alias':
                return this.mapParsedCommand.aliases.has(target.name) ?
                    this.mapParsedCommand.aliases.get(target.name) : -1;
            case 'phrase':
                return this.mapParsedCommand.phrases.has(target.name) ?
                    this.mapParsedCommand.phrases.get(target.name) : -1;
            case 'param':
                return this.mapParsedCommand.params.has(target.name) ?
                    this.mapParsedCommand.params.get(target.name).position : -1;
            default:
                break;
        }
    }
    // #endregion
    // #region - static [not seasonal]  
    static getMatches(text, regex) {
        const matches = (text.match(regex) || []).map(match => match.trim());
        return matches;
    }
}
exports.CommandParser = CommandParser;
//# sourceMappingURL=command-parser.js.map