"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitCallExpression = exports.getModuleCallName = exports.MacroFunctionName = void 0;
const chalk_1 = __importDefault(require("chalk"));
const typescript_1 = __importStar(require("typescript"));
const isModuleImportExpression_1 = require("./isModuleImportExpression");
const guids_1 = __importDefault(require("./macro/guids"));
const registry_1 = require("./registry");
const shared_1 = require("./shared");
exports.MacroFunctionName = {
    guids: "$guids",
    debugUUIDs: "$debugUUIDs",
};
function handleGuidCallExpression(node, functionName, program, configuration) {
    var _a, _b;
    if (configuration.verbose)
        console.log(shared_1.formatTransformerDebug("Handling call to macro " + chalk_1.default.yellow(functionName), node));
    switch (functionName) {
        case exports.MacroFunctionName.guids:
            return guids_1.default(node, program, configuration);
        case exports.MacroFunctionName.debugUUIDs: {
            if (node.typeArguments) {
                const [enumerable] = node.typeArguments;
                if (enumerable && typescript_1.default.isTypeReferenceNode(enumerable)) {
                    const typeChecker = program.getTypeChecker();
                    const declaration = (_a = typeChecker.getTypeAtLocation(enumerable).getSymbol()) === null || _a === void 0 ? void 0 : _a.valueDeclaration;
                    if (declaration &&
                        typescript_1.default.isEnumDeclaration(declaration) &&
                        ((_b = declaration.modifiers) === null || _b === void 0 ? void 0 : _b.findIndex((f) => f.kind === typescript_1.default.SyntaxKind.ConstKeyword)) !== -1) {
                        const labelId = `${node.getSourceFile().fileName}:const-enum@${declaration.name.text}`;
                        return typescript_1.factory.createObjectLiteralExpression(declaration.members.map((m) => {
                            return typescript_1.factory.createPropertyAssignment(typescript_1.factory.createStringLiteral(configuration.EXPERIMENTAL_JSDocConstEnumUUID
                                ? registry_1.getGuidForLabel(`${labelId}:${m.name.getText()}`)
                                : m.initializer && typescript_1.default.isStringLiteral(m.initializer)
                                    ? m.initializer.text
                                    : ""), typescript_1.factory.createStringLiteral(m.name.getText()));
                        }));
                    }
                }
            }
            throw shared_1.formatTransformerDiagnostic(`${exports.MacroFunctionName.debugUUIDs} expects a type reference to a const enum.`, node);
        }
        default:
            throw shared_1.formatTransformerDiagnostic(`function ${chalk_1.default.yellow(functionName)} cannot be handled by this version of rbxts-transform-debug`);
    }
}
function getModuleCallName(node, program, config) {
    const typeChecker = program.getTypeChecker();
    const signature = typeChecker.getResolvedSignature(node);
    if (!signature) {
        return;
    }
    const { declaration } = signature;
    if (!declaration || typescript_1.default.isJSDocSignature(declaration) || !isModuleImportExpression_1.isModule(declaration.getSourceFile())) {
        return;
    }
    const functionName = declaration.name && declaration.name.getText();
    if (!functionName) {
        return;
    }
    return functionName;
}
exports.getModuleCallName = getModuleCallName;
function visitCallExpression(node, program, config) {
    const typeChecker = program.getTypeChecker();
    const signature = typeChecker.getResolvedSignature(node);
    if (!signature) {
        return node;
    }
    const { declaration } = signature;
    if (!declaration || typescript_1.default.isJSDocSignature(declaration) || !isModuleImportExpression_1.isModule(declaration.getSourceFile())) {
        return node;
    }
    const functionName = declaration.name && declaration.name.getText();
    if (!functionName) {
        return node;
    }
    return handleGuidCallExpression(node, functionName, program, config);
}
exports.visitCallExpression = visitCallExpression;
