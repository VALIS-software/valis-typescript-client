declare enum QueryType {
    GENOME = "GenomeNode",
    INFO = "InfoNode",
    EDGE = "EdgeNode"
}
declare class QueryBuilder {
    query: any;
    constructor(query?: {});
    newGenomeQuery(): void;
    newInfoQuery(): void;
    newEdgeQuery(): void;
    filterID(id: any): void;
    filterType(type: any): void;
    filterSource(source: any): void;
    filterContig(contig: any): void;
    filterLength(length: any): void;
    filterName(name: any): void;
    filterMaxPValue(pvalue: number): void;
    filterBiosample(biosample: any): void;
    filterTargets(targets: Array<any>): void;
    filterInfotypes(type: any): void;
    filterAssay(assay: any): void;
    filterOutType(outType: any): void;
    filterStartBp(start: any): void;
    filterEndBp(end: any): void;
    filterAffectedGene(gene: any): void;
    filterVariantTag(tag: any): void;
    searchText(text: string): void;
    setLimit(limit: number): void;
    addToEdge(edgeQuery: any): void;
    setToNode(nodeQuery: any, reverse?: boolean): void;
    addArithmeticIntersect(genomeQuery: any): void;
    addArithmeticWindow(genomeQuery: any, windowSize?: number): void;
    addArithmeticUnion(genomeQuery: any): void;
    setSpecialGWASQuery(): void;
    setUserFileID(fileID: string): void;
    build(): any;
}
export { QueryType, QueryBuilder };
