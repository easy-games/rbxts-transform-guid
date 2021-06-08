"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModuleImportExpression = exports.isModule = void 0;
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const sourceText = fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "index.d.ts"), "utf8");
function isModule(sourceFile) {
    return sourceFile.text === sourceText;
}
exports.isModule = isModule;
function isModuleImportExpression(node, program) {
    if (!typescript_1.default.isImportDeclaration(node)) {
        return false;
    }
    if (!node.importClause) {
        return false;
    }
    const namedBindings = node.importClause.namedBindings;
    if (!node.importClause.name && !namedBindings) {
        return false;
    }
    const importSymbol = program.getTypeChecker().getSymbolAtLocation(node.moduleSpecifier);
    if (!importSymbol || !isModule(importSymbol.valueDeclaration.getSourceFile())) {
        return false;
    }
    return true;
}
exports.isModuleImportExpression = isModuleImportExpression;
