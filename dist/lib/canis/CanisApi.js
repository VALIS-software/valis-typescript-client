"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.getMultiple = function (endpoint, constructFn) {
        var url = Api.apiUrl + "/" + endpoint;
        return axios_1.default({
            method: 'get',
            url: url,
            headers: {},
        }).then(function (a) {
            var resultList = a.data.reverse();
            return resultList.map(constructFn);
        });
    };
    Api.getById = function (endpoint, objId, constructFn) {
        var url = Api.apiUrl + "/" + endpoint + "/" + objId;
        return axios_1.default({
            method: 'get',
            url: url,
            headers: {},
        }).then(function (a) {
            return constructFn(a.data);
        });
    };
    Api.getDatasets = function () {
        return Api.getMultiple(Dataset.resource, function (json) { return new Dataset(json); });
    };
    Api.getAnalysis = function (analysisId) {
        return Api.getById(Analysis.resource, analysisId, function (json) { return new Analysis(json); });
    };
    Api.getDataset = function (id) {
        return Api.getById(Dataset.resource, id, function (json) { return new Dataset(json); });
    };
    Api.getJob = function (jobId) {
        return Api.getById(Job.resource, jobId, function (json) { return new Job(json); });
    };
    Api.getFiles = function (jobId) {
        var url = Api.apiUrl + "/files?jobId=" + jobId;
        return axios_1.default({
            method: 'get',
            url: url,
            headers: {},
        }).then(function (a) {
            var resultList = a.data.reverse();
            return resultList;
        });
    };
    Api.apiUrl = '';
    return Api;
}());
exports.Api = Api;
var CanisObject = /** @class */ (function () {
    function CanisObject(json) {
        this._clientProps = json;
        this._savedProps = JSON.parse(JSON.stringify(json));
    }
    Object.defineProperty(CanisObject.prototype, "name", {
        get: function () {
            return this._clientProps.name;
        },
        set: function (_name) {
            this._clientProps.name = _name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanisObject.prototype, "description", {
        get: function () {
            return this._clientProps.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanisObject.prototype, "id", {
        get: function () {
            return this._savedProps._id.$oid;
        },
        enumerable: true,
        configurable: true
    });
    CanisObject.prototype.save = function () {
        return null;
    };
    return CanisObject;
}());
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    function File(json) {
        return _super.call(this, json) || this;
    }
    File.prototype.uri = function () {
        return '';
    };
    return File;
}(CanisObject));
var Job = /** @class */ (function (_super) {
    __extends(Job, _super);
    function Job(json) {
        return _super.call(this, json) || this;
    }
    Object.defineProperty(Job.prototype, "id", {
        get: function () {
            return this._savedProps.job_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "jobId", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "jobType", {
        get: function () {
            return this._savedProps.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "auther", {
        get: function () {
            return this._savedProps.author;
        },
        enumerable: true,
        configurable: true
    });
    Job.prototype.getOutputFiles = function () {
        return Api.getFiles(this.id);
    };
    Job.prototype.getDefinition = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._savedProps.code) {
                resolve(_this._savedProps.code);
            }
            else {
                // Load the full model
                Api.getJob(_this.id).then(function (d) {
                    _this._savedProps = JSON.parse(JSON.stringify(d._savedProps));
                    resolve(_this._savedProps.code);
                });
            }
        });
    };
    Job.resource = 'jobs';
    return Job;
}(CanisObject));
exports.Job = Job;
var AnalysisParameterType;
(function (AnalysisParameterType) {
    AnalysisParameterType["GENE"] = "gene";
    AnalysisParameterType["GENE_LIST"] = "gene-list";
    AnalysisParameterType["NUMBER"] = "number";
    AnalysisParameterType["NUMBER_RANGE"] = "number-range";
    AnalysisParameterType["STRING"] = "string";
    AnalysisParameterType["PICKLIST"] = "picklist";
})(AnalysisParameterType || (AnalysisParameterType = {}));
exports.AnalysisParameterType = AnalysisParameterType;
var Analysis = /** @class */ (function (_super) {
    __extends(Analysis, _super);
    function Analysis(json) {
        return _super.call(this, json) || this;
    }
    Object.defineProperty(Analysis.prototype, "analysisId", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Analysis.prototype, "datasetId", {
        get: function () {
            return this._savedProps.datasetId.$oid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Analysis.prototype, "analysisType", {
        get: function () {
            var analysisType = this._clientProps.analysisType;
            return AnalysisType[analysisType];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Analysis.prototype, "code", {
        get: function () {
            return this._clientProps.code;
        },
        set: function (code) {
            this._clientProps.code = code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Analysis.prototype, "parameters", {
        get: function () {
            return JSON.parse(this._clientProps.parameters);
        },
        enumerable: true,
        configurable: true
    });
    Analysis.prototype.createRun = function (name, parameters) {
        var e_1, _a;
        var url = Api.apiUrl + "/jobs?analysisId=" + this.analysisId;
        var paramsObj = {};
        try {
            for (var parameters_1 = __values(parameters), parameters_1_1 = parameters_1.next(); !parameters_1_1.done; parameters_1_1 = parameters_1.next()) {
                var _b = __read(parameters_1_1.value, 2), k = _b[0], v = _b[1];
                paramsObj[k] = v;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (parameters_1_1 && !parameters_1_1.done && (_a = parameters_1.return)) _a.call(parameters_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return axios_1.default({
            method: 'post',
            url: url,
            headers: {},
            data: {
                name: name || this.name,
                code: this.code,
                type: 'RDD',
                args: paramsObj
            }
        }).then(function (a) {
            return new Job(a.data);
        });
    };
    Analysis.prototype.getRuns = function (withStatus) {
        var status = withStatus ? "&withStatus=" + withStatus : '';
        var url = Api.apiUrl + "/jobs?analysisId=" + this.analysisId + status;
        return axios_1.default({
            method: 'get',
            url: url,
            headers: {},
        }).then(function (a) {
            return a.data.map(function (analysisJson) {
                return new Job(analysisJson);
            });
        });
    };
    Analysis.resource = 'analyses';
    return Analysis;
}(CanisObject));
exports.Analysis = Analysis;
var RunStatusType;
(function (RunStatusType) {
    RunStatusType[RunStatusType["RUNNING"] = 0] = "RUNNING";
    RunStatusType[RunStatusType["FINISHED"] = 1] = "FINISHED";
    RunStatusType[RunStatusType["FAILED"] = 2] = "FAILED";
})(RunStatusType || (RunStatusType = {}));
exports.RunStatusType = RunStatusType;
var AnalysisType;
(function (AnalysisType) {
    AnalysisType[AnalysisType["JUPYTER"] = 0] = "JUPYTER";
    AnalysisType[AnalysisType["PATIENT"] = 1] = "PATIENT";
    AnalysisType[AnalysisType["POPULATION"] = 2] = "POPULATION";
    AnalysisType[AnalysisType["PARSER"] = 3] = "PARSER";
})(AnalysisType || (AnalysisType = {}));
exports.AnalysisType = AnalysisType;
var Dataset = /** @class */ (function (_super) {
    __extends(Dataset, _super);
    function Dataset(json) {
        return _super.call(this, json) || this;
    }
    Object.defineProperty(Dataset.prototype, "datasetId", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dataset.prototype, "sampleCount", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Dataset.prototype.getAnalyses = function () {
        var url = Api.apiUrl + "/analyses?datasetId=" + this.datasetId;
        return axios_1.default({
            method: 'get',
            url: url,
            headers: {},
        }).then(function (a) {
            return a.data.map(function (analysisJson) {
                return new Analysis(analysisJson);
            });
        });
    };
    Dataset.prototype.createAnalysis = function (name, type, code) {
        var url = Api.apiUrl + "/analyses";
        return axios_1.default({
            method: 'post',
            url: url,
            headers: {},
            data: {
                name: name,
                code: code,
                analysisType: AnalysisType[type],
                datasetId: this.datasetId,
            }
        }).then(function (a) {
            return new Analysis(a.data);
        });
    };
    Dataset.resource = 'datasets';
    return Dataset;
}(CanisObject));
exports.Dataset = Dataset;
//# sourceMappingURL=CanisApi.js.map