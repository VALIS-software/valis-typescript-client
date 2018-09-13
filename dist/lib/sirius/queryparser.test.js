"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryparser_1 = require("./queryparser");
function buildSuggestionFromArray(rule, arr) {
    return function (text, maxResults) {
        return new Promise(function (resolve, reject) {
            if (text.length === 0) {
                resolve(arr.map(function (d) { return { rule: rule, value: d }; }));
                return;
            }
            else {
                var ret_1 = [];
                arr.forEach(function (val) {
                    if (val.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                        ret_1.push({ rule: rule, value: val });
                    }
                });
                resolve(ret_1);
            }
        });
    };
}
function parseText(text) {
    var geneSuggestions = buildSuggestionFromArray('GENE', ['MAOA', 'MAOB', 'PCSK9', 'NF2']);
    var traitSuggestions = buildSuggestionFromArray('TRAIT', ['Cancer', 'Alzheimers', 'Depression']);
    var cellSuggestions = buildSuggestionFromArray('CELL_TYPE', ['liver cells', 'lung cells', 'heart cells']);
    var annotationSuggestions = buildSuggestionFromArray('ANNOTATION_TYPE', ['promoters', 'enhancers']);
    var suggestions = new Map();
    suggestions.set('GENE', geneSuggestions);
    suggestions.set('TRAIT', traitSuggestions);
    suggestions.set('CELL_TYPE', cellSuggestions);
    suggestions.set('ANNOTATION_TYPE', annotationSuggestions);
    var parser = queryparser_1.buildQueryParser(suggestions);
    return parser.getSuggestions(text);
}
test('test_empty_query', function () {
    var result = parseText('');
    var promise = result.suggestions;
    promise.then(function (results) {
        expect(results.length).toBe(6);
    });
    return promise;
});
test('test_parse_variant_query_incomplete', function () {
    /* Test variant search returns correct suggestions */
    var result = parseText('variants');
    var promise = result.suggestions;
    promise.then(function (results) {
        expect(results.length).toBe(1);
        expect(results[0].value).toBe('influencing');
    });
    expect(result.tokens.length).toBe(1);
    expect(result.tokens[0].rule).toBe('VARIANTS');
    expect(result.query).toBe(null);
});
test('test_parse_variant_query_influencing', function () {
    /* Test autocomplete of gene trait */
    var result = parseText('variants influencing');
    var promise = result.suggestions;
    promise.then(function (results) {
        expect(results.length).toBe(3);
    });
    expect(result.tokens.length).toBe(2);
    expect(result.query).toBe(null);
});
test('test_parse_gene_query_named_complete', function () {
    /* Test valid search text parses to Query */
    var result = parseText('gene named \"MAOA\"');
    var promise = result.suggestions;
    promise.then(function (results) {
        expect(results[0].value).toBe("MAOA");
        expect(results.length).toBe(1);
    });
    expect(result.tokens[0].rule).toBe('GENE_T');
    expect(result.tokens.length).toBe(4);
    expect(result.query).toBeTruthy();
});
test('test_parse_gene_query_named_prefix_quoted', function () {
    /* Test valid search text parses to Query */
    var result = parseText('gene named "MAO"');
    var promise = result.suggestions;
    promise.then(function (results) {
        var resultValues = results.map(function (d) { return d.value; });
        expect(resultValues.indexOf("MAOA")).toBeGreaterThan(-1);
        expect(resultValues.indexOf("MAOB")).toBeGreaterThan(-1);
        expect(results.length).toBe(2);
    });
    expect(result.tokens.length).toBe(4);
    expect(result.query).toBeTruthy();
});
test('test_parse_gene_query_influencing_complete', function () {
    /* Test valid search text parses to Query */
    var result = parseText('gene influencing \"Alzheimers\"');
    var promise = result.suggestions;
    promise.then(function (results) {
        expect(results[0].value).toBe("Alzheimers");
        expect(results.length).toBe(1);
    });
    expect(result.tokens[0].rule).toBe('GENE_T');
    expect(result.tokens.length).toBe(4);
    expect(result.query).toBeTruthy();
});
test('test_parse_gene_query_influencing_prefix_quoted', function () {
    /* Test valid search text parses to Query */
    var result = parseText('gene influencing \"Alzhe\"');
    var promise = result.suggestions;
    promise.then(function (results) {
        expect(results[0].value).toBe("Alzheimers");
        expect(results.length).toBe(1);
    });
    expect(result.tokens[0].rule).toBe('GENE_T');
    expect(result.tokens.length).toBe(4);
    expect(result.query).toBeTruthy();
});
// test('test_parse_cell_query', () => {
//     /* Test enhancer query parses properly */
//     const result = parseText('enhancers in "heart cell"');
//     const promise = result.suggestions;
//     promise.then((results: SingleSuggestion[]) => {
//         expect(1).toBe(1);
//     });
//     const query = result.query;
//     expect(query).toBeDefined();
//     expect(query['filters']['type']).toBe('Enhancer-like');
//     expect(query['filters']['info.biosample']).toBe('heart cell');
// });
//# sourceMappingURL=queryparser.test.js.map