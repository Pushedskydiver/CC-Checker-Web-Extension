# spec-grill R1 (discovery) — docs/research/02-workflow-optimisation.md, CC-006

Reviewed at `8234f50` (worktree `cc-grill-02`). Phase: discovery (no prior-round IDs in the dispatch).
Line cites are against `8234f50` unless a source report is named; those are against `bf9f8d1`/`eb4683f` as the
file itself says (`02-workflow-optimisation.md:32`) and are not re-verified except where a finding turns on one.

**Totals: 2 BLOCKING, 9 MATERIAL, 10 LOW, 4 nits.** Figures I reproduced myself are marked (measured);
figures I could not reproduce are marked UNCHECKED.

Measured at HEAD, for the findings below:
- `AGENTS.md`+`CLAUDE.md` prose budget: **149** (the awk in `AGENTS.md`).
- `git log --first-parent -34 main`: **22** handoff/archive subjects, 12 others — B's "22 of 34" confirmed.
- `PROGRESS.md` 57,314 B: Next-workstreams block 18,558 (of which the "Updated" stack 8,469), detail band
  24,236 (the §6 awk), loading block 13,916 (step 7 alone 7,707), newest entry (Session 21) 3,825.
- `format:check` is `prettier "**/*.{…,md,…}" --check` (`package.json:56`), so `PROGRESS.md` is CI-checked.

---

## BLOCKING

### B1 — Item B as written removes the review that caught the last two handoff defects, skips a CI check that covers the file, and has never been tried
`02-workflow-optimisation.md:41` (table row B: Saving "A PR, a CI run **and a review round** per session") against
`:79-82` (Decision 1: the evidence "is for a review of state lines, which can run before the push").

- **Claim.** B saves a review round per session.
- **Evidence.** Decision 1 keeps the review (pre-push instead of pre-merge). The two defects it cites are real:
  Session 19 pattern 4 (`PROGRESS.md:385-386`, a false fact in a state line found by the surrogate) and Session
  21's 1 MATERIAL on #104 (`PROGRESS.md:235`, step 5(a) said #98 was open). So the row's saving and the
  decision's text disagree, and the plan never says which rule the three rewritten docs will carry: surrogate
  on every state commit (then nothing but the PR and CI are saved), or an exemption for state-only diffs (moe
  thread §2, `02-sources/moe.md:41`, "the no-decision half" — not decided anywhere in 02).
- **Also missing from B's precondition list** (`:81-82` names only `AGENTS.md` §PR workflow, `docs/GIT.md`,
  `docs/SESSION-HANDOFF.md` §6):
  - `docs/GIT.md:80-85` §What needs a PR: "Everything … the sources' direct-to-`main` exception for small doc
    fixes is not adopted: nothing here is appended to so often that a PR costs more than the reasoning it
    protects", and `docs/GIT.md:402-403` records that rejection with a re-entry ("a doc that is appended to
    constantly; re-read nas-stacks' five clauses before importing it"). B is that re-entry firing (22/34) and
    should say so, and do the re-read, rather than rewrite `GIT.md` as if the rule were silent.
  - The `AGENTS.md` trigger table (`docs/**` → surrogate mandatory) and `copilot-surrogate.md:35-36` (its
    §Trigger names `PROGRESS.md` and `docs/**`): an archive commit to `docs/history/SESSIONS.md` straight to
    `main` is a mandatory-surrogate path with no PR to hang the review on.
  - `docs/SELF-REVIEW.md:270-271` ("edits `PROGRESS.md` in the same PR") — decision (k)'s line, which B makes
    wrong in a new way. `docs/DEVELOPMENT.md:87-104` lifecycle diagram ("push + PR … Alex merges").
  - `docs/DEVELOPMENT.md:282-286`: the coordinator "records that read in the PR body". With no PR, the record
    of the pre-push review has no stated home (commit body? the entry?).
  - CI: `format:check` covers `*.md`. A direct `PROGRESS.md` commit that is not Prettier-clean lands on `main`
    unchecked and fails the next PR's required `quality` job. B needs a stated pre-push `npx prettier --check
    PROGRESS.md docs/history/SESSIONS.md` (or the whole suite).
- **Never tried.** Branch protection requires a PR with `enforce_admins` off (`AGENTS.md` §PR workflow), so a
  direct push is an admin bypass by Alex's credential — and the global `~/.claude/CLAUDE.md` §Harness says the
  auto-mode classifier can refuse `git push` with no reason, and did refuse a delegated merge twice (decision
  (j), `PROGRESS.md:268-271`). Whether a session can push to `main` at all is UNCHECKED. Precedent for the
  shape of proof: PR G's acceptance is "an observed `ask` from a real `git branch -D`" (research 01 `:494-495`).
- **Proposed change.** Before the three docs are rewritten: (1) Alex decides the review rule (surrogate
  pre-push on every state commit, or exemption for diffs confined to `PROGRESS.md`/`docs/history/SESSIONS.md`
  with a named reason), and the table row's Saving is corrected to match; (2) one observed direct push of a
  trivial `PROGRESS.md` commit, dated, in the permission mode Alex runs, recorded in the entry — if the
  classifier refuses, B is dead as designed and falls back to moe's "one PR, not two" half; (3) the sibling
  list above is added to Decision 1; (4) the pre-push Prettier check is written into §6.

### B2 — Item E's evidence is for a rule this repo already has, and the agent it borrows preconditions from is forbidden from the file E wants it to edit
`02-workflow-optimisation.md:44` (row E); `02-sources/pcr.md:131-134, 146`.

- **Claim.** "The coordinator only orchestrates: doc folds, archive moves and handoff drafting go to
  `implementer` with doc-fixer-style preconditions"; evidence "PCR research/54: 14 of 22 sessions passed 250k
  before the rule, median 170k after".
- **Evidence.** PCR's rule (`PCR docs/SESSION-HANDOFF.md:65`, read here): "when the main session did the
  **building** and the PR back-and-forth itself (Sessions 6 to 27), most sessions ran past 250k; since it
  orchestrates, almost none do." That is the don't-build-in-main rule, which CCC adopted in CC-005 PR B
  (`implementer`, #84) and used for PR F (Session 19). The 14-of-22 figure says nothing about doc folds or
  handoff drafting. PCR's own later reviews (`:102`) show the orchestrating median rising to ~200k "because the
  soft line is mostly passed while a review or fix round runs" — digests, not folds. CCC's Session 19
  "orchestrated and still reached 166k" (`PROGRESS.md:377-380`). Session 21 pattern 3 (`PROGRESS.md:272-274`)
  lumps "two review digests and the folds" into one ~50k figure, so the fold share is unmeasured here.
- **The precedent cuts the other way.** PCR `doc-fixer.md:56-57`: "Never commit, push … Never edit
  `research/**`, `PROGRESS.md` or memory." E proposes an agent under doc-fixer preconditions drafting the
  handoff in `PROGRESS.md`. And the handoff is mostly numbers the coordinator alone holds (`get_usage`
  readings, band bytes, SHAs, what merged) plus memory (`docs/SESSION-HANDOFF.md:51-56`); under "never compute
  a number" the brief must contain every one, so the coordinator writes the entry anyway, as a brief, then
  reads the diff. The handoff-drafting leg has no saving mechanism.
- **Unstated reversal.** Research 01 Decision 2 (`01-pcr-workflow-port.md:396-397`): "Doc-only folds are the
  coordinator's." E reverses an approved decision and the row does not say so. Precedent for how this repo
  does that: PR D "explicitly reversing `DEVELOPMENT.md:360-363`" (research 01 §8 row D, M2).
- **Cost understated.** Each `implementer` dispatch loads the `CLAUDE.md` hierarchy (17,390 B) plus its brief
  (7,969 B) plus `docs/GIT.md` whole before the first commit (29,829 B, `implementer.md:39-45` per self-audit)
  — about 55 KB ≈ 25k Sonnet tokens per fold, before the fold. Session 19's PR F cost 37k Sonnet tokens for a
  whole PR. For a one-word fold that is a net token loss; the row's Cost column says only "M".
- **Proposed change.** Split E. (a) Drop the handoff-drafting leg. (b) Keep the archive-move leg as the
  candidate (it is mechanical: compress one entry to a row, repoint cites by `git grep`) with a brief template
  that supplies every number. (c) Keep the fold leg only above a size threshold (say: a fold touching more than
  N files or any non-prose file), state that it reverses research 01 Decision 2, and gate adoption on a
  measurement the inventory can make (finding M7 below): coordinator context spent on Edit/Write calls and
  diff reads per session, separated from digests. (d) Replace the evidence sentence with what PCR's rule
  actually says.

---

## MATERIAL

### M1 — Item A's saving is measured against a baseline that no longer exists, and overlaps H
`02-workflow-optimisation.md:40` ("Session start reads ~133 KB (self-audit)"; "~20–25k tokens per start").

- **Evidence.** The 133 KB (`02-sources/self-audit.md:13-20`) includes `docs/research/01-pcr-workflow-port.md`
  at 45,784 B as required reading. At HEAD, loading step 1 (`PROGRESS.md:573-577`) reads research 02 (12,916 B)
  and says of research 01 "read only its PR G sections, and only when G is reached" — changed in `5444852`
  (Session 19's close). A's third clause is already done. Session 21 measured the whole `PROGRESS.md` read at
  ~25k tokens and research 02 at ~5k (`PROGRESS.md:272-273`). A keeps the newest entry (3,825 B) and the loading
  block (13,916 B; 7,707 of it is step 7, which H shrinks): ~17.7 KB ≈ 7–8k tokens remain, so A's own ceiling
  from the `PROGRESS.md` read is ~17–18k, not 25k, and part of that is H's ~5 KB counted again in row H.
- **Proposed change.** Re-baseline A against HEAD: `PROGRESS.md` 57,314 B read whole today versus the bytes a
  newest-entry-plus-block read would take, with H's share stated once. Give it the signal that proves it
  worked: a `get_usage` reading **after the loading reads** as a standing row in the Handoff facts table
  (today the table records Start and later checkpoints only — `PROGRESS.md:251-255`), so A's before/after is
  the same metric Session 21 used.

### M2 — Item A drops `~~strikethrough~~` against `docs/SESSION-HANDOFF.md` §5, decision (u) and two agent briefs, without saying where the wrong turns go
`02-workflow-optimisation.md:40` ("rewritten each handoff rather than struck through").

- **Evidence.** `docs/SESSION-HANDOFF.md:112-114`: "Superseded reasoning in `PROGRESS.md` gets `~~strikethrough~~`
  rather than deletion … The wrong turns are half the value." Decision (u) (`PROGRESS.md:640-644`) is open on
  the `docs/*.md` half. `copilot-surrogate.md` and `spec-grill.md` (this brief, §Key disciplines) both instruct
  readers to expect struck text in `PROGRESS.md` (self-audit D13). A's row rewrites none of them.
- **The resolution exists in the repo's own rules.** §6 already says retired blocks keep "Full text … in
  `git log -p`" (`:130-132`), and the loading block is "pointer-only" (`:115-116`). PCR and moe both strike
  nothing in the block and allow one dated `Update:` line per entry (`02-sources/moe.md:27-28`).
- **Proposed change.** A states the split: session entries keep the §5 strike rule (they are the record and
  they archive); the loading block and the "Updated" stack are rewritten in place, with the superseded text
  reachable by `git log -p PROGRESS.md`; §5 line 80 (the stack) and lines 112-114 are rewritten in A, D13's
  two brief paragraphs with them, and (u) is closed in H consistently ("rewrite in rule docs and the loading
  block; strike in entries"). Also: §6's archive awk (`:122`) measures only the band; after A the standing
  blocks are what a session reads, so the trigger should measure what is read (pcr thread,
  `02-sources/pcr.md:84-86`: 30,708 B "never measured").

### M3 — Item C's file-write mechanics are absent, and it contradicts four live channel lines and the surrogate's whole-file rule
`02-workflow-optimisation.md:42`.

- **Evidence.** (1) The harness default for a subagent is "Do NOT Write report/summary/findings/analysis .md
  files … return findings directly" — present in this dispatch's own system prompt, which is why the caller
  had to say "write with Bash … if refused, return in full". `~/.claude/CLAUDE.md` §Harness records the refusal.
  moe's #122 wrote the mechanics down (absolute path in the primary checkout, write in parts, jsonl fallback,
  "the brief must say so explicitly" — `02-sources/moe.md:46`); 02's row C carries none of it, and the
  self-audit's contract (`02-sources/self-audit.md:107-117`) has no file field at all. (2) Live lines that say
  the opposite: `da-review.md:159`, `copilot-surrogate.md:251`, `spec-grill.md:157` ("Return findings as the
  tool result"), `docs/DA-REVIEW.md:325-329` §Reporting channel. (3) "confirm rounds read only the fold's
  range" contradicts `AGENTS.md` §Process directives ("`copilot-surrogate` reads touched files at HEAD in
  full, not the diff") and the surrogate's `description:` line — a change to the always-loaded file, not an
  agent-brief tweak. (4) The scratchpad path is per session; a report there dies with the session, so anything
  the PR body or entry needs must be copied out before handoff (`docs/SESSION-HANDOFF.md:53-54` has the rule
  for background work; extend it).
- **Proposed change.** C's PR lists those siblings; adds the moe mechanics (absolute path, parts, fallback)
  to the contract; scopes "range only" to the verification round and says what the surrogate still reads in
  full on R1; and names the signal: `get_usage` delta across one review digest before and after, recorded in
  the entry (Session 21 has the before: "two review digests and the folds" ≈ 50k).

### M4 — Items C and D together can return a silently truncated verification round
`02-workflow-optimisation.md:43` (`maxTurns`) and `:42` (the contract).

- **Evidence.** The proposed contract has no "steps completed / which step a missing tool or turn cap stopped"
  field; `02-sources/pcr.md:71` notes CCC has it only in `implementer.md:118-119`. With `maxTurns` set, a
  reviewer that hits the cap mid-walk hands back whatever it has. `docs/DEVELOPMENT.md:269-271`: "A verification
  round the rule below calls for has to actually fire — 'it would have come back clean' is a rationalisation".
  A capped confirm round that reports 0 findings is exactly that, unlabelled.
- **Proposed change.** The contract's SUMMARY line carries "steps completed: n of m; stopped by: none |
  maxTurns | refused tool" and a verifier that did not finish cannot report nit-floor. Pick `maxTurns` values
  from measured turn counts of past dispatches (the jsonl has them), not by guess.

### M5 — Nothing in the plan survives the fact that in-session subagents run on the instruction files as loaded at session start
`02-workflow-optimisation.md:74-75` (caching fact) and `:84` (only F is measured in a fresh session).

- **Evidence.** Memory `project-subagents-cache-instructions.md` (Session 17): an in-session subagent listed the
  OLD `CLAUDE.md` headings; only a fresh process saw the new file. `~/.claude/CLAUDE.md` §Harness: an agent
  file created in a session was not dispatchable in it. So C and D (agent briefs), G (`AGENTS.md` and
  briefs) and B (`AGENTS.md`) cannot be measured, or even exercised, in the session that writes them — the
  confirm round on each PR runs reviewers on the old brief. 02 gives a fresh-session measurement step to F only.
- **Proposed change.** Each of B, C, D, G gets "measured in the next session's first dispatch of that agent,
  recorded in Handoff facts", and the PR body says the review of the PR could not exercise the new brief.
  The inventory (M7) records the per-dispatch "before" so the next session has something to compare.

### M6 — Item I's CI commit-subject check is a gate the repo's rules say not to build yet, and its own source threads disagree
`02-workflow-optimisation.md:48` ("a CI commit-subject check"); `02-sources/moe.md:80-84` (adapt) versus
`02-sources/pcr.md:119-121` ("CCC's own re-entry … is **not met**").

- **Evidence.** `docs/GIT.md:396-401`: the PR-title check is "Deliberately not adopted", re-entry "if [branch
  commit subjects] keep drifting, a check on them … is the thing to add". `docs/DEVELOPMENT.md:352-353,
  378-381`: a gate "when reader discipline has demonstrably failed", "don't build the gate before the rule has
  been broken". The recorded drift is one incident (five commits, 17 March 2026, `AGENTS.md` §Commit format)
  plus one wrong-gitmoji slip ((o), `PROGRESS.md:695-697`), and pcr.md read the last 200 subjects and found
  only Dependabot deviating. The row files it under "Small … Quality" with no mention of either rule.
- **Proposed change.** Drop the check from I, or present it to Alex as an exception to §Process-rule promotion
  with the re-entry quoted — the shape PR G used for its own gate (research 01 `:513-516`).

### M7 — The planned token inventory, as scoped, cannot decide C, D or E; it must say what it measures per item
`PROGRESS.md:606-612` (step 5(b) continued: "Count bytes per file at HEAD … give A, D and G their 'before'
figures").

- **Evidence.** Bytes at HEAD decide A, G and H (file-size cuts to things read whole). They do not decide:
  - **C** — the quantity is hand-back bytes per dispatch by agent; the only CCC figures are n=3 and n=2
    (`02-sources/pcr.md:33`, "Small n") against 48 dispatches in 10 sessions. The session jsonl holds all of
    them (pcr.md's method, main thread, task-notification text).
  - **D** — self-audit §0's per-dispatch table is what the briefs *mandate*, not what agents *read*; the
    sidechain jsonl (`isSidechain`, which pcr.md deliberately excluded) gives Read/Bash result bytes per
    dispatch. Without it, "≥15 KB per review dispatch" is a mandate figure.
  - **E** — coordinator bytes on Edit/Write calls and `git diff` reads per session versus digest bytes.
    Session 21 lumps them (`PROGRESS.md:272-274`).
  - **B** — the saving is mostly Alex's time, CI minutes and ~4 points per Fable reviewer
    (`docs/SESSION-HANDOFF.md:38-40`), not coordinator context; count surrogate dispatches on handoff/archive
    PRs and their digest bytes.
  - **F** — the terminal-CLI start figure was never recorded; the desktop figure moved 78,058 → 75,131 with
    MCP tools 19,720 → 19,855 (`PROGRESS.md:573`), i.e. no measurable desktop saving, as §Item F predicted.
  The meter for all of them is `get_usage` `context.tokensUsed` deltas or bytes — never print-mode token
  deltas (memory `project-claude-p-not-a-token-meter.md`).
- **Proposed change.** Step 5(b)'s brief lists, per item, the quantity, the source (file bytes at HEAD; main
  jsonl; sidechain jsonl; `get_usage` checkpoint) and the decision threshold it feeds; and adds the "after
  loading reads" checkpoint (M1) so every later "after" is comparable.

### M8 — Ordering: `AGENTS.md` has one prose line of budget, and B, G and D all want to write to it
`02-workflow-optimisation.md:50` (order "C and E, then A with B, then D, G, H, I"); budget measured 149/150.

- **Evidence.** B rewrites `AGENTS.md` §PR workflow (Decision 1); G trims history in `AGENTS.md`
  (self-audit §2: "~10 lines" freed); D may add pointer lines. With B before G, B's rewrite must be net-zero
  or negative in prose lines, which nobody has stated. The surrogate runs the awk on every touch of the file.
- **Proposed change.** Either G's `AGENTS.md` trims land before B (G is "M" cost as a whole, but the
  `AGENTS.md` slice is small and could be its own first PR), or B's row says its rewrite is net-negative and
  by how many lines. State the line budget as a precondition in the order sentence.

### M9 — Item A's row does not list the `docs/SESSION-HANDOFF.md` sections it rewrites, though three of them prescribe what A removes
`02-workflow-optimisation.md:40`, Cost "M".

- **Evidence.** `docs/SESSION-HANDOFF.md:80` prescribes the "Updated" stack; `:112-114` the strike rule;
  `:120-124` the band-only measure and "An archive is its own small PR" (B's sibling); `:60-63` the handoff
  prompt ("Follow the Next session loading instructions in PROGRESS.md") stays but "this file top to bottom"
  in step 1 goes. The self-audit says "Amend SESSION-HANDOFF.md:80" (`02-sources/self-audit.md:176`); 02's row
  lists only PCR/moe cites as evidence and no CCC sibling. `copilot-surrogate` will read the whole file; the
  PR will be >200 lines (both reviews).
- **Proposed change.** A's row names §5 (shape, strike), §6 (measure, PR-or-not shared with B), and the
  two briefs' D13 paragraphs, and says "both reviews".

---

## LOW

### L1 — F's optional `autoCompactWindow` conflicts with handoff trigger 7
`02-workflow-optimisation.md:45` ("optionally `autoCompactWindow` as a backstop behind the 250k line");
`docs/SESSION-HANDOFF.md:21` (trigger 7: "any auto-compaction" is a structural warning sign → hand off).
`.claude/settings.json` at HEAD has no such key (read), so it is still open. Decide it or drop it; a backstop
that fires a hand-off trigger is not a backstop.

### L2 — F's Saving column still says "measure" though both readings exist
`02-workflow-optimisation.md:45` ("Part of ~20k per start; measure"). `PROGRESS.md:573` has Session 20 78,058
(MCP 19,720) and Session 21 75,131 (19,855): MCP tools did not fall. Record "desktop: none measurable; terminal:
unmeasured" in the row or §Item F so the inventory does not re-derive it.

### L3 — Item G and PR G both touch the test counts, in the wrong order
`02-workflow-optimisation.md:46`; `PROGRESS.md:605` ("item G is not PR G") and `:613` (PR G after the CC-006
items). Research 01 §8 row G carries "the unit-count sweep (L5)"; the self-audit proposes "make G remove the
counts instead of bumping them" (`02-sources/self-audit.md:216`). If item G lands first, PR G's L5 is moot and
research 01 §8 should be amended by item G's PR; if PR G lands first it bumps counts item G then deletes. Say
which, in the row.

### L4 — H's disposition for (j) is stale: it is live, not closable
`02-workflow-optimisation.md:47` ("close (j) … is in the global `CLAUDE.md`"); `02-sources/self-audit.md:164`
(written 2 October). Session 21 (`PROGRESS.md:268-271`) made it two refusals and an open ask for Alex ("adds
one that does, in his own settings, or keeps merging Dependabot himself"); `AGENTS.md` §PR workflow still
states the delegation as if executable. Closing (j) to memory loses the ask. Close it only with the
`AGENTS.md`/`docs/GIT.md` §Who merges text adjusted to what actually happens.

### L5 — H and A rewrite the same 7.7 KB twice unless H goes first or rides in A
`02-workflow-optimisation.md:50` puts H after D and G; step 7 is 7,707 B of the 13,916 B loading block A
restructures. Either H precedes A (it is "Alex rules", cheap) or A carries H's closures with Alex's answers.

### L6 — E before A means the archive brief is written twice
If E's archive-move leg survives (B2), its implementer brief encodes today's entry shape; A then changes it
(stack gone, block rewritten). Order A before E's archive leg, or write E's brief against A's shape.

### L7 — D's `omitClaudeMd` would strip the implementer of the commit format and the trigger table
`02-workflow-optimisation.md:43`. `AGENTS.md` carries the commit format, the pre-push suite and §Non-obvious
constraints; `implementer.md` cites them rather than restating. Use `omitClaudeMd` for reviewers only if at
all, and say which brief restates what. `disallowedTools` is redundant where `tools:` already whitelists
(all four briefs do, frontmatter read).

### L8 — D's "history out of agent bodies" must keep spec-grill's exit condition
`spec-grill.md` §"Why this agent was ported" ends with a dated exit: if after real specs it has caught nothing
the DA and self-review would not, move it to `docs/DEVELOPMENT.md` §Not ported with a re-entry. That is a rule
with a trigger, not narrative; D moves the narrative and keeps the sentence (or moves it to §Not ported's
sibling list).

### L9 — B changes what a citable hash is, and §6's repoint rule
Direct commits to `main` have stable hashes, so `AGENTS.md`'s "cite PR numbers rather than branch hashes" and
`docs/GIT.md`'s "never a branch hash" need a carve-out for them, and `docs/SESSION-HANDOFF.md:126-129`'s
`git show <sha>^:PROGRESS.md` (where `<sha>` is "the archive PR's first commit on `main`") becomes the archive
commit itself. Add both to Decision 1's rewrite list.

### L10 — I duplicates a carried item
`02-workflow-optimisation.md:48` ("stale facts in … `docs/REVIEW-PATTERNS.md`") and `02-sources/self-audit.md:84-85`
restate `PROGRESS.md:623-626` (the `REVIEW-PATTERNS.md:251-252` "no second round" line, "Its own small docs
PR"). Point at the carried item rather than listing it again; `docs/REVIEW-PATTERNS.md:251-252` at HEAD still
says it (read).

---

## nits

### N1 — Stale status lines in the file
`02-workflow-optimisation.md:50-51` "F is approved and goes first next session because it needs a fresh session
to measure" — F merged as #98 (`PROGRESS.md:13-14`). `:7` "`spec-grill` has not run" — true until this round;
the fold updates it.

### N2 — Row F is not re-scoped in the table
`:45` still describes the pre-Session-20 F; only Decision 4 and §Item F carry the re-scope. A one-clause
pointer in the row ("re-scoped: §Item F, checked") stops a reader acting on the row.

### N3 — Two UNCHECKED figures the file relies on
"`copilot-surrogate` ran 33 times in 10 sessions" (`:41`) and the 8.9–11.4 KB reviewer replies (`:42`) are
subagent jsonl scans whose scripts (`scratchpad/agentreports.py`, `02-sources/pcr.md:22`) lived in a dead
session scratchpad. Not disputed; mark them as the source reports' figures, re-run by the inventory (M7).

### N4 — Research 01 cites in 02 are to the pre-#98 text
`:115` "research 01, finding B1" — at HEAD `01-pcr-workflow-port.md:421-422` already carries the "Done earlier,
in CC-006's item F" pointer, so the sentence is satisfied; say "done" rather than "earlier than PR G planned
it".

---

## What this round did not do
- Did not re-verify the self-audit's byte table at `bf9f8d1` beyond the `PROGRESS.md` blocks above.
- Did not test a direct push (B1) — out of scope for a read-only grill; it is the proof B needs.
- Did not count sidechain bytes (M7) — that is the inventory's job.

Nit-floor: no. Two BLOCKING and nine MATERIAL; a verification round is due after the fold per
`docs/DEVELOPMENT.md` §Verification rounds.
