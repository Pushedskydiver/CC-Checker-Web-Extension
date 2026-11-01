import { open, install, probe, log } from './lib.mjs';
const m = await open();
log('install ext-manifest', await install(m, 'ext-manifest'));
const r = await probe(m, 'do=results');
log('F1', r.F1); log('version', m.version);
log('warnings', await m.chrome(`return WebExtensionPolicy.getByID(arguments[0]).extension.warnings`, ['cc-checker-experiment@example.invalid']));
m.close();
