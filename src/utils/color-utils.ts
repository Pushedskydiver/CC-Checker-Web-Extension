import chroma from 'chroma-js';

import type { ColorTuple, TLevels } from '~/global-types';

/**
 * chroma returns a NaN hue for greys, and `JSON.stringify` turns that NaN into
 * `null` on the way to localStorage. `chroma.hsl(NaN, 0.5, l)` then collapses
 * to a grey instead of the red the user asked for, so hue is normalised to 0
 * at every boundary where a tuple is created.
 */
const toHslTuple = (hsl: readonly number[]): ColorTuple => {
	const [h, s = 0, l = 0] = hsl;

	return [Number.isFinite(h) ? (h as number) : 0, s, l];
};

export const isHex = (hex: string): boolean => {
	try {
		chroma(hex);
		return true;
	} catch {
		return false;
	}
};

export const isDark = (hsl: ColorTuple): boolean => {
	return chroma.hsl(hsl[0], hsl[1], hsl[2]).get('lab.l') < 60;
};

export const colorToHsl = (hex: string): ColorTuple => {
	return toHslTuple(chroma(hex).hsl());
};

export const hslToHex = (hsl: ColorTuple): string => {
	return chroma.hsl(hsl[0], hsl[1], hsl[2]).hex();
};

export const hslToRgb = (hsl: ColorTuple): ColorTuple => {
	const [r, g, b] = chroma.hsl(hsl[0], hsl[1], hsl[2]).rgb();

	return [r, g, b];
};

export const rgbToHsl = (rgb: ColorTuple): ColorTuple => {
	return toHslTuple(chroma.rgb(rgb[0], rgb[1], rgb[2]).hsl());
};

export const getContrast = (bg: string, fg: string): number => {
	return chroma.contrast(bg, fg);
};

export const getLevel = (contrast: number): TLevels => {
	if (contrast > 7) {
		return { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' };
	} else if (contrast > 4.5) {
		return { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Fail' };
	} else if (contrast > 3) {
		return { AALarge: 'Pass', AA: 'Fail', AAALarge: 'Fail', AAA: 'Fail' };
	}

	return { AALarge: 'Fail', AA: 'Fail', AAALarge: 'Fail', AAA: 'Fail' };
};

export const roundTo = (value: number, decimals: number): number => {
	const factor = 10 ** decimals;

	return Math.round(value * factor) / factor;
};
