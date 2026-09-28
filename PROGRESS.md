# Progress

Living state document — current state, what's next. Session-by-session detail archives out to
`docs/history/SESSIONS.md` (mechanics: `docs/DEVELOPMENT.md` §Session handoff).

## Next workstreams (after Session 11)

Updated 29 September 2026, end of Session 11: **the PCR workflow port is researched, proposed and approved
by Alex as `CC-005`.** It is eight PRs, ordered H, E, A, B, D, C, F, G, and the plan is
`docs/research/01-pcr-workflow-port.md` (§8 and the closing fold section). That file is on the draft
[#75](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/75) (PR H) until `spec-grill` R2 and
both reviews pass. CC-004 row 11 waits for all eight (Alex). The paragraph below is the Session 10 state and
still holds for CC-004.

Updated 28 September 2026, end of Session 10 — **CC-004 rows 1 to 10 have merged — row 10's second half as
#72 (`61b5d43`, a merge commit); the next session researches porting the PCR Formulation workflow (item 6),
at Alex's request, before CC-004 row 11.** Row 10 part one (#68, `41e36c4`, a merge commit) merged in
Session 9, moving the atoms' poor-contrast variant into CSS, and a Dependabot dev-dependencies bump (#69,
`fadd8a8`) merged under the standing delegation after it. PRs 1 to 4
merged in Session 5 (`8ac0bdc`, `83dec25`, `e62b069`, `9156ff2`); PR 5 (#50, `bbb822b`) and PR 6 (#52,
`170ca4e`) in Session 6, which also merged the Session 1 archive (#49, `d56f6a4`), two handoffs (#51
`4b46b53`, #53 `bfbb5ac`), the in-house copy port (#54, `18cfd4a`) and two Dependabot bumps (#47 `346c4b0`,
#55 `4c4f9d2`), the merge-strategy docs (#56, `2c86064`), one more handoff (#57, `0b53e62`) and
PR 7 with the WCAG boundary fix (#58, `4799394`). PR 8 (#62, `f046ccf`, a merge commit — not the
rebase default, Alex's call per PR) merged in Session 7, extracting the hex-input parser to
`src/utils/parse-color-input.ts` with 11 unit tests (36 total, up from 25); a Dependabot
dev-dependencies bump (#61, `678252f`) merged the same session under the standing delegation, and
the Session 7 close (#64, `8af89df`) after it. PR 9 (#65, `25cf7ab`, a merge commit) merged in
Session 8: one e2e test pinning the poor-contrast colour switch at all fifteen sites (21 e2e tests,
up from 20).
**#48 is closed**: the `copy-to-clipboard` 4.x major was
investigated, rejected on evidence, and Dependabot recreated the rest of its group as #55 once the
dependency was gone. **2.1.0 is published**: the public listing read `Version 2.1.0`, `Updated September 12, 2026`,
`40,000 users` when checked that day. The release is `v2.1.0` on `c5da9fc`.

1. **Code-quality deep dive, CC-004.** The approved order, and what the grill killed, are in §The approved
   plan below. PRs 1 to 9 and row 10's first half (the atoms, #68) merged, and row 10's second half as
   [#72](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/72) (`61b5d43`). Row 11 comes after
   the PCR research (item 6) has reported — Alex's order, 28 September 2026. One PR at a
   time, `da-review` on every `src/**` change, both reviews wherever the
   `CLAUDE.md` trigger table says so, the e2e suite as the gate.
2. ~~**Store review of 2.1.0.**~~ **Done.** The store published 2.1.0 on 12 September 2026, the day it was
   submitted — found by a `copilot-surrogate` pass checking the claim that it was still under review, not by
   anyone watching. Users are on it. Nothing further; the next release repeats `docs/GIT.md` §Releases.
3. ~~**Unit tests for `src/utils/color-utils.ts`** (vitest) — folds naturally into workstream 1.~~ Absorbed:
   it is PR 7 of the approved plan, and it carries the Vitest infrastructure, a `ci.yml` step and a twelve-file
   documentation sweep with it.
4. **Safari** — stated goal, nothing started. Start from `docs/ARCHITECTURE.md` §Safari. It is now also the
   re-entry condition for giving `public/app/*.js` a build and a shared `messages.ts`.
5. **Wake the sibling web app.** Not started. Alex answered a six-question list "yes to all six" on
   12 September 2026, which accepts the premise that the sibling's missing fixes are worth making; **that it
   is a workstream of its own rather than part of CC-004 was decided in-session, not by Alex** — his answer
   could not settle an either/or (`docs/history/SESSIONS.md` row 5; the full Session 5 entry is in `git log -p PROGRESS.md`). Confirm the shape with him before starting. `Pushedskydiver/Colour-Contrast-Checker` is now **five** items behind, not three: the three fixes this
   repo made on 4 September — the grey-hue defect, range inputs that cannot take a `min`, the tab keyboard
   handling — plus two found by running PR 7's unit tests against its `color-utils.ts` on 17 and
   18 September: `colorToHsl`/`rgbToHsl` return four elements against a three-tuple annotation, and
   `getLevel` still uses the strict `>` this repo fixed in #58. Five small commits there, not an API here. Nothing in CC-004 depends on it, so it is scheduled whenever Alex wants it.
6. **Research porting the PCR Formulation AI workflow — the next session's primary work** (Alex,
   28 September 2026). Research and a proposal for Alex, not a change: agents and the models pinned on
   them, a session-handoff protocol that reads the 5-hour, weekly and context usage, soft and hard token
   lines, `AGENTS.md` as the primary file with frontmatter-carrying agents imported from `CLAUDE.md`, and a
   token-cost pass over every doc (including `AGENTS.md`) that keeps quality. Adapt or improve where this
   repo differs. ~~The brief is step 5 of the loading instructions below.~~ Done in Session 11:
   proposal approved, `spec-grill` R1 folded, R2 next (§Session 11).

### The approved plan (CC-004), approved by Alex 12 September 2026

It replaced the 11 September brief, now archived (`docs/history/SESSIONS.md` §Retired sections); "the
brief" below means that text.

Measured against `main` at `94cd658`. The Reviews column is a **prediction** of which `CLAUDE.md` trigger
fires, not a record — "both" means `da-review` and `copilot-surrogate`, and a PR that crosses 200 changed
lines fires both whatever its paths. Row 2 is the worked example: predicted surrogate-only, it came to 232
lines and fired both — 232 at the time that was measured, 305 by the time it merged. Row 10 is one concern
in two PRs, so the plan is twelve numbered items in thirteen
pull requests.

| #   | PR                                                                                                        | Reviews            | After |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------ | ----- |
| 1   | ✅ Stop a missing output directory masking the real build error (#42, `8ac0bdc`)                          | both               | —     |
| 2   | ✅ Correct the documented route off `react-copy-to-clipboard` (#43, `83dec25`)                            | both               | —     |
| 3   | ✅ Delete the dead `LinkButton`, `TLinkButton` and `TIconName` (#44, `e62b069`)                           | da-review          | —     |
| 4   | ✅ Stop announcing a failed copy as a success; drop the wrapper (#45, `9156ff2`)                          | both               | 2     |
| 5   | ✅ Replace the `React.FC` rule with plain typed functions (docs) (#50, `bbb822b`)                         | surrogate          | —     |
| 6   | ✅ Convert 31 signatures in 25 files, four drift renames, rewrite the drift sentence (#52, `170ca4e`)     | both ~~da-review~~ | 5     |
| 7   | ✅ Add Vitest, the colour-utility tests, a `ci.yml` step, the doc sweep (#58, `4799394`)                  | both               | —     |
| 8   | ✅ Extract the hex-input parser to `src/utils/`, with tests (#62, `f046ccf`)                              | both ~~da-review~~ | 7     |
| 9   | ✅ Pin the poor-contrast colour switch with a test that can actually fail (#65, `25cf7ab`)                | both               | —     |
| 10  | ✅ Move the poor-contrast variant into CSS — atoms (#68, `41e36c4`), header and tabs (#72, `61b5d43`)     | da/both            | 9     |
| 11  | Typed action API, message bridge as its own hook, real payload validation                                 | da-review          | —     |
| 12  | Deferred: context reducer or external store, justified by its own unit tests (both, same reason as row 8) | da-review          | 7, 11 |

**What the grill killed, each recorded with a re-entry condition rather than built:**

- **React Compiler.** `@vitejs/plugin-react` 6.1.1 has no `babel` option, so the brief's mechanism does not
  exist. There are two seams, not one, and they are separate implementations: `react({ compiler: true })`
  does `await import('oxc-transform-react')` — the Rust port — and errors without it
  (`dist/index.js:201-208`); `babel-plugin-react-compiler` is reached only through the plugin's exported
  `reactCompilerPreset` (`dist/index.js:46`) plus `@rolldown/plugin-babel`. All three are optional peers and
  **none is installed** — they appear in `package-lock.json` only as `@vitejs/plugin-react`'s optional peer
  declarations, never resolved. The cost, measured on the Babel route in a scratch clone
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
inside the cross-origin panel, and Chrome does not block it — observed live 12 September 2026. ~~Unavoidable while the library is used~~ — the library went in #54 (17 September 2026) and `copyText` keeps the prompt deliberately; Playwright auto-dismisses dialogs, which is why no test has ever seen it.

## Session 11 — 29 September 2026 (CC-005: PCR workflow port researched, approved, spec-grill R1 folded)

**Alex approved the PCR workflow port as `CC-005`, eight PRs with H first. `spec-grill` R1 found 1 BLOCKING and 10
MATERIAL findings, all folded into the plan; the confirm round (R2) is Session 12's first job.**

**Setup:** every loading check matched. Archive count 5, detail band 31,138 bytes, tree clean, #73 and #74
merged, no open PRs, Session 10's worktrees already gone. Pre-push suite green (36 unit, 21 e2e).
`get_session self` reported Opus 5.5 at `high`.

**Done:** the research and proposal, as `docs/research/01-pcr-workflow-port.md` on the draft
[#75](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/75)
(`docs/CC-005-pcr-workflow-proposal`, `7ff2dcf`).

- **Sources:** PCR, read-only. The Claude Code docs were checked live by a Sonnet `claude-code-guide`
  agent, and a Sonnet `Explore` agent swept PCR's research and history.
- **Alex's answers**, 29 September 2026:
    - "AGENTS.md becomes the real file";
    - all eight PRs before row 11;
    - the rest was delegated. The in-session calls are recorded as Decisions 2–5 in the file: implementer
      commits, (r) left as an observation, triggers 5–6 kept, `CC-005`.
- **Merged:** nothing. **Uploaded:** no.

**Reviews:** `spec-grill` R1 on Fable 5.1, ~175k tokens: 1 BLOCKING, 10 MATERIAL, 11 LOW, all folded.

- The BLOCKING finding: `.claude/settings.json` is gitignored here, so a hook port would not ship.
- R2 was not run: the session reached the proposal's own 250k hard line.

**Handoff facts:**

- **Context:** 247k at the decision to hand off (trigger 3, hard line). The soft line was passed at ~165k,
  before the fan-out. The grill ran afterwards as the proposal's own review round.
- **Plan usage:** 5-hour 76% (resets 00:40Z on 29 September), weekly 61%, Fable weekly 11%.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment             | 5-hour | Weekly | Fable weekly | Context |
    | ------------------ | ------ | ------ | ------------ | ------- |
    | Start              | 61%    | 59%    | 9%           | 91k     |
    | Before the fan-out | 64%    | 59%    | 9%           | 165k    |
    | After the digest   | 67%    | 60%    | 9%           | 195k    |
    | Proposal delivered | 68%    | 60%    | 9%           | 214k    |
    | After R1           | 76%    | 61%    | 11%          | 232k    |

- **Warning signs:** one deliberate re-read (the detail band, as a token measurement).
- **Clarifying question:** none was needed that Session 10's entry should have answered.

**Major novel patterns Session 11:**

1. **`claude -p` input-token deltas are not a token meter.** The same file gave −2,859, 10,081 and
   15,715 tokens on three runs. What worked was a `get_usage` context reading before and after one
   Read.
2. **The archive trigger's bytes-to-tokens conversion was low.** Measured that way, the 31,138-byte
   band is ~12.5–14k tokens, not "under 10k". The token half of the trigger has been firing unseen.
3. **Prettier pads every Markdown table row to its widest cell.** `docs/TESTING.md` is 69% whitespace
   by bytes, from one table.
4. **`.claude/` is gitignored here except `agents/`.** Any settings or hook port must un-ignore
   `settings.json`. A plan written from another repo's layout carries that repo's `.gitignore`
   assumptions.
5. **One Fable grill round moved the 5-hour window eight points** (68% → 76%, ~175k tokens). Budget a
   grill and its confirm round before starting either.

## Session 10 — 28 September 2026 (CC-004: row 10 part two merged as #72, a PCR-style implementer, Session 5 archived)

**Row 10 part two merged as #72 (`61b5d43`), both reviews confirmed at nit-floor, and the next session researches
porting the PCR Formulation workflow here before CC-004 goes any further — Alex's instruction for this
handoff.**

**Setup:** loading instructions followed in order and every check matched: archive count 5, detail band
34,387 bytes, tree clean, `origin/main` at `9ca4d2b` with #70 and #71 merged, no open PRs, pre-push suite
green (36 unit, 21 e2e), `get_session self` reported Opus 5.5 at `high`.

**Done:** [#72](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/72),
`refactor/CC-004-poor-contrast-css-part-two`, five commits to `d2a305d`. The header title and the tabs
became `:global(body[data-contrast='poor'][…])` rule pairs; `isPoorContrast` and `isBackgroundDark` left
`TColourContrastContext` and the value (the provider still derives them for the attributes); six docs
lost their transitional wording. All fifteen sites are now rule pairs. The PR body carries the mutant
table and the pasted suite. **Merged: yes** — by Alex on 28 September 2026 with a merge
commit, `61b5d43`; branch deleted, pre-push suite green on `main` after it (36 unit, 21 e2e). **Uploaded to
the Web Store: no** (not a release).

**How it was built — the PCR `implementer` pattern, trialled at Alex's suggestion.** The code and docs were
written by a Sonnet 5.5 subagent from a brief modelled on
`/Users/alexclapperton/Desktop/PCR Formulation/.claude/agents/implementer.md`, which works one planned item,
lists every choice left open and never merges. Two rules were this repo's own, not the PCR file's: write
the mutation table (PCR asks for mutation evidence only under `packages/optimiser`), and do not open the
PR — the PCR agent opens its own, and here the review order puts the PR after both reviews. It took about three
and a half minutes and ~103k subagent tokens, and every claim in its report survived four reviewers. The
coordinator read the diff before dispatching reviewers. This repo has no `implementer.md` yet; the brief
was inline.

**Reviews:** `da-review` and `copilot-surrogate` on Fable 5.1, each in its own worktree. Round one: both
at nit-floor, one shared LOW (a date without its year), folded in `d2a305d`. Confirm round with fresh
verifiers: every conclusion CONFIRMED, no new finding above LOW.

**Also:** Session 5 archived in its own PR, [#74](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/74)
(`docs/CC-004-archive-session-5`, to `de764dd`), after two `copilot-surrogate` rounds (two MATERIAL
folded, then confirmed at nit-floor); opened beside this handoff. The two PRs both edit `PROGRESS.md` in hunks that do
not touch, so whichever merges second should merge cleanly — but check.

**Usage, read with `get_usage` (the tool the next session's research is about):** at start 5-hour 30%,
weekly 55%, Fable weekly 4%, context 79k of 1M; before this handoff 46%, 57%, 7%, 171k.

**Major novel patterns Session 10:**

1. **A confirm round after a nit-floor round one confirmed nothing new, at ~120k Fable tokens.** The rule
   (`docs/DEVELOPMENT.md` §Verification rounds) requires it; whether a round one with zero BLOCKING and
   MATERIAL and a one-word fold should still require it is decision (r), not changed here.
2. **`npx prettier` in a fresh worktree without `node_modules` fetches Prettier from the registry** rather
   than the checkout's pinned binary — the same 3.9.9 on the day, but nothing guarantees that. Check formatting with the main checkout's `node_modules/.bin/prettier` or run
   `npm ci` first.
3. **The implementer's report is the thing to read, not its diff alone.** Its "choices the brief left
   open" list surfaced the Prettier table re-pad, the date convention and a stray file it had created and
   deleted — each of which a reviewer would otherwise have had to discover.

## Session 9 — 24 to 27 September 2026 (CC-004: row 10 part one merged, atoms' variant in CSS)

**Setup:** loading instructions followed in order. Archive trigger 5, did not fire; detail band
33,224 bytes as predicted; tree clean; `origin/main` at `aa6297b`; no open PRs; pre-push suite green
(36 unit, 21 e2e). **Step 6 did not match again:** `get_session self` reported Opus 5.5 at `medium`.
Asked, Alex raised effort to `high` and kept Opus 5.5; the session confirmed it with `get_session`
before any design work.

**Done:** row 10 part one — **#68, `41e36c4`**, six commits, merged by Alex with a merge commit.
The data-attribute shape won over a `useThemeClass(styles)` hook because it removes the JavaScript
branch rather than moving it: the provider writes `data-contrast` (`poor` | `ok`) and
`data-background` (`dark` | `light`) onto `document.body` in an effect beside the two colour
properties, and each atom's `.xDark` / `.xLight` became
`:global(body[data-contrast='poor'][data-background='light' | 'dark']) .x` with its values
unchanged. Ten atoms, thirteen of the fifteen sites; eight atoms no longer read context at all
(`5384cf8`'s body says seven — corrected in the PR body, not amended). The test went first
(`6028b7a`): every element (59, counts fixed), every overridden property by role, non-white and
non-black backgrounds for the near-1:1 pairs, both sides of `contrast < 3`, and — after
`da-review` — a light-to-dark crossing that stays poor. `f91c844` renamed `ProviderProps` /
`ColourContrastContextTypes` to `TColourContrastProvider` / `TColourContrastContext`, as
`docs/CONVENTIONS.md` asked once `src/context.tsx` was touched; **it carries 🏷️ where `docs/GIT.md`
pins ♻️ for `refactor`**, flagged in the PR body, and the merge commit kept it on `main`.

**Reviews:** two rounds each, the cap. `da-review` round one: one MATERIAL (every light↔dark step
passed through a good pair, so dropping `isBackgroundDark` from the effect's deps stayed green —
and so did `npm run lint`); `copilot-surrogate` round one: one MATERIAL (`docs/CONVENTIONS.md`'s
"effects do four things" missed the new fifth) and five LOWs. The confirm round of both reached
nit-floor with three LOWs: two prose, folded before the PR opened, and one process, deferred as
decision (n). (#68's body says "three prose LOWs"; two is right.)

**Post-merge:** branch deleted with `-d`; #69 merged under the delegation, the classifier allowing
`gh pr merge 69 --merge --admin --delete-branch` first time; `npm ci`, then the pre-push suite green
on `fadd8a8` (36 unit, 21 e2e). `git fetch --prune` cleared three merged branches Session 8
left — stale tracking refs only; GitHub had already deleted the branches on merge. Session 4 is archived in its own PR (`docs/CC-004-archive-session-4`), opened beside this handoff.

**Major novel patterns Session 9:**

1. **A test value that equals the fallback hides the fallback.** The widened test's first draft used
   `#ffffff` / `#000000` as the poor-pair backgrounds, so a `bg`-role property that fell back to
   `--background-color` read exactly the white or black it should have been. Two of eleven mutants
   passed until the backgrounds became `#eeeeee` / `#111111`. Pick values that differ from every
   plausible wrong answer, not just the right one.
2. **A path through a good state masks a dependency bug.** Filling background then foreground always
   crossed a good pair, re-running the effect for the wrong reason. The mutant also passed lint:
   `react-hooks/exhaustive-deps` is a warning and `lint:js` sets no `--max-warnings` — decision (n).
3. **Concurrent reviewers need their own worktree, in the dispatch prompt.** Both round-one agents
   were sent to build and mutate the main checkout at once; a follow-up message moved each into a
   `git worktree` before they collided. The confirm round's prompts carried the worktree step from
   the start.
4. **A grep that cuts a selector can manufacture a defect.** `grep -o 'body\[…'` on the emitted CSS
   showed `._cta_…):not(…)` with a stray `)`, which looked invalid; the line started
   `:is(body…`, which postcss-nesting adds around a complex parent. Read emitted CSS with its left
   context before calling it broken.
5. **The author's own count is a claim too.** "Seven" atoms in a commit body was eight, and the
   gitmoji was off-table; both were caught only after commit, where the never-amend rule makes them
   permanent. Count and check the type table before `git commit`, not after.

## Session 8 — 22 September 2026 (CC-004: PR 9 merged, poor-contrast switch pinned)

**Setup:** loading instructions followed in order. Archive trigger 5, did not fire; tree clean;
`origin/main` at `8af89df` (the Session 7 close, #64, one later than the block predicted); no open
PRs; pre-push suite green (36 unit, 20 e2e). **Step 6 did not match:** `get_session self` reported
Sonnet 5 at `xhigh`, and ultracode was on. The session cannot change its own model, so it asked;
Alex chose Opus 5 at `high` and ultracode off, and switched both himself before PR 9's design work.

**Done:** PR 9 — **#65, `25cf7ab`**, five commits, merged by Alex with a merge commit. One e2e test,
_poor contrast turns every themed control black on a light background and white on a dark one_,
reads one element per poor-contrast site (fifteen across twelve components) plus `ActionCta`'s
filled variant, in three states: the default pair, `#ffffff`/`#eeeeee` and `#000000`/`#111111`.
It compares resolved colours through a probe element, not class names or spellings, so row 10 can
move the switch into CSS under it. Watched failing: all 30 Dark/Light branches set to `false` one
at a time, 30 red. The doc sweep moved the e2e count to 21 in six files (the seventh, this file's
loading block, is this handoff's) and corrected
`docs/ARCHITECTURE.md`'s "the only automated tests are Playwright", false since #58.

**Reviews:** two rounds, the cap. `da-review` round one: one MATERIAL (the filled Reverse, Close and
share buttons were never read — deleting their `.ctaWithBackground` rule left the test green) and
two Low (the assertion compared the value as written, so `black` failed where `#000` passed; unread
companion properties undocumented). `copilot-surrogate` round one: two MATERIAL (two more stale
"20"s) and two Low. In the confirm round `da-review` re-verified its fixes with its own red runs and
`copilot-surrogate` re-checked the docs; both reached nit-floor, with one new Low from `da-review`
(below), fixed before the PR opened.

**Post-merge:** branch an ancestor of `main`, deleted with `-d`; pre-push suite green on `25cf7ab`
(36 unit, 21 e2e). Session 3 archived in its own PR (`docs/CC-004-archive-session-3`).

**Major novel patterns Session 8:**

1. **Killing every branch mutant is not killing every mutant.** The author's sweep set all 30 JS
   branches to `false` and every one went red, and the test still missed a whole rule: the JS
   branch was covered, the CSS it switches on was not read for one variant. `da-review` found it by
   mutating the stylesheet, not the component. For a test that pins a visible outcome, mutate the
   layer that produces the outcome as well as the one that decides it.
2. **A fix to a test's permissiveness opened a new one, and only the confirm round saw it.** Painting
   the value onto a probe made the test compare colours, not spellings — and an unparsable value
   made the probe silently inherit the body's colour, which at the default pair is exactly the
   expected foreground (`notacolor` passed). The confirm round exists for this: re-attack the fix,
   not just re-check the finding.
3. **The count-sweep grep had the same hole the count had.** The sweep searched for `20 tests`,
   `20 Playwright` and similar, and missed "20 green tests" and "20-test" — `copilot-surrogate`
   found both. A third instance of decision (l)'s pattern (22 → 25, 25 → 36, now 20 → 21 e2e).
4. **A session's recorded model decision is not self-enforcing.** The loading block said Opus 5 at
   `high`, ultracode off; the session arrived on Sonnet 5 at `xhigh` with ultracode on. The check in
   step 6 caught it before any design work — that step is the enforcement, so keep it.
5. **Two reviewers and a drafting session can share one repo without stepping on each other.** The
   archive branch stayed checked out for its reviewer while the handoff was drafted in a separate
   `git worktree`, so no agent read a tree that changed under it.

## Session 7 — 22 September 2026 (CC-004: PR 8 merged, hex-input parser extracted)

**Setup:** loading instructions followed in order. Archive trigger checked first —
`grep -c '^## Session [0-9]' PROGRESS.md` gave 4 (Sessions 3–6), so no archive PR stood between
this session and PR 8, as predicted. State confirmed clean, `origin/main` at `6121a98` or later
(it was `b432028`), `gh pr list` showed one item not predicted by the handoff: Dependabot's #61
(dev-dependencies group, green). Merged it under the standing delegation
(`gh pr merge 61 --merge --admin --delete-branch`) — the first attempt was refused by the
Claude Code auto-mode classifier ("Merge Without Review"), which does not automatically honour a
written, dated delegation in `CLAUDE.md`; the user changed a permission rule and the retry
succeeded (`678252f`). Pre-push suite re-verified green before starting PR 8.

**Done:** PR 8 of the approved plan — `toCompleteHex` extracted from
`color-controls.tsx` into `src/utils/parse-color-input.ts`, unchanged, with the first unit tests
for it. TDD as `CLAUDE.md` asks: the test file was written against the not-yet-existing module
first and watched fail on module resolution, then the move, then green. Full review gate:
`da-review` found two MATERIAL (no test pinned the length guard against an 8-digit `#rrggbbaa` hex,
which chroma accepts and silently truncates — added and watched red with the guard removed; a
`~/utils/color-utils` import that should have been `./color-utils`, same directory); self-review
clean; `copilot-surrogate` on the resulting doc-sweep commit found seven MATERIAL, all the same
shape — CLAUDE.md, README.md, `docs/CONVENTIONS.md`, `docs/DEVELOPMENT.md`, `docs/GLOSSARY.md`,
`docs/SELF-REVIEW.md` (two spots) and `docs/TESTING.md` all stated the unit suite as "25 Vitest
cases over `color-utils.ts`", stale the moment the second file landed (36 total). A confirm round
on that fix reached nit-floor — two discovery rounds plus one confirm, the cap `CLAUDE.md`
prescribes. Merged as **#62, `f046ccf`**, three commits (`0d87535`, `7642bbe`, `8b00ae7`). Then a
small follow-up PR, **#63, `d0db204`/`36fe364`**, updated `PROGRESS.md` itself — deliberately not
bundled into #62 (below).

**Post-merge:** both PRs merged with a **merge commit**, not the rebase default (Alex's call per
PR) — the branch commits kept their original hashes and `git merge-base --is-ancestor` confirmed
each branch was an ancestor of `main` before `git branch -d` (not `-D`; nothing to force). Pre-push
suite re-verified green on `main`'s new tip after each merge.

**Major novel patterns Session 7:**

1. **A written, dated delegation in `CLAUDE.md` does not automatically clear the runtime's own
   safety classifier.** The Dependabot merge delegation (`docs/GIT.md` §Who merges, granted
   11 September 2026) is explicit and durable, but `gh pr merge --admin` was refused outright on
   first attempt with reason "Merge Without Review" — the classifier does not read `CLAUDE.md` to
   know the merge is pre-authorized. It took the user changing a permission rule, not a stronger
   citation of the delegation, to get past it. Record this as a limit on what "pre-authorized in a
   durable instruction file" can mean in practice: it authorizes the _action_, not the _tool call_
   against a runtime gate that has no visibility into repo-level policy.
2. **An equivalent mutant looks like a real gap until you run it.** The DA-fold commit's own
   self-check mutated the `isShortHand` regex bound (`{3,5}` → `{3,4}`) and found it made no
   difference to any test — correctly diagnosed as equivalent, because every 3–5 digit candidate is
   already rejected by the `length !== 7` check regardless of the regex. The same session, `da-review`
   found a real gap one line down: removing the length check (not the regex) let an 8-digit
   `#rrggbbaa` hex through, because chroma parses and silently truncates it. Two mutants one line
   apart, one dead and one live — the distinction only shows up by running both, not by inspection.
3. **This repo's own git history contradicts a generic line in `docs/SELF-REVIEW.md`.** §Claims and
   consistency says a change to next-session loading instructions "edits `PROGRESS.md` in the same
   PR" — adapted from other repos. Every actual `PROGRESS.md` handoff update in this repo's history
   (#46, #49, #51, #53, #57 and now #63) is its own small PR opened _after_ the feature PR merges,
   because the count or state the loading instructions cite is still true on `main` until the
   feature PR lands. Followed the specific, observed practice over the generic line rather than
   bundling #63 into #62; not fixed here (scope), carried to Session 8 below.
4. **One new test file made the same doc claim stale in seven places at once.** `parse-color-input.test.ts`
   landing meant every file that had ever restated "the unit suite is N Vitest cases" went wrong
   together — CLAUDE.md, README.md and five files under `docs/`. PR 7 (18 September 2026) hit a
   milder version of the same thing when the WCAG boundary fix moved the count from 22 to 25. Twice
   now; `docs/DEVELOPMENT.md` §Process-rule promotion says a rule needs two incidents before promotion — this is
   at two, so it is at least worth naming as a candidate: derive the count from `npm run test:unit`
   in scripts/CI output rather than hand-copying it into seven files, or accept the drift as the
   cost of prose that names concrete numbers. Not decided; carried to Session 8.

## Next session loading instructions

1. Read `CLAUDE.md` (auto-loaded), then this file top to bottom, then
   `docs/research/01-pcr-workflow-port.md` from #75's branch (`docs/CC-005-pcr-workflow-proposal`), or
   from `main` if Alex has merged it.
    - Its §8 table and closing fold section are the plan. §1 to §7 keep R1-era wording where the fold
      supersedes it.
    - The `CC-004` plan below is paused until all eight `CC-005` PRs merge (Alex).
2. **Archive check.** `grep -c '^## Session [0-9]' PROGRESS.md` gives 5 (Sessions 7 to 11): `CC-005`
   PR E archived Session 6, the pre-grill Brief and the 11 September commit sequence together.
3. **Confirm the state, live.**
    - `git status --short` (expect clean), `git log --oneline -5 origin/main` (expect `2fd018b` or later),
      `gh pr list`. Expect draft #75 and this handoff, and perhaps a Dependabot PR (delegated).
    - Remote branches: `main`, `feat/CC-003-apca-3`, `chore/CC-004-copy-to-clipboard-4` (do not delete),
      plus the two `CC-005` branches.
4. Run the pre-push suite before touching anything:
   `npm run lint && npm run test:unit && npm run build && npm run test:e2e`. Expect 36 Vitest cases and 21
   Playwright tests.
5. **Primary work: finish PR H, then build E.**
    - Run `spec-grill` R2, a confirm-or-disprove round with a fresh verifier on Fable 5.1, on
      `docs/research/01-pcr-workflow-port.md` at #75's head.
    - Fold what it finds on #75's branch as new commits. Never amend.
    - Then run `da-review` and `copilot-surrogate` on #75: the file is in `docs/**` and over 200 lines.
    - Mark #75 ready. Alex merges.
    - Then PR E, following the fold's M3 line.
6. **Model and usage.**
    - Opus 5.5 at `high`. Check `get_session self`, and ask Alex to change it in the model menu if it is
      wrong.
    - Reviewers on Fable 5.1, passed per call until PR A pins them. At most two at a time.
    - **Trial the proposal's handoff lines now:** soft 150k, hard 250k, 5-hour 85%, weekly 90%, Fable
      weekly 85%. Read them with `get_usage` at start, after each digest, before each fan-out and at
      handoff, and record a Handoff facts block like Session 11's.
    - Session 11 ended with the 5-hour window at 76%. Read it before dispatching R2: one grill round cost
      eight points.
7. Decision branches carried in. **Settled in Session 11** (`docs/research/01-pcr-workflow-port.md`, Decisions): **(p)** promoted in PR D; **(q)** `CC-005`; **(r)** recorded as an observation, not adopted; **(s)** `implementer.md` on Sonnet at `high`, PR B. The settled (a), (c), (d) and (e) are
   archived (`docs/history/SESSIONS.md` §Retired sections). The rest is Session 10's text, unchanged:
   **(f)** whether to adopt a mutation gate, whose re-entry condition fired when the colour utilities got
   unit tests — recorded as fired in six files, adopted nowhere; **(g)** whether to adopt `docs/INDEX.md`,
   whose "after roughly ten PRs" condition fired at 28 merged / 21 human-authored; **(b)** whether
   workstream 5, now five sibling fixes rather than three (§Next workstreams item 5), starts before or
   after CC-004 finishes;
   **(h)** which button a _delegated Dependabot_ merge uses: `CLAUDE.md` §PR workflow and `docs/GIT.md`
   §Who merges both prescribe `gh pr merge <n> --merge --admin --delete-branch`, written before rebase became
   the default. #55 was merged that way because that is what they say. Not changed without Alex; **(i)** two
   carry-overs from Session 2, still open — `copilot-surrogate.md`'s trigger names comment-block edits in
   `public/app/*.js`, which the `CLAUDE.md` path table cannot express (leave as a superset, or drop it), and
   `docs/TESTING.md` cites `test/e2e/fixtures.ts` by line number (28, 43, 87 — still landing on
   18 September 2026), which will drift the first time the fixture file changes. The store published 2.1.0
   on 12 September 2026; read the public listing before any release rather than assuming
   (`docs/GIT.md` §Releases has the URL); **(j)** the Claude Code auto-mode classifier refused
   `gh pr merge 61 --merge --admin --delete-branch` on first attempt ("Merge Without Review") despite
   the standing delegation in `docs/GIT.md` §Who merges — a written, dated delegation does not by
   itself clear the runtime's own safety gate. Alex added a permission rule and the retry succeeded.
   Whether that rule persists into this session is unknown; if a delegated Dependabot merge is
   refused again, surface it and ask rather than assuming the rule is gone or working around it
   another way. Session 9's #69 merged first time with the same command; **(k)** `docs/SELF-REVIEW.md` §Claims and consistency's generic "same PR" line for
   `PROGRESS.md` updates is contradicted by this repo's own history — thirteen close-out PRs by Session 8 (#36 and #41 on 11 September, then CC-004's #46, #49, #51, #53, #57,
   #59, #60, #63, #64, #66 and #67 — handoffs and archives), every one its own small PR, and all but #51
   (written while #50 was still open, as Session 6's entry recorded; `docs/history/SESSIONS.md` row 6) opened after the feature PR merged; Session 9's
   two follow the same shape. Worth rewriting that line to match observed
   practice, or leaving it and continuing to
   disagree with a stated reason each time it comes up; not decided; **(l)** the "N Vitest cases"
   doc-staleness pattern has now hit twice — PR 7's count bump (22 → 25) and PR 8's second file
   (25 → 36) — meeting `docs/DEVELOPMENT.md` §Process-rule promotion's two-incident bar for promoting a rule.
   Whether that becomes "derive the count from script/CI output instead of restating it in up to
   seven files" or stays accepted drift is Alex's call, not made this session. **Session 8 made it three**: PR 9's
   e2e count (20 → 21) went stale in seven files, and the sweep's own grep missed two of them
   ("20 green tests", "20-test"); **(m)** a date drift, found in PR 9's review and left
   untouched there: five files say the colour-utility unit tests reached 25 cases on **17** September,
   when the history shows the 18th (`4799394`) — `README.md`, `docs/CONVENTIONS.md`,
   `docs/GLOSSARY.md`, `docs/DEVELOPMENT.md`, `docs/SELF-REVIEW.md` (`CLAUDE.md` and `docs/TESTING.md`'s
   baseline row are right). Two more put 25 beside 17 September in a sentence that is literally true —
   `docs/DA-REVIEW.md:20` (the re-entry "fired" that day) and `docs/TESTING.md:11` (the file was "added"
   that day) — and belong in the same fix so a reader is not left to rediscover them. Every count is
   correct; only the date is wrong. A one-commit docs PR whenever it suits. Session 9's surrogate found two of those files
   (`docs/GLOSSARY.md`, `docs/CONVENTIONS.md`) touched by #68 and still carrying it — still untouched;
   **(n)** whether `lint:js` gains `--max-warnings 0`. In #68's round one, dropping `isBackgroundDark` from
   an effect's dependencies passed `npm run lint`, because `react-hooks/exhaustive-deps` is a warning in
   `eslint-plugin-react-hooks`' recommended set and `lint:js` is plain `eslint .`. `npx eslint . --max-warnings 0`
   exited 0 on the #68 branch, so the flag costs nothing today. A `package.json` change, so both
   reviews; Alex's call whether it is its own small PR or waits;
   **(o)** `f91c844` reached `main` with 🏷️ as a `refactor` gitmoji, where `docs/GIT.md`'s table pins ♻️.
   History is not rewritten; the only open question is whether the table should admit 🏷️ for
   type-only renames or the slip stays a slip. Default: a slip.
   **(p)** whether the worktree-per-reviewer rule in step 6 is promoted into `docs/DEVELOPMENT.md` §Scale
   the fan-out. It has no home in `docs/` today, and it has fired twice (Session 8 pattern 5, Session 9
   pattern 3), which meets `docs/DEVELOPMENT.md` §Process-rule promotion's bar. A policy-adjacent docs
   edit, so `copilot-surrogate`; Alex's call whether it goes alone or folds into the PCR proposal (step 5), which
   covers agents and dispatch anyway. Session 10 used it a third time.
   **(q)** which ticket key the PCR workflow port goes under — `CC-004` is the code-quality workstream,
   and the keys are Alex's tracker (`docs/GIT.md`), so none is invented here;
   **(r)** whether a confirm round is still required when round one is already at nit-floor with nothing
   above LOW and a fold of a word or two — Session 10 pattern 1; the PCR research may answer it;
   **(s)** whether `implementer.md` becomes a checked-in agent here, and on which model — Session 10 ran
   one inline on Sonnet 5.5 against the "agents on Fable" line in step 6; part of step 5's first bullet.

## Session archive

Archived sessions are in `docs/history/SESSIONS.md` (Session 1, archived 13 September 2026; Session 2,
18 September 2026; Session 3, 22 September 2026; Session 4, 27 September 2026; Session 5, 28 September 2026; Session 6, 29 September 2026). Full
retrospective survives in `git log -p PROGRESS.md` at that session's compression commit.
