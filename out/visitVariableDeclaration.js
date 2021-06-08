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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAssignmentToEnum = void 0;
const typescript_1 = __importStar(require("typescript"));
const registry_1 = require("./registry");
const visitCallExpression_1 = require("./visitCallExpression");
function transformAssignmentToEnum(modifiers, name, namespace, values, useConstEnum) {
    const props = new Array();
    for (const prop of values.properties) {
        // if (ts.isStringLiteral(prop)) {
        if (prop.name !== undefined) {
            props.push(typescript_1.factory.createEnumMember(prop.name, typescript_1.factory.createStringLiteral(registry_1.getGuidForLabel(`${namespace}:${prop.name.getText()}`))));
        }
    }
    return typescript_1.factory.createEnumDeclaration(undefined, useConstEnum ? [typescript_1.factory.createModifier(typescript_1.default.SyntaxKind.ConstKeyword)] : [], name, props);
}
exports.transformAssignmentToEnum = transformAssignmentToEnum;
function visitVariableStatement(node, program, config) {
    var _a;
    const { declarationList: { declarations }, modifiers, } = node;
    if (declarations.length === 1) {
        const [declaration] = declarations;
        const { initializer, name } = declaration;
        if (initializer && typescript_1.default.isCallExpression(initializer)) {
            const moduleCallName = visitCallExpression_1.getModuleCallName(initializer, program, config);
            if (moduleCallName) {
                switch (moduleCallName) {
                    case visitCallExpression_1.MacroFunctionName.guids:
                        const [namespace, values] = initializer.arguments;
                        if (!typescript_1.default.isStringLiteral(namespace)) {
                            throw ``;
                        }
                        if (typescript_1.default.isObjectLiteralExpression(values)) {
                            return transformAssignmentToEnum(modifiers, name.getText(), namespace.text, values, (_a = config.useConstEnum) !== null && _a !== void 0 ? _a : false);
                        }
                }
            }
        }
    }
    return node;
}
exports.default = visitVariableStatement;
