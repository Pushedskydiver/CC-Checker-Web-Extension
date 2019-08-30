/*global chrome*/

function sendCaptureData(r, data, t) {
  chrome.tabs.sendMessage(t.tab.id, {
    type: r.type,
    key: r.key,
    data
  });
}

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(() => {
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
  if (r.type === 'closeColorPicker') {
    chrome.tabs.sendMessage(t.tab.id, {
      type: 'closeColorPicker'
    });
  }

  if (r.type === 'getScreenshot') {
    chrome.tabs.captureVisibleTab(null, {
      format: 'png'
    }, data => sendCaptureData(r, data, t));
  }

  if (r.type === 'updateScreenShot') {
    chrome.tabs.captureVisibleTab(null, {
      format: 'png'
    }, data => sendCaptureData(r, data, t));
  }

  if (r.type === 'closeChecker') {
    chrome.tabs.sendMessage(t.tab.id, {
      type: 'closeChecker'
    });
  }

  if (r.type === 'expandChecker') {
    chrome.tabs.sendMessage(t.tab.id, {
      type: 'expandChecker'
    });
  }

  if (r.type === 'retractChecker') {
    chrome.tabs.sendMessage(t.tab.id, {
      type: 'retractChecker'
    });
  }
});
