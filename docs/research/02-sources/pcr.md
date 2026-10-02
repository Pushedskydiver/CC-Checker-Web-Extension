# PCR Formulation → CCC: what is still worth adopting

Read-only research, 2 October 2026. PCR = `/Users/alexclapperton/Desktop/PCR Formulation` (HEAD after
`2c6c6bc`). CCC = `CC-Checker-Web-Extension` at `bf9f8d1`/`eb4683f`. No repo file was edited. The port
plan (`docs/research/01-pcr-workflow-port.md`, CCC) §1 tables, §5–§8 and Decisions were read first, so
nothing below re-proposes what it already ported (implementer, model/effort pins, handoff numbers,
AGENTS.md swap, guard hook as PR G) or rejected with a re-entry condition, unless new evidence appears.

## Method

- Read in full: all nine PCR agent files, PCR `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`,
  `.husky/*`, `docs/SESSION-HANDOFF.md` §1–§6, `docs/CLEANUP.md` §1–Tier 2, the newest PCR `PROGRESS.md`
  entry, `scripts/docs-budget.ts` head, `scripts/check-claude-docs.ts` comments, the answer sections of
  research/54, 55, 56, 61, 63, 67, 69.
- `git -C PCR log --since=2026-09-28 --stat -- AGENTS.md CLAUDE.md docs .claude scripts research`: the
  post-port workflow changes are #124 (backlog landing, Oct 1, incl. research/44–68), #125 (effort by the
  work, Sonnet agents at `medium`), #133 (report shape on five agents), #139 (ten-session handoff review),
  #151 (local dev guide — app-specific), research/69 (ticket board, Oct 2).
- CCC measured with `wc -c`, `grep`, and a scratch Python pass over the last 10 CCC session transcripts
  (`~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension/*.jsonl`,
  main thread only, `isSidechain` excluded): bytes of tool results that landed in the **main** context,
  by tool and by file. Scripts: `scratchpad/agentreports.py`, `scratchpad/notif.py`.

## Measurements that drive the ranking

| What                                                                        | Figure                                                                                                           |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `PROGRESS.md` bytes read into the main context, last 10 CCC sessions        | 328,702 via Read + 298,345 via Bash (`sed`/`cat`) ≈ **627 KB, ~63 KB/session** (≈30k tokens at ~2.1 B/token)     |
| `docs/research/01-pcr-workflow-port.md` read into main context, 10 sessions | 47,835 Read + 94,544 Bash ≈ 142 KB                                                                               |
| `docs/SELF-REVIEW.md` whole-file `cat`s, 10 sessions                        | 64,185 B (23 KB file, read whole ~3×)                                                                            |
| Main-context tool results by tool, 10 sessions                              | Bash 1,382,756 B (656 calls); Read 514,300; `get_usage` 58,020; Agent launch notices 57,617                      |
| Agent dispatches, 10 sessions                                               | copilot-surrogate 33, da-review 10, spec-grill 3, implementer 2                                                  |
| Reviewer reports (task-notification text) landing in main context           | da-review 8,853 / 9,838 B (n=3, median 8,853); copilot-surrogate 11,400 B (n=2). Small n.                        |
| PCR `da-reviewer` with #133's shape                                         | ~2.5k, 2.3k, 1.3k, 1.8k tokens, 0 files re-opened (`docs/PROGRESS-ARCHIVE.md:5915-5918`)                         |
| CCC `PROGRESS.md`                                                           | 56,526 B / 648 lines: Next workstreams 1–191 = 16,852 B; entries 192–508 = 21,964 B; loading block 509–648 = 13,856 B |
| PCR `PROGRESS.md`                                                           | 26,970 B / 401 lines; the newest entry (what a session reads) 5–104 = 6,095 B                                     |
| Agent body sizes                                                            | CCC 7,969–17,950 B (copilot-surrogate 17,950; da-review 14,028; spec-grill 12,131; implementer 7,969). PCR 2,129–5,391 B |
| Expanded instruction payload, prose lines                                   | CCC 149 vs its 150 budget (awk at `AGENTS.md:158`); PCR 113/150 lines, 20/25 rules (`pnpm docs:budget`)          |
| CCC handoff context, Sessions 14–18                                         | 208k, 213k, 231k, 236k, 149k (`PROGRESS.md:215,277,344,410,477`) — each shipped one archive PR + ~one CC-005 PR   |
| CCC live-doc provenance density (`AGENTS.md`, `CLAUDE.md`, `docs/*.md`, agents) | 311 absolute dates; 91 sibling-repo mentions (PCR/chief-clancy/moe/nas-stacks/tamaclaude); 68 `#NN`; 28 "Session N" |

## 1. PCR's nine agents

| Agent | Frontmatter | What it does | Report back | CCC equivalent / verdict |
| --- | --- | --- | --- | --- |
| `code-reader` | Read, Grep, Glob; sonnet; medium (`code-reader.md:4-6`) | Read-only "how does X work / where is Y" scout; cites file:line, says when inferred (`:27-29`) | Prose answer, no schema | Built-in `Explore` covers it (port §1 table). Skip. |
| `chunk-briefer` | Read, Grep, Glob, Bash, Write; sonnet; medium (`chunk-briefer.md:4-6`) | Quotes (never paraphrases) every doc section a plan chunk cites into one brief file; Gaps lists only unresolved items (`:57-59`) | **Writes the brief to a file; returns only path, lines/chars, Gaps count, steps completed** (`:63-64`) | No `BUILD_PLAN.md`; port rejected with re-entry (port §1). The *return-a-pointer* pattern is the transferable part (#5 below). |
| `da-reviewer` | Read, Grep, Glob, Bash; opus; high (`da-reviewer.md:4-6`) | DA review against a ≤200-line `DA-REVIEW.md` read whole (`:13`); claim-extraction first (`:16`) | **Verdict + count per severity first; each finding: severity, file:line, anchor, failure scenario, fix; clean areas one line each; checks one line each; never restate settled decisions or narrate; never cut evidence** (`:30-36`) | `da-review` exists; lacks the ordered report (#2). |
| `doc-checker` | Read, Grep, Glob, Bash, Write; opus; high (`doc-checker.md:4-6`) | Fresh-context fix check / grill / fact check; recompute numbers with a script that first reproduces a stated figure (`:40-44`) | **Writes a report file** (title, method, plain-English answer + tally, "Needs Alex", C/M/L with Where/Problem/Fix) and **returns only path, tally, Needs-Alex ids, steps completed** (`:50-69`) | `copilot-surrogate` (recompute step already ported). Pointer return is new (#5). |
| `doc-fixer` | Read, Edit, Grep, Glob, Bash; sonnet; medium (`doc-fixer.md:4-6`) | Applies a report's findings under a brief that settles every choice; **stops if the brief lacks** finding ids, file list, settled choices, hub-file findings, tie-break (`:13-23`); never computes a number (`:39-40`); reads its own `git diff` as content (`:44-45`) | Per-finding applied/partly/not with file:line, flagged stops, knock-ons, status lines, added edits, lint results (`:59-67`) | None; port rejected ("doc sweeps are a few files", re-entry ~10 files twice). New evidence: the coordinator doing doc folds is where CCC context goes (#3). Adapt as an implementer mode, not a new file. |
| `implementer` | sonnet; **medium** since #125 (`implementer.md:6`) | Builds one chunk from a brief; lists choices left open (`:34-39`) | One-line branch/SHA/diffstat, open decisions, checks, unverified, docs opened beyond brief (`:64-76`) | Ported; CCC pins `effort: high` (`.claude/agents/implementer.md:6`). See #7. |
| `import-mapper` | sonnet; medium | Spreadsheet import, domain-specific | Same shape as implementer (`import-mapper.md:55-67`) | No analogue. Skip. |
| `lint-fixer` | Read, Edit, Bash; **haiku**, no effort (`lint-fixer.md:4-5`) | Mechanical lint/type fixes only; stops on judgement calls | Each fix file:line + rule; each left error; re-run result (`:33-37`) | `npm run lint` + `prettier --write`; Haiku 4.5 retiring (port §1). Skip. |
| `maths-reviewer` | opus; high | Optimiser purity/determinism/goldens | Same as da-reviewer (`maths-reviewer.md:24-30`) | Domain-specific. Skip. |

Read-only scouts in PCR: `code-reader` (no Bash, no Write) and, functionally, `chunk-briefer` / `doc-checker`
(their only write is the scratch report). The context saving comes less from the agent than from the
**return contract**: they hand back a path and a tally, not the content.

## 2. How PCR agents report back vs CCC

| Property | PCR | CCC |
| --- | --- | --- |
| Verdict-first line with per-severity count | `da-reviewer.md:32`, `maths-reviewer.md:26` | Absent in `da-review.md` (step 7 at `:46-48` gives severities only) and `spec-grill.md` (`:71-76`). `copilot-surrogate.md:222-224` puts totals **last**. |
| Fixed order of sections | All five building/review agents since #133 | `implementer.md:104-121` only |
| "Never restate the brief / settled decisions; never narrate" | `da-reviewer.md:35-36`, `implementer.md:66-67` | Absent in all four |
| "Never cut evidence to save space" | `da-reviewer.md:36`, `implementer.md:75-76` | Absent |
| Clean areas as one line each | `da-reviewer.md:34` | Absent (CCC asks for UNCHECKED list only, `copilot-surrogate.md:222-224`) |
| Write full report to file, return pointer + tally | `chunk-briefer.md:49-64`, `doc-checker.md:50-69` | Absent; all in-band (`copilot-surrogate.md:85,251`) |
| Per-finding evidence | file:line + anchor + failure scenario + fix | Surrogate: verbatim claim, falsifier command, ground truth, severity, class (`copilot-surrogate.md:214-220`) — richer evidence, more bytes |
| "Did you complete every step; which step a missing tool stopped" | `chunk-briefer.md:64`, `doc-checker.md:68-69`, `implementer.md:57-58` | `implementer.md:118-119` only |
| Severity scale | Critical / (Medium) / Low / Nit-FYI (`docs/DA-REVIEW.md:187-196`) | BLOCKING / MATERIAL / LOW — equivalent, keep |
| Length caps | Briefs set them ad hoc ("Report (doc-fixer format, under 25 lines)", research/61 §4 heading at `research/61-docs-provenance-and-citations.md:175`) | None |
| Trial evidence | 4 dispatches, 1.3–2.5k tokens, restated-brief share 0, re-opens 0 (`docs/PROGRESS-ARCHIVE.md:5823-5826, 5915-5918`) | CCC reviewer reports measured at 8.9–11.4 KB (above) |

## 3. Doc structure and token economy

- **PCR session start reads one entry.** Loading instructions live *inside* each entry and begin
  "Read this entry" (`PCR PROGRESS.md:90`); the entry shape mandates them per entry
  (`PCR docs/SESSION-HANDOFF.md:52`). The newest entry is 6,095 B. CCC's standing loading block says
  "this file top to bottom, then `docs/research/01-pcr-workflow-port.md`" (`CCC PROGRESS.md:510-512`),
  i.e. 56.5 KB + 45.8 KB, and the block itself accretes struck-through steps (`PROGRESS.md:516-525`) to
  13,856 B. Measured result: ~63 KB/session of `PROGRESS.md` into main context.
- **CCC's archive trigger measures only the band.** `docs/SESSION-HANDOFF.md:120-124` measures from the
  newest `## Session` to the loading block (21,964 B today), so 30,708 B of standing blocks (Next
  workstreams + loading block) are never measured.
- **Research is provenance, never required reading** (PCR `AGENTS.md:109-111`, from research/56 R1, which
  measured a screen builder at ~165k tokens of reading before code, `research/56-docs-dry-run.md`
  Plain-English answer). CCC marks its research file "a record, not instructions"
  (`docs/research/01-pcr-workflow-port.md:3`) but still mandates reading it every session
  (`PROGRESS.md:511-512`) and points spec-grill at it (`.claude/agents/spec-grill.md:54`).
- **Budget scripts.** `scripts/docs-budget.ts` (lines + rules over the expanded payload, fails CI;
  `docs-budget.ts:1-15`) and `scripts/check-claude-docs.ts` (agent frontmatter keys/model/effort, rule
  `paths:` globs; `check-claude-docs.ts:1-2,15-22,123-133`). CCC uses an awk one-liner with an explicit
  re-entry for a script (`AGENTS.md:158-161`); it currently reads **149 of 150**.
- **Citation thinning (research/61).** PCR set Keep/Drop/Never rules
  (`research/61-docs-provenance-and-citations.md:38-66`) and ran them with parallel fixers, then one
  checker that first reproduced the baseline counts (`research/63-citation-thinning-check.md` method).
  Process docs keep "(Session N)" when it is the only reason for a rule (`research/61-docs-provenance-and-citations.md:50-51`). CCC's own
  convention (a rule names its incident and date) is compatible with that Keep list; what it lacks is
  the Drop list (chains of dates, sibling-repo comparisons such as `AGENTS.md:39-44`).
- **Archive.** PCR archives verbatim into a frozen, lint-excluded `docs/PROGRESS-ARCHIVE.md`
  (`PCR AGENTS.md:64-65`), as a `mechanical` move (`docs/CLEANUP.md:37`), recently in the handoff PR
  itself (#152's title, commit `1e669ca`). CCC compresses each entry into a row
  (`docs/SESSION-HANDOFF.md:120`), as "its own small PR" (`:123-124`), which then takes a
  copilot-surrogate round and folds (CCC commits `3b8eec6`, `6a449ac`, `291a668` for one archive).
  CCC's compressed archive is the leaner artefact; its per-archive review cost is the problem.
- **`docs/CLEANUP.md`** describes a token-free `SessionStart` housekeeping script that prints only on a
  crossed threshold (`CLEANUP.md:8`), but `scripts/housekeeping-check.sh` does not exist in PCR's
  `scripts/` and `.claude/settings.json` has no SessionStart hook. Designed, never built.

## 4. Hooks, settings, scripts

- PCR `.claude/settings.json`: PreToolUse Bash → `guard-destructive-git.ts` (`ask`); PostToolUse
  Edit|Write → `post-edit-check.ts` (eslint/stylelint/tsc/related tests, exit 2 to feed back;
  `post-edit-check.ts:1-5`). CCC has **no** `.claude/settings.json`; the guard is PR G (port §8),
  post-edit deferred with a re-entry (port §6). Nothing new.
- PCR husky: gitleaks + lint-staged pre-commit, typecheck/changed-tests/knip pre-push, commit-msg
  check (`.husky/*`). CCC enforces commit format and the pre-push suite by prose only (`AGENTS.md:23`,
  `docs/GIT.md:39-40`). CCC's own re-entry — branch commit subjects drifting (`docs/GIT.md:399-401`) — is
  **not met**: in the last 200 commits only Dependabot subjects deviate.

## 5. Newer than the port

- **#133 report shape + its 4-dispatch trial** (above). The single most transferable change.
- **#125 effort by the work** (`PCR docs/SESSION-HANDOFF.md:82-89`): Sonnet agents pinned `medium`
  (the `sonnet` alias default since Claude Code 2.1.284); raise to `high` only for a named hard step;
  **changing effort mid-session discards the prompt cache, so change it only at a phase boundary**;
  `xhigh`/`max` unused until a trial. CCC §7 table (`docs/SESSION-HANDOFF.md:137-146`) lacks the cache
  point and pins implementer `high`.
- **#139 ten-session review**: median 170k, highest 215k, none past 250k, "a session now starts at about
  80k before any work" (`PCR docs/SESSION-HANDOFF.md:102`). The orchestrator-only rule
  (`PCR docs/SESSION-HANDOFF.md:65`) is what moved it: before it, 14 of 22 sessions passed 250k, one to
  724k (`research/54-handoff-threshold-review.md`, Plain-English answer).
- **research/55 stopping rule**: already in CCC (LOW-only prose fold → coordinator read, `AGENTS.md:141-146`).
- **research/67** (no RAG/LightRAG for agents) and **research/69** (no ticket board, no auto-pickup;
  readiness as a token-free script; classify each finding fix / push back / ask) — both reject tooling;
  CCC's implementer already has fix-or-evidence (`implementer.md:100-102`).

## Ranked candidates

| # | Idea | PCR evidence | CCC gap | Benefit | Cost | Rec |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Session start reads the newest entry + Next only; loading instructions live in each entry and are rewritten, not struck; research file no longer mandatory | `PROGRESS.md:90`; `docs/SESSION-HANDOFF.md:52`; `AGENTS.md:109-111` | `PROGRESS.md:510-512` (whole file + research); 13,856 B accreting loading block 509–648; ~63 KB/session measured | ~20–25k main-context tokens per session | S–M (SESSION-HANDOFF §5 + PROGRESS restructure; copilot-surrogate review) | adopt |
| 2 | Reviewer report shape: verdict + tally first; finding = severity, file:line, anchor, failure scenario, fix; clean areas and checks one line each; never restate/narrate; never cut evidence | `da-reviewer.md:30-36`; trial `PROGRESS-ARCHIVE.md:5915-5918` | `da-review.md:46-48`, `spec-grill.md:71-76` unordered; surrogate totals last (`copilot-surrogate.md:222-224`); reports 8.9–11.4 KB | ~half of each reviewer result in main context; faster triage | S | adopt |
| 3 | Main session orchestrates only; doc folds and archive moves go to `implementer` under doc-fixer's brief preconditions (stop if ids/files/settled choices/tie-break missing; never compute a number; read own diff as content) | `SESSION-HANDOFF.md:65`; research/54; `doc-fixer.md:13-23,39-45` | Decision 2 "Doc-only folds are the coordinator's" (`docs/research/01-pcr-workflow-port.md:397`); handoffs 208–236k for ~2 small PRs (`PROGRESS.md:215-477`) | Largest session-length lever on record | M | adapt |
| 4 | Archive as a mechanical move inside the handoff PR, with the archive out of copilot-surrogate's per-PR scope | `CLEANUP.md:37`; `AGENTS.md:64-65`; #152 | `SESSION-HANDOFF.md:123-124` own PR; 33 surrogate dispatches/10 sessions; 3 commits for one archive | One PR + one review round fewer per session | S | adapt |
| 5 | Long-output agents write the full report to the scratchpad and return path + tally + Needs-Alex ids | `chunk-briefer.md:49-64`; `doc-checker.md:50-69` | All in-band (`copilot-surrogate.md:85,251`) | Main context only takes what the coordinator acts on | S (caveat: global CLAUDE.md notes subagent writes can be refused — keep the in-band fallback) | adapt (surrogate, spec-grill) |
| 6 | Thin agent bodies and live-doc provenance (Keep one incident+date per rule; drop chains, sibling-repo comparisons, measurement asides) | research/61:38-66; PCR bodies 2.1–5.4 KB | CCC bodies 8.0–18.0 KB; 311 dates, 91 sibling mentions; `AGENTS.md` 149/150 (`:158`), provenance at `:39-44` | Per-dispatch tokens (plan usage) + budget headroom | M | adapt |
| 7 | Effort guidance: change effort only at phase boundaries (cache); trial implementer at `medium` | `SESSION-HANDOFF.md:82-89`; #125 | `docs/SESSION-HANDOFF.md:137-146`; `implementer.md:6` | Small; cache loss avoided | S | adapt |

## Considered and rejected

- `docs-budget.ts` / `check-claude-docs.ts` scripts: CCC's awk line and re-entry (`AGENTS.md:158-161`) already cover it; four agent files don't earn a validator.
- `post-edit-check` hook: port §6 deferral; no new evidence.
- `guard-destructive-git`: already PR G.
- `chunk-briefer`, `code-reader`, `lint-fixer`, `maths-reviewer`, `import-mapper`: port §1 reasons stand; Explore is the scout.
- `.claude/rules/` path-scoped rules: PCR has no evidence one fired (port §5.5); revisit only if #6 can't free budget.
- Husky commit-msg / pre-push hooks: CCC re-entry (`docs/GIT.md:399-401`) unmet; only Dependabot subjects deviate.
- SessionStart housekeeping hook: designed in PCR `CLEANUP.md:8`, never built there.
- Verbatim 490 KB archive: CCC's compressed `docs/history/SESSIONS.md` is leaner; only #4's packaging is borrowed.
- RAG/Obsidian (research/67) and ticket board/auto-pickup (research/69): PCR rejected both for agents.
- AGENTS.md end-of-file recap (PCR `AGENTS.md:118-129`): ~10 lines against a 149/150 budget.
- Stopping rule (research/55): already in CCC (`AGENTS.md:141-146`).
