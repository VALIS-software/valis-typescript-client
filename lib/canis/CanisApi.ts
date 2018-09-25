
import axios from 'axios';


class Api {
    public static apiUrl = '';
    private static getMultiple(endpoint: string, constructFn: (json: any) => CanisObject) : Promise<Array<CanisObject>> {
        let url = `${Api.apiUrl}/${endpoint}`;
        return axios({
                method: 'get',
                url: url,
                headers: {},
            }).then((a) => {
                const resultList : Array<any> = a.data.reverse();
                return resultList.map(constructFn);
        });
    }

    private static getById(endpoint: string, objId: string, constructFn: (json: any) => CanisObject) : Promise<CanisObject> {
        let url = `${Api.apiUrl}/${endpoint}/${objId}`;
        return axios({
                method: 'get',
                url: url,
                headers: {},
            }).then((a : any) => {
                return constructFn(a.data);
        });
    }

    static getDatasets() : Promise<Array<Dataset>> {
        return Api.getMultiple(Dataset.resource, (json: any) => new Dataset(json)) as Promise<Array<Dataset>>;
    }

    static getAnalysis(analysisId: string) : Promise<Analysis> {
        return Api.getById(Analysis.resource, analysisId, (json: any) => new Analysis(json)) as Promise<Analysis>;
    }

    static getDataset(id: string) : Promise<Dataset> {
        return Api.getById(Dataset.resource, id, (json: any) => new Dataset(json) )as Promise<Dataset>;
    }

    static getJob(jobId: string) : Promise<Job> {
        return Api.getById(Job.resource, jobId, (json: any) => new Job(json)) as Promise<Job>;
    }
}


class CanisObject {
    protected _clientProps: any;
    protected _savedProps: any;

    constructor(json: any) {
        this._clientProps = json;
        this._savedProps = JSON.parse(JSON.stringify(json));
    }

    set name(_name: string) {
        this._clientProps.name = _name;
    }
    
    get name() : string {
        return this._clientProps.name;
    }

    get description() : string {
        return this._clientProps.description;
    }

    get id() : string {
        return this._savedProps._id.$oid;
    }

    save() : Promise<CanisObject> {
        return null;
    }
}

class Job extends CanisObject {
    public static readonly resource = 'jobs';
    constructor(json: any) {
        super(json);
    }

    get id() : string {
        return this._savedProps.job_id;
    }

    get jobId() : string {
        return this.id;
    }

    get jobType() : string {
        return this._savedProps.type;
    }

    get auther() : string {
        return this._savedProps.author;
    }

    getDefinition() : Promise<string> {
            return new Promise((resolve, reject) => {
                if (this._savedProps.code) {
                    resolve(this._savedProps.code);
                } else {
                    // Load the full model
                    Api.getJob(this.id).then((d: Job) => {
                        this._savedProps = JSON.parse(JSON.stringify(d._savedProps));
                        resolve(this._savedProps.code);
                    });
                }
        });
    }
}

class Analysis extends CanisObject {
    public static readonly resource = 'analyses';
    constructor(json: any) {
        super(json);
    }

    get analysisId() : string {
        return this.id;
    }

    get datasetId() : string {
        return this._savedProps.datasetId.$oid;
    }

    get analysisType() : AnalysisType {
        const analysisType: string = this._clientProps.analysisType;
        return (<any>AnalysisType)[analysisType];
    }

    get code() : string {
        return this._clientProps.code;
    }

    set code(code: string) {
        this._clientProps.code = code;
    }

    createRun(name?: string): Promise<Job> {
        let url = `${Api.apiUrl}/jobs`;
        return axios({
                method: 'post',
                url: url,
                headers: {},
                data: {
                    name: name || this.name,
                    code: 'import time; print("hello"); time.sleep(10)', //TODO: this.code,
                    type: 'RDD',
                    args: ''
                }
            }).then((a : any) => {
                return new Job(a.data);
        });
    }

    getRuns(withStatus?: RunStatusType) : Promise<Array<Job>> {
        const status = withStatus ? `&withStatus=${withStatus}` : '';
        let url = `${Api.apiUrl}/jobs?analysisId=${this.analysisId}${status}}`;
        return axios({
                method: 'get',
                url: url,
                headers: {},
            }).then((a : any) => {
                return a.data.map((analysisJson: any) => {
                    return new Job(analysisJson);
                });
        });
    }
}

enum RunStatusType {
    RUNNING,
    FINISHED,
    FAILED,
}

enum AnalysisType {
    JUPYTER,
    PATIENT,
    POPULATION,
    PARSER,
}

enum AnalysisParameterType {
    GENE,
    GENE_LIST,
    NUMBER,
    NUMBER_RANGE,
    STRING,
    PICKLIST,
}

type AnalysisParameter = {
    name: string,
    type: AnalysisParameterType,
    range?: number[],
    options?: string[][],
}

class Dataset extends CanisObject {
    public static readonly resource = 'datasets';
    constructor(json: any) {
        super(json);
    }

    get datasetId() : string {
        return this.id;
    }

    get sampleCount() : string {
        return null;
    }

    getAnalyses() : Promise<Array<Analysis>> {
        let url = `${Api.apiUrl}/analyses?datasetId=${this.datasetId}`;
        return axios({
                method: 'get',
                url: url,
                headers: {},
            }).then((a : any) => {
                return a.data.map((analysisJson: any) => {
                    return new Analysis(analysisJson);
                });
        });
    }

    createAnalysis(type: AnalysisType, code?: string) : Promise<Analysis> {
        let url = `${Api.apiUrl}/analyses`;
        return axios({
                method: 'post',
                url: url,
                headers: {},
                data: {
                    name: 'New Analysis',
                    code: code,
                    analysisType: AnalysisType[type],
                    datasetId: this.datasetId,
                }
            }).then((a : any) => {
                return new Analysis(a.data);
        });
    }
}

export { Api, Dataset, AnalysisType, Analysis, AnalysisParameter, AnalysisParameterType, Job, RunStatusType }