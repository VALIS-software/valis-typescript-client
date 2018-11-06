import { GenomeVisualizerConfiguration } from "genome-visualizer/@types/GenomeVisualizerConfiguration";

export type ValisBrowserConfig = {
	genomeVisualizer: GenomeVisualizerConfiguration,
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