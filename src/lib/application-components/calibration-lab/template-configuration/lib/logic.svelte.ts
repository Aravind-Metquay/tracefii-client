import type { UnitType } from "./types";


export function convert(value: number, from: UnitType, to: UnitType): number {
	const toPx = (val: number, unit: UnitType): number => {
		switch (unit) {
			case 'cm': return val * 37.7952755906;
			case 'mm': return val * 3.77952755906;
			case 'in': return val * 96;
			case 'px': return val;
		}
	};

	const fromPx = (val: number, unit: UnitType): number => {
		switch (unit) {
			case 'cm': return val / 37.7952755906;
			case 'mm': return val / 3.77952755906;
			case 'in': return val / 96;
			case 'px': return val;
		}
	};

	return fromPx(toPx(value, from), to);
}



