declare class Api {
    static apiUrl: string;
    private static getMultiple;
    private static getById;
    static getDatasets(): Promise<Array<Dataset>>;
    static getAnalysis(analysisId: string): Promise<Analysis>;
    static getDataset(id: string): Promise<Dataset>;
    static getJob(jobId: string): Promise<Job>;
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
    getDefinition(): Promise<string>;
}
declare class Analysis extends CanisObject {
    static readonly resource: string;
    constructor(json: any);
    readonly analysisId: string;
    readonly datasetId: string;
    readonly analysisType: AnalysisType;
    code: string;
    createRun(name?: string): Promise<Job>;
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
    createAnalysis(type: AnalysisType, code?: string): Promise<Analysis>;
}
export { Api, Dataset, AnalysisType, Analysis, Job, RunStatusType };
