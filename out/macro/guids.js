"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const shared_1 = require("../shared");
function transformGuidsMacro(node, program, config) {
    const [namespace, values] = node.arguments;
    if (!typescript_1.default.isStringLiteral(namespace)) {
        throw shared_1.formatTransformerDiagnostic("Namespace should be a string literal!", namespace);
    }
    if (!typescript_1.default.isObjectLiteralExpression(values)) {
        throw shared_1.formatTransformerDiagnostic("values should be an object literal", values);
    }
    throw shared_1.formatTransformerDiagnostic("NO");
    // if (ts.isVariableDeclaration(node.parent) && ts.isVariableStatement(node.parent.parent.parent)) {
    // 	if (config.verbose) {
    // 		console.log(formatTransformerDebug("Node parent is variable declaration", node.parent));
    // 	}
    // 	const {
    // 		parent: { name },
    // 	} = node;
    // 	const statement = node.parent.parent.parent;
    // 	const type = statement.modifiers;
    // 	return factory.createEnumDeclaration(undefined, [], "Test" + name.getText(), []);
    // } else {
    // 	return factory.createEnumDeclaration(undefined, undefined, "test2", []);
    // }
    return node;
}
exports.default = transformGuidsMacro;
