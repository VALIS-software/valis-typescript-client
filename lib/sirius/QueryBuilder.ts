enum QueryType {
  GENOME = 'GenomeNode',
  INFO = 'InfoNode',
  EDGE = 'EdgeNode',
}

class QueryBuilder {
  query: any;

  constructor(query = {}) {
    this.query = JSON.parse(JSON.stringify(query));
  }

  newGenomeQuery() {
    this.query = {
      type: QueryType.GENOME,
      filters: {},
      toEdges: [],
      arithmetics: [],
    };
  }

  newInfoQuery() {
    this.query = {
      type: QueryType.INFO,
      filters: {},
      toEdges: [],
    };
  }

  newEdgeQuery() {
    this.query = {
      type: QueryType.EDGE,
      filters: {},
      toNode: {},
    };
  }

  filterID(id: any) {
    this.query.filters._id = id;
  }

  filterType(type: any) {
    this.query.filters.type = type;
  }

  filterSource(source: any) {
    this.query.filters.source = source;
  }

  filterContig(contig: any) {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('filter contig only available for GenomeNodes');
    }
    this.query.filters.contig = contig;
  }

  filterLength(length: any) {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('Length only available for GenomeNodes');
    }
    this.query.filters.length = length;
  }

  filterName(name: any) {
    this.query.filters.name = name;
  }

  filterPathway(pathways: any) {
    this.query.filters['info.kegg_pathways'] = pathways;
  }

  filterMaxPValue(pvalue: number) {
    this.query.filters['info.p-value'] = { '<': pvalue };
  }

  filterBiosample(biosample: any) {
    this.query.filters['info.biosample'] = biosample;
  }

  filterTargets(targets: Array<any>) {
    if (targets.length > 0) {
      this.query.filters['info.targets'] = { $all: targets };
    }
  }

  filterInfotypes(type: any) {
    this.query.filters['info.types'] = type;
  }

  filterAssay(assay: any) {
    this.query.filters['info.assay'] = assay;
  }

  filterOutType(outType: any) {
    this.query.filters['info.outtype'] = outType;
  }

  filterPatientBarCode(outType: any) {
    this.query.filters['info.patient_barcodes'] = outType;
  }

  filterStartBp(start: any) {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('filterStartBp is only available for an Genome Query.');
    }
    this.query.filters.start = start;
  }

  filterEndBp(end: any) {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('filterEndBp is only available for an Genome Query.');
    }
    this.query.filters.end = end;
  }

  filterAffectedGene(gene: any) {
    const previous = this.query.filters['variant_affected_genes'] || [];
    this.query.filters['info.variant_affected_genes'] = gene;
  }

  filterVariantTag(tag: any) {
    const previous = this.query.filters['variant_tags'] || [];
    this.query.filters['info.variant_tags'] = tag;
  }

  searchText(text: string) {
    this.query.filters.$text = text;
  }

  setLimit(limit: number) {
    this.query.limit = limit;
  }

  addToEdge(edgeQuery: any) {
    if (this.query.type === QueryType.EDGE) {
      throw new Error('Edge can not be connect to another edge.');
    }
    this.query.toEdges.push(edgeQuery);
  }

  setToNode(nodeQuery: any, reverse=false) {
    if (this.query.type !== QueryType.EDGE) {
      throw new Error('toNode is only available for an Edge Query.');
    }
    this.query.toNode = nodeQuery;
    this.query.reverse = reverse;
  }

  addArithmeticIntersect(genomeQuery: any) {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('Arithmetic is only available for an Genome Query.');
    }
    const ar = {
      'operator': 'intersect',
      'target_queries': [genomeQuery],
    }
    this.query.arithmetics.push(ar);
  }

  addArithmeticWindow(genomeQuery: any, windowSize = 1000) {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('Arithmetic is only available for an Genome Query.');
    }
    const ar = {
      'operator': 'window',
      'target_queries': [genomeQuery],
      'windowSize': windowSize,
    }
    this.query.arithmetics.push(ar);
  }

  addArithmeticUnion(genomeQuery: any) {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('Arithmetic is only available for an Genome Query.');
    }
    const ar = {
      'operator': 'union',
      'target_queries': [genomeQuery],
    }
    this.query.arithmetics.push(ar);
  }

  setSpecialGWASQuery() {
    if (this.query.type !== QueryType.GENOME) {
      throw new Error('setSpecialGWASQuery should be applied to a Genome Query.');
    }
    if (!this.query.toEdges || this.query.toEdges < 1) {
      throw new Error('GWAS query should have at least 1 edge.');
    }
    for (const edge of this.query.toEdges) {
      if (!edge.toNode || edge.toNode.type !== QueryType.INFO) {
        throw new Error('The edge of GWAS query should connect to InfoNode.');
      }
    }
    this.query.specialGWASQuery = true;
  }

  // Specify reading from user files
  setUserFileID(fileID: string) {
    this.query.userFileID = fileID;
  }

  build() {
    return JSON.parse(JSON.stringify(this.query));
  }
}

export { QueryType, QueryBuilder }