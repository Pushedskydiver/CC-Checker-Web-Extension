# Progress

Living state document — current state, what's next. Session-by-session detail archives out to
`docs/history/SESSIONS.md` (mechanics: `docs/DEVELOPMENT.md` §Session handoff).

## Next workstreams (after Session 2)

Updated 11 September 2026, end of Session 2 — **the CRA → Vite migration on `feat/vite-migration` is finished and
verified, and the CLAUDE.md / docs / agents set has been ported in.** As of 11 September 2026 all of it is
committed on the local `feat/vite-migration` branch (six commits, `84dbc5f`..`5b92bde`, tree clean) but **not
pushed** (see "Loading instructions").

1. **Land the migration.** Push `feat/vite-migration`, open a PR against `main`, let the new CI run, make its
   `quality` check a required status check once it is green, then Alex merges.
2. **Release 1.7.0.** After merge: check the currently published version in the Chrome Web Store dashboard,
   `npm run package`, upload `cc-checker-1.7.0.zip`, tag `v1.7.0`. Merged is not published.
3. **Close the eight obsolete Dependabot PRs** (#18–#25, 2024, against the old webpack tree) after the merge.
4. **Unit tests for `src/utils/color-utils.ts`** (vitest) — the re-entry condition for mutation testing.
5. **Safari** — stated goal, nothing started. Start from `docs/ARCHITECTURE.md` §Safari.

### Commit sequence as landed on 11 September 2026

One commit per line, in this order, plus a sixth (`5b92bde`) that stops tracking `.vscode/settings.json` — `git add`
refuses paths under an ignored directory, so the removal missed commit 2 and that commit carries one machine's
editor colours in history.

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

## Session 2 — 11 September 2026 (continuation after the session limit)

**Done:** the docs fact-check that the limit interrupted on 4 September finished — every one of the 15 prose files
(CLAUDE.md, README.md, ten `docs/*.md`, three `.claude/agents/*.md`) was claim-checked at HEAD and cross-checked
for links, shared facts and duplicate passages; 40-odd wording corrections landed in the files themselves.
Follow-ups from that pass: `--foreground-color` in `src/styles/globals.css` normalised to `#222222` so it is
byte-equal to `DEFAULT_FOREGROUND`; `playwright.config.ts` added to the "both" row of the CLAUDE.md review-trigger
table so the table and `copilot-surrogate.md` agree. Pre-push suite re-run after both: lint (tsc ×2, ESLint,
stylelint, prettier) green, build green, e2e 18/18.

**Still open, unchanged from Session 1:** nothing is committed or pushed; the commit sequence above still applies.
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
typescript-eslint (the TS team's documented layout); ESLint 9 (jsx-a11y does not declare 10); versions bumped to
1.7.0 in both files; `react-copy-to-clipboard` kept (no `clipboard-write` in the iframe); AGENTS.md is a symlink;
`PROGRESS.md` + `docs/history/SESSIONS.md` adopted from chief-clancy/moe; `docs/INDEX.md`, changesets and
copilot-instructions deliberately not adopted (re-entry conditions in `docs/DEVELOPMENT.md` §Not ported).

**Open, for Alex:** merge strategy per PR (history has merge commits); whether to enable
`delete_branch_on_merge`; the published Web Store version (unknown from here); Safari timing.

### Session 3 loading instructions

1. Read `CLAUDE.md` (auto-loaded), then this file, then `docs/DEVELOPMENT.md` once.
2. Run `git status --short` (expect clean) and `git log --oneline -7` (expect the six commits above on top of
   `f877f16`). If `origin/feat/vite-migration` exists, the push has happened; check the PR and CI next.
3. Run the pre-push suite before touching anything: `npm run lint && npm run build && npm run test:e2e`
   (`npx playwright install chromium` first on a new machine). Expect 18 passing tests.
4. Do not squash the case-rename commit into another when merging — it is easier to review alone.

## Session archive

See `docs/history/SESSIONS.md` (empty until Session 1 archives out).
