/*global chrome*/
import React, { Fragment, useContext, useEffect, useState, memo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InputStyles from './Input.styles';
import { Clipboard, Eyedropper } from '../Icon/Icon';
import { CopyButton, ColorPickerButton } from '../Button/Button.styles';
import Label from '../Label/Label.styles';
import Tooltip from '../Tooltip/Tooltip.styles';
import { BlockDiv } from '../../02-Molecules/Block/Block.styles';
import { isHex, hexToHsl, hslToHex } from '../../Utils';
import Context from '../../Context';

function Input(props) {
  const { id } = props;
  const { background, foreground, colorState, handleContrastCheck } = useContext(Context);
  const value = id === 'background' ? background : foreground;

  const [hex, setHexState] = useState(hslToHex(value));
  const [copied, setCopiedState] = useState(false);

  function updateState(mans) {
    setHexState(hslToHex(mans));
    setCopiedState(false);
  }

  function handleHexChange({ target }) {
    const name = target.getAttribute('data-color');
    const valueHasHash = target.value.indexOf('#') !== -1;
    const isHexCode = isHex(target.value);
    const isNum = /^\d+$/.test(target.value);
    const isShortHand = /(^#[0-9a-f]{3}|[0-9a-f]{3])$/gim.test(target.value);
    const isRed = target.value.toLowerCase() === 'red';

    setHexState(target.value);
    setCopiedState(false);

    if (target.value.length === 6 && !valueHasHash && isHexCode && isNum) {
      target.value = `#${target.value}`;
    }

    if (target.value.length <= 3 && !valueHasHash && !isRed) {
      return;
    }

    if (isShortHand && !isRed) {
      return;
    }

    if (target.value.length < 7 && !isHexCode) {
      return;
    }

    if (!isHexCode) {
      return;
    }

    handleContrastCheck(hexToHsl(target.value), name);
  }

  function setCopyState() {
    setCopiedState(true);

    const delaySetState = setTimeout(() => {
      setCopiedState(false);
      clearTimeout(delaySetState);
    }, 2000);
  }

  function checkPressedKey(e) {
    if (e.keyCode === 27) {
      chrome.runtime.sendMessage({
        type: 'closeColorPicker'
      });
    }
  }

  function capturePage() {
    document.addEventListener('keyup', checkPressedKey);

    if (props.id === 'background') {
      chrome.runtime.sendMessage({
        type: 'getScreenshot',
        key: 'background'
      });
    }

    if (props.id === 'foreground') {
      chrome.runtime.sendMessage({
        type: 'getScreenshot',
        key: 'foreground'
      });
    }
  }

  useEffect(() => {
    updateState(value);
  }, [value]);

  return (
    <Fragment>
      <Label medium htmlFor={id} color={colorState}>{`${id} colour`}</Label>

      <BlockDiv color={colorState} noMargin>
        <InputStyles
          type="text"
          minLength="7"
          value={hex}
          id={id}
          spellCheck="false"
          onChange={handleHexChange}
          data-color={id}
        />

        <ColorPickerButton
          type="button"
          aria-label={`Pick ${props.id} colour`}
          onClick={capturePage}
        >
          <Eyedropper />
        </ColorPickerButton>

        <CopyToClipboard text={hex} onCopy={setCopyState}>
          <CopyButton
            type="button"
            aria-labelledby={`${id}CopiedSate`}
          >
            <Clipboard />

            <Tooltip
              id={`${id}CopiedSate`}
              aria-hidden={copied}
              aria-live="polite"
              role="tooltip"
              visible={copied}
              color={colorState}
            >

              {copied ? 'Copied' : `Copy ${hex} to clipboard`}
            </Tooltip>
          </CopyButton>
        </CopyToClipboard>
      </BlockDiv>
    </Fragment>
  );
}

export default memo(Input);
