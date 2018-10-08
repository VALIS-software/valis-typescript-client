"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var QueryType;
(function (QueryType) {
    QueryType["GENOME"] = "GenomeNode";
    QueryType["INFO"] = "InfoNode";
    QueryType["EDGE"] = "EdgeNode";
})(QueryType || (QueryType = {}));
exports.QueryType = QueryType;
var QueryBuilder = /** @class */ (function () {
    function QueryBuilder(query) {
        if (query === void 0) { query = {}; }
        this.query = JSON.parse(JSON.stringify(query));
    }
    QueryBuilder.prototype.newGenomeQuery = function () {
        this.query = {
            type: QueryType.GENOME,
            filters: {},
            toEdges: [],
            arithmetics: [],
        };
    };
    QueryBuilder.prototype.newInfoQuery = function () {
        this.query = {
            type: QueryType.INFO,
            filters: {},
            toEdges: [],
        };
    };
    QueryBuilder.prototype.newEdgeQuery = function () {
        this.query = {
            type: QueryType.EDGE,
            filters: {},
            toNode: {},
        };
    };
    QueryBuilder.prototype.filterID = function (id) {
        this.query.filters._id = id;
    };
    QueryBuilder.prototype.filterType = function (type) {
        this.query.filters.type = type;
    };
    QueryBuilder.prototype.filterSource = function (source) {
        this.query.filters.source = source;
    };
    QueryBuilder.prototype.filterContig = function (contig) {
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('filter contig only available for GenomeNodes');
        }
        this.query.filters.contig = contig;
    };
    QueryBuilder.prototype.filterLength = function (length) {
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('Length only available for GenomeNodes');
        }
        this.query.filters.length = length;
    };
    QueryBuilder.prototype.filterName = function (name) {
        this.query.filters.name = name;
    };
    QueryBuilder.prototype.filterPathway = function (pathways) {
        this.query.filters['info.kegg_pathways'] = pathways;
    };
    QueryBuilder.prototype.filterMaxPValue = function (pvalue) {
        this.query.filters['info.p-value'] = { '<': pvalue };
    };
    QueryBuilder.prototype.filterBiosample = function (biosample) {
        this.query.filters['info.biosample'] = biosample;
    };
    QueryBuilder.prototype.filterTargets = function (targets) {
        if (targets.length > 0) {
            this.query.filters['info.targets'] = { $all: targets };
        }
    };
    QueryBuilder.prototype.filterInfotypes = function (type) {
        this.query.filters['info.types'] = type;
    };
    QueryBuilder.prototype.filterAssay = function (assay) {
        this.query.filters['info.assay'] = assay;
    };
    QueryBuilder.prototype.filterOutType = function (outType) {
        this.query.filters['info.outtype'] = outType;
    };
    QueryBuilder.prototype.filterPatientBarCode = function (outType) {
        this.query.filters['info.patient_barcodes'] = outType;
    };
    QueryBuilder.prototype.filterStartBp = function (start) {
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('filterStartBp is only available for an Genome Query.');
        }
        this.query.filters.start = start;
    };
    QueryBuilder.prototype.filterEndBp = function (end) {
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('filterEndBp is only available for an Genome Query.');
        }
        this.query.filters.end = end;
    };
    QueryBuilder.prototype.filterAffectedGene = function (gene) {
        var previous = this.query.filters['variant_affected_genes'] || [];
        this.query.filters['info.variant_affected_genes'] = gene;
    };
    QueryBuilder.prototype.filterVariantTag = function (tag) {
        var previous = this.query.filters['variant_tags'] || [];
        this.query.filters['info.variant_tags'] = tag;
    };
    QueryBuilder.prototype.searchText = function (text) {
        this.query.filters.$text = text;
    };
    QueryBuilder.prototype.setLimit = function (limit) {
        this.query.limit = limit;
    };
    QueryBuilder.prototype.addToEdge = function (edgeQuery) {
        if (this.query.type === QueryType.EDGE) {
            throw new Error('Edge can not be connect to another edge.');
        }
        this.query.toEdges.push(edgeQuery);
    };
    QueryBuilder.prototype.setToNode = function (nodeQuery, reverse) {
        if (reverse === void 0) { reverse = false; }
        if (this.query.type !== QueryType.EDGE) {
            throw new Error('toNode is only available for an Edge Query.');
        }
        this.query.toNode = nodeQuery;
        this.query.reverse = reverse;
    };
    QueryBuilder.prototype.addArithmeticIntersect = function (genomeQuery) {
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('Arithmetic is only available for an Genome Query.');
        }
        var ar = {
            'operator': 'intersect',
            'target_queries': [genomeQuery],
        };
        this.query.arithmetics.push(ar);
    };
    QueryBuilder.prototype.addArithmeticWindow = function (genomeQuery, windowSize) {
        if (windowSize === void 0) { windowSize = 1000; }
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('Arithmetic is only available for an Genome Query.');
        }
        var ar = {
            'operator': 'window',
            'target_queries': [genomeQuery],
            'windowSize': windowSize,
        };
        this.query.arithmetics.push(ar);
    };
    QueryBuilder.prototype.addArithmeticUnion = function (genomeQuery) {
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('Arithmetic is only available for an Genome Query.');
        }
        var ar = {
            'operator': 'union',
            'target_queries': [genomeQuery],
        };
        this.query.arithmetics.push(ar);
    };
    QueryBuilder.prototype.addArithmeticDiff = function (genomeQuery) {
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('Arithmetic is only available for an Genome Query.');
        }
        var ar = {
            'operator': 'diff',
            'target_queries': [genomeQuery],
        };
        this.query.arithmetics.push(ar);
    };
    QueryBuilder.prototype.setSpecialGWASQuery = function () {
        var e_1, _a;
        if (this.query.type !== QueryType.GENOME) {
            throw new Error('setSpecialGWASQuery should be applied to a Genome Query.');
        }
        if (!this.query.toEdges || this.query.toEdges < 1) {
            throw new Error('GWAS query should have at least 1 edge.');
        }
        try {
            for (var _b = __values(this.query.toEdges), _c = _b.next(); !_c.done; _c = _b.next()) {
                var edge = _c.value;
                if (!edge.toNode || edge.toNode.type !== QueryType.INFO) {
                    throw new Error('The edge of GWAS query should connect to InfoNode.');
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.query.specialGWASQuery = true;
    };
    // Specify reading from user files
    QueryBuilder.prototype.setUserFileID = function (fileID) {
        this.query.userFileID = fileID;
    };
    QueryBuilder.prototype.build = function () {
        return JSON.parse(JSON.stringify(this.query));
    };
    return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map