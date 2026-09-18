# Git conventions

Adapted from nas-stacks', moe's and tamaclaude's `docs/GIT.md`, all of which descend from
chief-clancy's. The disciplines carry over: one vocabulary for branch prefixes and commit types, a
gitmoji table, no `--amend`, a stated list of what actually enforces the rules, and a blast-radius
list. The shape of the commit line does not — this repo has its own, and it predates this document.

What changed on the way over:

- **No changesets, no semver tooling, no npm publish, no deploy.** Nothing here is published to npm
  and nothing happens on merge. The sources' Release Flow and Deploy Flow sections become
  [Releases](#releases): a zip file and a manual Chrome Web Store upload.
- **Ticket keys.** moe says "no ticket numbers"; this repo has them. `CC-001`, `CC-002`, `CC-003`
  and `CC-004` are keys in Alex's own tracker for the two colour-contrast projects (the sibling web
  app, `Pushedskydiver/Colour-Contrast-Checker`, uses the same keys and the same commit format).
  `CC-004` is the code-quality workstream opened on 12 September 2026 (`PROGRESS.md` §The approved
  plan).
- **Gitmoji position.** chief-clancy, moe and tamaclaude put the gitmoji first (`✨ feat(scope): …`);
  nas-stacks puts it after the colon (`feat: ✨ …`). Here it follows the ticket key:
  `feat: CC-002 - ✨ Add rgb colour options, tidy up code`.
- **No label taxonomy, no squash mandate, no direct-to-`main` exception.** Each is deliberately not
  adopted; see [Deliberately not adopted](#deliberately-not-adopted) for the re-entry conditions.

Where this document describes what the repo already does, it says so and points at commits. Where
the history contradicts it, that is called out as drift with the correction; history is not
rewritten.

## What actually enforces any of this

Checked against the live repo with `gh api` on 11 September 2026, not inferred from the sources:

| Gate                             | Colour Contrast Checker                                                                                                                                                                                                                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Required reviews on `main`       | **Yes.** Classic branch protection: one approving review, stale reviews dismissed on push, force-pushes and deletions blocked. `enforce_admins` is **off**, so Alex (admin) can merge his own PRs without a second reviewer. Real for everyone else; a habit for Alex.                                                            |
| Required status checks on `main` | **Yes, since 11 September 2026.** `Lint, build, e2e` — the display name of job `quality` in `.github/workflows/ci.yml` (`npm ci`, lint, unit, build, Playwright e2e on `ubuntu-latest`) — must pass. Made required the day of its first green run (PR #28). `strict` is off, so a PR need not be up to date with `main` to merge. |
| Commit message format            | **Nothing.** No hooks of any kind — no `.husky/`, no `core.hooksPath`, no commitlint or lint-staged in `package.json`. Any subject line is accepted.                                                                                                                                                                              |
| PR title format                  | **Nothing.** `ci.yml` does not look at titles. PR #17 went in as `Feat/cc 002`, GitHub's default title from the branch name, and nothing objected.                                                                                                                                                                                |

So, apart from the review requirement and the CI check, this file is instructions, knowingly — the
weaker instrument. One thing follows: a required check proves the job passed, not that the job
covers what you changed, so read the run before merging.

The history shows why it matters. Until 11 September 2026 three PRs had ever merged — #5 (a 2020
Dependabot bump, landed without a merge commit), #13 and #17 (merge commits) — and every other
commit on `main` was pushed directly (every PR from #28 on has merged the protected way). Branch protection now blocks that path for anyone who is not an admin; this document asks
Alex to treat it as blocked for him too.

## Branch strategy

`main` is the trunk. Every branch is cut from `main` and lands back on `main` via a PR.

```
main ← feat/ | fix/ | chore/ | refactor/ | docs/ | ci/ | test/ | build/
```

### Naming

```
<type>/CC-<n>[-short-slug]
```

`<type>` is the commit type from the [types table](#types) — one vocabulary, not two. `CC-<n>` is
the ticket key; the slug is optional and tells apart branches on the same ticket. Observed:
`feat/CC-002` (behind PR #17) and `feat/CC-003-apca-3` fit; `CC-Dependencies` (behind PR #13, 2023)
predates the convention; `feat/vite-migration` (merged 11 September 2026) carried no ticket key, which
was drift, left alone mid-flight; the next branch on the ticket follows the format.

### Live branches, 11 September 2026

| Branch                | State                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                | Trunk; the migration merged into it on 11 September 2026 (PR #28, `08542e6`). Protected: one review plus the `Lint, build, e2e` check.                                                                        |
| `feat/vite-migration` | The CRA → Vite migration, the 4 September 2026 fixes and these docs. Merged and deleted, 11 September 2026.                                                                                                   |
| `feat/CC-003-apca-3`  | APCA contrast experiment. Pushed; last commit `chore: CC-003 - 🎨 Update app`, 13 August 2024. Needs rebasing onto post-migration `main` before it can be reviewed.                                           |
| `dependabot/*`        | **Bot-owned.** One remote branch per open Dependabot PR (`npm_and_yarn/*`, `github_actions/*`). Never commit to them; ask the bot (`@dependabot rebase` / `recreate`) instead. See [Dependabot](#dependabot). |

### What needs a PR

Everything. `main` is protected, and the sources' direct-to-`main` exception for small doc fixes is
not adopted: nothing here is appended to so often that a PR costs more than the reasoning it
protects, and the docs sit on the [blast-radius list](#blast-radius-docs) anyway. A typo fix is a
one-commit PR; with `enforce_admins` off it costs Alex a click.

Cut the branch as the literal first action after syncing, before any edit — moe's rule, with the
same two failure modes it exists to prevent (stacking an unmerged PR's commits under the next branch;
committing the next slice onto local `main`):

```bash
git checkout main && git pull --ff-only
git checkout -b <type>/CC-<n>-<slug>
```

## Commit messages

### Format

```
<type>: CC-<n> - <gitmoji> Description
```

Type, colon, ticket key, space-hyphen-space, gitmoji, capitalised imperative description. This is
what the repo has written since `refactor: CC-001 - ♻️ Refactor extension, fix issue with brave
browser` (29 June 2024). It is the reverse of the other repos' `<gitmoji> <type>(scope):` and not
nas-stacks' `<type>: <gitmoji>` either. It is written down rather than changed because the type leads
the line — `git log --grep '^fix:'` works — and because the sibling web app uses the identical format,
so a change here would split two histories to gain nothing.

Three eras in `git log`, and only the last is drift:

- **2019–2023: gitmoji only**, sometimes as shortcodes — `:sparkles: Add header component, make app
work as chrome extension`, `♻️ Improve accessibility and functionality`. Pre-convention; left alone.
- **2024: the full format** — `feat: CC-002 - ✨ Add rgb colour options, tidy up code`.
- **17 March 2026: five commits on `feat/vite-migration` dropped the gitmoji** (the seven that followed on 11 September 2026 carry it) —
  `chore: CC-002 - Upgrade to React 19 and Vite 8`, `refactor: CC-002 - Inline PostCSS config into
vite.config.ts`. Drift, not a second convention; not amended (see [No `--amend`](#no---amend)).

Two smaller drifts on `main`, also left in place: `bug: CC-002 - 🐛 Fix issue with header file name`
(4 July 2024) is a typo for `fix`; and 🎨 has served as a generic "I edited something" marker
(`chore: CC-002 - 🎨 Update UI`, `chore: CC-003 - 🎨 Update app`). 🎨 is not in the table below, and a
subject of the shape `Update <thing>` tells `git log` nothing — say what broke, or what this adds.

### Types

| Type       | Gitmoji | Use for                                                      |
| ---------- | ------- | ------------------------------------------------------------ |
| `feat`     | ✨      | New capability                                               |
| `fix`      | 🐛      | Bug fix                                                      |
| `chore`    | 📦      | Maintenance, config, dependency work                         |
| `refactor` | ♻️      | Restructuring, no behaviour change                           |
| `docs`     | 📝      | Documentation only                                           |
| `style`    | 💄      | Formatting, cosmetic, no behaviour change                    |
| `test`     | ✅      | Adding or changing tests (`test/e2e/**`, `src/**/*.test.ts`) |
| `ci`       | 👷      | `.github/workflows/**`, `.github/dependabot.yml` only        |
| `build`    | 🔧      | `vite.config.ts`, `tsconfig*.json`, lint tooling             |
| `perf`     | ⚡️      | Performance                                                  |

Ten types. `feat`, `fix`, `chore`, `refactor` and `style` are already in the history; `docs`,
`test`, `ci`, `build` and `perf` are added because the repo now has docs, an e2e suite, a workflow
and a build config that change on their own. Not adopted from the sources: `security` (a security
fix here is a `fix`) and `remove` — the history already uses `chore: … 🔥` for removals.

The table gives each type a default. Where a more specific gitmoji says something the type does not,
use it — the history already does: 🔥 for removing files, ⬆️ for dependency bumps (Dependabot's own
titles used it until 2024; the 2026 config produces `chore(deps): Bump …`), 🙈 for `.gitignore`. Copy the character out of this table rather than typing
one: `♻️` and `⚡️` carry a trailing U+FE0F variation selector, and the bare codepoint is a different
string that a grep will silently miss.

### Examples

All real, from `git log`:

```
feat: CC-002 - ✨ Add rgb colour options, tidy up code
fix: CC-002 - 🐛 Fix issue with rgb options being in wrong order
refactor: CC-002 - ♻️ Migrate from CRA/Craco to Vite, add extension error handling
style: CC-003 - 💄 Update tabbed styles
chore: CC-002 - 🔥 Remove app file to put back
```

### Bodies

The subject says what changed. **The body says why, what it cost, and what was tried and was
wrong.** Bodies are new here — no commit before 17 March 2026 has one, apart from Dependabot's and
the PR title GitHub pasted into the two merge commits — and the ones since are the standard to aim at.

`git show 3a106f0` (`fix: CC-002 - Sync React 19 JSX type fixes to uppercase-path Git entries`) is
the worked example, and an honest one. Its body says the case-insensitive macOS filesystem had Git
tracking both `01-Atoms` and `01-atoms` as separate entries, and that the commit syncs fixes already
made under the lowercase paths to their uppercase twins. The mechanism was right; the fix was wrong.
The uppercase entries should not have existed, and on 4 September 2026 a fresh Linux clone could not
build (`UNRESOLVED_IMPORT` plus 21 TS2307 errors) until the tree was re-indexed with
`git rm -r --cached src/components && git add src/components` and `core.ignorecase=false` was set.
The body made that diagnosis a five-minute job rather than an archaeology dig — a recorded wrong
belief tells the next reader which plausible fix to distrust.

For anything touching `public/app/*.js` or the manifest, say whether it was exercised in a real
Chrome (build, load unpacked, click the toolbar) or only by the e2e suite, which cannot grant
`activeTab` and never sees the error popup. Blank line after the subject; wrap at 80 columns.
Claude-authored commits carry a `Co-Authored-By: Claude …` trailer — keep it.

### No `--amend`

Never `git commit --amend`, even for a typo, even before pushing. A follow-up is a new commit. The
repo already carries the price visibly: `feat: CC-002 - ✨ Add rbg colour options` (4 July 2024,
`rbg` permanent) and `chore: CC-002 - 🔥 Remove app file to put back` twice in a row (5 July 2024).
The five gitmoji-less subjects on `feat/vite-migration` stay for the same reason: an amend rewrites a
commit that a review agent, a PR page or `PROGRESS.md` may already have cited by hash.

## Pull requests

### Title

Same format as a commit subject: `<type>: CC-<n> - <gitmoji> Description`. The first two human-authored
PRs missed it — #13 was `CC-Dependencies: ⬆️ Update dependencies, add dependabot`, #17 was
`Feat/cc 002`; #28 followed it — and #17's merge commit (`Merge pull request #17 from Pushedskydiver/feat/CC-002`)
records nothing about what it did. Nothing checks the title; that is why it is written here.

A merge commit or a squash takes the title from the PR: since 11 September 2026
`merge_commit_title` and `squash_merge_commit_title` are `PR_TITLE`, and both `*_message` settings
are `PR_BODY`. The merge box is still editable and nothing checks it afterwards: read it before
confirming. A **rebase** uses neither — the branch commits keep their own subjects and bodies — so
on the default button ([Merge strategy](#merge-strategy)) the commit format is whatever was written
on the branch, and the PR title is only what the PR page shows.

### Body

`PULL_REQUEST_TEMPLATE.md` at the repo root (GitHub honours root, `docs/` or `.github/`) pre-fills
five headings. What each one wants here:

| Heading                                     | Answer with                                                                                                                                                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| What kind of change does this PR introduce? | The commit type and the ticket key.                                                                                                                                                                                                                                            |
| Did you add tests for your changes?         | Which cases in `test/e2e/extension.spec.ts` or `src/**/*.test.ts` were added or changed. If none, say why: a real toolbar click, the error popup, incognito, a real (not stubbed) refusal of the copy command and the store package are outside the suite (`docs/TESTING.md`). |
| Summary                                     | Why this shape and not the obvious alternative; what was tried and was wrong.                                                                                                                                                                                                  |
| Does this PR introduce a breaking change?   | Anything a user of the installed extension would notice — a manifest permission, a `minimum_chrome_version`, a change to the `localStorage` keys `background`, `foreground` or `colors`.                                                                                       |
| Other information                           | Node and Chrome versions, and the result of `npm run lint && npm run test:unit && npm run build && npm run test:e2e` locally — which suite, not "tests pass". Plus what the merge does **not** do: a merge never publishes ([Releases](#releases)).                            |

### Labels

**No label taxonomy — deliberately.** The repo has eight of GitHub's default labels plus `dependencies`,
`github_actions` and `javascript`, all created by Dependabot for its own PRs; `dependencies` is also on #13.
21 human-authored PRs of 28 merged (17 September 2026) still do not need a filter. Re-entry: thirty human PRs.

### Who merges

Alex merges human PRs. Claude Code never merges those, never approves, and does not post review
comments on the PR — review findings come back in chat (`docs/DA-REVIEW.md`), and Alex owns the PR's
audit trail. **Delegated exception (Alex, 11 September 2026):** Dependabot PRs with a green
`Lint, build, e2e` run may be merged by Claude — `gh pr merge <n> --merge --admin --delete-branch`
(the review rule blocks a non-admin merge; `enforce_admins` is off) — and asked to rebuild with a
`@dependabot recreate` comment. #33, #35 and #47 went in that way. A red run, a conflict Dependabot
cannot rebase, or a bump the docs say to hold (ESLint majors) means hand it back, not force it.

## Merge strategy

All three buttons are enabled. **Rebase is the default since 13 September 2026**, when #50, #51,
#52 and #53 all went in that way — one parent each, their branch commits replayed onto `main` with
new hashes. Every merged PR from #13 to #49 before them is a merge commit (`28fe57f Merge pull
request #17 …`, `cd77ed5 Merge pull request #13 …`, and #49 on the same day), with #5 in 2020 the
one exception noted above. **Which button is Alex's
call, per PR.** The trade-off, stated once:

- **Rebase**, the default, replays each branch commit onto `main`: every commit body stays in
  `git log main` (`--oneline` shows the subjects), there is no merge commit, and the PR title and body are not used at
  all. It **re-hashes every commit**, which is why `git branch -d` refuses afterwards and why prose
  cites PR numbers rather than branch hashes (both below).
- **Merge commit** keeps every branch commit and its body reachable from `main` under one commit
  that takes the PR title and body. For the migration branch, whose bodies are the only record of
  why several things were done, that is the safer choice.
- **Squash** gives `git log --oneline main` one line per change. It eats the branch commits'
  bodies — the squash commit carries the PR body instead — and it makes `git branch -d` refuse
  afterwards (below).

**Cite PR numbers, not branch hashes, in anything that outlives the branch.** A rebase rewrites
every hash, so a commit body or doc naming one points at a commit that is not on `main`: the merged
bodies of `bbb822b` and `4b46b53` cite `113e6cd` and `326029c`, and
`git merge-base --is-ancestor` says neither is on `main` (13 September 2026).

Two unrelated changes are two PRs, not two commits on one branch — squash would collapse the second
change's reasoning, and a merge commit would bury it under one PR title.

### After the merge

`delete_branch_on_merge` has been **on** since 11 September 2026: GitHub deletes the remote branch
the moment a PR merges. Keeping one is therefore the deliberate act — a branch whose commits each
explain one defect, or record something tried and wrong, is a record; say so in the PR body
**before** merging and use "Restore branch" on the merged PR's page afterwards.

```bash
gh pr view <n> --json state,mergedAt          # state must be MERGED before anything below
git checkout main && git pull --ff-only && git fetch --prune
git branch -d <branch>                         # merge commit: deletes cleanly
git branch -D <branch>                         # rebase or squash: -d refuses; -D once the check below passes
npm ci
npm run lint && npm run test:unit && npm run build && npm run test:e2e
```

`-d` refuses after a rebase or a squash because the branch tip is not an ancestor of `main` — the
commits are there under different hashes, or collapsed into one. Do not force it on the strength of
the PR page alone; prove the content landed, then use `-D`:

```bash
gh pr view <n> --json state --jq .state   # MERGED
git cherry origin/main <branch>           # every line starts with "-"
```

`git cherry` compares patch ids: `-` means that commit has an equivalent on `main`, `+` means it
does not. A `+` line is unlanded work — stop and look before deleting anything. Do **not** use
`git diff <branch> origin/main -- <paths>` for this: it is empty only until a later PR touches the
same files, which in this repo is days (checked 17 September 2026 — #50's paths already differ,
because #52 and #54 edited them after it landed).

The branches behind #50 and #51 needed exactly this on 13 September 2026.

`npm ci` because a merge can move `package-lock.json` underneath you; the suite because `main` is a
combination that was never checked on any one branch's head. Deliberately not an npm script: it
force-deletes branches, and one command that does that is a mistyped argument away from discarding
unmerged work.

## Dependabot

Config is `.github/dependabot.yml`: weekly npm updates grouped into `dev-dependencies` and
`production-dependencies`, monthly `github-actions`. Until 4 September 2026 that file sat at
`.github/ISSUE_TEMPLATE/dependabot.yml`, where it had lived since 2022 and where GitHub never read
it — every Dependabot PR before 11 September 2026 was a security alert, not a scheduled update.
GitHub reads the config from the default branch, so it took effect when the migration merged; the
first scheduled PRs (#29–#32) arrived within the hour, alongside a security bump (#33).

**Major ESLint bumps are ignored on purpose** (`ignore:` in `dependabot.yml`): the peer ranges of
`eslint-plugin-jsx-a11y` 6.10 and `eslint-plugin-react` 7.37 stop at ESLint 9, so a grouped bump
that lifts ESLint to 10 fails `npm ci` in CI (#32, 11 September 2026 — jsx-a11y is the wall npm
reports first, the same one hit on 4 September; react is the one behind it). The ignore also mutes a
security bump that would need the major. Re-entry: when both
`npm view eslint-plugin-jsx-a11y peerDependencies.eslint` and `npm view eslint-plugin-react peerDependencies.eslint` print a range
with `^10`, drop the ignore and take the bump.

**`copy-to-clipboard` is no longer a dependency** (13 September 2026). It became a direct
production dependency on 12 September 2026, in the weekly `production-dependencies` group, and its
result in `copy-cta.tsx` was annotated `boolean` so that 4.x — whose `copy()` returns
`Promise<boolean>` — would fail `lint:ts` with `TS2322` rather than merge green under
[Who merges](#who-merges). Dependabot's #48 did exactly that. Taking 4.x then showed that it tries
`navigator.clipboard` first and that the e2e suite's Chromium logs a permissions-policy `console.error` on every copy
click, so the path this app used was ported into `src/utils/copy-text.ts` and the dependency
removed (`docs/ARCHITECTURE.md` §Deliberately not changed). Once that lands, #48 is to be asked to
`@dependabot recreate` so only the rest of its group remains. The lesson outlives the package: when
a dependency moves from transitive to direct, ask what its next major does to the code that now
calls it.

**PRs #18–#25 were obsolete** — 2024 security bumps (postcss 7→8, webpack, micromatch, express,
rollup) against the CRA/webpack tree the migration deleted — and were closed, not merged, on
11 September 2026 once #28 had landed.

Dependabot's own subjects (`:arrow_up: Bump rollup from 2.70.1 to 2.79.2` in 2024, `chore(deps): Bump actions/checkout from 6 to 7` since 11 September 2026) are bot format; leave them alone.
`git revert` subjects (`Revert "…"`) get the same treatment — none has been needed yet.

## Releases

There is no release automation. **Merged is not published** — the full sequence and the reasons are
in [`DEVELOPMENT.md` §Merged is not published](DEVELOPMENT.md#merged-is-not-published); this is the
git-side summary.

1. The version lives in **both** `package.json` and `public/manifest.json`, unlinked. They read
   1.6.1 and 1.6.2 on 4 September 2026 (the manifest had at some point regressed from 1.6.4); 1.7.0
   was chosen to be safely above anything that may have been uploaded — wrongly: on 11 September
   the public listing showed 2.0.1, a build no commit in this repo carries (not the APCA branch,
   which was never released), so the first release from `main` is 2.1.0. The bump is a release
   commit, not part of every PR.
2. Check the currently published version first. It is recorded nowhere in this repo, and the store
   rejects a version that is not greater than it. The public listing shows it without a login:
   https://chromewebstore.google.com/detail/colour-contrast-checker/nmmjeclfkgjdomacpcflgdkgpphpmnfe.
3. `npm run package` builds and zips `build/` to `cc-checker-2.1.0.zip`, dotfiles excluded. Upload
   it by hand.
4. **Tag the commit the zip was built from, after the store accepts it.** This started with 2.1.0:
   `git tag` prints `v2.1.0` and `git rev-list -n1 v2.1.0` gives `c5da9fc`, the packaged commit
   (checked 12 September 2026). No earlier release can be mapped back to a commit, so 2.1.0 is the
   first. The next one follows the same shape:

```bash
git tag -a v2.1.0 -m "Chrome Web Store 2.1.0"
git push origin v2.1.0
```

A tag is a fact about the store, not about `main`: it goes on the packaged commit once the upload is
accepted, not on the merge.

## Blast-radius docs

Editing any of these needs a PR regardless of the size of the diff, and Alex reviews the
**substance**, not just the button — with `enforce_admins` off, the approve button is his own, so
the reading is the whole gate:

- `CLAUDE.md` (and `AGENTS.md`, a symlink to it)
- `docs/**` — this file, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `TESTING.md`, `CONVENTIONS.md`,
  `SELF-REVIEW.md`, `DA-REVIEW.md`, `REVIEW-PATTERNS.md`, `RATIONALIZATIONS.md`, `GLOSSARY.md`
- `.claude/agents/**` — `da-review.md`, `copilot-surrogate.md`, `spec-grill.md`; these are executed
  as instructions, so a change here changes behaviour the way a code change does
- `public/manifest.json` — permissions, `web_accessible_resources`, the version; a bad entry ships
  to every user on the next release and cannot be recalled
- `.github/workflows/**` — decides what gets checked

`copilot-surrogate` is mandatory on all five (review-trigger table in `CLAUDE.md`). This list
is the source of truth; re-check it rather than reciting it from memory.

## Deliberately not adopted

Named with a re-entry condition, so a future reader can tell an omission from a miss:

- **Type and scope labels** — see [Labels](#labels). Re-entry: thirty human PRs.
- **Squash as the only merge method** (moe, nas-stacks). Re-entry: if `git log --oneline main` stops
  reading as a list of changes, disable merge commits **and rebase** in the repo settings — since
  13 September 2026 rebase is the default, so turning off merge commits alone would not leave squash
  — and rewrite [Merge strategy](#merge-strategy).
- **A PR-title check workflow** (moe's `pr-title-check.yml`). ~~Re-entry: if titles keep drifting
  the way #13 and #17 did — since the PR title is now the merge-commit subject, drift lands on
  `main`.~~ Corrected 17 September 2026: under the default button the PR title reaches no commit at
  all, so title drift lands nowhere. What lands on `main` is the **branch commit subjects**, which
  nothing checks either. Re-entry: if those keep drifting, a check on them (not on the PR title) is
  the thing to add.
- **The direct-to-`main` drift-fix predicate** — see [What needs a PR](#what-needs-a-pr). Re-entry:
  a doc that is appended to constantly; re-read nas-stacks' five clauses before importing it.
- **Scopes in the subject** (`feat(scope):`). The ticket key occupies that slot; name the execution
  context (`content.js`, `background.js`, `src/`) in the description instead.
- **Reverts and drills.** No deliberate break has ever been merged here and there is no deploy to
  drill; the `Revert "…"` rule above is all that carries over.
