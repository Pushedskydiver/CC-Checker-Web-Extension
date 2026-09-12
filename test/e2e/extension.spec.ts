import { expect, readAppState, setRange, test } from './fixtures';

// Global function defined by public/app/background.js; evaluated inside the service worker.
declare function isRestrictedUrl(url: string | undefined): boolean;

test.describe('service worker', () => {
	test('registers and classifies restricted URLs', async ({
		serviceWorker,
	}) => {
		expect(serviceWorker.url()).toMatch(/\/app\/background\.js$/);
		const result = await serviceWorker.evaluate(() => ({
			chrome: isRestrictedUrl('chrome://extensions'),
			extension: isRestrictedUrl('chrome-extension://abc/x.html'),
			store: isRestrictedUrl(
				'https://chromewebstore.google.com/detail/x',
			),
			file: isRestrictedUrl('file:///tmp/a.html'),
			about: isRestrictedUrl('about:blank'),
			undefinedUrl: isRestrictedUrl(undefined),
			http: isRestrictedUrl('https://example.com'),
		}));
		expect(result).toEqual({
			chrome: true,
			extension: true,
			store: true,
			file: true,
			about: true,
			undefinedUrl: true,
			http: false,
		});
	});
});

test.describe('content script', () => {
	test('injects one iframe, the loupe canvas and styles into the top frame only', async ({
		page,
		openChecker,
	}) => {
		await openChecker();
		const top = await page.evaluate(() => ({
			iframes: document.querySelectorAll('iframe[data-cc-checker]')
				.length,
			canvas: document.querySelectorAll(
				'[data-cc-canvas-wrapper] canvas[data-cc-canvas]',
			).length,
			styles: document.querySelectorAll('style[data-cc-styles]').length,
			bodyPadding: getComputedStyle(document.body).paddingBottom,
			iframeHeight: getComputedStyle(
				document.querySelector('iframe[data-cc-checker]')!,
			).height,
		}));
		expect(top).toEqual({
			iframes: 1,
			canvas: 1,
			styles: 1,
			bodyPadding: '475px',
			iframeHeight: '475px',
		});

		const child = page.frames().find((f) => f.url().endsWith('/child'));
		expect(child, 'test page child iframe').toBeTruthy();
		const inChild = await child!.evaluate(() => ({
			iframes: document.querySelectorAll('iframe[data-cc-checker]')
				.length,
			canvas: document.querySelectorAll('[data-cc-canvas-wrapper]')
				.length,
			bodyPadding: getComputedStyle(document.body).paddingBottom,
		}));
		expect(inChild).toEqual({ iframes: 0, canvas: 0, bodyPadding: '0px' });
	});

	test('a second initChecker is a no-op', async ({
		page,
		openChecker,
		sendToActiveTab,
	}) => {
		await openChecker();
		await sendToActiveTab({ type: 'initChecker' });
		await page.waitForTimeout(300);
		expect(
			await page.evaluate(
				() =>
					document.querySelectorAll('iframe[data-cc-checker]').length,
			),
		).toBe(1);
	});

	test('close removes the iframe, styles and loupe; reopen restores persisted state', async ({
		page,
		openChecker,
		sendToActiveTab,
	}) => {
		let frame = await openChecker();
		await frame.fill('input#background', '#123456');
		await expect(frame.locator('input#background')).toHaveValue('#123456');
		await frame
			.getByRole('button', { name: 'Close Colour Contrast Checker' })
			.click();
		await page.waitForFunction(
			() => !document.querySelector('iframe[data-cc-checker]'),
		);
		expect(
			await page.evaluate(() => ({
				styles: document.querySelectorAll('style[data-cc-styles]')
					.length,
				loupe: document.querySelectorAll('[data-cc-canvas-wrapper]')
					.length,
				bodyPadding: getComputedStyle(document.body).paddingBottom,
				cursor: document.body.style.cursor,
			})),
		).toEqual({ styles: 0, loupe: 0, bodyPadding: '0px', cursor: 'auto' });

		await sendToActiveTab({ type: 'initChecker' });
		frame = await openChecker();
		await expect(frame.locator('input#background')).toHaveValue('#123456');
	});
});

test.describe('app', () => {
	test('renders with defaults, real font, and consistent first-run colours', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		await expect(frame.locator('#app h1')).toHaveText(
			/colour contrast checker/i,
		);
		const state = await readAppState(frame);
		expect(state.ratio).toBe('12.72');
		expect(state.grades).toEqual([
			'AA Large. Pass',
			'AAA Large. Pass',
			'AA. Pass',
			'AAA. Pass',
		]);
		expect(state.fontLoaded).toBe(true);
		expect(state.background).toBe(state.cssBackground);
	});

	test('typing hex values updates the ratio, grades and CSS variables', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		await frame.fill('input#background', '#000000');
		await expect(frame.locator('#ratio')).toHaveText('1.32');
		let state = await readAppState(frame);
		expect(state.grades.every((g) => g.endsWith('Fail'))).toBe(true);
		expect(state.cssBackground).toBe('#000000');

		await frame.fill('input#background', '#ffffff');
		await expect(frame.locator('#ratio')).toHaveText('15.91');
		state = await readAppState(frame);
		expect(state.grades.every((g) => g.endsWith('Pass'))).toBe(true);
	});

	test('Reverse Colours swaps background and foreground', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		await frame.fill('input#background', '#ffffff');
		await frame.fill('input#foreground', '#222222');
		await frame.getByRole('button', { name: 'Reverse Colours' }).click();
		await expect(frame.locator('input#background')).toHaveValue('#222222');
		await expect(frame.locator('input#foreground')).toHaveValue('#ffffff');
		const state = await readAppState(frame);
		expect(state.cssBackground).toBe('#222222');
		expect(state.cssForeground).toBe('#ffffff');
	});

	test('tabs follow the WAI-ARIA pattern: selection, aria-controls, arrow keys wrap', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		const tabs = frame.locator('#background-tabs [role="tab"]');
		await expect(tabs).toHaveCount(2);
		await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
		await expect(tabs.nth(0)).toHaveAttribute(
			'aria-controls',
			'panel-rgb-background',
		);
		await tabs.nth(1).click();
		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
		await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
		await expect(frame.locator('input#backgroundHue')).toBeVisible();
		await tabs.nth(1).press('ArrowRight');
		await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
		await tabs.nth(0).press('ArrowLeft');
		await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
	});

	test('HSL sliders reach their endpoints and drive the hex', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		await frame.fill('input#background', '#808080');
		await frame.locator('#background-tabs [role="tab"]').nth(1).click();
		await setRange(frame, 'input#backgroundLightness', '1');
		await expect(frame.locator('input#background')).toHaveValue('#ffffff');
		await setRange(frame, 'input#backgroundLightness', '0');
		await expect(frame.locator('input#background')).toHaveValue('#000000');
	});

	test('changing saturation on a grey keeps hue 0 (no NaN hue)', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		await frame.fill('input#foreground', '#222222');
		await frame.locator('#foreground-tabs [role="tab"]').nth(1).click();
		await setRange(frame, 'input#foregroundSaturation', '0.5');
		await expect(frame.locator('input#foreground')).toHaveValue('#331111');
	});

	test('RGB sliders drive the hex', async ({ openChecker }) => {
		const frame = await openChecker();
		await frame.fill('input#foreground', '#000000');
		await frame.locator('#foreground-tabs [role="tab"]').nth(0).click();
		await setRange(frame, 'input#foregroundRed', '255');
		await expect(frame.locator('input#foreground')).toHaveValue('#ff0000');
	});

	test('Save colours adds a swatch once and caps at five', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		const save = frame.getByRole('button', { name: 'Save colours' });
		const swatches = frame.locator('ul[aria-label="Saved colours"] li');
		await save.click();
		await expect(swatches).toHaveCount(1);
		await save.click();
		await expect(swatches).toHaveCount(1);
		for (const hex of [
			'#111111',
			'#222233',
			'#333344',
			'#444455',
			'#555566',
			'#666677',
		]) {
			await frame.fill('input#background', hex);
			await expect(frame.locator('input#background')).toHaveValue(hex);
			await save.click();
		}
		await expect(swatches).toHaveCount(5);
	});

	test('copy and share buttons announce their result to assistive tech', async ({
		openChecker,
	}) => {
		const frame = await openChecker();
		const share = frame.getByRole('button', { name: 'Generate share URL' });
		await expect(share).toBeVisible();
		await share.click();
		await expect(
			frame
				.getByRole('status')
				.filter({ hasText: 'URL added to clipboard' }),
		).toBeVisible();
	});

	test('the share button puts the share URL on the real clipboard', async ({
		context,
		page,
		openChecker,
		serverUrl,
	}) => {
		// The grant goes on the host page, not the panel: `grantPermissions`
		// rejects an opaque `chrome-extension://` origin, and the read-back happens
		// on the host anyway.
		await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
			origin: serverUrl,
		});

		const frame = await openChecker();

		await frame.getByRole('button', { name: 'Generate share URL' }).click();

		await expect(
			frame
				.getByRole('status')
				.filter({ hasText: 'URL added to clipboard' }),
		).toBeVisible();

		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
			'https://colourcontrast.cc/?background=ffe66d&foreground=222222',
		);
	});

	test('a refused copy announces nothing', async ({ page, openChecker }) => {
		// The failure path: `copy-to-clipboard` falls back to `window.prompt` when
		// the copy command is refused, then returns false. Playwright auto-dismisses
		// dialogs, but the handler is explicit so the prompt is part of the record.
		const dialogs: string[] = [];
		page.on('dialog', (dialog) => {
			dialogs.push(dialog.type());
			// `.catch` rather than `void`: if the dialog is still open when the
			// context tears down, the rejection surfaces as an error outside any
			// test rather than a failure. Seen once in ten runs before this.
			dialog.dismiss().catch(() => undefined);
		});

		const frame = await openChecker();

		// The only way in: no-user-activation still copies successfully in this
		// Chromium, so refusal has to come from the command itself.
		await frame.evaluate(() => {
			document.execCommand = () => false;
		});

		await frame.getByRole('button', { name: 'Generate share URL' }).click();

		expect(dialogs).toEqual(['prompt']);

		// Read the attribute rather than the role: the tooltip is hidden when empty,
		// so `getByRole('status')` cannot see it and would pass vacuously.
		expect(
			await frame.evaluate(() =>
				[...document.querySelectorAll('[role="status"]')].map(
					(node) => node.textContent ?? '',
				),
			),
		).toEqual(['', '', '']);
	});

	test('skip links target real, focusable ids', async ({ openChecker }) => {
		const frame = await openChecker();
		const targets = await frame.evaluate(() =>
			[...document.querySelectorAll('a[href^="#"]')].map((a) => {
				const el = document.querySelector(a.getAttribute('href')!);
				const focusable =
					el instanceof HTMLElement &&
					(el.hasAttribute('tabindex') ||
						el.matches('input, button, a[href]'));
				return {
					href: a.getAttribute('href'),
					exists: !!el,
					focusable,
				};
			}),
		);
		expect(targets.length).toBeGreaterThan(0);
		for (const t of targets)
			expect(t, JSON.stringify(t)).toMatchObject({
				exists: true,
				focusable: true,
			});
	});

	test('no console errors, page errors, or failed requests while driving the UI', async ({
		page,
		openChecker,
	}) => {
		const errors: string[] = [];
		page.on('console', (m) => {
			if (m.type() === 'error') errors.push(m.text());
		});
		page.on('pageerror', (e) => errors.push(String(e)));
		page.on('requestfailed', (r) =>
			errors.push(`${r.url()} ${r.failure()?.errorText}`),
		);
		const frame = await openChecker();
		await frame.fill('input#background', '#336699');
		await frame.getByRole('button', { name: 'Reverse Colours' }).click();
		await frame.getByRole('button', { name: 'Save colours' }).click();
		await page.waitForTimeout(300);
		expect(errors).toEqual([]);
	});
});

test.describe('colour picker (needs captureVisibleTab)', () => {
	test.use({ patched: true });

	test('picks a colour from the page and closes the loupe', async ({
		page,
		openChecker,
		serviceWorker,
	}) => {
		const frame = await openChecker();
		await serviceWorker.evaluate(() => {
			(globalThis as unknown as { __closes: number }).__closes = 0;
			chrome.runtime.onMessage.addListener((m) => {
				if (m.type === 'closeColorPicker')
					(globalThis as unknown as { __closes: number }).__closes++;
			});
		});
		await frame
			.getByRole('button', { name: 'Pick background colour' })
			.click();
		const loupe = page.locator('[data-cc-canvas-wrapper]');
		await expect(loupe).toBeVisible();
		expect(await page.evaluate(() => document.body.style.cursor)).toBe(
			'none',
		);

		const red = await page.locator('#red').boundingBox();
		await page.mouse.move(red!.x + 40, red!.y + 40);
		await page.mouse.click(red!.x + 40, red!.y + 40);
		await expect(frame.locator('input#background')).toHaveValue('#ff0000');
		await expect(loupe).toBeHidden();
		expect(await page.evaluate(() => document.body.style.cursor)).toBe(
			'auto',
		);
		expect(
			await serviceWorker.evaluate(
				() => (globalThis as unknown as { __closes: number }).__closes,
			),
		).toBe(1);
	});

	test('Escape cancels a pick', async ({ page, openChecker }) => {
		const frame = await openChecker();
		await frame
			.getByRole('button', { name: 'Pick foreground colour' })
			.click();
		const loupe = page.locator('[data-cc-canvas-wrapper]');
		await expect(loupe).toBeVisible();
		await frame.press('body', 'Escape');
		await expect(loupe).toBeHidden();
	});

	test('closing the checker mid-pick tears the picker down', async ({
		page,
		openChecker,
	}) => {
		const frame = await openChecker();
		await frame
			.getByRole('button', { name: 'Pick background colour' })
			.click();
		await expect(page.locator('[data-cc-canvas-wrapper]')).toBeVisible();
		await frame
			.getByRole('button', { name: 'Close Colour Contrast Checker' })
			.click();
		await page.waitForFunction(
			() => !document.querySelector('iframe[data-cc-checker]'),
		);
		await page.mouse.move(200, 200);
		await page.mouse.wheel(0, 400);
		await page.waitForTimeout(400);
		expect(
			await page.evaluate(() => ({
				loupe: document.querySelectorAll('[data-cc-canvas-wrapper]')
					.length,
				cursor: document.body.style.cursor,
			})),
		).toEqual({ loupe: 0, cursor: 'auto' });
	});
});
