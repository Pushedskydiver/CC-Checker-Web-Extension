# Development Process

How a change to Colour Contrast Checker gets from an edit on Alex's Mac to a zip in the Chrome Web
Store. Companion docs: `docs/DA-REVIEW.md` and `docs/SELF-REVIEW.md` — the two review checklists
this doc sequences, in that order. Commit and branch mechanics live in `docs/GIT.md`; the recurring
defect classes and the excuses for skipping steps live in `docs/REVIEW-PATTERNS.md` and
`docs/RATIONALIZATIONS.md`.

**Adapted from the `docs/DEVELOPMENT.md` in nas-stacks, moe and chief-clancy** — Alex's other
repos, where the same two collaborators (Alex and Claude Code) work the same way. Those are a NAS
compose stack and two TypeScript monorepos with registries, changesets and release pipelines. This
repo is a single Manifest V3 Chrome extension: one Vite build, one Playwright suite, and a zip
uploaded by hand. The sections that survived are the ones about _how work is reviewed and how it
reaches users_; everything keyed to npm publishing or container deploys is named under
[§Not ported](#not-ported). The incidents cited are this repo's own, nearly all from the
4 September 2026 audit of the `feat/vite-migration` branch.

---

## Quick reference

1. **Make the change.** One thing at a time — [§One change in flight](#one-change-in-flight).
   Branch `<type>/CC-<n>[-short-slug]`, commits `<type>: CC-<n> - <gitmoji> Description`
   (`docs/GIT.md`).
2. **Run the gates** — [§The commands](#the-commands). All three, not just the one that covers
   the file you touched.
3. **Review gate** — architectural → DA subagent → self-review → PR. Never reordered, never
   skipped. [§The review gate](#the-review-gate--architectural--da--self--pr).
4. **Push and open the PR.** CI runs `quality` on Linux — the only case-sensitive checkout in the
   loop. Watch it.
5. **Alex merges.** Claude never merges. Merge commit or squash is Alex's call per PR.
6. **(Release only) `npm run package`, then upload the zip in the Web Store dashboard.** Merged is
   not published — [§Merged is not published](#merged-is-not-published).

---

## The commands

Every command below exists in `package.json` and was run on 4 September 2026. There is no task
runner and no dev server: the app needs `chrome.*` APIs, so it only runs loaded as an extension.

| Command            | What it proves                                                                                                                                | Cost           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `npm run lint`     | `lint:ts` (tsc over `tsconfig.json` and `tsconfig.node.json`), `lint:js` (ESLint), `lint:css` (Stylelint), `format:check` (Prettier) all pass | ~4s            |
| `npm run build`    | Vite emits `build/` — one JS file, one CSS file, `public/` and the manifest copied verbatim                                                   | under 1s       |
| `npm run test:e2e` | the built extension loads in headless Chromium and the 18 Playwright tests in `test/e2e/` pass, eyedropper included                           | ~7s, 4 workers |
| `npm test`         | `build` then `test:e2e` — use it when unsure the build is fresh                                                                               | ~8s            |
| `npm run watch`    | rebuilds `build/` on save for manual testing                                                                                                  | continuous     |
| `npm run package`  | `build`, then zips `build/` to `cc-checker-<version>.zip`, dotfiles excluded                                                                  | seconds        |

The pre-push suite, which must be green before every push:

```bash
npm run lint && npm run build && npm run test:e2e
```

Playwright's Chromium is installed once per machine, and again after a `@playwright/test` bump (the pinned
build changes with the package): `npx playwright install chromium`. Prettier
takes its config from `.editorconfig`; there is no `.prettierrc`.

**What the e2e suite does not cover**, so nobody mistakes 18 green tests for a tested release: a
real toolbar click and the `activeTab` grant behind it (the picker tests run a manifest copy with
`host_permissions: ["<all_urls>"]` because Playwright cannot click the toolbar), the error popup,
incognito, clipboard contents, the Web Store package, and Safari. Those are checked by hand:

```bash
npm run build
# chrome://extensions → Developer mode → Load unpacked → build/
```

After changing `public/app/*.js` or `public/manifest.json`, press Reload on the extension card;
after changing `src/`, rebuild and reload the page the checker is open on.

**Do not skip a gate because the diff "obviously" does not touch it.** The media-query ordering
regression fixed on 4 September 2026 was introduced by inlining the PostCSS config into
`vite.config.ts` — a change that looked like build plumbing and broke the three-column desktop
layout, which only the emitted CSS could show.

---

## The lifecycle — a change, end to end

```
edit on a branch
  ↓
local gates  ───────── npm run lint && npm run build && npm run test:e2e
  ↓
review gate  ───────── architectural → DA subagent → self-review
  ↓
push + PR    ───────── CI: the `quality` job on ubuntu-latest (lint, build, e2e)
  ↓
Alex merges to main
  ↓
⟵ NOTHING HAPPENS HERE ⟶   the Web Store has no idea main changed
  ↓
(release only) bump version in package.json AND public/manifest.json
  ↓
npm run package  →  cc-checker-<version>.zip
  ↓
Alex uploads the zip in the Chrome Web Store developer dashboard
  ↓
store review, then users update
```

### Merged is not published

**A merged PR changes what `main` says. It changes nothing that any user is running.** There is no
release workflow, no store API call, nothing between `main` and the Chrome Web Store except a
person with a zip file and the developer dashboard. Never describe a change as "shipped", "live" or
"released" when it is merged — not in a commit body, a PR description or `PROGRESS.md`. Say which
it is.

Releasing, in order:

1. Bump `version` in **both** `package.json` and `public/manifest.json`. They are not linked, and
   on 4 September 2026 they disagreed (1.6.1 against 1.6.2, the manifest having regressed from an
   earlier 1.6.4); 1.7.0 was chosen to be safely above anything that may have been uploaded, and
   was not — the public listing showed 2.0.1 on 11 September 2026, so the release is 2.1.0.
2. **Check the currently published version before uploading.** It is not recorded anywhere in
   this repo, and the store rejects a version that is not greater than the one it already has. The
   public listing page shows it without the dashboard (URL in `docs/GIT.md` §Releases).
3. `npm run package`, then upload `cc-checker-<version>.zip` by hand.

The version bump is part of a release, not of every PR — a feature PR that bumps the manifest
version is claiming a release it cannot perform.

### CI, and what it can and cannot do

`.github/workflows/ci.yml` runs one job, `quality`, on every pull request and every push to `main`:
`npm ci`, `npm run lint`, `npm run build`, `npx playwright install --with-deps chromium`,
`npm run test:e2e`, with `test-results/` kept for seven days on failure. In CI Playwright runs 2
workers with 1 retry (`playwright.config.ts`).

**CI is the only case-sensitive checkout in the loop, and that is the main thing it is for.** On
4 September 2026 the Git index tracked `01-Atoms/`, `02-Molecules/`, `Icon/`, `Ratio/` and
`Header/` while the disk and every import used lowercase. macOS's case-insensitive filesystem plus
`core.ignorecase=true` hid it: the build was green on the Mac and a fresh clone on Linux could not
build (`UNRESOLVED_IMPORT` plus 21 TS2307 errors, reproduced on a case-sensitive APFS image). The
fix was re-indexing (`git rm -r --cached src/components && git add src/components`) and
`core.ignorecase=false`; the gate is the Linux runner. A green build on the author's Mac is not
evidence for a case-sensitive checkout.

**Branch protection on `main`, re-checked with `gh api` on 11 September 2026:** one approving
review required, stale reviews dismissed on push, force-pushes and deletions blocked, and
**`Lint, build, e2e` is a required status check** (`strict` off). `enforce_admins` is off, so Alex
can merge his own PRs without a second reviewer. The check was deliberately left non-required until
it had been observed green — a check never seen passing is not evidence of anything — and that
happened on PR #28's first run (lint, build, 18/18 e2e in 56 s on `ubuntu-latest`), so it was made
required the same day. A red check now blocks the merge button; a green one still only proves the
job passed, not that the job covers your change.

Housekeeping, done 11 September 2026: PRs #18–#25 (2024 Dependabot bumps against the old
CRA/webpack tree) were closed, not merged; `.github/dependabot.yml`, moved on 4 September to where
GitHub reads it (it sat under `.github/ISSUE_TEMPLATE/` since 2022), started producing PRs as soon
as it reached the default branch.

### One change in flight

**One branch, one PR, one concern.** `feat/vite-migration` is the cautionary example: the
build-tool migration, React 19, a TypeScript 7 toolchain, lint-config rewrites and a dozen
behavioural fixes landed on one branch between March and September 2026, and the 4 September 2026
audit had to attribute each regression to its cause one at a time, by hands-on reproduction,
because the branch history could not. An audit trail is only useful if it also establishes cause.

The same rule applies across the three execution contexts: a PR that changes
`public/app/content.js`, `public/app/background.js` and `src/` together is three changes, and the
message flow between them is exactly where the double-handled `colorPicked` and the
live-after-close picker listeners were hiding.

---

## The review gate — architectural → DA → self → PR

Four steps, in that order, never reordered.

1. **Architectural pass — before writing anything.** Does the approach fit the three-context
   architecture and `CLAUDE.md`? Does it widen permissions beyond `activeTab`? This is judgement,
   not a checklist. The question this repo keeps needing: _is this patching a symptom where the
   boundary should have been sanitised?_ The NaN hue was long patched by an effect rewriting state
   in place; the fix that held normalises hue to 0 in `toHslTuple` (`src/utils/color-utils.ts`),
   where the value is created.
2. **DA review — a subagent, from fresh context, never the writer's own.** Dispatch
   `.claude/agents/da-review.md`; it walks `docs/DA-REVIEW.md`. The point is a reader who does not
   already believe the code is right. Fix every BLOCKING and MATERIAL finding. A `Low:` finding
   deferred needs a written reason.
3. **Self-review — after DA, not in parallel.** Walk `docs/SELF-REVIEW.md` against
   `git diff main...HEAD` yourself. It runs last because DA-driven fixes introduce fresh line-level
   slips, and a self-review completed before them is stale.
4. **Push and open the PR.** Fill in `PULL_REQUEST_TEMPLATE.md` honestly — "did you add tests"
   means e2e tests here; there are no others. If the PR is the sort described in
   `.claude/agents/copilot-surrogate.md` — prose making factual claims about the repo, a manifest
   or config change, or a diff over 200 lines — dispatch the surrogate; it reads every touched
   file at HEAD in full and grep-falsifies the claims. **Findings from every review agent stay
   in-chat. None of them post PR comments; Alex owns the PR's audit trail.**

The grep-able trigger table (which agent fires for which paths) lives in `CLAUDE.md`; this doc
sequences the agents and does not duplicate the table.

### Why this order

DA findings change code, which invalidates an earlier self-review. Self-review fixes change what CI
and Alex see. Out of order means either repeating the work or shipping against a stale artefact.

### When the full gate is not worth it

A one-line typo, a README wording change, or a new case in an e2e structure that is already proven
does not need a DA dispatch. Everything else does: anything with logic, anything in
`public/app/*.js` or `public/manifest.json`, any dependency change, any change to `vite.config.ts`
or the CI workflow. There is no cheaper reviewer on the other side — no deploy that fails loudly
thirty seconds later — so the review chain is doing the whole job.

### What must be true before asking Alex to merge

**Claude does not merge and has no standing authority to.** The criteria below are a pre-merge
checklist, not a permission grant. All must hold before the handover; if one does not, fix it
rather than raising it as a caveat:

- `npm run lint`, `npm run build` and `npm run test:e2e` green **locally and in CI**. CI is a
  required check, but a green tick proves the job ran, not that it exercises your change — go and
  look at the `quality` job's log.
- DA review and self-review both completed, on this PR's HEAD, not on an earlier commit.
- No BLOCKING or MATERIAL finding dismissed. Fixed, or fixed differently, with the reason in the
  PR body.
- The `version` fields untouched unless this PR _is_ the release, in which case both files moved
  together.
- No merge conflicts with `main`.

**Any of these needs Alex's attention on the substance, not just the merge button** — say which
one fired when you hand over:

- `public/manifest.json` changed, especially `permissions`, `host_permissions`,
  `content_scripts` or `web_accessible_resources`. `activeTab`-only is a deliberate choice, and
  the store reviews permission widening on its own.
- Anything touching page injection (`public/app/content.js`) or captured screenshots
  (`captureVisibleTab` in `public/app/background.js`). The extension runs in every `<all_urls>`
  page and takes pictures of them; that is a privacy surface, and on 4 September 2026 it was found
  injecting a full checker into every embedded iframe.
- `.github/workflows/**` or `.github/dependabot.yml` changed.
- A review finding dismissed rather than fixed, at any severity, if it mentioned privacy,
  permissions or a behavioural regression.
- Two review passes disagreed on a factual claim. Resolve it at the primary source — the file, the
  emitted `build/` output, the running extension — not by picking the pass that sounded more
  thorough.

---

## Verification rounds

Adversarial review here is iterated, not one-shot, and the rounds are two different questions.

- **Discovery rounds (R1…R*n-1*).** Brief: _find what is wrong._ Adversarial-creative. Iterate
  until findings converge to nits.
- **Verification round (R*n*, exactly one, a distinct prompt).** Brief: _confirm or disprove the
  claim that this is at the nit-floor._ Evaluative-sceptical. Not "one more discovery pass".

**Why the split.** The last discovery round has a self-terminating bias built in: the author wants
to converge and so does the subagent, which makes it the _least_ independent check in the
sequence. A zero mid-discovery might mean convergence or might mean the round asked the wrong
question; a zero from an explicit verification prompt is evidence. **The verification round has to
actually fire** — "it would have come back clean" is a rationalisation, not a result.

**Finders and verifiers are separate agents, from fresh context.** The agent that fixed a finding
is the worst possible judge of whether the fix landed. Self-verification — grepping your own diff,
re-running the suite, reverting the fix to watch a test go red — is one perspective checking its
own work. Alex expects this on non-trivial work and wants an honest "nit-floor reached" signal, not
findings manufactured to prove the round ran.

**Cap default rounds at 2, then do a manual pass.** Stop when successive rounds produce only
cosmetic deltas, or when Alex says ship — whichever is sooner.

### Scale the fan-out to the repo

**On 4 September 2026 a 139-agent audit workflow — two verifiers per finding across roughly sixty
findings — exhausted the session budget twice, on a repo of about 3.7k lines of code.** Five
finders plus hands-on reproduction (a case-sensitive disk image, a child iframe, a grey on the
saturation slider) had already found everything that mattered; the verifier swarm added cost and no
defects. "More verifiers" is not more rigour. Set the size of a verification pass by the size of
the thing being verified: here, one finder round and one verification round over the whole diff is
proportionate, and a verifier per finding is not. When the agents you are about to dispatch
outnumber the files in `src/`, stop and reproduce by hand instead.

---

## Session handoff

**Trigger — the sooner of:** context nearing the pre-compaction budget, a natural boundary (a PR
merged, a workstream segment done, a release uploaded), or the compaction warning firing. Hand off
_before_ the warning: reasoning quality degrades well before context fills, so waiting for the
warning means quality slipped some time ago.

**How to hand off:**

1. **Update `PROGRESS.md`** at the repo root — the living state document. Say what merged and what
   was uploaded to the store (they are different; say both), the branch and what remains if
   mid-change, and any open verification round.
2. **Archive overflow to `docs/history/SESSIONS.md`.** When the detail band in `PROGRESS.md` holds
   more than five session entries or grows past roughly 10k tokens, compress the oldest to a
   one-line row there. Check at session start, before picking anything up; a check that only fires
   "when it occurs to someone" silently backslides.
3. **Record superseded reasoning with ~~strikethrough~~ rather than deleting it**, and say what
   corrected it and when. The wrong turns are half the value: the media-query comparator that was
   "type-satisfying" and wrong, the version numbers that had drifted apart.
4. **End with a "Next session loading instructions" block.** Pointer-only: what to verify first
   (branch, whether CI has run, whether the store version changed), the primary workstream,
   lettered decision branches, carry-overs. It must not restate rules that live in `docs/*.md`.

### `PROGRESS.md` structure

The chief-clancy/moe pair, adopted as-is — same names, same shapes, so citations across Alex's
repos stay legible:

```markdown
# Progress

Living state document — current state, what's next. Session-by-session
detail lives in git history once entries archive out.

## Next workstreams (after Session <N>)

Updated <date> end-Session-<N> — <one-line characterisation>.

**<Workstream>**: [<PR title>](<PR link>) `<short-sha>` — <what happened>.
Merged: <yes/no>. Uploaded to the Web Store: <version or "no">.

**Major novel patterns Session <N>:**

1. <a durable lesson, a discovered gotcha, a process fix>.

### Session <N+1> loading instructions

- <what to verify before picking anything up>
- <the primary workstream to resume>
- <decision branches, lettered, one-line each>
- <carry-overs — standing facts the next session needs>

## Session archive

Archived sessions are in `docs/history/SESSIONS.md`. Full retrospective
survives in `git log -p PROGRESS.md` at that session's compression commit.
```

`docs/history/SESSIONS.md` is a table — `| Session | Date | Headline |` — one row per
archived session. Deliberately not adopted: per-session metric
blocks and numeric handoff-cost thresholds. The source repos' own data retired those — the
thresholds drifted out of meaning and the backfill discipline collapsed.

---

## Process-rule promotion

A practice becomes a rule in one of these docs when it has fired **twice** on real work, and it
becomes a _gate_ when reader discipline has demonstrably failed to hold it. The ladder:

| Stage       | What it looks like                                                        | Example here                                                  |
| ----------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Observation | noted in the session, nothing written                                     | —                                                             |
| Recorded    | written into `PROGRESS.md` or `docs/REVIEW-PATTERNS.md` where it happened | the 4 September 2026 findings                                 |
| Promoted    | a rule in `CLAUDE.md` or `docs/*.md`                                      | this doc's review-gate order; "verify emitted CSS order"      |
| Gated       | a check in `ci.yml` or a lint rule                                        | the `quality` job on Linux; `react-hooks/set-state-in-effect` |

**Promotion to a gate is not a reward for importance; it is what you do when the rule cannot be
held by attention.** Two worked examples, both from 4 September 2026.

**The case-sensitivity incident is gated by the CI job, not by a rule.** "Directory names are
lowercase" was already the convention and every import honoured it — the index did not, and no
amount of reading the tree on a Mac could show that. The check that catches it is a checkout on a
filesystem that cares, which is what `quality` on `ubuntu-latest` is. `core.ignorecase=false`
locally is the belt; the Linux runner is the braces.

**The effect-mutates-state class is gated by ESLint.** The NaN-hue bug lived in an effect that
patched state in place after the fact. `eslint-plugin-react-hooks` 7's recommended set — active in
`eslint.config.mjs` at error level — includes `react-hooks/immutability` (state mutated in place)
and `react-hooks/set-state-in-effect` (state rewritten from an effect). The rule "sanitise at the
boundary, never patch state in effects" is in `docs/REVIEW-PATTERNS.md` for the reader; the lint
rules are there for when the reader forgets.

**Don't promote at n=1**, and don't build the gate before the rule has been broken. This branch
removed `stylelint-order` (installed, no order rules configured) and `_config/eslint.json`
(extending a config never installed): a check nobody needed is the same mistake in a
cheaper-looking wrapper.

---

## State-surface ownership

Each fact has exactly one home. Other surfaces point at it rather than copying it; when a fact
moves, the pointer and the old copy are updated in the same commit.

| Fact kind                                            | Home                                                                                         | Why there                                                                                                                                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stable process rules, review discipline, conventions | `docs/*.md`, `CLAUDE.md`                                                                     | reviewed and versioned. `AGENTS.md` is a symlink to `CLAUDE.md`, not a second home                                                                                                  |
| Session state, what shipped, what is next            | `PROGRESS.md`                                                                                | read first at session start; archived to `docs/history/SESSIONS.md`                                                                                                                 |
| Which agent reviews which path                       | the trigger table in `CLAUDE.md`                                                             | grep-able from the file every session loads                                                                                                                                         |
| What the extension may do                            | `public/manifest.json`                                                                       | the store and the browser read it; docs describe, the manifest enforces                                                                                                             |
| The published version                                | the Chrome Web Store dashboard                                                               | it is not in this repo — check it, do not guess it                                                                                                                                  |
| Default colours                                      | `src/context.tsx` (`DEFAULT_BACKGROUND` / `DEFAULT_FOREGROUND`) and `src/styles/globals.css` | two homes by necessity — they must stay in sync; only the comment in `context.tsx` guards that (the first-run e2e test reads the variable the app sets, not the stylesheet default) |
| Why a specific line is the way it is                 | the file itself, in a comment                                                                | `public/app/background.js` and `vite.config.ts` are the models                                                                                                                      |
| What is actually enforced                            | `.github/workflows/ci.yml`, `eslint.config.mjs`, `stylelint.config.mjs`                      | docs describe, checks enforce                                                                                                                                                       |

**The rule this table exists to prevent** is a fact filed under a heading narrower than the fact.
The version mismatch found on 4 September 2026 was exactly that: the version lived in two files
nobody had written down as a pair, so each was bumped as if it were the only one.

---

## Not ported

Named rather than silently dropped, so a future reader knows these were considered.

**Doc-port decision — 4 September 2026.** Ported from nas-stacks, moe and chief-clancy.
**Adopted:** this doc, `docs/ARCHITECTURE.md`, `docs/CONVENTIONS.md`, `docs/DA-REVIEW.md`,
`docs/SELF-REVIEW.md`, `docs/TESTING.md`, `docs/GIT.md`, `docs/REVIEW-PATTERNS.md`,
`docs/RATIONALIZATIONS.md`, `docs/GLOSSARY.md`, the `PROGRESS.md` / `docs/history/SESSIONS.md` pair,
and the three `.claude/agents/` (`da-review`, `copilot-surrogate`, `spec-grill`). **Deferred with a re-entry
condition, or dropped outright:**

- **`docs/INDEX.md`.** It routes policy-adjacent edits against real PR history, and this repo has
  seven merged PRs, three of them human-authored. Re-entry: after roughly ten PRs, when there is
  something to route against.
- **Changesets, semver tooling, npm publishing, release workflows.** Nothing here is published to
  npm; the release is a zip and a dashboard. Re-entry: the day a Web Store upload is automated —
  at which point [§Merged is not published](#merged-is-not-published) needs rewriting.
- **`docs/OPERATIONS.md`, `VISION`, `PERSONAS`, `LIFECYCLE`, `VISUAL-ARCHITECTURE`,
  `TECHNICAL-REFERENCE`, `COMPARISON`, `roles/`, `guides/`, persona and Slack material.** No
  equivalent — no running service, no persona team, no roadmap beyond "Safari, eventually".
- **`.github/copilot-instructions.md` and the Copilot / CodeRabbit review steps.** No bot reviewer
  is integrated here; `copilot-surrogate` covers the reads-HEAD-not-diff scope in-chat. Re-entry:
  if a bot reviewer is enabled, its dispatch, wait and triage mechanics belong in
  [§The review gate](#the-review-gate--architectural--da--self--pr).
- **Mutation testing.** There are no unit tests to mutate; the suite is end-to-end. Re-entry: when
  the pure colour utilities in `src/utils/color-utils.ts` get unit tests, and not before.
- **Phase Validation Protocol, auto-merge criteria, HITL trigger taxonomy.** Chief-clancy's
  autonomous-merge apparatus. Here Alex merges — there is no autonomy to gate.
- **`AGENTS.md` generation and sync tables.** `AGENTS.md` is a symlink to `CLAUDE.md`: no
  generator, no drift, no CI check.
- **Task-sizing tables in LOC.** The meaningful unit here is which execution context a change
  touches, not how many lines moved; ten lines in `content.js` run in every page on the web.

---

## When to update this doc

A new step enters the review gate; the pre-push suite gains or loses a command; a rule gets
promoted to a gate (update both the ladder and whatever now enforces it); the required status
checks or branch protection on `main` change (rewrite
[§CI](#ci-and-what-it-can-and-cannot-do) to say so); the Web Store upload
is automated (rewrite [§The lifecycle](#the-lifecycle--a-change-end-to-end) rather than amending
it); Safari support starts (packaging gains an Xcode path and the lifecycle forks).
