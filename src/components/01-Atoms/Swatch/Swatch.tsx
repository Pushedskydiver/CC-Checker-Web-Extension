import React, { Fragment, memo, useContext } from 'react';
import SwatchStyles from './Swatch.styles';
import Context, { ColorsProps, ContextProps } from '../../Context';
import { hexToHsl } from '../../Utils';

function Swatch() {
  const { colors, updateView } = useContext<ContextProps>(Context);

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

  function renderSwatch({ background, foreground }: ColorsProps, index: number) {
    return (
      <SwatchStyles
        key={index}
        background={background}
        foreground={foreground}
        data-background={background}
        data-foreground={foreground}
        onClick={appendColors}
        aria-label={`Swatch: Background = ${background}. Foreground = ${foreground}. Click/Tap to apply these colour values.`}
      >
        Aa
      </SwatchStyles>
    );
  }

  return (
    <Fragment>
      {colors && colors.map((color, index) => renderSwatch(color, index))}
    </Fragment>
  );
}

export default memo(Swatch);
