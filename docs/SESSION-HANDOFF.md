# Session handoff protocol

Purpose: keep every session short enough to stay sharp, without Alex having to call the handoff. Claude
decides when, says so in one line, updates `PROGRESS.md`, and gives the prompt to paste into a new session. Adapted from PCR Formulation's `docs/SESSION-HANDOFF.md`; the plan and its evidence are
`docs/research/01-pcr-workflow-port.md` §2 and §3.

Status of the numbers: **judgement, not measurement.** The mechanism is evidenced (PCR's doc cites arXiv
2402.14848 and 2307.03172: reasoning degrades with input length, recall is worst mid-context). The lines are
a dial, reviewed at **Session 20** against the readings this doc asks for.

## 1. When to hand off: the sooner of

| #   | Trigger                              | Rule                                                                                                                                                     |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Unit boundary                        | A unit finished or a PR merged, **and** context above **130k**. Hand off before the next unit.                                                           |
| 2   | Soft line, **150k**                  | Finish the unit in hand, start nothing new.                                                                                                              |
| 3   | Hard line, **250k**                  | Hand off now; finish only the step in progress.                                                                                                          |
| 4   | 5-hour window at **85%** or more     | No new subagents. Write the handoff and tell Alex the reset time.                                                                                        |
| 5   | Weekly all-models at **90%** or more | Same as 4, for the weekly reset. **Trial**, reviewed at Session 20, dropped if neither fired.                                                            |
| 6   | Fable weekly at **85%** or more      | Reviewers run on `opus` at `high`, passed per call (frontmatter stays `fable`); record the fallback in the PR body. **Trial**, as 5; desktop only.       |
| 7   | Structural warning signs             | Re-reading a file already read, asking Alex something already answered, two tool failures from a forgotten fact, any auto-compaction. Observable events. |
| 8   | Topic switch                         | Alex pivots to an unrelated workstream. Offer a fresh session.                                                                                           |

- **Lines are `get_usage`'s `tokensUsed`, absolute not percentage.** The window is 1M, so 60% would be 600k,
  far past where quality holds. Trigger 6 is desktop only: the terminal statusline has no per-model figure.
- **A unit** is one PR or one proposal, with its own review and confirm round. A round digested inside a
  unit still in hand is not a boundary.
- **Why 130k for trigger 1.** Session starts in `PROGRESS.md` ran 67k to 107k, so a 100k floor could fire
  even after a small archive PR. No recorded boundary has yet fallen between 100k and 130k, so the readings
  do not separate the two; at current start sizes one or two units per session is the expected shape. 130k
  is the dial, and Session 20 reads it against the readings.
- **"The unit in hand" includes that unit's own review and confirm round.** Session 10's 171k handoff was over
  the soft line, not "fits" (R1 L7).
- **Precedence.** Triggers 4 and 5 override trigger 2's "finish the unit in hand": at 85% five-hour, a unit's
  review round waits for the next session, after the reset. Session 12 hit exactly that. Trigger 6 changes
  the reviewers' model and stops nothing.
- **Budget before dispatching.** A Fable reviewer costs ~4 points of the 5-hour window (Session 12 pattern 3;
  Session 13 pattern 1: five reviewers, 22 points). Two reviewers at 78% or above cross 85%.

## 2. Checkpoints

Call `mcp__ccd_session_mgmt__get_usage` **at start, after digesting any subagent or large result, before any
fan-out, before a new topic, and at handoff.** The readings go in the entry (§5). In a bare terminal the
statusline's stdin (`context_window.used_percentage`, `rate_limits`) is the only source, and no hook receives
usage, so this stays a discipline, not automation.

## 3. What a handoff consists of

1. **`PROGRESS.md` updated** (§5). This is the real handoff.
2. **Memory current.** Decisions and preferences go to memory so they load automatically.
3. **Background work declared.** A background subagent dies with its session: commit its output first, or
   declare it re-runnable with its inputs on disk.
4. **A one-line notice to Alex** saying why now, plus the prompt below as a text block to paste, not a task chip.
5. **The next session's model and effort** (§7).

The prompt, small on purpose because the artefact carries the state:

```text
Continue CC-Checker-Web-Extension. Follow the "Next session loading instructions" in PROGRESS.md, in order.
Read docs/SESSION-HANDOFF.md and apply it to this session too.
```

## 4. Loading-instruction rules

- **A handoff written before its dependencies merge is stale within minutes.** The next session's first live
  check says which PRs merged and rewrites every hedge the merges overtook ("unless Alex has merged...") in
  its own entry (Session 14 pattern 1).
- **No review runs on a PR after it has merged** (Alex, 29 September 2026). An unreviewed handoff stays
  unreviewed; the next session corrects its stale state lines in its own entry.
- **A loading step that names no rule and no decision by Alex deserves a question before it is followed.** One
  post-merge review (#77) was copied forward by three handoffs until it read as a rule, though no rule
  document held it (Session 15 pattern 1).
- **Live checks every loading block carries:** `git status --short`; `git log --oneline -5 origin/main`
  against the entry's own end state; `gh pr list`; remote branches; `git worktree list`; the pre-push suite.

## 5. `PROGRESS.md`: entry shape and structure

Order: `## Next workstreams (after Session <N>)` (dated "Updated" paragraphs, newest first), the entries
(`## Session <N>`, newest first), `## Next session loading instructions`, `## Session archive`. The **detail
band** runs from the newest `## Session` heading to the loading block. An entry:

```markdown
## Session <N> — <date> (<CC-n>: <headline>)

**<One bold sentence: the most important fact.>** <Merged or not.>

**Setup:** <what the loading checks found, suite result, model and effort from `get_session self`.>

**Done:**

- **[#<n>](link)**, `<branch>`, `<sha>`: <what, which reviews, findings and folds.>
- **Merged:** <what, with SHAs>. **Uploaded:** <version or "no">.

**Handoff facts:**

- **Trigger:** <number, and the reading that fired it>.
- **Readings (5-hour / weekly / Fable weekly / context):** a table, one row per checkpoint.
- **Plan usage:** <reset times>.
- **Warning signs:** <seen, or "none">, and whether every reviewer had its own worktree.
- **Clarifying question:** <did the session have to ask Alex something the previous entry should have answered?>

**Major novel patterns Session <N>:**

1. <a durable lesson, a gotcha, a process fix>.
```

- **Say both** merged and uploaded to the Web Store; they are different.
- **Point to files** rather than restating them; separate "done" from "verified"; list open questions for Alex
  instead of assuming answers.
- **Superseded reasoning in `PROGRESS.md`** gets `~~strikethrough~~` rather than deletion, with what corrected
  it and when. The wrong turns are half the value. (This concerns `PROGRESS.md` and
  `docs/history/SESSIONS.md`; whether `docs/*.md` may carry a dated strike is decision (u), open.)
- **The loading block is pointer-only:** what to verify first, the primary work, lettered decision branches,
  carry-overs, the model and effort. It must not restate rules that live in `docs/*.md`.

## 6. Archiving, and retiring

- **Archive** the oldest entry to `docs/history/SESSIONS.md` (a one-line table row) when the detail band holds
  **more than five entries or exceeds 24,000 bytes.** Measure with
  `awk '/^## Session [0-9]/{p=1} /^## Next session loading instructions/{p=0} p' PROGRESS.md | wc -c`. 24,000
  is ~10k tokens at the measured 2.2 to 2.5 bytes a token (22k to 25k bytes). Check at session start, before
  picking anything up. An archive is its own
  small PR.
- **Repoint cites** of an archived entry's content to `git show <sha>^:PROGRESS.md`, where `<sha>` is the
  archive PR's first commit on `main` (its merge commit or its first branch commit under the merge-commit
  button, its first commit there under rebase or squash). That
  parent still holds the entry under any merge button. Never a branch hash, which a rebase re-hashes.
- **Retired sections.** A block in `PROGRESS.md` that is record rather than state (a superseded brief, a
  finished commit sequence, settled decision branches) moves to `docs/history/SESSIONS.md` §Retired sections as
  one bullet: what it was, when and by what it was superseded. Full text stays in `git log -p`.
- **Stacking.** A handoff opened while an earlier `PROGRESS.md` PR is open is cut from that PR's head with its
  branch as base. A branch with a hand-resolved `PROGRESS.md` merge needs the merge-commit button, not rebase
  (Session 13 pattern 4).

## 7. The next session's model and effort

State **both**. Opus 5.5 defaults to `medium`, and Session 9 arrived on it.

| Next session's main work                                                        | Model       | Effort    |
| ------------------------------------------------------------------------------- | ----------- | --------- |
| Research, proposals, plans, orchestrating a PR through review                   | Opus 5.5    | high      |
| Hard design judgement with conflicting evidence (e.g. the Safari port)          | Fable 5.1   | high      |
| Mechanical: a Dependabot merge, a count sweep, an archive PR                    | Sonnet 5.5  | medium    |
| Subagents: implementer Sonnet at `high`, reviewers Fable at `high` (their pins) | frontmatter | as pinned |

## 8. Keeping this honest

Record the Handoff facts every session. Review the lines at **Session 20** with the readings, as PCR did at
40 (median handoff 170k when the main session orchestrated, 1 in 13 reached 250k). Two sessions in a row with a
clarifying question the previous entry should have answered means the entry shape needs fixing.
