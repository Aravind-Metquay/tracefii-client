export type Unit = 'mm' | 'cm' | 'in' | 'px';

const DPI = 96;
const MM_PER_IN = 25.4;
const CM_PER_IN = 2.54;

const toInch: Record<Unit, (val: number) => number> = {
	px: (v) => v / DPI,
	mm: (v) => v / MM_PER_IN,
	cm: (v) => v / CM_PER_IN,
	in: (v) => v,
};

const fromInch: Record<Unit, (val: number) => number> = {
	px: (v) => v * DPI,
	mm: (v) => v * MM_PER_IN,
	cm: (v) => v * CM_PER_IN,
	in: (v) => v,
};

export const convert = (value: number, from: Unit, to: Unit): string => {
	if (from === to) return value.toFixed(2);

	const inches = toInch[from]?.(value);
	const converted = fromInch[to]?.(inches);

	return converted?.toFixed(2) ?? '';
};
