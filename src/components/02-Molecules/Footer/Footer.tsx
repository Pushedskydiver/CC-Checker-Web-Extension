import React, { memo, useContext } from 'react';
import { Button } from '../../01-Atoms/Button/Button.styles';
import Link from '../../01-Atoms/Link/Link.styles';
import Swatch from '../../01-Atoms/Swatch/Swatch';
import { GitHub, Twitter } from '../../01-Atoms/Icon/Icon';
import FooterStyles from './Footer.styles';
import Context from '../../Context';

function Footer() {
  const { expand, colorState, saveColors } = useContext(Context);

  return (
    <FooterStyles expand={expand as boolean}>
      <Button
        type="button"
        color={colorState as string}
        onClick={saveColors}
      >
        Save Colours
      </Button>

      <Swatch />

      <Link
        href="https://github.com/Pushedskydiver/Colour-Contrast-Checker"
        title="Go to GitHub project"
        iconLink
      >
        <GitHub />
      </Link>

      <Link
        href="https://twitter.com/alexmclapperton"
        title="Go to Alex's Twitter profile"
        iconLink
      >
        <Twitter />
      </Link>
    </FooterStyles>
  );
}

export default memo(Footer);
