/*global chrome*/

import React, { Fragment, useState, memo } from 'react';
import { CloseButton, ExpandButton, SwapButton } from '../../01-Atoms/Button/Button.styles';
import { Close, Move, Swap } from '../../01-Atoms/Icon/Icon';

const Options = props => {
  const [expand, setExpand] = useState(false);
  const expandMessage = props.expand ? 'Retract' : 'Expand';

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
    <Fragment>
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
    </Fragment>
  );
};

export default memo(Options);
