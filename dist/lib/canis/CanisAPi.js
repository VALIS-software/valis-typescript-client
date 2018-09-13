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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var CanisApi = /** @class */ (function () {
    function CanisApi() {
    }
    CanisApi.getMultiple = function (endpoint, constructFn) {
        var url = CanisApi.apiUrl + "/" + endpoint;
        return axios_1.default({
            method: 'get',
            url: url,
            headers: {},
        }).then(function (a) {
            var resultList = a.data.reverse();
            return resultList.map(constructFn);
        });
    };
    CanisApi.getById = function (endpoint, objId, constructFn) {
        var url = CanisApi.apiUrl + "/" + endpoint + "/" + objId;
        return axios_1.default({
            method: 'get',
            url: url,
            headers: {},
        }).then(function (a) {
            return constructFn(a.data);
        });
    };
    CanisApi.getDatasets = function () {
        return CanisApi.getMultiple(Dataset.resource, function (json) { return new Dataset(json); });
    };
    CanisApi.getAnalysis = function (analysisId) {
        return CanisApi.getById(Analysis.resource, analysisId, function (json) { return new Analysis(json); });
    };
    CanisApi.getDataset = function (id) {
        return CanisApi.getById(Dataset.resource, id, function (json) { return new Dataset(json); });
    };
    CanisApi.getJob = function (jobId) {
        return CanisApi.getById(Job.resource, jobId, function (json) { return new Job(json); });
    };
    CanisApi.apiUrl = '';
    return CanisApi;
}());
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
    Job.prototype.getDefinition = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._savedProps.code) {
                resolve(_this._savedProps.code);
            }
            else {
                // Load the full model
                CanisApi.getJob(_this.id).then(function (d) {
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
    Analysis.prototype.createRun = function (name) {
        var url = CanisApi.apiUrl + "/jobs";
        return axios_1.default({
            method: 'post',
            url: url,
            headers: {},
            data: {
                name: name || this.name,
                code: 'import time; print("hello"); time.sleep(10)',
                type: 'RDD',
                args: ''
            }
        }).then(function (a) {
            return new Job(a.data);
        });
    };
    Analysis.prototype.getRuns = function (withStatus) {
        var status = withStatus ? "&withStatus=" + withStatus : '';
        var url = CanisApi.apiUrl + "/jobs?analysisId=" + this.analysisId + status + "}";
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
        var url = CanisApi.apiUrl + "/analyses?datasetId=" + this.datasetId;
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
    Dataset.prototype.createAnalysis = function (type, code) {
        var url = CanisApi.apiUrl + "/analyses";
        return axios_1.default({
            method: 'post',
            url: url,
            headers: {},
            data: {
                name: 'New Analysis',
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
exports.default = CanisApi;
//# sourceMappingURL=CanisAPi.js.map