interface ParsedCommand {
    flags: [string, number][];
    aliases: [string, number][];
    params: {
        key: string;
        value: string;
        position: number;
    }[];
    phrases: [string, number][];
}
declare class ParserOptions {
    static DEFAULT_VALUES: ParserOptions;
    flagMark: string;
    aliasMark: string;
    strict: boolean;
    caseSensitive: boolean;
    constructor(options?: Partial<ParserOptions>);
}
declare type MaxFourItemsArray<T> = [T] | [T, T] | [T, T, T] | [T, T, T, T];
declare type ObjectWithKeys<KEYS extends string, V = any> = {
    [key in KEYS]?: V;
};
export declare class CommandParser {
    private command;
    private rawParsedCommand;
    private mapParsedCommand;
    private parserOptions;
    private parserRegExp;
    constructor();
    /**
     * @description Method start the season.<br>
     *  Parse a shell-like command string to a 'ParsedCommand' object.
     * @param command String to parse and poll all flags, aliases and key-value params.
     * @return 'ParsedCommand' object contain flags, aliases and key-value params found in 'command'.
     */
    parseCommand(command: string[], options?: ParserOptions): ParsedCommand;
    parseCommand(command: string, options?: ParserOptions): ParsedCommand;
    private breakToPhrases;
    private filterMatches;
    private parseKeyValueString;
    getParserOptions(): Readonly<ParserOptions>;
    getParserRegExp(): Readonly<{
        flags: RegExp;
        aliases: RegExp;
        params: RegExp;
        phrases: RegExp;
    }>;
    getCommand(): Readonly<string>;
    getRawParsedCommand(): Readonly<ParsedCommand>;
    hasFlag(flag: string, alias?: string): boolean;
    hasAlias(alias: string): boolean;
    hasPhrase(phrase: string): boolean;
    getParam(param: string): string;
    commandIncludes(text: string): boolean;
    getAllAfter(all: MaxFourItemsArray<'flags' | 'aliases' | 'phrases' | 'params'>, after: {
        name: string;
        role: 'flag' | 'alias' | 'phrase' | 'param';
    }): ObjectWithKeys<'flags' | 'aliases' | 'phrases' | 'params', (string[] | [string, string][])>;
    getAllAfterPosition(all: (MaxFourItemsArray<'flags' | 'aliases' | 'phrases' | 'params'>), position: number): ObjectWithKeys<'flags' | 'aliases' | 'phrases' | 'params', (string[] | [string, string][])>;
    getPosition(target: {
        name: string;
        role: 'flag' | 'alias' | 'phrase' | 'param';
    }): (number | -1);
    static getMatches(text: string, regex: RegExp): string[];
}
export {};
