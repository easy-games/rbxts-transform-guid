const crypto = require("crypto");

const labelMap = new Map<string, string>();

function getRndInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function generateGuid() {
	const len = getRndInteger(5, 20);
	const iterations = getRndInteger(2, 10);
	let value = "";

	for (let i = 0; i < iterations; i++) {
		value += Math.random().toString(36).substring(2, len);
	}

	const noNumbers = value.replace(/[0-9]/g, "");
	const randomCaps = noNumbers.toLowerCase().split("").map(function(c){
		return Math.random() < .5 ? c : c.toUpperCase();
	}).join("");

  return randomCaps;
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
