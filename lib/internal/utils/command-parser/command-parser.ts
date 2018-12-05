
interface ParsedCommand { 
    flags: [string, number][], 
    aliases: [string, number][], 
    params: { key: string, value: string, position: number }[],
    phrases: [string, number][]
}

class ParserOptions {
    static DEFAULT_VALUES: ParserOptions = {
        flagMark: '--',
        aliasMark: '-',
        strict: false,
        caseSensitive:  false,
    };
    flagMark: string; 
    aliasMark: string; 
    strict: boolean;
    caseSensitive: boolean;

    constructor(options: Partial<ParserOptions> = {}) {
        this.flagMark = options.flagMark || ParserOptions.DEFAULT_VALUES.flagMark;
        this.aliasMark = options.aliasMark || ParserOptions.DEFAULT_VALUES.aliasMark;
        this.strict = options.strict || ParserOptions.DEFAULT_VALUES.strict;
        this.caseSensitive = options.caseSensitive || ParserOptions.DEFAULT_VALUES.caseSensitive;
    }
} 

class MapParsedCommand { 
    public flags: Map<string, number>;
    public aliases: Map<string, number>;
    public phrases: Map<string, number>;
    public params: Map<string, {value: string, position: number}>;

    constructor(rawParsedCommand: ParsedCommand) {
        this.flags = new Map<string, number>(rawParsedCommand.flags.splice(0));
        this.aliases = new Map<string, number>(rawParsedCommand.aliases.splice(0));
        this.phrases = new Map<string, number>(rawParsedCommand.phrases.splice(0));
        this.params = new Map<string, {value: string, position: number}>();

        rawParsedCommand.params.forEach(param => {
            this.params.set(param.key, {value: param.value, position: param.position});
        });
    }
}

type MaxFourItemsArray<T> =  [T]|[T,T]|[T,T,T]|[T,T,T,T];
type ObjectWithKeys<KEYS extends string, V=any> = {[key in KEYS]?  : V};


export class CommandParser {

    // seasonal value members
    private command: string;
    private rawParsedCommand: ParsedCommand;
    private mapParsedCommand: MapParsedCommand;
    private parserOptions: ParserOptions;
    private parserRegExp: { flags: RegExp, aliases: RegExp, params: RegExp, phrases: RegExp };
    
    constructor() {
        this.parserRegExp = {
            params: RegExp(/((?:^|\s)\w+\=\S+)/, 'gm'),
            flags: RegExp(/((?:^|\s)\-\-\w+)/, 'gm'),
            aliases: RegExp(/((?:^|\s)\-\w+)/, 'gm'),
            phrases: RegExp(/(\S+)/, 'gm')
        };
    }

    /**
     * @description Method start the season.<br> 
     *  Parse a shell-like command string to a 'ParsedCommand' object.
     * @param command String to parse and poll all flags, aliases and key-value params.
     * @return 'ParsedCommand' object contain flags, aliases and key-value params found in 'command'.
     */
    public parseCommand(command: string[], options?: ParserOptions): ParsedCommand;
    public parseCommand(command: string, options?: ParserOptions): ParsedCommand
    public parseCommand(command: string | string[], options?: ParserOptions): ParsedCommand {
        // this.parserOptions = new ParserOptions(options);
        // this.setRegExp(this.parserOptions);
        let allCommandPhrases: [string, number][];
        if(Array.isArray(command)) {
            this.command = command.join(' ');
            allCommandPhrases = command.map<[string, number]>((phrase, i) => [phrase, i]);
        } else {
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
    private breakToPhrases(command: string): [string, number][] {
        return CommandParser.getMatches(command, this.parserRegExp.phrases)
            .map<[string, number]>((phrase, i) => [phrase, i])
    }
    private filterMatches(phrasesToFiler: [string, number][], regexp: RegExp):
        { matches: [string, number][], filtered: [string, number][] } {
        const matches: [string, number][] = [];
        const filtered: [string, number][] = [];

        phrasesToFiler.forEach((phrase, i) => {
            if(regexp.test(phrase[0])) {
                matches.push(phrase);
            } else {
                filtered.push(phrase);
            }
            regexp.lastIndex = 0;
        });
        return  {filtered, matches};
    }
    private parseKeyValueString(keyValue: [string, number][]): { key: string, value: string, position: number }[] {
        const parsedKeysValues = keyValue.map<{ key: string, value: string, position: number }>(keyValue => {
            const split = keyValue[0].split('=');
            return (split.length == 2) ? 
                { key: split[0], value: split[1], position: keyValue[1] } :
                { key: undefined, value: undefined, position: keyValue[1] }
        });
        return parsedKeysValues;
    }
    // #endregion

    // #region - getters [seasonal]
    public getParserOptions(): Readonly<ParserOptions> {
        return Object.freeze(this.parserOptions);
    }
    public getParserRegExp() {
        return Object.freeze(this.parserRegExp);
    } 
    public getCommand(): Readonly<string> {
        return Object.freeze(this.command || '');
    }
    public getRawParsedCommand(): Readonly<ParsedCommand> {
        return this.rawParsedCommand ? Object.freeze(this.rawParsedCommand) : undefined; 
    }
    // #endregion

    // #region - command data fetch. [seasonal]
   
    // basic fetching
    public hasFlag(flag: string, alias?: string) {
        return this.mapParsedCommand && (this.mapParsedCommand.flags.has(flag) || this.mapParsedCommand.aliases.has(alias));
    }
    public hasAlias(alias: string) {
        return this.mapParsedCommand? this.mapParsedCommand.aliases.has(alias) : false;
    }
    public hasPhrase(phrase: string) {
        return this.mapParsedCommand? this.mapParsedCommand.phrases.has(phrase): false;
    }
    public getParam(param: string): string {
        return this.mapParsedCommand && this.mapParsedCommand.params.has(param) ? 
            this.mapParsedCommand.params.get(param).value : undefined;
    }
    public commandIncludes(text: string) : boolean {
        return this.command? this.command.includes(text) : false;
    }

    // complex fetching
    public getAllAfter(
        all: MaxFourItemsArray<'flags'|'aliases'|'phrases'|'params'>, 
        after: {name: string, role: 'flag'|'alias'|'phrase'|'param'}): 
        ObjectWithKeys<'flags'|'aliases'|'phrases'|'params',  (string[] | [string,string][])> {
            if(!this.mapParsedCommand) { return; }
            const targetPosition = this.getPosition(after);
            if(targetPosition > -1) {
                return this.getAllAfterPosition(all, targetPosition);
            } else {
                const emptyResult: ObjectWithKeys<'flags'|'aliases'|'phrases'|'params',  (string[] | [string,string][])> = {} 
                    ~all.indexOf('flags') ? emptyResult['flags'] =  [] : undefined;
                    ~all.indexOf('aliases') ? emptyResult['aliases'] =  [] : undefined;
                    ~all.indexOf('params') ? emptyResult['params'] =  [] : undefined;
                    ~all.indexOf('phrases') ? emptyResult['phrases'] =  [] : undefined;
                    return emptyResult;
            }
    }
    public getAllAfterPosition(
         all:(MaxFourItemsArray<'flags'|'aliases'|'phrases'|'params'>) , 
         position: number): ObjectWithKeys<'flags'|'aliases'|'phrases'|'params',  (string[] | [string,string][])> {
            if(!this.mapParsedCommand) { return; }        
            const allAfter: ObjectWithKeys<'flags'|'aliases'|'phrases'|'params',  (string[] | [string,string][])> = {};
            if(~all.indexOf('flags')) {
                const flags: string[] = [];
                this.mapParsedCommand.flags
                    .forEach((pos, flag) => pos>position ? flags.push(flag) : 0);
                allAfter.flags = flags;
            } if(~all.indexOf('aliases')) {
                const aliases: string[] = [];
                this.mapParsedCommand.aliases
                    .forEach((pos, alias) => pos>position ? aliases.push(alias) : 0);
                allAfter.aliases = aliases; 
            } if(~all.indexOf('phrases')) {
                const phrases: string[] = [];
                this.mapParsedCommand.phrases
                    .forEach((pos, phrase) => pos>position ? phrases.push(phrase) : 0);
                allAfter.phrases = phrases;
            } if(~all.indexOf('params')) {
                const params: [string,string][] = [];
                this.mapParsedCommand.params.forEach((param, key) => 
                    param.position>position ? params.push([key, param.value]) : 0);
                allAfter.params = params;
            }
            return allAfter;
    }
    public getPosition(target: {name: string, role: 'flag'|'alias'|'phrase'|'param'}): (number | -1) {
        if(!this.mapParsedCommand) { return; }        
        switch (target.role) {
            case 'flag':
                return this.mapParsedCommand.flags.has(target.name) ?
                    this.mapParsedCommand.flags.get(target.name) : -1
            case 'alias':
                return this.mapParsedCommand.aliases.has(target.name) ?
                    this.mapParsedCommand.aliases.get(target.name) : -1
            case 'phrase':
                return this.mapParsedCommand.phrases.has(target.name) ?
                    this.mapParsedCommand.phrases.get(target.name) : -1
            case 'param':
                return this.mapParsedCommand.params.has(target.name) ?
                    this.mapParsedCommand.params.get(target.name).position : -1
            default:
                break;
        }
    }

    // #endregion

    // #region - static [not seasonal]  
    public static getMatches(text: string, regex: RegExp): string[] {
        const matches = (text.match(regex) || []).map(match => match.trim());
        return matches;
    }
    // #endregion
    
}