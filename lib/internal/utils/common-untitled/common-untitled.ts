

export function filterObject<T>(source, excludeFields: string[]): Partial<T> {
    const partialObject: Partial<T> = {};
    for (const field in source) {

        if ((~excludeFields.indexOf(field)) && source.hasOwnProperty(field)) {
            partialObject[field] = source[field];
        }
    }
    return partialObject;
}


// interface ParsedCommand { flags: string[], aliases: string[], params: { key: string, value: string }[] }
// /**
//  * @description parse a shell-like command string to a 'ParsedCommand' object.
//  * @param command string to parse and poll all flags, aliases and key-value params.
//  * @return 'ParsedCommand' object contain flags, aliases and key-value params found in 'command'.
//  */
// export function parseCommand(command: string): ParsedCommand {
//     const breakdownParams = RegExp(/((?:^|\s)\w+\=\w+)/, 'g');
//     const breakdownFlags = RegExp(/((?:^|\s)\-\-\w+)/, 'g');
//     const breakdownAliases = RegExp(/((?:^|\s)\-\w+)/, 'g');

//     const commandParams = getMatches(command, breakdownParams);
//     const commandFlags = getMatches(command, breakdownFlags);
//     const commandAliases = getMatches(command, breakdownAliases);

//     const parsedParams = parseKeyValueString(commandParams);

//     return { flags: commandFlags, aliases: commandAliases, params: parsedParams };

// }

// interface ParsedCommand { 
//     flags: string[], 
//     aliases: string[], 
//     params: { key: string, value: string }[] 
//     // prefixWords: string[]
//     // SuffixWords: string[]
// }

// class MapParsedCommand { 
//     public flags: Set<string>;
//     public aliases:  Set<string>;
//     public params: Map<string, string>;

//     constructor(rawParsedCommand: ParsedCommand) {
//         this.flags = new  Set<string>(rawParsedCommand.flags);
//         this.aliases = new  Set<string>(rawParsedCommand.aliases);
//         this.params = new Map<string, string>();
//         rawParsedCommand.params.forEach(param => this.params.set(param.key,param.value));
//     }
// }

// class ParserOptions {
//     flagMark: string; 
//     aliasMark: string; 
//     constructor(options: Partial<ParserOptions> = {}) {
//         this.flagMark = options.flagMark || '--'
//         this.aliasMark = options.aliasMark || '-';
//     }
// } 

// export class CommandParser {

//     // seasonal value members
//     private command: string;
//     private rawParsedCommand: ParsedCommand;
//     private mapParsedCommand: MapParsedCommand;
//     private parserOptions: ParserOptions;
//     private parserRegExp: { flags: RegExp, aliases: RegExp, params: RegExp } = {
//         params: RegExp(/((?:^|\s)\w+\=\w+)/, 'g'),
//         flags: RegExp(/((?:^|\s)\-\-\w+)/, 'g'),
//         aliases: RegExp(/((?:^|\s)\-\w+)/, 'g')
//     };

//     /**
//      * @description Method start the season.<br> 
//      *  Parse a shell-like command string to a 'ParsedCommand' object.
//      * @param command String to parse and poll all flags, aliases and key-value params.
//      * @return 'ParsedCommand' object contain flags, aliases and key-value params found in 'command'.
//      */
//     public parseCommand(command: string, options?: ParserOptions): ParsedCommand {
//         this.command = command;
//         this.parserOptions = new ParserOptions(options);
//         this.setRegExp(this.parserOptions);
        
//         const commandFlags = this.scanFlags(command);
//         const commandAliases = this.scanAliases(command);
//         const commandParams = this.scanParams(command);

//         this.rawParsedCommand = { flags: commandFlags, aliases: commandAliases, params: commandParams };
//         this.mapParsedCommand = new MapParsedCommand(this.rawParsedCommand);
//         return this.rawParsedCommand 
//     }

//     // #region - used on 'parseCommand' method
//     private setRegExp(options: ParserOptions) {
//         if(options) {
//             this.parserRegExp.flags = new RegExp('((?:^|\\s)(?:'+ options.flagMark + ')\\w+)', 'g');
//             this.parserRegExp.aliases = new RegExp('((?:^|\\s)(?:'+ options.aliasMark + ')\\w+)', 'g');
//         }
//     }
//     private scanFlags(command: string): string[] {
//         return CommandParser.getMatches(command, this.parserRegExp.flags);
//     }
//     private scanAliases(command: string): string[] {
//         return CommandParser.getMatches(command, this.parserRegExp.aliases);
//     }
//     private scanParams(command: string): {key: string, value: string}[] {
//         const commandParams = CommandParser.getMatches(command, this.parserRegExp.params);
//         return CommandParser.parseKeyValueString(commandParams);
//     }
//     // #endregion

//     // #region - getters [seasonal]
//     public getParserOptions() {
//         return this.parserOptions;
//     }
//     public getCommand() {
//         return this.command || '';
//     }
//     public getRawParsedCommand() {
//         return this.rawParsedCommand || {} 
//     }
//     // #endregion

//     // #region - command data fetch. [seasonal]
//     public gotFlag(flag: string, alias?: string) {
//         return this.mapParsedCommand.flags.has(flag) 
//             || this.mapParsedCommand.aliases.has(alias);
//     }
//     public gotAlias(alias: string) {
//         return this.mapParsedCommand.aliases.has(alias);
//     }
//     public getParam(param: string): string {
//         return this.mapParsedCommand.params.get(param) || undefined;
//     }
//     public commandIncludes(text: string) : boolean {
//         return this.command.includes(text);
//     }
//     // #endregion

//     // #region - static [not seasonal]
//     public static parseKeyValueString(keyValue: string[]): { key: string, value: string }[] {
//         const parsedKeysValues = keyValue.map<{ key: string, value: string }>(keyValue => {
//             const split = keyValue.split('=');
//             return {
//                 key: (split.length == 2) ? split[0] : undefined,
//                 value: (split.length == 2) ? split[1] : undefined,
//             }
//         });
//         return parsedKeysValues;
//     }
//     public static getMatches(text: string, regex: RegExp): string[] {
//         const matches = (text.match(regex) || []).map(match => match.trim());
//         return matches;
//     }
//     // #endregion
    
// }