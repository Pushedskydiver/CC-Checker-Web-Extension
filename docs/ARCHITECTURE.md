# Architecture

Code-level architecture of the Colour Contrast Checker extension — the "what is built and how it
fits together" reference. It names things by file, not by ticket, so it stays accurate as work lands;
`PROGRESS.md` says where the current branch is. Written against the tree on 4 September 2026.

## The one decision everything follows from

**The checker is a web page the extension injects into the tab, not a popup.**

The manifest's `action` has a `default_title` and no `default_popup`. The toolbar click runs
`chrome.action.onClicked` in `public/app/background.js`, which sends `initChecker` to the tab;
`public/app/content.js` then appends a fixed-position `<iframe data-cc-checker>` to the bottom of the
viewport whose `src` is `chrome.runtime.getURL('index.html')` — the Vite-built React app under `src/`.

A popup could not do this job: it closes the moment the user clicks anywhere else, and the eyedropper
exists so the user can click on the page. The panel has to survive scrolling, resizing and clicking
while a loupe follows the mouse across the host document. Most of what is unusual about this codebase
follows from that:

1. **The iframe is cross-origin.** `chrome-extension://<id>/index.html` sits inside an `http(s)`
   document. Neither side can reach the other's DOM, so every interaction crosses the boundary as a
   `chrome.runtime` message.
2. **The service worker is a relay.** From the iframe, `chrome.runtime.sendMessage` reaches extension
   contexts, not content scripts, and the iframe has no tab id to address. The service worker sees
   `sender.tab` on every message from the iframe, so it forwards to that tab — and because it also
   sees `sender.tab.windowId`, it is the context that calls `captureVisibleTab`.
3. **The clipboard is restricted, and an `allow` attribute does not lift it.**
   `navigator.clipboard.writeText` is blocked inside the iframe with or without
   `allow="clipboard-write"`, because a bare feature name delegates the permission to the frame's
   `src` origin and `use_dynamic_url: true` makes that a per-session GUID that never matches the
   static origin the document loads with. `document.execCommand('copy')` does work there, which is
   why the copy buttons go through it — through `copyText` (`src/utils/copy-text.ts`) since
   13 September 2026, and `copy-to-clipboard` 3.3.3 before that.
   What a swap to the
   async API would actually require, and why it could only ever be an enhancement, is under
   [§Deliberately not changed](#deliberately-not-changed-and-what-was-not-ported).
4. **The panel is 475px tall, always.** `IFRAME_HEIGHT` in `content.js` fixes the iframe height and
   pads the host `body` by the same amount so nothing on the page is hidden underneath. The app inside
   is responsive to viewport width only; height is a constant the layout is designed against.

The iframe carries `z-index: 2147483647` and `referrerpolicy="no-referrer"`; the loupe wrapper sits at
`999999999`. Both are chosen to win against whatever the host page does.

## Execution contexts

| Context                 | File                                           | Runs where                                                                                | Can call                                                                                                                  |
| ----------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Content script          | `public/app/content.js`                        | Every `<all_urls>` page at `document_idle`; top frame only (`window.self === window.top`) | Host DOM, `chrome.runtime.sendMessage` / `onMessage` / `getURL`. No `chrome.tabs`, no `captureVisibleTab`                 |
| Service worker          | `public/app/background.js`                     | Extension background; event-driven, terminated when idle                                  | `chrome.action`, `chrome.tabs.sendMessage`, `chrome.tabs.captureVisibleTab`, `chrome.runtime.onMessage`. No DOM           |
| Extension page (the UI) | `index.html` → `src/index.tsx` → `src/app.tsx` | Inside the injected iframe, origin `chrome-extension://<id>`                              | Its own DOM, `localStorage` of the extension origin, `chrome.runtime.sendMessage` / `onMessage`. Cannot see the host page |
| Error popup             | `public/error.html`                            | `chrome.action` popup, bound to one tab for 500ms                                         | Nothing — static HTML, no script                                                                                          |

`content.js` and `background.js` are plain JavaScript copied verbatim from `public/`; ESLint lints them
but `tsconfig.json` only includes `src/**`, so they are not type-checked. Message type names are string
literals repeated in all three contexts — there is no shared constants module, so a rename is three
edits and a failing e2e run.

The top-frame guard is not optional. On 4 September 2026 the manifest still had `all_frames: true`,
and because the service worker addresses the tab rather than a frame, every embedded iframe grew its
own full checker (reproduced with the child iframe in the e2e test page). The guard and the manifest
change landed together; the e2e test "injects one iframe, the loupe canvas and styles into the top
frame only" holds the line.

## Message flows

Every message is `{ type, ... }` on `chrome.runtime.sendMessage` (to the service worker) or
`chrome.tabs.sendMessage` (from it). Two filters keep the relay honest:

- The service worker returns early when `sender.tab` is undefined — it only relays messages that came
  from a tab, i.e. the content script or the iframe embedded in it.
- The iframe handles only messages with `sender.tab` undefined, i.e. those the service worker relayed.
  The content script's `colorPicked` broadcast also arrives directly (`sender.tab` set) and is
  ignored. Before 4 September 2026 both copies were handled and every pick applied twice.

| Type               | Sender → receiver                                              | Payload                                                          | Effect                                                                                                           |
| ------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `initChecker`      | Service worker → content script                                | `{ message: 'clicked_browser_action', type }`                    | `initChecker()`: no-op if `[data-cc-checker]` exists, else `addIframe()` then `addCanvas()`                      |
| `closeChecker`     | Iframe → service worker → content script                       | `{ type }`                                                       | `closeChecker()`: `closeColorPicker()` first, then remove loupe, iframe and `<style data-cc-styles>`             |
| `getScreenshot`    | Iframe → service worker → content script                       | Out: `{ type, key }`; back: `{ type, key, data }` (PNG data URL) | `getScreenshot()`: store `key`, load image, show loupe, hide cursor, add mousemove/scroll/resize/click listeners |
| `updateScreenShot` | Content script → service worker → content script               | Out: `{ type }`; back: `{ type, key: undefined, data }`          | `updateImage()`: replace the image and show the loupe again                                                      |
| `colorPicked`      | Content script → service worker → iframe (direct copy ignored) | `{ type, key, rgb: [r, g, b] }`                                  | `handlePickedColor`: `handleContrastCheck(rgbToHsl(rgb), key)`, then send `closeColorPicker`                     |
| `closeColorPicker` | Iframe → service worker → content script                       | `{ type }`                                                       | `closeColorPicker()`: clear the scroll debounce, remove listeners, restore cursor, hide loupe                    |

All `tabs.sendMessage` calls in the service worker use the promise form with `.catch(() => undefined)`;
a tab that navigated or closed is not an error worth surfacing.

### Open and close

```
Alex          Chrome           background.js                content.js (top frame)      index.html (iframe)
 | click icon    |                   |                              |                           |
 |-------------->| action.onClicked  |                              |                           |
 |               |------------------>| isRestrictedUrl(tab.url)?    |                           |
 |               |                   |-- yes: showErrorPopup(tabId) |                           |
 |               |                   |-- no:  tabs.sendMessage(initChecker)                     |
 |               |                   |----------------------------->| addIframe(): <iframe src= |
 |               |                   |                              |  runtime.getURL(index.html)>
 |               |                   |                              |-------------------------->| React mounts,
 |               |                   |                              | addCanvas(): <style>,     | reads localStorage
 |               |                   |                              |  hidden loupe <div><canvas>
 |               |                   |  (sendMessage rejects: no listener → showErrorPopup)     |
 |               |                   |                              |                           |
 | click Close   |                   |                              |                           |
 |-------------------------------------------------------------------------------------------->|
 |               |                   |<---------------------------------------------------------| runtime.sendMessage
 |               |                   | tabs.sendMessage(closeChecker)                           |  (closeChecker)
 |               |                   |----------------------------->| closeColorPicker(), then  |
 |               |                   |                              | remove loupe, iframe, style
```

### Eyedropper pick, with scroll re-capture and Escape

```
index.html (iframe)                background.js                        content.js (top frame)
 | click "Pick background colour"     |                                      |
 | runtime.sendMessage                |                                      |
 |  (getScreenshot, key)              |                                      |
 |----------------------------------->| captureVisibleTab(sender.tab.windowId)
 |                                    |------------------------------------->| getScreenshot({key, data}):
 |                                    |                                      |  image.src = data, show loupe,
 |                                    |                                      |  cursor: none, add listeners
 |                                    |                                      | mousemove → draw 8×8 sample at
 |                                    |                                      |  (clientX, clientY) × devicePixelRatio
 |                                    |          (scroll or resize)          | hide loupe; 66ms debounce
 |                                    |<-------------------------------------| runtime.sendMessage(updateScreenShot)
 |                                    | captureVisibleTab                    |
 |                                    |------------------------------------->| updateImage({data}): show loupe
 |                                    |            (click on loupe)          | read pixel (3,3) → [r,g,b]
 |<-----------------------------------|<-------------------------------------| runtime.sendMessage(colorPicked)
 |  (direct copy: sender.tab set →    | relay: tabs.sendMessage(colorPicked) |
 |   ignored)                         |                                      |
 |<-----------------------------------|                                      |
 | handleContrastCheck(rgbToHsl, key) |                                      |
 | runtime.sendMessage(closeColorPicker)                                     |
 |----------------------------------->|------------------------------------->| closeColorPicker(): remove
 |                                    |                                      |  listeners, cursor: auto, hide
 | keyup Escape (listener on the      |                                      |
 |  iframe document, AbortController) |                                      |
 |----------------------------------->|------------------------------------->| closeColorPicker() — same path
```

Two details that are easy to lose: `devicePixelRatio` is read on every mousemove in `setCanvasData`,
because page zoom (and so the screenshot's scale) can change after the content script loaded; and
`closeChecker()` calls `closeColorPicker()` before it removes anything. Until 4 September 2026 it did
not, and a scroll after closing requested a fresh screenshot, which re-showed the loupe with no UI left
to dismiss it. The e2e test "closing the checker mid-pick tears the picker down" scrolls after closing
to prove the order.

## Permissions and resources

- **`permissions: ["activeTab"]` and nothing else.** No `tabs`, `storage`, `scripting` or host
  permissions. The content script is registered statically under `content_scripts` for `<all_urls>`.
- **`captureVisibleTab` needs the gesture.** `activeTab` is granted to a tab by a real toolbar click,
  and that grant is the only thing that makes `captureVisibleTab` legal here. Opening the checker any
  other way — including the way the e2e fixtures do — leaves the eyedropper unable to capture, which
  is why the picker tests run against a patched manifest (see "Testing seam"). The capture targets
  `sender.tab.windowId`, so it is the sender's window in every case.
- **`web_accessible_resources`** lists `index.html` and `fonts/avenir-next-variable.woff2` for
  `<all_urls>` with `use_dynamic_url: true`. `chrome.runtime.getURL('index.html')` returns a
  per-session GUID origin, which Chrome redirects to the static `chrome-extension://<id>/` origin; the
  page's own subresources (`/assets/*`, `/fonts/*`, `/images/*`, favicons) load from there, so only
  what the host document itself fetches needs listing. Verified on 4 September 2026: the favicons and
  the Buy Me a Coffee logo, neither listed, load with HTTP 200 inside the iframe. Do not "fix" that by
  listing everything.
- **Restricted URLs and the error popup.** `RESTRICTED_URL_PATTERNS` in `background.js` covers
  `chrome://`, `chrome-extension://`, `edge://`, `about:`, `data:`, `file://`, `view-source:`, both
  Chrome Web Store hosts and Edge Add-ons; a tab with no URL counts as restricted. On a match, or when
  `tabs.sendMessage(initChecker)` rejects because no content script is listening (a tab opened before
  install or update), `showErrorPopup(tabId)` binds `error.html` as the popup for that tab, schedules
  the unbind 500ms later, and only then calls `chrome.action.openPopup()` behind a `typeof` guard.
  Until 4 September 2026 the guard and the ordering were missing: on a Chromium without `openPopup`
  the synchronous `TypeError` fired before the reset timer was set and `error.html` stayed bound for
  good. The e2e test "registers and classifies restricted URLs" covers the classifier; nothing
  automated covers the popup itself.
- **No `minimum_chrome_version`**, deliberately. The build targets `chrome >= 111` via `browserslist`
  in `package.json`; that is where the floor lives.

## State

`src/context.tsx` owns all of it. `ColourContrastProvider` holds three pieces of state — `background`
and `foreground` as HSL `ColorTuple`s (`[h, s, l]`) and `colors`, the saved hex pairs — and derives
the rest on every render: `backgroundHex`/`foregroundHex` (`hslToHex`), `contrast`
(`chroma.contrast`), `level` (`getLevel`), `isPoorContrast` (`contrast < 3`) and `isBackgroundDark`
(`lab.l < 60`). Nothing derived is stored. The picked-colour listener is registered once (`useEffect`
with `[]`) and calls a `useEffectEvent`, so it always sees current state without re-subscribing.

`localStorage` of the extension origin is the store, written synchronously before each `setState`:

| Key          | Shape                                                                           | Default          |
| ------------ | ------------------------------------------------------------------------------- | ---------------- |
| `background` | JSON `[h, s, l]`                                                                | `#ffe66d` as HSL |
| `foreground` | JSON `[h, s, l]`                                                                | `#222222` as HSL |
| `colors`     | JSON array of `{ background, foreground }` hex strings, newest first, at most 5 | `[]`             |

`MAX_SAVED_COLORS` is 5 and `saveColors` refuses a duplicate pair. Reads are defensive:
`readStoredColor` falls back to the default for anything that is not a tuple of numbers-or-null and
maps `null` to `0`; `readStoredColors` drops entries that are not valid hex pairs. Neither throws
inside render.

**Hue normalisation.** chroma-js returns `NaN` for the hue of a grey, and `JSON.stringify` turns `NaN`
into `null` on the way to storage; `chroma.hsl(NaN, 0.5, l)` then collapses to a grey instead of the
red the user asked for. `toHslTuple` in `src/utils/color-utils.ts` normalises hue to `0` at every
boundary where a tuple is created (`colorToHsl`, `rgbToHsl`), and `readStoredColor` does the same for
a stored `null`. The rule — sanitise at creation, never patch state in an effect — comes from
4 September 2026, when an effect was mutating `foreground[0] = NaN` in place and saturating a grey
rendered `#111111` instead of `#331111`. The e2e test "changing saturation on a grey keeps hue 0
(no NaN hue)" guards it.

**The `globals.css` coupling.** `DEFAULT_BACKGROUND` (`#ffe66d`) and `DEFAULT_FOREGROUND` (`#222222`)
in `context.tsx` must equal `--background-color` and `--foreground-color` on `:root` in
`src/styles/globals.css`; `public/error.html` hard-codes the same pair. Nothing links them: the first
paint uses the CSS values until the provider's effect writes the current hex pair onto
`document.body.style`, so a mismatch shows as a flash. The e2e test "renders with defaults, real font,
and consistent first-run colours" checks the background input and the computed custom property agree.

**Grades.** `getLevel` grades AAA at `>= 7`, AA and AAA Large at `>= 4.5`, AA Large at `>= 3`,
matching WCAG's "at least". It used `>` until 18 September 2026, so a ratio of exactly 3.0 failed
AA Large where the spec passes it; no 8-bit colour pair reaches an exact boundary, so the fix
changed nothing the panel can display.

## Build pipeline

```bash
npm run build     # vite build → build/
npm run watch     # rebuild on save; then reload the tab the checker is open on
npm run package   # build, then zip build/ to cc-checker-<version>.zip, dotfiles excluded
```

There is no dev server script: the app calls `chrome.*` on mount, so it is only meaningful loaded as
an unpacked extension from `build/`.

```
build/
  manifest.json            copied verbatim from public/
  app/background.js        copied verbatim — not bundled, not type-checked
  app/content.js           copied verbatim
  error.html               copied verbatim
  favicons/ fonts/ images/ copied verbatim
  index.html               Vite-transformed entry; script and stylesheet tags rewritten to /assets/*
  assets/index-<hash>.js   everything under src/ plus its node_modules imports, one chunk
  assets/index-<hash>.css  every CSS Module plus globals.css, one file
```

- **One script, one stylesheet.** `build.modulePreload: false` and
  `rolldownOptions.output.codeSplitting: false` in `vite.config.ts`. The page loads once inside the
  iframe; there is nothing to lazy-load. Vite 8 is rolldown-based, hence `rolldownOptions`.
- **`stripDotfiles`.** Vite copies `public/` verbatim, dotfiles included, so a `.DS_Store` Finder drops
  there would ship inside the store package. The plugin deletes any dotfile under `build/` at
  `closeBundle`; `npm run package` excludes them again at zip time.
- **`~` → `src`.** `resolve.alias` in `vite.config.ts` and `paths` in `tsconfig.json` must agree.
- **PostCSS is inline in `vite.config.ts`**: `postcss-preset-env` (stage 3, `nesting-rules: true`,
  `custom-properties: false`, autoprefixer with `flexbox: false`, targets from `browserslist` =
  `chrome >= 111`), then `postcss-sort-media-queries` with its default `mobile-first` sort. When the
  config was inlined, a custom comparator `(a, b) => b.localeCompare(a)` went in with it and sorted
  `(width>=992px)` before `(width>=768px)`, so the three-column layout in
  `src/components/04-layouts/main-layout/main-layout.module.css` never applied. The previous config's
  `b - a` returned `NaN` on strings and had been a silent no-op — a "type-satisfying" rewrite of a
  no-op changed behaviour. Fixed 4 September 2026 by using the plugin default. After touching PostCSS,
  read the emitted `build/assets/index-*.css`: the sort runs per source file, so the guarantee is
  ascending order within each module, and that module's queries now emit as
  `(768px<=width<=991px)`, `(width>=768px)`, `(width>=992px)`.
- **The `from` warning is benign.** `A PostCSS plugin did not pass the 'from' option` comes from Vite's
  bundled postcss-modules re-parsing files pulled in by cross-file `composes: x from '<file>'`, not
  from the inline plugins.
- **TypeScript 7 checks, TypeScript 6 serves ESLint.** `tsc` is the native (Go) 7.0 compiler installed
  under the alias `@typescript/native`; `typescript` resolves to `npm:@typescript/typescript6` (bin
  `tsc6`) purely so typescript-eslint has a JS API — the TypeScript team's documented side-by-side
  layout. `tsconfig.json` covers `src/**` with `types: ["chrome", "vite/client"]`; `tsconfig.node.json`
  extends it for `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts` and `test/**` with `types: ["node", "chrome"]`.
  Vite strips types without checking them, so `npm run lint:ts` (both configs, `--noEmit`) is the only
  type gate; `erasableSyntaxOnly` and `verbatimModuleSyntax` keep the source strippable.
- **A green build on a Mac is not evidence.** On 4 September 2026 the Git index tracked `01-Atoms/`,
  `02-Molecules/`, `Icon/`, `Ratio/` and `Header/` while the disk and every import used lowercase.
  macOS's case-insensitive filesystem plus `core.ignorecase=true` hid it; a fresh clone on Linux could
  not build (`UNRESOLVED_IMPORT` plus 21 TS2307 errors, reproduced on a case-sensitive APFS image).
  Fixed by re-indexing `src/components` and setting `core.ignorecase=false`. CI on Linux is the gate
  for a case-sensitive checkout; nothing local is.

## Styling

- **CSS Modules**, one `<name>.module.css` beside each `<name>.tsx`, camelCase classes (`.badgeDark`).
  Cross-file `composes` appears three times (`composes: container from containers` in the main layout
  and header, `typography from type` in `text`).
- **Breakpoints are `@value` tokens** in `src/styles/modules/breakpoints.module.css` — `--bp-tiny`
  375px, `--bp-small` 640px, `--bp-medium` 768px, `--bp-large` 992px, `--bp-extra_large` 1440px, each
  with a `_max` twin one pixel below — imported per module and used with range syntax:

    ```css
    @value --bp-medium, --bp-large from --breakpoints;
    @media (width >= --bp-medium) { … }
    ```

    Because the panel is full-width these are viewport widths: the main layout is one column, two from
    `--bp-medium`, three (`2.75fr 2fr 2fr`) from `--bp-large`.

- **Logical properties are enforced** by `stylelint-use-logical` (`csstools/use-logical` in
  `stylelint.config.mjs`): `margin-block`, `inline-size`, `padding-inline`, never `margin-top` or
  `width`; `declaration-no-important` is on too. The CSS the content script injects is a template
  literal in `content.js`, outside stylelint's reach, and uses physical `bottom`, `left`, `width` and
  `!important` on purpose to beat the host page's own styles.
- **Theming is two custom properties.** `--background-color` and `--foreground-color` are defined on
  `:root` in `globals.css` and overwritten on `document.body.style` by the provider effect. `body`,
  `::selection` and every component that paints a colour read them; there is no theme object in JavaScript. Changing the
  colours is the theme. The `body` transition runs only under `prefers-reduced-motion: no-preference`.
- **The poor-contrast switch.** Below a ratio of 3 the panel's own controls would vanish against its
  background, so twelve components read `isPoorContrast` and `isBackgroundDark` and swap to a
  black-or-white variant — `.badgeDark`/`.badgeLight` in `badge.module.css`,
  `.tooltipDark`/`.tooltipLight` in `copy-cta.module.css`, and their equivalents in the CTAs, inputs,
  swatches, ratio, tabs, skip link and header. All fifteen sites (thirty branches) are pinned by one e2e test since
  22 September 2026 (`docs/TESTING.md`, "poor contrast turns every themed control…"), which reads the
  resolved colour of each overridden custom property rather than class names or spellings, so it
  survives the variant moving into CSS.
- **Type.** Avenir Next as a variable font, declared with `font-weight: 100 900` and
  `font-display: swap` in an inline `<style>` in `index.html` (and again in `public/error.html`), and
  weighted through `font-variation-settings: 'wght'`. `html { font-size: 10px }` makes the rem scale
  base-10, so `1.6rem` is 16px.

## Testing seam

Everything that needs a browser or `chrome.*` is a Playwright end-to-end test in `test/e2e/`
(`fixtures.ts`, `extension.spec.ts`), configured by `playwright.config.ts`: 21 tests, 4 workers
locally and 2 in CI, one retry in CI, traces kept on failure. The pure functions in `src/utils/` have
Vitest unit tests instead (`docs/TESTING.md` §Unit tests).

```bash
npm run build && npm run test:e2e   # or: npm test
npx playwright install chromium     # once per machine, and again after a @playwright/test bump
```

- **It loads the real build.** `extensionDir` throws if `build/manifest.json` is missing, then
  `chromium.launchPersistentContext` starts new headless Chromium (`channel: 'chromium'`) with
  `--disable-extensions-except` and `--load-extension`. The suite drives the actual content script →
  service worker → iframe path, not a mock of it.
- **It serves its own page.** A local `http.createServer` on `127.0.0.1` returns three coloured blocks
  (for the picker), a child iframe (to prove top-frame-only injection) and 1500px of filler (to prove
  scroll re-capture).
- **`openChecker` fakes the toolbar click** by evaluating `chrome.tabs.sendMessage(activeTab,
{ type: 'initChecker' })` inside the service worker, then waits for `iframe[data-cc-checker]` and
  for `#ratio` inside it. `chrome.action.onClicked` never fires, so `activeTab` is never granted.
- **Why the patched manifest.** Playwright cannot click the toolbar, and without the gesture
  `captureVisibleTab` is refused. The `patched` fixture option — `test.use({ patched: true })` on the
  "colour picker (needs captureVisibleTab)" describe block — copies `build/` to a temp directory and
  adds `host_permissions: ["<all_urls>"]` to that copy's manifest. The shipped manifest is untouched
  and the copy is made and deleted afresh for each test in the block.
- **The seam the app exposes** is a set of stable hooks `readAppState` and the spec depend on:
  `#ratio`, `#grades li` (graded by `aria-label`), `input#background`, `input#foreground`, the
  computed `--background-color`/`--foreground-color` on the iframe body, and on the host page
  `[data-cc-checker]`, `[data-cc-canvas-wrapper]` and `[data-cc-styles]`. Renaming any of them fails
  the suite, which is the point. `setRange` drives React-controlled range inputs through the native
  value setter plus an `input` event, the way a user would.
- **Not covered:** a real toolbar click and `activeTab` grant, the error popup UI, incognito windows,
  the clipboard's failure path (a host page revoking the copy command), the Web Store package,
  Safari. The share button's clipboard value _is_ asserted, since 12 September 2026.

## Safari and other browsers

Safari support (Safari Web Extensions) is the stated future goal. Nothing in the code has been adapted
for it, and none of the following has been tried:

- `chrome.action.openPopup` is not available. `showErrorPopup` already guards it with `typeof`, so the
  failure mode is a popup bound for 500ms rather than an exception, but that path has not been
  exercised there.
- `web_accessible_resources[].use_dynamic_url` is Chromium-only; the iframe URL and the static-origin
  subresource behaviour above must be re-verified.
- Safari packages extensions through Xcode (`xcrun safari-web-extension-converter`); there is no
  script for it.
- `chrome.tabs.captureVisibleTab` support and `activeTab` semantics must be re-verified — the whole
  eyedropper rests on both.
- Safari prefers the `browser.*` namespace. All three contexts call `chrome.*` directly (the two plain
  scripts, and `src/` via `@types/chrome`); a `globalThis.browser ?? chrome` shim or a polyfill would
  be the first change.

Edge is Chromium and loads the same zip; the restricted-URL list already includes `edge://` and Edge
Add-ons. Firefox is not a target and nothing has been checked against it.

## Deliberately not changed, and what was not ported

Kept on purpose during the Vite migration, each with the condition that would reopen it:

- `document.execCommand('copy')` rather than `navigator.clipboard.writeText` — kept because the
  synchronous path works in this cross-origin iframe and the async one does not. Until
  12 September 2026 this bullet gave the re-entry condition as "the iframe is created with
  `allow="clipboard-write"` and the async clipboard API is verified in a real cross-origin frame".
  That could never be met, and the correction is below rather than struck through because this is a
  rule document, not a handoff surface. Measured across five iframe variants against the repo's own
  fixtures: a bare `allow="clipboard-write"` left `featurePolicy.allowsFeature('clipboard-write')`
  false and `writeText` throwing `NotAllowedError`, identical to shipping no attribute at all, for
  the `use_dynamic_url` reason in §The one decision everything follows from. Removing
  `use_dynamic_url` made that same attribute work, which is the isolation that proves the cause.
  Only `allow="clipboard-write *"` or the explicit
  `allow="clipboard-write chrome-extension://${chrome.runtime.id}"` grant it. Even then a host page
  sending `Permissions-Policy: clipboard-write=()` revokes it, while `execCommand('copy')` kept
  working on that same page in the same run — so on `<all_urls>`, with no rollback between a bad
  upload and the next store review, the async API could only ever be an enhancement that keeps the
  `execCommand` path. Do not feature-detect it with
  `navigator.permissions.query({ name: 'clipboard-write' })`: that reported `granted` in all eight
  runs, including every blocked one.
  **Nor behind a `try`/`catch`.** On 13 September 2026 that enhancement arrived unasked as
  `copy-to-clipboard` 4.x, which wraps `writeText` in a `try` and falls back to `execCommand`.
  Copying still worked — in the suite's Chromium, throwaway specs (not kept) saw `writeText` throw
  `NotAllowedError` and `execCommand('copy')` return `true` — but the attempt alone made that
  Chromium log `Permissions policy violation: The Clipboard API has been blocked…` as a
  `console.error` in the panel on every copy click, received by the suite's `console` listener on
  the host page. (Whether real Chrome's DevTools show it against the host page was not checked.) So
  the path 3.3.3 used was ported into `src/utils/copy-text.ts`, the dependency was removed, and
  nothing on the copy path calls `navigator.clipboard`, not even inside a `try`. Re-entry, untested:
  an attempt gated by `document.featurePolicy.allowsFeature('clipboard-write')` and observed to log
  nothing — Chromium-only, since Safari has no `featurePolicy`.
- `activeTab`-only permissions — until a feature genuinely needs `tabs`, `storage` or host
  permissions; each widens the install warning.
- The fixed 475px panel — until a resizable or dockable panel is designed; the host body padding and
  the layout both assume the constant.
- `localStorage` as the store — until state must survive across browsers or profiles
  (`chrome.storage.sync` would be the trade, and a new permission).
- No `minimum_chrome_version` — until a runtime API the code depends on is missing from a version
  `browserslist` still admits.

From the source repos' architecture docs, not ported: the package graph and
`eslint-plugin-boundaries` (one package, no boundaries to enforce — revisit if `public/app/*.js` moves
into `src/` with shared message constants), and the transports, packs, process-topology and
model-client sections (no equivalent in an extension).

## Related docs

- `README.md` — what the extension does, for users
- `docs/DEVELOPMENT.md` — setup, the pre-push gates, loading unpacked, releasing, §Not ported
- `docs/SELF-REVIEW.md` — the pre-PR checklist
- `PROGRESS.md` and `docs/history/SESSIONS.md` — session handoff, living state and archive
- `CLAUDE.md` — the collaboration contract and the review-trigger table
- `.claude/agents/` — `da-review`, `copilot-surrogate`, `spec-grill`
