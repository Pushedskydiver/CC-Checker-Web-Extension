import { isHex } from './color-utils';

/**
 * A hex is applied once it is a complete 6-digit colour. Shorthand (3–5 digit)
 * values are left alone while the user is still typing: auto-expanding them
 * used to hijack the input mid-entry.
 */
export const toCompleteHex = (raw: string): string | null => {
	const value = raw.trim();
	const isShortHand = /^#?[0-9a-f]{3,5}$/i.test(value);

	if (isShortHand) return null;

	const withHash = value.startsWith('#') ? value : `#${value}`;

	if (withHash.length !== 7 || !isHex(withHash)) return null;

	return withHash;
};
