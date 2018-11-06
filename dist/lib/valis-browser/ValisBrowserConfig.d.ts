import { GenomeVisualizerConfiguration } from "genome-visualizer/@types/GenomeVisualizerConfiguration";
export declare type ValisBrowserConfig = {
    genomeVisualizer: GenomeVisualizerConfiguration;
    sidebar: {
        viewType: SidebarViewType;
        title?: string;
        viewProps?: any;
    };
    headerVisible?: boolean;
};
export declare enum SidebarViewType {
    None = 0,
    EntityDetails = 1,
    SearchResults = 2
}
export default ValisBrowserConfig;
