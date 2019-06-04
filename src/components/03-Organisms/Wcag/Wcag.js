import React, { memo } from 'react';
import Grade from '../../01-Atoms/Grade/Grade.styles';
import { Badge } from '../../01-Atoms/Icon/Icon';
import Result from '../../02-Molecules/Result/Result.styles';
import WcagStyles from './Wcag.styles';

const Wcag = (props) => (
  <WcagStyles {...props}>
    <Result>
      <Grade>AA Large</Grade>
      <Badge grade={props.level.AALarge} />
    </Result>
    <Result>
      <Grade>AAA Large</Grade>
      <Badge grade={props.level.AAALarge} />
    </Result>
    <Result>
      <Grade>AA Normal</Grade>
      <Badge grade={props.level.AA} />
    </Result>
    <Result>
      <Grade>AAA Normal</Grade>
      <Badge grade={props.level.AAA} />
    </Result>
  </WcagStyles>
);

export default memo(Wcag);
