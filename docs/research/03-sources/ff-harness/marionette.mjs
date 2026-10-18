import net from 'node:net';
export class Marionette {
  constructor(port = 2828) { this.port = port; this.id = 0; this.buf = ''; this.waiters = new Map(); }
  connect() {
    return new Promise((resolve, reject) => {
      const tryOnce = (n) => {
        const s = net.createConnection({ host: '127.0.0.1', port: this.port });
        s.setEncoding('utf8');
        s.once('error', (e) => { if (n > 0) setTimeout(() => tryOnce(n - 1), 500); else reject(e); });
        s.once('connect', () => { this.sock = s; s.on('data', (d) => this.onData(d)); });
        this.hello = resolve;
      };
      tryOnce(60);
    });
  }
  onData(d) {
    this.buf += d;
    for (;;) {
      const i = this.buf.indexOf(':');
      if (i < 0) return;
      const len = Number(this.buf.slice(0, i));
      if (Buffer.byteLength(this.buf) < i + 1 + len) {
        // need full bytes; compare on byte length
        const rest = Buffer.from(this.buf.slice(i + 1));
        if (rest.length < len) return;
      }
      const body = Buffer.from(this.buf.slice(i + 1)).subarray(0, len).toString('utf8');
      this.buf = Buffer.from(this.buf.slice(i + 1)).subarray(len).toString('utf8');
      const msg = JSON.parse(body);
      if (!Array.isArray(msg)) { this.hello?.(msg); this.hello = null; continue; }
      const [, id, err, res] = msg;
      const w = this.waiters.get(id); this.waiters.delete(id);
      if (!w) continue;
      if (err) w.reject(new Error(`${err.error}: ${err.message}`)); else w.resolve(res);
    }
  }
  cmd(name, params = {}) {
    const id = ++this.id;
    const body = JSON.stringify([0, id, name, params]);
    this.sock.write(`${Buffer.byteLength(body)}:${body}`);
    return new Promise((resolve, reject) => this.waiters.set(id, { resolve, reject }));
  }
  async newSession() { return this.cmd('WebDriver:NewSession', { capabilities: { alwaysMatch: { acceptInsecureCerts: true } } }); }
  setContext(value) { return this.cmd('Marionette:SetContext', { value }); }
  async chrome(script, args = []) { await this.setContext('chrome'); const r = await this.cmd('WebDriver:ExecuteScript', { script, args }); await this.setContext('content'); return r.value; }
  async chromeAsync(script, args = []) { await this.setContext('chrome'); const r = await this.cmd('WebDriver:ExecuteAsyncScript', { script, args, scriptTimeout: 20000 }); await this.setContext('content'); return r.value; }
  async exec(script, args = []) { const r = await this.cmd('WebDriver:ExecuteScript', { script, args }); return r.value; }
  async execAsync(script, args = []) { const r = await this.cmd('WebDriver:ExecuteAsyncScript', { script, args, scriptTimeout: 20000 }); return r.value; }
  navigate(url) { return this.cmd('WebDriver:Navigate', { url }); }
  install(path) { return this.cmd('Addon:Install', { path, temporary: true }); }
  uninstall(id) { return this.cmd('Addon:Uninstall', { id }); }
  quit() { return this.cmd('Marionette:Quit', { flags: ['eForceQuit'] }); }
  close() { this.sock?.destroy(); }
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
