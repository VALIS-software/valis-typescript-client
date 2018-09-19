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
var LZString = require("lz-string");
var SidebarViewType;
(function (SidebarViewType) {
    SidebarViewType[SidebarViewType["None"] = 0] = "None";
    SidebarViewType[SidebarViewType["EntityDetails"] = 1] = "EntityDetails";
    SidebarViewType[SidebarViewType["SearchResults"] = 2] = "SearchResults";
})(SidebarViewType = exports.SidebarViewType || (exports.SidebarViewType = {}));
var AppStatePersistence = /** @class */ (function () {
    function AppStatePersistence() {
    }
    AppStatePersistence.getUrlHash = function (stateObject) {
        var stateUrl = '#' + this.serializeConfig(stateObject);
        return stateUrl;
    };
    /**
     * @throws string on invalid state url
     */
    AppStatePersistence.parseUrlHash = function (hash) {
        var stateString = hash.substring(1);
        return this.deserializeConfig(stateString);
    };
    AppStatePersistence.serializeConfig = function (state) {
        var minifiedState = {
            t: this.minifyGenomeBrowserState(state.genomeBrowser),
            s: this.minifySidebarState(state.sidebar)
        };
        var jsonString = JSON.stringify(minifiedState);
        var compressedString = LZString.compressToBase64(jsonString);
        return compressedString;
    };
    /**
     * @throws string on invalid serialized data
     */
    AppStatePersistence.deserializeConfig = function (serialized) {
        var jsonString = LZString.decompressFromBase64(serialized);
        if (jsonString == null) {
            throw "Invalid state string - could not decompress";
        }
        var minifiedState = JSON.parse(jsonString);
        var expandedState = {
            genomeBrowser: this.expandGenomeBrowserState(minifiedState.t),
            sidebar: this.expandSidebarState(minifiedState.s)
        };
        return expandedState;
    };
    AppStatePersistence.minifyGenomeBrowserState = function (state) {
        var e_1, _a, e_2, _b;
        var minifiedPanels = new Array();
        try {
            for (var _c = __values(state.panels), _d = _c.next(); !_d.done; _d = _c.next()) {
                var panel = _d.value;
                minifiedPanels.push([
                    panel.location.contig,
                    panel.location.x0,
                    panel.location.x1,
                    panel.width
                ]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var minifiedTracks = new Array();
        try {
            for (var _e = __values(state.tracks), _f = _e.next(); !_f.done; _f = _e.next()) {
                var track = _f.value;
                minifiedTracks.push([
                    track.model,
                    track.heightPx
                ]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return {
            p: minifiedPanels,
            t: minifiedTracks
        };
    };
    AppStatePersistence.expandGenomeBrowserState = function (min) {
        var e_3, _a, e_4, _b;
        var minPanels = min.p;
        var minTracks = min.t;
        var panels = new Array();
        try {
            for (var minPanels_1 = __values(minPanels), minPanels_1_1 = minPanels_1.next(); !minPanels_1_1.done; minPanels_1_1 = minPanels_1.next()) {
                var minPanel = minPanels_1_1.value;
                panels.push({
                    location: {
                        contig: minPanel[0],
                        x0: minPanel[1],
                        x1: minPanel[2],
                    },
                    width: minPanel[3],
                });
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (minPanels_1_1 && !minPanels_1_1.done && (_a = minPanels_1.return)) _a.call(minPanels_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var tracks = new Array();
        try {
            for (var minTracks_1 = __values(minTracks), minTracks_1_1 = minTracks_1.next(); !minTracks_1_1.done; minTracks_1_1 = minTracks_1.next()) {
                var minTrack = minTracks_1_1.value;
                tracks.push({
                    model: minTrack[0],
                    heightPx: minTrack[1],
                });
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (minTracks_1_1 && !minTracks_1_1.done && (_b = minTracks_1.return)) _b.call(minTracks_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return {
            panels: panels,
            tracks: tracks,
        };
    };
    AppStatePersistence.minifySidebarState = function (state) {
        return {
            t: state.viewType,
            h: state.title,
            p: state.viewProps,
        };
    };
    AppStatePersistence.expandSidebarState = function (min) {
        return {
            viewType: min.t,
            title: min.h,
            viewProps: min.p
        };
    };
    AppStatePersistence.version = 0;
    return AppStatePersistence;
}());
exports.AppStatePersistence = AppStatePersistence;
exports.default = AppStatePersistence;
//# sourceMappingURL=AppStatePersistence.js.map