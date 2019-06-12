import React, { useEffect, useState, memo } from 'react';
import html2canvas from 'html2canvas';
import { ColorPickerStyles } from '../Button/Button.styles';
import { EyeDropper } from '../Icon/Icon';
import { hslToHex } from '../../Utils';

const ColorPicker = props => {
  const [hex, setHexState] = useState(hslToHex(props.value));

  const updateState = value => {
    setHexState(hslToHex(value));
  };

  function moveEyeDropper({ clientX, clientY }, canvas) {
    const width = clientX - (canvas.clientWidth / 2);
    const height = clientY - (canvas.clientHeight / 2);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(clientX, clientY, 1, 1);
  }

  function setCanvasState() {
    const { body } = document;

    html2canvas(body).then(canvas => {
      body.addEventListener('mousemove', e => moveEyeDropper(e, canvas));
    });
  }

  return (
    <ColorPickerStyles type="button" onClick={setCanvasState}>
      <EyeDropper />
      Pick Colour
    </ColorPickerStyles>
  );
};

export default ColorPicker;
