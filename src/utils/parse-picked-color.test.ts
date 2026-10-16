import { describe, expect, it } from 'vitest';

import { parsePickedColor } from './parse-picked-color';

describe('parsePickedColor', () => {
	it('accepts a background pick and returns its key and rgb', () => {
		expect(
			parsePickedColor({
				type: 'colorPicked',
				key: 'background',
				rgb: [12, 34, 56],
			}),
		).toEqual({ key: 'background', rgb: [12, 34, 56] });
	});

	it('accepts a foreground pick', () => {
		expect(
			parsePickedColor({
				type: 'colorPicked',
				key: 'foreground',
				rgb: [255, 0, 0],
			}),
		).toEqual({ key: 'foreground', rgb: [255, 0, 0] });
	});

	it('rejects a message that is not an object', () => {
		expect(parsePickedColor(null)).toBeNull();
		expect(parsePickedColor('colorPicked')).toBeNull();
	});

	it('rejects a message whose type is not colorPicked', () => {
		expect(
			parsePickedColor({
				type: 'closeColorPicker',
				key: 'background',
				rgb: [12, 34, 56],
			}),
		).toBeNull();
	});

	it.each([undefined, 'text', 'Background', 'background '])(
		'rejects a key that is not background or foreground (%s)',
		(key) => {
			expect(
				parsePickedColor({
					type: 'colorPicked',
					key,
					rgb: [12, 34, 56],
				}),
			).toBeNull();
		},
	);

	it.each([
		['missing', undefined],
		['a string', 'abc'],
		['an object', { 0: 1, 1: 2, 2: 3, length: 3 }],
		['too short', [1, 2]],
		['too long', [1, 2, 3, 4]],
	])('rejects an rgb that is %s', (_label, rgb) => {
		expect(
			parsePickedColor({ type: 'colorPicked', key: 'background', rgb }),
		).toBeNull();
	});

	it.each([
		['a string', ['a', 'b', 'c']],
		['a numeric string', ['1', '2', '3']],
		['null', [1, null, 3]],
		['NaN', [1, Number.NaN, 3]],
		['a hole', Object.assign(new Array<number>(3), { 0: 1, 2: 3 })],
	])('rejects an rgb channel that is %s', (_label, rgb) => {
		expect(
			parsePickedColor({ type: 'colorPicked', key: 'background', rgb }),
		).toBeNull();
	});

	it.each([
		['negative', [-1, 0, 0]],
		['above 255', [0, 256, 0]],
		['Infinity', [0, 0, Number.POSITIVE_INFINITY]],
		['fractional', [1.5, 2, 3]],
	])(
		'rejects an rgb channel that is %s (content.js sends integers from 0 to 255)',
		(_label, rgb) => {
			expect(
				parsePickedColor({
					type: 'colorPicked',
					key: 'background',
					rgb,
				}),
			).toBeNull();
		},
	);

	it('accepts the channel limits 0 and 255', () => {
		expect(
			parsePickedColor({
				type: 'colorPicked',
				key: 'foreground',
				rgb: [0, 255, 0],
			}),
		).toEqual({ key: 'foreground', rgb: [0, 255, 0] });
	});

	it('returns a fresh tuple and ignores extra fields', () => {
		const rgb = [12, 34, 56];
		const picked = parsePickedColor({
			type: 'colorPicked',
			key: 'background',
			rgb,
			extra: 'ignored',
		});

		expect(picked).toEqual({ key: 'background', rgb: [12, 34, 56] });
		expect(picked?.rgb).not.toBe(rgb);
	});
});
