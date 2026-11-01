import { open, install, newTab, switchTo, probe, results, reset, clickToolbar, pageInfo, log, sleep, WEB, ID } from './lib.mjs';
const EL = 'element-6066-11e4-a52e-4f735466cecf';
const m = await open();
await m.navigate('about:blank');
const A = (await m.cmd('WebDriver:GetWindowHandle')).value;
const B = await newTab(m);
const inB = async (fn) => { await switchTo(m, B); const r = await fn(); await switchTo(m, A); return r; };
const last = (arr) => (arr || [])[arr?.length - 1];
await inB(() => install(m, 'ext-manifest'));
await inB(() => reset(m));
// ---- F2: sender.tab from an iframe inside a web tab, and from a top-level extension page
await m.navigate(WEB);
await m.exec(`const f = document.createElement('iframe'); f.src = arguments[0] + 'probe.html?do=sender'; f.width = 475; f.height = 200; document.body.appendChild(f);`, [m.extUrl]);
await sleep(1500);
const top = await inB(() => probe(m, 'do=sender'));
const r2 = await inB(() => results(m));
log('F2 senders', r2.results.senders); log('F2 top-level reply', top);
// ---- F5/F7 baseline: a toolbar click on the web page with the manifest script present
await inB(() => reset(m));
const permsBefore = await inB(() => probe(m, 'do=msg&type=probe-perms'));
await m.navigate(WEB);
const before = await pageInfo(m);
log('click', await clickToolbar(m)); await sleep(1500);
const after = await pageInfo(m);
const r5 = await inB(() => results(m));
const c = last(r5.results.clicks);
log('F5 baseline', { permsBefore, before: { hasIframe: before.hasIframe }, after: { hasIframe: after.hasIframe, iframeSrc: after.iframeSrc, bodyPadding: after.bodyPadding }, click: { ...c, captureDataUrl: c?.captureDataUrl ? `data:… (${c.captureLen} chars)` : null } });
// ---- F7: decode the capture at device pixels
log('F7', await inB(() => probe(m, `do=decode&dpr=${before.dpr}&iw=${before.iw}&ih=${before.ih}`, 8000)));
// ---- F4: execCommand('copy') and writeText inside the iframe (and the top-level page) on a real click
await m.navigate(WEB);
await m.exec(`const f = document.createElement('iframe'); f.id = 'pf'; f.src = arguments[0] + 'probe.html'; f.width = 475; f.height = 200; document.body.appendChild(f);`, [m.extUrl]);
await sleep(1000);
const fr = (await m.cmd('WebDriver:FindElement', { using: 'css selector', value: '#pf' })).value[EL];
await m.cmd('WebDriver:SwitchToFrame', { element: fr });
const btn = (await m.cmd('WebDriver:FindElement', { using: 'css selector', value: '#copy' })).value[EL];
await m.cmd('WebDriver:ElementClick', { id: btn }); await sleep(800);
const f4 = await m.exec(`return document.getElementById('out').textContent`);
await m.cmd('WebDriver:SwitchToParentFrame');
const clip = await m.chrome(`try { const t = Cc['@mozilla.org/widget/transferable;1'].createInstance(Ci.nsITransferable); t.init(null); t.addDataFlavor('text/plain'); Services.clipboard.getData(t, Services.clipboard.kGlobalClipboard); const s = {}; t.getTransferData('text/plain', s); return s.value.QueryInterface(Ci.nsISupportsString).data; } catch (e) { return 'clipboard read failed: ' + e.message; }`);
log('F4 iframe', { out: f4, clipboardNow: clip });
// ---- F5: revoke <all_urls>, then click again on a fresh document
const revoke = await inB(() => probe(m, 'do=msg&type=probe-revoke'));
const permsAfter = await inB(() => probe(m, 'do=msg&type=probe-perms'));
await m.navigate(WEB); await sleep(500);
const b2 = await pageInfo(m);
log('click', await clickToolbar(m)); await sleep(1500);
const a2 = await pageInfo(m);
const r5b = await inB(() => results(m));
const c2 = last(r5b.results.clicks);
log('F5 revoked', { revoke, permsAfter, before: { hasIframe: b2.hasIframe }, after: { hasIframe: a2.hasIframe, bodyPadding: a2.bodyPadding }, click: { ...c2, captureDataUrl: c2?.captureDataUrl ? `data:… (${c2.captureLen} chars)` : null } });
// ---- F6: a restricted URL → showErrorPopup (setPopup then openPopup after an await)
await m.navigate('about:blank'); await sleep(300);
log('click', await clickToolbar(m)); await sleep(1500);
const f6 = await m.chrome(`
  const panels = [...document.querySelectorAll('panel')].filter((p) => p.state === 'open').map((p) => ({ id: p.id, browserSrc: p.querySelector('browser')?.currentURI?.spec ?? null }));
  const msgs = Services.console.getMessageArray().map((x) => x.message).filter((t) => /openPopup|popup|cc-checker|moz-extension/i.test(t)).slice(-6);
  return { openPanels: panels, consoleTail: msgs };
`);
const r6 = await inB(() => results(m));
log('F6', { ...f6, clickRec: (({ tabUrl, ping, pingMs, captureKind, capture, captureError }) => ({ tabUrl, ping, pingMs, captureKind, capture, captureError }))(last(r6.results.clicks) || {}) });
await m.cmd('WebDriver:Navigate', { url: 'about:blank' }).catch(() => {});
// close any open popup panel before moving on
await m.chrome(`for (const p of document.querySelectorAll('panel')) if (p.state === 'open') p.hidePopup(); return 'closed';`);
// ---- F3: the nodyn build's warnings, and ext-manifest's (already seen)
await inB(() => install(m, 'ext-manifest-nodyn'));
log('F3 nodyn warnings', await m.chrome(`return WebExtensionPolicy.getByID(arguments[0]).extension.warnings`, [ID]));
// ---- F8: shape 3 — no content_scripts, activeTab + scripting, inject on click
await inB(() => install(m, 'ext-inject'));
await inB(() => reset(m));
const perms8 = await inB(() => probe(m, 'do=msg&type=probe-perms'));
await m.navigate(WEB); await sleep(500);
log('click', await clickToolbar(m)); await sleep(2500);
const a8 = await pageInfo(m);
const r8 = await inB(() => results(m));
const ic = last(r8.results.injectClicks); const cc8 = last(r8.results.clicks);
log('F8 first click', { perms8, after: { hasIframe: a8.hasIframe, bodyPadding: a8.bodyPadding }, injectClick: ic, probeClick: { tabId: cc8?.tabId, ping: cc8?.ping, capture: cc8?.capture } });
const tabId = cc8?.tabId;
const count = () => m.exec(`return document.querySelectorAll('iframe[src*="moz-extension"]').length`);
// second click on the already-injected document
log('click', await clickToolbar(m)); await sleep(2000);
const r8b = await inB(() => results(m));
log('F8 second click', { iframes: await count(), injectClick: last(r8b.results.injectClicks) });
// two explicit executeScript calls on the same document
const inj1 = await inB(() => probe(m, `do=msg&type=probe-inject&tabId=${tabId}`));
const inj2 = await inB(() => probe(m, `do=msg&type=probe-inject&tabId=${tabId}`));
log('F8 explicit injections', { inj1, inj2, iframes: await count() });
// closeChecker, then one more injection and click
const closed = await inB(() => probe(m, `do=msg&type=probe-close&tabId=${tabId}`)); await sleep(800);
const afterClose = await count();
const inj3 = await inB(() => probe(m, `do=msg&type=probe-inject&tabId=${tabId}`)); await sleep(500);
log('click', await clickToolbar(m)); await sleep(2000);
const r8c = await inB(() => results(m));
log('F8 after close', { closed, iframesAfterClose: afterClose, inj3, iframesAfterInjectAndClick: await count(), injectClick: last(r8c.results.injectClicks) });
// ---- F9 part 1: write localStorage on the extension origin, then quit
await inB(() => install(m, 'ext-manifest'));
log('F9 set', await inB(() => probe(m, 'do=ls-set')));
log('F9 origin before quit', m.extUrl);
await m.quit();
