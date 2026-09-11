# Progress

Living state document — current state, what's next. Session-by-session detail archives out to
`docs/history/SESSIONS.md` (mechanics: `docs/DEVELOPMENT.md` §Session handoff).

## Next workstreams (after Session 3)

Updated 11 September 2026, end of Session 3 — **the CRA → Vite migration on `feat/vite-migration` is finished and
verified, and the CLAUDE.md / docs / agents set has been ported in.** As of 11 September 2026 it is **merged
into `main`** (PR #28, merge commit `08542e6`), `Lint, build, e2e` is a required status check, and the repo
settings changed the same day are listed under Session 3 below.

1. **Release 2.1.0.** The release commit (version bump in both files) is on `main` once the release PR merges;
   `npm run package` from it gives `cc-checker-2.1.0.zip`; Alex uploads it; then tag `v2.1.0` on that commit once
   the store accepts it. Merged is not published. (Why 2.1.0 and not 1.7.0: Session 4.)
2. **Merge or close the remaining Dependabot PRs** — see Session 3.
3. **Unit tests for `src/utils/color-utils.ts`** (vitest) — the re-entry condition for mutation testing.
4. **Safari** — stated goal, nothing started. Start from `docs/ARCHITECTURE.md` §Safari.

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
**2.0.1 with 40,000 users**. `main` had never been above 1.7.0; the only 2.x in git is the manifest on
`feat/CC-003-apca-3` (2.0.0, August 2024, CRA-era, `apca-w3`, a new results UI — 2.0.1 itself was never
committed). So the store ships the unfinished APCA branch, and 1.7.0 would have been rejected. Alex's call: APCA is
not ready and may never be added, so the release ships from `main` as **2.1.0**. Both version files bumped in this
session's release PR; the docs that said "1.7.0 was chosen safely above anything uploaded" now say what happened.
`npm run package` gives `cc-checker-2.1.0.zip` (dotfile-free, e2e 18/18 against the unzipped artefact).

**Not done, deliberately:** no tag. `v2.1.0` goes on the release commit only after the store accepts the upload
(`docs/GIT.md` §Releases). The `feat/CC-003-apca-3` branch and its stash are untouched.

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

### Session 4 loading instructions

1. Read `CLAUDE.md` (auto-loaded), then this file, then `docs/DEVELOPMENT.md` once.
2. Run `git status --short` (expect clean) and `git log --oneline -3 origin/main` (expect `cb1c325` or later);
   `gh pr list` shows what Dependabot has queued since — merging green Dependabot PRs is delegated (Session 3).
3. Run the pre-push suite before touching anything: `npm run lint && npm run build && npm run test:e2e`
   (`npx playwright install chromium` first on a new machine). Expect 18 passing tests.

## Session archive

See `docs/history/SESSIONS.md` (empty until Session 1 archives out).
