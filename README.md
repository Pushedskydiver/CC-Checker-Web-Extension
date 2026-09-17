# Colour Contrast Checker

A Chrome extension that checks the contrast between a background and a foreground colour against
WCAG, without leaving the page you are looking at.

Click the toolbar icon and a 475px panel appears at the bottom of the current tab. Pick two
colours and it shows you:

- the contrast ratio, recalculated on every change
- WCAG grades for AA and AAA, normal and large text
- hex, RGB and HSL controls for each colour, kept in sync
- an eyedropper that samples any pixel on the page through a magnified loupe
- save up to five background/foreground pairs, with the newest first
- a "Reverse Colours" button that swaps the two
- a share URL for the same pair on [colourcontrast.cc](https://colourcontrast.cc), the sibling web
  app, whose source is at
  [Pushedskydiver/Colour-Contrast-Checker](https://github.com/Pushedskydiver/Colour-Contrast-Checker)

Copy and share confirmations are announced to assistive technology, the tabs follow the WAI-ARIA
pattern, and when the pair you are testing is itself unreadable the panel's own text switches to
black or white so the tool never becomes the thing failing contrast.

## Install

The extension is listed on the Chrome Web Store as "Colour Contrast Checker" (short name
"CC Checker"). Install it from there for everyday use.

To run it from source, load the built `build/` directory as an unpacked extension:

```bash
npm ci
npm run build
```

Then open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and choose
`build/`. The only permission it asks for is `activeTab`, so the panel and the eyedropper work only
on a tab whose toolbar icon you have clicked. On pages Chrome will not let extensions touch
(`chrome://`, the Web Store, `file://` and so on) the icon opens `public/error.html` instead.

## Development

Requirements: Node 24 (`.nvmrc` says `24`; `nvm use` picks it up) and npm. Playwright's Chromium
is not fetched by `npm ci`, so run `npx playwright install chromium` once per machine (and again after a `@playwright/test` bump) before the
e2e suite.

| Command             | What it does                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `npm run build`     | Vite build to `build/` — one JS file, one CSS file, manifest copied verbatim                  |
| `npm run watch`     | Same build, rerun on every save                                                               |
| `npm run lint`      | `lint:ts` (tsc on both tsconfigs), `lint:js` (eslint), `lint:css` (stylelint), `format:check` |
| `npm run format`    | Prettier `--write` (config comes from `.editorconfig`: tabs, single quotes)                   |
| `npm run test:unit` | Vitest over `src/utils/*.test.ts` — no browser, no build needed                               |
| `npm run test:e2e`  | Playwright against whatever is in `build/`                                                    |
| `npm test`          | `build` then `test:e2e`                                                                       |
| `npm run package`   | `build` then zip `build/` to `cc-checker-<version>.zip`, dotfiles excluded                    |

There is no dev server. The app needs the `chrome.*` APIs, so it is only meaningful loaded as an
unpacked extension. The loop is:

- change `src/` → `npm run watch` rebuilds → reload the page the checker is open on
- change `public/app/*.js` or `public/manifest.json` → click **Reload** on the extension's card in
  `chrome://extensions`, then reload the page

Before every push, the full suite must be green:

```bash
npm run lint && npm run test:unit && npm run build && npm run test:e2e
```

`.github/workflows/ci.yml` runs the same three steps on Ubuntu for every pull request and every
push to `main`. It has been a required status check on `main` since 11 September 2026, after its
first green run on PR #28. It matters because it is the only Linux checkout in the loop: on 4 September 2026 the
Git index still tracked `01-Atoms/`, `02-Molecules/`, `Icon/`, `Ratio/` and `Header/` in their old
capitalisation while the disk and every import were lowercase. macOS hid it for the whole migration; a case-sensitive
clone could not build. A green build on the author's Mac is not evidence for CI.

## Testing

The suite is end-to-end only, in `test/e2e/`, with `playwright.config.ts` at the root. Each test
loads the built extension from `build/` into a headless Chromium profile (`channel: 'chromium'`,
`--load-extension`) and drives the real content script → service worker → iframe message flow:
the service worker classifies restricted URLs, the content script injects exactly one iframe into
the top frame only, and the React app is exercised through its hex inputs, sliders, tabs, saved
swatches, copy and share buttons and skip links. On 4 September 2026 that was 18 tests, all green
in about seven seconds. The eyedropper tests run against a copy of the manifest with
`host_permissions: ["<all_urls>"]`, because `captureVisibleTab` under `activeTab` needs a real
toolbar click that Playwright cannot perform.

What it does not prove: a real toolbar click and `activeTab` grant, the error popup as a popup,
incognito, a real (rather than stubbed) refusal of the copy command, the zip that goes to the Web Store, or
anything
about Safari. The pure colour utilities in `src/utils/color-utils.ts` have 19 Vitest tests as of
17 September 2026 (`npm run test:unit`). Fixtures, the patched-manifest option, and how to add a
test are in [docs/TESTING.md](docs/TESTING.md).

## Releasing

Nothing publishes automatically. Merging to `main` changes what is in Git and nothing else —
merged is not published.

1. Check the currently published version in the Chrome Web Store developer dashboard. The store
   rejects any upload whose version is not greater than it.
2. Bump `version` in **both** `package.json` and `public/manifest.json`. They are not linked; on
   4 September 2026 they had drifted to 1.6.1 and 1.6.2, and the manifest had at some point gone
   backwards from 1.6.4, which is why both were first bumped to 1.7.0. On 11 September 2026 the public
   listing showed the store already at 2.0.1 — a build no commit in this repo carries — so the
   release became 2.1.0. Step 1 is not optional; the public listing page shows the version without
   the dashboard.
3. `npm run package` produces `cc-checker-<version>.zip` from a fresh build.
4. Upload the zip by hand in the developer dashboard.

## Project layout

```
index.html                 Vite entry for the extension page (loaded inside the injected iframe)
public/manifest.json       MV3 manifest, copied verbatim to build/
public/app/background.js   service worker — toolbar click, screenshot relay, error popup
public/app/content.js      content script — injects the iframe, runs the eyedropper loupe
public/error.html          popup shown when the page cannot host the checker
src/app.tsx                provider + Header + MainLayout(Score, ColorControls)
src/context.tsx            ColourContrastProvider / useColourContrast — all colour state
src/utils/color-utils.ts   chroma-js wrappers, hue normalisation, getLevel, roundTo
src/utils/copy-text.ts     execCommand copy with selection restore and a prompt on refusal
src/hooks/useTabbed.ts     WAI-ARIA tabs keyboard logic
src/components/            01-atoms … 04-layouts; each dir holds <name>.tsx (+ <name>.module.css when styled)
src/styles/                globals.css and the @value breakpoint/container/typography modules
test/e2e/                  Playwright fixtures + spec
build/                     gitignored output; what gets loaded unpacked and zipped for the store
```

Three execution contexts talk over `chrome.runtime` messages: the content script owns the DOM of
the host page, the service worker owns `captureVisibleTab` and the error popup, and the React app
lives in the iframe and owns state. State persists in the extension origin's `localStorage`.

## Browser support

Chrome and other Chromium browsers, Manifest V3. `browserslist` is `chrome >= 111`; the manifest
deliberately sets no `minimum_chrome_version`.

Safari (Safari Web Extensions) is a stated future goal and has not been started. Known gaps,
recorded so the first attempt does not rediscover them: `chrome.action.openPopup` is not
available; `web_accessible_resources[].use_dynamic_url` is Chromium-only; Safari packages
extensions through Xcode (`xcrun safari-web-extension-converter`); `captureVisibleTab` support and
`activeTab` semantics need re-verifying; and Safari prefers the `browser.*` namespace, so a shim
or polyfill is needed. Nothing in the code has been adapted for any of this yet.

## Contributing

Issues and pull requests are welcome. Please:

- report bugs and request features with the template in `.github/ISSUE_TEMPLATE/`
- fill in `PULL_REQUEST_TEMPLATE.md`; say whether you added tests
- run the pre-push suite above before opening the PR
- follow the commit format the history uses: `<type>: CC-<n> - <gitmoji> Description`, for
  example `fix: CC-002 - 🐛 Fix issue with rgb options being in wrong order`

[CLAUDE.md](CLAUDE.md) is the working agreement for this repo — Alex and Claude Code both work
from it — and `docs/` holds the longer material it points at (development, testing, review and
handoff). Alex merges every human PR; the one exception is a green Dependabot bump, which Claude Code may merge on his behalf (`docs/GIT.md` §Who merges). This project follows the Contributor Covenant,
see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

MIT — see [LICENSE](LICENSE).
