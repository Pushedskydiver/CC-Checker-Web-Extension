// Service worker. Relays messages between the content script (page) and the
// checker UI (an extension page inside an iframe), and captures the visible tab
// for the eyedropper. `activeTab` is granted by the toolbar click, which is the
// only thing that makes `captureVisibleTab` legal here.

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

function sendToTab(tabId, message) {
	// The tab may have navigated or closed; a rejected promise here is not an error worth surfacing.
	return chrome.tabs.sendMessage(tabId, message).catch(() => undefined);
}

async function showErrorPopup(tabId) {
	// Bind error.html as the popup for this tab only, open it, then unbind so the
	// next click goes back to the normal injection flow. The reset is scheduled
	// before openPopup can fail so the popup can never stay stuck bound.
	await chrome.action.setPopup({ tabId, popup: 'error.html' });

	setTimeout(() => {
		chrome.action.setPopup({ tabId, popup: '' });
	}, 500);

	try {
		// openPopup only exists in newer Chromium builds; the popup is still bound
		// (so the user can click again) when it is missing.
		if (typeof chrome.action.openPopup === 'function') {
			await chrome.action.openPopup();
		}
	} catch {
		// Not available in every browser, that's ok.
	}
}

// Called when the user clicks on the browser action
chrome.action.onClicked.addListener(async (tab) => {
	if (isRestrictedUrl(tab.url)) {
		showErrorPopup(tab.id);
		return;
	}

	try {
		await chrome.tabs.sendMessage(tab.id, {
			message: 'clicked_browser_action',
			type: 'initChecker',
		});
	} catch (error) {
		// No content script is listening: a restricted page, or a tab that was
		// open before the extension was installed/updated (reloading fixes it).
		console.warn('CC Checker: Could not connect to page:', error?.message ?? error);
		showErrorPopup(tab.id);
	}
});

chrome.runtime.onMessage.addListener((r, t) => {
	const tabId = t.tab?.id;

	if (tabId === undefined) return;

	switch (r.type) {
		case 'closeColorPicker':
		case 'closeChecker':
			sendToTab(tabId, { type: r.type });
			break;

		case 'getScreenshot':
		case 'updateScreenShot':
			chrome.tabs
				.captureVisibleTab(t.tab.windowId, { format: 'png' })
				.then((data) => sendToTab(tabId, { type: r.type, key: r.key, data }))
				.catch((error) => {
					console.warn('CC Checker: Screenshot capture failed:', error?.message ?? error);
				});
			break;

		case 'colorPicked':
			// Relayed rather than delivered directly so the checker iframe also
			// receives it in incognito windows.
			sendToTab(tabId, r);
			break;

		default:
	}
});
