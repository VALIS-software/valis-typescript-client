"use strict";
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
/**
 * Temporary API for development
 */
var axios_1 = require("axios");
var SiriusApi = /** @class */ (function () {
    function SiriusApi() {
    }
    SiriusApi.loadAnnotations = function (contig, startBaseIndex, span, macro) {
        var jsonPath = "https://valis-tmp-data.firebaseapp.com/data/annotation/" + contig + (macro ? '-macro' : '') + "/" + startBaseIndex + "," + span + ".json";
        return axios_1.default.get(jsonPath).then(function (a) {
            return a.data;
        });
    };
    SiriusApi.loadACGTSequence = function (contig, startBaseIndex, span, lodLevel) {
        var _this = this;
        var samplingDensity = (1 << lodLevel);
        var startBasePair = startBaseIndex + 1;
        var spanBasePair = span;
        var endBasePair = startBasePair + spanBasePair - 1;
        var url = this.apiUrl + "/datatracks/sequence/" + contig + "/" + startBasePair + "/" + endBasePair + "?sampling_rate=" + samplingDensity;
        var lodSpan = span / samplingDensity;
        return axios_1.default({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            headers: {},
        }).then(function (a) {
            var payloadArray = new Float32Array(_this.parseSiriusBinaryResponse(a.data));
            var baseCount = payloadArray.length / 4;
            if (baseCount > lodSpan) {
                console.warn("Payload too large, expected " + lodSpan + " units but received " + baseCount + " units");
            }
            // build compressed array
            var compressedArray = new Uint8Array(payloadArray.length);
            // find min/max
            var min = Infinity;
            var max = -Infinity;
            for (var i = 0; i < baseCount; i++) {
                var v0 = payloadArray[i * 4 + 0];
                var v1 = payloadArray[i * 4 + 1];
                var v2 = payloadArray[i * 4 + 2];
                var v3 = payloadArray[i * 4 + 3];
                min = Math.min(min, v0);
                min = Math.min(min, v1);
                min = Math.min(min, v2);
                min = Math.min(min, v3);
                max = Math.max(max, v0);
                max = Math.max(max, v1);
                max = Math.max(max, v2);
                max = Math.max(max, v3);
            }
            // use min/max to compress floats to bytes
            var delta = max - min;
            var scaleFactor = delta === 0 ? 0 : (1 / delta);
            for (var i = 0; i < baseCount; i++) {
                compressedArray[i * 4 + 0] = Math.round(Math.min((payloadArray[i * 4 + 0] - min) * scaleFactor, 1.) * 0xFF); // A
                compressedArray[i * 4 + 1] = Math.round(Math.min((payloadArray[i * 4 + 3] - min) * scaleFactor, 1.) * 0xFF); // C
                compressedArray[i * 4 + 2] = Math.round(Math.min((payloadArray[i * 4 + 2] - min) * scaleFactor, 1.) * 0xFF); // G
                compressedArray[i * 4 + 3] = Math.round(Math.min((payloadArray[i * 4 + 1] - min) * scaleFactor, 1.) * 0xFF); // T
            }
            return {
                array: compressedArray,
                sequenceMinMax: {
                    min: min,
                    max: max,
                },
                indicesPerBase: 4,
            };
        });
    };
    SiriusApi.loadSignal = function (sequenceId, lodLevel, lodStartBaseIndex, lodSpan) {
        var _this = this;
        var samplingDensity = (1 << lodLevel);
        var startBasePair = samplingDensity * lodStartBaseIndex + 1;
        var spanBasePair = lodSpan * samplingDensity;
        var endBasePair = startBasePair + spanBasePair - 1;
        var url = this.apiUrl + "/datatracks/ENCFF918ESR/chr1/" + startBasePair + "/" + endBasePair + "?sampling_rate=" + samplingDensity;
        return axios_1.default({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            headers: {},
        }).then(function (a) {
            var arraybuffer = _this.parseSiriusBinaryResponse(a.data);
            var payloadArray = new Float32Array(arraybuffer);
            console.log(arraybuffer, payloadArray);
            return payloadArray;
        });
    };
    SiriusApi.getContigs = function () {
        if (this._contigInfoPromise == null) {
            // initialize the promise
            this._contigInfoPromise = axios_1.default.get(SiriusApi.apiUrl + "/contig_info").then(function (data) {
                var e_1, _a;
                var infoArray = data.data;
                // create contig info map
                var contigInfoMap = {};
                try {
                    for (var infoArray_1 = __values(infoArray), infoArray_1_1 = infoArray_1.next(); !infoArray_1_1.done; infoArray_1_1 = infoArray_1.next()) {
                        var item = infoArray_1_1.value;
                        contigInfoMap[item.name] = {
                            start: item.start,
                            length: item.length
                        };
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (infoArray_1_1 && !infoArray_1_1.done && (_a = infoArray_1.return)) _a.call(infoArray_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return contigInfoMap;
            });
        }
        return this._contigInfoPromise;
    };
    SiriusApi.getCanisApiUrl = function () {
        return axios_1.default.get(this.apiUrl + "/canis_api").then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getGraphs = function () {
        return axios_1.default.get(this.apiUrl + "/graphs").then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getGraphData = function (graphId, annotationId1, annotationId2, startBp, endBp, samplingRate) {
        if (samplingRate === void 0) { samplingRate = 1; }
        var samplingRateQuery = "?sampling_rate=" + samplingRate;
        var requestUrl = this.apiUrl + "/graphs/" + graphId + "/" + annotationId1 + "/" + annotationId2 + "/" + startBp + "/" + endBp + samplingRateQuery;
        return axios_1.default.get(requestUrl);
    };
    SiriusApi.getTracks = function () {
        return axios_1.default.get(this.apiUrl + "/tracks").then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getTrackInfo = function () {
        return axios_1.default.get(this.apiUrl + "/track_info").then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getDistinctValues = function (key, query) {
        var requestUrl = this.apiUrl + "/distinct_values/" + key;
        return axios_1.default.post(requestUrl, query).then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getDetails = function (dataID, userFileID) {
        var requestUrl = this.apiUrl + "/details/" + dataID;
        if (userFileID) {
            requestUrl = requestUrl + "?userFileID=" + userFileID;
        }
        return axios_1.default.get(requestUrl).then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getQueryResults = function (query, full, startIdx, endIdx) {
        if (full === void 0) { full = false; }
        if (startIdx === void 0) { startIdx = null; }
        if (endIdx === void 0) { endIdx = null; }
        var requestUrl = this.apiUrl + "/query/basic";
        if (full) {
            requestUrl = this.apiUrl + "/query/full";
        }
        if (query.specialGWASQuery) {
            requestUrl = this.apiUrl + "/query/gwas";
        }
        var options = [];
        if (startIdx !== null) {
            options.push("result_start=" + startIdx);
        }
        if (endIdx !== null) {
            options.push("result_end=" + endIdx);
        }
        if (options.length > 0) {
            requestUrl = requestUrl + "?" + options.join('&');
        }
        return axios_1.default.post(requestUrl, query).then(function (data) {
            return data.data;
        });
    };
    SiriusApi.downloadQuery = function (query, sort) {
        if (sort === void 0) { sort = false; }
        var requestUrl = this.apiUrl + "/download_query";
        return axios_1.default.post(requestUrl, {
            query: query,
            sort: sort,
        });
    };
    // this special API is created for the "all-variants" track
    SiriusApi.getAllVariantTrackData = function (contig, startBp, endBp) {
        return axios_1.default.get(this.apiUrl + "/all_variant_track_data/" + contig + "/" + startBp + "/" + endBp).then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getVariantTrackData = function (contig, startBp, endBp, query) {
        return axios_1.default.post(this.apiUrl + "/variant_track_data/" + contig + "/" + startBp + "/" + endBp, query).then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getIntervalTrackData = function (contig, startBp, endBp, query) {
        return axios_1.default.post(this.apiUrl + "/interval_track_data/" + contig + "/" + startBp + "/" + endBp, query).then(function (data) {
            return data.data;
        });
    };
    SiriusApi.getSuggestions = function (termType, searchText, maxResults) {
        var _this = this;
        if (maxResults === void 0) { maxResults = 100; }
        maxResults = Math.round(maxResults);
        var cacheKey = termType + "|" + searchText + "|" + maxResults;
        var ret = null;
        if (this.suggestionsCache[cacheKey]) {
            ret = new Promise(function (resolve, reject) {
                resolve(_this.suggestionsCache[cacheKey]);
            });
        }
        else {
            ret = axios_1.default.post(this.apiUrl + "/suggestions", {
                term_type: termType,
                search_text: searchText,
                max_results: maxResults,
            }).then(function (data) {
                _this.suggestionsCache[cacheKey] = data.data.results.slice(0);
                return data.data.results;
            });
        }
        return ret;
    };
    SiriusApi.getUserProfile = function () {
        return axios_1.default.get(this.apiUrl + "/user_profile").then(function (data) {
            return data.data;
        });
    };
    SiriusApi.parseSiriusBinaryResponse = function (arraybuffer) {
        var byteView = new Uint8Array(arraybuffer);
        // find the start of the payload
        var nullByteIndex = 0;
        // let jsonHeader = '';
        for (var i = 0; i < arraybuffer.byteLength; i++) {
            var byte = byteView[i];
            if (byte === 0) {
                nullByteIndex = i;
                break;
            }
            else {
                // jsonHeader += String.fromCharCode(byte); // we usually don't care about the json header since it's a copy of input parameters
            }
        }
        var payloadBytes = arraybuffer.slice(nullByteIndex + 1);
        return payloadBytes;
    };
    SiriusApi.uploadFile = function (fileType, file, onUploadProgress) {
        if (onUploadProgress === void 0) { onUploadProgress = null; }
        var data = new FormData();
        data.append("file", file);
        data.append("fileType", fileType);
        var config = {
            onUploadProgress: onUploadProgress,
        };
        return axios_1.default.post(this.apiUrl + "/user_files", data, config);
    };
    SiriusApi.getUserFiles = function () {
        return axios_1.default.get(this.apiUrl + "/user_files").then(function (data) {
            return data.data;
        });
    };
    SiriusApi.deleteUserFile = function (fileID) {
        var requestConfig = {
            params: {
                fileID: fileID
            },
        };
        return axios_1.default.delete(this.apiUrl + "/user_files", requestConfig);
    };
    SiriusApi.apiUrl = '';
    SiriusApi.minMaxCache = {};
    SiriusApi.suggestionsCache = {};
    return SiriusApi;
}());
exports.SiriusApi = SiriusApi;
var ArrayFormat;
(function (ArrayFormat) {
    ArrayFormat["Float32"] = "f32";
    ArrayFormat["UInt8"] = "ui8";
})(ArrayFormat || (ArrayFormat = {}));
//# sourceMappingURL=SiriusApi.js.map