# Porting the PCR Formulation AI workflow — research and proposal

_A record, not instructions. Once PRs A to G merge, the docs they change are the authority._

Session 11, 29 September 2026. `main` at `2fd018b`. Ticket `CC-005`.

Status: **approved by Alex with the decisions at the end; `spec-grill` next.** Nothing in the repo has
changed. Per the loading instructions, `spec-grill` runs on the approved proposal before any file moves.

## Plain-English answer

Most of PCR's workflow ports cleanly. It needs smaller numbers here, not a new shape.

1. **Pin models in the agent files.** `model: fable` and `effort: high` go on the three reviewers. The
   hand-passed `model` becomes an override, not the only thing keeping a reviewer off the session's
   model.
2. **Add one agent, `implementer.md`, on Sonnet.** Session 10's inline trial is the evidence. None of
   PCR's other six agents earns a file here.
3. **Give the handoff numbers.** A new `docs/SESSION-HANDOFF.md` adapts PCR's: 150k soft, 250k hard,
   5-hour at 85%, weekly lines, warning signs, and a next-session model table. `get_usage` is the
   meter.
4. **Make `AGENTS.md` the real file, and `CLAUDE.md` a stub that imports it.** The docs recommend this
   shape, and it costs no tokens. Agents cannot be imported through `CLAUDE.md`; Alex confirmed the
   swap is what he meant (Decision 1).
5. **Aim the token pass at what is read repeatedly, not at `CLAUDE.md`.** `CLAUDE.md` is small (4.8k
   tokens with memory). The recurring costs are:
    - `PROGRESS.md`, about 30k tokens at every session start, and read in full by `copilot-surrogate`
      on every handoff PR;
    - `docs/TESTING.md`, whose one table is 69% whitespace padding by bytes;
    - an archive trigger that has been under-firing, because it converted bytes to tokens at the wrong
      ratio.
6. **Port one hook, not two.** `guard-destructive-git` should come across, plus a hard **deny on
   `git commit --amend`**, which this repo forbids and nothing enforces. `post-edit-check` should wait.

## How this was researched

- **Read in full in PCR** (read-only): `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, all nine
  `.claude/agents/*.md`, `docs/SESSION-HANDOFF.md`, `scripts/docs-budget.ts`,
  `scripts/check-claude-docs.ts`, `scripts/guard-destructive-git.ts`, `scripts/post-edit-check.ts`,
  `research/54-handoff-threshold-review.md`, one rule file.
- **A Sonnet `Explore` agent** swept the rest: the research reports, `PROGRESS.md`,
  `docs/PROGRESS-ARCHIVE.md`, `docs/CLEANUP.md`, CI and husky. Citations below marked (PCR deep dive)
  are its reading, with `file:line`.
- **Claude Code behaviour** was checked against the live docs by a Sonnet `claude-code-guide` agent on
  29 September 2026 (memory, sub-agents, hooks and statusline pages). The `model`, `effort` and
  `isolation` rows were quoted verbatim. The rest of its frontmatter key list came from a summariser.
- **Measured here:** `wc -c`, `get_usage` at start and at three checkpoints, and a harness-reported
  token count.
- **A token-count attempt that failed.** I sent each doc through `claude -p` and read the input-token
  delta over a stable 13,739-token baseline. It did not reproduce: `docs/GLOSSARY.md` gave −2,859,
  10,081 and 15,715 on three runs. Those numbers are discarded, and **no per-file token figure below
  comes from that method.**

## 1. Agents and their models

### Findings

- **The docs verify both keys.** Agent frontmatter supports `model` (`sonnet`, `opus`, `haiku`,
  `fable`, a full ID, or `inherit`) and `effort` (`low` to `max`; the docs say it "Overrides the
  session effort level").
- **Precedence**: the per-call `model` parameter first, then frontmatter, then
  `CLAUDE_CODE_SUBAGENT_MODEL`, then the main session's model. Today all three agents here say
  `model: inherit`, so a dispatch that forgets `model` silently runs the reviewer on the session's
  model.
    - Sessions 8 and 9 show that a recorded model decision is not self-enforcing.
    - PCR hit the same failure with an Opus-tagged chunk (Lesson ZZZ, `PROGRESS-ARCHIVE.md:3369-3377`,
      PCR deep dive).
- **PCR's model-per-agent table was an assertion, not a measurement.** Its own `research/16:141` says no
  paper measured cheaper models on routine subtasks.
    - The only change the evidence ever forced was pinning `effort: high` on the reviewers, because
      Opus 5.5 defaults to `medium` (PR #113, PCR deep dive).
    - No agent ever moved between tiers there.
- **Session 10 is this repo's own evidence for an implementer.** A Sonnet 5.5 subagent built row 10 part
  two in about 3.5 minutes on ~103k tokens, and every claim in its report survived four reviewers.
- **PCR's brief-first finding** (`research/60`, PCR deep dive): the win came from making the builder
  **list what the brief leaves to it**, not from a longer brief. That list recovered all four
  ambiguities, at 38% of a full read. Session 10's pattern 3 says the same thing independently.

### Proposal

| Agent                   | Change                                                                      | Why                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `da-review`             | `model: fable`, `effort: high`                                              | Alex's 12 Sep decision ("agents on Fable") becomes enforced, not remembered. Fable weekly is at 9%.     |
| `copilot-surrogate`     | same; shorten `description` to ~250 chars; fix its "~100 KB" repo-size line | The description loads in every session's Agent tool list. Tracked text is 661,247 bytes now, not ~100k. |
| `spec-grill`            | same                                                                        | —                                                                                                       |
| **`implementer`** (new) | `model: sonnet`, no effort pin (Sonnet defaults to `high` per PCR's note)   | Decision (s). Session 10's inline brief becomes a file.                                                 |

**What `implementer.md` says**, adapted from PCR's:

- It works one `PROGRESS.md` plan row.
- It writes test-first (vertical slice, per `CLAUDE.md`), with the mutation table for any `src/**`
  behaviour change.
- It lists every choice left open.
- It never opens the PR, pushes or merges: the review order puts the PR after both reviews.

It commits on its branch (Decision 2 below).

**Not ported, with a re-entry condition each:**

| PCR agent                         | Why not here                                                                                                       | Re-entry                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `chunk-briefer`                   | No `BUILD_PLAN.md`; a plan row here is a sentence, and the coordinator writes the brief inline, as Session 10 did. | An implementer report shows it missed a rule its brief should have quoted. |
| `doc-checker`                     | That is `copilot-surrogate`'s job.                                                                                 | —                                                                          |
| `doc-fixer`                       | Doc sweeps here are a few files, done by the coordinator or the implementer.                                       | A sweep crosses ~10 files twice.                                           |
| `code-reader`                     | The built-in `Explore` agent does it, and skips `CLAUDE.md`.                                                       | —                                                                          |
| `lint-fixer`                      | `npm run lint` plus `prettier --write`; Haiku 4.5 retires on 15 October 2026 (PCR `BUILD_PLAN.md:394`).            | —                                                                          |
| `maths-reviewer`, `import-mapper` | Domain-specific; there is no analogue.                                                                             | —                                                                          |

**Borrow two disciplines, not agents:**

1. **Recompute every number the change adds, with a scratch script that first reproduces a figure
   already stated.** This is PCR `doc-checker` step 7, going into `copilot-surrogate`. It aims at the
   count-drift family (decision (l), three incidents).
2. **Dry-run a new agent file on a real past diff before merging it.** This is PCR Lesson U. A new agent
   file may not be invokable by name in the session that creates it, so run it as `general-purpose`
   told to follow the file.

**Worktrees (decision (p)).** `isolation: worktree` exists but "branches from the default branch", so it
does not hand a reviewer the PR branch. Keep the manual `git worktree add ../cc-<name>-wt <ref>
--detach` step. Promote it into the new handoff/dispatch doc (it has fired three times), and trial
`isolation: worktree` plus a detached checkout once before relying on it.

## 2. Session handoff that reads usage

### Findings

- **This repo's trigger is qualitative:** "context nearing the pre-compaction budget, a natural
  boundary, or the compaction warning". It lives inside the 31k-byte `docs/DEVELOPMENT.md` §Session
  handoff. With a 1M window and auto-compact at 97%, "nearing compaction" is ~970k, far past where PCR
  saw quality hold.
- **PCR's lines are judgement, reviewed once on 40 sessions of data** (`research/54`).
    - When the main session orchestrated and subagents built, the median handoff was 170k, and 1 in 13
      passed 250k.
    - When the main session built, the median was 283k, and 14 in 22 passed 250k.
- **The 85% five-hour rule fired twice in PCR, both times beside a due handoff.** Its effect was "launch
  no more subagents" (PCR deep dive, `PROGRESS-ARCHIVE.md:289`, `:4327`). PCR records weekly usage but
  has no weekly trigger.
- **This repo's readings:**

    | Session | Moment             | Context | 5-hour | Weekly | Fable weekly |
    | ------- | ------------------ | ------- | ------ | ------ | ------------ |
    | 10      | start              | 79k     | 30%    | 55%    | 4%           |
    | 10      | handoff            | 171k    | 46%    | 57%    | 7%           |
    | 11      | start              | 91k     | 61%    | 59%    | 9%           |
    | 11      | before the fan-out | 165k    | 64%    | —      | —            |
    | 11      | after the digest   | 195k    | 67%    | 60%    | 9%           |

- **The session is not empty at start.** This session's fixed overhead is 64,484 tokens:
    - tools 30,739;
    - MCP tools 20,298;
    - memory files 4,836 (`CLAUDE.md` plus `MEMORY.md`);
    - skills 4,422;
    - system prompt 4,189.

    So a 150k soft line leaves roughly 60–85k of working room. That is the same harness PCR runs in, so
    its lines already absorb this.

- **The meter.** `mcp__ccd_session_mgmt__get_usage` returns everything needed in the desktop app. In a
  bare terminal session, only the statusline's stdin carries it:
    - `context_window.used_percentage`;
    - `rate_limits.five_hour` and `rate_limits.seven_day`, on Pro and Max only.

    No hook receives usage (docs-verified). So there is no automation to build: it stays a checkpoint
    discipline.

### Proposal

A new **`docs/SESSION-HANDOFF.md`** (target ≤ 10k bytes, PCR's is 10,457). It absorbs `docs/DEVELOPMENT.md`
§Session handoff and §`PROGRESS.md` structure, which shrink to a pointer. `CLAUDE.md`'s "Hand off on
the sooner of" directive points at it.

**Triggers, the sooner of:**

| #   | Trigger                     | Rule                                                                                                                                                  |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Phase boundary              | A PR merged, a proposal delivered, or a review round digested, **and** context above 100k. Hand off before the next phase.                            |
| 2   | Soft line, **150k**         | Finish the unit in hand, start nothing new.                                                                                                           |
| 3   | Hard line, **250k**         | Hand off now; finish only the step in progress.                                                                                                       |
| 4   | 5-hour ≥ **85%**            | No new subagents. Write the handoff; tell Alex the reset time.                                                                                        |
| 5   | Weekly all-models ≥ **90%** | Same as 4, for the weekly reset. _(Not in PCR.)_                                                                                                      |
| 6   | Fable weekly ≥ **85%**      | Reviewers run on `opus` at `high`, passed per call. The frontmatter stays `fable`. Record the fallback in the PR body. _(Not in PCR.)_                |
| 7   | Structural warning signs    | Re-reading a file already read, asking Alex something answered, two tool failures from a forgotten fact, any auto-compaction. Observable events only. |
| 8   | Topic switch                | Offer a fresh session.                                                                                                                                |

**Checkpoints for `get_usage`:** at start, after digesting any subagent or large result, before any
fan-out, before a new topic, and at handoff. The readings go into the entry.

**The entry records a "Handoff facts" line**, in PCR's shape (PCR deep dive, `PROGRESS.md:10-13`):
tokens at handoff, which trigger fired, the warning signs seen or "none", plan usage, and whether the
session had to ask Alex something the entry should have answered. **Review the lines at Session 20**
with the ten readings, as PCR did at 40.

**Next-session model table**, adapted from PCR §5, with effort always stated. This is PCR's lesson:
Opus 5.5 defaults to `medium`.

| Next session's main work                                           | Model                                                        | Effort |
| ------------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| Research, proposals, plans, orchestrating a PR through review      | Opus 5.5                                                     | high   |
| Hard design judgement with conflicting evidence (e.g. Safari port) | Fable 5.1                                                    | high   |
| Mechanical: a Dependabot merge, a count sweep, an archive PR       | Sonnet 5.5                                                   | medium |
| Subagents                                                          | their frontmatter pins (implementer Sonnet, reviewers Fable) | —      |

Step 6 of the loading instructions then shrinks to one line pointing at this table.

**Why keep PCR's numbers rather than invent ours:**

- Both repos run in the same harness, with a similar fixed overhead.
- PCR has 40 sessions behind its numbers; this repo has two readings.
- Session 10 handed off at 171k, which fits the soft line.

This session will hand off after this proposal: it is past 150k (trigger 2) at a phase boundary
(trigger 1).

**Decision (r), the confirm round.** PCR's fix-pass stopping rule (`research/55:118-137`, PCR deep
dive) answers it:

- Re-check while the last pass fixed any Critical or Medium finding (here, BLOCKING or MATERIAL).
- When a pass fixed only Lows, the coordinator reads that diff itself instead of dispatching a confirm
  round.

That would have saved Session 10's ~120k Fable tokens. It amends `docs/DEVELOPMENT.md` §Verification
rounds. Adopted (Decision 3).

## 3. Soft and hard token lines

These are covered by triggers 2 and 3 above: **150k soft, 250k hard**, measured as `get_usage`'s
`tokensUsed`. They are absolute numbers, not percentages, for PCR's reason: 60% of 1M would be 600k.

**Considered and rejected: raising them to offset the 64k fixed overhead.** No data here says quality
holds past 150k. The one full session on record (Session 10) handed off at 171k without strain.

**What each line obliges** is in the Rule column. The lines are a dial reviewed at Session 20, not a
law.

## 4. `AGENTS.md` primary, imported from `CLAUDE.md`

### Findings (docs-verified)

- **An `@path` import is expanded at launch**, so it costs exactly what inline text does ("doesn't
  reduce context"). It resolves relative to the importing file, up to 4 hops deep, and is skipped inside
  code spans and blocks.
- **Claude Code reads `AGENTS.md` natively only when there is no `CLAUDE.md`.** The docs recommend what
  PCR does: a `CLAUDE.md` next to it containing `@AGENTS.md`, with Claude-specific lines below.
- **The symlink works today, with three documented caveats:**
    - the Edit and Write tools refuse to write through a symlink and redirect to the target;
    - Git on Windows may check it out as a one-line text file;
    - it cannot hold Claude-only lines separately.
- **Agents cannot be imported through `CLAUDE.md`.** They are discovered only from `.claude/agents/`,
  `~/.claude/agents/`, the `--agents` flag, managed settings and plugins. The docs are silent on
  `CLAUDE.md` as a source.
    - PCR does not do it either. Its `AGENTS.md` has one sentence saying `.claude/agents/` "holds each
      agent's own brief with its pinned model".
    - Its `check-claude-docs.ts` validates that frontmatter in CI.
- **Size.** The docs say "target under 200 lines per CLAUDE.md file". `CLAUDE.md` here is 171 lines and
  12,752 bytes, and 131 lines by PCR's `docs-budget.ts` method (code blocks and blanks stripped).
    - PCR's `AGENTS.md` is 10,989 bytes against a stated 150-line, 25-rule budget.
    - This repo is already inside both line figures.

### Proposal

- **Swap the files.** `git mv CLAUDE.md AGENTS.md`, then a new `CLAUDE.md` of a few lines:
    - `@AGENTS.md`;
    - Claude-Code-only material below it: the subagent roster with models, `get_usage`, and the pointer
      to `docs/SESSION-HANDOFF.md`.
- **Token-neutral**, per the import rule above.
- `AGENTS.md` stays tool-neutral for Copilot, Codex and Cursor.
- It fixes the "no generator, no drift" sentence and the `AGENTS.md` sibling note in `CLAUDE.md`'s
  process directives.
- **A stated budget in `AGENTS.md`**: about 150 prose lines for the expanded payload, checked by
  `copilot-surrogate` whenever the file is touched. No script: at one maintainer and a 131-line file,
  a reviewer's `awk` line is enough. The re-entry for a script like PCR's `docs-budget.ts` is the
  budget being breached once unnoticed.
- Alex confirmed this is what he meant (Decision 1).

## 5. Token-cost pass over the docs

### What a session and a dispatch actually load

| Load                      | When                                                                                                    | Size                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md` + `MEMORY.md` | Every session, **and every subagent** (docs: subagents load the `CLAUDE.md` hierarchy, not auto memory) | 4,836 tokens as memory files (`get_usage`)                                                                                                                            |
| Agent descriptions        | Every session's Agent tool list                                                                         | 3 descriptions; `copilot-surrogate`'s alone is ~800 chars                                                                                                             |
| Agent body                | Per dispatch                                                                                            | 17,003 / 13,864 / 11,536 bytes                                                                                                                                        |
| `PROGRESS.md`             | Every session start, in full (step 1); `copilot-surrogate` reads it in full on every handoff PR         | 64,130 bytes. The harness reported lines 1–614 (53,223 bytes) as **25,128 tokens**, i.e. ~2.1 bytes/token including line-number prefixes, so ~30k tokens for the file |
| `docs/TESTING.md`         | When touched: `copilot-surrogate` reads touched files in full, and count sweeps touch it                | 117,068 bytes; **36,224 with space runs collapsed**                                                                                                                   |
| Other docs                | On demand, usually by section                                                                           | 17–37k bytes each                                                                                                                                                     |

### Findings

1. **The archive trigger has been under-firing.** `docs/DEVELOPMENT.md` §Session handoff archives when
   the detail band holds more than five entries or passes "roughly 10k tokens".
    - The loading block reads 31,138 bytes as "under the roughly-10k-token half", which implies ~3
      bytes/token or more.
    - The harness's own figure for this file is ~2.1 bytes/token, which makes the band ~14–15k tokens.
    - **Restate the trigger in bytes (≈ 22,000 bytes)** so `wc -c` answers it without a conversion.
2. **`PROGRESS.md` carries ~8k bytes of record that is no longer state:**
    - lines 58–127, the pre-grill Brief, 6,539 bytes. It is marked "Superseded … kept as the pre-grill
      record, not as instructions";
    - lines 195–212, the 11 September commit sequence, 1,432 bytes.

    Both move verbatim to `docs/history/`. Settled decision branches — (a), (c), (d) and (e), each struck
    through — leave the loading block the same way. The loading block is 13,035 bytes. Together that is
    roughly 10k bytes, about 5k tokens, off every session start and every handoff review.

3. **`docs/TESTING.md` is 69% whitespace by bytes.** §What each test proves (92,152 bytes) is one table.
   Prettier 3.9.9 pads every row to its widest cell (~3,995 characters; reproduced in a scratch file).
    - **Tokens:** whitespace runs tokenise far cheaper than prose, and I could not measure how much
      cheaper (see Method). So the token saving is real but unquantified, and smaller than 69%.
    - **The stronger reasons are quality ones:**
        - A 4k-character line cannot be read in an editor or a diff.
        - Any edit to the widest cell re-pads every row, which is Session 10's "Prettier table re-pad"
          noise in every review.
        - Byte budgets on this file measure padding.
    - **Fix:** turn the table into a `###` per test with the same fields as short labelled lines. No
      content changes, and a reviewer can diff old against new by collapsing whitespace.
    - `docs/GLOSSARY.md` has the same problem at 30% (36,395 → 25,258 bytes). Same fix, lower priority.
4. **`copilot-surrogate`'s ceiling line is stale.** It says the whole tracked text is "about 100 KB"; it is
   661,247 bytes (lockfile and binaries excluded), of which 131,885 is not Markdown. Its 400 KB
   post-filter ceiling is still a sane cap. The sentence justifying it is wrong.
5. **Leave `CLAUDE.md`'s content alone in this pass.** At 4.8k tokens it is small, and the swap in §4
   already restructures it.
    - Moving file-local constraints into `.claude/rules/` with `paths:` would save a little per session
      and per subagent. Candidates: `public/app/*.js` is plain JS; the `execCommand` copy path;
      the `postcss-sort-media-queries` order.
    - But PCR has **no evidence any rule ever fired** in a session (PCR deep dive, item 4), and a
      constraint that must stop a decision before a file is read has to stay always-on.
    - **Not proposed.** Re-entry: `CLAUDE.md` passes 200 lines.

## 6. Hooks

- **`guard-destructive-git`** (PreToolUse, `permissionDecision: "ask"`) fits this repo well:
    - rebase merges make `git branch -D` routine here;
    - `chore/CC-004-copy-to-clipboard-4` and `feat/CC-003-apca-3` are "do not delete" branches.

    Port it with one addition: **`git commit --amend` gets `deny`, not `ask`.** `CLAUDE.md` says "Never
    `git commit --amend`", and until now only memory enforces it. Written as `scripts/guard-destructive-git.mjs`
    to match `scripts/package.mjs`.

    Also, from PCR's own bug (`PROGRESS-ARCHIVE.md:1900-1910`, PCR deep dive): **quote
    `"${CLAUDE_PROJECT_DIR}"`**. Unquoted, the hook failed open on a path with spaces.

    One cost: a test needs `vitest.config.ts`'s `include` widened beyond `src/**/*.test.ts`. That is a
    config change, so both reviews.

    A hook cannot grant permission, so decision (j)'s classifier behaviour is unaffected.

- **`post-edit-check`** — **defer.** PCR recorded no evidence of it catching anything or costing
  latency. Here `npm run lint` already runs tsc ×2, eslint, stylelint and prettier in seconds, and
  per-edit `tsc` over two projects on every Markdown save is noise. Re-entry: a review round finds a
  lint or format slip that the pre-push suite would have caught.

## 7. Where the write-up lives

`docs/research/01-pcr-workflow-port.md`, this document, marked as provenance and never required reading.
It goes there, not at the root like PCR's `research/`, because:

- the `CLAUDE.md` trigger table already routes `docs/**` to `copilot-surrogate`;
- `docs/history/` sets the precedent for non-instruction material under `docs/`.

The first line says it is a record, and the docs it changed are the authority.

## 8. Rollout, if approved

One idea per PR, reviews per the `CLAUDE.md` trigger table, and `spec-grill` on this proposal first.
Ticket `CC-005` (Decision 5). Order revised after spec-grill R1 (M5): **H, E, A, B, D, C, F, G**.

- H goes first, because this write-up is what every later PR cites.
- E goes next, because the Session 6 archive is due now.
- C comes after D, because C's stub carries a roster (from A and B) and a pointer to D's new doc.

| #   | PR                                                                                                                                                                                                                                                                                                                                                    | Touches                                                                  | Reviews                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------- |
| H   | This write-up into `docs/research/01-pcr-workflow-port.md`                                                                                                                                                                                                                                                                                            | `docs/**`; >200 lines                                                    | both                    |
| A   | Pin `model`/`effort` on the three agents; trim `copilot-surrogate`'s description; correct its size sentence (L2); add the recompute discipline; add `CC-005` to `docs/GIT.md`'s key list (L9). Four ideas in one agents PR, said so in the body (L10)                                                                                                 | `.claude/agents/**`, `docs/GIT.md`                                       | surrogate               |
| B   | Add `implementer.md` (`model: sonnet`, **`effort: high` pinned**, M7), dry-run on #72's diff first                                                                                                                                                                                                                                                    | `.claude/agents/**`                                                      | surrogate               |
| D   | `docs/SESSION-HANDOFF.md`; `DEVELOPMENT.md` §Session handoff and §`PROGRESS.md` structure become pointers, **explicitly reversing `DEVELOPMENT.md:360-363`** (M2); worktree rule promoted (p); archive trigger restated in bytes, with `docs/history/SESSIONS.md:6-7` as a sibling (L9); the "Handoff facts" line added to the `PROGRESS.md` template | `docs/**`, and the instruction file (`CLAUDE.md` today)                  | both (M4)               |
| C   | Swap `AGENTS.md` / `CLAUDE.md`; state the budget; siblings `CONVENTIONS.md:39`, `DEVELOPMENT.md:454-455`, `GIT.md:372`, `copilot-surrogate.md:35`, `CLAUDE.md:152-153` (L4)                                                                                                                                                                           | `CLAUDE.md`, `AGENTS.md`, siblings                                       | surrogate; both if >200 |
| E   | `PROGRESS.md` archive: Session 6 (the standing Session 11 instruction) **plus** the pre-grill Brief and the 11 September commit sequence, compressed the way sessions already are (a row or pointer in `docs/history/SESSIONS.md`, full text in `git log -p`), and the struck decision branches (a), (c), (d), (e) (M3)                               | `PROGRESS.md`, `docs/history/SESSIONS.md`                                | surrogate; both if >200 |
| F   | `docs/TESTING.md` table → sections (then `GLOSSARY.md` separately if wanted)                                                                                                                                                                                                                                                                          | `docs/**`; >200 lines                                                    | both                    |
| G   | `guard-destructive-git.mjs` + `.claude/settings.json` **+ `.gitignore` gains `!.claude/settings.json`** (B1) + a protected-branch list (M8) + `ask` on `--amend` (M9) + tests, and the unit-count sweep (L5)                                                                                                                                          | `scripts/`, `.claude/`, `.gitignore`, `vitest.config.ts`, count siblings | both                    |

CC-004 row 11 resumes after all eight (Decision 6).

## Decisions (Alex, 29 September 2026)

Alex answered the six questions. For 2 to 5 he said "happy for you to decide", so those were decided
in-session and are his to flip. Spec-grill R1 revised 2 and 3.

1. **"Agent frontmatter through `CLAUDE.md`" meant "AGENTS.md becomes the real file"** (Alex). That is
   §4 as proposed.
2. **`implementer` commits on its branch, and never pushes, opens a PR or amends** (in-session). The
   reviewers' `git worktree add … <ref> --detach` needs a committed ref. Revised after R1 (M10):
    - **One green commit per vertical slice.** The red run is watched and recorded in the report, never
      committed, so a rebase merge replays no red commit onto `main`.
    - **Review fixes:** code findings go back to `implementer` by re-dispatch, with the findings as the
      brief. Doc-only folds are the coordinator's.
    - **Trailer:** each commit's `Co-Authored-By` names the model that wrote it.
    - The coordinator pushes after both reviews.
3. **Decision (r): recorded as an observation, not adopted** (in-session, revised after R1 M6).
    - `docs/DEVELOPMENT.md` §Process-rule promotion needs two incidents. Session 10 is one, and
      Session 8 pattern 2 ("only the confirm round saw it") is a counter-case.
    - The rule touches seven files: `CLAUDE.md:140-141`, `DEVELOPMENT.md:266`,
      `RATIONALIZATIONS.md:182-184`, `REVIEW-PATTERNS.md:204`, `GLOSSARY.md:94-95` and
      `spec-grill.md:3,143`.
    - D records PCR's stopping rule as a candidate, with its promotion point: a second no-news confirm
      round after a Low-only fold, or the Session 20 review.
4. **Triggers 5 and 6 are kept** (in-session). Trigger 6 is desktop-only: the terminal statusline has
   no per-model figure (L6). Both are reviewed at Session 20 and dropped if neither has fired.
5. **Ticket key `CC-005`** (in-session). Both repos' histories stop at `CC-004`. Alex adds `CC-005` to
   his tracker; PR A adds it to `docs/GIT.md:13-16` (L9).
6. **All of A to H before CC-004 row 11** (Alex). Agreed: row 11 should run under the new agent and
   handoff doc.

## spec-grill R1 (29 September 2026): 1 BLOCKING, 10 MATERIAL, 11 LOW — the fold

Fable 5.1, discovery round, ~175k tokens. Every byte figure reproduced. Folds:

- **B1**, `.claude/settings.json` is gitignored (`.gitignore:33-35`): PR G un-ignores it.
- **M1**, the bytes-per-token ratio: **measured directly after R1.** Reading the 31,138-byte detail
  band with the Read tool raised this session's context by ~15.4k tokens. That includes one small tool
  preview and the coordinator's own turn, so the band is ~12.5–14k tokens, about 2.2–2.5 bytes per
  token. The band **is** over "roughly 10k tokens", so under-firing stands.
    - R1's 3.06 came from `get_usage`'s "Memory files" category, which evidently counts differently.
    - D restates the trigger in bytes at **~22–25k**. D's author settles the exact figure against that
      range.
    - Session-start `PROGRESS.md` cost is ~25–29k tokens at that range, not the "~30k" stated in §5.
- **M2**, the reversal of `DEVELOPMENT.md:360-363`: D says it reverses that line, and why. Session 10
  already recorded readings, and PCR's 40-session record backs the numbers. Session 20 is the
  re-exit.
- **M3, M4, M5, M7, M8, M9**: see §8's table.
    - M9 goes with `ask`, not `deny`. Only Alex can answer an `ask`, so it still enforces, and it has no
      dead end when a commit message merely quotes the rule. The matcher reads argv tokens of a command
      whose first words are `git commit`, and two false-positive tests (a quoted `--amend` in `-m`, and a
      `grep`) are required.
- **M6, M10**: Decisions 3 and 2 above.
- **L1**: `worktree.baseRef: "head"` makes `isolation: worktree` start from the current HEAD. The
  remaining reasons for manual worktrees are `npm ci` (Session 10 pattern 2) and B1. Trial it in D.
- **L2**: the size sentence in `copilot-surrogate.md:63` is "~100 KB code and config, ~350 KB prose
  (11 Sep)". Today it is 125,947 and 529,362 bytes; A corrects it.
- **L3**: subagents load `CLAUDE.md`, not auto memory, so the per-subagent cost is the 12,752-byte file.
- **L6, L9, L10, L4, L5**: folded above and in §8.
- **L7**: 171k was **over** the soft line, not "fits". "Finish the unit in hand" includes that unit's
  own review round, which is why this session dispatched R1 after trigger 2. D writes that definition
  down.
- **L8**: the dispatch evidence is Session 6 (`PROGRESS.md:444-445`). Sessions 8 and 9 were
  main-session model mismatches.
- **L11**: inherits M1; the §5 token figures are superseded by the M1 bullet above.

**R2, the confirm round, is Session 12's first job.** It needs fresh verifiers, run on this file as
committed in PR H. §1 to §7 above keep their R1 wording where this fold supersedes it. Where they
disagree, the fold and §8 are the authority.
