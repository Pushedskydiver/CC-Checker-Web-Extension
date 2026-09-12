# Progress

Living state document — current state, what's next. Session-by-session detail archives out to
`docs/history/SESSIONS.md` (mechanics: `docs/DEVELOPMENT.md` §Session handoff).

## Next workstreams (after Session 5)

Updated 12 September 2026, end of Session 5 — **CC-004 is under way: the brief below has been grilled, Alex
approved an ordered twelve-item plan, and PRs 1 to 4 have merged** (`8ac0bdc`, `83dec25`, `e62b069`,
`9156ff2`). **2.1.0 is published**: the public listing read `Version 2.1.0`, `Updated September 12, 2026`,
`40,000 users` when checked that day. The release is `v2.1.0` on `c5da9fc`.

1. **Code-quality deep dive, CC-004.** The approved order, and what the grill killed, are in §The approved
   plan below. PRs 1 to 4 merged, no branch open. Resume at PR 5, the `React.FC` documentation
   decision, which has no dependency. One PR at a time, `da-review` on every `src/**` change, both
   reviews wherever the `CLAUDE.md` trigger table says so, the e2e suite as the gate.
2. ~~**Store review of 2.1.0.**~~ **Done.** The store published 2.1.0 on 12 September 2026, the day it was
   submitted — found by a `copilot-surrogate` pass checking the claim that it was still under review, not by
   anyone watching. Users are on it. Nothing further; the next release repeats `docs/GIT.md` §Releases.
3. ~~**Unit tests for `src/utils/color-utils.ts`** (vitest) — folds naturally into workstream 1.~~ Absorbed:
   it is PR 7 of the approved plan, and it carries the Vitest infrastructure, a `ci.yml` step and a ten-file
   documentation sweep with it.
4. **Safari** — stated goal, nothing started. Start from `docs/ARCHITECTURE.md` §Safari. It is now also the
   re-entry condition for giving `public/app/*.js` a build and a shared `messages.ts`.
5. **Wake the sibling web app.** Not started. Alex answered a six-question list "yes to all six" on
   12 September 2026, which accepts the premise that the sibling's missing fixes are worth making; **that it
   is a workstream of its own rather than part of CC-004 was decided in-session, not by Alex** — his answer
   could not settle an either/or (see §Session 5). Confirm the shape with him before starting. `Pushedskydiver/Colour-Contrast-Checker` carries three fixes this repo made on 4 September — the
   grey-hue defect, range inputs that cannot take a `min`, and the tab keyboard handling. Three small commits
   there, not an API here. Nothing in CC-004 depends on it, so it is scheduled whenever Alex wants it.

### Brief: code quality, architecture, readability (measured 11 September 2026, `main` at `0accd3b`)

**Superseded 12 September 2026 — kept as the pre-grill record, not as instructions.** The grill disproved
four claims below: that the e2e suite already covers the poor-contrast switch (no assertion in the suite
touches a variant class or any control's resolved colour); that `@vitejs/plugin-react` 6.1 takes the React
Compiler via `babel.plugins` (that option does not exist); that the compiler forbids rule-of-hooks violations
(not at `panicThreshold: 'none'`, which is both the default and what React says production must use); and that
the import style is mixed in a way the conventions do not already mandate. Four of the six "dead exports" had
already gone in `c74071b`, and the hex-input logic is one regex with three early returns rather than a chain.
Two more are dead rather than merely imprecise: the shared-`messages.ts` paragraph still reads as a live
architecture option and the toolchain refuses it; and "`useEffectEvent` (2 sites)" counts one call plus its
import, so there is one site. §The approved plan below is the authority and carries the evidence; read this only for what was measured on
11 September.

Facts, not impressions — re-measure before acting; the commands are one-liners.

- **Size.** 31 `.ts/.tsx` files, 1,894 lines; 25 CSS modules. Largest: `src/context.tsx` 221 lines,
  `color-controls.tsx` 138, `icon.tsx` 120, `cta.tsx` 105, `useTabbed.ts` 92.
- **`src/context.tsx` does five jobs:** owns the colour state, derives contrast/level/dark on every render,
  reads and writes `localStorage`, exposes the actions (`handleContrastCheck`, `reverseColors`, `saveColors`,
  `updateView`), and bridges `chrome.runtime.onMessage`. Candidates: a pure colour model (a reducer, or
  `useSyncExternalStore` over a tiny store) with persistence and the message bridge as separate hooks; a typed
  action API instead of `handleContrastCheck(value, name: string)` dispatching on `'background' | 'foreground'`.
- ~~**One pattern is copied 16 times across 12 files:**~~ 15 times across 12 files as of PR 3, which
  deleted one with `LinkButton`. `isPoorContrast && !isBackgroundDark ? styles.xDark :
undefined` and its `Light` twin (grep `isPoorContrast && !isBackgroundDark` under `src/`). Two structural
  fixes to weigh: a `useThemeClass(styles)` hook, or — probably better — the provider sets
  `data-contrast="poor"` / `data-scheme="dark"` on `document.body` once and the CSS modules select on them,
  removing the JavaScript branch entirely. Either way the e2e suite already covers the visible outcome.
- **React 19 in use today:** Context rendered as its own provider, `useEffectEvent` (2 sites). Not in use
  anywhere: `useMemo`, `useCallback`, `memo`, `useReducer`, `use`, `useSyncExternalStore`. That absence is
  exactly what **React Compiler** exists for: `babel-plugin-react-compiler` 1.0.0 is published and
  `@vitejs/plugin-react` 6.1 takes it via `babel.plugins`. Run `npx react-compiler-healthcheck` first, then
  enable it, then measure — bundle size (`build/assets/index-*.js`, 259.74 kB before), e2e 18/18, and a
  before/after render count on the slider path if it is worth the instrumentation. A compiler that changes
  nothing observable is still worth having for what it forbids (it fails on rule-of-hooks violations).
- **`React.FC` in 25 files** — `docs/CONVENTIONS.md` §TypeScript and React currently mandates it. Decide once: keep, or
  move to plain typed functions (the React docs' current default). A convention change is a doc PR first.
- **`color-controls.tsx`:** the hex-input acceptance logic is a chain of regexes and early returns. Extract
  `parseColorInput(value): ColorTuple | null` into `src/utils/`, unit-test it (vitest — the first unit tests
  in the repo, `docs/TESTING.md` §Future), then the component is a form.
- **Message names live in three places** (`content.js`, `background.js`, `src/`) as string literals, and the
  two `public/app/*.js` files are untyped and unbundled. An architecture option, not a quick win: build them
  from TypeScript as extra Vite entries sharing one `messages.ts`. It changes the manifest paths and the
  packaging, so it needs its own spec — and the store rejection of 11 September is the reminder that manifest
  changes get tested by uploading.
- **`react-copy-to-clipboard`** is the last class-component dependency. ~~The way out is
  `allow="clipboard-write"` on the iframe `content.js` creates, then `navigator.clipboard.writeText`.
  Spike it with an e2e test that reads the clipboard back.~~ Corrected 12 September 2026: that attribute
  changes nothing here, and a host page can revoke the async API anyway while `execCommand` keeps working
  (`docs/ARCHITECTURE.md` §Deliberately not changed carries the measurements). The dependency goes instead
  by importing the `copy-to-clipboard` function it wraps — already resolved in the lockfile, ships its own
  types — which drops the last class component with no change to `content.js`. That swap also fixes a
  defect found on the way: the wrapper calls `onCopy` whatever the copy returned, so a failed copy is
  announced as "URL added to clipboard" in a `role="status"` region. The clipboard read-back the old spike
  wanted does work: the suite gained two clipboard assertions in PR 4 (12 September 2026) — the
  share button's value, and that a refused copy announces nothing — green three consecutive local
  runs on macOS, and green on `ubuntu-latest` in PR 4's own CI run — `real clipboard (1.3s)`,
  `refused copy announces nothing (1.4s)`, `20 passed (18.1s)`. That settles the open question from
  PR 43, which had one agent's Linux-container run and no reproduction.
- **Dead exports** flagged on 4 September and left alone (`isHsl`, `isRgb`, `colorToRgb`, `getColorValue`,
  `LinkButton`, `TIconName`) — re-check with `npx knip` and delete what is still unused.
- **Readability sweep, last:** import style is mixed (`~/` alias vs relative), `icon.tsx` is an inline SVG
  sprite, `useTabbed` and the `Tab`/`Panel` pair carry refs through props. Judge these after the structural
  items, not before — they are the ones most likely to be solved by the items above.

Out of scope for this workstream: APCA (`feat/CC-003-apca-3`, Alex may never add it), Safari, and any
manifest or permission change.

### The approved plan (CC-004), approved by Alex 12 September 2026

Measured against `main` at `94cd658`. The Reviews column is a **prediction** of which `CLAUDE.md` trigger
fires, not a record — "both" means `da-review` and `copilot-surrogate`, and a PR that crosses 200 changed
lines fires both whatever its paths. Row 2 is the worked example: predicted surrogate-only, it came to 232
lines and fired both — 232 at the time that was measured, 305 by the time it merged. Row 10 is one concern
in two PRs, so the plan is twelve numbered items in thirteen
pull requests.

| #   | PR                                                                                  | Reviews   | After |
| --- | ----------------------------------------------------------------------------------- | --------- | ----- |
| 1   | ✅ Stop a missing output directory masking the real build error (#42, `8ac0bdc`)    | both      | —     |
| 2   | ✅ Correct the documented route off `react-copy-to-clipboard` (#43, `83dec25`)      | both      | —     |
| 3   | ✅ Delete the dead `LinkButton`, `TLinkButton` and `TIconName` (#44, `e62b069`)     | da-review | —     |
| 4   | ✅ Stop announcing a failed copy as a success; drop the wrapper (#45, `9156ff2`)    | both      | 2     |
| 5   | Replace the `React.FC` rule with plain typed functions (docs)                       | surrogate | —     |
| 6   | Convert 31 signatures in 25 files + the three drift renames                         | da-review | 5     |
| 7   | Add Vitest, the first colour-utility tests, a `ci.yml` step, the ten-file doc sweep | both      | —     |
| 8   | Extract the hex-input parser to `src/utils/`, with tests                            | da-review | 7     |
| 9   | Pin the poor-contrast colour switch with a test that can actually fail              | both      | —     |
| 10  | Move the poor-contrast variant into CSS — atoms, then molecules and organisms       | da/both   | 9     |
| 11  | Typed action API, message bridge as its own hook, real payload validation           | da-review | —     |
| 12  | Deferred: context reducer or external store, justified by its own unit tests        | da-review | 7, 11 |

**What the grill killed, each recorded with a re-entry condition rather than built:**

- **React Compiler.** `@vitejs/plugin-react` 6.1.1 has no `babel` option, so the brief's mechanism does not
  exist. There are two seams, not one, and they are separate implementations: `react({ compiler: true })`
  does `await import('oxc-transform-react')` — the Rust port — and errors without it
  (`dist/index.js:201-208`); `babel-plugin-react-compiler` is reached only through the plugin's exported
  `reactCompilerPreset` (`dist/index.js:46`) plus `@rolldown/plugin-babel`. All three are optional peers and
  **none is installed or in `package-lock.json`**. The cost, measured on the Babel route in a scratch clone
  on 12 September 2026, is 13,145 bytes (259,741 → 272,886, +5.06%); `panicThreshold` is a
  `babel-plugin-react-compiler` option, it defaults to `'none'`, React's docs say production must always use
  `'none'`, and at that setting a planted conditional hook built green and silent. Whether
  `oxc-transform-react` honours `panicThreshold` at all is **unchecked**. What is checked: `npm run lint:js`
  already errors on a conditionally-called hook inside the required check, so the compiler forbids nothing
  new. Re-entry: a measured render problem in the panel, or a mode that warns on skipped components without
  failing the build.
- **A shared `messages.ts` built as extra Vite entries.** Refused by this toolchain — two inputs against
  `codeSplitting: false` gives `[INVALID_OPTION]`, library mode refuses multiple entries with iife — a
  content script cannot `import` as a classic script, and bundling scopes the `isRestrictedUrl` global the
  first e2e test reads. No message name has ever been renamed. Re-entry: the Safari `browser.*` shim.
- **Other React 19 features.** Considered; none earns its place. `forwardRef`, `memo`, `useDeferredValue`,
  `useTransition` and `Activity` are all absent and none answers a problem that has occurred here.
- **The import-style sweep.** It contradicted a standing rule: 42 `~/` imports, 27 relative non-CSS, 24
  relative CSS and **zero** cross-tier relative imports is exactly what `docs/CONVENTIONS.md` mandates, and
  that section says not to convert existing ones.
- **A shared package with the sibling web app.** Between the two `color-utils.ts`, a longest-common-
  subsequence run gives 39 shared lines, 27 of them non-blank and 16 carrying more than a brace or a bare
  `return` (`difflib.SequenceMatcher`, 12 September 2026; an earlier "36" in this file counted unified-diff
  context lines, which measures nothing, and is withdrawn). Of 21 same-named component files, **one** is
  byte-identical — `tabbed.tsx`, and it sits at `02-molecules/` in the sibling against `03-organisms/` here,
  so it is not even in the same tier. The domain rule has already forked too: the web app stabilises at six
  saved pairs, this repo slices to five. Re-entry, both halves required: the second
  time a colour-utility fix has to be hand-applied there, **and** the sibling has a test runner. PR 7 folds in
  one cheap measurement — run the new unit tests against a copy of the sibling's file — which produces
  evidence and commits to nothing.
- **Adopting `knip`.** Run it once for PR 3 and stop. It reports five unused exports and eight unused types,
  most of them used inside their own file, plus `public/app/*.js` as unused files it cannot resolve from the
  manifest.

**Recorded as known behaviour, not fixed:** `copy-to-clipboard`'s last-resort path calls `window.prompt` from
inside the cross-origin panel, and Chrome does not block it — observed live 12 September 2026. Unavoidable
while the library is used; Playwright auto-dismisses dialogs, which is why no test has ever seen it.

### Commit sequence as landed on 11 September 2026

One commit per line, in this order, plus a sixth (`5b92bde`) that stops tracking `.vscode/settings.json` — `git add`
refuses paths under an ignored directory, so the removal missed commit 2 and that commit carries one machine's
editor colours in history — and a seventh (`963659a`) updating this file. Seven in all.

1. `fix: CC-002 - 🐛 Normalise component directory casing in the git index` (the staged `01-Atoms` → `01-atoms`
   renames; a Linux checkout could not build before this).
2. `chore: CC-002 - 🔧 Replace CRA leftovers with ESLint 9, TS 6/7 side-by-side, scripts and configs`
   (package.json, package-lock.json, eslint.config.mjs, stylelint.config.mjs, tsconfig.node.json, vite.config.ts,
   .nvmrc, .gitignore, .editorconfig untouched, `_config/` and `types/` removed, `.vscode/` untracked,
   dependabot.yml moved, `.github/workflows/ci.yml`).
3. `fix: CC-002 - 🐛 Fix runtime regressions found while verifying the migration` (public/app/*.js,
   public/manifest.json, index.html, public/error.html, src/** — see `docs/REVIEW-PATTERNS.md` for the list).
4. `test: CC-002 - ✅ Add Playwright end-to-end suite that loads the built extension` (playwright.config.ts, test/).
5. `docs: CC-002 - 📝 Port CLAUDE.md, docs/ and .claude/agents from the sibling repos` (CLAUDE.md, AGENTS.md
   symlink, README.md, docs/**, .claude/agents/**, PROGRESS.md).

## Session 5 — 12 September 2026 (code-quality workstream: model choice, grill, plan, four PRs)

**Model choice first, at Alex's request** — he asked for a recommendation with "strong, real evidence" before
any agent was spun up. Settled on **Opus 5 at effort `high`, ultracode off**, with the three adversarial
agents pinned to Fable 5.1. The evidence: Anthropic's own guidance is Opus 5 first and Fable only "when your
evals on Claude Opus 5 at higher effort still fall short"; on SWE-bench Pro at default effort Opus 5 matched
Fable 5.1 within noise (91.7% against 92.1%) at about 15% less per solved task; and for work that fits in one
context "the coordinator's model alone at lower effort came out ahead" in every case Anthropic measured, which
is this repo at 1,894 lines. Alex's other repos already run this process on Opus 5. Recorded so it is not
re-litigated: this repo's own `effortLevel` was `xhigh` globally, and ultracode suppresses the large-workflow
warning, which is why both were turned down rather than left.

**Done:** the brief was grilled by three `spec-grill` discovery rounds (structural, tooling, cross-repo),
then turned into the plan above, which Alex approved. **The verification round is worth describing exactly,
because the first attempt did not run.** Four fresh-context verifiers were dispatched on Fable 5.1 and all
four died on HTTP 429 before doing any work (pattern 3 below). It was re-dispatched as **two** fresh-context
agents on Opus 5 — one on the build-harness claims, one on the clipboard claims — and the remaining claims
were settled by the coordinator inline with `grep`, `diff` and `node`. That inline half is
self-verification, which `docs/DEVELOPMENT.md` §Verification rounds is explicit is not the same thing as an
independent check; it is recorded as what happened rather than counted as a round. The two agents plus the
`da-review` and `copilot-surrogate` passes on every PR are the independent evidence.

**All four PRs merged the same day**, each through the full gate (architectural → DA → self → PR) with both
reviews wherever the trigger table said so: #42 `8ac0bdc` the build-error masking fix, #43 `83dec25` the
clipboard route correction and this plan, #44 `e62b069` the dead exports, #45 `9156ff2` the failed-copy
announcement. Three of the four fixed defects **the brief did not know about**; only #44 came from it.
Across the session the review passes falsified **fourteen** claims of mine, nine of them in #43 alone.

**Two of the six approval questions were either/ors that "yes to all six" could not settle, so they were
decided and stated rather than left ambiguous:** the pre-push suite becomes **four commands with the unit
tests second**, before the build, because they need no build and fail in milliseconds — hiding them inside
`npm test` while the documented gate skipped them would be the gate-that-cannot-see-a-failure problem
`docs/CONVENTIONS.md` warns about; and **waking the sibling web app is its own workstream** (item 5 above),
not part of CC-004, since nothing here depends on it.

**Major novel patterns Session 5:**

1. **The brief's own proof claim was false, and it changed the order of work.** It asserted "the e2e suite
   already covers the visible outcome" of the poor-contrast switch. It does not: there is no assertion
   anywhere in the suite on a variant class or any control's resolved colour, so by inspection all sixteen
   branches (fifteen since PR 3) could be deleted with the suite still green. The control — delete one branch, watch a test go
   red — was **not** run, because there is no test to redden; that absence is the finding. The refactor's first PR is therefore a failing test, not the refactor.
   A brief that cites coverage is not evidence of coverage — read the assertions.
2. **The repo already held the fact that killed the documented clipboard route, two documents away.**
   `docs/DA-REVIEW.md` recorded that `getURL('index.html')` returns a per-session GUID origin redirected to
   the static one; `docs/ARCHITECTURE.md` said the way out was `allow="clipboard-write"`. Both sentences
   stood for eight days and nobody joined them. That join is exactly what the `copilot-surrogate`
   cross-context pass exists for, and it had never been run across those two files together.
3. **Four concurrent Fable 5.1 subagents exhausted the session limit before doing any work.** All four
   verification agents died on HTTP 429; the discovery round's output survived only because it had already
   returned. Same class as `docs/REVIEW-PATTERNS.md` #10 by a different mechanism, so it is n=2 and the rule
   is promoted rather than restated here: `docs/DEVELOPMENT.md` §Scale the fan-out now carries the
   concurrency number and this dated instance.
4. **This session shipped a false "suite green" claim in a commit body.** `777fd96` said "Pre-push suite
   green: lint, build, e2e 18/18" when Prettier was rejecting `PROGRESS.md`, because the message was written
   before `format:check` ran. Corrected in `c780745` rather than amended. It is the first instance here of
   `docs/SELF-REVIEW.md` §Before you write the word verified failing to hold, and the cause is the weak form
   itself: every commit body on this branch asserts the suite without pasting what it printed. The fix is
   mechanical — run the chain, paste its last lines, then write the sentence.
5. **A review finding can be disproved, and that needs a probe too.** The DA pass wanted the new build
   guard tightened against a case a probe then showed cannot happen. Deferring a finding is a claim like any
   other: it carries evidence or it is a dismissal. (Event, PR #42; the rule is the second sentence.)
6. **Promoting a transitive dependency to a direct one exposed a major that would have silently undone
   the fix it shipped with — through a PR Claude is delegated to merge.** `copy-to-clipboard` was already
   in the lockfile under the React wrapper; making it direct put it in the weekly
   `production-dependencies` group, where its 4.x would have made the new guard a no-op and silenced the
   failure path with it. The DA pass swapped 4.0.2 in and **every gate stayed green**, which under
   `docs/GIT.md` §Who merges makes it auto-mergeable. Mechanism, the type-annotation gate and what taking
   the major would need are in `docs/GIT.md` §Dependabot. **Generalise: when a dependency moves from
   transitive to direct, ask what its next major does to the code that now calls it directly.**
7. **A stale test run under-reported the count and it reached six files.** A full run printed `19 passed`
   immediately after a rebuild when `--list` said 20. The number went into a documentation sweep before
   anyone re-derived it. Counts come from `npx playwright test --list` and `grep -c "^\ttest("`, which
   agree with each other, not from the tail of a run.
8. **Stage by path while review agents are running.** The surrogate pass saw
   `test/e2e/zz-scratch.spec.ts` in the working tree mid-run — the DA pass's own reproduction, removed
   moments later. It was never committed, and git records no staging command so whether a broad `git add`
   would have caught it is not provable after the fact; the habit is the finding. Check
   `git status --untracked-files=all` before staging.

## Session 4 — 11 September 2026 (release)

**Done:** the pre-release check the docs prescribe — read the published version before uploading — was done
against the public listing (https://chromewebstore.google.com/detail/colour-contrast-checker/nmmjeclfkgjdomacpcflgdkgpphpmnfe), which showed
**2.0.1 with 40,000 users**. `main` had never been above 1.7.0 and no commit in git carries 2.0.1, so 1.7.0
would have been rejected; the release ships from `main` as **2.1.0**. Where the store's 2.0.1 build came from is
**not recorded in git** — the only 2.x manifest is 2.0.0 on `feat/CC-003-apca-3`, and this session first wrote
that up as "the store ships the APCA branch". **Alex corrected it: APCA was never released**, and he is not
adding it. The provenance of 2.0.1 stays unknown; the docs now say so rather than name a branch. Both version files bumped in this
session's release PR; the docs that said "1.7.0 was chosen safely above anything uploaded" now say what happened.
`npm run package` gives `cc-checker-2.1.0.zip` (dotfile-free, e2e 18/18 against the unzipped artefact).

**Upload rejected first:** the store reported `favicons/favicon-48x48.png` and `favicon-72x72.png` "missing from the
uploaded package". The files were byte-identical to the ones inside the store's published 2.0.1 CRX (downloaded and
diffed), whose manifest used the same `./favicons/…` paths. A first theory — the two files were the only entries `zip`
had left _stored_ uncompressed — was disproved: Chrome's own `--pack-extension` stores them too, and a fully deflated
zip was rejected identically. `scripts/package.mjs` (fflate, PR #39) stays because it removes the system `zip`
dependency and makes the artefact reproducible, not because it fixed this.

**Upload accepted:** the zip built from the tree in `c5da9fc` (manifest paths without `./`, plus 16/32/96/128 icons — the
store documents 128 as mandatory and the manifest had lacked one since 1.5.0) was accepted by the dashboard on
11 September 2026 and **submitted for store review** the same day. The two changes went in together, so the store's
exact trigger is not isolated; what is known is that the container was not it (an unchanged-manifest zip was rejected
from Info-ZIP, Python and fflate alike) and the manifest was. `v2.1.0` is tagged on `c5da9fc`, the packaged commit,
per `docs/GIT.md` §Releases. **Published is a further step:** the store's review has to pass before users get 2.1.0;
until then 2.0.1 is what they run.

**Not done, deliberately:** nothing beyond the tag until the store publishes the reviewed build. The
`feat/CC-003-apca-3` branch and its stash are untouched.

**Later the same day:** #40 merged (`0accd3b`); 2.1.0 submitted for store review with a corrected listing description
(saved colours are capped at 5, not 20) and test instructions. Alex's Dependabot delegation is now written down
(`docs/GIT.md` §Who merges). Handoff for the code-quality workstream written above.

**Corrected in this session:** the APCA attribution above went into six docs, a commit message (`2f50beb`) and PR
#37's body before Alex read it. The commit and PR text stand as written (history is not rewritten); the docs are
fixed in the follow-up PR. Lesson, now in `docs/DA-REVIEW.md` §Permission audit: when the published build is not in
git, write "unknown" — do not infer it from the nearest branch.

## Session 3 — 11 September 2026 (landing)

**Done:** PR #28 pushed, CI green on its first Linux run (lint, build, 18/18 e2e in 56s), merged by Alex as
`08542e6`. The eight 2024 Dependabot PRs (#18–#25) closed with their branches. Dependabot woke up once its config
was on the default branch: #29 (`actions/checkout` 7) and #30 (`actions/upload-artifact` 7) merged, as did #31
(`actions/setup-node` 7) once Dependabot had rebased it; #33 (`fast-uri` 3.1.7, a security bump closing the
audit's one high finding) merged as `6b05529`; #32 (the grouped dev-dependency bump) failed `npm ci` because it
lifted ESLint to 10 while the peer ranges of `eslint-plugin-jsx-a11y` 6.10 and `eslint-plugin-react` 7.37 stop at
9 (the DA review's simulation showed react blocks it too once jsx-a11y is out of the way). `dependabot.yml` now
ignores major bumps of `eslint` and `@eslint/js` (PR #34); once that was on `main`, `@dependabot recreate` on #32
made Dependabot close it ("updatable in another way") and open #35 — six packages, `eslint` and `@eslint/js`
absent, CI green — merged as `cb1c325`. Alex delegated the Dependabot handling ("I will let you do the rest").
`main` at `cb1c325` re-verified locally after `npm ci`: lint, build, e2e 18/18. Zero open PRs.

**Gotcha found on the way:** the `@playwright/test` bump in #35 (1.62 → 1.63) wants a newer Chromium build than
the local cache had, so every e2e test failed with "Executable doesn't exist" until `npx playwright install
chromium` was rerun. CI never sees this because it installs fresh. The "once per machine" wording in the docs
now says "and again after a `@playwright/test` bump".

**Repo settings changed, all via `gh api` and re-read afterwards:** `Lint, build, e2e` required on `main`
(`strict` off; review rule, stale-review dismissal, no force-push/deletion unchanged; `enforce_admins` still off);
`delete_branch_on_merge` on; auto-merge and "update branch" allowed; merge-commit and squash titles set to the PR
title with the PR body as the message; secret scanning and push protection on (public repo, free).

**Local note:** with `core.ignorecase=false` on a case-insensitive disk, checking out any commit older than the
casing fix (e.g. `feat/CC-003-apca-3`) collides with the lowercase files; fast-forward refs without checkout, or
work from a fresh clone.

## Session 2 — 11 September 2026 (continuation after the session limit)

**Done:** the docs fact-check that the limit interrupted on 4 September finished — every one of the 15 prose files
(CLAUDE.md, README.md, ten `docs/*.md`, three `.claude/agents/*.md`) was claim-checked at HEAD and cross-checked
for links, shared facts and duplicate passages; 40-odd wording corrections landed in the files themselves.
Follow-ups from that pass: `--foreground-color` in `src/styles/globals.css` normalised to `#222222` so it is
byte-equal to `DEFAULT_FOREGROUND`; `playwright.config.ts` added to the "both" row of the CLAUDE.md review-trigger
table so the table and `copilot-surrogate.md` agree. Pre-push suite re-run after both: lint (tsc ×2, ESLint,
stylelint, prettier) green, build green, e2e 18/18.

**Still open, unchanged from Session 1** (superseded in Session 3 — merged as `08542e6`)**:** nothing is committed or pushed; the commit sequence above still applies.
Two loose ends the cross-check left for Alex: `copilot-surrogate.md`'s own trigger also names comment-block edits
in `public/app/*.js` (a path table cannot express that — leave as a superset or drop it), and `docs/TESTING.md`
cites `fixtures.ts` by line number, which will drift.

## Session 1 — 4 September 2026 (with a break at the session limit; 3–4 September)

**Ask:** work out how far the Vite migration had got, finish it, prove the extension still works, then bring over
the Claude docs/agents/protocols from moe, chief-clancy and nas-stacks.

**Found:** the migration was functionally complete (build, tsc, stylelint green) but not finished: no ESLint
(CRA's was lost), a stale `.nvmrc`, an unpushed branch, and — the important one — the git index still tracked
`src/components/01-Atoms/…` while the disk and every import were lowercase, so any case-sensitive checkout failed
to build. A 139-agent audit workflow was overkill for this repo and hit the session limit twice; five finders plus
hands-on reproduction in a headless Chromium found everything that mattered.

**Fixed (all verified by the new e2e suite, 18/18, plus lint/build):** index casing; the media-query sort
comparator that reversed the mobile-first cascade (desktop was stuck on two columns); NaN hue on greys; range
inputs that could not reach 0/1; the panel injecting into every child iframe; picker listeners outliving the
panel; every pick handled twice; the copy/share confirmation hidden from screen readers; `<ul>` of buttons without
`<li>`; tabs without `aria-controls`/wrap-around; `showErrorPopup` able to strand `error.html` as the popup; plus
the hygiene list in `docs/REVIEW-PATTERNS.md`.

**Decided:** TypeScript 7 native `tsc` stays, with `typescript` aliased to `@typescript/typescript6` for
typescript-eslint (the TS team's documented layout); ESLint 9 (jsx-a11y does not declare 10 — nor, found in Session 3, does eslint-plugin-react); versions bumped to
1.7.0 in both files (superseded by 2.1.0 in Session 4); `react-copy-to-clipboard` kept ~~(no `clipboard-write` in the iframe)~~ (reason corrected 12 September 2026 — the absent attribute was never the cause; §Session 5 pattern 2); AGENTS.md is a symlink;
`PROGRESS.md` + `docs/history/SESSIONS.md` adopted from chief-clancy/moe; `docs/INDEX.md`, changesets and
copilot-instructions deliberately not adopted (re-entry conditions in `docs/DEVELOPMENT.md` §Not ported).

**Open, for Alex:** merge strategy per PR (history has merge commits); the published Web Store version (unknown
from here); Safari timing. (`delete_branch_on_merge` was resolved in Session 3: on.)

## Session 6 loading instructions

1. Read `CLAUDE.md` (auto-loaded), then this file top to bottom. §The approved plan is the workstream; the
   brief above it is the pre-grill record and several of its items are dead — trust the plan, not the brief.
2. **Archive Session 1 before writing anything.** At this handoff the detail band held exactly five
   session entries and about 8.9k tokens for the whole file, of which the detail band is roughly half —
   under both triggers — but a Session 6 entry makes six, which
   is over the five-entry trigger in `docs/DEVELOPMENT.md` §Session handoff. Compress Session 1 to a
   one-line row in `docs/history/SESSIONS.md`, which is still empty.
3. **Then confirm the state.** `git status --short` (expect clean), `git log --oneline -5 origin/main`
   (expect `9156ff2` or later), `gh pr list` (expected empty — PRs 1 to 4 all merged 12 September 2026
   and their branches are deleted; only `main` and the untouched `feat/CC-003-apca-3` remain on the
   remote). Green Dependabot PRs are delegated (`docs/GIT.md` §Who merges) — with one exception now
   written down under `docs/GIT.md` §Dependabot, `copy-to-clipboard` majors, which must go red on
   `lint:ts` and must not be merged without re-reading the guard in `copy-cta.tsx`.
4. Run the pre-push suite before touching anything: `npm run lint && npm run build && npm run test:e2e`
   (`npx playwright install chromium` first on a new machine, and again after any `@playwright/test` bump).
   Expect 20 passing tests until PR 7 adds unit tests and a fourth command.
5. **Resume at PR 5 of the approved plan**, the `React.FC` documentation decision, which has no
   dependency — one PR at a time, cutting the branch as the literal first action.
   The plan is already approved: do not re-grill it, and do not reorder it without saying why.
6. Model and agents: Opus 5 at effort `high`, ultracode off; `spec-grill`, `da-review` and
   `copilot-surrogate` on Fable 5.1, at most two at a time (`docs/DEVELOPMENT.md` §Scale the fan-out).
   **Set these at the start of the session — they are not configured.** `~/.claude/settings.json` still
   carries `"effortLevel": "xhigh"` globally and no repo-level settings file exists, so Session 5's choice
   was session-scoped and does not carry over. Settle what a shell command can settle before spending an
   agent.
7. Decision branches carried in: **(a)** the decision is that the **pre-push suite** gains a fourth
   command, `test:unit`, running second — _not_ that the unit tests hide inside `npm test`, which is what it
   rejected; open only in that Alex may revisit it once he sees the ten-file documentation sweep PR 7
   carries. Note PR #42's merged body calls that PR "PR 8" — it was renumbered to 7 when the plan was
   written down, and the plan is the authority; **(b)** whether workstream 5, the sibling's three
   missing fixes, starts before or after CC-004 finishes; ~~**(c)** whether the store has published 2.1.0~~ — settled 12 September 2026, it has. Read the
   public listing rather than assuming, next time too (`docs/GIT.md` §Releases has the URL).

## Session archive

See `docs/history/SESSIONS.md` (empty until Session 1 archives out).
