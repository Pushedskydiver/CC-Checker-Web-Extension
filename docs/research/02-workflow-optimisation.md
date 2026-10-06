# Workflow optimisation — research and proposal

_A record, not instructions. Once the PRs it leads to merge, the docs they change are the authority._

Session 19, 2 October 2026. `main` at `bf9f8d1`. Ticket: `CC-006` (Alex, Session 20; he chose "new
ticket, before PR G"). Status: **researched; Alex answered three questions in Session 19 and re-scoped F in
Session 20; F is done (#98). `spec-grill` R1 ran in Session 22
(`02-sources/spec-grill-r1.md`), was verified finding by finding in Session 24
(`02-sources/spec-grill-r1-verification.md`), and is folded into this file in Session 25 (Decisions 5 to 8,
the table, §Item detail, §Inventory brief). A verification round (R2) on the fold is due.** The PR that
added this file changed nothing else in the repo except a `.prettierignore` line; the R1 fold changes this
file only.

## Why

Alex asked for more AI-workflow optimisations: docs cleanup, agent cleanup, how agents report back, and
context and token use, with the coordinator acting as an orchestrator that delegates. PCR Formulation and
moe were the repos to learn from.

## Method

Five subagents, the coordinator reading only their capped replies:

| Thread                       | Agent, model                            | Full report                 |
| ---------------------------- | --------------------------------------- | --------------------------- |
| What PCR does that CCC lacks | `general-purpose`, Opus 5.5 (inherited) | `02-sources/pcr.md`         |
| What moe does that CCC lacks | `general-purpose`, Opus 5.5 (inherited) | `02-sources/moe.md`         |
| Self-audit of CCC's docs     | `general-purpose`, Opus 5.5 (inherited) | `02-sources/self-audit.md`  |
| Claude Code context features | `claude-code-guide`, its default model  | none; superseded, see below |
| Fact-check of that thread    | `claude-code-guide`, Sonnet 5.5         | §Claude Code facts, below   |

The fourth thread ran without an explicit `model`, so on the built-in agent's default. Its report was
wrong on 4 of 12 claims and unsupported on a fifth; the Sonnet re-check below replaced it. Lesson: every
dispatch passes an explicit `model`, Sonnet 5.5 at minimum (Alex, Session 19).

Line cites in the source reports are against `bf9f8d1` or `eb4683f`; they were not re-verified here. Cites
added by the R1 fold are against `eb6099a`, where the verification report re-located them.

## Findings, ranked

The three repo threads converged on A, C and E independently.

| #   | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Evidence                                                                                                                                                                                                                                                                                                                                                           | Saving                                                                                | Cost                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| A   | A session reads only the newest `PROGRESS.md` entry and its own loading block. Entries keep §5's `~~strikethrough~~` rule; the loading block and the "Updated" stack are rewritten in place, superseded text reachable by `git log -p PROGRESS.md`. The "Updated" stack and settled decisions move to history. Research 01 as required reading is already done (loading step 1 reads only its PR G sections). The lines it rewrites are in §Item detail.                                                                                                                 | At `eb6099a`: `PROGRESS.md` 60,098 B whole; newest entry plus loading block 20,035 B (4,172 + 15,863); step 7 is 7,742 B of the block and is H's. Before figure: Session 23's 53k loading-reads cost. The self-audit's ~133 KB included research 01 as required reading. PCR `PROGRESS.md:90`, `docs/SESSION-HANDOFF.md:52`; moe `docs/SESSION-HANDOFF.md:78-104`. | ~17–22k per start, H's share counted once                                             | M; both reviews expected (over 200 lines, a prediction until built) |
| B   | The archive and the handoff go in one PR per session, reviewed as now (Decision 5). The rule rewrite is `docs/SESSION-HANDOFF.md` §6 and §7 only (§Decision 5 rewrite list). Measured in the next session's first dispatch of `copilot-surrogate`, recorded in Handoff facts.                                                                                                                                                                                                                                                                                            | 22 of the last 34 first-parent `main` commits are handoff or archive PRs (re-measured, Session 24). `copilot-surrogate` ran 33 times in 10 sessions (source report's figure; re-run by the inventory).                                                                                                                                                             | A PR, a CI run and a review round per session                                         | S, rules                                                            |
| C   | One report contract for all four agents: verdict and counts first; each finding with `path:line`, failure scenario and fix; full report to a file, a capped reply; the verification round reads only the fold's range (round one unchanged). The SUMMARY line carries "steps completed: n of m; stopped by: none, `maxTurns` or refused tool". Siblings, file-write mechanics and the one-dispatch test are in §Item detail.                                                                                                                                             | Four shapes today; reviewer replies 8.9–11.4 KB (source report's figure; re-run by the inventory). PCR `da-reviewer.md:30-36` (1.3–2.5k tokens); moe #122 (~9k → ~3k per round).                                                                                                                                                                                   | ~half of reviewer bytes in the coordinator                                            | S                                                                   |
| D   | Leaner agent briefs: history out of agent bodies, keeping `spec-grill.md`'s exit condition (`:37-40`); mandatory reading on demand; `maxTurns` picked from measured turn counts, never by guess; `omitClaudeMd` for reviewers at most, never the implementer. `disallowedTools` is dropped. Verifiers follow C's SUMMARY contract. Measured in the next session's first dispatch of each changed agent, recorded in Handoff facts.                                                                                                                                       | Mandatory reading per dispatch: `da-review` ~65 KB, `spec-grill` ~54 KB, `implementer` up to ~200 KB (self-audit). PCR agents 2–5 KB against CCC's 8–18 KB. All four briefs carry a `tools:` whitelist already.                                                                                                                                                    | ≥15 KB per review dispatch                                                            | M                                                                   |
| E   | The coordinator only orchestrates. Split by R1's B2: (a) the handoff-drafting leg is dropped (Decision 6); (b) the archive move goes to `implementer`, after A, with a brief that supplies every number; (c) doc folds above a size threshold go to `implementer`, approved in principle (Decision 6), threshold proposed from the inventory. (b) and (c) keep doc-fixer-style preconditions (stop on an incomplete brief, never compute a number, read your own diff).                                                                                                  | PCR's actual rule is don't build in the main session (PCR `docs/SESSION-HANDOFF.md:65`: "most sessions ran past 250k; since it orchestrates, almost none do"), which CCC adopted with the `implementer` (#84). Session 19: `implementer` built PR F for 37k Sonnet tokens; the coordinator only verified, and still reached 166k (`PROGRESS.md:517-520`).          | Session length                                                                        | M                                                                   |
| F   | `deniedMcpServers` in `.claude/settings.json` for the claude.ai connectors the terminal CLI loads; Alex turns off the desktop tools this repo does not use. Done (#98, `54fb4ba`); re-scoped: §Item F, checked. The optional `autoCompactWindow` backstop is dropped (Decision 7).                                                                                                                                                                                                                                                                                       | §Claude Code facts. MCP tool definitions were ~20k of Session 19's 81k start.                                                                                                                                                                                                                                                                                      | Desktop: none measurable (Sessions 20–23). Terminal: unmeasured. See §Item F, checked | S                                                                   |
| G   | One home per fact: derive test counts (30 lines in 11 files) rather than restate them; drop the two brief lines that tell agents to restate facts; de-duplicate incidents retold in 8–14 files. Item G lands before PR G, and its PR amends research 01 §8 row G (`01-pcr-workflow-port.md:381`) to drop the unit-count sweep (L5); if PR G overtakes it, PR G bumps the counts and item G deletes them later. Its `AGENTS.md` slice lands before D adds any line there. Measured in the next session's first dispatch of each changed agent, recorded in Handoff facts. | Self-audit §1 clusters D1–D14, §5 test counts; `docs/DEVELOPMENT.md:387` against `copilot-surrogate.md:19-23`.                                                                                                                                                                                                                                                     | ~15–20 KB; settles (l), (m)                                                           | M                                                                   |
| H   | Close stale decisions (f), (g), (h), (k), (m), (o), (u); (h) is in `docs/GIT.md:232`. (u) closes with the split "rewrite in rule docs and the loading block; strike in entries". (j) is not closed: see Decision 8's (j) line, which has H rewrite `AGENTS.md` §PR workflow and `docs/GIT.md` §Who merges. H rides in A, with Alex's answers gathered before A starts.                                                                                                                                                                                                   | Self-audit §4 has a disposition for each, except (j), whose "close and move to memory" is stale (two refused merges, `PROGRESS.md:408-411`).                                                                                                                                                                                                                       | ~5 KB                                                                                 | Alex rules                                                          |
| I   | Small: `spec-grill.md` says "ask the caller", which a subagent cannot. The stale facts in `docs/GIT.md`, `docs/DA-REVIEW.md` and `docs/REVIEW-PATTERNS.md` are the carried item at `PROGRESS.md:650-652`, not restated here. The CI commit-subject check is dropped (Decision 7).                                                                                                                                                                                                                                                                                        | moe thread #8, #9; self-audit #11.                                                                                                                                                                                                                                                                                                                                 | Quality                                                                               | S                                                                   |

Order (Decision 8): the R1 fold, the token inventory, C, B alone, A carrying H, E's archive leg, item G, D, I.
Precondition (M8): `AGENTS.md` and `CLAUDE.md` stand at 149 prose lines at `eb6099a`, so G's `AGENTS.md`
slice lands before D adds any line there. H's answers on (f), (g), (h), (k), (m), (o), (u) are gathered before
A starts. E's fold leg waits on the inventory's threshold (Decision 6). F is done.

The self-audit's proposed shared report contract (for C) is in `02-sources/self-audit.md`.

## Claude Code facts

From the Sonnet fact-check against code.claude.com/docs, fetched 2 October 2026:

- **MCP.** `disabledMcpServers` is real but lives in `~/.claude.json` (written by `/mcp`), not
  `settings.json`. `enabledMcpjsonServers`, `disabledMcpjsonServers` and `enableAllProjectMcpServers` cover
  only `.mcp.json` servers. `deniedMcpServers` in `.claude/settings.json` matches any server that is not
  in-process `type: "sdk"`, by name, URL or command (corrected in Session 20, §Item F, checked). Deferred
  tools still load names and server instructions at start. `disableClaudeAiConnectors` exists but does not
  reach connectors the desktop app delivers.
- **On-demand loading.** Skills load name and description until invoked. `.claude/rules/*.md` with
  `paths:` load on Read, Write or Edit of a matching file. No per-agent `CLAUDE.md` mechanism exists; a
  subagent loads the same hierarchy unless `omitClaudeMd: true`.
- **Subagents.** Only the final message returns to the parent. Frontmatter keys include `maxTurns`,
  `disallowedTools`, `mcpServers`, `skills`, `memory`, `background`, `omitClaudeMd`, `effort`, `isolation`.
- **Hooks.** SessionStart and UserPromptSubmit stdout, and `additionalContext` on several events, do enter
  context, capped at 10,000 characters.
- **Compaction.** On a native 1M window it fires at about 967k; `autoCompactWindow`,
  `CLAUDE_CODE_AUTO_COMPACT_WINDOW` and `/autocompact` move it.
- **Caching.** Editing `CLAUDE.md` mid-session neither invalidates the cache nor takes effect until
  `/clear`, `/compact` or a restart.

## Decisions (Alex; each dated)

Decisions 1 to 4 are Alex's of 2 and 3 October 2026; 5 to 8 are in the entries below.

1. ~~**B: straight to `main`**, unless there is strong evidence for a PR per session. The coordinator found
   none: the evidence (Session 19's MATERIAL on #95, #93's MATERIAL) is for a review of state lines,
   which can run before the push. Needs `AGENTS.md` §PR workflow, `docs/GIT.md` and
   `docs/SESSION-HANDOFF.md` §6 rewritten first; until then handoffs stay PRs.~~ Superseded by Decision 5.
2. **A new ticket, before PR G.** Key from Alex.
3. **F: yes, in project settings**, measured with `/context` before and after in a fresh session.
4. **F re-scoped (Session 20, 3 October 2026)**, after §Item F, checked below: deny the claude.ai connectors
   the terminal CLI loads, and Alex turns off the desktop tools this repo does not use. Ticket key `CC-006`.
5. **B: one PR per session** (Alex, Session 23, 6 October 2026). The archive and the handoff go together in one
   PR, keeping CI and the `copilot-surrogate` review. Chosen from four options (straight to `main` with a
   pre-push review; straight to `main` without one; one PR per session; two PRs as now), after R1's B1
   showed that Decision 1 removed the review, skipped CI and reversed `docs/GIT.md`. This supersedes
   Decision 1. `docs/GIT.md` §What needs a PR and its re-entry (`:402-403`) stand unchanged: B1 was the first
   time the re-entry was weighed (22 of 34), and Alex kept the rule.
6. **E's fold leg: approved in principle** (Alex, Session 25, 6 October 2026). Doc folds above a size
   threshold go to `implementer`. The threshold is proposed from the token inventory's measurement, not set
   now. This reverses research 01 Decision 2 ("Doc-only folds are the coordinator's",
   `01-pcr-workflow-port.md:396-397`) and `implementer.md:101-102`; E's own PR changes those, not the R1
   fold. E's handoff-drafting leg is dropped (R1 B2(a)).
7. **Both optional extras are dropped** (Alex, Session 25): the CI commit-subject check from item I (R1 M6)
   and the `autoCompactWindow` backstop from item F (R1 L1). The CI check's re-entry in `docs/GIT.md`
   stands.
8. **The order is approved** (Alex, Session 25), as the verification report proposed: the R1 fold, the token
   inventory, C, B alone, A carrying H, E's archive leg, item G, D, I. It replaces "C and E, then A with B,
   then D, G, H, I". The table's order note carries M8's budget precondition and the list of H's answers
   gathered before A starts.
    - **Item H, (j)** (the coordinator's call, on Alex's delegation in Session 25: he left it to the
      coordinator's judgement on the evidence). The delegated Dependabot merge passed on #55 and #69 and was
      refused by the auto-mode classifier on #61 and #100; the permission rule added after #61 did not
      persist. Keep the delegation, and H rewrites `AGENTS.md` §PR workflow and `docs/GIT.md` §Who merges
      to say the classifier may refuse it. On a refusal Claude reports it and Alex merges; never a
      workaround. This replaces "close (j)" in row H.

## Item detail (R1 fold)

What the table cells point at. Cites are against `eb6099a`.

- **A.** `docs/SESSION-HANDOFF.md` lines it rewrites: `:80` (the "Updated" stack), `:112-114` (the strike
  rule, split as in the table), `:120-125` (§6's band-only measure becomes a measure of what a session reads,
  the two standing blocks at 19,961 + 15,863 B included; the "own small PR" sentence at `:124-125` is B's),
  `:60-63` (the prompt), and `:99`, which gains "including one row after the loading reads" (Session 23 added
  the row at `PROGRESS.md:277`; loading step 1 asks for it at `:587-588`). Also `PROGRESS.md:589` ("this file
  top to bottom") and the two brief paragraphs that expect struck text: `copilot-surrogate.md:195-210` and
  `spec-grill.md:137-140` (self-audit D13). The "Updated" stack is 9,911 B of the next-workstreams block
  (19,961 B).
- **C.** Siblings that say "Return findings as the tool result": `da-review.md:159`,
  `copilot-surrogate.md:251`, `spec-grill.md:157`, and `docs/DA-REVIEW.md:325-329` §Reporting channel (names
  two agents only, self-audit D14), plus `AGENTS.md:138` ("reads touched files at HEAD in full, not the
  diff"), which "range only" must not contradict. The harness refuses report-file writes by default, so the
  contract gains moe's mechanics (`02-sources/moe.md:46`): an absolute path in the primary checkout, written
  in parts, and an in-band fallback if the write is refused (the verification report was written with the
  Write tool without a refusal, so the fallback is a fallback). "Range only" is the verification-round scope
  already in practice (Session 18 pattern 3, `PROGRESS.md:578-579`; `docs/DEVELOPMENT.md:280-286`). The
  copy-out-before-handoff rule (`docs/SESSION-HANDOFF.md:53-54`) extends to reports in a scratchpad. A
  verifier that did not finish may not report nit-floor (`docs/DEVELOPMENT.md:269-271`). Signal: the
  `get_usage` delta across one digest, before (Session 21's ~50k for two digests plus folds) and after. One
  test in C's PR (M5): dispatch `copilot-surrogate` once after the brief edit and record whether it followed
  the new contract.
- **D.** `spec-grill.md:12-36` is the narrative that goes; `:37-40` ("If after a run of real specs this agent
  has caught nothing … move it to `docs/DEVELOPMENT.md` §Not ported") stays, or moves to that list. R1 and
  its verification are that agent's first two real runs, and B1 changed a decision, so the exit condition
  has not fired. `omitClaudeMd` would strip the implementer of the commit format (`AGENTS.md:31-44`), the
  pre-push suite (`:24`) and §Non-obvious constraints (`:74-118`), which `implementer.md:36-45` cites rather
  than restates.
- **E.** The archive move fits `implementer.md:3` ("never push, never open a PR") exactly: under Decision 5
  the archive is the first commit on the session's branch. Reading cost before the first commit: hierarchy
  17,532 B + brief 7,969 B + `docs/GIT.md` 29,829 B = 55,330 B, about 25k tokens at Session 23's ratio. The
  handoff is mostly numbers only the coordinator holds (`docs/SESSION-HANDOFF.md:51-56`, `:96-102`), which is
  why (a) is dropped. PCR's `doc-fixer.md:56-57` forbids editing `research/**`, `PROGRESS.md` and memory, as
  `implementer.md:98-99` does for CCC. The fold share of the coordinator's context is unmeasured (Session 21
  pattern 3, `PROGRESS.md:412-414`); the inventory measures it. A comes before E's archive leg because the
  archive brief encodes the entry shape A changes.
- **G.** G's `AGENTS.md` trims (self-audit `:73`, "~1.5–2 KB, and budget headroom") compete with D's possible
  pointer lines for the one prose line of budget, hence the order.
- **H.** (u): decision (u) is at `PROGRESS.md:666-670`. The (j) disposition is Decision 8's line. H's rewrite
  of `AGENTS.md` §PR workflow has to stay inside the prose budget (M8).
- **I.** `docs/REVIEW-PATTERNS.md:251-252` still reads "There has been one review round on this repo"; that
  is part of the carried item. The commit-subject check was dropped because `docs/GIT.md:396-401`
  ("Re-entry: if those keep drifting, a check on them … is the thing to add") and `docs/DEVELOPMENT.md:352-353`
  and `:378` say not to build a gate before the rule has been broken; in the last 200 commits on `main`, 29
  subjects miss the shape and all 29 are Dependabot bumps or `Merge branch 'main' into …` sync commits.

## Brief changes and the session cache (R1 M5)

In-session subagents run on the instruction files as loaded at session start. That is shown for
`CLAUDE.md` and `AGENTS.md` (memory `project-subagents-cache-instructions.md`); for an edited existing
`.claude/agents/*.md` it is **unchecked**. So B, C, D and G are each measured in the next session's first
dispatch of the changed agent, recorded in Handoff facts, and each PR body says the PR's own review could not
exercise the new brief. C's one-dispatch test (§Item detail) settles the unchecked half.

## Inventory brief (R1 M7)

Step 5(b) of `PROGRESS.md` already asks for byte counts per file at HEAD. This is the rest: per item, the
quantity, the source and the decision it feeds. Sources are file bytes at HEAD, the main-session jsonl, the
sidechain jsonl, and a `get_usage` checkpoint; `claude -p` is not a token meter (memory
`project-claude-p-not-a-token-meter.md`).

| Item | Quantity                                                                                             | Source                          | Decision it feeds                               |
| ---- | ---------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| A    | Bytes of the newest entry, the loading block and `PROGRESS.md`; the "after the loading reads" row    | File bytes at HEAD; `get_usage` | A's saving, and whether H's share is counted    |
| B    | Archive PRs and their `copilot-surrogate` digests per session; the "33 in 10 sessions" count         | Main jsonl; sidechain jsonl     | B's saving; N3's label                          |
| C    | Reviewer reply sizes over more than the source's n of 3 and 2; the `get_usage` delta across a digest | Sidechain jsonl; `get_usage`    | C's reply cap; N3's label                       |
| D    | Turns per agent per dispatch; mandatory-reading bytes per dispatch                                   | Sidechain jsonl; file bytes     | `maxTurns` values; which reading goes on demand |
| E    | The coordinator's context share spent on folds; the `implementer`'s start cost                       | Main jsonl; `get_usage`         | Decision 6's size threshold; whether (c) pays   |
| F    | MCP tool tokens at session start (Sessions 20 to 23: 19,720, 19,855, 19,855, 19,855)                 | `get_usage` checkpoint          | Whether F closes with no desktop saving         |
| G    | Bytes of the duplicated facts and the test-count lines                                               | File bytes at HEAD              | G's saving; which homes stay                    |

## Decision 5 rewrite list

Lines at `eb6099a` that say an archive or a handoff is its own PR. Items 6 to 8 of the verification report
are this fold. The rest are other PRs' work, not this one's.

**Item B's work (`docs/SESSION-HANDOFF.md`):**

1. `:124-125`, "An archive is its own small PR": the archive is the first commit on the session's branch, the
   handoff its last, one PR per session.
2. `:127`, "the archive PR's first commit on `main`": "the session PR's first commit on `main`". The parent
   logic at `:128-129` is unchanged.
3. `:145`, the §7 row "Mechanical: a Dependabot merge, a count sweep, an archive PR": an archive is no longer
   a PR of its own; drop it or give another mechanical example.
4. `:26-28` and `:29-30`, "A unit is one PR or one proposal" and "even after a small archive PR": trigger 1's
   boundary moves to the session PR; one clause saying so.
5. `:123`, "Check at session start, before picking anything up": the archive commit now sits unpushed until the
   handoff. Consider "push the branch after the archive commit" so a session that dies before handoff loses
   nothing (§3 item 3's logic). The coordinator's procedure, not Alex's decision.

**This fold (research 02):** item 6 (row B's Change column), item 7 (Decision 1 struck, with the "rewritten
first" clause gone) and item 8 (the order sentence, now Decision 8). Done here.

**The handoff's work (records, rewritten at the next handoff):**

9. `PROGRESS.md:599-600`, step 2 ("Archive Session 18 in its own small PR … §6 still says an archive is its
   own PR until research 02's fold rewrites the rules"): stale once items 1 to 3 merge.
10. `PROGRESS.md:625-629`, step 5(b): already records Decision 5 and points at "the research 02 fold lists
    which"; this section is that list.
11. `PROGRESS.md:11-12`, "the rules still say an archive is its own PR": true until items 1 to 3 merge.
12. Memory `project-workflow-optimisation.md`: its "How to apply" line still says "then A with B"; update it
    with Decision 8's order.

Checked and needing no change: `AGENTS.md` §PR workflow (`:45-63`), `docs/GIT.md` §What needs a PR (`:80-85`),
§Who merges (`:227-236`) and §Deliberately not adopted (`:402-403`) say nothing about archive or handoff PRs
(H's (j) rewrite of the first two is a separate matter); `docs/SELF-REVIEW.md:270-271` is decision (k), H's;
`docs/DEVELOPMENT.md:86-105` and `:393`, `docs/GLOSSARY.md:108-109` and `.claude/agents/*.md` have no hit.
`AGENTS.md` and `CLAUDE.md` stand at 149 prose lines, and nothing on this list touches them.

## Item F, checked (Session 20)

**`deniedMcpServers` cannot reach the servers the desktop app delivers, and on this machine those are all of
them.** The denylist "applies to every server regardless of where it came from, other than in-process
`type: "sdk"` entries", and the desktop app delivers its connectors to local sessions as exactly those
(code.claude.com/docs `managed-mcp` and `mcp`, fetched 3 October 2026). A Code-tab session also loads
`~/.claude.json` and `.mcp.json` servers, which the denylist does reach, but here both are empty:

- **Session 20's start**, read with `get_usage` (`/context` is a slash command the coordinator cannot run):
  78,058 tokens, of which MCP tools 19,720. Every server behind that figure came from the desktop app:
  Browser, iOS Simulator, computer-use, terminal, visualize, `nas-docker`, `filesystem`, the Claude Docs
  connector and the `ccd_*` tools.
- **`nas-docker` and `filesystem`** come from `claude_desktop_config.json`, and Claude.app starts them itself
  (`ps`: Claude.app's main process starts each through its `disclaimer` helper). Nothing passes them to
  `claude` with `--mcp-config`.
- **`~/.claude.json`** has no user-scope servers and no project-scope ones for this repo, and no plugin is
  installed for it.

**Where it does work: the terminal CLI**, which fetches claude.ai connectors itself. `claude mcp list` in this
repo listed four (Claude Docs, Google Drive, Google Calendar, Gmail), and after the four `serverUrl` entries in
`.claude/settings.json` it lists none. Run from `~`, all four still connect, so the deny is scoped to this
repo. `serverUrl` rather than `serverName`, because the docs warn that a connector's display name can change.

**What reaches the desktop figure is Alex's, not the repo's:** Settings → Claude Code → Browser for the
browser tools (named by the app's `ccd_settings` tool), and claude.ai/customize/connectors for connectors,
which is account-wide. Measure the start again in a fresh desktop session after any change.

`.gitignore` gains `!.claude/settings.json` here: done (research 01, finding B1 and its "Done earlier, in
`CC-006`'s item F" note). G still adds its hook entries to the same file, and its `AGENTS.md` trigger-table
row for `.claude/settings.json`.
