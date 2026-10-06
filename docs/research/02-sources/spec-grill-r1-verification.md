# spec-grill R1 — finding-by-finding verification (Session 24)

Verified at `eb6099a` (= `origin/main`, detached worktree `cc-r1-verify`), 6 October 2026, by a Fable 5.1
subagent. Every line cite below is against `eb6099a`; R1's cites were against `8234f50`, and `PROGRESS.md` has
grown from 57,314 to 60,098 bytes since, so each was re-located. Every number was re-run here; where a figure
could not be re-run it is marked UNCHECKED.

New fact R1 did not have: **Decision 5** (Alex, Session 23, 6 October 2026, `PROGRESS.md:240-242, 258-263`):
item B is "one PR per session: the archive and the handoff together in one PR, keeping CI and the
copilot-surrogate review", superseding Decision 1. No direct push to `main`. Recorded in memory
(`project-workflow-optimisation.md`) and in `PROGRESS.md` step 5(b) (`:620-630`), not yet in research 02.

**Verdict counts: 20 CONFIRMED, 3 PARTLY (M1, M5, M8), 0 DISPROVED, 2 OVERTAKEN (B1, L9, both by Decision
5).** Two CONFIRMED findings carry a sub-clause that Decision 5 dissolves (M7's B bullet, M9's "shared with B"
clause); each is marked in its row.

Measured at `eb6099a` for the findings below:

- `AGENTS.md` + `CLAUDE.md` prose budget (the awk in `AGENTS.md`): **149**.
- `git log --first-parent -34 main`: **22** handoff/archive subjects, 12 others.
- `PROGRESS.md` 60,098 B. Next-workstreams block 19,961 (the "Updated" stack 9,911); detail band (the §6 awk)
  23,614, 6 entries; loading block 15,863 (step 7 alone 7,742); newest entry (Session 23) 4,172.
- `package.json:56` `format:check` is `prettier "**/*.{…,md,…}" --check`.
- Instruction hierarchy a subagent loads: `AGENTS.md` 13,383 + `CLAUDE.md` 1,003 + `~/.claude/CLAUDE.md` 3,146
  = 17,532 B (20,445 with `MEMORY.md` 2,913). `implementer.md` 7,969; `docs/GIT.md` 29,829.

---

## BLOCKING

### B1 — Item B as written removes the review, skips CI, reverses `docs/GIT.md`, and was never tried

**Verdict: OVERTAKEN by Decision 5**, after being CONFIRMED in Session 23 (`PROGRESS.md:258-263`, "B1 checked,
then put to Alex"). Every sub-point re-checked here holds at `eb6099a`; Decision 5 then dissolves most of them.

Evidence, sub-point by sub-point:

- Row B's Saving against Decision 1's text: `02-workflow-optimisation.md:41` ("A PR, a CI run and a review
  round per session") against `:79-82` (the review "can run before the push"). Confirmed as a contradiction
  under Decision 1. **Under Decision 5 the Saving column is right again**: two PRs per session becoming one
  saves exactly one PR, one CI run and one surrogate dispatch. Only the Change column is wrong.
- The two surrogate catches are real: `PROGRESS.md:480-481` (#95, "1 MATERIAL (the archive was dated 29
  September; it is 2 October)") and `:375` (#104, "step 5(a) still said #98 was open"). Session 23 adds a
  third: `:264-265`, the handoff review's MATERIAL ("step 5(b) still said B needs Decision 1's three
  rewrites"). Under Decision 5 the review stays, so the "which rule" question dissolves; moe's exemption for
  state-only diffs (`02-sources/moe.md:41`) was one of the four options and Alex did not take it.
- `docs/GIT.md:80-85` §What needs a PR ("Everything") and `:402-403` (re-entry "a doc that is appended to
  constantly") — confirmed present. Dissolved: Decision 5 keeps the rule, so nothing in `GIT.md` changes.
- `AGENTS.md:133` (`docs/**` → surrogate mandatory) and `copilot-surrogate.md:36-37` (§Trigger names
  `PROGRESS.md`) — confirmed. Dissolved: the one PR carries the review.
- `docs/SELF-REVIEW.md:270-271` ("edits `PROGRESS.md` in the same PR") — confirmed; decision (k) is
  `PROGRESS.md:693-700`. Not dissolved, but not B's either: (k) is item H's closure and Decision 5 does not
  change its shape (handoffs are still not "the same PR" as the feature).
- `docs/DEVELOPMENT.md:86-105` lifecycle ("push + PR … Alex merges to main") and `:286` ("records that read in
  the PR body") — confirmed. Dissolved: a PR exists.
- CI: `package.json:56` confirmed. Dissolved: the PR's `quality` job runs Prettier.
- "Never tried": `AGENTS.md:55-58` requires a PR, `enforce_admins` off; `~/.claude/CLAUDE.md` §Harness says the
  classifier can refuse `git push`; decision (j) `PROGRESS.md:686-693` records two refused merges. Confirmed as
  stated; the push itself remains UNCHECKED and is now moot.
- Proposed change (1) is done (Alex decided); (2) and (4) dissolve; (3), the sibling list, becomes the
  Decision 5 rewrite list below, which is short because `AGENTS.md` and `docs/GIT.md` say nothing about an
  archive being its own PR.

Proposed fold: research 02 §Decisions gains **Decision 5** (date, the four options, what was chosen, that B1 was
the trigger) and strikes Decision 1 with a pointer to it. Row B's Change column becomes "The archive and the
handoff go in one PR per session, reviewed as now (Decision 5)"; Saving stays "a PR, a CI run and a review
round per session"; Cost "S, rules" (not "policy" — the policy question is closed). The rule rewrite is
`docs/SESSION-HANDOFF.md` §6 and §7 only (see the rewrite list). Add one sentence: `docs/GIT.md` §What needs a
PR and its re-entry (`:402-403`) stand unchanged; B1 is the first time the re-entry was weighed (22 of 34) and
Alex kept the rule.

### B2 — Item E's evidence is for a rule this repo already has; doc-fixer may not touch `PROGRESS.md`

**Verdict: CONFIRMED.**

Evidence:

- PCR `docs/SESSION-HANDOFF.md:65` (read at PCR `15d4da7`): "when the main session did the building … most
  sessions ran past 250k; since it orchestrates, almost none do". That is the don't-build-in-main rule, which
  CCC adopted with the `implementer` (#84, `773d546` in the first-parent log) and used for PR F
  (`PROGRESS.md:483-485`). `02-sources/pcr.md:132-134` is where 02 took "14 of 22" from, and it names the
  same rule. PCR `:102` confirms the median rose to "about 200k" because "the soft line is mostly passed
  while a review or fix round runs" — digests, not folds.
- CCC Session 19 pattern 1 (`PROGRESS.md:517-520`): "orchestrated and still reached 166k". Session 21 pattern 3
  (`:412-414`) lumps "two review digests and the folds" — the fold share is unmeasured. Session 23 pattern 1
  (`:290-292`) adds that the loading reads alone cost 53k.
- PCR `doc-fixer.md:56-57` (read): "Never edit `research/**`, `PROGRESS.md` or memory." Its precondition list
  (`:13-22`) and "Never compute, round or pick one" (`:40-42`) are as R1 describes. `implementer.md:98-99`
  already says the same for CCC: "`PROGRESS.md` is the coordinator's. Do not edit it".
- The handoff is mostly numbers only the coordinator holds: `docs/SESSION-HANDOFF.md:51-56` and the Handoff facts
  shape (`:96-102`). Confirmed.
- Research 01 Decision 2 (`01-pcr-workflow-port.md:396-397`): "Doc-only folds are the coordinator's." Row E
  (`02-workflow-optimisation.md:44`) does not say it reverses that. Confirmed. `implementer.md:101-102` carries
  the same rule ("Doc-only folds are the coordinator's, unless the brief hands them to you") — a third sibling.
- Cost: hierarchy 17,532 B + brief 7,969 + `docs/GIT.md` 29,829 before the first commit (`implementer.md:44`)
  = 55,330 B, about 25k tokens at the Session 23 ratio (~97 KB of reads → 53k). Confirmed; R1's 17,390 for the
  hierarchy differs from mine by 142 B, within the global file's drift.

Proposed fold: split row E as R1 says: (a) drop the handoff-drafting leg; (b) keep the archive move as the
candidate, with a brief that supplies every number — and note that under Decision 5 the archive is the first
commit of the session branch, so the implementer's "never push, never open a PR" (`implementer.md:3`) fits it
exactly; (c) the fold leg only above a size threshold, stated as reversing research 01 Decision 2 and
`implementer.md:101-102`, gated on M7's measurement; (d) replace the evidence sentence with PCR's actual rule
and CCC's own #84. Needs no decision from Alex except (c)'s threshold, which can be proposed with the inventory.

---

## MATERIAL

### M1 — Item A's saving is measured against a baseline that no longer exists, and overlaps H

**Verdict: PARTLY** — the stale baseline and the H overlap are confirmed; the ceiling figure moves with the
bytes-per-token ratio, and the proposed signal is already half in place.

Evidence:

- `02-sources/self-audit.md:13-20`: the 132,927 B total includes research 01 at 45,784 as required reading.
  Loading step 1 at `eb6099a` (`PROGRESS.md:589-592`) reads research 02 "in full" and research 01 "only its PR
  G sections, and only when G is reached". `git log -1 5444852` is Session 19's close, as R1 says. A's third
  clause is done. Confirmed.
- At `eb6099a` a newest-entry-plus-block read is 4,172 + 15,863 = 20,035 B against 60,098 whole, so A saves
  about 40 KB. At Session 21's measured ratio (`PROGRESS.md:412-413`: ~25k tokens for the ~57 KB file, ~2.3
  B/token) that is ~17.5k; at Session 23's (`:290-292`: 53k for ~97 KB, ~1.8 B/token) it is ~22k. So the row's
  "~20–25k" is high by a little, not by the margin R1 implies; R1's "~17–18k" is the low end.
- Step 7 is 7,742 of the 15,863 B block (49%), which H shrinks — the double count with row H stands.
- The proposed signal: Session 23 already added an "After the loading reads" row (`PROGRESS.md:277`) and step 1
  now asks for it every session (`:587-588`, "Take a second reading after the loading reads"). What is missing
  is only `docs/SESSION-HANDOFF.md` §5's Readings line (`:99`) naming it as a standing row.

Proposed fold: row A's Evidence re-baselined to `eb6099a` bytes (60,098 whole; 20,035 for entry + block; step 7
7,742 of that is H's), Saving "~17–22k per start, H's share counted once", and a sentence that the before figure
is Session 23's 53k loading-reads cost. `docs/SESSION-HANDOFF.md:99` gains "including one row after the loading
reads" in A's PR.

### M2 — Item A drops `~~strikethrough~~` against §5, decision (u) and two briefs

**Verdict: CONFIRMED.**

Evidence: `docs/SESSION-HANDOFF.md:112-114` ("Superseded reasoning in `PROGRESS.md` gets `~~strikethrough~~`
rather than deletion"); decision (u) at `PROGRESS.md:666-670`, open; `copilot-surrogate.md:195-210` (the
strikethrough pass, "`PROGRESS.md` and `docs/history/SESSIONS.md` record superseded reasoning") and
`spec-grill.md:137-140` both tell readers to expect struck text — self-audit D13 (`02-sources/self-audit.md:56`).
Row A (`02-workflow-optimisation.md:40`) names none. The resolution R1 cites exists: §6 `:130-132` ("Full text
stays in `git log -p`") and §5 `:115-116` ("The loading block is pointer-only"). moe allows one dated `Update:`
line (`02-sources/moe.md:27`). The §6 awk (`:122`) measures the band only; the two standing blocks are 19,961 +
15,863 = 35,824 B at `eb6099a`, never measured by the trigger (`02-sources/pcr.md:84-86`).

Proposed fold: row A states the split — entries keep the §5 strike rule; the loading block and the "Updated"
stack are rewritten in place, superseded text reachable by `git log -p PROGRESS.md` — and lists `:80`, `:112-114`,
`:122` and D13's two brief paragraphs as the lines it rewrites. H closes (u) with the same split ("rewrite in rule
docs and the loading block; strike in entries"). A's §6 change makes the trigger measure what a session reads.

### M3 — Item C's file-write mechanics are absent and it contradicts four live channel lines

**Verdict: CONFIRMED**, with one nuance on sub-point (3).

Evidence: `da-review.md:159`, `copilot-surrogate.md:251`, `spec-grill.md:157` all read "Return findings as the
tool result"; `docs/DA-REVIEW.md:325-329` §Reporting channel names two agents only (self-audit D14 at `:57`).
The harness default "Do NOT Write report/summary/findings/analysis .md files" is in this dispatch's system
prompt too, and `~/.claude/CLAUDE.md` §Harness records a refusal. moe's mechanics are at `02-sources/moe.md:46`
("absolute path in the primary checkout … write in parts"); the self-audit contract (`:107-117`) has no file
field. `AGENTS.md:138`: "`copilot-surrogate` reads touched files at HEAD in full, not the diff". Background
work rule: `docs/SESSION-HANDOFF.md:53-54`. Nuance: a confirm round scoped to the fold diff is already practice
here (Session 18 pattern 3, `PROGRESS.md:578-579`, ~39k against ~103k; `docs/DEVELOPMENT.md:280-286`), so
"range only" only contradicts `AGENTS.md:138` if C applies it to round one. R1 says to scope it to the
verification round, which is what already happens.

Proposed fold: row C lists the four channel lines and `AGENTS.md:138` as siblings; the contract gains the moe
mechanics (absolute path in the primary checkout, write in parts, in-band fallback — this report was written
with the Write tool without refusal, so the fallback is a fallback); "range only" is stated as the existing
verification-round scope, round one unchanged; the signal is the `get_usage` delta across one digest, before
(Session 21's ~50k for two digests plus folds) and after. The copy-out-before-handoff rule extends
`docs/SESSION-HANDOFF.md:53-54` to reports in a scratchpad.

### M4 — Items C and D together can return a silently truncated verification round

**Verdict: CONFIRMED.**

Evidence: `02-sources/pcr.md:71` ("Did you complete every step" row: CCC has it in "`implementer.md:118-119`
only" — at `eb6099a` it is `implementer.md:116-117`, "That includes a step a missing tool stopped"). The
self-audit contract (`:107-117`) has no such field. `docs/DEVELOPMENT.md:269-271`: "has to actually fire —
'it would have come back clean' is a rationalisation". `maxTurns` is proposed at `02-workflow-optimisation.md:43`
and listed as a real key at `:68-69`.

Proposed fold: C's contract SUMMARY line carries "steps completed: n of m; stopped by: none | maxTurns | refused
tool", and a verifier that did not finish may not report nit-floor. D picks `maxTurns` from measured turn counts
(the inventory's jsonl pass, M7), never by guess. Cross-reference D's row to C's contract.

### M5 — In-session subagents run on the instruction files as loaded at session start

**Verdict: PARTLY** — proven for `CLAUDE.md`/`AGENTS.md`; for an edited existing agent brief the evidence is
indirect.

Evidence: memory `project-subagents-cache-instructions.md` (read): an in-session subagent "listed only the OLD
`CLAUDE.md`'s headings"; only a fresh process saw the new file. `~/.claude/CLAUDE.md` §Harness: "an agent file
created in the session was not dispatchable in it" — that is about a new file, not an edited one. Whether an
edit to an existing `.claude/agents/*.md` is picked up by the next in-session dispatch is UNCHECKED here (a
read-only grill cannot test it). Research 02 gives a fresh-session measurement to F only (`:84`) and the caching
fact at `:74-75` is about `CLAUDE.md`.

Proposed fold: each of B, C, D and G gets "measured in the next session's first dispatch of that agent, recorded
in Handoff facts", and the PR body says the PR's own review could not exercise the new brief. Add one cheap
test to C's PR: dispatch the surrogate once after the brief edit and record whether it followed the new
contract — that settles the UNCHECKED half for the price of a review that is needed anyway.

### M6 — Item I's CI commit-subject check is a gate the repo's rules say not to build yet

**Verdict: CONFIRMED.**

Evidence: `docs/GIT.md:396-401` ("Re-entry: if those keep drifting, a check on them … is the thing to add");
`docs/DEVELOPMENT.md:352-353` ("becomes a _gate_ when reader discipline has demonstrably failed") and `:378`
("don't build the gate before the rule has been broken"). Re-run of pcr.md's check: in the last 200 commits on
`main`, 29 subjects miss the `<type>: CC-<n> - <gitmoji>` shape, and all 29 are Dependabot bumps or
`Merge branch 'main' into …` sync commits — no human drift. Recorded drift is the five 17 March commits
(`AGENTS.md:40-42`) and (o) (`PROGRESS.md:721-723`). The two source threads disagree as R1 says
(`02-sources/moe.md:80-84` adapt; `02-sources/pcr.md:119-121` "is **not met**").

Proposed fold: drop the check from row I, or present it as an exception to §Process-rule promotion with the
re-entry quoted, as PR G did (`01-pcr-workflow-port.md:513-516`). Needs Alex only if kept.

### M7 — The planned token inventory cannot decide C, D or E as scoped

**Verdict: CONFIRMED**; the B bullet is OVERTAKEN by Decision 5.

Evidence: step 5(b) continued (`PROGRESS.md:631-638`) says "Count bytes per file at HEAD … give A, D and G
their 'before' figures" and, since Session 23, already adds "The grill's M7 adds what it must also measure"
(`:637-638`) — the per-item quantity/source/threshold list is still missing. C's only hand-back figures are
n=3 and n=2 (`02-sources/pcr.md:33`, "Small n"). D's "≥15 KB" is a mandate figure (self-audit §0). E is lumped
in Session 21 pattern 3 (`:412-414`). B: with Decision 5 the saving is one surrogate dispatch (~4 points,
`docs/SESSION-HANDOFF.md:38-40`), one CI run and one merge per session — count archive PRs and their digests,
as R1 says; the direct-push half is moot. F: starts at `PROGRESS.md:585-586` — Session 20 78,058 (MCP 19,720),
21 75,131 (19,855), 22 83,255 (19,855), 23 75,948 (19,855): no desktop saving, confirmed, and Session 23 pattern
3 (`:295-296`) shows MCP rising to 20,947 mid-session. The meter rule (memory
`project-claude-p-not-a-token-meter.md`) is confirmed.

Proposed fold: step 5(b) continued, or research 02 under a new §Inventory brief, lists per item the quantity,
the source (file bytes at HEAD; main jsonl; sidechain jsonl; `get_usage` checkpoint) and the threshold it feeds.
The "after loading reads" checkpoint is already standing (M1).

### M8 — Ordering: `AGENTS.md` has one prose line of budget, and B, G and D all want to write to it

**Verdict: PARTLY** — the budget is confirmed at 149; B no longer writes to `AGENTS.md`.

Evidence: awk gives 149. `AGENTS.md` §PR workflow (`:45-63`) says nothing about an archive or a handoff being
its own PR, and Decision 5 needs no direct-push language, so B's rewrite of it dissolves. G's trims
(`02-sources/self-audit.md:73`, "~1.5–2 KB, and budget headroom") and D's possible pointer lines still compete.

Proposed fold: the order sentence (`02-workflow-optimisation.md:50`) states the budget as a precondition for D
and G only: G's `AGENTS.md` slice lands before D adds any line there.

### M9 — Item A's row does not list the `docs/SESSION-HANDOFF.md` sections it rewrites

**Verdict: CONFIRMED**; the "PR-or-not shared with B" clause is OVERTAKEN by Decision 5.

Evidence: `:80` (the "Updated" stack), `:112-114` (strike), `:120-125` (band-only measure; "An archive is its own
small PR" at `:124-125`), `:60-63` (the prompt). `PROGRESS.md:589` still says "this file top to bottom".
`02-sources/self-audit.md:176` "Amend SESSION-HANDOFF.md:80". Row A cites PCR and moe only. The >200-line
prediction is plausible (the file is 152 lines and A touches §5, §6, two briefs and `PROGRESS.md`) but is a
prediction until built.

Proposed fold: row A names §5 (shape, strike), §6 (the measure) and D13's two brief paragraphs, predicts "both
reviews", and B's §6 line is handled by B's own PR (rewrite list) — not shared with A.

---

## LOW

### L1 — F's optional `autoCompactWindow` conflicts with handoff trigger 7

**Verdict: CONFIRMED.** `docs/SESSION-HANDOFF.md:21` lists "any auto-compaction" as a warning sign;
`.claude/settings.json` (read, 8 lines) has only `deniedMcpServers`. Fold: strike the clause in row F, or Alex
decides a backstop is wanted and trigger 7 is reworded. Default: strike.

### L2 — F's Saving column still says "measure" though both readings exist

**Verdict: CONFIRMED**, with two more readings. `PROGRESS.md:585-586`: MCP tools 19,720 → 19,855 → 19,855 →
19,855 across Sessions 20 to 23. Fold: row F Saving becomes "desktop: none measurable (Sessions 20–23);
terminal: unmeasured", pointing at §Item F.

### L3 — Item G and PR G both touch the test counts, in the wrong order

**Verdict: CONFIRMED.** `PROGRESS.md:630` ("item G is not PR G"), `:639` ("(c) Then PR G"); research 01 row G
(`01-pcr-workflow-port.md:381`) carries "the unit-count sweep (L5)"; `02-sources/self-audit.md:216` "make G
remove the counts instead of bumping them". Fold: row G says item G lands first and its PR amends research 01
§8 row G to drop L5; if PR G overtakes it, PR G bumps and item G later deletes.

### L4 — H's disposition for (j) is stale: it is live, not closable

**Verdict: CONFIRMED.** `02-sources/self-audit.md:164` says "close and move to memory"; `PROGRESS.md:408-411`
(Session 21 pattern 2) makes it two refusals and an open ask; `AGENTS.md:51-53` and `docs/GIT.md:230-233` still
state the delegation as executable. Fold: row H lists (j) as "close only with `AGENTS.md` §PR workflow and
`docs/GIT.md` §Who merges adjusted" — needs Alex's answer to the Session 21 ask (his own permission rule, or he
merges Dependabot himself).

### L5 — H and A rewrite the same block twice unless H goes first or rides in A

**Verdict: CONFIRMED.** Step 7 is 7,742 of the 15,863 B loading block. Fold: H rides in A (Alex's answers
collected before A starts), stated in the order sentence.

### L6 — E before A means the archive brief is written twice

**Verdict: CONFIRMED** (reasoning; no file turns on it). If B2(b) keeps E's archive leg, its brief encodes the
entry shape A changes (`docs/SESSION-HANDOFF.md:80-107`). Fold: A before E's archive leg.

### L7 — D's `omitClaudeMd` would strip the implementer of the commit format and the trigger table

**Verdict: CONFIRMED.** `AGENTS.md:31-44` (commit format), `:24` (pre-push suite), `:74-118` (§Non-obvious
constraints); `implementer.md:36-45` cites them rather than restating. All four briefs carry a `tools:`
whitelist (frontmatter line 4 of each), so `disallowedTools` adds nothing. Fold: row D says `omitClaudeMd` is
for reviewers at most, never the implementer, and drops `disallowedTools`.

### L8 — D's "history out of agent bodies" must keep spec-grill's exit condition

**Verdict: CONFIRMED.** `spec-grill.md:37-40`: "If after a run of real specs this agent has caught nothing …
move it to `docs/DEVELOPMENT.md` §Not ported". The narrative above it (`:12-36`) is what D moves. Fold: row D
names the sentence as kept (or moved to §Not ported's list), the narrative as what goes. Note for the record:
R1 and this verification are that agent's first two real runs, and B1 changed a decision — the exit condition
has not fired.

### L9 — B changes what a citable hash is, and §6's repoint rule

**Verdict: OVERTAKEN by Decision 5.** No direct commits, so `AGENTS.md:61` ("cite PR numbers rather than branch
hashes") and `docs/GIT.md:257` stand. What survives: `docs/SESSION-HANDOFF.md:126-128` says `<sha>` is "the
archive PR's first commit on `main`"; with the archive and handoff in one PR that is "the session PR's first
commit on `main`", and the parent logic (`:128-129`) is unchanged under any button. One wording change, in the
rewrite list.

### L10 — I duplicates a carried item

**Verdict: CONFIRMED.** `02-workflow-optimisation.md:48` and `02-sources/self-audit.md:84-85, 245` restate the
carried item at `PROGRESS.md:650-652`; `docs/REVIEW-PATTERNS.md:251-252` still reads "There has been one review
round on this repo". Fold: row I points at the carried item instead of listing it.

---

## nits

### N1 — Stale status lines in the file

**Verdict: CONFIRMED.** `02-workflow-optimisation.md:50-51` ("F is approved and goes first next session") — #98
merged as `54fb4ba` (first-parent log). `:7` "`spec-grill` has not run" — R1 ran in Session 22. Fold: both lines
rewritten in the R1 fold; the status line names R1, this verification and the round due.

### N2 — Row F is not re-scoped in the table

**Verdict: CONFIRMED.** `:45` describes the pre-Session-20 F. Fold: append "re-scoped: §Item F, checked" to the
row.

### N3 — Two UNCHECKED figures the file relies on

**Verdict: CONFIRMED** (as unverifiable here). "33 times in 10 sessions" (`:41`) and the 8.9–11.4 KB replies
(`:42`) come from `02-sources/pcr.md:22, 33`, whose scripts "`scratchpad/agentreports.py`" lived in a dead
scratchpad. UNCHECKED here; the 22/34 beside them is re-measured and holds. Fold: label both "source report's
figure; re-run by the inventory".

### N4 — Research 01 cites in 02 are to the pre-#98 text

**Verdict: CONFIRMED.** `01-pcr-workflow-port.md:421-422` carries "_Done earlier, in `CC-006`'s item F_". Fold:
`02-workflow-optimisation.md:115` says "done" rather than "earlier than PR G planned it".

---

## Decision 5 rewrite list

Files and lines at `eb6099a` that say an archive or a handoff is its own PR, or otherwise conflict with "archive
and handoff in one PR per session". Rule documents and briefs first; records second.

Rule documents and the research file (must change):

1. `docs/SESSION-HANDOFF.md:124-125` — "An archive is its own small PR." Becomes: the archive is the first commit
   on the session's branch, the handoff its last, one PR per session (Decision 5, Alex, 6 October 2026).
2. `docs/SESSION-HANDOFF.md:127` — "the archive PR's first commit on `main`" → "the session PR's first commit on
   `main`" (L9's residue; the parent logic at `:128-129` is unchanged).
3. `docs/SESSION-HANDOFF.md:145` — §7 row "Mechanical: a Dependabot merge, a count sweep, an archive PR": an
   archive is no longer a PR of its own; drop "an archive PR" or replace with another mechanical example.
4. `docs/SESSION-HANDOFF.md:26-28` and `:29-30` — "A unit is one PR or one proposal" and "even after a small
   archive PR". Under Decision 5 the start-of-session archive is not a unit with its own PR, so trigger 1's
   boundary moves to the session PR; one clause saying so.
5. `docs/SESSION-HANDOFF.md:123` — "Check at session start, before picking anything up" stays, but the archive
   commit now sits unpushed on the branch until the handoff. Consider "push the branch after the archive commit"
   so a session that dies before handoff loses nothing (§3 item 3's logic). Coordinator's procedure, not Alex's
   decision, but worth one line.
6. `docs/research/02-workflow-optimisation.md:41` — row B's Change column "straight to `main`".
7. `docs/research/02-workflow-optimisation.md:79-82` — Decision 1; strike with a pointer to Decision 5 and the
   "Needs `AGENTS.md` §PR workflow, `docs/GIT.md` … rewritten first" clause, which no longer applies.
8. `docs/research/02-workflow-optimisation.md:50` — order sentence "A with B": B is now a few lines of §6/§7 and
   can land alone (see Ordering).

Not conflicting, checked: `AGENTS.md` §PR workflow (`:45-63`) and `docs/GIT.md` §What needs a PR (`:80-85`),
§Who merges (`:227-236`), §Deliberately not adopted (`:402-403`) say nothing about archive or handoff PRs and
need no change; `docs/SELF-REVIEW.md:270-271` is decision (k), item H's, unchanged by Decision 5;
`docs/DEVELOPMENT.md:86-105` lifecycle and `:393` state-surface row are compatible; `docs/GLOSSARY.md:108-109`
describe archiving without a PR shape; `.claude/agents/*.md` have no hit.

Records (state, not rules — rewrite only where they instruct):

9. `PROGRESS.md:599-600` — step 2 "Archive Session 18 in its own small PR … §6 still says an archive is its own
   PR until research 02's fold rewrites the rules." Correct today; the fold PR that lands items 1–3 makes it
   stale, and the same handoff rewrites it.
10. `PROGRESS.md:625-629` — step 5(b) already records Decision 5 and asks for this list; it points at "the
    research 02 fold lists which" — this section is that list.
11. `PROGRESS.md:11-12` — "the rules still say an archive is its own PR": true until items 1–3 merge.
12. Memory `project-workflow-optimisation.md` — already re-decided; its "How to apply" line still says "then A
    with B"; update with the order below when the fold lands.

Prose budget: `awk '/^```/{f=!f; next} f{next} /^[[:space:]]*$/{next} {n++} END{print n}' AGENTS.md CLAUDE.md`
= **149** at `eb6099a`. Nothing on this list touches `AGENTS.md`, so the budget is unaffected by the Decision 5
rewrite.

## Ordering

M8, L3, L5 and L6 do change the order. Under Decision 5, B shrinks to `docs/SESSION-HANDOFF.md` §6/§7 lines plus
the research-02 fold, touches no `AGENTS.md` line (M8's pressure from B is gone), and starts saving a PR, a CI run
and a surrogate round from the very next session, so it should not wait for A. Proposed: **the R1 fold with
Decision 5 and its verification round first** (step 5(b)); then **the inventory** scoped per M7, so every later
item has a before figure; then **C** (the report contract; its new brief is measured on the next session's first
dispatch, M5); then **B alone** as a small docs PR; then **A carrying H** (L5 — Alex's answers on (f), (g), (h),
(j), (k), (m), (o), (u) gathered before A starts, with (j) held open per L4); then **E's archive leg** written
against A's entry shape (L6, B2(b)); then **item G before PR G** (L3), with G's `AGENTS.md` trims landing before
D adds any pointer line there (M8); then **D**, then **I** without the CI check unless Alex grants the exception
(M6). That is: fold → inventory → C → B → A+H → E(archive) → G → D → I, replacing "C and E, then A with B, then
D, G, H, I".

## What this round did not do

- Did not test a direct push (moot under Decision 5) or whether an edited agent brief is re-read by an in-session
  dispatch (M5, UNCHECKED).
- Did not re-run the jsonl scans behind "33 in 10 sessions" and the 8.9–11.4 KB replies (N3; the inventory's job).
- Did not re-verify the self-audit's byte table beyond `PROGRESS.md`, `AGENTS.md`, `CLAUDE.md`, the global
  `CLAUDE.md`, `MEMORY.md`, `implementer.md` and `docs/GIT.md`.
