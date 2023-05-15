import { memo } from 'react';
import { SwatchListStyles, SwatchStyles } from './Swatch.styles';
import { useColourContrast } from '../../Context';
import { hexToHsl } from '../../Utils';

function Swatch() {
  const { colors, updateView } = useColourContrast();

  function appendColors(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const target = event.target as HTMLButtonElement;
    const background = hexToHsl(target.getAttribute('data-background') as string);
    const foreground = hexToHsl(target.getAttribute('data-foreground') as string);

    localStorage.setItem('background', JSON.stringify(background));
    localStorage.setItem('foreground', JSON.stringify(foreground));

    if (updateView) {
      updateView(background as number[], foreground as number[]);
    }
  }

  function renderSwatch(color: CC.ColorsProps, index: number) {
    const { background, foreground } = color;

    return (
      <li>
        <SwatchStyles
          key={index}
          background={background}
          foreground={foreground}
          data-background={background}
          data-foreground={foreground}
          onClick={appendColors}
          aria-label={`Swatch: Background = ${background}. Foreground = ${foreground}. Select to apply these colour values.`}
        >
          Aa
        </SwatchStyles>
      </li>
    );
  }

  return (
    <SwatchListStyles aria-label="Saved colours">
      {colors && colors.map((color, index) => renderSwatch(color, index))}
    </SwatchListStyles>
  );
}

export default memo(Swatch);
