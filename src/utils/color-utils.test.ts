import { describe, expect, it } from 'vitest';

import {
	colorToHsl,
	getContrast,
	getLevel,
	hslToHex,
	hslToRgb,
	isDark,
	isHex,
	rgbToHsl,
	roundTo,
} from './color-utils';

import { DEFAULT_BACKGROUND, DEFAULT_FOREGROUND } from '~/context';

describe('isHex', () => {
	it('accepts the colours the app actually stores', () => {
		expect(isHex(DEFAULT_BACKGROUND)).toBe(true);
		expect(isHex('#fff')).toBe(true);
	});

	it('rejects what chroma cannot parse, rather than throwing', () => {
		expect(isHex('#ggghhh')).toBe(false);
		expect(isHex('')).toBe(false);
	});
});

describe('colorToHsl', () => {
	it('normalises the NaN hue chroma returns for a grey to 0', () => {
		// 4 September 2026: chroma gives greys a NaN hue, JSON.stringify wrote it to
		// localStorage as null, and saturating #222222 then rendered #111111 instead of
		// #331111. toHslTuple normalises at the boundary; this is the test for it.
		const [hue] = colorToHsl(DEFAULT_FOREGROUND);

		expect(hue).toBe(0);
	});

	it('reads a primary as its textbook HSL', () => {
		expect(colorToHsl('#ff0000')).toEqual([0, 1, 0.5]);
	});
});

describe('hslToHex', () => {
	it('round-trips the defaults through HSL unchanged', () => {
		expect(hslToHex(colorToHsl(DEFAULT_BACKGROUND))).toBe(
			DEFAULT_BACKGROUND,
		);
		expect(hslToHex(colorToHsl(DEFAULT_FOREGROUND))).toBe(
			DEFAULT_FOREGROUND,
		);
	});

	it('saturating a grey gives a colour, not a darker grey', () => {
		// The visible half of the NaN-hue bug: hue 0 plus saturation is red, and
		// #222222 at saturation 0.5 is #331111. It rendered #111111 before the fix.
		const [, , lightness] = colorToHsl(DEFAULT_FOREGROUND);

		expect(hslToHex([0, 0.5, lightness])).toBe('#331111');
	});
});

describe('hslToRgb and rgbToHsl', () => {
	it('convert a primary both ways', () => {
		expect(hslToRgb([0, 1, 0.5])).toEqual([255, 0, 0]);
		expect(rgbToHsl([255, 0, 0])).toEqual([0, 1, 0.5]);
	});

	it('normalise the hue of a grey on the way back too', () => {
		const [hue] = rgbToHsl([34, 34, 34]);

		expect(hue).toBe(0);
	});
});

describe('isDark', () => {
	it('splits the two defaults the way the panel relies on', () => {
		expect(isDark(colorToHsl(DEFAULT_FOREGROUND))).toBe(true);
		expect(isDark(colorToHsl(DEFAULT_BACKGROUND))).toBe(false);
	});

	it('pins the lab.l 60 threshold, not just the gap between the defaults', () => {
		// One 8-bit step apart, either side of 60: #909090 is lab.l 59.789 and
		// #919191 is 60.172. Without these, a threshold anywhere between the two
		// defaults (13.2 and 91.2) passes.
		expect(isDark(colorToHsl('#909090'))).toBe(true);
		expect(isDark(colorToHsl('#919191'))).toBe(false);
	});
});

describe('getContrast', () => {
	it('gives black on white the maximum 21', () => {
		expect(getContrast('#ffffff', '#000000')).toBe(21);
	});

	it('gives the default pair the ratio the panel shows', () => {
		// The e2e suite asserts "12.72" in the UI for the first run; this is the same
		// number one layer down.
		expect(
			roundTo(getContrast(DEFAULT_BACKGROUND, DEFAULT_FOREGROUND), 2),
		).toBe(12.72);
	});

	it('is symmetric', () => {
		expect(getContrast(DEFAULT_FOREGROUND, DEFAULT_BACKGROUND)).toBe(
			getContrast(DEFAULT_BACKGROUND, DEFAULT_FOREGROUND),
		);
	});
});

describe('getLevel', () => {
	it('passes everything above 7', () => {
		expect(getLevel(7.01)).toEqual({
			AALarge: 'Pass',
			AA: 'Pass',
			AAALarge: 'Pass',
			AAA: 'Pass',
		});
	});

	it('passes AA but not AAA between 4.5 and 7', () => {
		expect(getLevel(5)).toEqual({
			AALarge: 'Pass',
			AA: 'Pass',
			AAALarge: 'Pass',
			AAA: 'Fail',
		});
	});

	it('passes only large text between 3 and 4.5', () => {
		expect(getLevel(4)).toEqual({
			AALarge: 'Pass',
			AA: 'Fail',
			AAALarge: 'Fail',
			AAA: 'Fail',
		});
	});

	it('fails everything at or below 3', () => {
		expect(getLevel(3)).toEqual({
			AALarge: 'Fail',
			AA: 'Fail',
			AAALarge: 'Fail',
			AAA: 'Fail',
		});
	});

	// Current behaviour, and it disagrees with the spec: WCAG 1.4.3 and 1.4.6 say "a
	// contrast ratio of at least 4.5:1" (and 3:1, 7:1), which is `>=`, while `getLevel`
	// uses `>`. So a ratio of exactly 4.5 is AA per WCAG and Fail here. Unreachable as
	// far as anyone has probed: on 18 September 2026 every 8-bit colour against black
	// and against white, plus every grey pair, produced no ratio of exactly 3, 4.5 or 7
	// (nearest: 4.49295 for #747474 on black). Arbitrary non-grey pairs were not probed.
	// These cases pin the behaviour so a change to it is deliberate, not a claim that
	// exclusive is correct; the sibling web app's getLevel is byte-identical.
	it.each([
		[7, 'AAA', 'Fail'],
		[4.5, 'AA', 'Fail'],
		[3, 'AALarge', 'Fail'],
	] as const)(
		'treats %d as below its own band (%s), unlike WCAG',
		(contrast, grade, verdict) => {
			expect(getLevel(contrast)[grade]).toBe(verdict);
		},
	);
});

describe('roundTo', () => {
	it('rounds to the decimals the ratio display uses', () => {
		expect(roundTo(12.7234, 2)).toBe(12.72);
		expect(roundTo(12.7254, 2)).toBe(12.73);
	});

	it('rounds to whole numbers at 0 decimals', () => {
		expect(roundTo(0.5, 0)).toBe(1);
	});
});
