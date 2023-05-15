import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { isDark, hslToHex, rgbToHsl, getContrast, getLevel } from './Utils';

export interface ProviderProps {
  children: React.ReactNode
}

export interface ColourContrastContextTypes {
  colors: CC.ColorsProps[],
  background: number[],
  foreground: number[],
  contrast: number,
  level: CC.LevelsProps,
  colorState: string,
  handleContrastCheck: (value: number[], name: string) => void,
  reverseColors: () => void,
  saveColors: () => void,
  setColors: React.Dispatch<React.SetStateAction<CC.ColorsProps[]>>,
  updateView: (bg: number[], fg: number[]) => void
}

const ColourContrastContext = createContext<ColourContrastContextTypes | undefined>(undefined);

const ColourContrastProvider = (props: ProviderProps) => {
  const localColors = JSON.parse(localStorage.getItem('colors') as string);
  const localBg = JSON.parse(localStorage.getItem('background') as string);
  const localFg = JSON.parse(localStorage.getItem('foreground') as string);
  const localContrast = JSON.parse(localStorage.getItem('contrast') as string);
  const localLevel = JSON.parse(localStorage.getItem('level') as string);
  const levels = { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' };
  const handlePickedColorRef = useRef(handlePickedColor);

  const [colors, setColors] = useState<CC.ColorsProps[]>(localColors || []);
  const [background, setBackground] = useState<number[]>(localBg || [49.73, 1, 0.71, 1]);
  const [foreground, setForeground] = useState<number[]>(localFg || [NaN, 0, 0.133, 1]);
  const [contrast, setContrast] = useState<number>(localContrast || 12.72);
  const [level, setLevel] = useState<CC.LevelsProps>(localLevel || levels);
  const colorState: string = contrast < 3 ? isDark(background) ? '#ffffff' : '#222222' : hslToHex(foreground);

  function checkContrast(bg: string, fg: string) {
    const newContrast = getContrast(bg, fg);
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
    const sameColors = colors.filter((color: CC.ColorsProps) => color.background === bg && color.foreground === fg).length > 0;

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

  function handlePickedColor({ key, rgb }: CC.PickedColorProps) {
    const value = rgbToHsl(rgb) as number[];

    handleContrastCheck(value, key);

    chrome.runtime.sendMessage({
      type: 'closeColorPicker'
    });
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(request => {
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

  return (
    <ColourContrastContext.Provider
      value={{
        colors,
        background,
        foreground,
        contrast,
        level,
        colorState,
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
