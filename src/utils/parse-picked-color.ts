import type { TPickedColor } from '~/global-types';

/**
 * Two kinds of rule in one check, kept apart here because they have different
 * reasons. `Number.isInteger` rejects every non-number and NaN, which would
 * corrupt state: they reach `rgbToHsl`, come out as a NaN lightness, and
 * `JSON.stringify` stores that as `null`, which `readStoredColor` reloads as
 * black (reproduced 7 October 2026). The 0 to 255 range is the sender's
 * contract instead: `content.js` reads a `Uint8ClampedArray`, and `chroma.rgb`
 * itself accepts `[256, 0, 0]` and `[1.5, 2, 3]`, so nothing downstream would
 * catch a drifted sender. (`Number.isInteger` also rejects `[1.5, 2, 3]`; it
 * is the integer half of that contract as much as the number half of the first
 * rule.)
 */
const isByte = (value: unknown): boolean =>
	Number.isInteger(value) &&
	(value as number) >= 0 &&
	(value as number) <= 255;

export const parsePickedColor = (message: unknown): TPickedColor | null => {
	if (typeof message !== 'object' || message === null) return null;

	const { type, key, rgb } = message as Record<string, unknown>;

	if (type !== 'colorPicked') return null;
	if (key !== 'background' && key !== 'foreground') return null;
	if (!Array.isArray(rgb) || rgb.length !== 3) return null;
	// Destructured before the check: `every` skips holes, so `[1, , 3]` would pass.
	const [r, g, b] = rgb as unknown[];

	if (![r, g, b].every(isByte)) return null;

	return { key, rgb: [r, g, b] as [number, number, number] };
};
