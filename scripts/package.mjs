// Zips build/ into cc-checker-<version>.zip for the Chrome Web Store.
//
// Why a script and not `zip -r`: it removes the dependency on a system zip
// binary (absent on Windows, version-dependent elsewhere) and makes the
// artefact byte-identical wherever it is built, including CI. Every entry is
// deflated; dotfiles are skipped, as the old `-x '.*'` did.
//
// History: written on 11 September 2026 while diagnosing a Web Store rejection
// ("The icon file ./favicons/favicon-48x48.png is missing from the uploaded
// package", and 72x72). The first theory — that the store could not read the
// two entries Info-ZIP had left stored uncompressed — was wrong: Chrome's own
// --pack-extension stores the same two files and the store's repack of 2.0.1
// deflates them, and a fully deflated zip was rejected with the same message.
// The cause was elsewhere (see PROGRESS.md, Session 4). Kept for the reasons above.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { zipSync } from 'fflate';

const buildDir = 'build';
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const out = `cc-checker-${version}.zip`;

const files = {};
const walk = (dir) => {
	for (const name of readdirSync(dir).sort()) {
		if (name.startsWith('.')) continue;
		const path = join(dir, name);
		if (statSync(path).isDirectory()) walk(path);
		else
			files[relative(buildDir, path).split('\\').join('/')] =
				readFileSync(path);
	}
};
walk(buildDir);

writeFileSync(out, zipSync(files, { level: 9 }));
console.log(`${out}: ${Object.keys(files).length} files`);
