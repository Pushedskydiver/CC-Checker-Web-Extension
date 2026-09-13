# Conventions

Four tools have opinions about this repo and `npm run lint` runs all of them in order: `tsc` over
both tsconfigs, `eslint .`, `stylelint "src/**/*.css"` and `prettier --check`. Everything they
enforce is marked as enforced below. Everything else holds because it is written down here and
because the files already follow it — read `src/components/01-atoms/badge/badge.tsx`,
`src/context.tsx`, `src/utils/color-utils.ts` and `public/app/content.js` before writing anything.

Adapted from the `docs/CONVENTIONS.md` in tamaclaude, moe and nas-stacks. Kept: what a comment is
for, the "where a thing gets written down" split, "verify a gate can fail", and the rule that every
rule cites an incident. Dropped, with re-entry conditions at the end: complexity limits, functional
rules, layer boundaries, import-sort plugins, knip, Zod, TSDoc, the `Result` union, and everything
about compose files, shell and secrets — nothing here could obey them.

---

## Authoring these rules

Two shapes live here. **Mechanical rules** are checkbox-suitable and, wherever possible, live in
`eslint.config.mjs`, `stylelint.config.mjs` or `tsconfig.json` rather than in prose — a rule a
linter holds is a rule nobody has to remember. **Taste-shaped rules** (what to derive versus store,
when a comment earns its length) are prose that makes the intent legible; the bar is "does the
intent survive a hostile re-read?", not "can a reviewer tick a box?".

Every non-obvious rule below names the incident that produced it. All of them are from
4 September 2026, the day the CRA → Vite migration was verified end to end; the full list is in
`docs/REVIEW-PATTERNS.md`. A proposed rule that cannot cite an incident should wait for one.

### Where a thing gets written down

| It belongs in                                             | When                                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| The source file, next to the line                         | Why one value, guard or ordering is the way it is. The default.                                     |
| `eslint.config.mjs`, `stylelint.config.mjs`, `tsconfig.*` | Anything a tool can enforce; a relaxation lives here with a comment.                                |
| `.github/workflows/ci.yml`                                | What must be green before a merge (a required check on `main` since 11 September 2026 — see below). |
| `docs/`                                                   | Rules and process: how work is done, reviewed, tested, released.                                    |
| `PROGRESS.md` / `docs/history/SESSIONS.md`                | State: what is finished, what is next, how the next session loads. Never rules.                     |
| `CLAUDE.md` (`AGENTS.md` is a symlink to it)              | Only what an agent must know before touching anything; the rest is a pointer.                       |

`public/manifest.json` is JSON and cannot carry a comment, so the reasoning behind every manifest
key (`activeTab` only, `use_dynamic_url`, no `all_frames`) lives in `docs/ARCHITECTURE.md`. `docs/`
otherwise points at file-level comments rather than restating them, so a correction has one home.

---

## Comments

### Explain why, never what

`min = 0` in `src/components/01-atoms/range-input/range-input.tsx` is self-explanatory. What is
not: without an explicit `min`, the browser counts steps from the slider's _initial_ value, so
lightness could never reach exactly 0 or 1 and a slider pushed to the end gave `#fefefe` instead of
`#ffffff`. That is the shape — the comment carries the mechanism a future reader cannot reconstruct
from the value. Comments to match: the header of `toHslTuple` in `src/utils/color-utils.ts`, the
`sender.tab` guard in `src/context.tsx`, the `postcssSortMediaQueries` line in `vite.config.ts`,
the top-frame guard at the bottom of `public/app/content.js`.

### Name the incident and its date

A dated incident is checkable; "for robustness" is not. The comments in the tree today carry the
mechanism and this document carries the date; a comment written from now on carries both, e.g.
"4 September 2026: every pick was handled twice because the content script's broadcast and the
service worker's relay both arrive here". Where a claim was verified rather than assumed, say so —
the `web_accessible_resources` reasoning rests on an empirical check (unlisted favicons loaded
with HTTP 200 inside the iframe), and the word "verified" travels with it wherever it is restated.

### Prefer a concrete failure to an abstract principle

Not "verify build output" — but: a comparator `(a, b) => b.localeCompare(a)` that replaced a
`b - a` (which returned `NaN` on strings and was a silent no-op) type-checked, linted, built, and
sorted `(width >= 992px)` before `(width >= 768px)`, so the three-column desktop layout never
applied. Not "sanitise input" — but: chroma yields a `NaN` hue for greys, `JSON.stringify` turns it
into `null`, and an effect then patched it back in place (`foreground[0] = NaN`), so saturating a
grey rendered `#111111` instead of `#331111`.

### State the scope limit rather than implying it

Write the boundary in the same breath as the check. `test/e2e/fixtures.ts` says why the picker
tests run against a copied manifest with `host_permissions` (Playwright cannot click the toolbar,
so `activeTab` is never granted) — which is also the statement that the real toolbar grant is _not_
covered. The `openPopup` guard in `public/app/background.js` says what happens when the API is
missing rather than leaving it to be inferred.

### The comment lives next to the thing it governs

`DEFAULT_BACKGROUND` / `DEFAULT_FOREGROUND` in `src/context.tsx` must equal `--background-color` /
`--foreground-color` in `src/styles/globals.css`; the note saying so sits on the constants, because
that is where someone changing them will look. Length is not the constraint: a paragraph above a
one-line value is right when the value has a history. A comment that restates the code, or that
the code has overtaken, is not.

---

## Language and runtime

- **TypeScript 7.0.2 native `tsc`** (the Go compiler) is installed under the alias
  `@typescript/native` and is what `lint:ts` runs. The `typescript` package name resolves to
  `@typescript/typescript6` (bin `tsc6`) purely so `typescript-eslint` has a JS API. This is the
  TypeScript team's documented side-by-side layout; do not "tidy" the aliases into one package.
- **ESM throughout**: `"type": "module"`, config files are `.mjs` or `.ts`, `moduleResolution:
bundler`. `verbatimModuleSyntax` is on and `@typescript-eslint/consistent-type-imports` enforces
  inline type imports: `import { defineConfig, type Plugin } from 'vite'`.
- **Node 24** (`.nvmrc`, `engines >=24.0.0`), **npm** (`package-lock.json` v3). `nvm use` first.
- `strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly` and `noUnusedLocals/Parameters` are
  on. Destructure with defaults rather than index and assert: `const [h, s = 0, l = 0] = hsl`.
- Two tsconfigs: `tsconfig.json` covers `src/**` with `types: ["chrome", "vite/client"]`;
  `tsconfig.node.json` extends it for `vite.config.ts`, `playwright.config.ts` and `test/**` with
  `types: ["node", "chrome"]`. A new root-level `.ts` file goes in the second one's `include`.
- The browser target is the `browserslist` field, `chrome >= 111`. PostCSS reads it; nothing else.

---

## TypeScript and React

- **Components are plain typed functions, `export const Name = ({ … }: TName) => …`**, with a
  `T`-prefixed prop type declared above them in the same file (`TBadge`, `TRangeInput`,
  `TCopyCta`). No `React.FC`, `FC` or `FunctionComponent`; a component with no props takes no
  parameter, and one that renders `children` gets it from its prop type — spelled out as
  `children: React.ReactNode` in `TBadge`, or inherited from `React.PropsWithChildren` (`TButton`)
  or `React.HTMLAttributes` (`TText`). Named exports only, except `App` (`src/app.tsx`) and
  `ColourContrastProvider` (`src/context.tsx`), which are default exports. Not enforced.
  **Changed 13 September 2026 from a `React.FC<TName>` mandate** (CC-004), for three reasons
  checked that day: in the installed `@types/react` 19.2, `FC<P>` is only
  `(props: P) => ReactNode | Promise<ReactNode>` — no implicit `children`, so it adds nothing
  these components use; the two default exports above were already plain typed arrows, so
  the mandate described a form the entry points did not follow; and react.dev's TypeScript guide
  types props on the parameter and never mentions `React.FC`. The 31 `React.FC` signatures in 25
  files that predate the change are drift: convert them in one pass, not file by file, so the tree
  never carries both forms longer than one PR. `WcagProps`, `TextSizes` and `TextWeights` predate
  the prefix and are drift too: rename them when their file is next touched, not in a drive-by.
- **`type` for props; `interface` only where it already is** (`src/context.tsx` and `WcagProps` in
  `src/components/02-molecules/wcag/wcag.tsx`). Not enforced.
- **Hooks live in `src/hooks/`**, one per file, named after the hook — `useTabbed.ts` is the one
  camelCase filename in `src/` (verified 4 September 2026), deliberately, because the file is the
  hook.
- **Never mutate state you were handed.** The NaN-hue bug was an effect writing
  `foreground[0] = NaN` into the tuple that context owned. `ColourControl.handleChange` shows the
  shape: copy into a fresh `ColorTuple`, change one channel, hand it to `handleContrastCheck`.
- **No `setState` inside an effect.** `react-hooks/set-state-in-effect` (in
  `eslint-plugin-react-hooks` 7's recommended set) rejects it; a planted `setN(1)` in a `useEffect`
  was confirmed to fail on 4 September 2026. The effects in the tree do four things only:
  subscribe to `chrome.runtime.onMessage`, write the two CSS custom properties onto
  `document.body`, clear a timer on unmount, and abort the picker's Escape listener on unmount.
  The picked-colour handler is a `useEffectEvent`
  so the listener registers once and still sees current state.
- **Derive, don't store.** `contrast`, `level`, `isPoorContrast`, `isBackgroundDark` and both hex
  strings are computed on every render from the two HSL tuples in `src/context.tsx`. Nothing
  derived is persisted; the stored value and the rendered value cannot disagree.
- **Context owns colour state and is the only writer of `localStorage`.** `updateView` writes
  `background` and `foreground`; `saveColors` writes `colors`. Reads happen once, lazily, in
  `useState` initialisers through `readStoredColor` / `readStoredColors`, which validate the shape
  and fall back to the defaults rather than throw in render. A component that wants to change a
  colour calls `handleContrastCheck`, `reverseColors` or `saveColors` — never `localStorage`.
- **`chrome.*` is confined to `src/context.tsx`, `color-picker-cta.tsx` and `actions.tsx`**
  (grep, 4 September 2026). The app sends `getScreenshot`, `closeColorPicker` and `closeChecker`
  and receives only `colorPicked`. Any receiver must be **relay-aware**: the content script's
  broadcast and the service worker's relay both arrive, `sender.tab` is set only on the direct
  copy, and only the relay reaches the iframe in incognito windows — so the direct copy is
  ignored. Handling both handled every pick twice.
- **Message types are strings shared by three files that cannot import each other**
  (`src/context.tsx`, `public/app/background.js`, `public/app/content.js`). Adding or renaming
  one means grepping all three; there is no enum to lean on.
- **Conditional classes go through `clsx`**, and the poor-contrast pair is always the same shape:
  `isPoorContrast && !isBackgroundDark ? styles.xDark : undefined` next to its `Light` twin.
- `react/prop-types` is off (TypeScript does that job); `_`-prefixed unused parameters are allowed.

---

## Files and naming

- **kebab-case** directories and files: `color-control/color-control.tsx`,
  `saved-colors.module.css`. Exception: hook files, above.
- **Atomic tiers are numbered**: `01-atoms`, `02-molecules`, `03-organisms`, `04-layouts`. Imports
  point down or sideways, never up — no atom imports a molecule (verified 4 September 2026).
  Sub-components of an organism sit in its `components/` directory (`tabbed/components/tab.tsx`).
- **Each component directory holds `<name>.tsx` and `<name>.module.css`**, nothing else — the
  exceptions today are an organism's `components/` (above) and `color-picker-cta`, which has no
  styles and so no module.
- **Case is load-bearing.** On 4 September 2026 the git index tracked `01-Atoms/`, `02-Molecules/`,
  `Icon/`, `Ratio/` and `Header/` while the disk and every import were lowercase; macOS hid it and a Linux
  clone failed with 21 `TS2307` errors. `core.ignorecase=false` is set locally; rename by case
  with `git mv`, and treat a green build on a Mac as no evidence for a case-sensitive checkout.
- **CSS Modules classes are camelCase** (`.badgeDark`, `.tooltipFadeInOut`).
  `selector-class-pattern` is off in stylelint, so this is convention; keep it, because
  `styles[`${size}Text`]` in `text.tsx` builds names from it.
- **`~/` for anything that crosses a directory; relative for the same directory or a sibling in
  the same tier.** `~/context`, `~/utils/color-utils`, `~/components/01-atoms/badge/badge` versus
  `./badge.module.css` and `../text/text`. `src/app.tsx` and `src/context.tsx` use `./` because
  they sit at the root of `src`. Both forms exist today (42 alias imports, 27 relative, counted
  4 September 2026); do not convert existing ones.
- **Import order is a shape the files follow, not a rule a tool holds**: packages, then project
  modules, then the CSS module, then `import type`, separated by blank lines — see
  `src/components/02-molecules/color-control/color-control.tsx`.

---

## CSS

- **CSS Modules only**, one per component, plus the three shared modules under
  `src/styles/modules/`: `container` and `typography` are pulled in with `composes`
  (`composes: container from containers`), `breakpoints` with `@value` (next bullet).
  `src/styles/globals.css` is the one global sheet, imported once from `src/app.tsx`.
- **Breakpoints are `@value` tokens**, declared once in `src/styles/modules/breakpoints.module.css`
  and imported per module in two lines, then used with range syntax:

    ```css
    @value --breakpoints: '../../../styles/modules/breakpoints.module.css';
    @value --bp-medium from --breakpoints;

    @media (width >= --bp-medium) { … }
    ```

    The `_max` twins (`--bp-medium_max`) exist for `<=` queries. Stylelint allows the at-rule via
    `at-rule-no-unknown: { ignoreAtRules: ['value'] }`.

- **Mobile-first.** The base rule is the narrow layout and `width >=` queries widen it;
  `postcss-sort-media-queries` in `vite.config.ts` runs with its default `mobile-first` sort. The
  custom comparator that reversed that order shipped a two-column desktop and was caught only by
  reading the emitted CSS. When touching the PostCSS chain, open `build/assets/*.css` and read the
  media-query order.
- **Logical properties are enforced** by `stylelint-use-logical` (`csstools/use-logical`):
  `margin-block-start`, `inline-size`, `padding-inline`, never `margin-left` or `width`. A planted
  `margin-left` was confirmed to fail on 4 September 2026.
- **Nesting is allowed** (`&`, `@media` inside a rule) to `max-nesting-depth: 4`;
  `postcss-preset-env` (`nesting-rules: true`, stage 3) flattens it for `chrome >= 111`.
- **Theme through custom properties.** Context writes `--background-color` / `--foreground-color`
  onto `body`; a component declares its own locals (`--badge-bg-color`) from those and a modifier
  class swaps them (`.badgeDark`). `custom-properties: false` in preset-env leaves them as runtime
  variables — do not expect them to be inlined.
- **No `!important`** (`declaration-no-important`, confirmed failing on a planted one). The only
  `!important`s in the repo (three) are inside the CSS string `public/app/content.js` injects into
  the host page, where they have to beat the page's own rules; stylelint never sees that string.
- Keep `globals.css`'s colour defaults equal to `DEFAULT_BACKGROUND` / `DEFAULT_FOREGROUND`.
- Small things stylelint holds: `length-zero-no-unit`, no duplicate properties or selectors, no
  empty blocks. One it cannot: a `100%%` keyframe typo was silently dropped by the minifier on
  4 September 2026, so read `@keyframes` blocks (one, in `copy-cta.module.css`) by eye.

---

## The plain-JS extension scripts

`public/app/background.js` (service worker) and `public/app/content.js` (content script) are
copied to `build/` verbatim by Vite. They are **not** bundled, **not** TypeScript and cannot use
`~/`, `import` or anything from `src/`. Vite does not parse `public/`, so a stray `import` would
sail through `npm run build`; only the e2e suite or a manual reload would report it.

- **Dependency-free.** They share nothing with `src/` except the message type strings.
- **Guard every `querySelector`.** The host page is not ours: `getCanvasWrapper()` is null-checked
  in every handler in `content.js`, because a page script can remove the nodes at any time.
- **Promise-form Chrome APIs, always with `.catch`.** `sendToTab` in `background.js` wraps
  `chrome.tabs.sendMessage(...).catch(() => undefined)` — a tab that navigated or closed is not
  an error worth surfacing; `captureVisibleTab` logs and drops. Optional APIs are guarded with
  `typeof chrome.action.openPopup === 'function'`, and in `showErrorPopup` the unbind timer is
  scheduled _before_ the call that can throw — the version without that ordering left
  `error.html` permanently bound as the popup.
- **Top frame only.** `content.js` early-returns unless `window.self === window.top`; the service
  worker addresses the tab, so every frame receives every message and, before the guard plus the
  removal of `all_frames` from the manifest, every embedded iframe got its own 475px checker.
- **Teardown order.** `closeChecker` calls `closeColorPicker` first. Removing the iframe first left
  the scroll listener live, which requested a fresh screenshot, which brought the loupe back with
  no way to dismiss it.
- **What lints them:** ESLint does (`chrome: 'readonly'` in `eslint.config.mjs` exists for these
  files; `npx eslint public/app` is clean). Prettier does **not** — `public` is in
  `.prettierignore`, and with `--ignore-path /dev/null` both files would be reformatted (verified
  4 September 2026). Match the file by hand: tabs, single quotes.
- After editing either file or the manifest, click **Reload** on the extension card in
  `chrome://extensions`; after editing `src/`, rebuild and reload the page the checker is open on.

---

## Formatting and linting

- **Prettier 3.9 with no `.prettierrc`.** Tabs and single quotes come from `.editorconfig`
  (`indent_style = tab`, `quote_type = single`); Prettier honours it — `--no-editorconfig` flips
  the output to double quotes (verified). Trailing commas and the 80-column width are Prettier's
  defaults. `package.json` and `*.yml` are two-space per `.editorconfig`. `npm run format` fixes;
  `format:check` is the gate.
- **The lint chain runs in this order and stops at the first failure:**

    ```bash
    npm run lint        # = lint:ts && lint:js && lint:css && format:check
    npm run lint:ts     # tsc -p tsconfig.json --noEmit && tsc -p tsconfig.node.json --noEmit
    npm run lint:js     # eslint .
    npm run lint:css    # stylelint "src/**/*.css"
    ```

- **ESLint 9 flat config** (`eslint.config.mjs`), in layer order: `@eslint/js` recommended,
  `typescript-eslint` recommended (not type-aware), `eslint-plugin-react` recommended +
  jsx-runtime, `eslint-plugin-react-hooks` 7 recommended, `eslint-plugin-jsx-a11y` recommended,
  project rules, then `eslint-config-prettier` last so no formatting rule fights Prettier. ESLint
  10 was tried and rejected on 4 September 2026 because `eslint-plugin-jsx-a11y` 6.10 does not
  declare it as a peer, and `eslint-plugin-react` 7.37 does not either (11 September 2026); retry
  when both do — `docs/GIT.md` §Dependabot has the check.
- **`eslint-disable` is almost never the answer.** There are zero `eslint-disable`,
  `stylelint-disable`, `@ts-ignore` or `@ts-expect-error` comments in the tree (grep,
  4 September 2026). The only relaxations are in `eslint.config.mjs`, scoped to `test/**` and
  `playwright.config.ts`, with a comment saying why (Playwright fixtures destructure `{}` and take
  a `use` callback that looks like a hook). That is the order of preference: fix the code; else a
  scoped config entry with a reason; else a file-level disable with a reason. A line-level disable
  is a review finding.

---

## Quality gates

The pre-push suite, green before every push:

```bash
npm run lint && npm run build && npm run test:e2e
```

`.github/workflows/ci.yml` runs the same three on `ubuntu-latest` (plus `npm ci` and
`npx playwright install --with-deps chromium`) on every PR and push to `main`. Its display name,
`Lint, build, e2e`, has been a required status check on `main` since 11 September 2026 (first green
run: PR #28), alongside Alex's approval.

Worth knowing about the members:

- **Only CI proves the case-sensitive checkout.** A Mac cannot (see Files and naming).
- **`npm run build` prints `A PostCSS plugin did not pass the 'from' option`.** Benign: Vite's
  bundled postcss-modules re-parses files pulled in by cross-file `composes`; it is not the inline
  plugins and not something to "fix" in `vite.config.ts`.
- **The e2e suite is the only test.** 20 Playwright tests in `test/e2e/`, loading `build/` into a
  headless Chromium (`channel: 'chromium'`, `--load-extension`) and driving the real content
  script → service worker → iframe flow; the picker tests use the patched-manifest fixture
  (`test.use({ patched: true })`). Not
  covered: a real toolbar click / `activeTab` grant, the error popup UI, incognito, the clipboard's
  failure path, the Web Store package, Safari — though the share button's clipboard value is
  asserted since 12 September 2026. There are no unit tests; see `docs/TESTING.md`.
- **`npm test` is build + e2e**; `test:e2e` alone assumes `build/` is current.

### Verify a gate can fail

A gate that has never failed is indistinguishable from one that cannot. When adding or
reconfiguring one, plant a violation, watch it fail, then remove it — in a scratch file, not the
working tree. Done on 4 September 2026 for the rules this document leans on: a planted
`margin-left` and `!important` produced two stylelint errors (`csstools/use-logical`,
`declaration-no-important`); a planted `setN(1)` inside `useEffect` produced
`react-hooks/set-state-in-effect`; Prettier with `--no-editorconfig` produced double quotes.

The counter-example is the media-query comparator: it passed `tsc`, ESLint, stylelint, Prettier
and `vite build` while emitting the wrong cascade, because no gate reads emitted CSS order. Where a
gate cannot see a failure, the check is a human reading the output, and this document says so
rather than implying coverage.

---

## When to adjust rules

- If a rule produces unreadable workarounds, flag it in the PR; do not suppress it silently.
  Adjust the config, with a comment, in the same change.
- A rule is removed by deleting it and saying why in the same change — `stylelint-order` went on
  4 September 2026 because no order rules had ever been configured, and the reason travels with
  the removal.
- Do not add a rule for a problem that has not happened here. Every rule above cites its incident.
- The excuses that precede breaking one are catalogued in `docs/RATIONALIZATIONS.md`.

### Deliberately not adopted

| From           | Rule                                          | Re-entry condition                                                                                            |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| moe/tamaclaude | Complexity limits, `eslint-plugin-functional` | A file a DA review flags as unreadable for length twice.                                                      |
| moe/tamaclaude | `eslint-plugin-boundaries` tier enforcement   | The first upward import (an atom importing a molecule) that reaches review.                                   |
| moe            | Import-sort plugin                            | Ordering flagged in review more than once; today the files agree by hand.                                     |
| tamaclaude     | `knip` dead-export check                      | Dead code found by hand a second time (dead CSS and dangling `styles.*` references went on 4 September 2026). |
| moe/tamaclaude | Zod at trust boundaries                       | The app parses anything beyond `localStorage` — e.g. a Safari `browser.*` shim.                               |
| moe            | TSDoc on public API, `Result` union           | Nothing is published and nothing returns an expected failure; none foreseen.                                  |
| tamaclaude     | Co-located `*.test.ts`                        | Unit tests for `src/utils/color-utils.ts` (next workstream in `PROGRESS.md`).                                 |
| nas-stacks     | Compose, shell, Python and secrets sections   | No equivalent surface: no secrets, no deploy target.                                                          |

---

## See also

- `docs/ARCHITECTURE.md` — the three execution contexts and the manifest reasoning
- `docs/DEVELOPMENT.md` — how a change moves from edit to the Web Store
- `docs/TESTING.md` — the e2e suite, what it proves and what it cannot
- `docs/GIT.md` — commit format (`<type>: CC-<n> - <gitmoji> Description`) and branches
- `docs/REVIEW-PATTERNS.md` — the 4 September 2026 findings these rules cite
- `docs/RATIONALIZATIONS.md` — the excuses that precede breaking one
- `docs/SELF-REVIEW.md` — the pass these conventions feed
