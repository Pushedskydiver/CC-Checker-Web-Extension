/// <reference path="./types/postcss-sort-media-queries.d.ts" />
import path from 'path';

import react from '@vitejs/plugin-react';
import postcssPresetEnv from 'postcss-preset-env';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	css: {
		postcss: {
			plugins: [
				postcssPresetEnv({
					autoprefixer: { flexbox: false },
					browsers: 'last 3 versions',
					stage: 3,
					features: {
						'custom-properties': false,
						'nesting-rules': true,
					},
				}),
				postcssSortMediaQueries({
					sort: (a, b) => b.localeCompare(a),
				}),
			],
		},
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		outDir: 'build',
		modulePreload: false,
		rolldownOptions: {
			output: {
				codeSplitting: false,
			},
		},
	},
});
