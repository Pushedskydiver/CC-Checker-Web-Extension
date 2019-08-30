import React, { memo, useContext } from 'react';
import round from 'lodash.round';
import Label from '../../01-Atoms/Label/Label.styles';
import Range from '../../01-Atoms/Range/Range.styles';
import ControlStyles from './Controls.styles';
import Context from '../../Context';

function Controls(props) {
  const nanH = h => (isNaN(h) || h === null ? 0 : h);
  const { id } = props;
  const { background, foreground, colorState, handleContrastCheck } = useContext(Context);
  const value = id === 'background' ? background : foreground;
  const [h, s, l] = value;

  function handleChange({ target }) {
    const { name } = props;
    const hsl = [...value];
    const i = parseFloat(target.getAttribute('property'));

    hsl[i] = parseFloat(target.value);
    handleContrastCheck(hsl, name);
  }

  return (
    <ControlStyles color={colorState}>
      <Label htmlFor={`${props.id}Hue`} bold >
        Hue {Math.round(nanH(h))}°
      </Label>

      <Range
        type="range"
        max="360"
        value={nanH(h)}
        id={`${id}Hue`}
        color={colorState}
        onChange={handleChange}
        property={0}
      />

      <Label htmlFor={`${id}Saturation`} bold >
        Saturation {round(s, 2)}
      </Label>

      <Range
        type="range"
        max="1"
        step={1 / 256}
        value={s}
        id={`${id}Saturation`}
        color={colorState}
        onChange={handleChange}
        property={1}
      />

      <Label htmlFor={`${id}Lightness`} bold >
        Lightness {round(l, 2)}
      </Label>

      <Range
        type="range"
        max="1"
        step={1 / 256}
        value={l}
        id={`${id}Lightness`}
        color={colorState}
        onChange={handleChange}
        property={2}
      />
    </ControlStyles>
  );
}

export default memo(Controls);
