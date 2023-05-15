function sendCaptureData(r, data, t) {
  chrome.tabs.sendMessage(t.tab.id, { type: r.type, key: r.key, data });
}

// Called when the user clicks on the browser action
chrome.action.onClicked.addListener(() => {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    chrome.tabs.sendMessage(activeTab.id, {
      message: 'clicked_browser_action',
      type: 'initChecker'
    });
  });
});

chrome.runtime.onMessage.addListener((r, t) => {
  switch (r.type) {
    case 'closeColorPicker':
      chrome.tabs.sendMessage(t.tab.id, { type: 'closeColorPicker' });
      break;

    case 'getScreenshot':
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, data => sendCaptureData(r, data, t));
      break;

    case 'updateScreenShot':
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, data => sendCaptureData(r, data, t));
      break;

    case 'closeChecker':
      chrome.tabs.sendMessage(t.tab.id, { type: 'closeChecker' });
      break;

    default:
  }
});
