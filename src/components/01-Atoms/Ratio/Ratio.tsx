import React, { memo, useContext } from 'react';
import RatioStyles from './Ratio.styles';
import Context, { ContextProps } from '../../Context';

function Ratio() {
  const { contrast, colorState } = useContext<ContextProps>(Context);

  return (
    <RatioStyles
      color={colorState}
      id="ratio"
    >
      {contrast && contrast.toFixed(2)}
    </RatioStyles>
  );
}

export default memo(Ratio);
