"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityType;
(function (EntityType) {
    EntityType["SNP"] = "SNP";
    EntityType["VARIANT"] = "variant";
    EntityType["GENE"] = "gene";
    EntityType["PSUDOGENE"] = "psudogene";
    EntityType["NCRNAGENE"] = "ncRNA_gene";
    EntityType["TRAIT"] = "trait";
    EntityType["GWAS"] = "association:SNP:trait";
    EntityType["EQTL"] = "association:SNP:gene";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
;
exports.default = EntityType;
//# sourceMappingURL=EntityType.js.map