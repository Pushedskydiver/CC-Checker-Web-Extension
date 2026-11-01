import { Marionette } from './marionette.mjs';
const m = new Marionette();
await m.connect();
const s = await m.newSession();
console.log('session', s.sessionId, s.capabilities.browserVersion);
console.log('appinfo', await m.chrome('return Services.appinfo.version + " " + Services.appinfo.name'));
const r = await m.install(new URL('./ext-manifest', import.meta.url).pathname);
console.log('installed', JSON.stringify(r));
m.close();
