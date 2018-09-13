import { Strand } from "./Strand";
import { FeatureAttributes } from "./Feature";
/**
 * # GFF3 File format
 * https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md
 */
export declare type LineCallbacks = {
    onVersion: (versionString: string) => void;
    onSequenceRegion: (seqId: string | null, start: number | null, end: number | null) => void;
    onFeatureOntology: (uri: string) => void;
    onAttributeOntology: (uri: string) => void;
    onSourceOntology: (uri: string) => void;
    onSpecies: (ncbiTaxonomyUri: string) => void;
    onGenomeBuild: (source: string, buildName: string) => void;
    onFeatureGroupTermination: () => void;
    onFastaStart: () => void;
    onComment: (comment: string) => void;
    onFeature: (seqId: string, source: string | null, type: string, start: number | null, end: number | null, score: number | null, strand: Strand, phase: Phase | null, attributes: FeatureAttributes) => void;
    onInvalidFeature: (line: string, reason: string) => void;
    onInvalidAttribute: (assignment: string, reason: string) => void;
    onUnknownDirective: (name: string, parameter: string | null) => void;
    onInvalidDirective: (content: string, reason: string) => void;
    onFastaChunk: (string: string) => void;
    onComplete: () => void;
};
export declare type Phase = number;
export declare class Gff3LineParser {
    protected callbacks: LineCallbacks;
    protected lineNumber: number;
    protected fastaMode: boolean;
    protected incompleteLineBuffer: string;
    constructor(callbacks: Partial<LineCallbacks>);
    parseChunk: (string: string) => void;
    end: () => void;
    reset: () => void;
    protected parseLine(line: string, lineNumber: number): void;
    protected parseOptional(field: string): string | null;
    protected parseStrand(field: string | null): Strand;
    protected parseAttributes(field: string | null): FeatureAttributes;
    protected parseMeta(line: string): void;
    protected parseDirective(line: string): void;
}
export default Gff3LineParser;
