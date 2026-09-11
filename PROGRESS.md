# Progress

Living state document — current state, what's next. Session-by-session detail archives out to
`docs/history/SESSIONS.md` (mechanics: `docs/DEVELOPMENT.md` §Session handoff).

## Next workstreams (after Session 4)

Updated 11 September 2026, end of Session 4 — **the migration is merged and 2.1.0 is with the store for review**
(`v2.1.0` on `c5da9fc`; #40 merged as `0accd3b`). Alex's next ask, in his words: he is "happy the migration is
done" but wants a deep dive into code quality, project architecture and readability — the large context file,
whether React Compiler or other React 19 features help, whether the code is simple to follow.

1. **Code-quality deep dive (CC-004 suggested).** Brief below. Order of work per `CLAUDE.md`: grill the brief
   with `spec-grill`, produce an ordered PR plan, Alex approves it, then one PR at a time with `da-review` on
   every `src/**` change and the e2e suite as the gate.
2. **Store review of 2.1.0.** Nothing to do until the store publishes; then one line here. Users run 2.0.1 until then.
3. **Unit tests for `src/utils/color-utils.ts`** (vitest) — folds naturally into workstream 1.
4. **Safari** — stated goal, nothing started. Start from `docs/ARCHITECTURE.md` §Safari.

### Brief: code quality, architecture, readability (measured 11 September 2026, `main` at `0accd3b`)

Facts, not impressions — re-measure before acting; the commands are one-liners.

- **Size.** 31 `.ts/.tsx` files, 1,894 lines; 25 CSS modules. Largest: `src/context.tsx` 221 lines,
  `color-controls.tsx` 138, `icon.tsx` 120, `cta.tsx` 105, `useTabbed.ts` 92.
- **`src/context.tsx` does five jobs:** owns the colour state, derives contrast/level/dark on every render,
  reads and writes `localStorage`, exposes the actions (`handleContrastCheck`, `reverseColors`, `saveColors`,
  `updateView`), and bridges `chrome.runtime.onMessage`. Candidates: a pure colour model (a reducer, or
  `useSyncExternalStore` over a tiny store) with persistence and the message bridge as separate hooks; a typed
  action API instead of `handleContrastCheck(value, name: string)` dispatching on `'background' | 'foreground'`.
- **One pattern is copied 16 times across 12 files:** `isPoorContrast && !isBackgroundDark ? styles.xDark :
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
- **`React.FC` in 25 files** — `docs/CONVENTIONS.md` §Components currently mandates it. Decide once: keep, or
  move to plain typed functions (the React docs' current default). A convention change is a doc PR first.
- **`color-controls.tsx`:** the hex-input acceptance logic is a chain of regexes and early returns. Extract
  `parseColorInput(value): ColorTuple | null` into `src/utils/`, unit-test it (vitest — the first unit tests
  in the repo, `docs/TESTING.md` §Future), then the component is a form.
- **Message names live in three places** (`content.js`, `background.js`, `src/`) as string literals, and the
  two `public/app/*.js` files are untyped and unbundled. An architecture option, not a quick win: build them
  from TypeScript as extra Vite entries sharing one `messages.ts`. It changes the manifest paths and the
  packaging, so it needs its own spec — and the store rejection of 11 September is the reminder that manifest
  changes get tested by uploading.
- **`react-copy-to-clipboard`** is the last class-component dependency. `docs/ARCHITECTURE.md` §Permissions
  says why it stays; the way out is `allow="clipboard-write"` on the iframe `content.js` creates, then
  `navigator.clipboard.writeText`. Spike it with an e2e test that reads the clipboard back.
- **Dead exports** flagged on 4 September and left alone (`isHsl`, `isRgb`, `colorToRgb`, `getColorValue`,
  `LinkButton`, `TIconName`) — re-check with `npx knip` and delete what is still unused.
- **Readability sweep, last:** import style is mixed (`~/` alias vs relative), `icon.tsx` is an inline SVG
  sprite, `useTabbed` and the `Tab`/`Panel` pair carry refs through props. Judge these after the structural
  items, not before — they are the ones most likely to be solved by the items above.

Out of scope for this workstream: APCA (`feat/CC-003-apca-3`, Alex may never add it), Safari, and any
manifest or permission change.

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
1.7.0 in both files (superseded by 2.1.0 in Session 4); `react-copy-to-clipboard` kept (no `clipboard-write` in the iframe); AGENTS.md is a symlink;
`PROGRESS.md` + `docs/history/SESSIONS.md` adopted from chief-clancy/moe; `docs/INDEX.md`, changesets and
copilot-instructions deliberately not adopted (re-entry conditions in `docs/DEVELOPMENT.md` §Not ported).

**Open, for Alex:** merge strategy per PR (history has merge commits); the published Web Store version (unknown
from here); Safari timing. (`delete_branch_on_merge` was resolved in Session 3: on.)

### Session 5 loading instructions

1. Read `CLAUDE.md` (auto-loaded), then this file top to bottom, then `docs/CONVENTIONS.md` and
   `docs/ARCHITECTURE.md` once — the brief above cites both.
2. Run `git status --short` (expect clean) and `git log --oneline -3 origin/main` (expect `0accd3b` or later);
   `gh pr list` for anything Dependabot has queued (green ones are delegated — `docs/GIT.md` §Who merges).
3. Run the pre-push suite before touching anything: `npm run lint && npm run build && npm run test:e2e`
   (`npx playwright install chromium` first on a new machine, and again after any `@playwright/test` bump).
   Expect 18 passing tests.
4. Re-measure the brief's numbers, then dispatch `spec-grill` on the brief (discovery round, then one
   verification round) and turn it into an ordered PR plan for Alex to approve. Do not start code before that.

## Session archive

See `docs/history/SESSIONS.md` (empty until Session 1 archives out).
