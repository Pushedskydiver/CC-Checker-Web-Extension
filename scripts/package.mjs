// Zips build/ into cc-checker-<version>.zip for the Chrome Web Store.
//
// Why not `zip -r`: Info-ZIP stores an entry uncompressed when deflating would
// not shrink it, and the Web Store's unpacker then reported the two smallest
// icons — favicon-48x48.png and favicon-72x72.png, the only "stor" entries —
// as "missing from the uploaded package" (11 September 2026, the 2.1.0 upload).
// fflate deflates every entry regardless of gain. Dotfiles are skipped, as the
// old `-x '.*'` did.
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
