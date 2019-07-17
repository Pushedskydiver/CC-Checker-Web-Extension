import React, { useEffect, useState, memo } from 'react';
import Canvas from '../../01-Atoms/Canvas/Canvas.styles';
import EyeDropperStyles from './EyeDropper.styles';

const EyeDropper = props => {
  const [client, setClientPosition] = useState({ clientX: 0, clientY: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [eyeDropper, setEyeDropper] = useState(props.showEyeDropper);
  const [canvasData, setCanvasData] = useState(props.canvas);
  const display = eyeDropper ? 'block' : 'none';

  function getMousePosition({ clientX, clientY }) {
    const x = clientX - 40;
    const y = clientY - 40;

    setClientPosition({ clientX, clientY });
    setPosition({ x, y });
  }

  function hideEyeDropper({ code }) {
    if (code === 'Escape') {
      setEyeDropper(false);
    }

    return eyeDropper;
  }

  function useMousePosition() {
    useEffect(() => {
      const setFromEvent = event => getMousePosition(event);

      document.body.addEventListener('mousemove', setFromEvent);
      document.body.addEventListener('keyup', hideEyeDropper);

      return () => {
        document.body.removeEventListener('mousemove', setFromEvent);
      };
    }, []);

    return position;
  }

  function renderCanvas() {
    const canvas = document.querySelector('canvas');
    const { clientX, clientY } = client;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(canvasData, clientX, clientY, 8, 8, 0, 0, 8, 8);
  }

  function getColorData() {
    const canvas = document.querySelector('canvas');
    const data = canvas.getContext('2d').getImageData(3.5, 3.5, 1, 1);

    console.log({ data });
  }

  useEffect(() => {
    setEyeDropper(props.showEyeDropper);
    setCanvasData(props.canvas);
  }, [props.showEyeDropper, props.canvas]);

  const mousePosition = useMousePosition();
  const { x, y } = mousePosition;

  if (canvasData !== null) {
    renderCanvas();
  }

  return (
    <EyeDropperStyles
      showEyeDropper={props.showEyeDropper}
      style={{ display, top: y, left: x }}
      onClick={getColorData}
    >
      <Canvas width="8" height="8" />
    </EyeDropperStyles>
  );
};

export default memo(EyeDropper);
