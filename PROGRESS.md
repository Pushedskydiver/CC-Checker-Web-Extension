# Progress

Living state document — current state, what's next. Session-by-session detail archives out to
`docs/history/SESSIONS.md` (mechanics: `docs/SESSION-HANDOFF.md`).

## Next workstreams (after Session 18)

Updated 29 September 2026, end of Session 18: **the Session 12 archive is open as
[#93](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/93), reviewed and confirmed at nit-floor.** PR F
is scripted but not started on a branch (loading step 5); G follows, then CC-004 row 11.

Updated 29 September 2026, Session 18: **the Session 11 archive (#90, `5629d6e`), PR C (#91, `a358bee`) and the
Session 17 handoff (#92, `075e38d`) all merged, so the paragraph below is history.** Session 12 is archived in its
own PR, and PR F is next.

Updated 29 September 2026, end of Session 17: **the Session 11 archive is open as
[#90](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/90), and PR C as
[#91](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/91), both reviewed and confirmed at nit-floor, and #91 is marked ready.** C makes `AGENTS.md` the
instruction file, with `CLAUDE.md` importing it, and promotes decision (r), scoped by Alex to prose-only LOW folds. F and
G follow, then CC-004 row 11.

Updated 29 September 2026, Session 17: **PR D (#88, `874846a`) and the Session 16 handoff #89 (`83780fe`)
both merged, so the paragraph below is history.** Session 11 is archived in its own PR, and PR C is next.

Updated 29 September 2026, end of Session 16: **the Session 10 archive merged as
[#87](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/87) (`0d93607`), and PR D,
`docs/SESSION-HANDOFF.md`, is open as [#88](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/88),
reviewed to nit-floor and confirmed.** The `implementer` built D, its first real use. PR C is next, once D
merges.

Updated 29 September 2026, Session 16: **#83 (`47edec3`), #84 (`773d546`), #85 (`aa065e3`) and the Session 15
handoff #86 (`759db88`) all merged between 02:10Z and 02:14Z, so the paragraph below is history.** #86 was not
reviewed, and no review runs on it after the merge (Alex); its stale lines are corrected here.

Updated 29 September 2026, end of Session 15: **three PRs are open, each reviewed to nit-floor and
confirmed: the Session 9 archive
([#83](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/83)), PR B, the `implementer`
agent ([#84](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/84)), and the branch-protection docs ([#85](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/85)).** This handoff stacks on #83. PR D is next.
Alex ruled out post-merge reviews. #80, #81 and #82 had merged before the session started.

Updated 29 September 2026, Session 15: **#80 (`663e144`), #81 (`4011bf1`) and the Session 14 handoff #82
(`24fc475`) all merged that day, so the paragraph below is history.** Session 9 is archived in its own PR,
and PR B followed as #84.

Updated 29 September 2026, end of Session 14: **the Session 8 archive is open as
[#80](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/80) and PR A as
[#81](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/81); both reached nit-floor after a
review and a confirm round, and both are Alex's to merge.** PR B is next. Session 14 handed off on the soft
line (trigger 2) with the hard line close, and the 5-hour window at 36%.

Earlier in Session 14: **#75 (PR H), #78 (PR E) and the Session 13 handoff (#79) all merged
that day, as `697b8a2`, `90fc6a5` and `b4de022`, each with the merge-commit button.** #79's
`copilot-surrogate` ran post-merge on `b4de022`, and its findings are folded into the Session 8 archive PR.
The Session 13 state follows.

Updated 29 September 2026, end of Session 13: **PR H (#75) was ready for review and PR E open as #78.** H's review fold passed its confirm round at nit-floor, and Alex answered decision (t):
`deny` on `git commit --amend`. E archived Sessions 6 and 7 and passed both reviews and a confirm round. PR A
is next. Session 13 handed off on the soft token line (trigger 2), with the 5-hour window at 22%.

Updated 29 September 2026, end of Session 11: **the PCR workflow port is researched, proposed and approved
by Alex as `CC-005`.** It is eight PRs, ordered H, E, A, B, D, C, F, G, and the plan is
`docs/research/01-pcr-workflow-port.md` (§8, Decisions, and the three review folds). That file merged to
`main` as `697b8a2` ([#75](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/75), PR H); R2 and both
reviews passed in Session 12, the confirm round in Session 13. CC-004 row 11 waits for all eight (Alex). The paragraph below is the Session 10 state and
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
   `AGENTS.md` trigger table says so, the e2e suite as the gate.
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
   proposal approved, `spec-grill` R1 folded (Session 11, in `git show 83780fe:PROGRESS.md`). R2 and both reviews ran and were folded in
   Session 12; the confirm round passed in Session 13 (§Session 13), and #75 merged as `697b8a2` the same day (the
   Session 14 paragraph above).

### The approved plan (CC-004), approved by Alex 12 September 2026

It replaced the 11 September brief, now archived (`docs/history/SESSIONS.md` §Retired sections); "the
brief" below means that text.

Measured against `main` at `94cd658`. The Reviews column is a **prediction** of which `AGENTS.md` trigger
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

## Session 18 — 29 September 2026 (CC-005: Session 12 archived as #93, PR F scripted)

**The Session 12 archive is open as #93, at nit-floor after a review and a confirm round; PR F's conversion is
scripted and checked, not yet on a branch.** Nothing merged this session.

**Setup:** #90, #91 and #92 had merged, `main` was at `075e38d`, there were no open PRs, the three standing remote
branches were present and `../cc-pr-c` was already gone. #92's stale lines were corrected in #93. The pre-push suite
was green (36 unit, 21 e2e). `get_session self` reported Opus 5.5 at `high`.

**Done:**

- **[#93](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/93)**, `docs/CC-005-archive-session-12`,
  `291a668`: Session 12 becomes row 12, and its cites point at `git show 075e38d:PROGRESS.md`. It also folds
  `da-review` LOW 3 on #91, so the `PROGRESS.md` pointers name `AGENTS.md`. `copilot-surrogate` (~103k tokens)
  found 1 MATERIAL ("Sessions 6 to 11" not bumped), 1 LOW and 3 nits, all folded. The confirm round (~39k)
  CONFIRMED all four in-tree folds and found one LOW that the fold itself caused (the band went from 22,576 to
  22,609 bytes). That was a prose-only fold, so the coordinator read it (decision (r)).
- **PR F, prepared, not built.** Converting §What each test proves takes `docs/TESTING.md` from 117,068 to
  34,557 bytes and passes Prettier. The method is in loading step 5.
- **Merged:** nothing. **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 1. #93 was finished with context at 149k, above 130k, so F was not started (the soft line is
  150k).
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment                 | 5-hour | Weekly | Fable weekly | Context |
    | ---------------------- | ------ | ------ | ------------ | ------- |
    | Start                  | 38%    | 77%    | 34%          | 73k     |
    | After round one's fold | 42%    | 78%    | 35%          | 139k    |
    | Handoff                | 43%    | 78%    | 35%          | 149k    |

- **Plan usage:** the 5-hour window resets at 02:30Z on 30 September, and the weekly windows at 15:00Z on
  2 October.
- **Warning signs:** none. The reviewer and the confirm verifier shared one detached worktree, one after the
  other, never at the same time.
- **Clarifying question:** none that Session 17's entry should have answered.

**Major novel patterns Session 18:**

1. **A fold inside the band moves the band figure quoted outside it.** #93's LOW fix added 33 bytes to the
   Session 13 entry, so step 2's figure went stale. #90's LOW (26,527 taken before #89's fold made it 26,569)
   was the same class, which makes two incidents. The candidate rule is to re-take any band figure after the
   last commit that touches the band. Promoting it is Alex's call (`docs/DEVELOPMENT.md` §Process-rule
   promotion).
2. **The table's Group column was not the spec's title.** It shortened `colour picker (needs captureVisibleTab)`
   to `colour picker`, while the section's intro says "Titles are the spec's own". Diffing the planned headings
   against `npx playwright test --list` caught it before anything was built.
3. **One surrogate plus a scoped confirm round cost about 5 points of the 5-hour window** (38% to 43%, ~142k
   subagent tokens). A confirm round scoped to the fold diff cost ~39k, against ~103k for the full read.

## Session 17 — 29 September 2026 (CC-005: Session 11 archived as #90, PR C opened as #91)

**PR C is open as #91: `AGENTS.md` is the instruction file, `CLAUDE.md` imports it, and decision (r) is promoted.**
Nothing merged this session.

**Setup:** #88 and #89 had merged, `main` was at `83780fe`, there were no open PRs, the three standing remote branches
were present and there were no worktrees. #89's stale lines were corrected in #90. The pre-push suite was green
(36 unit, 21 e2e). `get_session self` reported Opus 5.5 at `high`.

**Done:**

- **[#90](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/90)**, `docs/CC-005-archive-session-11`,
  `ee45a84`: Session 11 becomes row 11, and the band is 5 entries and 23,008 bytes. `copilot-surrogate` found
  1 MATERIAL (seven sentences still read #88 and #89 as open), 1 LOW and 1 nit, all folded. The confirm round
  CONFIRMED all three and found nothing new.
- **Decision (r), promoted by Alex**, and then scoped by him, after the `implementer` found that Session 8's
  `notacolor` hole came from a LOW's test-probe fix. A LOW-only fold skips its confirm round only if it touches
  prose alone, and a round with no findings needs no confirm.
- **PR C, [#91](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/91)**, `docs/CC-005-agents-md-swap`,
  `d5f3565`, built by the `implementer` (Sonnet, ~131k tokens) in its own worktree. It is ready, and CI is green.
    - The budget sits at 149 of ~150 prose lines.
    - `da-review` found 1 MATERIAL (the zero-findings clause contradicted three lines), 4 LOW and 1 nit.
      `copilot-surrogate` found 1 LOW and 2 nits, and disproved the implementer's doubt about
      `copilot-surrogate.md:71`. Everything was folded except `PROGRESS.md`'s stale pointers (loading step 5).
    - Confirm round (a MATERIAL was folded): a fresh `da-review` verifier (~52k) CONFIRMED all six findings,
      found nothing new, and reached nit-floor.
    - **Sentinel check.** A fresh `claude -p` session's subagent quoted `AGENTS.md`'s budget sentence, so the
      import expands. An in-session subagent saw the old file.
- **Merged:** nothing. **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 2, the soft line, passed at ~188k before C's reviews. The two units in hand were finished, and F
  was not started. Context was 236k at handoff, close to the 250k hard line, so this handoff PR is unreviewed.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment             | 5-hour | Weekly | Fable weekly | Context |
    | ------------------ | ------ | ------ | ------------ | ------- |
    | Start              | 22%    | 75%    | 31%          | 71k     |
    | Before C's reviews | 27%    | 76%    | 32%          | 188k    |
    | Before C's confirm | 36%    | 77%    | 34%          | 213k    |
    | Handoff            | 37%    | 77%    | 34%          | 236k    |

- **Plan usage:** the 5-hour window resets at 02:30Z on 30 September, and the weekly windows at 15:00Z on
  2 October.
- **Warning signs:** one. `d5f3565` (one line) was pushed after only a Prettier check. The suite ran straight
  after and was green (36, 21), but the rule says before. Every reviewer had its own detached worktree.
- **Clarifying question:** none that Session 16's entry should have answered. The two (r) scope questions were new.

**Major novel patterns Session 17:**

1. **In-session subagents inherit the session's instructions, cached at start.** A subagent dispatched after
   `CLAUDE.md` changed on disk quoted the old file. Test an instruction-file change from a fresh process
   (`claude -p` in the branch's worktree). A running session keeps the old rules until it restarts.
2. **The implementer's evidence check reshaped the rule it was asked to write.** Checking the counter-case
   showed that the hole came from a LOW. Alex narrowed the promotion to prose folds before any review.
3. **Stacking the confirm round on a first review saved a dispatch.** One surrogate carried #90's confirm
   round and C's first review (~203k tokens). Two reviewers and the implementer moved the 5-hour window about
   14 points (22% to 36%).

## Session 16 — 29 September 2026 (CC-005: Session 10 archived as #87, PR D opened as #88)

**The Session 10 archive merged as #87, and PR D is open, reviewed, folded and confirmed at nit-floor.** D is
the `implementer`'s first real use.

**Setup:** every loading check matched Alex's corrected expectations: #83 to #86 merged, `main` at `759db88`, no
open PRs, the three standing remote branches, no worktrees. Pre-push suite green (36 unit, 21 e2e).
`get_session self` reported Opus 5.5 at `high`.

- **#86's stale lines, corrected here** (Alex: no post-merge review): its top paragraph says three PRs are open
  and that the handoff stacks on #83, and loading step 3 expects #83, #84, #85 and #86 open. All four merged
  (above). Nothing else in #86 was checked.

**Done:**

- **[#87](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/87)**,
  `docs/CC-005-archive-session-10`, merged by Alex as `0d93607` (a merge commit): Session 10 becomes row 10, and three cites point at
  `git show 759db88:PROGRESS.md`. `copilot-surrogate`: nit-floor, 2 LOW, folded; confirm round CONFIRMED,
  nothing new. The band is 5 entries, 21,815 bytes, before this entry.
- **PR D, [#88](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/88)**,
  `docs/CC-005-session-handoff-doc`, `97ccf07` (Alex then merged `main` in as `c0eb71b`): `docs/SESSION-HANDOFF.md` (10,677 bytes), with
  `docs/DEVELOPMENT.md` §Session handoff as a pointer that reverses the old "no numeric thresholds" line. The
  worktree rule is promoted (p), (r) is recorded as a candidate, and five siblings are repointed.
    - **Built by the `implementer`** (Sonnet, ~113k tokens, ~5 minutes) from a coordinator brief that settled
      trigger 1's floor (130k) and the archive line (24,000 bytes). It listed 14 open choices. One corrected
      the brief: a rebase makes no merge commit, so "cite a merge commit" is not always possible.
    - `da-review` (~122k): 3 MATERIAL, 4 LOW. Trigger 1 collided with the unit-in-hand rule; the 130k reasoning
      claimed more than the readings show; trigger 6 cannot "override" trigger 2. `copilot-surrogate` (~161k,
      with #87's confirm round): 2 LOW. All folded by the coordinator in `e1a9cd8`.
    - Confirm round, a fresh `da-review` verifier (~65k): every fold CONFIRMED, nit-floor, 3 LOW. Two are
      folded in `97ccf07`; the third is step 6 below. `97ccf07`'s body gives the LOW-only fold as the reason to
      stop, which reads as applying (r); the reason is the two-round cap, then a manual pass. #88's body
      corrects it.
    - **`isolation: worktree` trialled once** (R1 L1): the worktree started at `main`, not the checkout's
      HEAD, had no `node_modules`, and left a harness branch, deleted after. Recorded in D.
- **Merged:** #87 (Alex, 21:51Z). **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 2, the soft line, passed at ~151k after #87's first fold, with D already dispatched. Both units
  were finished, with their review and confirm rounds. Context 213k at handoff; the hard line is 250k.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment               | 5-hour | Weekly | Fable weekly | Context |
    | -------------------- | ------ | ------ | ------------ | ------- |
    | Start                | 0%     | 72%    | 26%          | 89k     |
    | #87 folded, D built  | 5%     | 73%    | 27%          | 151k    |
    | D's reviews digested | 15%    | 74%    | 30%          | 184k    |
    | #88 opened, handoff  | 18%    | 75%    | 30%          | 213k    |

- **Plan usage:** the 5-hour window resets at 02:30Z on 30 September; the weekly windows at 15:00Z on
  2 October.
- **Warning signs:** none. Every reviewer had its own worktree.
- **Clarifying question:** none.

**Major novel patterns Session 16:**

1. **Decision (r)'s promotion point may have been met.** #84's confirm round (Session 15) and #87's (this
   session) each followed a LOW-only fold and found nothing new. D records the candidate rule with exactly that
   promotion point; promoting it is Alex's call, not taken here.
2. **The implementer's open-choice list caught an error in the coordinator's brief.** The brief said a merge
   commit survives any merge button, and the rebase button makes none. A brief is a claim too.
3. **A plan's slip reaches the built doc unless the reviewer executes it cold.** "Triggers 4 to 6 override
   trigger 2" came from the plan's own §PR D, and it was wrong for trigger 6. `da-review`, told to execute the
   doc with only `CLAUDE.md` and `PROGRESS.md` in hand, found it.
4. **`isolation: worktree` is not yet a drop-in.** It started from `main`, not the branch under review, and
   left a harness branch behind. Manual detached worktrees stay the rule.

## Session 15 — 29 September 2026 (CC-005: Session 9 archived as #83, PR B and branch-protection docs opened)

**PR B and two small docs PRs are open, each reviewed, folded and confirmed at nit-floor.** Nothing merged.
Alex ruled that no review runs on a PR after it has merged.

**Setup:** every loading check matched: #80, #81 and #82 merged, `main` at `24fc475`, no open PRs, the three
standing remote branches, no worktrees. Pre-push suite green (36 unit, 21 e2e). `get_session self` reported
Opus 5.5 at `high`.

**Done:**

- **Post-merge reviews dropped (Alex).** The #82 review was dispatched per step 5, then stopped when Alex
  said he never set the practice and none of his other repos run it. It began with #77 (Session 13). Recorded in
  #83 and in memory.
- **[#83](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/83)**,
  `docs/CC-005-archive-session-9`: Session 9 becomes row 9; the loading steps stop hedging on #80 to #82.
  `copilot-surrogate`: 3 MATERIAL (all state sentences), folded; confirm round CONFIRMED all, 1 LOW and
  1 nit, folded.
- **PR B, [#84](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/84)**, `chore/CC-005-implementer-agent`: `.claude/agents/implementer.md` (`model: sonnet`,
  `effort: high`), plus its line in `docs/ARCHITECTURE.md`, `docs/GIT.md` and `docs/GLOSSARY.md`.
    - **Dry run**, per "Reviews of PR H" §PR B: the brief was rebuilt from §Session 10 (now in `git show 759db88:PROGRESS.md`), and CC-004 row 10
      part two was built blind from #72's parent `9ca4d2b` on Sonnet (`general-purpose` told to follow the
      file; ~107k tokens, ~6 minutes). Its `src/` came out byte-identical to #72's, and 17 mutants all went
      red. Suite on its head: 36 unit, 21 e2e. It edited four docs where #72 edited six. The other two
      were clarifications of true sentences. Eight of its ten friction points are folded (`dbf055c`, whose
      body miscounts them as seven of eleven). The scratch branch and worktree are removed.
    - `copilot-surrogate`: nit-floor, 3 LOW, folded; confirm round CONFIRMED.
- **Branch protection, [#85](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/85)**, `docs/CC-005-branch-protection`: five docs said `main` needs one
  approving review; it needs 0. `copilot-surrogate` found two more claims in `docs/GIT.md` and the
  glossary's stale `CC-004` key range, folded; confirm round CONFIRMED.
    - The review found that a second collaborator has write access, so "no second human reviewer" is
      attributed to Alex and dated.
    - `--admin` in the delegated Dependabot merge now bypasses nothing. The command is unchanged (decision (h)).
- **Merged:** nothing. **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 2, the soft line, passed at ~169k after #83's first fold. The three units in hand were
  finished, and D was not started. Context ~231k at handoff; the hard line is 250k.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment                   | 5-hour | Weekly | Fable weekly | Context |
    | ------------------------ | ------ | ------ | ------------ | ------- |
    | Start                    | 37%    | 68%    | 23%          | 95k     |
    | Before #83's review      | 39%    | 68%    | 23%          | 133k    |
    | Before the paired review | 43%    | 68%    | 24%          | 169k    |
    | Before the last confirm  | 52%    | 70%    | 26%          | 211k    |
    | Handoff                  | 55%    | 70%    | 26%          | 231k    |

- **Plan usage:** the 5-hour window resets at 05:40Z on 29 September; the weekly windows at 15:00Z on
  2 October.
- **Warning signs:** one. `00a4b68` was pushed before the pre-push suite ran; the suite was run straight
  after and was green, but the rule says before. And a `git stash -u` before a branch switch caught the uncommitted handoff draft; it was
  popped back intact. Every reviewer had its own detached worktree.
- **Clarifying question:** one that Session 14's entry could not have answered: post-merge reviews.

**Major novel patterns Session 15:**

1. **A one-off can become a standing step through the handoff alone.** One post-merge review (#77) was
   copied forward by three handoffs until it read as a rule, though no rule document ever held it. A
   loading step that names no rule and no decision by Alex deserves a question.
2. **A byte-identical dry run is strong evidence, but only for `src/`.** The implementer matched #72's
   code exactly and still diverged on which docs to touch, where both readings were defensible.
3. **A count in a commit body is still the most common self-inflicted slip.** `dbf055c` said "seven of
   eleven" when it was eight of ten. It was caught by review, and cannot be amended. Session 9 pattern 5 is
   unchanged: count before `git commit`.
4. **One verifier can carry two small jobs.** A confirm round and a first review, or two confirm rounds,
   shared one Fable dispatch twice here, at ~129k and ~56k tokens, against ~75k for one small review alone.

## Session 14 — 29 September 2026 (CC-005: Session 8 archived as #80, PR A opened as #81)

**The Session 8 archive and PR A are open, each reviewed, folded and confirmed at nit-floor.** Nothing merged.
Alex agreed to ship A pinned to `fable` and benchmark Fable against Opus later, and said branch protection
has no second human reviewer to require.

**Setup:** every loading check matched Alex's corrected expectations: #75, #78 and #79 merged, `main` at
`b4de022`, no open PRs, the three expected remote branches, Session 13's worktrees gone. Pre-push suite
green (36 unit, 21 e2e). `get_session self` reported Opus 5.5 at `high`.

**Done:**

- **Post-merge surrogate on #79**, on `b4de022` (Fable, ~89k tokens): 6 MATERIAL, 3 LOW, 2 nits, every
  MATERIAL and LOW a state sentence overtaken by the three merges. Folded into #80 (`420f0f1`).
- **[#80](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/80)**,
  `docs/CC-005-archive-session-8`, `eff0aec`.
    - `2d63577` archives Session 8 as row 8; `420f0f1` is the #79 fold.
    - `copilot-surrogate` (~77k): nit-floor, 3 LOW, folded in `eff0aec`.
    - `2d63577`'s body says 44,073 bytes, measured before its own last edit; 44,042 was right. Recorded in
      `420f0f1`'s body, not amended.
- **[#81](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/81), PR A**,
  `chore/CC-005-pin-agent-models`, `af4a0d2`.
    - `b380588`: the three reviewers pin `model: fable` and `effort: high` (checked against the live
      subagents doc); the surrogate's description is trimmed, its size sentence corrected, and the
      recompute discipline added; `CC-005` enters `docs/GIT.md`'s key list.
    - `copilot-surrogate` (~105k): 3 MATERIAL, 6 LOW. Seven folded in `af4a0d2`. The sharpest: the
      sibling does not share this repo's key numbers (its July 2024 `CC-004` is the rgb work that is
      `CC-002` here).
    - Two not folded, below.
    - `chore` with 🔧, not the table's 📦, under the "more specific gitmoji" clause; the body says so.
- **Confirm round** on both folds, one fresh Fable verifier (~48k): every fold CONFIRMED, nothing new.
- **Merged:** nothing. **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 2, the soft line, passed at 161k while #79's fold was being committed. The two units in hand
  (#80 and A, with their review and confirm rounds) were finished, and B was not started. Context 208k
  when #81 opened; the hard line is 250k.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment                       | 5-hour | Weekly | Fable weekly | Context |
    | ---------------------------- | ------ | ------ | ------------ | ------- |
    | Start                        | 23%    | 66%    | 20%          | 103k    |
    | #79 folded, before fan-out   | 27%    | 66%    | 20%          | 161k    |
    | A folded, before the confirm | 34%    | 67%    | 22%          | 193k    |
    | #80 and #81 opened           | 36%    | 68%    | 23%          | 208k    |

- **Plan usage:** the 5-hour window resets at 05:40Z on 29 September; the weekly windows at 15:00Z on
  2 October.
- **Warning signs:** none. Every reviewer had its own detached worktree.
- **Clarifying question:** one, not answerable from the entry: whether `main` should require an approving
  review (below).

**Major novel patterns Session 14:**

1. **A handoff written before its dependencies merge is stale within minutes.** #79 described #75 and #78
   as open, with "unless Alex has merged them" hedges. He merged all three between 01:07Z and 01:13Z, and
   the post-merge review found nothing but that staleness and two nits. A hedged sentence still has to
   be rewritten once the event happens.
2. **Trimming a duplicate made the original's gaps load-bearing.** The surrogate's long description
   repeated the trigger paths; the short one defers to `CLAUDE.md`'s table, which lacks `PROGRESS.md` and
   the comment-block trigger, so "every prose change" became false.
3. **A "checked live" table drifts like any other claim.** `docs/GIT.md`'s enforcement table, read with
   `gh api` on 11 September, says one approving review; `main` requires 0. Repo settings are state.
4. **Four Fable reviewers moved the 5-hour window 13 points** (23% → 36%, ~319k subagent tokens plus the
   coordinator). A small confirm round is cheaper than ~4 points; a full review still costs about that.

## Session 13 — 29 September 2026 (CC-005: PR H ready, PR E opened as #78)

**H's review fold passed its confirm round and #75 went ready; E was finished, reviewed and opened as #78.**
Nothing merged. Alex answered decision (t): `deny`.

**Setup:** every loading check matched. #77 had merged before its `copilot-surrogate` review could run, so
that review ran on `main` after the merge (Alex's instruction; on 29 September 2026, in Session 15, Alex said he
never set post-merge reviews as a practice, and they are dropped: loading step 5). The Session 12 worktrees were already
removed. Pre-push suite green (36 unit, 21 e2e). `get_session self` reported Opus 5.5 at `high`.

**Done:**

- **#75 (PR H), ready at `2888966`.**
    - The confirm round on `ab598b0` used a fresh Fable `spec-grill` verifier (~85k tokens). It found
      0 BLOCKING and 0 MATERIAL, so nit-floor. It raised three LOWs that the fold had introduced, all
      folded in `937403a`.
    - The sharpest LOW: "hooks load at session start" is wrong. The live hooks doc says the file watcher
      normally picks up settings edits.
    - Decision (t) is recorded there as Decision 7, and every `ask` on `--amend` became `deny`.
    - `main` was merged in, the suite re-run, the PR body updated, and the PR marked ready.
- **Post-merge surrogate on #77**, on `18205a1` (~112k tokens): nit-floor, 2 LOW and 3 nits. Folded into E
  (`6794fc0`), not a separate PR.
- **[#78](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/78) (PR E), `ac790f5`.**
    - `main` merged in (`31e6d81`, `PROGRESS.md` hand-resolved) and Session 7 archived (`e5e0b2f`).
    - `da-review` (~102k): 2 MATERIAL, 4 LOW. `copilot-surrogate` (~138k): 2 MATERIAL, 6 LOW, 3 nits.
      Folded in `9e20bdc` and `ac790f5`.
    - Confirm round (~97k): every fold CONFIRMED, nit-floor.
    - The body says to use the merge-commit button: a rebase replay conflicts on the first commit.
- **This handoff** is cut from #78's head and opened with #78's branch as its base, because both edit the
  same `PROGRESS.md` regions. GitHub retargets it to `main` when #78 merges and its branch is deleted.
- **Merged:** nothing. **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 2, the soft line. The unit in hand (E, with its review and confirm rounds) was finished
  first, and A was not started. Context 216k when #78 opened; the hard line is 250k.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment                    | 5-hour | Weekly | Fable weekly | Context |
    | ------------------------- | ------ | ------ | ------------ | ------- |
    | Start (window just reset) | 0%     | 63%    | 14%          | 107k    |
    | H folded, E's fold done   | 9%     | 64%    | 16%          | 174k    |
    | E's reviews folded        | 18%    | 65%    | 19%          | 202k    |
    | #78 opened                | 22%    | 66%    | 20%          | 216k    |

- **Plan usage:** the 5-hour window resets at 05:40Z on 29 September.
- **Warning signs:** none. Every reviewer had its own detached worktree; the main checkout stayed on `main`
  and clean.
- **Clarifying question:** none that Session 12's entry should have answered. Decision (t) was already
  flagged as Alex's.

**Major novel patterns Session 13:**

1. **Five Fable reviewers cost 22 points of the 5-hour window**, ~4.4 each (~534k subagent tokens). That
   agrees with Session 12's ~4 per reviewer (`git show 075e38d:PROGRESS.md`). The estimate holds.
2. **A review of an archive PR finds defects in lines the PR did not write.** Two of E's four MATERIAL sat
   outside its diff: a pointer in `docs/REVIEW-PATTERNS.md`, and `spec-grill.md` still calling 2.1.0
   unbuilt, 17 days after it shipped. That is what reading touched files in full is for.
3. **A claim about Claude Code's own behaviour needs the live docs.** The review fold had asserted from
   memory that hooks load only at session start. The verifier fetched the hooks page, and one WebFetch
   confirmed it before folding.
4. **A hand-resolved merge of `main` rules out the rebase button.** Every archive or handoff branch that
   meets a `PROGRESS.md` conflict needs the merge-commit button (#74 before, #78 now). Stacking the next
   `PROGRESS.md` PR on the open one avoids a second conflict.

## Next session loading instructions

1. Read `CLAUDE.md` (auto-loaded; it imports `AGENTS.md` since #91), then this file top to bottom, then
   `docs/research/01-pcr-workflow-port.md` on `main` (#75, `697b8a2`).
    - The plan is §8, Decisions, and the three review folds (R1, R2, "Reviews of PR H"). The last is the authority for
      rows B, C, D and G.
    - The `CC-004` plan below is paused until all eight `CC-005` PRs merge (Alex).
2. **Archive check.** ~~With this entry, the band holds 6 entries (Sessions 12 to 17) and 27,164 bytes, which is also over the 24,000 line. Archive Session 12 in its own
   small PR, then re-measure.~~ Done in Session 18: Session 12 archived in its own PR (#93), leaving 5 entries and 22,609 bytes (22,576 at `3b8eec6`; the review fold's pointer added 33). Session 11 went as #90.
    - **With Session 18's entry, the band holds 6 entries (Sessions 13 to 18) and 25,973 bytes.** Archive
      Session 13 in its own small PR (cites of it: `git grep -n "Session 13"`), then re-measure after the last
      commit that touches the band (Session 18 pattern 1).
3. **Confirm the state, live.**
    - Run `git status --short` (expect clean), `git log --oneline -5 origin/main` and `gh pr list`. Expect #93
      and this handoff, which is stacked on #93, open unless Alex has merged them. Say which in the entry, and
      rewrite every hedge here that the merges overtake (Session 14 pattern 1).
    - Remote branches: `main`, `feat/CC-003-apca-3` and `chore/CC-004-copy-to-clipboard-4` (do not delete), plus
      whichever of `docs/CC-005-archive-session-12` and `docs/CC-005-close-session-18` have not merged.
    - `git worktree list`: only the main checkout.
4. Run the pre-push suite before touching anything:
   `npm run lint && npm run test:unit && npm run build && npm run test:e2e`. Expect 36 Vitest cases and 21
   Playwright tests.
5. **Primary work: PR F, per §8** (`docs/TESTING.md`'s table becomes sections; both reviews), then G. C merged as #91 (`a358bee`).
    - **F's method, checked in Session 18 but not committed.** Convert only §What each test proves. The fixture
      and baseline tables are at most 352 characters wide and stay as tables. Each of the 21 rows becomes
      `### <describe title> › <test title>`, a blank line, then the "What it proves" cell. Wrap the cell with
      Python's `textwrap.wrap(w, width=100, break_long_words=False, break_on_hyphens=False)`, and assert that
      no continuation line starts with `-`, `*`, `+`, `>`, `#` or `1.`. Use the spec's full describe titles
      (Session 18 pattern 2), so the headings diff clean against
      `npx playwright test --list | sed -E 's/^.*extension\.spec\.ts:[0-9]+:[0-9]+ › //'`.
      The file goes from 117,068 to 34,557 bytes and passes `prettier --check`. In the PR body, give reviewers a
      whitespace-collapsed old-against-new check of every cell.
    - F shifts decision (m)'s `docs/TESTING.md:338` cite (step 7) by about 60 lines. Repoint it to
      §Not ported from the source documents. `docs/TESTING.md:11` sits above the table and does not move.
    - Read `docs/SESSION-HANDOFF.md` and apply it; it replaces step 6's lines.
    - No review runs on a PR after it has merged (Alex, 29 September 2026). An unreviewed handoff stays
      unreviewed; step 3 corrects its state lines.
    - ~~**Once #91 merges**, repoint `PROGRESS.md`'s stale pointers. This is `da-review` LOW 3 on #91: "the
      `CLAUDE.md` trigger table" (§Next workstreams item 1, §The approved plan), the "`CLAUDE.md` §PR workflow"
      and "the `CLAUDE.md` path table" in decisions (h) and (i), and step 7's (r). Then remove `../cc-pr-c`.~~
      Done in Session 18's archive PR; they now name `AGENTS.md`.
    - Decision (r) is settled: promoted and scoped by Alex in Session 17, and carried by #91.
    - Carried, none started:
        - `docs/REVIEW-PATTERNS.md:251-252` says no second review round has happened here, and it asks to
          be replaced by the first real instance (Session 8's confirm round is one: `docs/history/SESSIONS.md` row 8, the `notacolor` hole;
          the full entry is `git show 2d63577^:PROGRESS.md`). Its own small docs PR.
    - **Benchmark Fable 5.1 against Opus 5.5 as the reviewers' model** (Alex, Session 14: ship A pinned to
      `fable`, benchmark later). "Agents on Fable" was chosen on 12 September from published guidance,
      never measured here. Run `da-review` at `high` on both models over two to four past diffs with a
      known defect (#65's unread filled buttons, #62's 8-digit hex, #68's dependency mutant, #75's
      `git -C` matcher hole), and score the known defect and the false findings. At ~4 points of the
      5-hour window per reviewer, four diffs cost ~32. Its own research item, now or at the Session 20
      review.
6. **Model and usage.**
    - Opus 5.5 at `high`. Check `get_session self`.
    - Reviewers on Fable 5.1 at `high`, at most two at a time. Since #81 merged, the agent files pin both,
      and the per-call `model` is only an override (trigger 6's `opus` fallback).
    - Keep the trial lines: soft 150k, hard 250k, 5-hour 85%, weekly 90%, Fable weekly 85%. Triggers 4 and 5
      override trigger 2; trigger 6 only changes the reviewers' model (#88's confirm round).
    - Read `get_usage` at start, after each digest, before each fan-out and at handoff, and record a
      Handoff facts block.
    - **Budget before dispatching:** a Fable reviewer costs ~4 points of the 5-hour window (Session 12
      pattern 3, in `git show 075e38d:PROGRESS.md`). Two reviewers at 78% or above will cross 85%.
7. Decision branches carried in. **New in Session 14: (u)** `copilot-surrogate.md` says a superseded
   sentence in a `docs/*.md` rule document is rewritten, not struck, and reports struck text there. But
   `docs/GIT.md`, `docs/DEVELOPMENT.md` and `docs/SELF-REVIEW.md` each strike one with a dated correction
   beside it (#81's surrogate, LOW). Change the rule to allow a dated strike, or rewrite the three; Alex's
   call. **Settled in Session 13: (t)** `deny` on `git commit --amend` in PR G's
   hook (Alex; the research file's Decision 7). **Settled in Session 11** (`docs/research/01-pcr-workflow-port.md`, Decisions): **(p)** promoted in PR D; **(q)** `CC-005`; **(r)** recorded as an observation, not adopted; **(s)** `implementer.md` on Sonnet at `high`, PR B. **Settled in Session 17: (r)** promoted, scoped to prose-only LOW folds (#91). The settled (a), (c), (d) and (e) are
   archived (`docs/history/SESSIONS.md` §Retired sections). The rest is Session 10's text, unchanged:
   **(f)** whether to adopt a mutation gate, whose re-entry condition fired when the colour utilities got
   unit tests — recorded as fired in six files, adopted nowhere; **(g)** whether to adopt `docs/INDEX.md`,
   whose "after roughly ten PRs" condition fired at 28 merged / 21 human-authored; **(b)** whether
   workstream 5, now five sibling fixes rather than three (§Next workstreams item 5), starts before or
   after CC-004 finishes;
   **(h)** which button a _delegated Dependabot_ merge uses: `AGENTS.md` §PR workflow and `docs/GIT.md`
   §Who merges both prescribe `gh pr merge <n> --merge --admin --delete-branch`, written before rebase became
   the default. #55 was merged that way because that is what they say. Not changed without Alex; **(i)** two
   carry-overs from Session 2, still open — `copilot-surrogate.md`'s trigger names comment-block edits in
   `public/app/*.js`, which the `AGENTS.md` path table cannot express (leave as a superset, or drop it), and
   `docs/TESTING.md` cites `test/e2e/fixtures.ts` by line number (87 — still landing on
   29 September 2026; the 28 and 43 cites are gone), which will drift the first time the fixture file changes. The store published 2.1.0
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
   (written while #50 was still open, as Session 6's entry recorded, now in
   `git show 18205a1:PROGRESS.md`) opened after the feature PR merged; Session 9's
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
   `docs/GLOSSARY.md`, `docs/DEVELOPMENT.md`, `docs/SELF-REVIEW.md` (`AGENTS.md` and `docs/TESTING.md`'s
   baseline row are right). Two more put 25 beside 17 September in a sentence that is literally true —
   `docs/DA-REVIEW.md:20` (the re-entry "fired" that day) and `docs/TESTING.md:11` (the file was "added"
   that day) — and belong in the same fix so a reader is not left to rediscover them. Every count is
   correct; only the date is wrong. A one-commit docs PR whenever it suits. Session 9's surrogate found two of those files
   (`docs/GLOSSARY.md`, `docs/CONVENTIONS.md`) touched by #68 and still carrying it — still untouched. Session 13's confirm round found two more cites
   outside that list, `.claude/agents/spec-grill.md:46` and `docs/TESTING.md:338`;
   **(n)** whether `lint:js` gains `--max-warnings 0`. In #68's round one, dropping `isBackgroundDark` from
   an effect's dependencies passed `npm run lint`, because `react-hooks/exhaustive-deps` is a warning in
   `eslint-plugin-react-hooks`' recommended set and `lint:js` is plain `eslint .`. `npx eslint . --max-warnings 0`
   exited 0 on the #68 branch, so the flag costs nothing today. A `package.json` change, so both
   reviews; Alex's call whether it is its own small PR or waits;
   **(o)** `f91c844` reached `main` with 🏷️ as a `refactor` gitmoji, where `docs/GIT.md`'s table pins ♻️.
   History is not rewritten; the only open question is whether the table should admit 🏷️ for
   type-only renames or the slip stays a slip. Default: a slip.
   **(p)** _In PR D (#88, merged as `874846a`): promoted to `docs/DEVELOPMENT.md` §Scale the fan-out._ ~~Whether the worktree-per-reviewer rule in step 6 is promoted into `docs/DEVELOPMENT.md` §Scale
   the fan-out. It has no home in `docs/` today, and it has fired twice (Session 8 pattern 5, in
   `git show 2d63577^:PROGRESS.md`, and Session 9 pattern 3, in `git show 24fc475:PROGRESS.md`), which meets `docs/DEVELOPMENT.md` §Process-rule promotion's bar. A policy-adjacent docs
   edit, so `copilot-surrogate`; Alex's call whether it goes alone or folds into the PCR proposal (step 5), which
   covers agents and dispatch anyway. Session 10 used it a third time (`git show 759db88:PROGRESS.md`).~~
   **(q)** which ticket key the PCR workflow port goes under — `CC-004` is the code-quality workstream,
   and the keys are Alex's tracker (`docs/GIT.md`), so none is invented here;
   **(r)** _In PR D (#88, merged): recorded as a candidate, with its promotion point (Session 16 pattern 1). Promoted by Alex in Session 17; #91 carried it._ ~~Whether a confirm round is still required when round one is already at nit-floor with nothing
   above LOW and a fold of a word or two — Session 10 pattern 1, in `git show 759db88:PROGRESS.md`; the PCR research may answer it~~;
   **(s)** whether `implementer.md` becomes a checked-in agent here, and on which model — Session 10 ran
   one inline on Sonnet 5.5 against the "agents on Fable" line in step 6; part of step 5's first bullet.

## Session archive

Archived sessions are in `docs/history/SESSIONS.md` (Session 1, archived 13 September 2026; Session 2,
18 September 2026; Session 3, 22 September 2026; Session 4, 27 September 2026; Session 5, 28 September 2026; Sessions 6 to 12, 29 September 2026). Full
retrospective survives in `git log -p PROGRESS.md` at that session's compression commit.
