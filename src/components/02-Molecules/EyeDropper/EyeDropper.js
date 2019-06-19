import React, { useEffect, useState, memo } from 'react';
import Canvas from '../../01-Atoms/Canvas/Canvas.styles';
import EyeDropperStyles from './EyeDropper.styles';

const getMousePosition = ({ clientX, clientY }, setPosition) => {
  const canvas = document.querySelector('canvas');
  const x = clientX - (canvas.clientWidth / 2) + 4;
  const y = clientY - (canvas.clientHeight / 2) + 4;

  setPosition({ x, y });
};

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = event => getMousePosition(event, setPosition);
    window.addEventListener('mousemove', setFromEvent);

    return () => {
      window.removeEventListener('mousemove', setFromEvent);
    };
  }, []);

  return position;
};

const EyeDropper = () => {
  const position = useMousePosition();
  const { x, y } = position;

  return (
    <EyeDropperStyles style={{ top: y, left: x }}>
      <Canvas width="8" height="8" />
    </EyeDropperStyles>
  );
};

export default memo(EyeDropper);
