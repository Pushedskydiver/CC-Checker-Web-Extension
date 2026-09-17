# Self-Review Checklist

The line-level pass, walked by the author **after** `da-review` has reported and its findings have
been acted on, and **before** the PR is opened. Read every changed file in full — `git diff
main...HEAD`, or `git diff` plus `git status --short` on an uncommitted working tree — and look for
the detail-level defects the DA pass is not shaped to catch. Read the diff, not your memory of
writing it.

Ownership split with [DA-REVIEW.md](DA-REVIEW.md):

- **DA-REVIEW** owns the **structural layer** — silent-failure paths in the message relay, message
  sequencing across the three contexts, stale reasoning in comments and docs, unverified claims about
  what Chrome does.
- **SELF-REVIEW** owns the **line layer** — a message name spelt differently in one context, a
  manifest entry the code no longer needs, a `styles.` key with no CSS behind it, a version bumped in
  one file, a test that passes before the change it claims to cover.

The Red Flags list and the severity labels (BLOCKING / MATERIAL / LOW) live in
[DA-REVIEW.md](DA-REVIEW.md) — read them first rather than duplicating them here.

**Adapted from the `docs/SELF-REVIEW.md` in chief-clancy, moe, nas-stacks and tamaclaude** — the
structure and the disciplines, not the subject matter: their shell, Python, compose, monorepo and
mutation-gate sections have no equivalent in a three-context browser extension whose tests are an
e2e suite and 19 Vitest cases over the colour utilities. nas-stacks attached a real incident to every rule it could; this checklist does the
same, and every incident below is from the verification of the Vite migration on 4 September 2026.

This is a **living document**. When something slips past DA + self-review + CI and shows up as a
broken panel on a page nobody tested, add the specific check here the same day, with its date.

**Last reviewed:** 11 September 2026.

---

## NOTICED BUT NOT TOUCHING

When you spot something worth improving outside the task, **list it — don't fix it**:

```
NOTICED BUT NOT TOUCHING:
- src/components/01-atoms/copy-cta/copy-cta.tsx imports sibling atoms relatively while
  saved-colors.tsx reaches the same tier via `~/` (unrelated to this change)
- the loupe's 66ms scroll-stop delay in public/app/content.js is a magic number (separate change)
→ Want me to add these to PROGRESS.md?
```

Drive-by fixes mixed into a change are harder to review, harder to revert, and hide the real defect
in noise. In a repo whose content script runs on every page the user opens, "while I'm here" in
`public/app/content.js` is expensive. Surface it and move on.

The narrow exception: if the thing you noticed is **dead machinery** — a CSS class nothing composes,
a `@value` nothing imports, a branch of a `switch` no message reaches — list it under DA's dead-code
rule and ask. Don't silently delete it, and don't silently keep it. The 4 September 2026 sweep
removed `.containerbleed*`, an `:export` block and an unused `@value` this way, as their own item.

---

## Before you write the word verified

Applies to commit messages, PR bodies, code comments, `PROGRESS.md` entries and your own replies.

- For every sentence containing _verified_, _confirmed_, _tested_, _proven_ or _works_: is the
  command in the same paragraph, verbatim and runnable? If not, add it or downgrade the sentence.
- Paste what the command **printed**, not your reading of it. `18 passed (7.3s)` — the last line
  `npm run test:e2e` printed on 4 September 2026 — is evidence. "E2E passes" is a claim about
  evidence.
- Say which of these actually happened, because they mean different things here:
    - **ran the e2e suite** — proves the built extension loads in headless Chromium and the content
      script → service worker → iframe flow works, including the eyedropper under the patched manifest;
    - **loaded unpacked** (`npm run build` → chrome://extensions → Developer mode → Load unpacked →
      `build/`) — the only way to exercise a real toolbar click, the `activeTab` grant, the
      `error.html` popup, or an incognito window. The suite cannot do any of these; say which one
      you did by hand, or that you did not. It _can_ read the clipboard back, and does for the
      share button since 12 September 2026.
- A green build on the author's Mac is not a Linux checkout. On 4 September 2026 `npm run build` and
  `tsc` were green locally while the Git index still tracked `01-Atoms/`, `02-Molecules/`, `Icon/`,
  `Ratio/` and `Header/` against lowercase imports; a case-sensitive clone produced
  `UNRESOLVED_IMPORT` and 21 TS2307 errors. macOS plus `core.ignorecase=true` hid it. Only CI on
  `ubuntu-latest` proves the checkout builds; if the PR's run has not finished, write "not yet
  verified on a case-sensitive checkout" rather than implying it.
- Never assert a negative — "nothing else sends this message", "no other module uses this class" —
  without the grep in the same paragraph.

---

## Diff walk

Read `git diff main...HEAD` top to bottom. For each file:

- Does every change belong in **this** PR? Unrelated fixes get their own commit at least, and
  usually their own PR. A case-only rename must never be squashed into anything else — it is only
  reviewable alone.
- Would a reader understand _why_ from the code and comments alone? The 4 September fixes each
  carry a one-line comment naming the failure they prevent; match that.
- Any commented-out code, stray `console.log`, or `TODO` without an owner? (`console.warn` in
  `public/app/background.js` is deliberate and prefixed `CC Checker:` — keep the prefix.)
- Any `eslint-disable` or `stylelint-disable` without a comment justifying it?
- Did `package-lock.json` change only where `package.json` did? Read the lock diff; a lock that
  moved without a dependency change is a different Node or npm on the author's machine.

## Extension accuracy

`public/manifest.json` and `public/app/*.js` are copied verbatim to `build/`. Vite never sees them,
`tsc` never sees them and Prettier ignores `public/`; ESLint is the only tool that reads them.

- **Manifest ↔ code.** `permissions` is still exactly `["activeTab"]`. `web_accessible_resources`
  lists `index.html` and the font and nothing else — the page's own `/assets/*`, `/fonts/*` and
  `/images/*` load from the static extension origin, verified 4 September 2026 by watching the
  unlisted favicons and BMC logo return 200 inside the iframe. A new entry there needs a reason
  written next to it. `content_scripts` has no `all_frames`: it was removed the same day after a full
  checker appeared inside every embedded iframe.
- **Message names in all three contexts.** A new or renamed `type` appears in the `switch` in
  `public/app/content.js`, the `switch` in `public/app/background.js`, and wherever `src/` sends or
  receives it. Both switches end in `default:` with no body, so a string that matches in two places
  out of three is a silent no-op. Note the casing: it is `updateScreenShot`, capital S. Grep it:

    ```bash
    grep -rnoE "'(initChecker|getScreenshot|updateScreenShot|closeColorPicker|closeChecker|colorPicked)'" src public/app test
    ```

- **Frame guard.** Everything in `content.js` that registers a listener sits inside
  `if (window.self === window.top)`. The service worker addresses the _tab_, so every frame receives
  every message; the guard is the only thing keeping the panel out of child iframes.
- **Sender filter.** The app's `onMessage` handler in `src/context.tsx` returns early when
  `sender.tab` is set, so it handles the service-worker relay and ignores the content script's direct
  broadcast — before 4 September 2026 each pick was handled twice. A new handler in `src/` follows
  the same rule; a new relay case in `background.js` sits below the `tabId === undefined` return.
- **Promise catches.** Every `chrome.tabs.sendMessage` in the worker goes through `sendToTab` (which
  catches) — except the one in `onClicked`, which catches by hand because the failure _is_ the
  signal to show the error popup. `captureVisibleTab` has its own `.catch`, and it takes
  `sender.tab.windowId`, not `null`.
- **`showErrorPopup` ordering.** The `setPopup({ tabId, popup: '' })` reset is scheduled _before_
  anything that can throw, `openPopup` is guarded with `typeof … === 'function'`, and both
  `setPopup` calls are scoped to `{ tabId }`. Reorder any of that and a missing `openPopup` strands
  `error.html` as the popup for every later click — which is what the pre-4 September code did.
- **Teardown order.** `closeChecker` calls `closeColorPicker` first. Before the fix, a scroll after
  closing fetched a fresh screenshot and the loupe came back with no panel to dismiss it.

## React accuracy

`src/` is React 19 with `react-hooks` 7 rules on, so `set-state-in-effect` is a lint error, not a
review note — but the lint does not see everything.

- **State is derived, not duplicated.** `contrast`, `level`, `isPoorContrast` and `isBackgroundDark`
  are computed from `background` and `foreground` on every render in `src/context.tsx`. A new value
  that can be computed from those two tuples is computed, not stored, and never written to
  `localStorage`.
- **No effect patches state.** Sanitise at the boundary instead. The NaN hue (chroma gives greys a
  NaN hue, JSON stored it as `null`, an effect then did `foreground[0] = NaN` in place, and
  saturating `#222222` rendered `#111111` instead of `#331111`) was fixed on 4 September 2026 by
  normalising in `toHslTuple` in `src/utils/color-utils.ts` and deleting the effect.
- **Refs are typed `React.RefObject`.** `React.MutableRefObject` is gone from `src/hooks/useTabbed.ts`
  and the tab/panel components; don't bring it back.
- **Accessible names are stable.** A button's label does not change to announce a result — the
  result goes in a live region. `CopyCta` keeps `Generate share URL` / `Copy … to clipboard` on the
  button and puts `URL added to clipboard` in a `role="status"` `<Text>`; the migration had
  regressed that to `aria-hidden` and the e2e test `copy and share buttons announce their result to
assistive tech` now pins it.
- **Live regions receive text, not visibility.** A `role="status"` or `aria-live="polite"` element
  is in the DOM before the event and has its text _inserted_ on the event. Toggling `display` on a
  region that already contains the text announces nothing.
- **List semantics.** Children of `<ul>` are `<li>`. The saved swatches were `<button>`s directly
  inside the `<ul>` until 4 September 2026; `SavedColors` now wraps each in `<li>` and the suite
  counts `ul[aria-label="Saved colours"] li`.
- **Tabs follow WAI-ARIA.** Every `role="tab"` has `aria-controls` pointing at a real panel id,
  arrow keys wrap, Home/End work, and only the keys the hook handles are `preventDefault`ed — the
  old hook swallowed every non-arrow key.
- **Skip-link targets are focusable.** An `id` a skip link points at carries `tabIndex={-1}`
  (`#ratio`, `#grades`). The e2e test `skip links target real, focusable ids` checks this.
- **Range inputs declare `min`.** Without it the browser counts steps from the initial value and a
  slider can never reach exactly 0 or 1 (`#fefefe` for `#ffffff`). `RangeInput` defaults `min={0}`;
  a new range control does not override that without a reason.

## CSS accuracy

`stylelint-use-logical` runs in `npm run lint:css`, `postcss-preset-env` nests and prefixes, and
`postcss-sort-media-queries` reorders the output. Two of those three can only be checked in
`build/`.

- **Logical properties.** `margin-inline`, `padding-block`, `inset-inline-start` — not
  `margin-left`, `padding-top`, `left`. Stylelint enforces it, but only on `src/**/*.css`; the CSS
  string in `public/app/content.js` is out of its reach and uses physical properties — it positions
  a loupe at mouse coordinates on someone else's page.
- **Mobile-first order in the built CSS, not the config.** The comparator
  `(a, b) => b.localeCompare(a)` inlined into `vite.config.ts` on the branch sorted
  `(width>=992px)` before `(width>=768px)`, so the three-column desktop layout never applied; the
  previous config's `b - a` had been NaN on strings and therefore a silent no-op. The plugin's
  default sort was restored on 4 September 2026. After any change to a breakpoint, a `@value`, or
  `vite.config.ts`, read the emitted order:

    ```bash
    npm run build && grep -o "@media[^{]*" build/assets/index-*.css
    ```

    `(width>=768px)` must precede `(width>=992px)`.

- **Dangling module keys — `tsc` cannot see them.** CSS Modules are typed as `{ [key: string]:
string }` under `vite/client`, so `styles.main` with no `.main` in the sibling file is `undefined`
  at runtime and green in every gate. `styles.main` and `styles.badgeContent` were exactly that
  until 4 September 2026. For a component with a same-named `.module.css`, this reports any literal
  key with no class behind it (it cannot follow template keys such as
  ``styles[`${tooltipPosition}Tooltip`]`` — check those by hand):

    ```bash
    find src -name '*.tsx' | while read -r f; do css="${f%.tsx}.module.css"; [ -f "$css" ] || continue; grep -oE 'styles\.[A-Za-z]+' "$f" | cut -d. -f2 | sort -u | while read -r k; do grep -qE "\.$k([^A-Za-z]|$)" "$css" || echo "$f: styles.$k not in $(basename "$css")"; done; done
    ```

- **Keyframe selectors.** `0%`, `100%`, `from`, `to`. A `100%%` in
  `src/components/01-atoms/copy-cta/copy-cta.module.css` was on `main` and lightningcss dropped the
  frame without a word; found 4 September 2026. Stylelint does not catch it either.
- **`@value` tokens are imported where used.** A breakpoint used as a bare `--bp-medium` without
  `@value --bp-medium from --breakpoints;` at the top of the module is emitted as the literal string
  and matches nothing.

## Test accuracy

`test/e2e/` is Playwright against the built `build/`, 18 tests on 4 September 2026, ~7s on 4
workers. `src/utils/color-utils.test.ts` is 19 Vitest cases since 17 September 2026
(`docs/TESTING.md`).

- **A new behaviour has a test that failed before the change.** Check out the parent commit, run
  the one test, watch it go red, come back. If it was green before your change, it is decorative.
  Every fix listed above shipped with its own test in `test/e2e/extension.spec.ts`; the NaN hue,
  slider endpoint, child-iframe and teardown-order tests are the models.
- **The patched-manifest project is only for picker tests.** `test.use({ patched: true })` copies
  `build/` and adds `host_permissions: ["<all_urls>"]` so `captureVisibleTab` works without a
  toolbar click. It belongs on the `colour picker (needs captureVisibleTab)` describe block and
  nowhere else — a test that passes only under the patched manifest is a test of permissions the
  shipped extension does not have.
- **Assert the production value, not a value the test computed.** `readAppState` reads `#ratio`,
  the input values and the `--background-color` custom property off the live frame; a test that
  re-derives the ratio with chroma-js proves the library, not the app.
- **Drive inputs the way a user would.** React-controlled `<input type="range">` needs the native
  setter plus an `input` event (`setRange` in `fixtures.ts`); setting `.value` alone changes nothing
  React can see.
- **Counts are exact.** `toBe(1)` for the iframe, `toEqual({ iframes: 0, … })` for the child
  frame. A `toBeGreaterThan(0)` on something that should be exactly one lets the double-injection
  bug straight through.
- **Waits are bounded and named.** A `waitForTimeout` carries a comment saying what it waits for
  (`document_idle`, the 66ms scroll-stop). No sleeping through a race you could `waitForFunction`.
- **The test name says what is asserted**, so a red line in CI's `github` reporter is readable
  without opening the file.

## Claims and consistency

- **The version is in two files.** `package.json` and `public/manifest.json` are not linked; they
  read `1.6.1` and `1.6.2` respectively until 4 September 2026, and `main` itself had at one point
  regressed the manifest from `1.6.4` to `1.6.2` (commit `3043249`). Check both, and check the licence field while you
  are there (it said ISC against an MIT `LICENSE` until the same day):

    ```bash
    grep -n '"version"' package.json public/manifest.json
    ```

- **Defaults in two files.** `DEFAULT_BACKGROUND` / `DEFAULT_FOREGROUND` in `src/context.tsx` and
  `--background-color` / `--foreground-color` in `src/styles/globals.css` must be the same colours
  (`#222222` and `#222` are; `#222` and `#333` are not). Nothing links them; the e2e test
  `renders with defaults, real font, and consistent first-run colours` compares the input value with
  the custom property.
- **Docs name real scripts.** `npm run lint`, `lint:ts`, `lint:js`, `lint:css`, `format`,
  `format:check`, `build`, `watch`, `package`, `test`, `test:e2e` — and nothing else. There is no
  `dev`, `start` or `typecheck`. `grep '"scripts"' -A 12 package.json` is the source.
- **Docs name real files.** `_config/eslint.json`, `types/postcss-sort-media-queries.d.ts` and
  `postcss.config.js` are gone; a reference to any of them is stale. Every path in prose resolves
  from the repo root, with the same prefix throughout a document.
- **Numbers you moved are numbers you re-derived.** "18 tests", "475px", "max 5" saved pairs,
  "chrome >= 111" — read the source, not the last doc that quoted it.
- **`PROGRESS.md` updated.** A change that closes or opens a workstream, or changes the loading
  instructions for the next session, edits `PROGRESS.md` in the same PR.
- **After a rename, `grep -rn` the old name** across `src`, `public`, `test`, `docs`, `README.md`
  and `CLAUDE.md`. It is in more places than the diff shows.
- **When your change adds a rule, apply it to your own diff before landing**, exhaustively, as the
  last step. The self-referential miss is the one a later review finds first.

## Security and privacy

- **Screenshots are captured only on a user action and never stored.** `captureVisibleTab` runs
  in `public/app/background.js` only in response to `getScreenshot` (a click on a Pick button) or
  `updateScreenShot` (scroll/resize while the loupe is open). The PNG data URL goes to `image.src`
  in the content script, is never written to `localStorage`, never leaves the extension, and is
  forwarded only to the tab that asked. A change that caches, persists or forwards it elsewhere is
  BLOCKING until Alex has agreed to it.
- **No `host_permissions` creep.** The shipped manifest has `permissions: ["activeTab"]` and no
  `host_permissions`. The `<all_urls>` copy exists only in `test/e2e/fixtures.ts` under
  `patched: true`. Grep before pushing:

    ```bash
    grep -rn "host_permissions" public src test
    ```

    The only hit is the fixture.

- **Untrusted page content is data.** The content script runs on every `<all_urls>` page. Nothing
  read from the host DOM, from a `message` payload, or from `localStorage` (which the extension
  origin owns but an older build or a hand edit can have shaped differently) is trusted as-is:
  `readStoredColor` and `readStoredColors` in `src/context.tsx` validate shape and fall back to the
  defaults rather than throw in render. A new message field is checked before use, the way the
  `colorPicked` handler checks `message.key && message.rgb`.
- **The share URL carries two hex values and nothing else.** `Generate share URL` links to
  `https://colourcontrast.cc/?background=<hex>&foreground=<hex>`; no page URL, title or screenshot
  goes with it.
- **The iframe stays `referrerpolicy="no-referrer"`** and keeps loading `chrome.runtime.getURL('index.html')`,
  not a remote URL.
- **No secrets.** There is no API, no token and no `.env` in this repo; a diff that introduces one
  needs a conversation, not a `.gitignore` line.

## PR

- **Title** matches a commit subject: `<type>: CC-<n> - <gitmoji> Description`, ticket key between
  the type and the gitmoji, gitmoji copied from `docs/GIT.md`. Five commits of 17 March 2026 on the migration branch
  dropped the gitmoji; that is drift, not a precedent.
- **Template filled.** `PULL_REQUEST_TEMPLATE.md` at the repo root asks what kind of change, whether
  tests were added, the motivation, whether anything breaks, and the environment. Answer each
  heading; "see commits" is not an answer. Say what changed and why, not a file listing.
- **Pre-push suite green, pasted**, in the PR body:

    ```bash
    npm run lint && npm run test:unit && npm run build && npm run test:e2e
    ```

- **CI green** on the PR before asking for review — it is the only run on a case-sensitive
  checkout, and `Lint, build, e2e` has been a required check on `main` since 11 September 2026, so
  a red run blocks the merge button as well as the review.
- **Alex merges.** Claude never does, and never posts review comments on the PR — findings go in
  chat. Which merge button is Alex's call per PR; rebase is the default (`docs/GIT.md`
  §Merge strategy).
- **Merged is not published.** If the PR is meant to ship, the version bump is in both files and
  `PROGRESS.md` says the release step is still to do.

---

## Not ported

Sections in the source checklists with no equivalent here, and what would bring them back:

- **Shell, Python, compose and CI-loop accuracy** (nas-stacks) — no scripts, no Python, no compose,
  one CI job with no hardcoded loops. Re-entry: a second workflow or a release script.
- **Mutation-gate accuracy** (nas-stacks) — ~~no unit tests to mutate. Re-entry: unit tests for
  `src/utils/color-utils.ts`.~~ That re-entry fired on 17 September 2026; adopting a mutation gate
  is a decision, not a consequence (`docs/TESTING.md` §Not ported).
- **Monorepo, public API surface, TSDoc scope, lint-staged safety, `knip`** (moe, tamaclaude) —
  single package, nothing published to npm, no lint-staged hook, no `knip`. Re-entry: a second
  package or an npm publish.
- **Zod at trust boundaries** (tamaclaude) — no schema library; the boundary checks are hand-written
  guards in `src/context.tsx`. Re-entry: a third message shape that the guards cannot express
  readably.

## See also

- [DA-REVIEW.md](DA-REVIEW.md) — the structural pass, walked first; owns Red Flags and severity
- [DEVELOPMENT.md](DEVELOPMENT.md) — the full gate flow, release and merge policy
- [TESTING.md](TESTING.md) — what the e2e suite covers and what it cannot
- [REVIEW-PATTERNS.md](REVIEW-PATTERNS.md) — the 4 September 2026 findings these checks came from
- [RATIONALIZATIONS.md](RATIONALIZATIONS.md) — what it sounds like when you are about to skip one
- [CONVENTIONS.md](CONVENTIONS.md) — the conventions being checked
- [GIT.md](GIT.md) — commit and branch format, the gitmoji table
- [ARCHITECTURE.md](ARCHITECTURE.md) — the three contexts and the message sequences
