import { memo } from 'react';
import Grade from '../../01-Atoms/Grade/Grade.styles';
import Badge from '../../01-Atoms/Badge/Badge.styles';
import { Mark } from '../../01-Atoms/Icon/Icon';
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
        <Badge color={colorState}>
          {level.AALarge}
          <Mark mark={level.AALarge} />
        </Badge>

        <Grade>AA Large</Grade>
      </Result>

      <Result>
        <Badge color={colorState}>
          {level.AAALarge}
          <Mark mark={level.AAALarge} />
        </Badge>

        <Grade>AAA Large</Grade>
      </Result>

      <Result>
        <Badge color={colorState}>
          {level.AA}
          <Mark mark={level.AA} />
        </Badge>

        <Grade>AA Normal</Grade>
      </Result>

      <Result>
        <Badge color={colorState}>
          {level.AAA}
          <Mark mark={level.AAA} />
        </Badge>

        <Grade>AAA Normal</Grade>
      </Result>
    </WcagStyles>
  );
}


export default memo(Wcag);
