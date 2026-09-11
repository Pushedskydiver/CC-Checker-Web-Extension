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
