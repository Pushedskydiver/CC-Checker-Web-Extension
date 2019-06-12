import React, { memo } from 'react';
import EyeDropperStyles from './EyeDropper.styles';
import Canvas from '../../01-Atoms/Canvas/Canvas.styles';

const EyeDropper = (props) => {
  const { styles } = props;
  const { display, top, left } = styles;

  return (
    <EyeDropperStyles style={{ display, top, left }}>
      <Canvas width="8" height="8" />
    </EyeDropperStyles>
  );
};

export default memo(EyeDropper);
