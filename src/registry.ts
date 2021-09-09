const crypto = require("crypto");

const labelMap = new Map<string, string>();

function getRndInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function generateGuid() {
	const len = getRndInteger(5, 20)
	const value = crypto.randomBytes(len).toString('hex');
}

export function hasGuidForLabel(label: string): boolean {
	return labelMap.has(label);
}

export function updateGuidForLabel(label: string): string {
	if (labelMap.has(label)) {
		const value = generateGuid();
		labelMap.set(label, value);
		return value;
	} else {
		return getGuidForLabel(label);
	}
}

export function getGuidForLabel(label: string): string {
	if (labelMap.has(label)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return labelMap.get(label)!;
	} else {
		const value = generateGuid();
		labelMap.set(label, value);
		return value;
	}
}
