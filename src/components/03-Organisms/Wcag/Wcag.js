import React, { memo, useContext } from 'react';
import Grade from '../../01-Atoms/Grade/Grade.styles';
import Badge from '../../01-Atoms/Badge/Badge.styles';
import { Mark } from '../../01-Atoms/Icon/Icon';
import Result from '../../02-Molecules/Result/Result.styles';
import WcagStyles from './Wcag.styles';
import Context from '../../Context';

function Wcag(props) {
  const { level, colorState } = useContext(Context);

  return (
    <WcagStyles {...props} color={colorState}>
      <Result>
        <Badge color={colorState}>
          {level.AALarge}
          <Mark mark={level.AALarge} />
        </Badge>
        <Grade>AA Large</Grade>
        <Badge grade={level.AALarge} />
      </Result>
      <Result>
        <Badge color={colorState}>
          {level.AAALarge}
          <Mark mark={level.AAALarge} />
        </Badge>
        <Grade>AAA Large</Grade>
        <Badge grade={level.AAALarge} />
      </Result>
      <Result>
        <Badge color={colorState}>
          {level.AA}
          <Mark mark={level.AA} />
        </Badge>
        <Grade>AA Normal</Grade>
        <Badge grade={level.AA} />
      </Result>
      <Result>
        <Badge color={colorState}>
          {level.AAA}
          <Mark mark={level.AAA} />
        </Badge>
        <Grade>AAA Normal</Grade>
        <Badge grade={level.AAA} />
      </Result>
    </WcagStyles>
  );
}

export default memo(Wcag);
