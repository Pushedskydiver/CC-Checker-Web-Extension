import fs from 'node:fs';
import path from 'node:path';
const [,, buildDir, outRoot] = process.argv;
const PROBE_BG = fs.readFileSync(path.join(outRoot, 'probe-bg.js'), 'utf8');
const INJECT_BG = fs.readFileSync(path.join(outRoot, 'inject-bg.js'), 'utf8');
function make(name, variant) {
  const out = path.join(outRoot, name);
  fs.rmSync(out, { recursive: true, force: true });
  fs.cpSync(buildDir, out, { recursive: true });
  const mp = path.join(out, 'manifest.json');
  const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
  m.browser_specific_settings = { gecko: { id: 'cc-checker-experiment@example.invalid', strict_min_version: '140.0' } };
  m.background = { service_worker: 'app/background.js', scripts: ['app/background.js'] };
  m.web_accessible_resources[0].resources.push('probe.html');
  m.permissions.push('storage');
  if (variant === 'inject') { delete m.content_scripts; m.permissions.push('scripting'); }
  if (variant === 'manifest-nodyn') delete m.web_accessible_resources[0].use_dynamic_url;
  fs.writeFileSync(mp, JSON.stringify(m, null, 2));
  const bg = path.join(out, 'app/background.js');
  let src = fs.readFileSync(bg, 'utf8');
  if (variant === 'inject') {
    // Replace the onClicked block with the shape-3 flow (ping, then inject, then ping again).
    const start = src.indexOf('// Called when the user clicks on the browser action');
    const end = src.indexOf('chrome.runtime.onMessage.addListener');
    src = src.slice(0, start) + INJECT_BG + '\n' + src.slice(end);
  }
  fs.writeFileSync(bg, src + '\n' + PROBE_BG);
  fs.writeFileSync(path.join(out, 'probe.html'), `<!doctype html><html><head><meta charset="utf-8"></head><body><pre id="out"></pre><button id="copy">copy</button><span id="sel">COPIED-TEXT</span><script src="probe.js"></script></body></html>`);
  fs.writeFileSync(path.join(out, 'probe.js'), fs.readFileSync(path.join(outRoot, 'probe-page.js'), 'utf8'));
  console.log('made', out);
}
make('ext-manifest', 'manifest');
make('ext-inject', 'inject');
make('ext-manifest-nodyn', 'manifest-nodyn');
