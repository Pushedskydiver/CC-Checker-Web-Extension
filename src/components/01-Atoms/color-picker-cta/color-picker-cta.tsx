import { ActionCta } from "../action-cta/action-cta";
import { Eyedropper } from "../icon/icon";

export type TColorPickerCta = {
  id: 'background' | 'foreground';
}

export const ColorPickerCta: React.FC<TColorPickerCta> = ({ id }) => {
  const checkPressedKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      chrome.runtime.sendMessage({
        type: 'closeColorPicker'
      });

      document.removeEventListener('keyup', checkPressedKey);
    }
  }

  const capturePage = () => {
    document.addEventListener('keyup', checkPressedKey);

    chrome.runtime.sendMessage({
      type: 'getScreenshot',
      key: id
    });
  }

  return (
    <ActionCta
      label={`Pick ${id} colour`}
      icon={<Eyedropper />}
      onClick={capturePage}
    />
  )
}
