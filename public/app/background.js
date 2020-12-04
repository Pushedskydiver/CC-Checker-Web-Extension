window.browser = (() => window.browser || window.chrome)();

function sendCaptureData(r, data, t) {
  window.browser.tabs.sendMessage(t.tab.id, { type: r.type, key: r.key, data });
}

// Called when the user clicks on the browser action
window.browser.browserAction.onClicked.addListener(() => {
  // Send a message to the active tab
  window.browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    window.browser.tabs.sendMessage(activeTab.id, {
      message: 'clicked_browser_action',
      type: 'initChecker'
    });
  });
});

window.browser.runtime.onMessage.addListener((r, t) => {
  switch (r.type) {
    case 'closeColorPicker':
      window.browser.tabs.sendMessage(t.tab.id, { type: 'closeColorPicker' });
      break;

    case 'getScreenshot':
      window.browser.tabs.captureVisibleTab(null, { format: 'png' }, data => sendCaptureData(r, data, t));
      break;

    case 'updateScreenShot':
      window.browser.tabs.captureVisibleTab(null, { format: 'png' }, data => sendCaptureData(r, data, t));
      break;

    case 'closeChecker':
      window.browser.tabs.sendMessage(t.tab.id, { type: 'closeChecker' });
      break;

    case 'expandChecker':
      window.browser.tabs.sendMessage(t.tab.id, { type: 'expandChecker' });
      break;

    case 'retractChecker':
      window.browser.tabs.sendMessage(t.tab.id, { type: 'retractChecker' });
      break;

    default:
  }
});
