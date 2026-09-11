import {
	createContext,
	useContext,
	useEffect,
	useEffectEvent,
	useState,
} from 'react';

import {
	colorToHsl,
	getContrast,
	getLevel,
	hslToHex,
	isDark,
	isHex,
	rgbToHsl,
} from './utils/color-utils';

import type {
	ColorTuple,
	TColors,
	TLevels,
	TPickedColor,
} from './global-types';

/** Must match the `--background-color` / `--foreground-color` defaults in styles/globals.css. */
export const DEFAULT_BACKGROUND = '#ffe66d';
export const DEFAULT_FOREGROUND = '#222222';
export const MAX_SAVED_COLORS = 5;

export interface ProviderProps {
	children: React.ReactNode;
}

export interface ColourContrastContextTypes {
	colors: TColors[];
	background: ColorTuple;
	foreground: ColorTuple;
	contrast: number;
	level: TLevels;
	isBackgroundDark: boolean;
	isPoorContrast: boolean;
	handleContrastCheck: (value: ColorTuple, name: string) => void;
	reverseColors: () => void;
	saveColors: () => void;
	updateView: (bg: ColorTuple, fg: ColorTuple) => void;
}

const ColourContrastContext = createContext<
	ColourContrastContextTypes | undefined
>(undefined);

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

const ColourContrastProvider = (props: ProviderProps) => {
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

	function handleContrastCheck(value: ColorTuple, name: string) {
		if (name === 'background') updateView(value, foreground);
		if (name === 'foreground') updateView(background, value);
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

	const handlePickedColor = useEffectEvent(({ key, rgb }: TPickedColor) => {
		handleContrastCheck(rgbToHsl(rgb), key);

		chrome.runtime.sendMessage({
			type: 'closeColorPicker',
		});
	});

	useEffect(() => {
		function handleMessage(
			message: { type: string } & Partial<TPickedColor>,
			sender: chrome.runtime.MessageSender,
		) {
			// The content script's broadcast and the service worker's relay both
			// arrive here. Only the relay reaches this iframe in incognito windows,
			// so that is the one handled; the direct copy (sender.tab set) is ignored.
			if (sender.tab) return;

			if (message.type === 'colorPicked' && message.key && message.rgb) {
				handlePickedColor({ key: message.key, rgb: message.rgb });
			}
		}

		chrome.runtime.onMessage.addListener(handleMessage);

		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, []);

	useEffect(() => {
		document.body.style.setProperty('--background-color', backgroundHex);
		document.body.style.setProperty('--foreground-color', foregroundHex);
	}, [backgroundHex, foregroundHex]);

	return (
		<ColourContrastContext
			value={{
				colors,
				background,
				foreground,
				contrast,
				level,
				isBackgroundDark,
				isPoorContrast,
				handleContrastCheck,
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
