interface Exports {
    exportObject: any;
    file: string;
}
export declare class SeekAndImport {
    private static getAllFilesWithSuffix;
    static importAll(suffixGlobPattern: string): Promise<Exports[]>;
}
export {};
