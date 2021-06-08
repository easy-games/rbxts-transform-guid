"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTransformerDiagnostic = exports.formatTransformerWarning = exports.formatTransformerInfo = exports.formatTransformerDebug = exports.getDebugInfo = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const name = `[${require("../package.json").name}]`;
function getDebugInfo(node) {
    const sourceFile = node.getSourceFile();
    const linePos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const relativePath = path_1.default.relative(process.cwd(), node.getSourceFile().fileName).replace(/\\/g, "/");
    return {
        sourceFile,
        linePos: linePos.line + 1,
        relativePath,
    };
}
exports.getDebugInfo = getDebugInfo;
function formatTransformerDebug(message, node) {
    if (node) {
        const info = getDebugInfo(node);
        const str = `${chalk_1.default.gray(name)} ${chalk_1.default.green("macro debug")} ${chalk_1.default.cyan(info.relativePath)}:${chalk_1.default.yellow(info.linePos)} - ${message}\n${chalk_1.default.italic(node.getText())}`;
        return str;
    }
    else {
        return `${chalk_1.default.gray(name)} ${chalk_1.default.green("macro debug")} - ` + message;
    }
}
exports.formatTransformerDebug = formatTransformerDebug;
function formatTransformerInfo(message, node) {
    if (node) {
        const str = `${chalk_1.default.gray(name)} ${chalk_1.default.cyan("macro info")} - ${message}\n${chalk_1.default.italic(node.getText())}`;
        return str;
    }
    else {
        return `${chalk_1.default.gray(name)} ${chalk_1.default.cyan("macro info")} ` + message;
    }
}
exports.formatTransformerInfo = formatTransformerInfo;
function formatTransformerWarning(message, node, suggestion) {
    if (node) {
        const info = getDebugInfo(node);
        let str = `${chalk_1.default.gray(name)} ${chalk_1.default.yellow("macro warning")} ${chalk_1.default.cyan(info.relativePath)}:${chalk_1.default.yellow(info.linePos)} - ${message}\n${chalk_1.default.italic(node.getText())}`;
        if (suggestion) {
            str += "\n* " + chalk_1.default.yellow(suggestion);
        }
        return str;
    }
    else {
        return `${chalk_1.default.gray(name)} ${chalk_1.default.yellow("macro warning")} - ` + message;
    }
}
exports.formatTransformerWarning = formatTransformerWarning;
function formatTransformerDiagnostic(message, node, suggestion) {
    if (node) {
        const info = getDebugInfo(node);
        let str = `${chalk_1.default.gray(name)} ${chalk_1.default.red("macro error")} ${chalk_1.default.cyan(info.relativePath)}:${chalk_1.default.yellow(info.linePos)} - ${message}\n${chalk_1.default.italic(node.getText())}`;
        if (suggestion) {
            str += "\n* " + chalk_1.default.yellow(suggestion);
        }
        return str;
    }
    else {
        return `${chalk_1.default.gray(name)} ${chalk_1.default.red("macro error")} - ` + message;
    }
}
exports.formatTransformerDiagnostic = formatTransformerDiagnostic;
