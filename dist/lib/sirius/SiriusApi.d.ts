import { GenomeFeature } from "genome-visualizer/@types/track/annotation/AnnotationTypes";
declare class SiriusApi {
    static apiUrl: string;
    static getAccessToken(): string;
    private static minMaxCache;
    private static suggestionsCache;
    static loadAnnotations(contig: string, startBaseIndex: number, span: number, macro: boolean): Promise<Array<GenomeFeature>>;
    static loadACGTSequence(contig: string, startBaseIndex: number, span: number, lodLevel: number): Promise<{
        array: Uint8Array;
        sequenceMinMax: {
            min: number;
            max: number;
        };
        indicesPerBase: number;
    }>;
    static loadSignal(sequenceId: string, lodLevel: number, lodStartBaseIndex: number, lodSpan: number): Promise<Float32Array>;
    private static _contigInfoPromise;
    static getContigs(): Promise<{
        [contig: string]: {
            start: number;
            length: number;
        };
    }>;
    static getCanisApiUrl(): Promise<any>;
    static getGraphs(): Promise<any>;
    static getGraphData(graphId: string, annotationId1: string, annotationId2: string, startBp: number, endBp: number, samplingRate?: number): import("axios").AxiosPromise<any>;
    static getTracks(): Promise<any>;
    static getTrackInfo(): Promise<any>;
    static getDistinctValues(key: string, query: any): Promise<any>;
    static getDetails(dataID: string, userFileID?: string): Promise<any>;
    static getQueryResults(query: any, full?: boolean, startIdx?: number, endIdx?: number): Promise<any>;
    static downloadQuery(query: any, sort?: boolean): import("axios").AxiosPromise<any>;
    static getAllVariantTrackData(contig: string, startBp: number, endBp: number): Promise<any>;
    static getVariantTrackData(contig: string, startBp: number, endBp: number, query: any): Promise<any>;
    static getIntervalTrackData(contig: string, startBp: number, endBp: number, query: any, fields?: Array<string>): Promise<any>;
    static getSuggestions(termType: string, searchText: string, maxResults?: number): Promise<any>;
    private static parseSiriusBinaryResponse;
    static uploadFile(fileType: string, file: any, onUploadProgress?: any): import("axios").AxiosPromise<any>;
    static getUserFiles(): Promise<any>;
    static deleteUserFile(fileID: string): import("axios").AxiosPromise<any>;
}
export { SiriusApi };
