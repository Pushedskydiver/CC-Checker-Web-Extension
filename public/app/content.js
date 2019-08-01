/*global chrome*/

chrome.runtime.onMessage.addListener(request => {
  console.log({ request });

  if (request.type === 'ccChecker') {
    const iframe = document.createElement('iframe');

    iframe.src = chrome.extension.getURL('index.html');
    iframe.frameBorder = 0;

    document.body.appendChild(iframe);
  }
});
