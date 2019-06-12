import React, { memo } from 'react';
import Grade from '../../01-Atoms/Grade/Grade.styles';
import { Mark } from '../../01-Atoms/Icon/Icon';
import Result from '../../02-Molecules/Result/Result.styles';
import WcagStyles from './Wcag.styles';

const Wcag = (props) => (
  <WcagStyles {...props}>
    <Result>
      <Badge color={props.colorState}>
        {props.level.AALarge}
        <Mark mark={props.level.AALarge} />
      </Badge>
      <Grade>AA Large</Grade>
      <Badge grade={props.level.AALarge} />
    </Result>
    <Result>
      <Badge color={props.colorState}>
        {props.level.AAALarge}
        <Mark mark={props.level.AAALarge} />
      </Badge>
      <Grade>AAA Large</Grade>
      <Badge grade={props.level.AAALarge} />
    </Result>
    <Result>
      <Badge color={props.colorState}>
        {props.level.AA}
        <Mark mark={props.level.AA} />
      </Badge>
      <Grade>AA Normal</Grade>
      <Badge grade={props.level.AA} />
    </Result>
    <Result>
      <Badge color={props.colorState}>
        {props.level.AAA}
        <Mark mark={props.level.AAA} />
      </Badge>
      <Grade>AAA Normal</Grade>
      <Badge grade={props.level.AAA} />
    </Result>
  </WcagStyles>
);

export default memo(Wcag);
