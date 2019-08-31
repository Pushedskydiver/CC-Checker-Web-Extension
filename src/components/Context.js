/*global chrome*/

import React, { useEffect, useState } from 'react';
import { isDark, hslToHex, hexToRgb, rgbToHsl, getContrast, getLevel } from '../components/Utils';

const Context = React.createContext({});

export function ContextProvider(props) {
  const localColors = JSON.parse(localStorage.getItem('colors'));
  const localBg = JSON.parse(localStorage.getItem('background'));
  const localFg = JSON.parse(localStorage.getItem('foreground'));
  const localContrast = JSON.parse(localStorage.getItem('contrast'));
  const localLevel = JSON.parse(localStorage.getItem('level'));
  const levels = { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' };
  // const handlePickedColorRef = useRef(handlePickedColor);

  const [colors, setColors] = useState(localColors || []);
  const [background, setBackground] = useState(localBg || [49.73, 1, 0.71]);
  const [foreground, setForeground] = useState(localFg || [NaN, 0, 0.133]);
  const [contrast, setContrast] = useState(localContrast || 12.72);
  const [level, setLevel] = useState(localLevel || levels);
  const [expand, setExpand] = useState(false);
  const colorState = contrast < 3 ? isDark(background) ? '#ffffff' : '#222222' : hslToHex(foreground);

  function checkContrast(bg, fg) {
    const backgroundRgb = hexToRgb(bg);
    const foregroundRgb = hexToRgb(fg);
    const newContrast = getContrast(backgroundRgb, foregroundRgb);
    const newLevel = getLevel(newContrast);

    localStorage.setItem('contrast', newContrast);
    localStorage.setItem('level', JSON.stringify(newLevel));

    setContrast(newContrast);
    setLevel(newLevel);
  }

  function handleContrastCheck(value, name) {
    const localBg = JSON.parse(localStorage.getItem('background'));
    const localFg = JSON.parse(localStorage.getItem('foreground'));
    const bg = name === 'background' ? hslToHex(value) : hslToHex(localBg);
    const fg = name === 'foreground' ? hslToHex(value) : hslToHex(localFg);

    localStorage.setItem(name, JSON.stringify(value));
    name === 'background' ? setBackground(value) : setForeground(value);

    document.body.style.setProperty(`--${name}`, hslToHex(value));
    checkContrast(bg, fg);
  }

  function saveColors() {
    const colors = JSON.parse(localStorage.getItem('colors')) || [];
    const bg = hslToHex(background);
    const fg = hslToHex(foreground);
    const sameColors = colors.filter(color => color.background === bg && color.foreground === fg).length > 0;

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

  function updateView(bg, fg) {
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

  useEffect(() => {
    function handlePickedColor({ key, rgb }) {
      const value = rgbToHsl(rgb);

      if (key === 'background') {
        handleContrastCheck(value, 'background');
      }

      if (key === 'foreground') {
        handleContrastCheck(value, 'foreground');
      }

      chrome.runtime.sendMessage({
        type: 'closeColorPicker'
      });
    }

    chrome.runtime.onMessage.addListener(request => {
      switch (request.type) {
      case 'colorPicked':
        handlePickedColor(request);
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
  }, []);

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
