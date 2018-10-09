declare class Api {
    static apiUrl: string;
    private static getMultiple;
    private static getById;
    static getDatasets(): Promise<Array<Dataset>>;
    static getAnalysis(analysisId: string): Promise<Analysis>;
    static getDataset(id: string): Promise<Dataset>;
    static getJob(jobId: string): Promise<Job>;
    static getFiles(jobId: string): Promise<Array<string>>;
}
declare class CanisObject {
    protected _clientProps: any;
    protected _savedProps: any;
    constructor(json: any);
    name: string;
    readonly description: string;
    readonly id: string;
    save(): Promise<CanisObject>;
}
declare class Job extends CanisObject {
    static readonly resource: string;
    constructor(json: any);
    readonly id: string;
    readonly jobId: string;
    readonly jobType: string;
    readonly auther: string;
    getOutputFiles(): Promise<string[]>;
    getDefinition(): Promise<string>;
}
declare enum AnalysisParameterType {
    GENE = "gene",
    GENE_LIST = "gene-list",
    NUMBER = "number",
    NUMBER_RANGE = "number-range",
    STRING = "string",
    PICKLIST = "picklist"
}
declare type AnalysisParameterValue = number[] | string | number | string[];
declare type AnalysisParameter = {
    name: string;
    type: AnalysisParameterType;
    range?: number[];
    options?: string[][];
};
declare class Analysis extends CanisObject {
    static readonly resource: string;
    constructor(json: any);
    readonly analysisId: string;
    readonly datasetId: string;
    readonly analysisType: AnalysisType;
    code: string;
    readonly parameters: Map<string, AnalysisParameterValue>;
    createRun(name?: string, parameters?: Map<string, AnalysisParameterValue>): Promise<Job>;
    getRuns(withStatus?: RunStatusType): Promise<Array<Job>>;
}
declare enum RunStatusType {
    RUNNING = 0,
    FINISHED = 1,
    FAILED = 2
}
declare enum AnalysisType {
    JUPYTER = 0,
    PATIENT = 1,
    POPULATION = 2,
    PARSER = 3
}
declare class Dataset extends CanisObject {
    static readonly resource: string;
    constructor(json: any);
    readonly datasetId: string;
    readonly sampleCount: string;
    getAnalyses(): Promise<Array<Analysis>>;
    createAnalysis(name: string, type: AnalysisType, code?: string): Promise<Analysis>;
}
export { Api, Dataset, AnalysisType, Analysis, AnalysisParameter, AnalysisParameterType, AnalysisParameterValue, Job, RunStatusType };
