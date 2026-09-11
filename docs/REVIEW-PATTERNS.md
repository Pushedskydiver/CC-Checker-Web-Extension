# Review Patterns

Defect classes that have actually occurred in this repo, each with the dated instance, how to
detect it, and the structural fix where one exists. `.claude/agents/da-review.md` reads this file
as part of its standard brief, alongside `docs/DA-REVIEW.md` and the `docs/CONVENTIONS.md` sections
the diff touches. That instruction is best-effort — nothing mechanically enforces it.

This is a **living document**, and deliberately empirical. Every entry happened here and names the
file it happened in. Nothing is seeded from a hypothetical. Most entries are at n=1 because the
evidence comes from a single day; they are recorded rather than promoted, and a second instance of
any of them is the trigger to promote it per `docs/DEVELOPMENT.md` §Process-rule promotion.

**Where the evidence comes from.** The Vite migration on `feat/vite-migration` (March–September 2026) was functionally complete — build, `tsc` and stylelint green on Alex's Mac — and still carried
every defect below; no gate caught any of them. They were found on 4 September 2026 by five finder
agents plus hands-on reproduction (a case-sensitive disk image, a child iframe, a grey on the
saturation slider), then pinned by the Playwright suite in `test/e2e/extension.spec.ts` (18 tests).
The fixes merged into `main` on 11 September 2026 (PR #28); `PROGRESS.md` records the commit sequence.

**Adapted from nas-stacks' and moe's `docs/REVIEW-PATTERNS.md`** for structure and the
living-document convention only. Their catches belong to a Python relay, shell scripts and a pnpm
monorepo; this repo is three execution contexts and a build that is loaded unpacked or zipped.

---

## 1. A case-insensitive filesystem hides index casing

The git index tracks one spelling of a path, the disk holds another, and macOS with
`core.ignorecase=true` treats them as the same file. Every import resolves locally; every fresh
checkout on a filesystem that cares fails.

**Instance (4 September 2026).** The index tracked `src/components/01-Atoms/`, `02-Molecules/`,
`Icon/`, `Ratio/` and `Header/` while the disk and every import used lowercase. A fresh clone on a
case-sensitive APFS image failed with `UNRESOLVED_IMPORT` from the bundler and 21 `TS2307` errors —
what the Linux CI runner would have seen first. Fixed by re-indexing (`git rm -r --cached
src/components && git add src/components`) and setting `core.ignorecase=false` locally.

- **Detect:** `git ls-files src/components | grep -E '/[A-Z]'` must print nothing (it prints
  nothing today). A green build on the author's Mac is not evidence for a case-sensitive checkout.
- **Structural fix:** the `quality` job in `.github/workflows/ci.yml` runs `npm ci`, lint, build
  and e2e on `ubuntu-latest`, and its display name `Lint, build, e2e` has been a required status
  check on `main` since 11 September 2026, after its first green run on PR #28.

## 2. A "typed" rewrite of a silent no-op changes behaviour

Old code is a no-op nobody noticed. A migration rewrites it to satisfy the type-checker, and the
rewrite does something. The commit reads as a mechanical move; review compares shapes, not effects.

**Instance (introduced 17 March 2026, `583d112`; fixed 4 September 2026).** `postcss.config.js`
gave `postcss-sort-media-queries` the comparator `(a, b) => b - a`. On strings that is `NaN`, so the
sort was a silent no-op. Inlining the config into `vite.config.ts` rewrote it as
`(a, b) => b.localeCompare(a)` — plus a `types/postcss-sort-media-queries.d.ts` shim written so the
option would type-check. It sorted `(width >= 992px)` before `(width >= 768px)`, the 768px rules
overrode the 992px ones, and the three-column desktop layout never applied. Fixed by using the
plugin default; the shim was deleted (the package ships types since 6.4.4; the lockfile had 6.3.2).

- **Detect:** verify the emitted artefact, not the config: `grep -o "@media[^{]*"
build/assets/*.css` must list ascending `width >=` breakpoints within each module's run (PostCSS
  sorts per file, so the bundle-wide list is not sorted). A commit that says "typed",
  "modernised" or "inlined" gets its output diffed, not only its source.
- **Structural fix:** none mechanical. The comment above `postcssSortMediaQueries()` in
  `vite.config.ts` names the incident; `docs/SELF-REVIEW.md` carries "Mobile-first order in the
  built CSS, not the config". No
  e2e test asserts the desktop layout at a wide viewport — re-entry: add one when the layout is next
  touched.

## 3. NaN and null crossing the JSON boundary

A value legal in memory (`NaN`) is not legal in JSON. `JSON.stringify` turns it into `null`, the
read side gets a type it never expected, and the patch lands far from the cause.

**Instance (4 September 2026).** chroma returns a `NaN` hue for greys. `localStorage` stored the
tuple as `[null, 0, l]`; on load, an effect in `src/context.tsx` "repaired" it in place
(`foreground[0] = NaN`). Dragging the saturation slider on a grey rendered `#111111` where `#331111`
was asked for. Fixed at creation: `toHslTuple` in `src/utils/color-utils.ts` normalises hue to `0`
wherever a tuple is made, `readStoredColor` maps a stored `null` to `0`, and the effect is gone.

- **Detect:** e2e "changing saturation on a grey keeps hue 0 (no NaN hue)". In review: any
  `JSON.stringify` of a value derived from chroma; any effect that writes into an existing array or
  object rather than calling a setter.
- **Structural fix:** `eslint-plugin-react-hooks` 7's recommended set, active in `eslint.config.mjs`,
  has `react-hooks/immutability` and `react-hooks/set-state-in-effect` at error level, so the effect
  cannot be written again without a lint failure. For the reader: sanitise at the boundary, never
  patch state in effects.

## 4. Tab-addressed messages reach every frame

`chrome.tabs.sendMessage(tabId, …)` addresses a tab, not a document. With a content script in every
frame, every frame receives `initChecker` and every frame obeys it.

**Instance (4 September 2026).** `public/manifest.json` declared `all_frames: true`, so a page with
an embedded iframe got a full 475px checker, loupe and body padding inside the iframe as well as the
top document — verified with a child iframe. Fixed twice over: `all_frames` removed from the
manifest, and `public/app/content.js` registers its `onMessage` listener only when
`window.self === window.top`.

- **Detect:** e2e "injects one iframe, the loupe canvas and styles into the top frame only" —
  `test/e2e/fixtures.ts` serves a `/child` iframe so this assertion has something to fail on. In
  review: any new `tabs.sendMessage` without a `frameId`, or any content-script handler that touches
  `document.body` without asking which frame it is in.
- **Structural fix:** the top-frame guard plus the test. `frameId` targeting was not adopted; the
  guard is simpler and covers messages from any sender.

## 5. Teardown order — listeners outliving the UI

Close removes what is visible and forgets what is listening. The next event re-creates the thing
just removed, and now nothing can dismiss it.

**Instance (4 September 2026).** `closeChecker` in `public/app/content.js` removed the iframe and
the `<style>` and hid the loupe, but left the picker's `scroll`, `resize`, `mousemove` and `click` listeners
registered. A scroll after close requested a fresh screenshot and the loupe reappeared, with no
button left to cancel it. Fixed by ordering: `closeChecker` calls `closeColorPicker()` first, then
removes the DOM.

- **Detect:** e2e "closing the checker mid-pick tears the picker down" (scroll after close; assert
  no loupe and `cursor: auto`). In review: every `addEventListener` in a file has its
  `removeEventListener`, with the same function reference, in that file's close path.
- **Structural fix:** the ordering and the comment above it. Teardown runs in reverse of setup; a
  close path that does not name a listener the open path registers is the defect.

## 6. Double delivery — broadcast plus relay

A message is sent on one channel for the common case and relayed on another for an edge case.
Both arrive at the same handler, which runs twice.

**Instance (4 September 2026).** The content script's `chrome.runtime.sendMessage({ type:
'colorPicked' })` reaches every extension context, including the checker iframe. The service worker
in `public/app/background.js` also relays it with `tabs.sendMessage`, because in incognito windows
only the relay arrives. The provider in `src/context.tsx` handled both, so every pick was applied
twice. Fixed by handling the relay only: the handler returns early when `sender.tab` is set, which
is true only for the direct copy.

- **Detect:** count handler invocations per user action, not per message. In review: a new case
  in `background.js`'s relay `switch` needs exactly one consumer path; if the payload also reaches
  the consumer directly, the consumer must choose.
- **Structural fix:** the `sender.tab` discriminator and its comment. No test asserts "handled
  once" — the picker tests check the resulting hex, which is identical after one or two
  applications. Re-entry: assert on a write count.

## 7. A live region made `aria-hidden`

The visual confirmation still works, so nobody notices the accessible one is gone. Sighted review
cannot see this class at all.

**Instance (4 September 2026).** The copy tooltip was an `aria-live` region in `Options.tsx` until
the June 2024 refactor on `main` (`26bf65c`); its replacement,
`src/components/01-atoms/copy-cta/copy-cta.tsx`, put `aria-hidden="true"` on the same element, so
"Copied" and "URL added to clipboard" were never announced. Fixed with `role="status"` on a region that receives the text on copy; the button label
stays stable so focus does not lose its name.

- **Detect:** e2e "copy and share buttons announce their result to assistive tech"
  (`getByRole('status')` must contain the text after click). In review: `aria-hidden` on any element
  whose content changes in response to a user action. `jsx-a11y` cannot tell a decoration from a
  status message; the test is the gate.
- **Structural fix:** the test. A regression against a prior release is the easiest class to miss
  in a migration, because the diff is against nothing — compare with the last shipped build too.

## 8. Dangling CSS-module keys pass the type-checker

Vite's `client.d.ts` types `*.module.css` as `{ readonly [key: string]: string }`, so `styles.x` is
a `string` whether or not `.x` exists. At runtime it is `undefined` and the class is simply absent.

**Instance (4 September 2026).** `styles.main` in
`src/components/04-layouts/main-layout/main-layout.tsx` and `styles.badgeContent` in
`src/components/01-atoms/badge/badge.tsx` named classes that were not in their sibling
`.module.css`. `tsc`, ESLint and stylelint were all green. Both references were removed.

- **Detect:** for each `styles.<key>` in a `.tsx`, grep the sibling `.module.css` for `.<key>`. Dead
  CSS is the mirror image — `.containerbleed*`, an `:export` block, an unused `@value` and `--copy`
  went the same day — and neither direction has a linter.
- **Structural fix:** none adopted. A generated `.d.ts` per module would make this a `tsc` error;
  two in one sweep is not yet recurrence. Re-entry: a dangling key found on any later PR.

## 9. Config in a directory nothing reads

A configuration file is committed, looks maintained, and is never consumed. The tool it configures
is using a default the file was meant to override.

**Instances (found 4 September 2026).** `.github/ISSUE_TEMPLATE/dependabot.yml` had sat there since
14 December 2022 (`4266825`); GitHub reads `.github/dependabot.yml` and nothing else, so the grouping
it described never ran. `_config/eslint.json` extended `eslint-config-synacor`, which was not
installed, and nothing but `.vscode/settings.json` referenced `_config/` once CRA was gone. Fixed: the Dependabot config moved
to `.github/dependabot.yml` (weekly npm groups, monthly github-actions); `_config/` deleted and
replaced by `eslint.config.mjs`.

- **Detect:** for every config file, name its consumer and prove it reads that path. A config whose
  tool never complains about anything is the tell.
- **Structural fix:** none mechanical. The artefact for the Dependabot move arrived on 11 September
  2026: the grouped `dev-dependencies` PR (#32), which only the new config could have produced.

## 10. Verifier fan-out mistaken for rigour

More agents checking a finding feels like more certainty. Past a point it is only more cost, paid
from the session budget the actual fixes needed.

**Instance (4 September 2026).** A 139-agent audit workflow — two verifiers per finding across
roughly sixty findings — exhausted the session budget twice, on a repo of about 3.7k lines. Five
finders plus hands-on reproduction had already found everything that mattered; the verifier swarm
added nothing to the list. `docs/DEVELOPMENT.md` §Scale the fan-out to the repo is the rule.

- **Detect:** the agents about to be dispatched outnumber the files in `src/`; a verifier per
  finding rather than one verification round over the diff; findings arriving faster than they can
  be reproduced.
- **Structural fix:** the round cap — discovery rounds until findings converge to nits, exactly one
  verification round with a confirm-or-disprove brief, default cap of 2 then a manual pass. Report
  "nit-floor reached" honestly rather than manufacture findings to prove a round ran.

## 11. Range inputs without `min` snap to the initial value

Without an explicit `min`, the browser counts `step` increments from the initial value rather than
from zero, so whether the ends of the track are reachable depends on where the slider started.

**Instance (4 September 2026).** The HSL sliders rendered through
`src/components/01-atoms/range-input/range-input.tsx` were given `max` and `step` but no `min`, so
saturation and lightness could never reach exactly 0 or 1 — `#fefefe` at the top of the lightness
track instead of `#ffffff`. Fixed with a `min = 0` default in `RangeInput`, with the reason beside it.

- **Detect:** e2e "HSL sliders reach their endpoints and drive the hex". In review: any
  `<input type="range">` with `step` and no `min`.
- **Structural fix:** the default in the one atom every slider goes through. The remaining check is
  that no caller bypasses `RangeInput` with a raw `<input type="range">`.

---

## Hygiene fixed alongside

Single defects with no class behind them yet, listed so `PROGRESS.md`'s reference resolves. All
4 September 2026.

| Fix                                                                                        | Where                                                          |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `100%%` keyframe typo — lightningcss dropped the frame silently                            | `src/components/01-atoms/copy-cta/copy-cta.module.css`         |
| Saved swatches were `<button>`s directly inside a `<ul>`; now wrapped in `<li>`            | `src/components/02-molecules/saved-colors`                     |
| Tabs: `aria-controls`, wrap-around, Home/End; only handled keys are prevented              | `src/hooks/useTabbed.ts`, `src/components/03-organisms/tabbed` |
| `showErrorPopup` could strand `error.html` as the popup; reset first, `typeof` guard       | `public/app/background.js`                                     |
| `captureVisibleTab(null, …)` → the sender's `windowId`                                     | `public/app/background.js`                                     |
| Regex `{3]` typo in the shorthand-hex test; stray empty template literal                   | `color-controls.tsx`, `wcag.tsx`                               |
| `React.MutableRefObject` → `RefObject`; `<StrictMode>` added                               | `src/`                                                         |
| `.nvmrc` 20.12 → 24; `format` glob skipping root files; `lint:css --fix` reaching `build/` | repo root, `package.json`, `stylelint.config.mjs`              |

---

## The meta-pattern: a fix carrying the next defect

In nas-stacks and moe this is the shape most findings arrive in: three review rounds, and in each
the commit written to fix the previous round introduced the next round's worst finding. Their
diagnosis is a habit, not bad code — write the narrowest change that closes a named finding, then
claim more was checked than was run.

**Not yet observed here in that form.** There has been one review round on this repo and its fixes
have not been through a second. The nearest cousin is pattern 2: a refactor rather than a review
fix, whose "typed" rewrite of a harmless no-op shipped the defect the no-op had been masking, with a
type shim written to make it compile. Treat that as the warning. A fix commit deserves more review
than the commit it fixes, not less — `docs/DEVELOPMENT.md` §Verification rounds says why the last
discovery round is the least independent check, and `docs/SELF-REVIEW.md` says what to re-check
after a fix lands. When the first real instance appears, replace this paragraph with it.

---

## How this file is used

- `.claude/agents/da-review.md` reads this file as part of the standard review brief.
  `docs/RATIONALIZATIONS.md` is consulted at a different moment — only when about to **dismiss** a
  finding.
- Add a pattern when a class is caught on real work, with the date and the file. A second instance
  of any n=1 entry above is the trigger to promote it.
- Patterns that harden into rules move to `docs/CONVENTIONS.md`, `docs/TESTING.md` or
  `docs/DA-REVIEW.md` and are removed from here. A pattern that has become a gate belongs in
  neither: pattern 1 is the `quality` job, pattern 3 is two `react-hooks` rules.
- Do not seed a pattern from a hypothetical. Unexercised is not evidence.
