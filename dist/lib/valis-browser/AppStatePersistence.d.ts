import { GenomeBrowserConfiguration } from "genome-browser/src/GenomeBrowser";
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
export declare class AppStatePersistence {
    static version: number;
    static getUrlHash(stateObject: ValisBrowserConfig): string;
    /**
     * @throws string on invalid state url
     */
    static parseUrlHash(hash: string): ValisBrowserConfig;
    private static serializeConfig;
    /**
     * @throws string on invalid serialized data
     */
    private static deserializeConfig;
    private static minifyGenomeBrowserState;
    private static expandGenomeBrowserState;
    private static minifySidebarState;
    private static expandSidebarState;
}
export default AppStatePersistence;
