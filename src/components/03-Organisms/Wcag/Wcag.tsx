import { memo } from 'react';
import Grade from '../../01-Atoms/Grade/Grade.styles';
import Badge from '../../01-Atoms/Badge/Badge.styles';
// import { Mark } from '../../01-Atoms/Icon/Icon';
import Result from '../../02-Molecules/Result/Result.styles';
import WcagStyles from './Wcag.styles';
import { useColourContrast } from '../../Context';

export interface WcagProps {
  id: string
}

function Wcag(props: WcagProps) {
  const { level, colorState } = useColourContrast();

  return (
    <WcagStyles {...props} color={colorState}>
      <Result>
        <Badge color={colorState}>{level && level.AALarge}</Badge>
        <Grade>AA Large</Grade>
      </Result>
      <Result>
        <Badge color={colorState}>{level && level.AAALarge}</Badge>
        <Grade>AAA Large</Grade>
      </Result>
      <Result>
        <Badge color={colorState}>{level && level.AA}</Badge>
        <Grade>AA Normal</Grade>
      </Result>
      <Result>
        <Badge color={colorState}>{level && level.AAA}</Badge>
        <Grade>AAA Normal</Grade>
      </Result>
    </WcagStyles>
  );
}


export default memo(Wcag);
