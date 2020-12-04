import React, { Fragment, memo, useContext, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CloseButton, ExpandButton, SwapButton, ShareButton } from '../../01-Atoms/Button/Button.styles';
import { Close, Move, Swap, Share } from '../../01-Atoms/Icon/Icon';
import Tooltip from '../../01-Atoms/Tooltip/Tooltip.styles';
import Context from '../../Context';
import { hslToHex } from '../../Utils';

function Options() {
  const { expand, background, foreground, colorState, reverseColors, setExpand, toggleExpansion } = useContext(Context);
  const [copied, setCopiedState] = useState(false);
  const expandMessage = expand ? 'Retract' : 'Expand';
  const bg = hslToHex(background).split('#');
  const fg = hslToHex(foreground).split('#');
  const shareColorsBody = `https://colourcontrast.cc/${bg[1]}/${fg[1]}`;

  // @ts-ignore
  window.browser = (() => window.browser || window.chrome)();

  function setExpandState() {
    const message = expand ? 'retractChecker' : 'expandChecker';

    // @ts-ignore
    window.browser.runtime.sendMessage({
      type: message
    });

    expand ? setExpand(false) : setExpand(true);
    toggleExpansion();
  }

  function closeChecker() {
    // @ts-ignore
    window.browser.runtime.sendMessage({
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
    <Fragment>
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

            {copied ? shareColorsBody : 'Generate share URL'}
          </Tooltip>
        </ShareButton>
      </CopyToClipboard>

      <SwapButton
        type="button"
        color={colorState}
        aria-label="Reverse Colours"
        onClick={reverseColors}
      >
        <Swap />
      </SwapButton>

      <ExpandButton
        type="button"
        color={colorState}
        aria-label={`${expandMessage} Colour Contrast Checker`}
        onClick={setExpandState}
      >
        <Move expand={expand} />
      </ExpandButton>

      <CloseButton
        type="button"
        color={colorState}
        aria-label="Close Colour Contrast Checker"
        onClick={closeChecker}
      >
        <Close />
      </CloseButton>
    </Fragment>
  );
}

export default memo(Options);
