import React, { createContext, useEffect, useRef, useState } from 'react';
import { isDark, hslToHex, hexToRgb, rgbToHsl, getContrast, getLevel } from './Utils';

export interface ProviderProps {
  children: React.ReactNode
}

export interface GoogleFontsProps {
  family: string,
  variants: number[]
}

export interface FontsProps {
  family: string,
  variant: number
}

export interface ColorsProps {
  background: string,
  foreground: string
}

export interface LevelsProps {
  AALarge: string,
  AA: string,
  AAALarge: string,
  AAA: string
}

export enum ColorKeys {
  background = 'background',
  foreground = 'foreground'
}

export interface PickedColorProps {
  key: ColorKeys,
  rgb: [number, number, number]
}

export interface ContextProps {
  fonts?: FontsProps[],
  colors: ColorsProps[],
  background: number[],
  foreground: number[],
  contrast: number,
  level: LevelsProps,
  colorState: string,
  expand: boolean,
  handleContrastCheck: (value: number[], name: string) => void,
  reverseColors: () => void,
  saveColors: () => void,
  setColors: React.Dispatch<React.SetStateAction<ColorsProps[]>>,
  setExpand: React.Dispatch <React.SetStateAction<boolean>>,
  toggleExpansion: () => void,
  updateView: (bg: number[], fg: number[]) => void
}

const Context = createContext({} as ContextProps);

export function ContextProvider(props: ProviderProps) {
  const localColors = JSON.parse(localStorage.getItem('colors') as string);
  const localBg = JSON.parse(localStorage.getItem('background') as string);
  const localFg = JSON.parse(localStorage.getItem('foreground') as string);
  const localContrast = JSON.parse(localStorage.getItem('contrast') as string);
  const localLevel = JSON.parse(localStorage.getItem('level') as string);
  const levels = { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' };
  const handlePickedColorRef = useRef(handlePickedColor);

  const [colors, setColors] = useState<ColorsProps[]>(localColors || []);
  const [background, setBackground] = useState<number[]>(localBg || [49.73, 1, 0.71]);
  const [foreground, setForeground] = useState<number[]>(localFg || [NaN, 0, 0.133]);
  const [contrast, setContrast] = useState<number>(localContrast || 12.72);
  const [level, setLevel] = useState<LevelsProps>(localLevel || levels);
  const [expand, setExpand] = useState<boolean>(false);
  const colorState: string = contrast < 3 ? isDark(background) ? '#ffffff' : '#222222' : hslToHex(foreground);

  // @ts-ignore
  window.browser = (() => window.browser || window.chrome)();

  function checkContrast(bg: string, fg: string) {
    const backgroundRgb = hexToRgb(bg);
    const foregroundRgb = hexToRgb(fg);
    const newContrast = getContrast(backgroundRgb as number[], foregroundRgb as number[]);
    const newLevel = getLevel(newContrast);

    localStorage.setItem('contrast', `${newContrast}`);
    localStorage.setItem('level', JSON.stringify(newLevel));

    setContrast(newContrast);
    setLevel(newLevel);
  }

  function handleContrastCheck(value: number[], name: string) {
    const localBg = JSON.parse(localStorage.getItem('background') as string);
    const localFg = JSON.parse(localStorage.getItem('foreground') as string);
    const bg = name === 'background' ? hslToHex(value) : hslToHex(localBg);
    const fg = name === 'foreground' ? hslToHex(value) : hslToHex(localFg);

    localStorage.setItem(name, JSON.stringify(value));
    name === 'background' ? setBackground(value) : setForeground(value);

    document.body.style.setProperty(`--${name}`, hslToHex(value));
    checkContrast(bg, fg);
  }

  function saveColors() {
    const colors = JSON.parse(localStorage.getItem('colors') as string) || [];
    const bg = hslToHex(background);
    const fg = hslToHex(foreground);
    const sameColors = colors.filter((color: ColorsProps) => color.background === bg && color.foreground === fg).length > 0;

    if (colors.length > 0 && sameColors) {
      return;
    }

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

    document.body.style.setProperty('--background', backgroundHex);
    document.body.style.setProperty('--foreground', foregroundHex);

    checkContrast(backgroundHex, foregroundHex);
    setBackground(bg);
    setForeground(fg);
  }

  function reverseColors() {
    localStorage.setItem('background', JSON.stringify(foreground));
    localStorage.setItem('foreground', JSON.stringify(background));

    updateView(foreground, background);
  }

  function toggleExpansion() {
    expand ? setExpand(false) : setExpand(true);
  }

  function handlePickedColor({ key, rgb }: PickedColorProps) {
    const value = rgbToHsl(rgb) as number[];

    if (key === ColorKeys.background) {
      handleContrastCheck(value, ColorKeys.background);
    }

    if (key === ColorKeys.foreground) {
      handleContrastCheck(value, ColorKeys.foreground);
    }

    // @ts-ignore
    window.browser.runtime.sendMessage({
      type: 'closeColorPicker'
    });
  }

  useEffect(() => {
    // @ts-ignore
    window.browser.runtime.onMessage.addListener(request => {
      switch (request.type) {
      case 'colorPicked':
        handlePickedColorRef.current(request);
        break;
      default:
      }
    });

    if (localStorage.getItem('contrast') !== null) {
      if (foreground[0] === null) {
        foreground[0] = NaN;
      }

      const backgroundHex = hslToHex(background);
      const foregroundHex = hslToHex(foreground);

      document.body.style.setProperty('--background', backgroundHex);
      document.body.style.setProperty('--foreground', foregroundHex);
    }
  }, [background, foreground]);

  const data = {
    colors,
    background,
    foreground,
    contrast,
    level,
    expand,
    colorState,
    handleContrastCheck,
    reverseColors,
    saveColors,
    setColors,
    setExpand,
    toggleExpansion,
    updateView
  };

  return (
    <Context.Provider value={data}>
      {props.children}
    </Context.Provider>
  );
}

export default Context;
