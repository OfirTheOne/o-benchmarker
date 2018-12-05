"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const appRoot = require("app-root-path");
class SeekAndImport {
    static getAllFilesWithSuffix(suffix) {
        const fileList = glob.sync(suffix, { ignore: ['**/node_modules/**', 'node_modules/**'] });
        return fileList;
    }
    static importAll(suffixGlobPattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const detectedModulesFiles = SeekAndImport.getAllFilesWithSuffix(suffixGlobPattern);
            const modulesExport = [];
            for (let i = 0; i < detectedModulesFiles.length; i++) {
                const file = detectedModulesFiles[i];
                try {
                    const moduleExport = yield Promise.resolve().then(() => require(appRoot.resolve(file)));
                    modulesExport.push({ exportObject: moduleExport, file });
                }
                catch (error) {
                    throw new Error(`failed to import module from ${file}`);
                }
            }
            return modulesExport;
        });
    }
}
exports.SeekAndImport = SeekAndImport;
//# sourceMappingURL=seek-and-import.js.map