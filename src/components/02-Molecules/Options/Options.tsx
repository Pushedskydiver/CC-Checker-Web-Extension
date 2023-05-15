import { memo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CloseButton, SwapButton, ShareButton } from '../../01-Atoms/Button/Button.styles';
import { Close, Swap, Share } from '../../01-Atoms/Icon/Icon';
import Tooltip from '../../01-Atoms/Tooltip/Tooltip.styles';
import { useColourContrast } from '../../Context';
import { hslToHex } from '../../Utils';
import { OptionsListStyles, OptionsItemStyles } from './Options.styles';

function Options() {
  const { background, foreground, colorState, reverseColors } = useColourContrast();
  const [copied, setCopiedState] = useState(false);
  const bg = hslToHex(background).split('#');
  const fg = hslToHex(foreground).split('#');
  const shareColorsBody = `https://colourcontrast.cc/${bg[1]}/${fg[1]}`;

  function closeChecker() {
    chrome.runtime.sendMessage({
      type: 'closeChecker'
    });
  }

  function setCopyState() {
    setCopiedState(true);

    const delaySetState = setTimeout(() => {
      setCopiedState(false);
      clearTimeout(delaySetState);
    }, 2000);
  }
  return (
    <OptionsListStyles aria-label="Options">
      <OptionsItemStyles>
        <CopyToClipboard text={shareColorsBody} onCopy={setCopyState}>
          <ShareButton
            type="button"
            color={colorState}
            aria-labelledby="shareColorsCopiedSate"
          >
            <Share />

            <Tooltip
              id="shareColorsCopiedSate"
              aria-hidden={copied}
              aria-live="polite"
              role="tooltip"
              visible={copied}
              color={colorState}
            >

              {copied ? 'URL added to clipboard' : 'Generate share URL'}
            </Tooltip>
          </ShareButton>
        </CopyToClipboard>
      </OptionsItemStyles>

      <OptionsItemStyles>
        <SwapButton
          type="button"
          color={colorState}
          aria-label="Reverse Colours"
          onClick={reverseColors}
        >
          <Swap />
        </SwapButton>
      </OptionsItemStyles>

      <OptionsItemStyles>
        <CloseButton
          type="button"
          color={colorState}
          aria-label="Close Colour Contrast Checker"
          onClick={closeChecker}
        >
          <Close />
        </CloseButton>
      </OptionsItemStyles>
    </OptionsListStyles>
  );
}

export default memo(Options);
