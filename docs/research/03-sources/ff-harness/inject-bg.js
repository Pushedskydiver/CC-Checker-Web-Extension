// Shape 3 (experiment): ping, then inject, then init.
chrome.action.onClicked.addListener(async (tab) => {
	if (isRestrictedUrl(tab.url)) { showErrorPopup(tab.id); return; }
	const rec = { at: Date.now(), tabUrl: tab.url ?? null };
	const t0 = performance.now();
	const first = await __race(chrome.tabs.sendMessage(tab.id, { message: 'clicked_browser_action', type: 'initChecker' }), 3000);
	rec.firstPing = first; rec.firstPingMs = Math.round(performance.now() - t0);
	if (first.settled !== 'resolved') {
		const t1 = performance.now();
		try {
			const res = await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['app/content.js'] });
			rec.inject = 'ok ' + JSON.stringify(res).slice(0, 200);
		} catch (e) { rec.inject = 'rejected: ' + (e?.message ?? e); }
		rec.injectMs = Math.round(performance.now() - t1);
		const t2 = performance.now();
		rec.secondPing = await __race(chrome.tabs.sendMessage(tab.id, { message: 'clicked_browser_action', type: 'initChecker' }), 3000);
		rec.secondPingMs = Math.round(performance.now() - t2);
	}
	__cc.results = __cc.results || {}; (__cc.results.injectClicks = __cc.results.injectClicks || []).push(rec);
	await __save();
});
