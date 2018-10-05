import ValisBrowserConfig from "./ValisBrowserConfig";
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
