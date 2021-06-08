"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuidForLabel = exports.updateGuidForLabel = exports.hasGuidForLabel = void 0;
const uuid_1 = require("uuid");
const labelMap = new Map();
function hasGuidForLabel(label) {
    return labelMap.has(label);
}
exports.hasGuidForLabel = hasGuidForLabel;
function updateGuidForLabel(label) {
    if (labelMap.has(label)) {
        const value = uuid_1.v4(); // TODO: Guid
        labelMap.set(label, value);
        return value;
    }
    else {
        return getGuidForLabel(label);
    }
}
exports.updateGuidForLabel = updateGuidForLabel;
function getGuidForLabel(label) {
    if (labelMap.has(label)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return labelMap.get(label);
    }
    else {
        const value = uuid_1.v4(); // TODO: Guid
        labelMap.set(label, value);
        return value;
    }
}
exports.getGuidForLabel = getGuidForLabel;
