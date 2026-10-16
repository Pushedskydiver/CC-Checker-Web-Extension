import { createContext, useContext, useEffect, useState } from 'react';

import { useColorPicked } from './hooks/useColorPicked';
import {
	colorToHsl,
	getContrast,
	getLevel,
	hslToHex,
	isDark,
	isHex,
	rgbToHsl,
} from './utils/color-utils';

import type { ColorTuple, TColorKey, TColors, TLevels } from './global-types';

/** Must match the `--background-color` / `--foreground-color` defaults in styles/globals.css. */
export const DEFAULT_BACKGROUND = '#ffe66d';
export const DEFAULT_FOREGROUND = '#222222';
export const MAX_SAVED_COLORS = 5;

export interface TColourContrastProvider {
	children: React.ReactNode;
}

export interface TColourContrastContext {
	colors: TColors[];
	background: ColorTuple;
	foreground: ColorTuple;
	contrast: number;
	level: TLevels;
	setColor: (key: TColorKey, value: ColorTuple) => void;
	reverseColors: () => void;
	saveColors: () => void;
	updateView: (bg: ColorTuple, fg: ColorTuple) => void;
}

const ColourContrastContext = createContext<TColourContrastContext | undefined>(
	undefined,
);

const isNumberOrNull = (value: unknown): value is number | null =>
	value === null || typeof value === 'number';

/**
 * Colours persist in localStorage as HSL tuples. Anything that is not a tuple
 * of numbers (an older build's shape, a hand-edited value) falls back to the
 * default rather than throwing inside render.
 */
function readStoredColor(key: string, fallbackHex: string): ColorTuple {
	const fallback = colorToHsl(fallbackHex);

	try {
		const stored: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');

		if (!Array.isArray(stored) || stored.length < 3) return fallback;
		if (!stored.slice(0, 3).every(isNumberOrNull)) return fallback;

		const [h, s, l] = stored as (number | null)[];

		return [h ?? 0, s ?? 0, l ?? 0];
	} catch {
		return fallback;
	}
}

function readStoredColors(): TColors[] {
	try {
		const stored: unknown = JSON.parse(
			localStorage.getItem('colors') ?? '[]',
		);

		if (!Array.isArray(stored)) return [];

		return stored.filter(
			(entry: unknown): entry is TColors =>
				typeof entry === 'object' &&
				entry !== null &&
				'background' in entry &&
				'foreground' in entry &&
				isHex(String(entry.background)) &&
				isHex(String(entry.foreground)),
		);
	} catch {
		return [];
	}
}

const ColourContrastProvider = (props: TColourContrastProvider) => {
	const [colors, setColors] = useState<TColors[]>(readStoredColors);
	const [background, setBackground] = useState<ColorTuple>(() =>
		readStoredColor('background', DEFAULT_BACKGROUND),
	);
	const [foreground, setForeground] = useState<ColorTuple>(() =>
		readStoredColor('foreground', DEFAULT_FOREGROUND),
	);

	const backgroundHex = hslToHex(background);
	const foregroundHex = hslToHex(foreground);
	const contrast = getContrast(backgroundHex, foregroundHex);
	const level = getLevel(contrast);
	const isPoorContrast = contrast < 3;
	const isBackgroundDark = isDark(background);

	function updateView(bg: ColorTuple, fg: ColorTuple) {
		localStorage.setItem('background', JSON.stringify(bg));
		localStorage.setItem('foreground', JSON.stringify(fg));

		setBackground(bg);
		setForeground(fg);
	}

	function setColor(key: TColorKey, value: ColorTuple) {
		if (key === 'background') updateView(value, foreground);
		if (key === 'foreground') updateView(background, value);
	}

	function reverseColors() {
		updateView(foreground, background);
	}

	function saveColors() {
		const alreadySaved = colors.some(
			(color) =>
				color.background === backgroundHex &&
				color.foreground === foregroundHex,
		);

		if (alreadySaved) return;

		const next = [
			{ background: backgroundHex, foreground: foregroundHex },
			...colors,
		].slice(0, MAX_SAVED_COLORS);

		localStorage.setItem('colors', JSON.stringify(next));
		setColors(next);
	}

	useColorPicked(({ key, rgb }) => {
		setColor(key, rgbToHsl(rgb));
	});

	useEffect(() => {
		document.body.style.setProperty('--background-color', backgroundHex);
		document.body.style.setProperty('--foreground-color', foregroundHex);
	}, [backgroundHex, foregroundHex]);

	// The poor-contrast variant is selected in CSS from these two attributes,
	// e.g. `:global(body[data-contrast='poor'][data-background='light']) .cta`
	// turns a control black when it would vanish against a light background.
	useEffect(() => {
		document.body.dataset.contrast = isPoorContrast ? 'poor' : 'ok';
		document.body.dataset.background = isBackgroundDark ? 'dark' : 'light';
	}, [isPoorContrast, isBackgroundDark]);

	return (
		<ColourContrastContext
			value={{
				colors,
				background,
				foreground,
				contrast,
				level,
				setColor,
				reverseColors,
				saveColors,
				updateView,
			}}
		>
			{props.children}
		</ColourContrastContext>
	);
};

const useColourContrast = () => {
	const context = useContext(ColourContrastContext);

	if (context === undefined) {
		throw new Error(
			'useColourContrast must be used within a ColourContrastProvider',
		);
	}

	return context;
};

export { useColourContrast };

export default ColourContrastProvider;
