import { describe, expect, it } from 'vitest';

import { toCompleteHex } from './parse-color-input';

describe('toCompleteHex', () => {
	it('completes a bare 6-digit hex with a leading #', () => {
		expect(toCompleteHex('ff0000')).toBe('#ff0000');
	});

	it('accepts a complete hex that already has the #', () => {
		expect(toCompleteHex('#ff0000')).toBe('#ff0000');
	});

	it('trims surrounding whitespace before judging completeness', () => {
		expect(toCompleteHex('  #ff0000  ')).toBe('#ff0000');
	});

	it('preserves the case the user typed', () => {
		expect(toCompleteHex('#FF0000')).toBe('#FF0000');
	});

	it.each(['fff', '#fff', 'ffff', 'fffff'])(
		'leaves a shorthand value %s alone while the user is still typing',
		(value) => {
			expect(toCompleteHex(value)).toBeNull();
		},
	);

	it('rejects a 6-digit value with a character chroma cannot parse as hex', () => {
		expect(toCompleteHex('#gggggg')).toBeNull();
	});

	it('rejects an 8-digit hex with alpha rather than silently dropping it', () => {
		// chroma parses #rrggbbaa and discards the alpha channel, so without this
		// length check an 8-digit paste would be "completed" one channel short of
		// what the user typed.
		expect(toCompleteHex('#ff0000ff')).toBeNull();
	});

	it('rejects an empty value', () => {
		expect(toCompleteHex('')).toBeNull();
	});
});
