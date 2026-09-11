import { defineConfig } from '@playwright/test';

/**
 * End-to-end tests load the built extension (`build/`) into a headless Chromium
 * profile and drive it through the real content script → service worker → iframe
 * message flow. Run `npm run build` first, or `npm test` to do both.
 */
export default defineConfig({
	testDir: './test/e2e',
	timeout: 30_000,
	expect: { timeout: 5_000 },
	fullyParallel: true,
	workers: process.env.CI ? 2 : 4,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['list'], ['github']] : 'list',
	use: { trace: 'retain-on-failure' },
});
