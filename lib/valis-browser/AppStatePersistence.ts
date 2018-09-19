import LZString = require("lz-string");
import { GenomeBrowserConfiguration } from "genome-browser/src/GenomeBrowser";

export type ValisBrowserConfig = {
	genomeBrowser: GenomeBrowserConfiguration,
	sidebar: {
		viewType: SidebarViewType,
		title?: string,
		viewProps?: any,
	}
}

export enum SidebarViewType {
	None = 0,
	EntityDetails = 1,
	SearchResults = 2,
}

// A minified version of ValisBrowserConfig
type MinifiedAppState = {
	/** TrackViewer state */
	t: {
		/** Panel data: [[panel.contig, panel.x0, panel.x1, width], ...] */
		p: Array<Array<any>>,
		/** Track row data: [[row.trackRow.model, row.heightPx], ...] */
		t: Array<Array<any>>
	},
	/** Sidebar view state */
	s: {
		/** Sidebar view type */
		t: SidebarViewType,
		/** Sidebar view */
		h?: string,
		/** Sidebar view props */
		p?: any,
	}
}


export class AppStatePersistence {

	static version = 0;

	static getUrlHash(stateObject: ValisBrowserConfig) {
		let stateUrl = '#' + this.serializeConfig(stateObject);
		return stateUrl;
	}

	/**
	 * @throws string on invalid state url
	 */
	static parseUrlHash(hash: string): ValisBrowserConfig {
		let stateString = hash.substring(1);
		return this.deserializeConfig(stateString);
	}

	private static serializeConfig(state: ValisBrowserConfig): string {
		let minifiedState: MinifiedAppState = {
			t: this.minifyGenomeBrowserState(state.genomeBrowser),
			s: this.minifySidebarState(state.sidebar)
		};

		let jsonString = JSON.stringify(minifiedState);
		let compressedString = LZString.compressToBase64(jsonString);

		return compressedString;
	}

	/**
	 * @throws string on invalid serialized data
	 */
	private static deserializeConfig(serialized: string): ValisBrowserConfig {
		let jsonString = LZString.decompressFromBase64(serialized);
		if (jsonString == null) {
			throw `Invalid state string - could not decompress`;
		}

		let minifiedState: MinifiedAppState = JSON.parse(jsonString);

		let expandedState: ValisBrowserConfig = {
			genomeBrowser: this.expandGenomeBrowserState(minifiedState.t),
			sidebar: this.expandSidebarState(minifiedState.s)
		};

		return expandedState;
	}

	private static minifyGenomeBrowserState(state: ValisBrowserConfig['genomeBrowser']): MinifiedAppState['t'] {
		let minifiedPanels: MinifiedAppState['t']['p'] = new Array();
		for (let panel of state.panels) {
			minifiedPanels.push([
				panel.location.contig,
				panel.location.x0,
				panel.location.x1,
				panel.width
			]);
		}

		let minifiedTracks: MinifiedAppState['t']['t'] = new Array();
		for (let track of state.tracks) {
			minifiedTracks.push([
				track.model,
				track.heightPx
			]);
		}

		return {
			p: minifiedPanels,
			t: minifiedTracks
		};
	}

	private static expandGenomeBrowserState(min: MinifiedAppState['t']): ValisBrowserConfig['genomeBrowser'] {
		let minPanels = min.p;
		let minTracks = min.t;

		let panels: ValisBrowserConfig['genomeBrowser']['panels'] = new Array();

		for (let minPanel of minPanels) {
			panels.push({
				location: {
					contig: minPanel[0],
					x0: minPanel[1],
					x1: minPanel[2],
				},
				width: minPanel[3],
			});
		}

		let tracks: ValisBrowserConfig['genomeBrowser']['tracks'] = new Array();

		for (let minTrack of minTracks) {
			tracks.push({
				model: minTrack[0],
				heightPx: minTrack[1],
			});
		}

		return {
			panels: panels,
			tracks: tracks,
		};
	}

	private static minifySidebarState(state: ValisBrowserConfig['sidebar']): MinifiedAppState['s'] {
		return {
			t: state.viewType,
			h: state.title,
			p: state.viewProps,
		};
	}

	private static expandSidebarState(min: MinifiedAppState['s']): ValisBrowserConfig['sidebar'] {
		return {
			viewType: min.t,
			title: min.h,
			viewProps: min.p
		};
	}

}

export default AppStatePersistence;