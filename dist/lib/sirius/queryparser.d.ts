declare class ParsedToken {
    rule: Rule;
    value: string;
    constructor(rule: Rule, value: string);
}
declare class ParsePath {
    rule: Rule;
    value: any;
    path: ParsedToken[];
    isTerminal: boolean;
    constructor(rule: Rule, value: string, path: ParsedToken[], isTerminal: boolean);
}
declare type TokenType = string;
declare type TerminalRule = RegExp;
declare type Rule = TokenType | TokenType[];
declare type Expansions = Map<Rule, Rule>;
declare type Terminals = Map<Rule, TerminalRule>;
export declare type SuggestionResultPromise = Promise<SingleSuggestion[]>;
export declare type SuggestionResultProvider = (text: string, numResults: number) => SuggestionResultPromise;
export declare type SingleSuggestion = {
    rule: TokenType;
    value: string;
};
export declare type Suggestion = {
    tokens: ParsedToken[];
    suggestions: Promise<SingleSuggestion[]>;
    additionalSuggestions: Promise<SingleSuggestion[]>;
    query: any;
    isQuoted: boolean;
};
export declare class QueryParser {
    private terminals;
    private suggestions;
    private grammar;
    constructor(grammar: Expansions, terminals: Terminals, suggestions: Map<Rule, SuggestionResultProvider>);
    eat(soFar: string, rule: Rule): {
        parsed: string;
        rest: string;
    };
    parse(soFar: string, rule: Rule, path?: ParsedToken[]): ParsePath[];
    buildSuggestionsFromParse(inputText: string, results: ParsePath[], maxSuggestions?: number): Suggestion;
    getSuggestions(inputText: string, maxSuggestions?: number): Suggestion;
}
declare function buildQueryParser(suggestions: Map<Rule, SuggestionResultProvider>): QueryParser;
declare function buildVariantQueryParser(suggestions: Map<Rule, SuggestionResultProvider>): QueryParser;
export { buildQueryParser, buildVariantQueryParser };
