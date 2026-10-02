# Workflow optimisation — research and proposal

_A record, not instructions. Once the PRs it leads to merge, the docs they change are the authority._

Session 19, 2 October 2026. `main` at `bf9f8d1`. Ticket: `CC-006` (Alex, Session 20; he chose "new
ticket, before PR G"). Status: **researched; Alex answered three questions in Session 19 and re-scoped F in
Session 20 (Decisions); `spec-grill` has not run.** Nothing in the repo changes in the PR that adds this
file, except a `.prettierignore` line.

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

Line cites in the source reports are against `bf9f8d1` or `eb4683f`; they were not re-verified here.

## Findings, ranked

The three repo threads converged on A, C and E independently.

| #   | Change                                                                                                                                                                                                                                                                                                     | Evidence                                                                                                                                                                      | Saving                                        | Cost       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------- |
| A   | A session reads only the newest `PROGRESS.md` entry and its own loading block, rewritten each handoff rather than struck through. The "Updated" paragraph stack and settled decisions move to history. `docs/research/01-pcr-workflow-port.md` stops being required reading (only PR G's section is live). | Session start reads ~133 KB (self-audit). PCR `PROGRESS.md:90`, `docs/SESSION-HANDOFF.md:52`; moe `docs/SESSION-HANDOFF.md:78-104`.                                           | ~20–25k tokens per start                      | M          |
| B   | Handoff and archive commits go straight to `main` (Alex's preference, Decisions).                                                                                                                                                                                                                          | 22 of the last 34 first-parent `main` commits are handoff or archive PRs; `copilot-surrogate` ran 33 times in 10 sessions (moe, PCR threads).                                 | A PR, a CI run and a review round per session | S, policy  |
| C   | One report contract for all four agents: verdict and counts first; each finding with `path:line`, failure scenario and fix; full report to a file, a capped reply; confirm rounds read only the fold's range.                                                                                              | Four shapes today; reviewer replies 9–11 KB. PCR `da-reviewer.md:30-36` (1.3–2.5k tokens); moe #122 (~9k → ~3k per round).                                                    | ~half of reviewer bytes in the coordinator    | S          |
| D   | Leaner agent briefs: history out of agent bodies; mandatory reading on demand; `maxTurns`, `disallowedTools`, maybe `omitClaudeMd`.                                                                                                                                                                        | Mandatory reading per dispatch: `da-review` ~65 KB, `spec-grill` ~54 KB, `implementer` up to ~200 KB (self-audit). PCR agents 2–5 KB against CCC's 8–18 KB.                   | ≥15 KB per review dispatch                    | M          |
| E   | The coordinator only orchestrates: doc folds, archive moves and handoff drafting go to `implementer` with doc-fixer-style preconditions (stop on an incomplete brief, never compute a number, read your own diff).                                                                                         | PCR research/54: 14 of 22 sessions passed 250k before the rule, median 170k after. Session 19: `implementer` built PR F for 37k Sonnet tokens; the coordinator only verified. | Session length                                | M          |
| F   | `deniedMcpServers` in `.claude/settings.json` for MCP servers this repo never uses; optionally `autoCompactWindow` as a backstop behind the 250k line.                                                                                                                                                     | §Claude Code facts. MCP tool definitions were ~20k of Session 19's 81k start.                                                                                                 | Part of ~20k per start; measure               | S          |
| G   | One home per fact: derive test counts (30 lines in 11 files) rather than restate them; drop the two brief lines that tell agents to restate facts; de-duplicate incidents retold in 8–14 files.                                                                                                            | Self-audit §1 clusters D1–D14, §5 test counts; `docs/DEVELOPMENT.md:387` against `copilot-surrogate.md:19-23`.                                                                | ~15–20 KB; settles (l), (m)                   | M          |
| H   | Close stale decisions (f), (g), (h), (j), (k), (m), (o), (u); (j) is in the global `CLAUDE.md`, (h) in `docs/GIT.md:232`.                                                                                                                                                                                  | Self-audit §4 has a disposition for each.                                                                                                                                     | ~5 KB                                         | Alex rules |
| I   | Small: `spec-grill.md` says "ask the caller", which a subagent cannot; stale facts in `docs/GIT.md`, `docs/DA-REVIEW.md`, `docs/REVIEW-PATTERNS.md`; a CI commit-subject check.                                                                                                                            | moe thread #8, #9; self-audit #11.                                                                                                                                            | Quality                                       | S          |

Proposed order: C and E, then A with B, then D, G, H, I. F is approved and goes first next session
because it needs a fresh session to measure.

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

## Decisions (Alex, 2 October 2026)

1. **B: straight to `main`**, unless there is strong evidence for a PR per session. The coordinator found
   none: the evidence (Session 19's MATERIAL on #95, #93's MATERIAL) is for a review of state lines,
   which can run before the push. Needs `AGENTS.md` §PR workflow, `docs/GIT.md` and
   `docs/SESSION-HANDOFF.md` §6 rewritten first; until then handoffs stay PRs.
2. **A new ticket, before PR G.** Key from Alex.
3. **F: yes, in project settings**, measured with `/context` before and after in a fresh session.
4. **F re-scoped (Session 20, 3 October 2026)**, after §Item F, checked below: deny the claude.ai connectors
   the terminal CLI loads, and Alex turns off the desktop tools this repo does not use. Ticket key `CC-006`.

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

`.gitignore` gains `!.claude/settings.json` here, earlier than PR G planned it (research 01, finding B1). G
still adds its hook entries to the same file, and its `AGENTS.md` trigger-table row for
`.claude/settings.json`.
