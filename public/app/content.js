/*global chrome*/

chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'ccChecker') {
    const iframe = document.createElement('iframe');
    const styles = 'position: fixed; bottom: 0; left: 0; width: 100%; height: 320px; box-shadow: 0 2px 12px 15px rgba(0, 0, 0, 0.075); z-index: 999999';

    iframe.setAttribute('style', styles);
    iframe.src = chrome.extension.getURL('index.html');
    iframe.frameBorder = 0;

    document.body.appendChild(iframe);
  }
});
