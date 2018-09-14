"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var FilterType;
(function (FilterType) {
    FilterType[FilterType["DATASET"] = 0] = "DATASET";
    FilterType[FilterType["TYPE"] = 1] = "TYPE";
    FilterType[FilterType["VARIANT_TAG"] = 2] = "VARIANT_TAG";
    FilterType[FilterType["CONTIG"] = 3] = "CONTIG";
})(FilterType = exports.FilterType || (exports.FilterType = {}));
var QueryModel = /** @class */ (function () {
    function QueryModel(query) {
        this.query = JSON.parse(JSON.stringify(query));
        this.filters = immutable_1.Map();
        this.extractQueryFilters();
    }
    QueryModel.prototype.extractQueryFilters = function () {
        // This function will extract certain filters from the query.filters and put into this.filters
        // There are unlimited ways the filters can be formated, we support string and `$in`: array here.
        if (!this.query || !this.query.filters)
            return;
        var qft = this.query.filters;
        // data source
        if ('source' in qft) {
            var qf = qft.source;
            if (typeof qf === 'string') {
                this.filters = this.filters.set(FilterType.DATASET, immutable_1.Set([qf]));
            }
            else if (typeof qf === 'object' && qf instanceof Object) {
                if ('$all' in qf) {
                    this.filters = this.filters.set(FilterType.DATASET, immutable_1.Set(qf['$all']));
                }
                else if ('$in' in qf) {
                    this.filters = this.filters.set(FilterType.DATASET, immutable_1.Set(qf['$in']));
                }
            }
            delete qft.source;
        }
        // type
        if ('type' in qft) {
            var qf = qft.type;
            if (typeof qf === 'string') {
                this.filters = this.filters.set(FilterType.TYPE, immutable_1.Set([qf]));
            }
            else if (typeof qf === 'object' && qf instanceof Object) {
                if ('$in' in qf) {
                    this.filters = this.filters.set(FilterType.TYPE, immutable_1.Set(qf['$in']));
                }
            }
            delete qft.type;
        }
        // variant tag
        if ('info.variant_tags' in qft) {
            var qf = qft['info.variant_tags'];
            if (typeof qf === 'string') {
                this.filters = this.filters.set(FilterType.VARIANT_TAG, immutable_1.Set([qf]));
            }
            else if (typeof qf === 'object' && qf instanceof Object) {
                if ('$in' in qf) {
                    this.filters = this.filters.set(FilterType.VARIANT_TAG, immutable_1.Set(qf['$in']));
                }
            }
            delete qft['info.variant_tags'];
        }
        // CONTIG
        if ('contig' in qft) {
            var qf = qft.contig;
            if (typeof qf === 'string') {
                this.filters = this.filters.set(FilterType.CONTIG, immutable_1.Set([qf]));
            }
            else if (typeof qf === 'object' && qf instanceof Object) {
                if ('$in' in qf) {
                    this.filters = this.filters.set(FilterType.CONTIG, immutable_1.Set(qf['$in']));
                }
            }
            delete qft.contig;
        }
    };
    QueryModel.prototype.toggleSelected = function (filterType, filterValue) {
        if (this.filters.has(filterType) && this.filters.get(filterType).has(filterValue)) {
            var previousFilters = this.filters.get(filterType);
            this.filters = this.filters.set(filterType, previousFilters.remove(filterValue));
            return this;
        }
        else {
            var previousFilters = this.filters.get(filterType) ? this.filters.get(filterType) : immutable_1.Set();
            this.filters = this.filters.set(filterType, previousFilters.add(filterValue));
            return this;
        }
    };
    QueryModel.prototype.getFilteredQuery = function () {
        return QueryModel.applyFilterToQuery(this.query, this.filters);
    };
    QueryModel.prototype.setQuery = function (query) {
        this.query = query;
    };
    QueryModel.prototype.setFilters = function (filters) {
        this.filters = filters;
    };
    QueryModel.prototype.printFilters = function () {
        var filterStrs = [];
        if (this.filters.get(FilterType.DATASET)) {
            filterStrs.push(this.filters.get(FilterType.DATASET).join(','));
        }
        if (this.filters.get(FilterType.TYPE)) {
            filterStrs.push(this.filters.get(FilterType.TYPE).join(','));
        }
        if (this.filters.get(FilterType.VARIANT_TAG)) {
            filterStrs.push(this.filters.get(FilterType.VARIANT_TAG).join(','));
        }
        if (this.filters.get(FilterType.CONTIG)) {
            filterStrs.push(this.filters.get(FilterType.CONTIG).join(','));
        }
        return filterStrs.join('; ');
    };
    QueryModel.prototype.noneSelected = function (filterType) {
        if (!this.filters.has(filterType))
            return true;
        if (this.filters.has(filterType) && this.filters.get(filterType).isEmpty())
            return true;
        return false;
    };
    QueryModel.prototype.isSelected = function (filterType, filterValue) {
        if (this.noneSelected(filterType) || (this.filters.has(filterType) && this.filters.get(filterType).has(filterValue))) {
            return true;
        }
        else {
            return false;
        }
    };
    QueryModel.equal = function (queryA, queryB) {
        // @hack -- TODO: semantically correct query comparison
        if (queryA && !queryB)
            return false;
        if (!queryA && queryB)
            return false;
        if (JSON.stringify(queryA.query) !== JSON.stringify(queryB.query))
            return false;
        if (JSON.stringify(queryA.filters.toObject()) !== JSON.stringify(queryB.filters.toObject()))
            return false;
        return true;
    };
    QueryModel.applyFilterToQuery = function (query, filter) {
        var filteredQuery = JSON.parse(JSON.stringify(query));
        if (!filter || !query)
            return filteredQuery;
        if (filter.get(FilterType.DATASET)) {
            var datasets = filter.get(FilterType.DATASET).toArray();
            if (datasets.length === 1) {
                filteredQuery.filters['source'] = datasets[0];
            }
            else {
                filteredQuery.filters['source'] = { "$all": datasets };
            }
        }
        if (filter.get(FilterType.TYPE)) {
            var types = filter.get(FilterType.TYPE).toArray();
            if (types.length === 1) {
                filteredQuery.filters['type'] = types[0];
            }
            else {
                filteredQuery.filters['type'] = { "$in": types };
            }
        }
        if (filter.get(FilterType.VARIANT_TAG)) {
            // only apply this filter to the top level query if it is a genome query
            var tags = filter.get(FilterType.VARIANT_TAG).toArray();
            if (tags.length === 1) {
                filteredQuery.filters['info.variant_tags'] = tags[0];
            }
            else {
                filteredQuery.filters['info.variant_tags'] = { "$in": tags };
            }
        }
        if (filter.get(FilterType.CONTIG)) {
            var contigs = filter.get(FilterType.CONTIG).toArray();
            if (contigs.length === 1) {
                filteredQuery.filters.contig = contigs[0];
            }
            else {
                filteredQuery.filters.contig = { "$in": contigs };
            }
        }
        return filteredQuery;
    };
    return QueryModel;
}());
exports.QueryModel = QueryModel;
//# sourceMappingURL=QueryModel.js.map