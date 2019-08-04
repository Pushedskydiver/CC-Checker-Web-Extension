/*global chrome*/

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(() => {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const iframe = document.querySelector('[data-cc-checker]');

    if (iframe === null) return;

    chrome.tabs.sendMessage(activeTab.id, {
      message: 'clicked_browser_action',
      type: 'ccChecker'
    });
  });
});
