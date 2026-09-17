import path from 'node:path';

import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts on purpose: that file builds the extension page, with the
// PostCSS media-query sort and the single-file output the manifest expects. Unit tests need
// none of it, and running the build plugins under the test runner would only add ways to break.
// The `~` alias is duplicated rather than shared because it is two lines; if a third config
// needs it, extract it then.
export default defineConfig({
	resolve: {
		alias: {
			'~': path.resolve(import.meta.dirname, 'src'),
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node',
	},
});
