# Progress

Living state document — current state, what's next. Session-by-session detail archives out to
`docs/history/SESSIONS.md` (mechanics: `docs/SESSION-HANDOFF.md`).

## Next workstreams (after Session 34)

Updated 18 October 2026, end of Session 34: **decision (g) is settled and recorded (`b816d37`): `CC-007`, one key for
both ports, in research 03, `docs/GIT.md` and `docs/GLOSSARY.md`; phase 0 has a committed Firefox harness
(`docs/research/03-sources/ff-harness/`) and an experiments file with every row "not run", because Firefox could
not be launched usable from this app (`experiments.md` §Harness status).** #128 and #129 had merged at 20:54Z on
17 October (`0a8e473`, `22bed93`, Alex); Dependabot #130 and #131 merged in-session under the delegation
(`15fd545`, `dfe9f09`). Session 29 archived as `e1c8f5a`. Next: get Firefox driven, run F1 to F9, record Alex's
answers to (a) to (f) and (h) to (k).

Updated 17 October 2026, end of Session 33: **research 03 is reviewed to nit-floor on `docs/CC-006-session-33`
(fold `6a738ac`, confirm fold `dd1cfdf`), and its recommendation changed: decision (a) is now "ping, then inject"
(Chrome keeps its manifest content script; Firefox and Safari drop it in per-browser manifests; `background.js`
injects with `scripting.executeScript` only when `initChecker`'s send rejects), phase 1 starts with a Chrome 2.2.0
release, and eighteen experiments (F1 to F9, S1 to S9) and eleven decisions (a) to (k) wait on Alex, the ticket
key (g) first.** Nothing merged; #128 (Session 32's PR) is still open and this session's PR, #129, stacks on it.
Session 28 archived as `22391af`.

Updated 17 October 2026, end of Session 32: **the Safari and Firefox research is written and committed as
`docs/research/03-safari-firefox-ports.md` (`be835b7`, on `docs/CC-006-session-32`), with the two engines' claim
tables verbatim in `docs/research/03-sources/`; Safari does not need its own repo, Firefox needs a dual-key
background, a `gecko.id`, a data-collection declaration and no `use_dynamic_url`, and both force on-click
injection.** Its `spec-grill` R1 and `copilot-surrogate` were dispatched at the hard line and were still running at
the handoff: their reports are in the next session's hands (loading step 5). Nothing merged in-session; Session 27
archived as `f7f3077`. Nine decisions and a ticket key wait on Alex (research 03 §Decisions for Alex).

Updated 16 October 2026, end of Session 31: **CC-004 row 11 is built, reviewed to nit-floor and merged as
[#126](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/126) (`bd44e35`, a merge commit, Alex,
16:25Z), so CC-004 is done apart from row 12, which the plan defers.** #124 had merged as `903bceb` and Dependabot #125 as `4587bfe` (the
delegation) before anything was cut. Next (Alex, Session 31): research a Safari port **and** a Firefox port,
including whether Safari needs its own repo.

Updated 7 October 2026, end of Session 30: **#123's confirm round reached nit-floor, Session 24 is archived inside
this session's PR, [#124](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/124), with
`docs/SESSION-HANDOFF.md` rewritten for one PR per session, and CC-004 row 11 has a five-slice plan, grilled twice
and ready to build (§Row 11's slice plan).** Alex merged #123 at 12:03Z as `30ed283`, a merge commit, and GitHub
retargeted #124 onto `main`. Nothing in `src/` changed yet. Next: the `implementer` builds row 11.

Updated 7 October 2026, end of Session 29: **the Session 23 archive,
[#121](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/121), and the first Session 29 handoff,
[#122](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/122), merged at 09:05Z as `3855b83` and
`52b44ea`, merge commits (Alex); then Alex moved the
next session to product work: CC-004 row 11, with research 02 and PR G parked until one of them costs a session
real work.** He asked what the last sessions had done; since 29 September, 25 of 34 merges to `main` at `ddaab4e` were
handoffs or archives, and nothing in `src/`, `public/` or `test/` has changed since #72 (28 September). Next: archive Session 24 inside
the handoff PR (Decision 5), then plan and build row 11.

Updated 7 October 2026, Session 29: **the Session 28 handoff #120 merged as `ddaab4e` at 08:51Z on 7 October, a
merge commit (Alex), so the paragraph below is history.** Session 23 is archived in its own PR.

Updated 7 October 2026, end of Session 28: **the Session 22 archive, [#119](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/119), reached nit-floor
and merged as `bcd5bc1`, a merge commit (Alex), and Alex answered the inventory's questions: Decision 6's threshold is 7 or more hunks or 33 or more changed lines,
and C keeps its place, re-scoped to one contract in the briefs rather than a token saving, with the inventory's
corrections to research 02 folded into C's PR.** Next: archive Session 23, then C.

Updated 7 October 2026, Session 28: **#117 (`55f9230`) and the Session 27 handoff #118 (`f5eb1d2`) both merged at
08:03Z on 7 October, as merge commits (Alex), so the paragraph below is history.** Session 22 is archived in its own
PR.

Updated 7 October 2026, end of Session 27: **the Session 21 archive is open as
[#117](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/117), at nit-floor, and the token inventory
ran, its report committed by this handoff (`docs/research/02-sources/inventory.md`), not yet reviewed.** It finds
item C's token saving mostly realised already, since the dispatch prompts have capped replies since Session 19, and
proposes Decision 6's threshold. Next: archive Session 22, put the inventory's two questions to Alex, then C.

Updated 7 October 2026, Session 27: **#115 (`a23d3a6`) and the Session 26 handoff #116 (`ae49392`) both merged at
the end of Session 26, as merge commits (Alex), so the paragraph below is history.** Session 21 is archived in its
own PR.

Updated 7 October 2026, end of Session 26: **the Session 20 archive is open as
[#115](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/115), at nit-floor, and research 02's R1 fold, [#113](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/113), was reviewed, folded and
confirmed at nit-floor, and Alex merged it as `1ea1611`, a merge commit.** Next: archive Session 21, then the token inventory (research 02
§Inventory brief), then C.

Updated 7 October 2026, Session 26: **#112 (`e276fd4`) and the Session 25 handoff #114 (`67fde5d`) both merged
on 6 October, as merge commits (Alex), so the paragraph below is history.** Session 20 is archived in its own PR.

Updated 6 October 2026, end of Session 25: **the Session 19 archive is open as
[#112](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/112), at nit-floor, and spec-grill R1 is
folded into research 02 on draft [#113](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/113), not
yet reviewed.** Alex answered the fold's questions: E's fold leg yes in principle (threshold from the inventory),
both extras dropped, the new order approved, and (j) left to the coordinator's judgement. Next: archive Session 20,
review #113 (`copilot-surrogate` and `spec-grill` R2), then the token inventory, then C.

Updated 6 October 2026, Session 25: **#110 (`5593300`) and the Session 24 handoff #111 (`610ff54`) both merged
during the session's start, as merge commits (Alex), so the paragraph below is history.** Session 19 is archived in
its own PR.

Updated 6 October 2026, end of Session 24: **the Session 18 archive is open as
[#110](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/110), at nit-floor, and spec-grill R1 has
been verified finding by finding against `eb6099a`** (`docs/research/02-sources/spec-grill-r1-verification.md`,
20 CONFIRMED, 3 PARTLY, 0 DISPROVED, 2 OVERTAKEN by Decision 5). Research 02 is not yet folded. Next: archive Session 19, fold R1 into research 02 from the
verification report (Decision 5 first), then the token inventory, then items C and E.

Updated 6 October 2026, Session 24: **#106, #107, #108 and the Session 23 handoff #109 all merged between
04:09Z and 04:10Z, as merge commits (Alex), so the paragraph below is history.** Session 18 is archived in its
own PR.

Updated 6 October 2026, end of Session 23: **the Session 17 archive is open as
[#108](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/108), at nit-floor, stacked on #107, and
Alex re-decided research 02's item B after `spec-grill` R1's B1: one PR per session, not straight to `main`.**
The decision is in memory; it is not yet written into research 02, and the rules still say an archive is its
own PR. Next: archive Session 18, fold R1 into research 02 (Decision 5 first), then the token inventory, then
items C and E.

Updated 6 October 2026, Session 23: **#106 and the Session 22 handoff #107 were both still open at the
start, so the paragraph below still holds.** Session 17 is archived in its own PR, stacked on #107.

Updated 6 October 2026, end of Session 22: **the Session 16 archive is open as
[#106](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/106), at nit-floor, and `spec-grill` R1
on research 02 found 2 BLOCKING and 9 MATERIAL** (`docs/research/02-sources/spec-grill-r1.md`, not yet
digested). B1 bears on Alex's Decision 1. Next: archive Session 17, digest and fold R1, then the token
inventory, then items C and E.

Updated 6 October 2026, Session 22: **#104 (`e9c5a0a`) and the Session 21 handoff #105 (`8234f50`) both
merged at 03:31Z and 03:34Z, as merge commits (Alex), so the paragraph below is history.** Session 16 is
archived in its own PR.

Updated 6 October 2026, end of Session 21: **the Sessions 14 and 15 archive is open as
[#104](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/104), reviewed and confirmed at
nit-floor.** Next: archive Session 16, `spec-grill` on research 02, then the AI-docs token inventory Alex asked
for (loading step 5(b)), then items C and E.

Updated 6 October 2026, Session 21: **#98 (`54fb4ba`) and the Session 20 handoff #99 (`9d242b0`) both
merged on 3 October, so the paragraph below is history.** Sessions 14 and 15 are archived in their own PR.
Dependabot #100 merged as `3226826`: the delegated merge was refused by the auto-mode classifier (decision
(j)), and Alex merged it.

Updated 3 October 2026, end of Session 20: **research item F is open as
[#98](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/98), reviewed, under the new key `CC-006`
(Alex).** `deniedMcpServers` cannot reach the desktop app's servers, so F was re-scoped to the terminal's
claude.ai connectors. Sessions 14 and 15 are archived next, then `spec-grill` on research 02, then items C and E.

Updated 3 October 2026, Session 20: **#95 (`2f74766`), #96 (`011e276`) and the Session 19 handoff #97
(`3398776`) all merged, so the paragraph below is history.** The key is `CC-006`, not a guess.

Updated 2 October 2026, end of Session 19: **the Session 13 archive
([#95](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/95)) and PR F
([#96](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/96)) are open, each reviewed and at
nit-floor.** This handoff is stacked on #95. A new workstream, the workflow optimisation in
`docs/research/02-workflow-optimisation.md`, comes before PR G: item F first, then `spec-grill` on the file, then
items C and E. PR G follows, then CC-004 row 11. The workstream needs a ticket key from Alex, and none is invented
here.

Updated 2 October 2026, Session 19: **#93 (`9a8c986`) and the Session 18 handoff #94 (`bf9f8d1`) both merged, so the
paragraph below is history.** Session 13 is archived in its own PR, and PR F is next.

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
   [#72](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/72) (`61b5d43`). Row 11 merged as
   [#126](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/126) (`bd44e35`, Session 31); row 12 stays deferred. One PR at a
   time, `da-review` on every `src/**` change, both reviews wherever the
   `AGENTS.md` trigger table says so, the e2e suite as the gate.
2. ~~**Store review of 2.1.0.**~~ **Done.** The store published 2.1.0 on 12 September 2026, the day it was
   submitted — found by a `copilot-surrogate` pass checking the claim that it was still under review, not by
   anyone watching. Users are on it. Nothing further; the next release repeats `docs/GIT.md` §Releases.
3. ~~**Unit tests for `src/utils/color-utils.ts`** (vitest) — folds naturally into workstream 1.~~ Absorbed:
   it is PR 7 of the approved plan, and it carries the Vitest infrastructure, a `ci.yml` step and a twelve-file
   documentation sweep with it.
4. **Safari, and now Firefox: the next session's primary work** (Alex, Session 31: "Let's look at safari and
   Firefox too"; he thinks Safari "may need its own repo" and wants that researched). Research first, nothing
   built. Stated goal, nothing started. Start from `docs/ARCHITECTURE.md` §Safari and other browsers. It is now also the
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
   Session 12; the confirm round passed in Session 13 (`git show bf9f8d1:PROGRESS.md`), and #75 merged as `697b8a2` the same day (the
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
| 11  | ✅ Typed action API, message bridge as its own hook, real payload validation (#126, `bd44e35`)            | da-review          | —     |
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

### Row 11's slice plan (Session 30, `spec-grill` R1 and R2 folded; built and merged as #126)

Measured against `52b44ea`. Branch `refactor/CC-004-typed-messages`, cut from `main` once #123 and Session 30's
PR have merged. One green commit per slice; the pre-push suite is green at every commit. `spec-grill` R1 (Fable,
~99k) found 0 BLOCKING, 2 MATERIAL, 6 LOW and 3 nits, all folded below. R2 (Fable, ~46k) confirmed every fold and
found 1 MATERIAL, the closing grep could never print nothing, and 2 nits, folded and checked by hand (the two-round
cap). **Built and merged as #126 (`bd44e35`, Session 31): record, not state.** The findings below describe the
code before #126; it moves to `docs/history/SESSIONS.md` §Retired sections at a later archive.

**Findings that shape it.** `handleContrastCheck(value, name: string)` silently ignores a `name` that is neither
colour. Its callers are `color-control.tsx:41`, `color-controls.tsx:45` and the bridge (`context.tsx:150`), and
four files restate `'background' | 'foreground'` inline (`color-control.tsx:10`, `color-controls.tsx:12` as
`TColorName`, `color-picker-cta.tsx:7`, `text-input.tsx:8`), while `TPickedColor.key` is already `keyof TColors`.
The bridge's only check is `message.key && message.rgb` (`context.tsx:167`): any truthy `rgb` reaches
`rgbToHsl`. Reproduced by the grill on today's build: a relayed `{ type: 'colorPicked', key: 'background', rgb:
['a', 'b', 'c'] }` turned the background black (`#ratio` 12.72 → 1.32), stored `[0,null,null]`, which
`readStoredColor` reloads as black, sent `closeColorPicker`, and logged nothing. `toHslTuple` zeroes the NaN hue;
saturation and lightness stay NaN.

1. **Payload validator, Vitest first, one case at a time** (`AGENTS.md` TDD). `src/utils/parse-picked-color.ts`
   exports `parsePickedColor(message: unknown): TPickedColor | null`: `type === 'colorPicked'`, `key` is
   `'background'` or `'foreground'`, `rgb` an array of exactly three numbers. Two kinds of rule, labelled in the
   code: non-object, wrong length, non-number and NaN would corrupt state; integer and 0 to 255 are the
   `content.js:69-70` contract (a `Uint8ClampedArray` read), since `chroma.rgb` itself accepts `[256, 0, 0]` and
   `[1.5, 2, 3]`. Returns a fresh tuple, ignores extra fields. One case per rejection class and one per key
   accepted, in `src/utils/parse-picked-color.test.ts`. Behaviour-neutral: nothing calls it yet, so slice 2's red
   is still the reproduction (`docs/TESTING.md`).
2. **E2e red, then wire.** One Playwright test in the `app` describe, not the patched-manifest one:
   `sendToActiveTab` relays the malformed pick above, and `#ratio`, `input#background` and
   `localStorage.background` stay unchanged; then a valid relayed pick (`[255, 0, 0]` to `foreground`) lands, so
   the test cannot pass on a message that never arrived. Confirm it fails on `main`, then call
   `parsePickedColor` in the existing `handleMessage`. An invalid message is dropped whole: no state change, no
   `closeColorPicker`, and one `console.warn` naming the rejected field (the no-console-errors test filters
   `type() === 'error'`, `extension.spec.ts:593`). `runtime.onMessage` hears only this extension's own contexts,
   so an invalid pick means `content.js` drifted; Escape still closes the loupe.
3. **The bridge as its own hook, refactor under green.** `src/hooks/useColorPicked.ts` (camelCase like
   `useTabbed.ts`, `docs/CONVENTIONS.md:144`): `useColorPicked(onPicked: (picked: TPickedColor) => void)` owns
   the listener, the relay-only filter (`sender.tab` set → ignored, with the existing comment), the validator,
   `useEffectEvent` for `onPicked`, the `closeColorPicker` reply after `onPicked` (today's order,
   `context.tsx:150-154`), and the cleanup. `context.tsx` then holds no `chrome.*`. Proof: the existing picker
   e2e tests and slice 2's, unchanged and green.
4. **Typed action API.** `handleContrastCheck(value, name: string)` becomes `setColor(key: TColorKey, value)`,
   with `export type TColorKey = keyof TColors` in `src/global-types.ts`; `TPickedColor.key` and the four inline
   unions use it. The argument order swaps too; `tsc` catches a missed caller because the types differ. Proof:
   `tsc` in `npm run lint`, watched failing on a caller left unconverted (`docs/CONVENTIONS.md` §Verify a gate can
   fail), and the e2e suite. `updateView` and `reverseColors` keep their names and signatures. **Its own commit:**
   `ColorTuple` becomes `TColorTuple` (25 uses in 4 files), because `docs/CONVENTIONS.md:140-141` says to rename
   it when `src/global-types.ts` is next touched; that sentence is rewritten in slice 5.
5. **Docs, in the same PR.** Every line the change falsifies, found by grep, not this list alone:
   `docs/ARCHITECTURE.md` §Message flows and §State; `docs/DA-REVIEW.md` §Cross-context consistency and §React
   components and context; `docs/CONVENTIONS.md:140-146`, `:149`, `:167` and `:168` (the `ColorTuple` rule, the
   one-camelCase-hook claim, `handleContrastCheck`, "`chrome.*` is confined to `src/context.tsx`, `color-picker-cta.tsx` and `actions.tsx`");
   `docs/SELF-REVIEW.md:123` and `:347`; `docs/GLOSSARY.md:42`, `:55-56` and `:79`; `README.md:127` (the file tree);
   `docs/TESTING.md` §Unit tests (a paragraph for the new file); `docs/DEVELOPMENT.md:47`. Counts:
   `git grep -n -E "36 (Vitest|unit)|21[ -](Playwright|e2e|green|test)"`, and the wrapped forms decision (l) found.
   Then `git grep -n -P "handleContrastCheck|\bColorTuple\b|TColorName"` prints nothing (`-P`: `\b` matches nothing
   under `-E` here, and a bare `ColorTuple` would match `TColorTuple`) outside `docs/history/` and
   `PROGRESS.md`.

**Out of scope:** `public/app/*.js`, a shared `messages.ts` (killed by the grill, above), row 12's reducer or
store, a typed wrapper for the three messages the iframe sends (`getScreenshot`, `closeColorPicker`,
`closeChecker`), and renaming `updateView`. Reviews: `da-review` and `copilot-surrogate` (a Vitest file, `test/**`
and `docs/**` each fire both).

**Recorded as known behaviour, not fixed:** `copy-to-clipboard`'s last-resort path calls `window.prompt` from
inside the cross-origin panel, and Chrome does not block it — observed live 12 September 2026. ~~Unavoidable while the library is used~~ — the library went in #54 (17 September 2026) and `copyText` keeps the prompt deliberately; Playwright auto-dismisses dialogs, which is why no test has ever seen it.

## Session 34 — 18 October 2026 (CC-007: decision (g) recorded, Session 29 archived, phase 0 harness written but unrun)

**Alex settled the ticket key, `CC-007` for both ports, and it is recorded in four files; phase 0 did not start,
because Firefox could not be launched usable from this app, so the harness is committed for the next session to run.**
Dependabot #130 and #131 merged under the delegation; this session's PR is
[#132](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/132).

**Setup:** Alex had merged #128 and #129 at 20:54Z on 17 October (`0a8e473`, `22bed93`, merge commits), so `main`
held the Session 33 handoff and both of its hedges were overtaken. The tree was clean, the remote branches were
the three standing ones plus two new Dependabot branches, and the only worktree was the main checkout. The band
was 5 entries and 29,155 bytes. The pre-push suite was green (60 Vitest, 22 Playwright) on `22bed93`.
`get_session self`: Fable 5.1 at `high`, permission mode auto.

**Done:**

- **Session 29 archived** as `e1c8f5a`, the branch's first commit, pushed at once: row 29 in
  `docs/history/SESSIONS.md`, the band 4 entries and 23,927 bytes, Session 30's one cite of its content
  ("Session 29 pattern 1") pointed at `git show 22bed93:PROGRESS.md`.
- **Decision (g) recorded** as `b816d37`: research 03's header and its (g) row (struck, dated), this file's
  "Updated" paragraph and loading step 5, `docs/GIT.md`'s Ticket keys bullet (`CC-001` to `CC-007`, with what `CC-006` and
  `CC-007` are) and the `docs/GLOSSARY.md` row. The research file stays in `docs/research/`; from this PR on its
  changes, and the session PRs, go under `CC-007`.
- **Phase 0 harness** as `26c15d2`: `docs/research/03-sources/ff-harness/` (a Node Marionette client, three patched
  builds, a probe background and page, the probe web page's server, the launch script and profile prefs, a README)
  and `docs/research/03-sources/experiments.md` with every row "not run" and §Harness status saying why. ESLint
  now ignores `docs/research/**/*.{js,mjs}` (`eslint.config.mjs`; Prettier already ignored `03-sources/`).
  **No experiment ran.** Three launch routes (the session shell, the app's Terminal panel, Terminal.app via
  `open -a Terminal`) and headless mode all left the scratch profile uninitialised and port 2828 closed;
  `open -a Firefox --args` dropped the arguments and opened the default profile. Details and the untested
  alternatives: `experiments.md` §Harness status.
- **Dependabot merged under the delegation, first attempt, no classifier refusal:**
  [#130](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/130) (eight dev dependencies) as
  `15fd545` and [#131](https://github.com/Pushedskydiver/CC-Checker-Web-Extension/pull/131) (React 19.3.1) as
  `dfe9f09`, both `Lint, build, e2e` green, #131 still `CLEAN` after #130 so no recreate was needed.
- **The decisions (a) to (f) and (h) to (k)** were put to Alex in this session's closing message, each with research
  03's recommendation and (a)'s Session 33 change named. His answers are the next session's to record.
- **Review:** `copilot-surrogate` (Fable, `high`, ~193k tokens, a detached worktree beside the repo) on `985670c`,
  report verbatim in `docs/research/03-sources/surrogate-s34.md`: ~96 claims, 4 falsified; 2 MATERIAL (the PR
  number, already fixed by `813c2e0` before the report landed; `experiments.md` saying every Safari row needs the
  packager's Xcode project, when research 03 says a built folder installs from the Develop menu since Safari
  18.4, folded, with loading step 5's Safari bullet); 2 LOW (`docs/GIT.md`'s `CC-006` scope was unbounded, now
  "Sessions 20 to 33"; a "§Ticket keys" cite named a bullet, not a heading; both folded); 3 nits declined (the
  (g) strike sits in `docs/research/`, where research 02 already strikes and decision (u) is open;
  `docs/GLOSSARY.md:132`'s converter name predates this PR; the harness manifests omit
  `data_collection_permissions`, which a temporary install does not need). Its out-of-repo note, that memory dates
  (g) to 17 October, is Alex's earlier chat; the repo records the written instruction of 18 October. The MATERIAL
  fold gets its confirm round from a fresh verifier dispatched at the end of this session, past the soft line; it
  writes `docs/research/03-sources/surrogate-s34-confirm.md` into the main checkout, untracked, and Session 35
  commits and folds it (loading step 1).
- **Merged:** #130 and #131 (Claude, delegated). **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 2, the soft line, read at 196k; the reading before it was the 88k start, so the line was passed
  somewhere inside the launch attempts, unseen.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment                                     | 5-hour | Weekly | Fable weekly | Context |
    | ------------------------------------------ | ------ | ------ | ------------ | ------- |
    | Start (step 1, before the reads)           | 2%     | 14%    | 24%          | 88k     |
    | Soft-line check, after the launch attempts | 15%    | 16%    | 26%          | 196k    |
    | Dependabot merged, before this entry       | 18%    | 16%    | 27%          | 210k    |
    | Handoff, confirm verifier dispatched       | 30%    | 17%    | 29%          | 241k    |

- **Plan usage:** the 5-hour window resets at 21:20Z on 18 October, and the weekly windows at 15:00Z on 23 October.
- **Warning signs:** one, new: no `get_usage` between 88k and 196k. §2's "after digesting any large result" never
  fired because each launch attempt's result was small; the sum was not. The reviewer had its own worktree
  outside the repo.
- **Clarifying question:** none; Alex's opening message answered (g) before it was asked.

**Major novel patterns Session 34:**

1. **Firefox cannot be driven from this app on this Mac, yet.** Launched by any shell this app owns, and by
   Terminal.app opened from one, `firefox -marionette --remote-allow-system-access -no-remote -profile <dir>`
   never initialised the profile (`user.js` stayed its only file), never listened, and either exited within
   seconds or hung; the log said `sandbox_extension_issue_file_to_process failed for …/plugin-container.app`,
   and with `MOZ_DISABLE_*_SANDBOX=1` a child died on signal 9 instead. Headless was the same. `open -a Firefox
--args …` ran, but on the default profile with the arguments dropped. The profile directory's file count is
   the cheapest "did it start" probe; `pgrep` is not, since the parent lingers. Next: Alex runs the launch script
   from his own terminal and the session drives it over 2828, before anything else is written.
2. **Checkpoint by effort, not by result size.** Writing the harness and five launch attempts took the session
   from 88k to 196k with no reading, past the soft line. A topic that is all small tool results needs a
   `get_usage` every ten or so calls, or after every failed attempt of the same kind.
3. **A delegated Dependabot pair can merge back to back.** #131 stayed `MERGEABLE CLEAN` after #130 because the
   groups touched disjoint lockfile entries; `gh pr view --json mergeable,mergeStateStatus` is `UNKNOWN` for a
   few seconds after the first merge, so poll it before deciding to recreate.

## Session 33 — 17 October 2026 (CC-006: Session 28 archived; research 03's reviews folded to nit-floor)

**Research 03's two R1 reviews are folded, and the grill's BLOCKING findings changed the recommendation: on-click
injection everywhere would re-declare `content.js`'s top-level bindings (a `SyntaxError` on the second run) and
strand 21 of the 22 e2e tests, so decision (a) now recommends "ping, then inject" with Chrome's manifest script
kept.** Nothing merged; #128 still open. Committed on `docs/CC-006-session-33`, cut from #128's head with its
branch as base (§6 Stacking): the Session 28 archive (`22391af`), the fold (`6a738ac`), the confirm-round fold
(`dd1cfdf`) and this handoff.

**Setup:** #128 was open, so `PROGRESS.md` was read from its branch at `9297c26`, where both R1 reports were
already committed unfolded. Tree clean; remote branches the three standing ones plus #128's; Session 32's two
stale worktrees removed. Band 5 entries and 26,578 bytes. The pre-push suite ran in the background while the
archive was committed and was green on `9297c26` (60 Vitest, `22 passed (11.6s)`); `npm run lint` ran again before
the confirm-fold push, since only docs changed after the suite. Fable 5.1, permission mode auto; `get_session
self` was not called, so the effort is the handoff's `high` by assumption.

**Done:**

- **Archive, `22391af`:** Session 28 became row 28; band 4 entries and 22,773 bytes, measured inside the commit
  command. Its one content cite (Session 29's "Session 28 pattern 2") points at `git show 6821ca5:PROGRESS.md`.
- **Fold, `6a738ac`:** every one of the grill's 25 and the surrogate's 16 findings taken. The coordinator checked
  first: `content.js`, `background.js`, the fixtures and spec at HEAD; the `safari.md` and `firefox.md` rows cited;
  Safari 27.0 on macOS 27.0 and Firefox 152.0.3 on this Mac; Chrome's permission list (no warning for
  `scripting`), Mozilla's release calendar (ESR 128 last released 16 September 2025) and MDN's `incognito` page.
  Headlines: shape 3 with its consequence list; phase 1 split into 1a (Chrome, two PRs, a 2.2.0 release) and 1b
  (Firefox, manual definition of done); F7 to F9 and S7 to S9; decisions (j) and (k); (b) collapsed on the ESR
  dates; (c) per-browser whatever F3 says; the mechanisms table gained `localStorage`; three
  `docs/ARCHITECTURE.md` §Safari sentences rewritten in place ((i) taken as "now").
- **Confirm round, `dd1cfdf`:** fresh `spec-grill` R2 and `copilot-surrogate`, Fable at `high`, each in its own
  detached worktree in the scratchpad (~154k and ~257k tokens, ~8 and ~10 minutes). Neither had a Write tool, so
  both reports came back as full replies (~10 KB each) and are committed verbatim as `03-sources/grill-r2.md`
  and `surrogate-r2.md`. Grill: all 25 FOLDED; 1 new MATERIAL (the proposed Chrome inject-path test could not
  reach the click handler, since the harness never fires `onClicked`; fixed by a `handleActionClick` seam), 2 LOW
  (Safari's no-listener `sendMessage` is unverified, so S1 and F8 record the ping's outcome; the wrap's real case
  is a click during load on Chrome, so F8 and the Chrome test inject twice explicitly), 5 nits. Surrogate: ~165
  claims, 5 falsified, 0 BLOCKING or MATERIAL, 5 LOW (nine rows, not eight; a stale "says it is not available";
  `surrogate-r1.md`'s preamble, and Session 32's entry restating it, say 10 LOW and 2 nits where the sixteen
  findings grade 9 and 3; `use_dynamic_url` is Chromium-only, Edge mirrors Chrome, so the original word was
  right; four of seven, not all, repeated in Open points), 5 nits. All folded with the coordinator's manual pass:
  round two is the cap (`docs/DEVELOPMENT.md` §Verification rounds). Nit-floor reached by that rule, not by a
  third round.
- **Merged:** nothing. **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 2 crossed at 153k after the two report digests; the unit in hand (fold plus confirm round) was
  finished, and trigger 3 fired at 252k as the handoff began.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment                                   | 5-hour | Weekly | Fable weekly | Context |
    | ---------------------------------------- | ------ | ------ | ------------ | ------- |
    | Start (step 1, before the loading reads) | 40%    | 10%    | 17%          | 81k     |
    | After the loading reads                  | 40%    | 10%    | 17%          | 92k     |
    | Both R1 reports digested                 | 43%    | 11%    | 18%          | 153k    |
    | Fold committed, confirm round dispatched | 47%    | 11%    | 19%          | 193k    |
    | Confirm round folded, handoff            | 63%    | 13%    | 23%          | 252k    |

- **Plan usage:** the 5-hour window resets at 00:30Z on 18 October; the weekly windows at 15:00Z on 23 October.
  The two confirm reviewers cost 16 points of the 5-hour window, twice Session 12's ~4 a reviewer.
- **Warning signs:** none; step 1's `get_usage` preceded the loading reads for the first time since Session 21
  (a `grep -n` to locate the block's heading came before it). Both reviewers had their own worktrees outside the
  repo, removed after.
- **Clarifying question:** none; Alex was not present. Every question is in loading step 5.

**Major novel patterns Session 33:**

1. **A confirm round earns its keep on a fold that adds design.** The grill's R2 found a hole (the Chrome
   inject-path test could not reach the code it was meant to cover) in a claim that did not exist at R1, so no R1
   could have found it. A fold that introduces a design, not just fixes, is where the verification round is least
   optional.
2. **The reviewers had no Write tool, and the file-report contract fell back to full replies.** Both agents
   reported it absent and returned ~10 KB each into the coordinator's context, where item C's design is a ~1.5 KB
   capped reply. Both have Bash: the next brief says "write the report with a Bash heredoc to <path> if Write is
   absent", and the coordinator commits it from the file, not from the reply.
3. **Mozilla's support site and the MDN ESR page do not fetch; the release calendar and MDN's manifest-key pages
   do.** `support.mozilla.org` returns a JavaScript error page to `WebFetch`, the wiki calendar redirects to
   whattrainisitnow.com (which answers), and MDN's `incognito` key page carries the private-window default.

## Session 32 — 17 October 2026 (CC-006: Session 27 archived; Safari and Firefox research written, reviews in flight)

**Research 03 answers Alex's two questions from the engines' documentation: Safari does not need its own repo
(Apple's packager references the extension files in place), and Firefox needs four manifest changes plus AMO
signing with a source submission; the one design change both engines force is on-click injection under
`activeTab` + `scripting`.** Nothing merged. Committed on `docs/CC-006-session-32`: the Session 27 archive
(`f7f3077`) and the research (`be835b7`); the handoff follows.

**Setup:** #127 had merged as `6821ca5`, a merge commit, so `main`'s loading block was current. No PRs were
open, the tree was clean, the remote branches were the three standing ones, and the only worktree was the main
checkout. The band was 5 entries and 25,572 bytes. The pre-push suite was green on `6821ca5` (60 Vitest,
`22 passed (18.0s)`). `get_session self` reported Fable 5.1 at `high`, permission mode auto.

**Done:**

- **Archive, `f7f3077`:** Session 27 became row 27; band 4 entries and 19,939 bytes. Its one cite (Session 28
  pattern 1) points at `git show 6821ca5:PROGRESS.md`. Pushed straight after.
- **Research, `be835b7`:** `docs/research/03-safari-firefox-ports.md` (258 lines) plus
  `docs/research/03-sources/{safari,firefox}.md` (the agents' claim tables, verbatim, prettier-ignored). Two
  `general-purpose` agents on Fable at `high`, read-only in the main checkout with no worktree (as Session 27's
  inventory agent), one per engine: Safari ~245k tokens, 91 tool uses, ~15 minutes, 143 rows (129 VERIFIED, 11
  UNVERIFIED, 3 SOURCES DISAGREE); Firefox ~197k tokens, 95 tool uses, ~12 minutes, 168 rows (151 / 13 / 4). The
  coordinator read both tables in full, re-fetched two MDN pages the Firefox report rests on (quotes exact) and
  fetched the Playwright and GitHub billing facts itself. Contents: the two answers; an eight-row mechanism table
  per engine; the injection-model change; minimum versions; why `public/app/*.js` needs no build and
  `messages.ts` stays killed; distribution, cost and testing; twelve experiments (F1 to F6, S1 to S6) to run before
  any code; a phased proposal with Firefox first; nine lettered decisions for Alex; corrections found in
  `docs/ARCHITECTURE.md` (Safari has had `action.openPopup` since 16; the converter is now the packager).
- **Reviews, dispatched at 244k and still running at the handoff:** `spec-grill` R1 and `copilot-surrogate`, both
  Fable at `high`, each in a detached worktree in the scratchpad (`wt-grill`, `wt-surrogate`, at `be835b7`),
  writing to `scratchpad/grill-r1.md` and `scratchpad/surrogate-r1.md` with replies capped at 1,500
  characters. Re-runnable: their input is `be835b7`. The surrogate finished after the handoff pushed: 0 BLOCKING,
  4 MATERIAL (the item 4 re-entry condition misquoted; `background.js` line cites wrong; "forum posts never
  VERIFIED" false for two Safari rows; the revoked-site error-popup behaviour stated as fact while F5 is
  UNVERIFIED), 10 LOW, 2 nits, committed unfolded as `docs/research/03-sources/surrogate-r1.md`. The grill
  finished next: 2 BLOCKING (B1: an "idempotent `content.js`" re-run by `executeScript` re-declares its top-level
  `const`s, a SyntaxError, and a DOM-keyed guard double-registers the listener after `closeChecker`; B2: under
  decision (a) all 22 e2e tests lose their resident content script and the plan says nothing), 9 MATERIAL (among
  them: `tab.url` may be absent in Safari's `onClicked` so `isRestrictedUrl` shows the error popup on every
  first click; Safari's `chrome.*` Promise return is UNVERIFIED too; the experiments test the status quo, not the
  recommended flow; phase 1 hides a Chrome release; a shared manifest drops `use_dynamic_url` from Chrome;
  `localStorage` across Safari's per-launch origin untested; Xcode adds two more unlinked version copies), 11 LOW,
  3 nits, committed unfolded as `03-sources/grill-r1.md`. Decision (a) is not safe to put to Alex as written.
- **Merged:** nothing. **Uploaded:** no.

**Handoff facts:**

- **Trigger:** 3, with 1 and 2. The two research digests took the session from 97k to 211k; the research commit
  and the review dispatch reached 244k, so the handoff was written with the reviews in flight.
- **Readings (5-hour / weekly / Fable weekly / context):**

    | Moment                                 | 5-hour | Weekly | Fable weekly | Context |
    | -------------------------------------- | ------ | ------ | ------------ | ------- |
    | Start (late, step 1)                   | 2%     | 5%     | 7%           | 86k     |
    | After the loading reads                | 2%     | 5%     | 7%           | 97k     |
    | Both research reports digested         | 24%    | 8%     | 13%          | 211k    |
    | Research committed, reviews dispatched | 27%    | 9%     | 14%          | 244k    |

- **Plan usage:** the 5-hour window resets at 00:30Z on 18 October; the weekly windows at 15:00Z on 23 October.
- **Warning signs:** one, the same as Sessions 22 to 31: step 1's `get_usage` came after the loading block and
  `docs/SESSION-HANDOFF.md` had been read. The two reviewers had their own worktrees outside the repo; the two
  research agents were read-only with none, like Session 27's inventory agent.
- **Clarifying question:** none asked; Alex was not present. The ticket key the loading block said to ask for is
  carried as research 03's decision (g).

**Major novel patterns Session 32:**

1. **A full-table research digest costs about 25k tokens per 60 KB report.** Two agents' claim tables (60 and
   68 KB) took the coordinator from 97k to 211k with the repo reads. Reading them whole was right for a file whose
   every claim had to be checked, but it fixes the shape: dispatch, digest, write, dispatch reviews, hand off, and
   the fold is the next session's. Capped replies alone would not have let the coordinator write the proposal.
2. **Apple's and MDN's primary sources are not in their HTML.** Apple's developer pages are a JavaScript app:
   `developer.apple.com/documentation/<path>.md` returns the text. MDN's compat tables come from
   `mdn/browser-compat-data` JSON on GitHub. WebKit's source on GitHub settles what Apple's prose omits, with the
   caveat that Safari's host layer is closed.
3. **Reviews can outlive the session that dispatched them if their input is committed.** Both reviewers read
   `be835b7` and write to files; handing off with them running loses only wall-clock, and the next session either
   reads the reports or re-dispatches the same briefs.

## Next session loading instructions

Rewritten in Session 34: phase 0's harness exists and has not run; the launch is the first problem.

1. **Call `get_usage` before reading anything else, this block included**, and record `context.tokensUsed`. **Then
   `git fetch` and `gh pr list`:** this session's PR, #132 (`docs/CC-007-session-34`, based on `main`), may still be open. Read `PROGRESS.md` from it if so,
   else from `main`. Read only: this block (step 7 on demand), the newest entry and the first "Updated"
   paragraph. Take a second `get_usage` after the reads, and one every ten tool calls on a topic after that
   (Session 34 pattern 2). **If `docs/research/03-sources/surrogate-s34-confirm.md` exists untracked, it is the confirm
   round on Session 34's MATERIAL fold: commit it verbatim, fold anything it confirms, on #132's branch if still open.**
2. **Archive Session 30** (`docs/SESSION-HANDOFF.md` §6): with Session 34's entry the band is 5 entries and over
   the 24,000-byte line. Re-measure; archive until it is under. The archive is the session branch's first commit,
   pushed straight after. If this session's PR is still open, cut from its head with its branch as base (§6
   Stacking).
3. **Confirm the state, live.**
    - `git status --short` (expect clean), `git log --oneline -5 origin/main`, `gh pr list`.
    - Expect this session's PR open unless Alex has merged it; say which in the entry and rewrite every hedge a
      merge overtakes. Dependabot #130 and #131 merged in Session 34 (`15fd545`, `dfe9f09`).
    - Remote branches: `main`, `feat/CC-003-apca-3` and `chore/CC-004-copy-to-clipboard-4` (do not delete), plus
      the open PR's branch. `git worktree list`: the main checkout, plus `../cc-surrogate` (detached at `5efa3db`) if Session 34's confirm verifier left it: `git worktree remove ../cc-surrogate` once its report is committed.
4. Run the pre-push suite before touching anything:
   `npm run lint && npm run test:unit && npm run build && npm run test:e2e`. Expect 60 Vitest cases and 22
   Playwright tests.
5. **Primary work: phase 0, starting with the Firefox launch; then Alex's answers.**
    - **The launch first, with a cap.** `docs/research/03-sources/experiments.md` §Harness status lists what
      failed and the untested alternatives, cheapest first. Spend at most ~20k of context on them; then ask Alex
      to run `ff-harness/launch-ff.sh` (copied outside the repo with its `profile/`; it resolves its own
      directory) from his own terminal, and drive that instance over port 2828. Write nothing else until
      `smoke`-level plumbing works (`marionette.mjs` `newSession`, a chrome-context `Services.appinfo.version`,
      `Addon:Install` of `ext-manifest`).
    - **Then the runner:** F1 to F9 against the three builds from `make-builds.mjs`, clicking the toolbar from the
      chrome context (`ExtensionParent.apiManager.global.browserActionFor(policy.extension).triggerAction(window)`,
      or `windowUtils.sendMouseEvent` on the widget after `CustomizableUI.addWidgetToArea`) so `activeTab` is
      granted as a real click grants it. Each result into `experiments.md` with the Firefox version (152.0.3 is
      installed; updating it needs Alex), and research 03's open rows rewritten in place with a dated note.
    - **Safari:** S6's local half (`xcrun safari-web-extension-packager --no-open --no-prompt`, then `xcodebuild`
      on Xcode 27.1) needs no Safari UI; S1 to S5 and S7 to S9 need the Develop menu ("Add Temporary
      Extension…", Safari 18.4 and later), which is Alex's hands. Ask, with the exact steps, rather than drive Safari.
    - **The decisions:** (a) to (f) and (h) to (k) were put to Alex on 18 October (Session 34's closing message),
      each with its recommendation. Record his answers in research 03 §Decisions for Alex as (g) was recorded
      (`b816d37`): settled text in italics, the old text struck, dated. No code before phase 0 is done; phase 1a
      (Chrome, two PRs) is the first code.
    - **Model:** Fable 5.1 at `high` for phase 0 (`docs/SESSION-HANDOFF.md` §7); reviewers on Fable at `high`,
      with reports written by Bash heredoc if the agent has no Write tool. Pass `model` on every dispatch.
6. **Parked, with re-entry on pain** (Alex, Session 29). Each re-enters only when it costs a session real work,
   named in that session's entry; until then no session spends context on them.
    - **Research 02 (`CC-006`) items A, C, D, E, G, H and I.** Re-entry: loading reads alone pass 130k (A, H), a
      reviewer reply or report-file problem costs a fold (C, D), a fold big enough to want the `implementer` (E;
      the threshold is set: 7 or more hunks or 33 or more changed lines, Alex, Session 28), or a doc count goes
      stale again (G). C's settled brief is in `git show 2539cfe:PROGRESS.md`, step 5(b).
    - **`CC-005` PR G** (the `deny` hook on `git commit --amend`, research 01 §8 row G). Re-entry: an amend.
    - **Reviewing `docs/SESSION-HANDOFF.md`'s lines** against the readings (its §8), carried since Session 20.
      Re-entry: a session that hits a line it disagrees with.
    - **Benchmarking Fable 5.1 against Opus 5.5 as the reviewers' model** (Alex, Session 14). Re-entry: a
      reviewer miss that a different model might have caught.
    - **`docs/REVIEW-PATTERNS.md:251-252`**, which still says no second review round has happened here. Re-entry:
      the next time that file is edited.
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
   ~~Whether that rule persists into this session is unknown;~~ It did not persist: #100 was refused in Session 21; if a delegated Dependabot merge is
   refused again, surface it and ask rather than assuming the rule is gone or working around it
   another way. Session 9's #69 merged first time with the same command; Session 21's #100 was refused again
   (6 October 2026), and Alex merged it. Session 25 (in `git show 4587bfe:PROGRESS.md`): Alex left (j) to the coordinator's judgement on that
   evidence, and research 02 (#113) records the disposition: keep the delegation, and item H rewrites `AGENTS.md`
   §PR workflow and `docs/GIT.md` §Who merges to say a refusal goes to Alex; **(k)** `docs/SELF-REVIEW.md` §Claims and consistency's generic "same PR" line for
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
   seven files" or stays accepted drift is Alex's call, not made this session. **Session 31 made it four** (#126's `docs/TESTING.md:12`, found by its confirm round; in `git show 0fae782:PROGRESS.md`). **Session 8 made it three**: PR 9's
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
   outside that list, `.claude/agents/spec-grill.md:46` and `docs/TESTING.md` §Not ported from the source documents;
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
   **(r)** _In PR D (#88, merged): recorded as a candidate, with its promotion point (Session 16 pattern 1, in `git show 8234f50:PROGRESS.md`). Promoted by Alex in Session 17; #91 carried it._ ~~Whether a confirm round is still required when round one is already at nit-floor with nothing
   above LOW and a fold of a word or two — Session 10 pattern 1, in `git show 759db88:PROGRESS.md`; the PCR research may answer it~~;
   **(s)** whether `implementer.md` becomes a checked-in agent here, and on which model — Session 10 ran
   one inline on Sonnet 5.5 against the "agents on Fable" line in step 6; part of step 5's first bullet.

## Session archive

Archived sessions are in `docs/history/SESSIONS.md` (Session 1, archived 13 September 2026; Session 2,
18 September 2026; Session 3, 22 September 2026; Session 4, 27 September 2026; Session 5, 28 September 2026; Sessions 6 to 12, 29 September 2026; Session 13, 2 October 2026; Sessions 14 and 15, 6 October 2026; Session 16, 6 October 2026; Session 17, 6 October 2026; Session 18, 6 October 2026; Session 19, 6 October 2026; Session 20, 7 October 2026; Session 21, 7 October 2026; Session 22, 7 October 2026; Session 23, 7 October 2026; Session 24, 7 October 2026; Sessions 25 and 26, 16 October 2026; Session 27, 17 October 2026; Session 28, 17 October 2026; Session 29, 18 October 2026; Sessions 30 and 31, 1 November 2026). Full
retrospective survives in `git log -p PROGRESS.md` at that session's compression commit.
