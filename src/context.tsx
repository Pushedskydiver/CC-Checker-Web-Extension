import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getContrast, getLevel, hslToHex, isDark, isHex, rgbToHsl } from './utils/color-utils';

import type { TColors, TLevels, TPickedColor } from './global-types';

export interface ProviderProps {
	children: React.ReactNode
}

export interface ColourContrastContextTypes {
	colors: TColors[],
	background: number[],
	foreground: number[],
	contrast: number,
	level: TLevels,
	isBackgroundDark: boolean,
	isPoorContrast: boolean,
	handleContrastCheck: (value: number[], name: string) => void,
	reverseColors: () => void,
	saveColors: () => void,
	setColors: React.Dispatch<React.SetStateAction<TColors[]>>,
	updateView: (bg: number[], fg: number[]) => void
}

const ColourContrastContext = createContext<ColourContrastContextTypes | undefined>(undefined);

const ColourContrastProvider = (props: ProviderProps) => {
	const levels: TLevels = { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' };

	const storedColors = localStorage.getItem('colors');
	const storedBackground = localStorage.getItem('background');
	const storedForeground = localStorage.getItem('foreground');
	const storedContrast = localStorage.getItem('contrast');
	const storedLevel = localStorage.getItem('level');

	const localColors = storedColors ? JSON.parse(storedColors) : [];
	const localBackground = storedBackground ? JSON.parse(storedBackground) : [49.73, 1, 0.71, 1];
	const localForeground = storedForeground ? JSON.parse(storedForeground) : [NaN, 0, 0.133, 1];
	const localContrast = storedContrast ? JSON.parse(storedContrast) : 12.72;
	const localLevel = storedLevel ? JSON.parse(storedLevel) : levels;

	const handlePickedColorRef = useRef(handlePickedColor);
	
	const [colors, setColors] = useState<TColors[]>(localColors);
	const [background, setBackground] = useState<number[]>(localBackground);
	const [foreground, setForeground] = useState<number[]>(localForeground);
	const [contrast, setContrast] = useState<number>(localContrast);
	const [level, setLevel] = useState<TLevels>(localLevel);
	const isPoorContrast = contrast < 3;
	const isBackgroundDark = isDark(background);

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
		const isBackground = name === 'background';
		const isForeground = name === 'foreground';

		const storedBg = localStorage.getItem('background');
		const storedFg = localStorage.getItem('foreground');

		const localBg = storedBg ? JSON.parse(storedBg) : background;
		const localFg = storedFg ? JSON.parse(storedFg) : foreground;

		const bg = isBackground ? hslToHex(value) : hslToHex(localBg);
		const fg = isForeground ? hslToHex(value) : hslToHex(localFg);

		if (isBackground) setBackground(value);
		if (isForeground) setForeground(value);

		localStorage.setItem(name, JSON.stringify(value));
		document.body.style.setProperty(`--${name}-color`, hslToHex(value));

		checkContrast(bg, fg);
	}

	function saveColors() {
		const storedColors = localStorage.getItem('colors');
		const colors: TColors[] = storedColors ? JSON.parse(storedColors) : [];
		const bg = hslToHex(background);
		const fg = hslToHex(foreground);
		const sameColors = colors.some((color) => color.background === bg && color.foreground === fg);

		if (colors.length > 0 && sameColors) return;

		if (colors.length > 5) {
			colors.pop();
		}

		colors.unshift({ background: bg, foreground: fg });
		localStorage.setItem('colors', JSON.stringify(colors));
		setColors(colors);
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

	function reverseColors() {
		localStorage.setItem('background', JSON.stringify(foreground));
		localStorage.setItem('foreground', JSON.stringify(background));

		updateView(foreground, background);
	}

	function handlePickedColor({ key, rgb }: TPickedColor) {
		const value = rgbToHsl(rgb) as number[];

		handleContrastCheck(value, key);

		chrome.runtime.sendMessage({
			type: 'closeColorPicker'
		});
	}

	useEffect(() => {
		if (chrome.runtime.onMessage) {
			chrome.runtime.onMessage.addListener(request => {
				switch (request.type) {
					case 'colorPicked':
						handlePickedColorRef.current(request);
						break;
					default:
				}
			});
		}

		if (localStorage.getItem('contrast') !== null) {
			if (foreground[0] === null) {
				foreground[0] = NaN;
			}

			const backgroundHex = hslToHex(background);
			const foregroundHex = hslToHex(foreground);

			document.body.style.setProperty('--background-color', backgroundHex);
			document.body.style.setProperty('--foreground-color', foregroundHex);
		}
	}, [background, foreground]);

	return (
		<ColourContrastContext.Provider
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
				setColors,
				updateView
			}}
		>
			{props.children}
		</ColourContrastContext.Provider>
	);
}

const useColourContrast = () => {
	const context = useContext(ColourContrastContext)

	if (context === undefined) {
		throw new Error('useColourContrast must be used within a ColourContrastProvider')
	}

	return context
}

export { ColourContrastContext, useColourContrast }

export default ColourContrastProvider;
