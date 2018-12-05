import * as  glob  from 'glob';
import * as appRoot from 'app-root-path';

interface Exports {exportObject: any, file: string}

export class SeekAndImport {

    private static getAllFilesWithSuffix(suffix: string): string[] {
        const fileList = glob.sync(suffix, {ignore: ['**/node_modules/**', 'node_modules/**']});
        return fileList;
    }
    

    public static async importAll(suffixGlobPattern: string): Promise <Exports[]> {
        const detectedModulesFiles = SeekAndImport.getAllFilesWithSuffix(suffixGlobPattern);
        const modulesExport: Exports[] = [];
    
        for (let i = 0; i < detectedModulesFiles.length; i++) {
            const file = detectedModulesFiles[i];
            try {
                const moduleExport = await import(appRoot.resolve(file));
                modulesExport.push({ exportObject: moduleExport, file});
            } catch (error) {
                throw new Error(`failed to import module from ${file}`);
            }   
        }
        return modulesExport;
    }
    

}