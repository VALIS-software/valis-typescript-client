import { Map, Set } from 'immutable';
export declare type FilterValue = string;
export declare enum FilterType {
    DATASET = 0,
    TYPE = 1,
    VARIANT_TAG = 2,
    CONTIG = 3
}
declare type FilterValueSet = Set<FilterValue>;
declare class QueryModel {
    query: any;
    filters: Map<FilterType, FilterValueSet>;
    constructor(query: any);
    extractQueryFilters(): void;
    toggleSelected(filterType: FilterType, filterValue: FilterValue): QueryModel;
    getFilteredQuery(): any;
    setQuery(query: any): void;
    setFilters(filters: Map<FilterType, FilterValueSet>): void;
    printFilters(): string;
    noneSelected(filterType: FilterType): boolean;
    isSelected(filterType: FilterType, filterValue: FilterValue): boolean;
    static equal(queryA: QueryModel, queryB: QueryModel): boolean;
    protected static applyFilterToQuery(query: any, filter: Map<FilterType, FilterValueSet>): any;
}
export { QueryModel };
