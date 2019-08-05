/*global chrome*/

import React, { useState, memo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CloseButton, ExpandButton, SwapButton, ShareButton } from '../../01-Atoms/Button/Button.styles';
import { Close, Move, Swap, ShareLink } from '../../01-Atoms/Icon/Icon';
import { hslToHex } from '../../Utils';

const Options = props => {
  const [expand, setExpand] = useState(false);
  const { background, foreground } = props;
  const expandMessage = props.expand ? 'Retract' : 'Expand';

  function generateShareLink() {
    console.log('generateShareLink');

    const backgroundHex = hslToHex(background).substring(1);
    const foregroundHex = hslToHex(foreground).substring(1);

    return `https://colourcontrast.cc/${backgroundHex}/${foregroundHex}`;
  }

  function renderShareMessage() {
    console.log('renderShareMessage');

    return (
      <div>
        Copied to clipboard
      </div>
    );
  }

  function setExpandState() {
    const message = expand ? 'retractChecker' : 'expandChecker';

    chrome.runtime.sendMessage({
      type: message
    });

    expand ? setExpand(false) : setExpand(true);
    props.toggleExpansion();
  }

  function closeChecker() {
    chrome.runtime.sendMessage({
      type: 'closeChecker'
    });
  }

  return (
    <div>
      <CopyToClipboard
        text={generateShareLink()}
        onCopy={renderShareMessage}
      >
        <ShareButton
          type="button"
          color={props.color}
          aria-label="Generate Share Link"
        >
          <ShareLink />
        </ShareButton>
      </CopyToClipboard>

      <SwapButton
        type="button"
        color={props.color}
        aria-label="Reverse Colours"
        onClick={props.reverseColors}
      >
        <Swap />
      </SwapButton>

      <ExpandButton
        type="button"
        color={props.color}
        aria-label={`${expandMessage} Colour Contrast Checker`}
        onClick={setExpandState}
      >
        <Move expand={expand} />
      </ExpandButton>

      <CloseButton
        type="button"
        color={props.color}
        aria-label="Close Colour Contrast Checker"
        onClick={closeChecker}
      >
        <Close />
      </CloseButton>
    </div>
  );
};

export default memo(Options);
