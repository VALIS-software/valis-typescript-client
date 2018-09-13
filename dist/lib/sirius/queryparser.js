"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryBuilder_1 = require("./QueryBuilder");
var ParsedToken = /** @class */ (function () {
    function ParsedToken(rule, value) {
        this.rule = rule;
        this.value = value;
    }
    return ParsedToken;
}());
var ParsePath = /** @class */ (function () {
    function ParsePath(rule, value, path, isTerminal) {
        this.rule = rule;
        this.value = value;
        this.path = path;
        this.isTerminal = isTerminal;
    }
    return ParsePath;
}());
var EOF = 'EOF';
var ANY = 'ANY';
var ALL = 'ALL';
var ROOT = 'ROOT';
var STRIP_QUOTES = function (x) {
    return x.slice(1, x.length - 1);
};
var TRIM = function (x) {
    return x.replace(/(^[ '\^\$\*#&]+)|([ '\^\$\*#&]+$)/g, '');
};
var REGEX_TO_STRING = function (x) {
    var str = x.toString();
    return str.slice(1, str.length - 2);
};
var REGEX_HAS_QUOTES = function (x) {
    var a = REGEX_TO_STRING(x);
    return a[0] === "\"" && a[a.length - 1] === "\"";
};
function mergeResults(promises) {
    return Promise.all(promises).then(function (results) {
        var allResults = [];
        results.forEach(function (result) {
            allResults = allResults.concat(result);
        });
        return allResults;
    });
}
var builder = new QueryBuilder_1.QueryBuilder();
function buildVariantQuery(parsePath) {
    var token = parsePath[0];
    if (token.rule === 'INFLUENCING') {
        var traitName = STRIP_QUOTES(parsePath[1].value);
        builder.newInfoQuery();
        builder.filterType("trait");
        builder.searchText(traitName);
        var traitQuery = builder.build();
        builder.newEdgeQuery();
        builder.setToNode(traitQuery);
        var edgeQuery = builder.build();
        builder.newGenomeQuery();
        builder.addToEdge(edgeQuery);
        builder.setSpecialGWASQuery();
        return builder.build();
    }
    else if (token.rule === 'NAMED') {
        var snpRS = TRIM(parsePath[1].value.toLowerCase());
        builder.newGenomeQuery();
        builder.filterID('Gsnp_' + snpRS);
        var snpQuery = builder.build();
        return snpQuery;
    }
}
function buildTraitQuery(parsePath) {
    var traitName = STRIP_QUOTES(parsePath[0].value);
    builder.newInfoQuery();
    builder.filterType("trait");
    builder.searchText(traitName);
    return builder.build();
}
function buildGeneQuery(parsePath) {
    var token = parsePath[0];
    if (token.rule === 'NAMED') {
        var geneName = STRIP_QUOTES(parsePath[1].value);
        builder.newGenomeQuery();
        builder.filterName(geneName.toUpperCase());
        return builder.build();
    }
    else if (token.rule === 'INFLUENCING') {
        var traitName = STRIP_QUOTES(parsePath[1].value);
        builder.newInfoQuery();
        builder.filterType("trait");
        builder.searchText(traitName);
        var traitQuery = builder.build();
        builder.newEdgeQuery();
        builder.setToNode(traitQuery);
        builder.filterMaxPValue(0.05);
        var edgeQuery = builder.build();
        builder.newGenomeQuery();
        builder.addToEdge(edgeQuery);
        builder.setLimit(1000000);
        var variantQuery = builder.build();
        builder.newGenomeQuery();
        builder.filterType("gene");
        builder.addArithmeticIntersect(variantQuery);
        return builder.build();
    }
}
function buildCellQuery(parsePath) {
    var annotationType = (parsePath[0].rule == 'PROMOTER') ? "Promoter-like" : "Enhancer-like";
    var targets = [STRIP_QUOTES(parsePath[2].value)];
    var cellType = STRIP_QUOTES(parsePath[4].value);
    builder.newGenomeQuery();
    builder.filterType(annotationType);
    builder.filterTargets(targets);
    builder.filterBiosample(cellType);
    builder.setLimit(2000000);
    return builder.build();
}
function buildEQTLQuery(parsePath) {
    var token = parsePath[0];
    if (token.rule === 'INFLUENCING') {
        var geneName = STRIP_QUOTES(parsePath[1].value);
        builder.newGenomeQuery();
        builder.filterName(geneName.toUpperCase());
        var geneQuery = builder.build();
        builder.newEdgeQuery();
        builder.setToNode(geneQuery);
        var edgeQuery = builder.build();
        builder.newGenomeQuery();
        builder.addToEdge(edgeQuery);
        builder.setLimit(1000000);
        return builder.build();
    }
    else if (token.rule === 'NAMED') {
        var snpRS = TRIM(parsePath[1].value.toLowerCase());
        builder.newGenomeQuery();
        builder.filterID('Gsnp_' + snpRS);
        var snpQuery = builder.build();
        builder.newEdgeQuery();
        builder.setToNode(snpQuery, true);
        var edgeQuery = builder.build();
        return edgeQuery;
    }
}
function buildPatientQuery(parsePath) {
    var token = parsePath[0];
    if (token.rule === 'WITH_TUMOR') {
        var tumorSite = STRIP_QUOTES(parsePath[1].value);
        builder.newInfoQuery();
        builder.filterType('patient');
        builder.filterBiosample(tumorSite);
        builder.setLimit(1000000);
        return builder.build();
    }
}
function buildSNPrsQuery(parsePath) {
    builder.newGenomeQuery();
    builder.filterID('Gsnp_' + TRIM(parsePath[0].value.toLowerCase()));
    return builder.build();
}
function buildFullTextQuery(inputText) {
    if (!inputText)
        return null;
    var isAllUpper = inputText === inputText.toUpperCase();
    var suffixIsNumber = !isNaN(+inputText[inputText.length - 1]);
    if (inputText.length > 5 && !isAllUpper && !suffixIsNumber) {
        builder.newInfoQuery();
        builder.filterType('trait');
        builder.searchText(inputText);
    }
    else {
        builder.newGenomeQuery();
        builder.filterType('gene');
        builder.filterName(inputText.toUpperCase());
    }
    return builder.build();
}
function buildQuery(parsePath) {
    var token = parsePath[0];
    if (token.rule === 'VARIANTS') {
        return buildVariantQuery(parsePath.slice(1));
    }
    else if (token.rule === 'GENE_T') {
        return buildGeneQuery(parsePath.slice(1));
    }
    else if (token.rule === 'TRAIT_T') {
        return buildTraitQuery(parsePath.slice(1));
    }
    else if (token.rule === 'PROMOTER' || token.rule === 'ENHANCER') {
        return buildCellQuery(parsePath);
    }
    else if (token.rule === 'EQTL') {
        return buildEQTLQuery(parsePath.slice(1));
    }
    else if (token.rule === 'PATIENT_T') {
        return buildPatientQuery(parsePath.slice(1));
    }
    else if (token.rule === 'RS_T') {
        return buildSNPrsQuery(parsePath);
    }
}
var QueryParser = /** @class */ (function () {
    function QueryParser(grammar, terminals, suggestions) {
        this.grammar = grammar;
        this.terminals = terminals;
        this.suggestions = suggestions;
    }
    QueryParser.prototype.eat = function (soFar, rule) {
        soFar = TRIM(soFar);
        var soFarLowerCase = soFar.toLowerCase();
        var regExp = this.terminals.get(rule);
        regExp.lastIndex = 0;
        var result = regExp.exec(soFarLowerCase);
        if (result !== null) {
            var offset = result.index + result[0].length;
            return { parsed: soFar.slice(0, offset), rest: soFar.slice(offset) };
        }
        else {
            return { parsed: null, rest: soFar };
        }
    };
    QueryParser.prototype.parse = function (soFar, rule, path) {
        var _this = this;
        if (path === void 0) { path = []; }
        if (rule === EOF && soFar.length === 0) {
            var newPath = path.slice(0);
            newPath.push(new ParsedToken(EOF, ''));
            return [new ParsePath(rule, soFar, newPath, true)];
        }
        else if (this.terminals.get(rule) !== undefined) {
            var parsed = this.eat(soFar, rule).parsed;
            if (parsed !== null) {
                var pathCopy = path.slice(0);
                pathCopy.push(new ParsedToken(rule, parsed));
                return [new ParsePath(rule, parsed, pathCopy, true)];
            }
            else {
                return [new ParsePath(rule, soFar, path.slice(0), false)];
            }
        }
        else if (this.grammar.get(rule)) {
            // expand this rule and return result
            var expandedRule = this.grammar.get(rule);
            return this.parse(soFar, expandedRule, path.slice(0));
        }
        else if (rule[0] === ANY) {
            // just union all possible parse paths together
            var options = rule.slice(1);
            var possibilities_1 = [];
            options.forEach(function (subRule) {
                possibilities_1 = possibilities_1.concat(_this.parse(soFar, subRule, path.slice(0)));
            });
            return possibilities_1;
        }
        else if (rule[0] === ALL) {
            if (this.terminals.get(rule[1])) {
                var _a = this.eat(soFar, rule[1]), parsed = _a.parsed, rest = _a.rest;
                var newPath = path.slice(0);
                newPath.push(new ParsedToken(rule[1], parsed));
                if (rest === soFar || parsed === null) {
                    // we were not able to eat a token! return suggestions for the current token rule
                    return this.parse(soFar, rule[1], path.slice(0));
                }
                else {
                    var remainingRules = rule.slice(2);
                    if (remainingRules.length === 0) {
                        return [];
                    }
                    else if (remainingRules.length === 1) {
                        var ret = this.parse(rest, rule[2], newPath);
                        return ret;
                    }
                    else {
                        return this.parse(rest, [ALL].concat(remainingRules), newPath);
                    }
                }
            }
            else if (this.grammar.get(rule[1])) {
                var expandedRule = this.grammar.get(rule[1]);
                // try parsing the first rule in the ALL clause
                var tryParseResults = this.parse(soFar, expandedRule, path.slice(0));
                // get the maximum parse depth of all possible paths
                var maxParse = tryParseResults.reduce(function (a, b) { return a.path.length > b.path.length ? a : b; });
                ;
                var maxDepth_1 = maxParse.path ? maxParse.path.length : 0;
                var paths = [];
                // filter to the max depth parses and try to continue
                var maxDepthPaths = tryParseResults.filter(function (x) { return x.path.length === maxDepth_1; });
                for (var i = 0; i < maxDepthPaths.length; i++) {
                    var subParse = maxDepthPaths[i];
                    if (subParse.isTerminal) {
                        // if the parser has fully parsed the first rule
                        var parsedSoFar = subParse.path.slice(path.length).map(function (x) { return x.value; }).join(' ');
                        var cleanedSoFar = TRIM(soFar);
                        var idxTo = cleanedSoFar.indexOf(parsedSoFar);
                        var rest = cleanedSoFar.slice(idxTo + parsedSoFar.length);
                        if (rule.slice(2).length === 0) {
                            paths.push(new ParsePath(subParse.rule, subParse.value, subParse.path, subParse.isTerminal));
                        }
                        else if (rule.slice(2).length === 1) {
                            return this.parse(rest, rule[2], subParse.path.slice(0));
                        }
                        else {
                            return this.parse(rest, [ALL].concat(rule.slice(2)), subParse.path.slice(0));
                        }
                    }
                    else {
                        // otherwise return suggestions for the first rule in the ALL clasue
                        paths.push(new ParsePath(subParse.rule, subParse.value, subParse.path.slice(0), subParse.isTerminal));
                    }
                }
                return paths;
            }
        }
        return [];
    };
    QueryParser.prototype.buildSuggestionsFromParse = function (inputText, results, maxSuggestions) {
        var _this = this;
        if (maxSuggestions === void 0) { maxSuggestions = 15; }
        var maxParse = results.reduce(function (a, b) { return a.path.length > b.path.length ? a : b; });
        var maxDepth = maxParse.path.length;
        var finalSuggestions = [];
        var quoteSuggestion = false;
        results.filter(function (x) { return x.path.length === maxDepth; }).forEach(function (subPath) {
            var rule = subPath.rule;
            var tokenText = subPath.value;
            if (subPath.rule === EOF) {
                // ignore the EOF and keep giving suggestions for the previous token
                rule = subPath.path[subPath.path.length - 2].rule;
                //set the token text to the text with '"' characters removed
                var val = subPath.path[subPath.path.length - 2].value;
                tokenText = val.slice(1, val.length - 1);
            }
            if (_this.terminals.has(rule) && REGEX_HAS_QUOTES(_this.terminals.get(rule)))
                quoteSuggestion = true;
            if (_this.suggestions.get(rule)) {
                tokenText = TRIM(tokenText).toLowerCase();
                finalSuggestions.push(_this.suggestions.get(rule)(tokenText, maxSuggestions / 2));
            }
            else {
                finalSuggestions.push(new Promise(function (resolve, reject) {
                    resolve([
                        { rule: rule, value: REGEX_TO_STRING(_this.terminals.get(rule)) }
                    ]);
                }));
            }
        });
        var query = null;
        var additionalSuggestions = null;
        if (maxParse.rule === EOF) {
            query = buildQuery(maxParse.path);
        }
        else if (maxParse.path.length === 0) {
            // if no prefixes match, then we just want to return raw query completions!
            query = buildFullTextQuery(inputText);
            var geneSuggestions = this.suggestions.get('GENE')(inputText, maxSuggestions / 4);
            var traitSuggestions = this.suggestions.get('TRAIT')(inputText, maxSuggestions / 4);
            additionalSuggestions = mergeResults([geneSuggestions, traitSuggestions]);
        }
        return {
            tokens: maxParse.path,
            suggestions: mergeResults(finalSuggestions),
            additionalSuggestions: additionalSuggestions,
            query: query,
            isQuoted: quoteSuggestion,
        };
    };
    QueryParser.prototype.getSuggestions = function (inputText, maxSuggestions) {
        if (maxSuggestions === void 0) { maxSuggestions = 15; }
        var results = this.parse(inputText, this.grammar.get(ROOT));
        if (results.length === 0)
            return null;
        return this.buildSuggestionsFromParse(inputText, results, maxSuggestions);
    };
    return QueryParser;
}());
exports.QueryParser = QueryParser;
function buildQueryParser(suggestions) {
    var terminals = new Map();
    terminals.set('TRAIT', /"(.+?)"/g);
    terminals.set('GENE', /"(.+?)"/g);
    terminals.set('INFLUENCING', /influencing/g);
    terminals.set('OF', /of/g);
    terminals.set('VARIANTS', /variants/g);
    terminals.set('GENE_T', /gene/g);
    terminals.set('TRAIT_T', /trait/g);
    terminals.set('NEAR', /near/g);
    terminals.set('IN', /in/g);
    terminals.set('PROMOTER', /promoters/g);
    terminals.set('ENHANCER', /enhancers/g);
    terminals.set('TARGET', /"(.+?)"/g);
    terminals.set('CELL_TYPE', /"(.+?)"/g);
    terminals.set('EQTL', /eqtl/g);
    terminals.set('NAMED', /named/g);
    terminals.set('TUMOR_SITE', /"(.+?)"/g);
    terminals.set('PATIENT_T', /patient/g);
    terminals.set('WITH_TUMOR', /with tumor/g);
    terminals.set('RS_T', /rs\d+$/g);
    terminals.set('NUMBER', /^\d+$/g);
    var expansions = new Map();
    expansions.set('NAMED_GENE_OR_INFLUENCEING_TRAIT', [ANY, 'INFLUENCING_TRAIT', 'NAMED_GENE']);
    expansions.set('INFLUENCING_GENE_OR_NAMED_RS', [ANY, 'INFLUENCING_GENE', 'NAMED_SNP_RS']);
    expansions.set('INFLUENCING_TRAIT_OR_NAMED_RS', [ANY, 'INFLUENCING_TRAIT', 'NAMED_SNP_RS']);
    expansions.set('INFLUENCING_TRAIT', [ALL, 'INFLUENCING', 'TRAIT']);
    expansions.set('INFLUENCING_GENE', [ALL, 'INFLUENCING', 'GENE']);
    expansions.set('NAMED_GENE', [ALL, 'NAMED', 'GENE']);
    expansions.set('NAMED_SNP_RS', [ALL, 'NAMED', 'RS_T']);
    expansions.set('ANNOTATION_TYPE', [ANY, 'PROMOTER', 'ENHANCER']);
    expansions.set('CELL_ANNOTATION', [ALL, 'ANNOTATION_TYPE', 'OF', 'TARGET', 'IN', 'CELL_TYPE']);
    // The root query rules
    expansions.set('VARIANT_QUERY', [ALL, 'VARIANTS', 'INFLUENCING_TRAIT_OR_NAMED_RS', EOF]);
    expansions.set('GENE_QUERY', [ALL, 'GENE_T', 'NAMED_GENE_OR_INFLUENCEING_TRAIT', EOF]);
    expansions.set('TRAIT_QUERY', [ALL, 'TRAIT_T', 'TRAIT', EOF]);
    expansions.set('EQTL_QUERY', [ALL, 'EQTL', 'INFLUENCING_GENE_OR_NAMED_RS', EOF]);
    expansions.set('ANNOTATION_QUERY', [ALL, 'CELL_ANNOTATION', EOF]);
    // expansions.set('PATIENT_QUERY', [ALL, 'PATIENT_T', 'WITH_TUMOR', 'TUMOR_SITE', EOF]);
    // expansions.set('SNP_RS_QUERY', [ALL, 'RS_T', EOF]);
    expansions.set('ROOT', [ANY, 'VARIANT_QUERY', 'GENE_QUERY', 'TRAIT_QUERY', 'EQTL_QUERY', 'ANNOTATION_QUERY']);
    // return empty result for rs prefix queries
    suggestions.set('RS_T', function (q, num) { return new Promise(function (resolve, reject) { return resolve([]); }); });
    return new QueryParser(expansions, terminals, suggestions);
}
exports.buildQueryParser = buildQueryParser;
//# sourceMappingURL=queryparser.js.map