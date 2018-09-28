import { GenomeBrowserConfiguration } from "genome-browser/@types/GenomeBrowserConfiguration";
export declare type ValisBrowserConfig = {
    genomeBrowser: GenomeBrowserConfiguration;
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
