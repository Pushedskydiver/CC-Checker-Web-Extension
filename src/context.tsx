import { createContext, useContext, useEffect, useState } from 'react';
import {
	getContrast,
	getLevel,
	hslToHex,
	isDark,
	isHex,
	rgbToHsl,
} from './utils/color-utils';

import type { TColors, TLevels, TPickedColor } from './global-types';

export interface ProviderProps {
	children: React.ReactNode;
}

export interface ColourContrastContextTypes {
	colors: TColors[];
	background: number[];
	foreground: number[];
	contrast: number;
	level: TLevels;
	isPoorContrastOnLightBg: boolean;
	isPoorContrastOnDarkBg: boolean;
	handleContrastCheck: (value: number[], name: string) => void;
	clearColors(): void;
	removeColors(bg: string, fg: string): void;
	reverseColors: () => void;
	saveColors: () => void;
	setColors: React.Dispatch<React.SetStateAction<TColors[]>>;
	updateView: (bg: number[], fg: number[]) => void;
}

const ColourContrastContext = createContext<
	ColourContrastContextTypes | undefined
>(undefined);

const ColourContrastProvider = (props: ProviderProps) => {
	const levels: TLevels = {
		AALarge: 'Pass',
		AA: 'Pass',
		AAALarge: 'Pass',
		AAA: 'Pass',
	};

	const storedColors = localStorage.getItem('colors');
	const storedBackground = localStorage.getItem('background');
	const storedForeground = localStorage.getItem('foreground');
	const storedContrast = localStorage.getItem('contrast');
	const storedLevel = localStorage.getItem('level');

	const localColors = storedColors ? JSON.parse(storedColors) : [];
	const localBackground = storedBackground
		? JSON.parse(storedBackground)
		: [49.73, 1, 0.71, 1];
	const localForeground = storedForeground
		? JSON.parse(storedForeground)
		: [NaN, 0, 0.133, 1];
	const localContrast = storedContrast ? JSON.parse(storedContrast) : 12.72;
	const localLevel = storedLevel ? JSON.parse(storedLevel) : levels;

	const [colors, setColors] = useState<TColors[]>(localColors);
	const [background, setBackground] = useState<number[]>(localBackground);
	const [foreground, setForeground] = useState<number[]>(localForeground);
	const [contrast, setContrast] = useState<number>(localContrast);
	const [level, setLevel] = useState<TLevels>(localLevel);

	const isPoorContrast = contrast < 3;
	const isBackgroundDark = isDark(background);
	const isPoorContrastOnLightBg = isPoorContrast && !isBackgroundDark;
	const isPoorContrastOnDarkBg = isPoorContrast && isBackgroundDark;

	function checkContrast(bg: string, fg: string) {
		const isBgHex = isHex(bg);
		const isFgHex = isHex(fg);

		if (!isBgHex || !isFgHex) return;

		const newContrast = getContrast(bg, fg);
		const newLevel = getLevel(newContrast);

		localStorage.setItem('contrast', `${newContrast}`);
		localStorage.setItem('level', JSON.stringify(newLevel));

		setContrast(newContrast);
		setLevel(newLevel);
	}

	function handleContrastCheck(value: number[], name: string) {
		const isBackground = name.includes('background');
		const isForeground = name.includes('foreground');
		const type = isBackground ? 'background' : 'foreground';

		const storedBg = localStorage.getItem('background');
		const storedFg = localStorage.getItem('foreground');

		const localBg = storedBg ? JSON.parse(storedBg) : background;
		const localFg = storedFg ? JSON.parse(storedFg) : foreground;

		const bg = isBackground ? hslToHex(value) : hslToHex(localBg);
		const fg = isForeground ? hslToHex(value) : hslToHex(localFg);

		if (isBackground) setBackground(value);
		if (isForeground) setForeground(value);

		localStorage.setItem(type, JSON.stringify(value));
		document.body.style.setProperty(`--${type}-color`, hslToHex(value));

		checkContrast(bg, fg);
	}

	function clearColors() {
		setColors([]);
		localStorage.setItem('colors', JSON.stringify([]));
	}

	function removeColors(bg: string, fg: string) {
		const newColors = colors.filter(({ background, foreground }) => {
			return !(background === bg && foreground === fg);
		});

		localStorage.setItem('colors', JSON.stringify(newColors));
		setColors(newColors);
	}

	function reverseColors() {
		localStorage.setItem('background', JSON.stringify(foreground));
		localStorage.setItem('foreground', JSON.stringify(background));

		updateView(foreground, background);
	}

	function saveColors() {
		const bg = hslToHex(background);
		const fg = hslToHex(foreground);
		const sameColors = colors.some(
			(color) => color.background === bg && color.foreground === fg,
		);

		if (colors.length > 0 && sameColors) return;

		const newColors = [...colors, { background: bg, foreground: fg }];

		localStorage.setItem('colors', JSON.stringify(newColors));
		setColors(newColors);
	}

	function updateView(bg: number[], fg: number[]) {
		const backgroundHex = hslToHex(bg);
		const foregroundHex = hslToHex(fg);

		document.body.style.setProperty('--background-color', backgroundHex);
		document.body.style.setProperty('--foreground-color', foregroundHex);

		checkContrast(backgroundHex, foregroundHex);
		setBackground(bg);
		setForeground(fg);
	}

	function handlePickedColor({ key, rgb }: TPickedColor) {
		const value = rgbToHsl(rgb) as number[];

		handleContrastCheck(value, key);

		// chrome.runtime.sendMessage({
		// 	type: 'closeColorPicker',
		// });
	}

	function handleMessageListener(r: any) {
		switch (r.type) {
			case 'colorPicked':
				handlePickedColor(r);
				break;
			default:
		}
	}

	console.log(handleMessageListener, 'handleMessageListener');

	// useEffect(() => {
	// 	chrome.runtime.onMessage.addListener(handleMessageListener);

	// 	return () => {
	// 		chrome.runtime.onMessage.removeListener(handleMessageListener);
	// 	};
	// }, []);

	useEffect(() => {
		if (localStorage.getItem('contrast') === null) return;

		if (foreground[0] === null) {
			foreground[0] = NaN;
		}

		const backgroundHex = hslToHex(background);
		const foregroundHex = hslToHex(foreground);

		document.body.style.setProperty('--background-color', backgroundHex);
		document.body.style.setProperty('--foreground-color', foregroundHex);
	}, [background, foreground]);

	return (
		<ColourContrastContext.Provider
			value={{
				colors,
				background,
				foreground,
				contrast,
				level,
				isPoorContrastOnLightBg,
				isPoorContrastOnDarkBg,
				handleContrastCheck,
				clearColors,
				removeColors,
				reverseColors,
				saveColors,
				setColors,
				updateView,
			}}
		>
			{props.children}
		</ColourContrastContext.Provider>
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

export { ColourContrastContext, useColourContrast };

export default ColourContrastProvider;
