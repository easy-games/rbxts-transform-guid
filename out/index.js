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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const typescript_1 = __importStar(require("typescript"));
const shared_1 = require("./shared");
const visitCallExpression_1 = require("./visitCallExpression");
const isModuleImportExpression_1 = require("./isModuleImportExpression");
const visitVariableDeclaration_1 = __importDefault(require("./visitVariableDeclaration"));
const registry_1 = require("./registry");
function visitNode(node, program, config) {
    if (isModuleImportExpression_1.isModuleImportExpression(node, program)) {
        const { importClause } = node;
        if (importClause !== undefined && importClause.isTypeOnly) {
            return node;
        }
        return typescript_1.factory.createExportDeclaration(undefined, undefined, false, typescript_1.default.factory.createNamedExports([]), undefined);
    }
    if (typescript_1.default.isStringLiteral(node)) {
        if (node.text.startsWith("UUID@")) {
            const uuid = node.text.substr(5);
            console.log(uuid);
            const label = registry_1.getGuidForLabel(uuid);
            return typescript_1.factory.createStringLiteral(label);
        }
    }
    if (typescript_1.default.isEnumDeclaration(node) && config.EXPERIMENTAL_JSDocConstEnumUUID) {
        const tags = typescript_1.default.getJSDocTags(node);
        if (tags.length > 0) {
            //console.log(tags.map((d) => d.getText()));
            for (const tag of tags) {
                if (tag.tagName.text === "uuid") {
                    if (node.modifiers &&
                        node.modifiers.findIndex((f) => f.kind === typescript_1.default.SyntaxKind.ConstKeyword) !== -1) {
                        const labelId = `${node.getSourceFile().fileName}:const-enum@${node.name.text}`;
                        // Check for our label
                        if (registry_1.hasGuidForLabel(labelId)) {
                            if (config.ConstEnumForceIfWatch) {
                                registry_1.updateGuidForLabel(labelId);
                            }
                            else {
                                console.log(shared_1.formatTransformerWarning(`Detected existing UUID for node ${labelId}, disabled UUID generation. To force, use 'ConstEnumForceIfWatch'`));
                                continue;
                            }
                        }
                        else {
                            registry_1.getGuidForLabel(labelId);
                        }
                        if (config.verbose) {
                            console.log(shared_1.formatTransformerDebug("Transform node enum values", node));
                        }
                        return typescript_1.factory.updateEnumDeclaration(node, undefined, node.modifiers, node.name, node.members.map((m) => {
                            return typescript_1.factory.updateEnumMember(m, m.name, typescript_1.factory.createStringLiteral(registry_1.updateGuidForLabel(`${labelId}:${m.name.getText()}`)));
                        }));
                    }
                    else {
                        console.log(shared_1.formatTransformerWarning("Found '@uuid' on node, but not ambient enum", node));
                    }
                }
            }
        }
    }
    if (typescript_1.default.isVariableStatement(node)) {
        return visitVariableDeclaration_1.default(node, program, config);
    }
    if (typescript_1.default.isCallExpression(node)) {
        return visitCallExpression_1.visitCallExpression(node, program, config);
    }
    return node;
}
function visitNodeAndChildren(node, program, context, config) {
    return typescript_1.default.visitEachChild(visitNode(node, program, config), (childNode) => visitNodeAndChildren(childNode, program, context, config), context);
}
const DEFAULTS = {
    useConstEnum: false,
    EXPERIMENTAL_JSDocConstEnumUUID: false,
    ConstEnumUUIDRequiresEnv: ["production"],
};
function transform(program, userConfiguration) {
    var _a;
    userConfiguration = Object.assign(Object.assign({}, DEFAULTS), userConfiguration);
    const { ConstEnumUUIDRequiresEnv: ambientEmitIfEnv } = userConfiguration;
    if (userConfiguration.verbose) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        console.log(shared_1.formatTransformerDebug("Running version " + require("../package.json").version));
    }
    if (ambientEmitIfEnv) {
        if (Array.isArray(ambientEmitIfEnv)) {
            const envVar = ((_a = process.env["NODE_ENV"]) !== null && _a !== void 0 ? _a : "").trim();
            let enableAmbient = false;
            if (userConfiguration.verbose) {
                console.log(shared_1.formatTransformerDebug("Check environment variable NODE_ENV against " + envVar));
            }
            for (const v of ambientEmitIfEnv) {
                if (v === envVar) {
                    enableAmbient = true;
                }
            }
            userConfiguration.EXPERIMENTAL_JSDocConstEnumUUID = enableAmbient;
        }
        else {
            for (const [k, v] of Object.entries(ambientEmitIfEnv)) {
                const envVar = process.env[k];
                if (userConfiguration.verbose) {
                    console.log(shared_1.formatTransformerDebug("Check environment variable " + k + " against " + (envVar === null || envVar === void 0 ? void 0 : envVar.toString())));
                }
                if (envVar &&
                    ((typeof v === "boolean" && envVar === undefined) ||
                        (typeof v === "string" && envVar !== v) ||
                        (Array.isArray(v) && v.includes(envVar)))) {
                    userConfiguration.EXPERIMENTAL_JSDocConstEnumUUID = false;
                }
            }
        }
    }
    return (context) => (file) => visitNodeAndChildren(file, program, context, userConfiguration);
}
exports.default = transform;
