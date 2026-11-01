import { open, install, newTab, switchTo, probe, results, reset, clickToolbar, pageInfo, log, sleep, WEB, ID } from './lib.mjs';
const EL = 'element-6066-11e4-a52e-4f735466cecf';
const m = await open();
await m.navigate('about:blank');
log('F9 uuids pref after relaunch, before install', await m.chrome(`return Services.prefs.getStringPref('extensions.webextensions.uuids', '(unset)')`));
const A = (await m.cmd('WebDriver:GetWindowHandle')).value;
const B = await newTab(m);
const inB = async (fn) => { await switchTo(m, B); const r = await fn(); await switchTo(m, A); return r; };
const last = (arr) => (arr || [])[arr?.length - 1];
log('F9 origin after relaunch+install', await inB(() => install(m, 'ext-manifest')));
log('F9 get', await inB(() => probe(m, 'do=ls-get')));
// ---- F4 retest: iframe in a web tab, then the top-level extension page
const f4 = async (where) => {
  if (where === 'iframe') {
    await m.navigate(WEB);
    await m.exec(`const f = document.createElement('iframe'); f.id = 'pf'; f.src = arguments[0] + 'probe.html'; f.width = 475; f.height = 200; document.body.appendChild(f);`, [m.extUrl]);
    await sleep(1000);
    const fr = (await m.cmd('WebDriver:FindElement', { using: 'css selector', value: '#pf' })).value[EL];
    await m.cmd('WebDriver:SwitchToFrame', { element: fr });
  } else { await m.navigate(`${m.extUrl}probe.html`); await sleep(500); }
  const btn = (await m.cmd('WebDriver:FindElement', { using: 'css selector', value: '#copy' })).value[EL];
  const clickErr = await m.cmd('WebDriver:ElementClick', { id: btn }).then(() => null, (e) => e.message);
  await sleep(2500);
  const out = await m.exec(`return document.getElementById('out').textContent`);
  if (where === 'iframe') await m.cmd('WebDriver:SwitchToParentFrame');
  const clip = await m.chrome(`try { const t = Cc['@mozilla.org/widget/transferable;1'].createInstance(Ci.nsITransferable); t.init(null); t.addDataFlavor('text/plain'); Services.clipboard.getData(t, Services.clipboard.kGlobalClipboard); const s = {}; t.getTransferData('text/plain', s); return s.value.QueryInterface(Ci.nsISupportsString).data.slice(0, 40); } catch (e) { return 'clipboard read failed: ' + e.message; }`);
  log('F4 ' + where, { clickErr, out, clipboardNow: clip });
};
await f4('iframe'); await f4('top');
// ---- F6 retest: restricted URL, with the popup state and the background's own errors
await inB(() => reset(m));
await m.navigate('about:blank'); await sleep(300);
const t0 = Date.now();
log('click', await clickToolbar(m)); await sleep(2000);
const f6 = await m.chrome(`
  const panels = [...document.querySelectorAll('panel')].filter((p) => p.state === 'open' || p.state === 'showing').map((p) => ({ id: p.id, state: p.state, browserSrc: p.querySelector('browser')?.currentURI?.spec ?? null }));
  const since = arguments[0];
  const msgs = Services.console.getMessageArray().filter((x) => x.timeStamp >= since).map((x) => (x.message || '').slice(0, 220));
  return { openPanels: panels, consoleSince: msgs };
`, [t0 - 1000]);
const r6 = await inB(() => results(m));
log('F6', { ...f6, clickRec: (({ tabUrl, ping, capture, captureError }) => ({ tabUrl, ping, capture, captureError }))(last(r6.results.clicks) || {}) });
await m.chrome(`for (const p of document.querySelectorAll('panel')) if (p.state === 'open') p.hidePopup(); return 'closed';`);
// ---- F8 re-injection error message
await inB(() => install(m, 'ext-inject')); await inB(() => reset(m));
await m.navigate(WEB); await sleep(500);
log('click', await clickToolbar(m)); await sleep(2000);
const r8 = await inB(() => results(m)); const tabId = last(r8.results.clicks)?.tabId;
log('F8 re-inject', await inB(() => probe(m, `do=msg&type=probe-inject&tabId=${tabId}`)));
log('F8 iframes', await m.exec(`return document.querySelectorAll('iframe[src*="moz-extension"]').length`));
m.close();
