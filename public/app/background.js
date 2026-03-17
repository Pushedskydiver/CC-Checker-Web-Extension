const RESTRICTED_URL_PATTERNS = [
	/^chrome:\/\//,
	/^chrome-extension:\/\//,
	/^edge:\/\//,
	/^about:/,
	/^data:/,
	/^file:\/\//,
	/^view-source:/,
	/^https:\/\/chrome\.google\.com\/webstore/,
	/^https:\/\/chromewebstore\.google\.com/,
	/^https:\/\/microsoftedge\.microsoft\.com\/addons/,
];

function isRestrictedUrl(url) {
	if (!url) return true;
	return RESTRICTED_URL_PATTERNS.some((pattern) => pattern.test(url));
}

function showErrorPopup() {
	chrome.action.setPopup({ popup: 'error.html' });

	// Open the popup immediately so the user sees the error
	chrome.action.openPopup().catch(() => {
		// openPopup may not be available in all browsers, that's ok
	});

	// Clear the popup after a short delay so the next click
	// on a valid page goes back to the normal injection flow
	setTimeout(() => {
		chrome.action.setPopup({ popup: '' });
	}, 500);
}

function sendCaptureData(r, data, t) {
	if (chrome.runtime.lastError) {
		console.warn('CC Checker: Screenshot capture failed:', chrome.runtime.lastError.message);
		return;
	}

	chrome.tabs.sendMessage(t.tab.id, { type: r.type, key: r.key, data });
}

// Called when the user clicks on the browser action
chrome.action.onClicked.addListener((tab) => {
	if (isRestrictedUrl(tab.url)) {
		showErrorPopup();
		return;
	}

	chrome.tabs.sendMessage(
		tab.id,
		{ message: 'clicked_browser_action', type: 'initChecker' },
		() => {
			if (chrome.runtime.lastError) {
				console.warn(
					'CC Checker: Could not connect to page:',
					chrome.runtime.lastError.message,
				);
				showErrorPopup();
			}
		},
	);
});

chrome.runtime.onMessage.addListener((r, t) => {
	switch (r.type) {
		case 'closeColorPicker':
			chrome.tabs.sendMessage(t.tab.id, { type: 'closeColorPicker' });
			break;

		case 'getScreenshot':
		case 'updateScreenShot':
			chrome.tabs.captureVisibleTab(null, { format: 'png' }, (data) =>
				sendCaptureData(r, data, t),
			);
			break;

		case 'closeChecker':
			chrome.tabs.sendMessage(t.tab.id, { type: 'closeChecker' });
			break;

		case 'colorPicked':
			chrome.tabs.sendMessage(t.tab.id, r);
			break;

		default:
	}
});
