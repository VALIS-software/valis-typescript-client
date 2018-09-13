import { Feature, FeatureAttributes } from "./Feature";
import Gff3LineParser from './Gff3LineParser';
import { Strand } from "./Strand";
export declare type Gff3 = {
    version: string;
    featureOntologyUri?: Array<string>;
    attributeOntologyUri?: Array<string>;
    sourceOntologyUri?: Array<string>;
    genomeBuild?: {
        source: string;
        buildName: string;
    };
    speciesUri?: string;
    sequences: {
        [seqId: string]: {
            start?: number;
            end?: number;
            features: Set<Feature>;
        };
    };
    fasta?: string;
};
export declare type Callbacks = {
    onFeatureComplete: (feature: Feature) => void;
    onComplete: (gff3: Gff3) => void;
    onError: (reason: string) => void;
    onComment: (comment: string) => void;
};
export declare class Gff3Parser {
    protected storeFeatures: boolean;
    protected lineParser: Gff3LineParser;
    protected callbacks: Callbacks;
    constructor(callbacks: Partial<Callbacks>, storeFeatures: boolean);
    parseChunk: (chunk: string) => void;
    end: () => void;
    protected gff3: Gff3;
    protected currentScope: {
        [id: string]: Feature;
    };
    protected currentScopeTopLevel: Set<Feature>;
    protected reset(): void;
    protected defineFeature: (seqId: string, source: string, type: string, start: number, end: number, score: number, strand: Strand, phase: number, attributes: FeatureAttributes) => void;
    protected closeCurrentScope: () => void;
    protected onLineParserComplete: () => void;
    protected getSequence(seqId: string): {
        start?: number;
        end?: number;
        features: Set<Feature>;
    };
    protected setSequenceRange: (seqId: string, start: number, end: number) => void;
}
export default Gff3Parser;
