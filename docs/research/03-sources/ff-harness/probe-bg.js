// ---- experiment probe (appended; not part of the product) ----
globalThis.__cc = globalThis.__cc || { log: [] };
const __kind = (v) => (v && typeof v.then === 'function') ? (v instanceof Promise ? 'Promise' : 'thenable') : typeof v;
const __race = (p, ms) => Promise.race([
	p.then((v) => ({ settled: 'resolved', value: v === undefined ? 'undefined' : (typeof v === 'string' ? v.slice(0, 40) : JSON.stringify(v)?.slice(0, 200)) }), (e) => ({ settled: 'rejected', error: String(e?.message ?? e) })),
	new Promise((r) => setTimeout(() => r({ settled: 'never (timeout ' + ms + 'ms)' }), ms)),
]);
chrome.storage.local.get('results').then(({ results }) => { __cc.results = results || {}; });
async function __save() { await chrome.storage.local.set({ results: __cc.results }); }
// F1: promise-ness of callback-less calls, outside any click.
(() => {
	const r = {};
	try { const p = chrome.tabs.sendMessage(999999, { type: 'nothing' }); r.tabsSendMessage = __kind(p); p?.catch?.(() => {}); } catch (e) { r.tabsSendMessage = 'threw: ' + e.message; }
	try { const p = chrome.action.setPopup({ popup: '' }); r.actionSetPopup = __kind(p); p?.catch?.(() => {}); } catch (e) { r.actionSetPopup = 'threw: ' + e.message; }
	try { const p = chrome.action.getPopup({}); r.actionGetPopup = __kind(p); p?.catch?.(() => {}); } catch (e) { r.actionGetPopup = 'threw: ' + e.message; }
	r.actionOpenPopupType = typeof chrome.action.openPopup;
	r.browserIsChrome = (typeof browser !== 'undefined') ? (browser === chrome) : 'no browser global';
	r.isServiceWorker = typeof ServiceWorkerGlobalScope !== 'undefined';
	r.hasDocument = typeof document !== 'undefined';
	__cc.F1 = r;
})();
// Record every click: tab.url presence, the ping, and captureVisibleTab under the grant.
chrome.action.onClicked.addListener(async (tab) => {
	const rec = { at: Date.now(), tabUrl: tab.url ?? null, tabId: tab.id };
	const t0 = performance.now();
	rec.ping = await __race(chrome.tabs.sendMessage(tab.id, { type: 'probe-ping' }), 3000);
	rec.pingMs = Math.round(performance.now() - t0);
	let cap; try { cap = chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }); rec.captureKind = __kind(cap); } catch (e) { rec.captureKind = 'threw: ' + e.message; }
	if (cap?.then) {
		const c = await __race(cap, 5000);
		rec.capture = c.settled; if (c.settled === 'resolved') { rec.captureDataUrl = (await cap); rec.captureLen = rec.captureDataUrl.length; } else rec.captureError = c.error;
	}
	__cc.results = __cc.results || {}; (__cc.results.clicks = __cc.results.clicks || []).push(rec);
	await __save();
});
chrome.runtime.onMessage.addListener((r, sender, sendResponse) => {
	if (!r || typeof r.type !== 'string' || !r.type.startsWith('probe-')) return undefined;
	const senderInfo = { hasTab: 'tab' in sender, tabId: sender.tab?.id ?? null, windowId: sender.tab?.windowId ?? null, frameId: sender.frameId ?? null, url: sender.url ?? null, origin: sender.origin ?? null };
	if (r.type === 'probe-sender') { (__cc.results.senders = __cc.results.senders || []).push({ from: r.from, ...senderInfo }); __save().then(() => sendResponse(senderInfo)); return true; }
	if (r.type === 'probe-results') { sendResponse({ F1: __cc.F1, results: __cc.results, log: __cc.log }); return true; }
	if (r.type === 'probe-reset') { __cc.results = {}; __save().then(() => sendResponse('ok')); return true; }
	if (r.type === 'probe-revoke') { chrome.permissions.remove({ origins: ['<all_urls>'] }).then((ok) => sendResponse({ removed: ok }), (e) => sendResponse({ error: String(e?.message ?? e) })); return true; }
	if (r.type === 'probe-perms') { chrome.permissions.getAll().then((p) => sendResponse(p)); return true; }
	if (r.type === 'probe-inject') { // used by F8 step 2/3: explicit extra injections
		chrome.scripting.executeScript({ target: { tabId: r.tabId }, files: ['app/content.js'] }).then((res) => sendResponse({ ok: true, res: JSON.stringify(res).slice(0, 300) }), (e) => sendResponse({ ok: false, error: String(e?.message ?? e) })); return true;
	}
	if (r.type === 'probe-close') { chrome.tabs.sendMessage(r.tabId, { type: 'closeChecker' }).then(() => sendResponse('sent'), (e) => sendResponse('rejected: ' + e.message)); return true; }
	return undefined;
});
