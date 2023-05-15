import chroma from 'chroma-js';

export const isHex = (hex: string) => {
  try {
    const color = chroma(hex);
    return !!color;
  } catch (err) {
    return false;
  }
};

export const isRgb = (rgb: number[]) => {
  try {
    const color = chroma.rgb(rgb[0], rgb[1], rgb[2]);
    return !!color;
  } catch (e) {
    return false;
  }
};

export const isHsl = (hsl: number[]) => {
  try {
    const color = chroma.hsl(hsl[0], hsl[1], hsl[2]);
    return !!color;
  } catch (e) {
    return false;
  }
};

export const getLevel = (contrast: number) => {
  if (contrast > 7) {
    return { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' };
  } else if (contrast > 4.5) {
    return { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Fail' };
  } else if (contrast > 3) {
    return { AALarge: 'Pass', AA: 'Fail', AAALarge: 'Fail', AAA: 'Fail' };
  }

  return { AALarge: 'Fail', AA: 'Fail', AAALarge: 'Fail', AAA: 'Fail' };
};

export const isDark = (hsl: number[]) => chroma.hsl(hsl[0], hsl[1], hsl[2]).get('lab.l') < 60;

export const hexToHsl = (hex: string) => isHex(hex) ? chroma(hex).hsl() : null;

export const hslToHex = (hsl: number[]) => isHsl(hsl) ? chroma.hsl(hsl[0], hsl[1], hsl[2]).hex() : '#808080';

export const hexToRgb = (hex: string) => isHex(hex) ? chroma(hex).rgb() : null;

export const rgbToHex = (rgb: number[]) => isRgb(rgb) ? chroma.rgb(rgb[0], rgb[1], rgb[2]).hex() : '#808080';

export const rgbToHsl = (rgb: number[]) => (isRgb(rgb) ? chroma.rgb(rgb[0], rgb[1], rgb[2]).hsl() : null);

export const getContrast = (a: string, b: string) => chroma.contrast(a, b);
