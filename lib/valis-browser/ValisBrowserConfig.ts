import { GenomeBrowserConfiguration } from "genome-visualizer/@types/GenomeBrowserConfiguration";

export type ValisBrowserConfig = {
	genomeBrowser: GenomeBrowserConfiguration,
	sidebar: {
		viewType: SidebarViewType,
		title?: string,
		viewProps?: any,
	},
	headerVisible?: boolean, // true if omitted
}

export enum SidebarViewType {
	None = 0,
	EntityDetails = 1,
	SearchResults = 2,
}

export default ValisBrowserConfig;