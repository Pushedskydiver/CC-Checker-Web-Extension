# Testing

One suite, one command. `test/e2e/extension.spec.ts` (20 tests, Playwright Test) loads the built
extension from `build/` into a headless Chromium profile and drives it through the real content
script → service worker → iframe message flow. `test/e2e/fixtures.ts` is the harness and the
primary source for how it works — read its `Fixtures` type and two doc comments (lines 28–43)
first; `playwright.config.ts` holds the timings. There are no unit tests. The suite was written
on 4 September 2026 alongside the fixes it guards and is green as of that date (18 passed, 7.3s).

**Adapted from nas-stacks' and moe's `docs/TESTING.md`.** Dropped wholesale, because this repo has
no equivalent and inventing one would be dishonest: the mutation gate and its control-run rules,
the unit/integration/E2E layering, coverage thresholds, fast-check, typed mock fetchers, and the
sandboxed shell-stub suites. What survived is the part that was never about the stack — how to
write a test that can actually fail, and how to state what a green run does not prove.

---

## Commands

```bash
npx playwright install chromium   # once per machine, and again after a @playwright/test bump
npm test                                                      # build, then the suite
npm run test:e2e                                              # the suite against the existing build/
npx playwright test -g "NaN hue"                              # one test, matched on its title
npx playwright show-trace test-results/<test-dir>/trace.zip   # replay a failed test
```

- `npm run test:e2e` needs a `build/`: the `extensionDir` fixture throws
  ``No built extension at … — run `npm run build` first`` rather than load a missing
  directory (a stale `build/` is not detected). `npm test` is `npm run build && playwright test`,
  the order CI uses.
- Traces are `retain-on-failure`, so `test-results/` (gitignored) only holds traces after a red
  run (a green run leaves just `.last-run.json`). CI uploads it as the `playwright-test-results`
  artefact on failure.
- `--headed` is accepted by the CLI but does nothing here: the `context` fixture passes a literal
  `headless: true` to `chromium.launchPersistentContext` (`test/e2e/fixtures.ts` line 87), and
  the flag only reaches Playwright's built-in fixtures. To watch a run, flip that literal locally
  and do not commit it.
- CI (`.github/workflows/ci.yml`, job `quality`) runs `npm ci`, `npm run lint`, `npm run build`,
  `npx playwright install --with-deps chromium`, `npm run test:e2e` on `ubuntu-latest`. Its
  display name `Lint, build, e2e` has been a required status check on `main` since 11 September
  2026; its first run (PR #28) was green: lint, build, 18/18 e2e in 56 s.

The pre-push gate is `npm run lint && npm run build && npm run test:e2e`, green locally before every
push. Only CI proves the case-sensitive checkout — on 4 September 2026 the Git index tracked
`01-Atoms/`, `02-Molecules/`, `Icon/`, `Ratio/` and `Header/` in the wrong case, every build on
Alex's Mac was green, and a Linux clone could not resolve the imports into them — so a local green
is necessary, not sufficient.

---

## What the suite is

Playwright Test, one project, one spec file. Every test gets its own persistent Chromium profile
(`fs.mkdtempSync` → `cc-ext-profile-*`) launched with `--load-extension=<dir>` and
`--disable-extensions-except=<dir>`, and `channel: 'chromium'` — the full Chromium build in its
new headless mode. The default `chromium-headless-shell` cannot load extensions at all, which is
why the channel is pinned and why `npx playwright install chromium` is a prerequisite (once per machine, and
again after each `@playwright/test` bump — 1.63 wanted a Chromium build the 1.62 cache did not have).

Each test also gets its own loopback HTTP server serving `TEST_PAGE`: three 120px blocks
(`#red`, `#green`, `#blue`), a child `<iframe src="/child">`, and 1500px of filler so the page
scrolls. That page is the only thing the extension ever runs against in tests.

The fixtures, in dependency order:

| Fixture           | What it provides                                                                                                                                                                                                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `patched`         | Option, default `false`. `test.use({ patched: true })` switches a `describe` block to the patched manifest below.                                                                                                                                                                                                                        |
| `extensionDir`    | `build/` as-is, or — when `patched` — a temp copy of `build/` whose `manifest.json` gains `host_permissions: ["<all_urls>"]`. Throws if `build/manifest.json` is missing. Removes the copy afterwards.                                                                                                                                   |
| `serverUrl`       | `http://127.0.0.1:<port>/` for a `node:http` server bound to port 0. Serves `CHILD_PAGE` at `/child`, `TEST_PAGE` everywhere else. Teardown calls `closeAllConnections()` before `close()` — see Flakiness and timing.                                                                                                                   |
| `context`         | The persistent context above. Closed and its profile directory deleted after the test.                                                                                                                                                                                                                                                   |
| `serviceWorker`   | The extension's service worker: whichever is already registered on the context, else the first `serviceworker` event (15s cap). Tests `evaluate()` inside it to call `chrome.*` as the extension.                                                                                                                                        |
| `extensionId`     | The host of the worker's URL — the `chrome-extension://<id>` origin the iframe will load from.                                                                                                                                                                                                                                           |
| `page`            | The context's first page navigated to `serverUrl`, then a 300ms wait for the `document_idle` content script to register its listener.                                                                                                                                                                                                    |
| `sendToActiveTab` | `(message) => { lastError }` — runs `chrome.tabs.query({ active: true })` in the worker and `chrome.tabs.sendMessage` to that tab, resolving with `chrome.runtime.lastError?.message ?? null` so a missing content script is a value, not a hang.                                                                                        |
| `openChecker`     | Stands in for the toolbar click: sends `{ message: 'clicked_browser_action', type: 'initChecker' }` (the shape `background.js` sends) via `sendToActiveTab`, waits for exactly one `iframe[data-cc-checker]`, polls `page.frames()` until one starts with `chrome-extension://<id>/index.html`, waits for `#ratio`, returns the `Frame`. |

Two helpers sit beside them. `readAppState(frame)` snapshots `#ratio`, both hex inputs, the
`--background-color` / `--foreground-color` body variables, the `#grades li` aria-labels and
whether `Avenir Next` is loaded, so a test can assert on the whole visible state in one
`toEqual`. `setRange(frame, selector, value)` is explained under Writing tests here.

### Why the picker tests use a patched manifest, and why that is honest

The shipped manifest asks for `activeTab` only, so `chrome.tabs.captureVisibleTab` — which the
eyedropper needs — is granted only after a real click on the toolbar icon for that tab, and
Playwright cannot click the toolbar. The `colour picker (needs captureVisibleTab)` block therefore
uses `patched: true`: a copy of `build/` whose manifest adds `host_permissions: ["<all_urls>"]`,
which grants capture without the click. This is not a cheat because it changes nothing the tests
assert on: the content script, the relay, the loupe, the pixel read and the `colorPicked` path are
the shipped code byte for byte; only the permission that lets the screenshot happen is widened.
What it does mean is that the `activeTab` grant itself is never exercised — listed below under
what is not tested, not hidden behind the green.

---

## What each test proves

Titles are the spec's own (`npx playwright test --list`). Where a test guards a specific fix, the
fix is named with its date so the reason it exists does not evaporate.

| Group          | Test                                                                        | What it proves                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| service worker | registers and classifies restricted URLs                                    | The worker is `/app/background.js`; `isRestrictedUrl` is true for `chrome://`, `chrome-extension://`, the Web Store, `file://`, `about:` and `undefined`, false for `https://`. The routing that decides popup vs `initChecker`.                                                                                                                                                                                                                                                  |
| content script | injects one iframe, the loupe canvas and styles into the top frame only     | Exactly one 475px `iframe[data-cc-checker]`, one loupe canvas, one `style[data-cc-styles]`, 475px body padding — and none of it in the child iframe. Guards the `all_frames` regression fixed 4 September 2026.                                                                                                                                                                                                                                                                   |
| content script | a second initChecker is a no-op                                             | A repeat `initChecker` leaves one iframe. The `querySelector('[data-cc-checker]')` guard in `initChecker()`.                                                                                                                                                                                                                                                                                                                                                                      |
| content script | close removes the iframe, styles and loupe; reopen restores persisted state | Close button removes iframe, style, loupe, padding, cursor; reopening shows the `#123456` typed before close. `closeChecker` teardown plus `localStorage` persistence.                                                                                                                                                                                                                                                                                                            |
| app            | renders with defaults, real font, and consistent first-run colours          | `h1`, ratio `12.72`, four `Pass` grades, `Avenir Next` loaded, and `input#background` equals the CSS variable — `DEFAULT_BACKGROUND` in `src/context.tsx` and `--background-color` in `src/styles/globals.css` in sync.                                                                                                                                                                                                                                                           |
| app            | typing hex values updates the ratio, grades and CSS variables               | `#000000` → `1.32` and all `Fail`; `#ffffff` → `15.91` and all `Pass`; the body variable follows. Contrast and grades are derived on every render, not stored.                                                                                                                                                                                                                                                                                                                    |
| app            | Reverse Colours swaps background and foreground                             | Both inputs and both CSS variables swap on one click.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| app            | tabs follow the WAI-ARIA pattern: selection, aria-controls, arrow keys wrap | Two tabs, `aria-selected`, `aria-controls="panel-rgb-background"`, click selects, `ArrowRight` off the end wraps to the first, `ArrowLeft` off the start wraps to the last. Guards the tabs fix of 4 September 2026.                                                                                                                                                                                                                                                              |
| app            | HSL sliders reach their endpoints and drive the hex                         | Lightness `1` gives `#ffffff` and `0` gives `#000000`, not `#fefefe`. Guards the missing-`min` fix in `RangeInput`, 4 September 2026.                                                                                                                                                                                                                                                                                                                                             |
| app            | changing saturation on a grey keeps hue 0 (no NaN hue)                      | `#222222` at saturation `0.5` is `#331111`, not `#111111`. Guards the NaN-hue fix (`toHslTuple` in `src/utils/color-utils.ts`), 4 September 2026.                                                                                                                                                                                                                                                                                                                                 |
| app            | RGB sliders drive the hex                                                   | Red `255` on `#000000` gives `#ff0000` — the RGB channel order (`3043249`, "rgb options being in wrong order").                                                                                                                                                                                                                                                                                                                                                                   |
| app            | Save colours adds a swatch once and caps at five                            | Saving the same pair twice yields one `li`; six more distinct saves yield five. The locator is `ul[aria-label="Saved colours"] li`, so it also guards the missing-`<li>` fix of 4 September 2026.                                                                                                                                                                                                                                                                                 |
| app            | copy and share buttons announce their result to assistive tech              | Clicking Generate share URL shows a `role="status"` region containing `URL added to clipboard`. Guards the `aria-hidden` confirmation regression fixed 4 September 2026.                                                                                                                                                                                                                                                                                                          |
| app            | the share button puts the share URL on the real clipboard                   | `navigator.clipboard.readText()` on the host page equals `https://colourcontrast.cc/?background=ffe66d&foreground=222222` after a real click. The suite's first clipboard assertion. It proves the success path only — it passes with the guard in `copy-cta.tsx` deleted, and on `main` before the guard existed; the row below is the one that guards it. `grantPermissions` is applied to the host origin, because it rejects the panel's opaque `chrome-extension://` origin. |
| app            | a refused copy announces nothing                                            | With `document.execCommand` stubbed to return false inside the panel, a real click leaves all three `role="status"` regions empty and raises one `prompt` dialog. Red without the guard on `copy()`'s return value, green with it (12 September 2026). Reads the attribute rather than the role, because an empty tooltip is hidden and `getByRole('status')` would pass vacuously.                                                                                               |
| app            | skip links target real, focusable ids                                       | Every `a[href^="#"]` in the app points at an element that exists and is focusable — `#ratio` and `#grades` carry `tabIndex={-1}` since 4 September 2026.                                                                                                                                                                                                                                                                                                                          |
| app            | no console errors, page errors, or failed requests while driving the UI     | Fill, reverse and save with `console`, `pageerror` and `requestfailed` listeners attached; the list is empty. The test that would catch a subresource failing to load from the extension origin.                                                                                                                                                                                                                                                                                  |
| colour picker  | picks a colour from the page and closes the loupe                           | Loupe visible and cursor `none` during a pick; clicking `#red` sets `#ff0000`; loupe hidden, cursor `auto`; the worker saw exactly **one** `closeColorPicker`. Guards `colorPicked` being handled twice, fixed 4 September 2026.                                                                                                                                                                                                                                                  |
| colour picker  | Escape cancels a pick                                                       | `Escape` in the frame hides the loupe.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| colour picker  | closing the checker mid-pick tears the picker down                          | Close during a pick, then scroll: no loupe reappears and the cursor is `auto`. Guards the live-listener bug (scroll → screenshot → loupe with no way out) fixed 4 September 2026.                                                                                                                                                                                                                                                                                                 |

---

## What is not tested, stated rather than implied

Go and look. None of the below is covered, and the absence of a red check is not evidence about any
of them:

- **A real toolbar click and the `activeTab` grant.** The patched manifest sidesteps it. That the
  shipped manifest can capture a screenshot after a click has only ever been checked by hand.
- **The error popup UI.** `isRestrictedUrl` is tested; `showErrorPopup` — binding `error.html` to
  the tab, `chrome.action.openPopup()`, the 500ms unbind — is not. Playwright cannot open a popup.
- **Incognito.** The `sender.tab` relay-only handling in `src/context.tsx` exists for incognito
  windows; the suite runs in a normal profile.
- **The hex-copy button's clipboard value.** The share button's is asserted, and so is the refused
  copy, both since 12 September 2026. The `CopyCta` inside `TextInput` is not: it is the same
  component with a different `value`, so the risk is low, but it is untested. Note the refused-copy
  test reaches its case by stubbing `document.execCommand` — a real refusal cause would be an
  enterprise clipboard policy or a browser that does not implement the command (Safari, the stated
  next target). **Not** `Permissions-Policy`: that governs `navigator.clipboard`, and the
  `execCommand` path works in this iframe with no `allow` attribute at all.
- **The Web Store package.** `npm run package` and what the store accepts are checked by hand.
- **Safari.** Nothing has been adapted for it and nothing runs it.
- **Unit-level colour maths.** `getLevel`, `roundTo`, `toHslTuple` and the chroma wrappers are only
  exercised through the UI at the handful of values the spec types in; a boundary such as
  `getLevel`'s strict `> 3` for AA Large has no test of its own.
- **Visual regression.** No screenshots are compared; layout — including the 3-column desktop grid
  whose media-query order broke on this branch — is only proven not to throw.

---

## Writing tests here

### Vertical-slice TDD, and the failing test first

One test → implement until it passes → next test. A slice is vertical when it crosses from a user
action to a visible outcome for one case — "saturating a grey gives `#331111`", not "every branch
of `toHslTuple` has a stub". Never write the whole spec first and then the code: tests written in
bulk test imagined behaviour.

When the behaviour under change is a bug, the first slice is the reproduction, and it must be red
before the fix. The fixes of 4 September 2026 in the table above were done this way: the NaN-hue,
slider-endpoint, top-frame, live-region and single-`closeColorPicker` tests were written against
the intended behaviour, failed against the code as it stood, and went green with the fix. A test
that passes on its first run against the unfixed code has not reproduced anything.

The hand version of a mutation check is the self-check: revert the line the test names, run
`npx playwright test -g "<title>"`, watch it redden, restore. If it stays green the test is
hollow. There is no mechanical gate for this here — see Future.

### Drive the real DOM through the frame

Tests talk to the app through the `Frame` that `openChecker` returns and to the host page through
`page`; nothing imports from `src/`. Setup is what a user does — `frame.fill('input#background',
'#808080')`, a click on a tab, a real `page.mouse.click` on `#red` — and the observation is what a
user or a screen reader would see. The one carve-out is `serviceWorker.evaluate`, used to call
`isRestrictedUrl` and to count `closeColorPicker` messages: the worker has no DOM, and there the
interaction is the contract.

### `setRange` for React-controlled range inputs

React instruments the `value` property on every controlled input's element instance with its own
tracker: an assignment is recorded as the current value before it reaches the DOM, so when the
`input` event arrives React compares tracked and actual, sees no difference, and never calls
`onChange`. Verified on 4 September 2026 with a scratch test: `el.value = '1'` plus a bubbling
`input` event from `frame.evaluate` moved the lightness slider to `1` and left the hex at
`#808080`. `setRange` in `test/e2e/fixtures.ts` calls the `HTMLInputElement.prototype` `value`
setter instead — which the tracker does not see — then dispatches `input`; the same scratch test
got `#000000` from `setRange(frame, 'input#backgroundLightness', '0')`.

Playwright's own `fill()` happens to work on these sliders too (also verified that day), because
its injected script runs in an isolated world where React's instance override does not exist.
The suite still standardises on `setRange`: it names the mechanism in one place, it is the only
form that works from inside `frame.evaluate`, and `fill` on a `range` trims the value and throws
`Malformed value` if the browser snaps it to a step. Use `setRange` for every slider and `fill`
for the hex text inputs.

### Prefer role and name locators

`getByRole('button', { name: 'Reverse Colours' })`, `getByRole('status')`,
`ul[aria-label="Saved colours"] li`. A locator built from the accessible name fails when the
accessibility regresses — exactly the class of bug (the `aria-hidden` confirmation, the swatches
without `<li>`) that this branch found by hand. Ids (`#ratio`, `input#background`) are acceptable
where they are the app's own stable contract, such as skip-link targets.

### Every assertion on a visible outcome; no snapshot tests

Assert on the ratio text, the input value, the CSS variable, the aria attribute, the loupe's
visibility, the cursor — things an operator could see. Never on a component's internals, and never
on a serialised DOM: a snapshot of the checker would break on every style change and be approved
without being read. `readAppState` exists so a whole-state assertion is still a list of named,
readable fields.

### Keep tests independent

Every test gets a fresh profile, a fresh server, a fresh page. That is deliberately expensive
(most of each test's 1.1–2.0s is Chromium launch) because the app persists to `localStorage` and
the "reopen restores persisted state" test depends on that persistence — a shared profile would
make test order a hidden input. Never share a context across tests to save time.

---

## Flakiness and timing

- `playwright.config.ts`: `timeout: 30_000` per test, `expect.timeout: 5_000`,
  `fullyParallel: true`, `workers` 4 locally and 2 in CI, `retries` 0 locally and 1 in CI. A
  retry hides a flaky test behind a green run; the `list` reporter still prints the retried
  attempt, so treat a retried pass as a finding, not a pass.
- **`waitForFunction` and auto-waiting `expect` over sleeps.** Waiting for the iframe to go
  (`page.waitForFunction(() => !document.querySelector('iframe[data-cc-checker]'))`) or for a
  value (`toHaveValue`, `toBeHidden`) is bounded by the timeout and exits the moment the condition
  holds. The remaining `waitForTimeout` calls are the honest exceptions: 300ms after `goto` for
  the `document_idle` content script, 300ms after a second `initChecker` to prove nothing
  happened, 300ms before the no-errors test reads its listeners, 400ms after a scroll to prove
  the loupe did not return; `openChecker` also polls `page.frames()` in 50ms steps. A negative
  cannot be waited for; keep those sleeps short and name what they are for.
- **`server.closeAllConnections()` before `server.close()`.** Chromium keeps its sockets to the
  loopback server alive, and `http.Server#close()` waits for every connection to end. Without the
  `closeAllConnections()` call the `serverUrl` teardown holds the test open until the 30s timeout —
  every assertion passes and the test still fails, as the comment on that fixture records. Any
  fixture that opens a listener owes the same teardown.
- The 15s cap on `serviceWorker` and the 10s caps in `openChecker` are startup budgets, not
  assertion budgets; a test that needs them is a startup problem, not a slow assertion.

---

## Baselines, for drift detection

Bump these in the same commit as the intentional growth. A drop without an intentional change is
a red flag.

| Suite                        | Count    | Time                                 | Command                                    | Measured          |
| ---------------------------- | -------- | ------------------------------------ | ------------------------------------------ | ----------------- |
| `test/e2e/extension.spec.ts` | 20 tests | 8.2s locally, 4 workers (three runs) | `npm run test:e2e` (after `npm run build`) | 12 September 2026 |

Groups: 1 service worker, 3 content script, 13 app, 3 colour picker (patched manifest).

---

## Future

- **Unit tests for `src/utils/color-utils.ts` with Vitest.** The pure functions — `getLevel`,
  `roundTo`, `colorToHsl` / `rgbToHsl` (and through them `toHslTuple`), `isDark`, `isHex` — need no
  browser and no `chrome.*`, and are where a boundary bug (`> 3` vs `>= 3`, a NaN that JSON turns
  into `null`) would live. This is also the re-entry condition for mutation testing, deliberately
  not ported from nas-stacks: a mutation gate over a 7s e2e suite is not worth its runtime; one
  over millisecond unit tests is.
- **An accessibility scan.** Run axe (`@axe-core/playwright`) inside the app frame once the
  checker is open, as its own test in the `app` group. The a11y fixes of 4 September 2026 (live
  region, `<li>`, `aria-controls`, focusable skip targets) are the kind a scan would have flagged.

## Not ported from the source documents

- The mutation gate (control runs, two runs per mutant, hung-mutant detection) — re-entry when the
  colour utils have unit tests. Coverage thresholds and fast-check — same re-entry.
- The re-implementation incident table — no test here has copied production logic; the discipline
  survives as the revert-and-watch-it-redden self-check above.
- Sandboxed shell-stub suites — the only shell in this repo is the `package` script.

## See also

- `test/e2e/fixtures.ts`, `test/e2e/extension.spec.ts`, `playwright.config.ts` — the primary
  sources
- `.github/workflows/ci.yml` — the order of record for what runs on a PR
- `README.md` — loading the unpacked extension for the manual checks the suite cannot do
- `docs/DEVELOPMENT.md` — the gate order and how a change reaches the Web Store
- `docs/SELF-REVIEW.md` — the line-level pass, including test permissiveness
