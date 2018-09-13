"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var GenomeFeatureType;
(function (GenomeFeatureType) {
    // order corresponds to nesting depth
    GenomeFeatureType[GenomeFeatureType["Gene"] = 0] = "Gene";
    GenomeFeatureType[GenomeFeatureType["Transcript"] = 1] = "Transcript";
    GenomeFeatureType[GenomeFeatureType["TranscriptComponent"] = 2] = "TranscriptComponent";
})(GenomeFeatureType = exports.GenomeFeatureType || (exports.GenomeFeatureType = {}));
var GeneClass;
(function (GeneClass) {
    // this is a small, simplified subset of types specified in the Sequence Ontology
    GeneClass[GeneClass["Unspecified"] = 0] = "Unspecified";
    GeneClass[GeneClass["ProteinCoding"] = 1] = "ProteinCoding";
    GeneClass[GeneClass["NonProteinCoding"] = 2] = "NonProteinCoding";
    GeneClass[GeneClass["Pseudo"] = 3] = "Pseudo";
})(GeneClass = exports.GeneClass || (exports.GeneClass = {}));
var TranscriptClass;
(function (TranscriptClass) {
    TranscriptClass[TranscriptClass["Unspecified"] = 0] = "Unspecified";
    // aka protein coding RNA
    TranscriptClass[TranscriptClass["ProteinCoding"] = 1] = "ProteinCoding";
    // non-protein coding
    TranscriptClass[TranscriptClass["NonProteinCoding"] = 2] = "NonProteinCoding";
    // sub-types include
    // Ribosomal
    // Transfer
    // Small nuclear
    // Small nucleolar
})(TranscriptClass = exports.TranscriptClass || (exports.TranscriptClass = {}));
var TranscriptComponentClass;
(function (TranscriptComponentClass) {
    TranscriptComponentClass[TranscriptComponentClass["Exon"] = 0] = "Exon";
    TranscriptComponentClass[TranscriptComponentClass["Untranslated"] = 1] = "Untranslated";
    TranscriptComponentClass[TranscriptComponentClass["ProteinCodingSequence"] = 2] = "ProteinCodingSequence";
})(TranscriptComponentClass = exports.TranscriptComponentClass || (exports.TranscriptComponentClass = {}));
// small sub set of SO terms found in the Ensemble gff3 files
// for a more complete set, we should use data from https://github.com/The-Sequence-Ontology/SO-Ontologies
var SoGeneClass = /** @class */ (function () {
    function SoGeneClass() {
        this['gene'] = GeneClass.Unspecified;
        this['ncRNA_gene'] = GeneClass.NonProteinCoding;
        this['pseudogene'] = GeneClass.Pseudo;
    }
    SoGeneClass.instance = new SoGeneClass();
    return SoGeneClass;
}());
exports.SoGeneClass = SoGeneClass;
var SoTranscriptClass = /** @class */ (function () {
    function SoTranscriptClass() {
        this['lnc_RNA'] = TranscriptClass.NonProteinCoding;
        this['mRNA'] = TranscriptClass.ProteinCoding;
        this['pseudogenic_transcript'] = TranscriptClass.Unspecified;
        this['transcript'] = TranscriptClass.Unspecified;
        this['miRNA'] = TranscriptClass.NonProteinCoding;
        this['ncRNA'] = TranscriptClass.NonProteinCoding;
        this['rRNA'] = TranscriptClass.NonProteinCoding;
        this['scRNA'] = TranscriptClass.NonProteinCoding;
        this['snoRNA'] = TranscriptClass.NonProteinCoding;
        this['snRNA'] = TranscriptClass.NonProteinCoding;
    }
    SoTranscriptClass.instance = new SoTranscriptClass();
    return SoTranscriptClass;
}());
exports.SoTranscriptClass = SoTranscriptClass;
var SoTranscriptComponentClass = /** @class */ (function () {
    function SoTranscriptComponentClass() {
        this['CDS'] = TranscriptComponentClass.ProteinCodingSequence;
        this['exon'] = TranscriptComponentClass.Exon;
        this['five_prime_UTR'] = TranscriptComponentClass.Untranslated;
        this['three_prime_UTR'] = TranscriptComponentClass.Untranslated;
    }
    SoTranscriptComponentClass.instance = new SoTranscriptComponentClass();
    return SoTranscriptComponentClass;
}());
exports.SoTranscriptComponentClass = SoTranscriptComponentClass;
var Tileset = /** @class */ (function () {
    function Tileset(tileSize, topLevelOnly, onUnknownFeature, onError) {
        var _this = this;
        this.tileSize = tileSize;
        this.topLevelOnly = topLevelOnly;
        this.onUnknownFeature = onUnknownFeature;
        this.onError = onError;
        this.sequences = {};
        this.addTopLevelFeature = function (feature) {
            // tiles are determined at the top level
            var i0 = Math.floor(feature.start / _this.tileSize);
            var i1 = Math.floor(feature.end / _this.tileSize);
            for (var i = i0; i <= i1; i++) {
                var tile = _this.getTile(feature.sequenceId, i);
                _this.addFeature(tile, feature);
            }
        };
    }
    Tileset.prototype.addFeature = function (tile, feature) {
        var e_1, _a;
        var featureCommon = {
            name: feature.name,
            startIndex: feature.start - 1,
            length: feature.end - feature.start + 1,
            soClass: feature.type,
        };
        if (SoGeneClass.instance[feature.type] !== undefined) {
            // is gene
            // sum child transcripts
            var transcriptCount = feature.children.reduce(function (p, c) {
                var isTranscript = SoTranscriptClass.instance[c.type] !== undefined;
                return isTranscript ? (p + 1) : p;
            }, 0);
            var gene = __assign({}, featureCommon, { type: GenomeFeatureType.Gene, class: SoGeneClass.instance[feature.type], strand: feature.strand, transcriptCount: transcriptCount });
            tile.content.push(gene);
        }
        else if (SoTranscriptClass.instance[feature.type] !== undefined) {
            // is transcript
            var transcript = __assign({}, featureCommon, { type: GenomeFeatureType.Transcript, class: SoTranscriptClass.instance[feature.type] });
            tile.content.push(transcript);
        }
        else if (SoTranscriptComponentClass.instance[feature.type] !== undefined) {
            // is transcript component
            var info = __assign({}, featureCommon, { type: GenomeFeatureType.TranscriptComponent, class: SoTranscriptComponentClass.instance[feature.type] });
            if (feature.phase != null) {
                info.phase = feature.phase;
            }
            tile.content.push(info);
        }
        else {
            this.onUnknownFeature(feature);
            return;
        }
        if (!this.topLevelOnly) {
            try {
                for (var _b = __values(feature.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    this.addFeature(tile, child);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    Tileset.prototype.getTile = function (sequenceId, index) {
        var tiles = this.sequences[sequenceId];
        if (tiles === undefined) {
            // create tile array for sequence
            tiles = this.sequences[sequenceId] = [];
        }
        if (tiles[index] === undefined) {
            // create intervening tiles
            for (var i = 0; i <= index; i++) {
                if (tiles[i] === undefined) {
                    tiles[i] = {
                        startIndex: i * this.tileSize,
                        span: this.tileSize,
                        content: []
                    };
                }
            }
        }
        return tiles[index];
    };
    return Tileset;
}());
exports.Tileset = Tileset;
//# sourceMappingURL=AnnotationTileset.js.map