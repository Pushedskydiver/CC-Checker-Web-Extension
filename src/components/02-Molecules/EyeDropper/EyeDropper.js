import React, { useEffect, useState, memo } from 'react';
import Canvas from '../../01-Atoms/Canvas/Canvas.styles';
import EyeDropperStyles from './EyeDropper.styles';

const EyeDropper = props => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [eyeDropper, setEyeDropper] = useState(props.showEyeDropper);
  const display = eyeDropper ? 'block' : 'none';

  function getMousePosition({ clientX, clientY }) {
    const canvas = document.querySelector('canvas');
    const x = clientX - (canvas.clientWidth / 2) + 4;
    const y = clientY - (canvas.clientHeight / 2) + 4;

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
      window.addEventListener('mousemove', setFromEvent);
      document.addEventListener('keyup', hideEyeDropper);

      return () => {
        window.removeEventListener('mousemove', setFromEvent);
      };
    }, []);

    return position;
  }

  useEffect(() => {
    setEyeDropper(props.showEyeDropper);
  }, [props.showEyeDropper]);

  const mousePosition = useMousePosition();
  const { x, y } = mousePosition;

  return (
    <EyeDropperStyles
      showEyeDropper={props.showEyeDropper}
      style={{ display, top: y, left: x }}
    >
      <Canvas width="8" height="8" />
    </EyeDropperStyles>
  );
};

export default memo(EyeDropper);
