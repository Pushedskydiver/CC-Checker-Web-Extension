/*global chrome*/

chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'initChecker') {
    const checker = document.querySelector('[data-cc-checker]');
    const iframe = document.createElement('iframe');
    const styles = 'position: fixed; bottom: 0; left: 0; width: 100%; height: 335px; z-index: 999999';

    if (checker !== null) return;

    iframe.setAttribute('data-cc-checker', '');
    iframe.setAttribute('style', styles);
    iframe.src = chrome.extension.getURL('index.html');
    iframe.frameBorder = 0;

    document.body.appendChild(iframe);
  }

  if (request.type === 'closeChecker') {
    const checker = document.querySelector('[data-cc-checker]');

    checker.remove();
  }

  if (request.type === 'expandChecker') {
    const checker = document.querySelector('[data-cc-checker]');

    checker.style.height = '410px';
  }

  if (request.type === 'retractChecker') {
    const checker = document.querySelector('[data-cc-checker]');

    checker.style.height = '335px';
  }
});
