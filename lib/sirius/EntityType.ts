enum EntityType {
    SNP = 'SNP',
    VARIANT = 'variant',
    GENE = 'gene',
    PSUDOGENE = 'psudogene',
    NCRNAGENE = 'ncRNA_gene',
    TRAIT = 'trait',
    GWAS = 'association:SNP:trait',
    EQTL = 'association:SNP:gene',
    INTERVAL = 'interval',
};

export { EntityType };