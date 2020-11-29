import React, { memo, useContext } from 'react';
import { Heading1 } from '../../01-Atoms/Heading/Heading.styles';
import SkipLink from '../../01-Atoms/SkipLink/SkipLink.styles';
import HeaderStyles from './Header.styles';
import Context, { ContextProps } from '../../Context';

function Header() {
  const { colorState } = useContext<ContextProps>(Context);

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
