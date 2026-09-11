import {
	test as base,
	chromium,
	type BrowserContext,
	type Frame,
	type Page,
	type Worker,
} from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BUILD_DIR = path.resolve(import.meta.dirname, '../../build');

export const TEST_PAGE = `<!doctype html><html><head><title>CC test page</title>
<style>body{margin:0;font-family:sans-serif}.block{height:120px;display:flex;align-items:center;justify-content:center;font-size:24px}</style></head>
<body>
<div class="block" id="red" style="background:#ff0000;color:#fff">RED #ff0000</div>
<div class="block" id="green" style="background:#00ff00;color:#000">GREEN #00ff00</div>
<div class="block" id="blue" style="background:#0000ff;color:#fff">BLUE #0000ff</div>
<iframe id="child" src="/child" style="width:400px;height:120px;border:0"></iframe>
<p style="height:1500px">tall content so the page scrolls</p>
</body></html>`;

const CHILD_PAGE = `<!doctype html><html><body style="margin:0;background:#00ff00"><p>child frame</p></body></html>`;

type Fixtures = {
	/** When true, the extension is loaded from a copy whose manifest adds host_permissions <all_urls>,
	 *  so chrome.tabs.captureVisibleTab works without a real toolbar click (which Playwright cannot perform). */
	patched: boolean;
	extensionDir: string;
	serverUrl: string;
	context: BrowserContext;
	serviceWorker: Worker;
	extensionId: string;
	page: Page;
	/** Simulates the toolbar click: sends initChecker to the active tab from the service worker, waits for the app iframe. */
	openChecker: () => Promise<Frame>;
	sendToActiveTab: (
		message: Record<string, unknown>,
	) => Promise<{ lastError: string | null }>;
};

export const test = base.extend<Fixtures>({
	patched: [false, { option: true }],

	extensionDir: async ({ patched }, use) => {
		if (!fs.existsSync(path.join(BUILD_DIR, 'manifest.json'))) {
			throw new Error(
				`No built extension at ${BUILD_DIR} — run \`npm run build\` first`,
			);
		}
		if (!patched) return use(BUILD_DIR);
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cc-ext-patched-'));
		fs.cpSync(BUILD_DIR, dir, { recursive: true });
		const manifestPath = path.join(dir, 'manifest.json');
		const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
		manifest.host_permissions = ['<all_urls>'];
		fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
		await use(dir);
		fs.rmSync(dir, { recursive: true, force: true });
	},

	serverUrl: async ({}, use) => {
		const server = http.createServer((req, res) => {
			res.writeHead(200, { 'content-type': 'text/html' });
			res.end(req.url === '/child' ? CHILD_PAGE : TEST_PAGE);
		});
		await new Promise<void>((resolve) =>
			server.listen(0, '127.0.0.1', resolve),
		);
		const address = server.address();
		if (!address || typeof address === 'string')
			throw new Error('server did not bind');
		await use(`http://127.0.0.1:${address.port}/`);
		// Keep-alive sockets would otherwise hold close() open until the test timeout.
		server.closeAllConnections();
		await new Promise<void>((resolve) => server.close(() => resolve()));
	},

	context: async ({ extensionDir }, use) => {
		const userDataDir = fs.mkdtempSync(
			path.join(os.tmpdir(), 'cc-ext-profile-'),
		);
		const context = await chromium.launchPersistentContext(userDataDir, {
			headless: true,
			channel: 'chromium',
			args: [
				`--disable-extensions-except=${extensionDir}`,
				`--load-extension=${extensionDir}`,
			],
		});
		await use(context);
		await context.close();
		fs.rmSync(userDataDir, { recursive: true, force: true });
	},

	serviceWorker: async ({ context }, use) => {
		const worker =
			context.serviceWorkers()[0] ??
			(await context.waitForEvent('serviceworker', { timeout: 15_000 }));
		await use(worker);
	},

	extensionId: async ({ serviceWorker }, use) => {
		await use(new URL(serviceWorker.url()).host);
	},

	page: async ({ context, serverUrl }, use) => {
		const page = context.pages()[0] ?? (await context.newPage());
		await page.goto(serverUrl, { waitUntil: 'load' });
		// content scripts are registered at document_idle
		await page.waitForTimeout(300);
		await use(page);
	},

	sendToActiveTab: async ({ serviceWorker }, use) => {
		await use((message) =>
			serviceWorker.evaluate(async (msg) => {
				const tabs = await chrome.tabs.query({ active: true });
				const tab = tabs[0];
				if (tab?.id === undefined)
					return { lastError: 'no active tab' };
				const tabId = tab.id;
				return new Promise<{ lastError: string | null }>((resolve) =>
					chrome.tabs.sendMessage(tabId, msg, () =>
						resolve({
							lastError:
								chrome.runtime.lastError?.message ?? null,
						}),
					),
				);
			}, message),
		);
	},

	openChecker: async ({ page, extensionId, sendToActiveTab }, use) => {
		await use(async () => {
			await sendToActiveTab({
				message: 'clicked_browser_action',
				type: 'initChecker',
			});
			await page.waitForSelector('iframe[data-cc-checker]', {
				timeout: 10_000,
			});
			const appUrl = `chrome-extension://${extensionId}/index.html`;
			await page.waitForFunction(
				(url) =>
					[...document.querySelectorAll('iframe[data-cc-checker]')]
						.length === 1 && !!url,
				appUrl,
			);
			const deadline = Date.now() + 10_000;
			let frame: Frame | undefined;
			while (
				!(frame = page
					.frames()
					.find((f) => f.url().startsWith(appUrl))) &&
				Date.now() < deadline
			) {
				await page.waitForTimeout(50);
			}
			if (!frame)
				throw new Error(
					`extension frame not found; frames: ${page
						.frames()
						.map((f) => f.url())
						.join(', ')}`,
				);
			await frame.waitForSelector('#ratio', { timeout: 10_000 });
			return frame;
		});
	},
});

export const expect = test.expect;

export async function readAppState(frame: Frame) {
	return frame.evaluate(() => ({
		ratio: document.querySelector('#ratio')?.textContent ?? '',
		background:
			(
				document.querySelector(
					'input#background',
				) as HTMLInputElement | null
			)?.value ?? '',
		foreground:
			(
				document.querySelector(
					'input#foreground',
				) as HTMLInputElement | null
			)?.value ?? '',
		cssBackground: getComputedStyle(document.body)
			.getPropertyValue('--background-color')
			.trim(),
		cssForeground: getComputedStyle(document.body)
			.getPropertyValue('--foreground-color')
			.trim(),
		grades: [...document.querySelectorAll('#grades li')].map(
			(li) => li.getAttribute('aria-label') ?? '',
		),
		fontLoaded: document.fonts.check('16px "Avenir Next"'),
	}));
}

/** Drive a React-controlled <input type="range"> the way a user would: set the value via the native setter and fire `input`. */
export async function setRange(frame: Frame, selector: string, value: string) {
	await frame.evaluate(
		([sel, val]) => {
			const el = document.querySelector<HTMLInputElement>(sel);
			if (!el) throw new Error(`no element ${sel}`);
			const setter = Object.getOwnPropertyDescriptor(
				HTMLInputElement.prototype,
				'value',
			)?.set;
			setter?.call(el, val);
			el.dispatchEvent(new Event('input', { bubbles: true }));
		},
		[selector, value] as const,
	);
}
