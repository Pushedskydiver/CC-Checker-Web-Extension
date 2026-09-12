import path from 'node:path';
import { rm } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';

import react from '@vitejs/plugin-react';
import postcssPresetEnv from 'postcss-preset-env';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import { defineConfig, type Plugin } from 'vite';

const outDir = 'build';

/**
 * Vite copies `public/` verbatim, dotfiles included, so a `.DS_Store` that Finder
 * drops into `public/` would end up inside the packaged extension. Strip them.
 */
const stripDotfiles = (): Plugin => ({
	name: 'cc-checker:strip-dotfiles',
	async closeBundle() {
		const entries = await readdir(outDir, {
			withFileTypes: true,
			recursive: true,
		}).catch((error: NodeJS.ErrnoException) => {
			// `closeBundle` runs even when the build failed before emitting anything,
			// and rolldown then reports this hook's throw as the only error. On
			// 12 September 2026 an unresolvable import in `src/app.tsx` printed
			// nothing but `ENOENT: ... scandir 'build'` on a tree with no `build/`
			// (a fresh clone, or after `rm -rf build`); with `build/` present the
			// same tree named the file and column. Only a missing outDir is
			// ignorable — anything else still has to surface.
			if (error.code !== 'ENOENT') throw error;

			return [];
		});

		await Promise.all(
			entries
				.filter((entry) => entry.isFile() && entry.name.startsWith('.'))
				.map((entry) =>
					rm(path.join(entry.parentPath, entry.name), {
						force: true,
					}),
				),
		);
	},
});

export default defineConfig({
	plugins: [react(), stripDotfiles()],
	css: {
		postcss: {
			plugins: [
				// Targets come from the `browserslist` field in package.json.
				postcssPresetEnv({
					autoprefixer: { flexbox: false },
					stage: 3,
					features: {
						'custom-properties': false,
						'nesting-rules': true,
					},
				}),
				// Default 'mobile-first' ordering. A custom comparator here previously
				// reversed the cascade and broke the >= 992px layout.
				postcssSortMediaQueries(),
			],
		},
	},
	resolve: {
		alias: {
			'~': path.resolve(import.meta.dirname, 'src'),
		},
	},
	build: {
		outDir,
		// The UI is loaded as an extension page inside an iframe: one script, one
		// stylesheet, no preload machinery.
		modulePreload: false,
		rolldownOptions: {
			output: {
				codeSplitting: false,
			},
		},
	},
});
