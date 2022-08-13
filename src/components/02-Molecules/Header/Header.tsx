import { memo } from 'react';
import { Heading1 } from '../../01-Atoms/Heading/Heading.styles';
import SkipLink from '../../01-Atoms/SkipLink/SkipLink.styles';
import HeaderStyles from './Header.styles';
import { useColourContrast } from '../../Context';

function Header() {
  const { colorState } = useColourContrast();

  return (
    <HeaderStyles>
      <SkipLink href="#ratio" color={colorState}>
        Skip to colour contrast ratio
      </SkipLink>
      <SkipLink href="#grades" color={colorState}>
        Skip to colour contrast grades
      </SkipLink>
      <SkipLink href="#background" color={colorState}>
        Skip to background colour input
      </SkipLink>
      <SkipLink href="#foreground" color={colorState}>
        Skip to foreground colour input
      </SkipLink>

      <Heading1 medium noMargin>Colour Contrast Checker</Heading1>
    </HeaderStyles>
  );
}

export default memo(Header);
