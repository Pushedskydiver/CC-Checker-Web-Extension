# MOE → CCC workflow research (2 October 2026)

Read-only. MOE = `/Users/alexclapperton/Desktop/alex/@moe` (main at `1aa1619`, plus open PR #122 on
`origin/docs/s9-review-harvests`, cited as "#122 branch"). CCC = this repo. CCC figures are `main` unless
stated; the working checkout was on `docs/CC-005-archive-session-13` (`eb4683f`) during the read, where
`PROGRESS.md` is 52,672 B against `main`'s 56,526 B.

## Measurements

| Item | MOE | CCC |
| --- | --- | --- |
| `AGENTS.md` | 12,237 B | 13,383 B |
| `CLAUDE.md` | 207 B (pure stub) | 1,003 B |
| Agent bodies | da-review 3,409; spec-grill 2,405; copilot-surrogate 5,792; implementer 9,527; doc-fixer 5,824 | copilot-surrogate 17,950; da-review 14,028; spec-grill 12,131; implementer 7,969 |
| `PROGRESS.md` | 37,032 B, 369 lines | 56,526 B (main), 648 lines |
| What the session-start prompt reads | newest entry + its loading block only: 7,876 B (`awk '/^## Earlier/{exit} 1'`, #122 branch) | whole file (`docs/SESSION-HANDOFF.md:61`) |
| CCC `PROGRESS.md` parts (branch copy) | — | stacked "Updated" paragraphs `:8-70` 4,898 B; approved CC-004 plan `:123-191` 6,721 B; newest entry `:192-244` 3,638 B; detail band `:192-508` 21,964 B; loading block `:509-643` 13,492 B with 14 `~~` spans |
| Handoff/archive commits | direct to `main`, no PR (`docs/SESSION-HANDOFF.md:45`, `docs/GIT.md:25`) | 22 of 34 first-parent `main` commits since 20 Sep are "Close Session"/"Archive Session" PRs (`git log --first-parent`) |
| Scripts/CI enforcing prose rules | `check-agent-frontmatter.ts`, `check-rulebook.ts`, `guard-fly.ts` (+ tests), `pr-title-check.yml`, husky lint-staged | `scripts/package.mjs` only; `ci.yml` runs lint/unit/build/e2e |

## Ranked candidates

### 1. Load only the newest entry; loading instructions live per entry (adopt, M)

- MOE: entry shape `## Next workstreams (after Session N)` → `## Earlier: Session N`, each with its own
  `### Session N+1 loading instructions` (`docs/SESSION-HANDOFF.md:78-104`), deleted when the entry archives
  (`:157-158` area, §10). An entry is never edited after handoff except one dated `Update (<date>):` line
  (`:52`, `:104`). #122 branch adds the prompt's `awk '/^## Earlier/{exit} 1'` so only the newest entry is read;
  measured saving ~10–12k tokens/load (Sessions 65, 66, 69, 70, 72), with §10's archive check run by two
  mechanical commands instead. Example block: `PROGRESS.md:69-94` (26 lines, numbered decision branches with `[ALEX]` tags, carry-overs as `git show` pointers).
- CCC gap: prompt reads the whole file (`docs/SESSION-HANDOFF.md:61`); one shared mutable loading block at the
  foot (`PROGRESS.md:509-643`, 13.5 KB) that each session edits in place with strikethroughs
  (`docs/SESSION-HANDOFF.md:68`, `:112`); 13 dated "Updated …" paragraphs stack under one heading (`PROGRESS.md:8-70`).
- Benefit: CCC load ≈ 56.5 KB ≈ 23–27k tokens at its measured 2.1–2.5 B/token; a newest-entry read on MOE's shape would be ~8–15 KB. Roughly 15–20k tokens off every session start, and no strikethrough archaeology at load.
- Cost: M — restructure `PROGRESS.md`, rewrite `docs/SESSION-HANDOFF.md` §3–§6, move the CC-004 plan to `docs/research/` or `docs/history/`.

### 2. Handoff and archive without their own PRs (adapt, S doc / Alex decision)

- MOE: entry "committed direct to `main` — no branch, no PR, since it's session state, not architecturally reviewed content" (`docs/SESSION-HANDOFF.md:45`); exception when it rides an open PR. Archive is part of the same flow (`45699bc`, no PR). chief-clancy reached the same rule (`collaboration-protocols/proposals.md:578-592`, δ.4).
- CCC gap: "An archive is its own small PR" (`docs/SESSION-HANDOFF.md:124-125`); `copilot-surrogate` is triggered by `PROGRESS.md` (`.claude/agents/copilot-surrogate.md:37`); 22/34 recent `main` commits are these PRs, each a CI run, Alex merge and often a surrogate read of a 56 KB file.
- Constraint: CCC branch protection requires a PR (`AGENTS.md:54`), `enforce_admins` off (`AGENTS.md:58`); the auto-mode classifier can block pushes to `main` (global CLAUDE.md). So the full MOE rule needs Alex. The no-decision half: fold the archive into the handoff PR (one PR, not two) and exempt state-only `PROGRESS.md` diffs from the surrogate.
- Benefit: large (time, CI, reviewer tokens). Cost: S.

### 3. Reviewers write the full report to a file, return counts + one line per finding (adopt, S)

- MOE #122 branch `docs/DEVELOPMENT.md` (Review Gate): R2 hand-backs ~3k together vs ~9k for R1. Mechanics: review agents have no Write tool, so they write via Bash to an **absolute path in the primary checkout** (a relative path dies with the worktree); if refused, write in parts; last resort, hand back in full and the coordinator extracts the `SubagentHandback` input from the subagent jsonl (jq given). The brief must say so explicitly because the harness default says "don't write report files". #122 also patches `da-review.md:25` / `DA-REVIEW.md:119` siblings that contradicted it.
- CCC gap: all three reviewers "Return findings as the tool result, in-chat" (`.claude/agents/da-review.md:159`, `copilot-surrogate.md:251`, `spec-grill.md:157`); CCC's own coordinator already does this ad hoc (this brief), but the agent files contradict it.
- Benefit: ~3k tokens saved per reviewer per round in the coordinator's context. Cost: S (three agent lines + one DEVELOPMENT bullet).

### 4. Confirm rounds scoped to the fold's commit range, written into the agent files (adopt, S)

- MOE: `da-review.md:21` (Round-2 check: review `git diff <range>`, confirm/disprove numbered findings, grep repo for each corrected claim's wording, "Don't re-walk the rest of the PR"); `copilot-surrogate.md:16-17` (range's files only; `docs/history/` claim-checked only on added lines); `docs/DEVELOPMENT.md:75` (fold committed as its own commits, dispatch names `<last-reviewed-sha>..HEAD`).
- CCC gap: no range mode in any agent file (grep for `range`/`Round-2` in `.claude/agents/`: 0 hits); `docs/DEVELOPMENT.md:283-293` says when a confirm round runs, not what it reads. The surrogate re-reads every touched file of the whole PR at HEAD each round.
- Benefit: cheaper confirm rounds (Fable ~4 points per reviewer, `docs/SESSION-HANDOFF.md:38`). Cost: S.

### 5. Hard length caps on agent hand-backs (adopt, S)

- MOE: implementer "Return only, in under 30 lines" (`implementer.md:39-47`); doc-fixer "under 25 lines" (`doc-fixer.md:42-50`).
- CCC gap: implementer report has 8 sections incl. a mutation table, no cap (`.claude/agents/implementer.md:104-121`); reviewers have a finding shape but no cap on summary prose.
- Benefit: tokens per dispatch, predictable triage. Cost: S.

### 6. Lessons carry a destination tag and a harvest deadline (adopt, S)

- MOE: each lesson ends `→ RATIONALIZATIONS.md §…`, `→ REVIEW-PATTERNS.md §…`, `→ memory` or `→ none`; harvest due by the time its entry archives (`docs/SESSION-HANDOFF.md:119-124`). #122 branch adds: unharvested at archive → its own small PR, not carried again (WWWW was carried 11 handoffs, IIIII 6).
- CCC gap: "Major novel patterns" have no destination (`docs/SESSION-HANDOFF.md:104-106`); rule docs instead cite archived entries ("Session 14 pattern 1", `:69`; "Session 13 pattern 4, in `git show bf9f8d1:PROGRESS.md`", `:135`), i.e. rules depend on archived state.
- Benefit: quality — lessons reach the rule docs instead of being re-read from git history. Cost: S.

### 7. Two standing lines in every fold brief (adopt, S)

- MOE #122 branch `docs/DEVELOPMENT.md`: (1) sibling sweep — grep the whole repo (excluding `docs/history/`) for each corrected claim's wording, and for a new rule grep for the instruction it contradicts; recurred 4× in Sessions 60–69; (2) fold text is new claim text — each replacement sentence checked at source, hedges keep qualifiers; 3×. Also applies to build and review-dispatch briefs.
- CCC gap: absent from `docs/DEVELOPMENT.md` / `docs/DA-REVIEW.md` (grep `sibling`: 0 hits); the surrogate's recompute rule (`copilot-surrogate.md:243-247`) covers numbers only.
- Cost: S.

### 8. spec-grill must not "ask the caller" (adopt, S)

- MOE: "If ambiguous, run as discovery, state that assumption at the top… you cannot pause mid-run to ask" (`spec-grill.md:17`).
- CCC gap: "If ambiguous, ask the caller before proceeding" (`.claude/agents/spec-grill.md:70-71`) — a subagent cannot.
- Cost: S, one sentence. Quality fix.

### 9. Commit-subject format checked in CI (adapt, S)

- MOE: `.github/workflows/pr-title-check.yml` validates the gitmoji+type prefix, exempts `dependabot[bot]`, prints the fix command.
- CCC gap: format is prose-only (`AGENTS.md:31-44`), with recorded drift (five gitmoji-less commits, `AGENTS.md:41-42`). Rebase is the default merge (`AGENTS.md:58-59`), so every branch commit's subject lands on `main` — check each commit subject in the PR range against `^(feat|fix|…): CC-\d+ - <gitmoji> `, not just the title.
- Note: a new job is not required by branch protection unless Alex adds it. Cost: S.

### 10. Move incident narrative out of agent bodies (adapt, M)

- MOE: #116 (`2796725`) moved incident narratives from `docs/DEVELOPMENT.md` into `docs/history/DEVELOPMENT-EVIDENCE.md`, leaving each rule plus a one-line pointer; #110, #118 the same for BUILD_PLAN/GLOSSARY. MOE agent bodies 2.4–9.5 KB.
- CCC gap: agent bodies 8.0–18.0 KB, loaded on every dispatch; e.g. `spec-grill.md:12-47` ("Why this agent was ported", 2,769 B), `copilot-surrogate.md:13-25` ("Why this agent matters"), `da-review.md:14-26`. The repo-tuned checks (claim buckets, falsifier greps) should stay — they are the value.
- Benefit: ~1–2k tokens per dispatch. Cost: M (both reviews, sibling cites).

### 11. Agent-frontmatter check in CI (adapt later, M)

- MOE: `scripts/check-agent-frontmatter.ts` (zod strict schema, model enum without `inherit`, `name` = filename, unknown keys fail) + tests, run in CI (`.github/workflows/ci.yml:66`).
- CCC gap: absent; CCC's `CLAUDE.md` says frontmatter is "the authority" for model/effort, enforced by nothing.
- Cost: M, and needs `vitest.config.ts`'s include widened — which PR G already plans. Ride with G or skip.

## Considered and rejected

- `doc-fixer` agent — CCC already declined it with a re-entry condition (`docs/research/01-pcr-workflow-port.md:105`).
- `.claude/rules/` path-scoped rules — declined in `01-pcr-workflow-port.md` §5 item 5; MOE has only two rules and no firing evidence.
- PreToolUse guard hook — already planned as CC-005 PR G (`01-pcr-workflow-port.md` §6). Borrow from MOE's `scripts/guard-fly.ts:1-30` (fail open, regex leaning to "ask") and #122's headless `claude -p --output-format json` smoke test for a hook PR.
- `check-rulebook` (CLAUDE.md stub check) — CCC's `CLAUDE.md` deliberately carries Claude-only lines; 1 KB.
- MOE's `model: opus` pins — CCC chose Fable deliberately (memory, 12 Sep); a benchmark is already carried.
- husky + lint-staged — the pre-push suite takes seconds; #9 covers the format rule.
- `docs/decisions/` ADR folder — CCC's `docs/research/` + `SESSIONS.md` §Retired sections cover it at this scale.
- chief-clancy HITL push notifications / auto-merge criteria (`proposals.md:306-356`) — Alex merges; already "Not ported" (`docs/DEVELOPMENT.md:432-433`).
- MOE Session-data refinements (fire-point figure, no tool-schema field) — marginal; fold into #1 if wanted.
