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
const bm_model_parser_1 = require("./bm-model-parser");
const seek_and_import_1 = require("../utils/seek-and-import/seek-and-import");
function tasksGroupImportScanner(suffixGlobPattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const tasksGroups = [];
        const modulesExport = yield seek_and_import_1.SeekAndImport.importAll(suffixGlobPattern);
        modulesExport.forEach((_module) => {
            for (const key in (_module.exportObject)) {
                if (_module.exportObject.hasOwnProperty(key)) {
                    const exportField = _module.exportObject[key];
                    if (bm_model_parser_1.ModelParser.isBenchmarkerTasksGroup(exportField)) {
                        tasksGroups.push(exportField);
                    }
                }
            }
        });
        return tasksGroups;
    });
}
exports.tasksGroupImportScanner = tasksGroupImportScanner;
//# sourceMappingURL=index.js.map