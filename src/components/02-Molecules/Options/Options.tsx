/*global chrome*/

import React, { Fragment, memo, useContext } from 'react';
import { CloseButton, ExpandButton, SwapButton } from '../../01-Atoms/Button/Button.styles';
import { Close, Move, Swap } from '../../01-Atoms/Icon/Icon';
import Context from '../../Context';

function Options() {
  const { expand, colorState, reverseColors, setExpand, toggleExpansion } = useContext(Context);
  const expandMessage = expand ? 'Retract' : 'Expand';

  function setExpandState() {
    const message = expand ? 'retractChecker' : 'expandChecker';

    chrome.runtime.sendMessage({
      type: message
    });

    expand ? setExpand(false) : setExpand(true);
    toggleExpansion();
  }

  function closeChecker() {
    chrome.runtime.sendMessage({
      type: 'closeChecker'
    });
  }

  return (
    <Fragment>
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
