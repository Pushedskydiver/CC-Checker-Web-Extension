import { Marionette, sleep } from './marionette.mjs';
export const ID = 'cc-checker-experiment@example.invalid';
export const WEB = 'http://127.0.0.1:8765/';
export { sleep };
export async function open() { const m = new Marionette(); await m.connect(); const s = await m.newSession(); m.version = s.capabilities.browserVersion; return m; }
export async function install(m, build) {
  await m.navigate('about:blank'); // an uninstall destroys tabs showing the extension's pages
  try { await m.uninstall(ID); } catch {}
  await m.install(new URL(`./${build}`, import.meta.url).pathname);
  await sleep(800);
  m.extUrl = await m.chrome(`return WebExtensionPolicy.getByID(arguments[0]).getURL('')`, [ID]);
  return m.extUrl;
}
export async function newTab(m) {
  const r = await m.cmd('WebDriver:NewWindow', { type: 'tab' });
  await m.cmd('WebDriver:SwitchToWindow', { handle: r.handle });
  return r.handle;
}
export const switchTo = (m, handle) => m.cmd('WebDriver:SwitchToWindow', { handle });
export const closeTab = (m) => m.cmd('WebDriver:CloseWindow');
export const handles = (m) => m.cmd('WebDriver:GetWindowHandles').then((r) => r);
// Navigate to probe.html?… and return the parsed #out once it is non-empty.
export async function probe(m, query, ms = 5000) {
  await m.navigate(`${m.extUrl}probe.html?${query}`);
  const t = Date.now();
  for (;;) {
    const txt = await m.exec(`return document.getElementById('out').textContent`);
    if (txt) { try { return JSON.parse(txt); } catch { return txt; } }
    if (Date.now() - t > ms) return { error: 'no #out within ' + ms + 'ms' };
    await sleep(100);
  }
}
export const results = (m) => probe(m, 'do=results');
export const reset = (m) => probe(m, 'do=msg&type=probe-reset');
// A toolbar click from the chrome context, the way a real click grants activeTab.
export async function clickToolbar(m) {
  return m.chromeAsync(`
    const [id, done] = arguments;
    (async () => {
      const { ExtensionParent } = ChromeUtils.importESModule('resource://gre/modules/ExtensionParent.sys.mjs');
      const policy = WebExtensionPolicy.getByID(id);
      const ba = ExtensionParent.apiManager.global.browserActionFor(policy.extension);
      if (!ba) return done('no browserAction for ' + id);
      await ba.triggerAction(window);
      done('triggered');
    })().catch((e) => done('error: ' + e.message));
  `, [ID]);
}
export const pageInfo = (m) => m.exec(`return { href: location.href, iw: innerWidth, ih: innerHeight, dpr: devicePixelRatio, hasIframe: !!document.querySelector('iframe[src*="moz-extension"]'), iframeSrc: document.querySelector('iframe[src*="moz-extension"]')?.src ?? null, bodyPadding: getComputedStyle(document.body).paddingBottom }`);
export const log = (k, v) => console.log(k, JSON.stringify(v, null, 1).replace(/\n\s*/g, ' '));
