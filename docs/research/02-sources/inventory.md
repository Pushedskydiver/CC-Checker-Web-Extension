_Recorded verbatim from the Session 27 inventory agent (Opus 5.5). Scripts it cites as `scratchpad/inv/*` are in `inventory-scripts/`; their derived JSON and outputs were not kept._

# Token inventory, research 02 §Inventory brief (rows A to G)

Measured 7 October 2026, 08:20–08:40 BST. Files are measured at commit `ae49392`, never the working tree. The
two files outside git (`~/.claude/CLAUDE.md`, the auto-memory directory) are measured as they were at 08:39 BST.
Transcripts are the 23 main-session jsonl files under
`~/.claude/projects/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension/`
(`$T` below), with the live session `12ef5373` excluded, plus their sidechains at `$T/<uuid>/subagents/agent-*.jsonl`
and `.meta.json`. The workflow sidechains under `subagents/workflows/` (Sessions 1–4, the 139-agent audit) are left out.

Scripts are in `$S = /private/tmp/claude-501/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension/12ef5373-df28-4bf8-ab29-9b7a1b668267/scratchpad/inv/`.
Every figure below was produced twice. `agents.py` was run three times, and the second and third outputs were
compared with `cmp` (IDENTICAL). `fold2.py` and `dup.py` were compared by md5 across two runs, and the rest by
eye on a second run.

**The context meter.** It is `usage.input_tokens + usage.cache_read_input_tokens + usage.cache_creation_input_tokens`
of a main-thread assistant message, deduplicated by `message.id`: one API call can be logged as several records.
Each `get_usage` `tokensUsed` reading in Sessions 14–26 matches the meter of the turn that called it to within
0–719 tokens. For example, Session 26 recorded 81,299 and its T4 meter reads 81,299; Session 21 recorded 143,653
against a meter of 142,934. `output_tokens` is not used for context.

**The bytes-per-token ratio** used for every conversion below is **2.24 file bytes per token**. It was measured
in Session 26 (`d2e18d80`):

- T2 read `PROGRESS.md` lines 613–772 plus `docs/SESSION-HANDOFF.md`, 16,907 + 10,993 = 27,900 B at `67fde5d`.
  The next turn's meter rose by 12,947 tokens, less T2's own 223 output tokens, so 2.19 B/token.
- T5 read `PROGRESS.md` lines 1–612, 46,496 B. The meter rose by 20,686 tokens, less 254 output, so 2.28 B/token.
- Together: 74,396 B for 33,156 tokens.

To reproduce:

- `python3 $S/reads.py d2e18d80 10` gives the per-turn deltas.
- `git show 67fde5d:PROGRESS.md | sed -n 1,612p | wc -c` gives 46,496.
- `… | sed -n '613,$p' | wc -c` gives 16,907.

The reviewer replies that landed in the main thread came out at 2.09 B/token (median, Sessions 1–18) and 2.74
(Sessions 19–26), measured as landed bytes over the context delta (row C).

---

## A. The newest entry, the loading block, and the "Next workstreams" block

Command: `command bash $S/blocks.sh ae49392`. It finds each block by its heading (`## Next workstreams`, the first
two `## Session N`, `## Next session loading instructions`, `## Session archive`). The "Updated" stack runs from the
first `^Updated ` line to the line before the first `^1. **`.

| Block at `ae49392`                                       | Lines   | Bytes      | ≈ tokens @ 2.24 |
| -------------------------------------------------------- | ------- | ---------- | --------------- |
| Whole `PROGRESS.md`                                      | 1–789   | **65,930** | 29,433          |
| "Next workstreams" block                                 | 6–266   | 22,292     | 9,952           |
| – its "Updated" stack (28 paragraphs)                    | 8–165   | 12,202     | 5,447           |
| – the newest "Updated" paragraph only                    | 8–11    | 466        | 208             |
| – numbered workstream list                               | 166–197 | 3,329      |                 |
| – §The approved plan (CC-004, paused)                    | 198–266 | 6,721      |                 |
| Newest entry (Session 26)                                | 267–327 | **4,580**  | 2,045           |
| Entries band (6 entries, Sessions 21–26)                 | 267–630 | 26,103     |                 |
| Loading block                                            | 631–784 | **16,791** | 7,496           |
| – step 7, the decision branches (H's share)              | 713–784 | 8,000      | 3,571           |
| Archive pointer                                          | 785–789 | 568        |                 |

The step-7 figure comes from `awk` on the step headings, then `sed -n 713,784p | wc -c`.

**Cross-check at `eb6099a`** (`command bash $S/blocks.sh eb6099a`): whole 60,098, block 19,961, newest entry
4,172 and loading block 15,863, all equal to research 02's figures. The "Updated" stack measures **9,871 B** here
against research 02 §Item detail's **9,911 B**, which is 40 B apart. Step 7 at `ae49392` is 8,000 B against
research 02's 7,742 B at `eb6099a`; the file grew.

**What a session reads now.** Loading step 1 says "this file top to bottom". The transcripts show the whole of
`PROGRESS.md` opened with the Read tool in all 8 of Sessions 19–26, in two pieces in Sessions 25 and 26 (for
example offset 613, then limit 612). Source: the Read `tool_use` inputs in each main jsonl.

**A's per-start saving.** Research 02 reads it two ways, so both are given:

1. Row A as worded ("only the newest entry and its own loading block"): the reads go from 65,930 B to
   4,580 + 16,791 = 21,371 B. **That saves 44,559 B ≈ 19.9k tokens per start.** It sits inside research 02's
   "~17–22k".
2. §Item detail as worded (both standing blocks stay read, and the stack collapses to one paragraph): the reads are
   65,930 − 12,202 + 466 − 21,523 (the five older entries) = 32,671 B. **That saves 33,259 B ≈ 14.8k tokens.**

H's share is counted once. The 8,000 B of step 7 stays in both figures above, and whatever H closes there
(research 02 row H says ~5 KB) is H's saving, not A's.

**`get_usage` rows** (copied from loading step 1 at `ae49392`, each checked against its transcript):

| Session | Recorded start (late) | First-turn meter (true start) | After loading reads | Loading-read cost: from the recorded start / from the first turn |
| ------- | --------------------- | ----------------------------- | ------------------- | ---------------------------------------------------------------- |
| 20      | 78,058 (MCP 19,720)   | 64,962                        | —                   | —                                                                |
| 21      | 75,131 (19,855)       | 65,382                        | —                   | —                                                                |
| 22      | 83,255 (19,855)       | 65,448                        | —                   | —                                                                |
| 23      | 75,948 (19,855)       | 65,451                        | 128,962             | 53,014 / 63,511                                                  |
| 24      | 75,933 (19,855)       | 65,545                        | 121,940             | 46,007 / 56,395                                                  |
| 25      | 80,518 (19,855)       | 65,562                        | 144,147             | 63,629 / 78,585 (~20k of it a stale `main` read, per `PROGRESS.md`) |
| 26      | 81,299 (19,846)       | 66,765                        | 116,948             | 35,649 / 50,183                                                  |

Source: the `get_usage` `tool_result` in each main jsonl, and the meter of each session's first assistant message
(the extraction script is inline in this run's transcript: regex `tokensUsed[^0-9]{0,6}(\d+)` on the result, and
the first deduplicated assistant usage). The first-turn meter across Sessions 14–26 is 60,276–66,765, so the
recorded "starts" were taken 9.7k to 17.8k tokens late. Research 02 calls Session 23's figure "53k"; that is
measured from the late start, and from the first turn it is 63.5k.

---

## B. Session PRs and `copilot-surrogate` dispatches

Command: `python3 $S/b.py`. PRs opened are the `gh pr create --title "…"` calls in each main jsonl. An archive PR
matches `Archive Session`. A handoff PR matches
`Close Session|Close out Session|Hand off the|hand off to|resume at|Session \d+ handoff`, and Session 16's PR D
(`docs/SESSION-HANDOFF.md`) is excluded by hand. The dispatch count is main-thread `Agent` calls with
`subagent_type: copilot-surrogate`. The archive and handoff split is read by hand from the dispatch descriptions
(`python3 $S/b.py | grep '^    '`).

| Session | Transcript | PRs opened | Archive PRs | Handoff PRs | Surrogate dispatches | Of those, on an archive or handoff PR (confirm rounds included)      |
| ------- | ---------- | ---------- | ----------- | ----------- | -------------------- | --------------------------------------------------------------------- |
| 1–4     | `2d76863c` | 8          | 0           | 2           | 2                    | —                                                                     |
| 5       | `7c8da1ea` | 5          | 0           | 1           | 4                    | —                                                                     |
| 6       | `2359a1d8` | 11         | 1           | 5           | 18                   | —                                                                     |
| 7       | `b993b5b2` | 3          | 0           | 2           | 2                    | —                                                                     |
| 8       | `3704c181` | 2          | 1           | 0           | 5                    | —                                                                     |
| 9       | `2817dc88` | 2          | 1           | 0           | 5                    | —                                                                     |
| 10      | `36b23352` | 3          | 1           | 1           | 6                    | —                                                                     |
| 11      | `d95d2d49` | 2          | 0           | 1           | 0                    | —                                                                     |
| 12      | `d9ee3c46` | 1          | 0           | 1           | 1                    | —                                                                     |
| 13      | `23cd60eb` | 2          | 1           | 1           | 3                    | —                                                                     |
| 14      | `451bf13c` | 3          | 1           | 1           | 4                    | 2, plus 1 mixed ("both folds": #80 and PR A)                          |
| 15      | `baadc845` | 3          | 1           | 1           | 5                    | 2, plus 1 ambiguous ("Confirm round + protection review")             |
| 16      | `da7ca3eb` | 3          | 1           | 1           | 3                    | 2, plus 1 mixed ("PR D + archive confirm")                            |
| 17      | `8a9f262b` | 3          | 1           | 1           | 2                    | 1, plus 1 mixed ("C + archive confirm")                               |
| 18      | `458fbbbc` | 2          | 1           | 1           | 4                    | 4                                                                     |
| 19      | `f460fe14` | 3          | 1           | 1           | 4                    | 3                                                                     |
| 20      | `e336eae4` | 2          | 0           | 1           | 3                    | 2                                                                     |
| 21      | `b3a779e5` | 2          | 1           | 1           | 4                    | 4                                                                     |
| 22      | `78c45389` | 2          | 1           | 1           | 2                    | 2                                                                     |
| 23      | `1b2340c7` | 2          | 1           | 1           | 3                    | 3                                                                     |
| 24      | `08d27539` | 2          | 1           | 1           | 2                    | 2                                                                     |
| 25      | `92ebd181` | 3          | 1           | 1           | 2                    | 2 (#112, #114)                                                        |
| 26      | `d2e18d80` | 2          | 1           | 1           | 5                    | 3                                                                     |
| **14–26** |          | **32**     | **12**      | **13**      | **43**               | **32, plus 4 mixed or ambiguous**                                     |

The transcripts map to Session numbers by their dates, the PR numbers in `pr-link` records, and the session-number
titles of the PRs they opened. These agree with the dated headlines in `docs/history/SESSIONS.md` and the
`PROGRESS.md` headings.

**The "33 runs in 10 sessions" count holds exactly.** In Sessions 9–18, the ten main sessions before Session 19
(when the PCR thread measured), the main-thread `copilot-surrogate` dispatches are 5+6+0+1+3+4+5+3+2+4 = **33**.
The source's other three figures also re-run exactly: `da-review` 10, `spec-grill` 3, `implementer` 2 (source:
`02-sources/pcr.md:32`). Over the latest ten sessions (17–26) the surrogate count is 31.

**Cost of one surrogate round in the coordinator** (Sessions 19–26):

- The dispatch turn adds a median **1,400** tokens to the next turn's meter (n=24 turns that dispatched exactly one
  surrogate; min 1,059, max 3,356).
- The digest adds a median **1,884** (row C).
- So one round costs ≈3.3k tokens, plus a PR and a CI run when it is a separate archive PR.
- Archive reviews and their confirm rounds in Sessions 18–26: 11 dispatches over 8 archive PRs.

---

## C. Reviewer reply sizes, and the context delta across a digest

Commands: `python3 $S/agents.py $S/agents.json`, then `python3 $S/stats.py reply`.

- **The reply** is the final report the sidechain returned: the `SubagentHandback` `message` where one was called,
  otherwise the text of the sidechain's last assistant message. It is measured in bytes.
- **"Landed"** counts the bytes of every main-thread `user` record or `queued_command` attachment carrying that
  agent's id or `toolUseId`, launch notice excluded. It includes the harness's hand-back frame and the
  task-notification.
- **Excluded:** 8 runs whose final text is the 62-byte "You've hit your session limit…" (Sessions 5 and 6), one
  stopped run (`ac2ebedb`, Session 15, post-merge review stopped), and one placeholder (`ae828e6d`).

**The reply caps change the picture.** From Session 19 on, every reviewer dispatch prompt caps the reply
("at most 400 words", "capped at ~1,500 characters"; `grep` of the `Agent` `prompt` inputs). Before Session 19,
none does. So the figures are split at Session 19.

| Agent                         | Sessions 1–18, reply B (n; min / median / max)   | Sessions 19–26, reply B             | Landed in main, median (1–18 / 19–26) |
| ----------------------------- | ------------------------------------------------ | ----------------------------------- | ------------------------------------- |
| `copilot-surrogate`           | n=60; 4,004 / **10,381** / 20,479                | n=25; 1,020 / **2,776** / 4,044     | 12,014 / 4,849                        |
| `da-review`                   | n=24; 4,205 / **8,962** / 14,883                 | none dispatched                     | 9,860 / —                             |
| `spec-grill`                  | n=8; 8,045 / **11,196** / 18,444                 | n=2; 1,564 / **1,980** / 2,395      | 12,724 / 4,135                        |
| verifier (`general-purpose`)  | —                                                | n=1; 984                            | — / 3,141                             |
| **All reviewers**             | n=92; 4,004 / **10,295** / 20,479                | n=28; 984 / **2,577** / 4,044       |                                       |

**The digest delta** is the meter of the first main-thread turn after the reply landed (delta 1), or of the second
such turn (delta 2, which includes the coordinator's own digest turn), minus the meter of the last turn before
it. Cases where two replies landed between the same pair of turns are dropped. Command: the inline
delta-2 script in this run, over `$S/agents.json` field `ctx_after2`.

| Sessions | n  | Delta 1 (tokens), min / median / max | Delta 2, min / median / max |
| -------- | -- | ------------------------------------ | --------------------------- |
| 1–18     | 89 | −4,251 / **5,399** / 9,984           | −3,254 / 7,606 / 17,213     |
| 19–26    | 28 | 893 / **1,845** / 7,384              | 2,089 / 3,362 / 8,616       |

The one negative value is Session 8 `a4086f3b` (197,660 → 193,409): the meter fell.

**Contradiction with research 02 row C.** The row's evidence ("reviewer replies 8.9–11.4 KB") holds only up to
Session 18; the S1–18 medians are 8,962 (`da-review`) and 10,381 (`copilot-surrogate`). Since Session 19 the
dispatch prompts cap replies, and the median is **2,577 B** with a digest delta of **~1.8k tokens**. So most of
C's "~half of reviewer bytes" saving has already happened, done ad hoc in the prompts. C would make it the briefs'
contract rather than a fresh saving. Full reports now go to scratchpad files. Any coordinator read-back of a report file is not in delta 1 and is
UNMEASURED per digest: telling it apart from other reads needs a per-file attribution I did not build.

---

## D. Turns per dispatch, and mandatory-reading bytes

**Turns** are the distinct assistant `message.id`s in each sidechain jsonl, with the same exclusions as row C.
Commands: `python3 $S/agents.py $S/agents2.json`, then the inline turn-list script.

| Agent type                                | n  | Min | Median | p90 | Max | Notes                                                             |
| ----------------------------------------- | -- | --- | ------ | --- | --- | ----------------------------------------------------------------- |
| `copilot-surrogate`                       | 85 | 5   | **9**  | 13  | 30  | S19–26 only: n=25, 5 / 8 / 11. The 30 is Session 9 `ad6754b5`     |
| `da-review`                               | 24 | 6   | **10** | 13  | 19  | none since Session 17                                             |
| `spec-grill`                              | 10 | 8   | **13** | 53  | 63  | 53 and 63 are Session 5 verify runs dispatched with `model: opus`; without them n=8, 8 / 12.5 / 16 |
| `implementer`                             | 6  | 9   | **14** | 29  | 45  | 45 is PR C (Session 17); the two doc folds (S25, S26) took 13 each |
| verifier (`general-purpose`, Session 24)  | 1  | 13  | 13     |     | 13  |                                                                   |
| `general-purpose` implementer precursors (S10, S15) | 2 | 25 | 27 | | 29 |                                                           |

**Mandatory reading per dispatch at `ae49392`**: what each brief says to read before working, excluding
conditionals. Commands:

- `python3 $S/sec.py ae49392 <file> "<heading>"` measures a section from its heading to the next heading of the
  same or higher level; `--intro` stops at the next heading of any level.
- `git show ae49392:<file> | wc -c` measures whole files.

The hierarchy every subagent auto-loads is 17,556 B: `~/.claude/CLAUDE.md` 3,170 (now) + `CLAUDE.md` 1,003 +
`AGENTS.md` 13,383. With `MEMORY.md` it is 20,424 B; this run's own context carried `MEMORY.md`, so subagents load
it too.

| Agent               | Brief  | Mandatory docs (sections at `ae49392`)                                                                                                                                                                                                                        | Docs total | Brief + docs | + hierarchy (17,556) |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------ | -------------------- |
| `da-review`         | 14,028 | DA-REVIEW §Red flags 2,263 + §Approval standard 854 + §Required disciplines intro 3,041 + the six always-on 6,777 (1,390 + 1,915 + 2,103 + 490 + 507 + 372) + §Severity labels 2,113 + REVIEW-PATTERNS whole 18,144 (step 5 "consult")                        | 33,192     | 47,220       | **64,776**           |
| `copilot-surrogate` | 17,950 | DA-REVIEW §Claim-extraction 1,915 + §Cross-context 3,296 + §Verification-claim 1,390 + SELF-REVIEW §Before you write the word verified 1,962                                                                                                                     | 8,563      | 26,513       | **44,069**, plus every touched file in full (a handoff PR adds `PROGRESS.md`, 65,930) |
| `spec-grill`        | 12,131 | DEVELOPMENT §Verification rounds, which contains §Scale the fan-out (5,866) + REVIEW-PATTERNS whole 18,144                                                                                                                                                     | 24,010     | 36,141       | **53,697**           |
| `implementer`       | 7,969  | `docs/GIT.md` whole before the first commit, 29,829; every run commits. Conditional: CONVENTIONS 28,766 (`src/**`), TESTING 34,642 (a test), ARCHITECTURE 34,818 (`public/app`)                                                                                   | 29,829     | 37,798       | **55,354**; a src-plus-test item comes to 118,762 |

These agree with the self-audit's per-dispatch table to within 238 B per agent (`da-review` 64,600 against 64,776;
`copilot-surrogate` 43,899 against 44,069; `spec-grill` 53,459 against 53,697). The files and the hierarchy grew a
little.

**Measured first-turn context of each sidechain** (system prompt, tools, hierarchy, brief and dispatch prompt,
before any read), medians: `copilot-surrogate` 19,598 tokens (S19–26, n=25), `da-review` 15,505 (n=24, all ≤
Session 17), `spec-grill` 17,651 (S19–26, n=2), `implementer` 17,086 (n=6). The six Opus or Sonnet `general-purpose`
runs (S10, S15, S19 ×3, S24) start at 46,867–50,960. Source: `first_ctx` in `$S/agents2.json`.

**Docs actually touched in tool calls** (for "which reading goes on demand"). This counts any `tool_use` input that
names the file (Read, grep, cat), which is broader than a whole read:

- `da-review` (n=26): DA-REVIEW 26, REVIEW-PATTERNS 23, RATIONALIZATIONS 22, CONVENTIONS 21.
- `copilot-surrogate` (n=88): DA-REVIEW 64, SELF-REVIEW 58, REVIEW-PATTERNS 32.
- `spec-grill` (n=14): DEVELOPMENT 9, REVIEW-PATTERNS 7.
- `implementer` (n=6): GIT 6.

---

## E. The coordinator's context spent on folds, and the `implementer`'s start cost

**Fold spans.** Command: `python3 $S/fold2.py`.

- A span starts at the first main-thread turn after the latest reviewer reply landed. Reviewers here are
  `da-review`, `copilot-surrogate`, `spec-grill` and a `general-purpose` verifier, first landing per agent only.
- It ends at the turn after the one that issued a `git commit` whose subject contains `📝 Fold`. The coordinator
  edits through Bash (python and `sed -i`), not the Edit tool, so commits are the reliable marker.
- Growth is the meter at the end minus the meter at the start.
- Fold size is the matching commit in `git log ae49392`, measured three ways: `git show --format= --word-diff=porcelain -U0`
  (bytes of added and removed words, and hunks), and `--numstat` (changed lines).

**Results.** There are 47 fold spans in Sessions 6–26; 45 matched a commit at `ae49392` (two Session 9 commits did
not).

- Growth per fold, all 47: min 858, **median 3,792**, max 10,274 tokens; 210,894 in total.
- Sessions 19–26, n=18: min 1,698, **median 2,942**, max 7,956.

**Fold share of the session's peak meter** ("fold growth / final"):

| Session    | 12   | 13   | 14   | 15   | 16   | 17   | 18   | 19   | 20   | 21   | 22   | 23   | 24   | 25   | 26   |
| ---------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Fold share | 6.7% | 7.6% | 5.4% | 5.3% | 3.8% | 8.8% | 4.7% | 6.2% | 6.6% | 7.4% | 3.2% | 4.2% | 3.6% | 2.9% | 1.0% |

(Session 6 2.9%, 8 1.4%, 9 3.6%, 10 3.2%. Folds committed under a subject without "Fold" are missed throughout, for example Session 26's
"Correct §Item F's /context premise". The shares are therefore lower bounds.)

**Growth against fold size** (n=45):

- By hunks: least squares gives growth = **1,874 + 576 × hunks** (r = 0.69).
- By changed lines: growth = 3,240 + 63.6 × lines (r = 0.52).
- By added bytes: r = 0.10, so bytes are not a usable threshold.
- Buckets by hunk count: 1–3 hunks, median 2,612 (n=20); 4–6, median 5,463 (n=16); 7 or more, median 6,276 (n=9).

**Delegated folds: the coordinator's side.**

- **Session 26, R2 fold (`implementer` `a9d016b7`, `28688c7`, +52/−39 lines, 21 hunks, 2,053 B of added words):**
  from T24 (second review landed, 142,207) to T28 (dispatching the confirm round, 147,539) is **5,332 tokens**.
  That is 1,373 of digest and brief, 1,856 for the dispatch turn (a 3,012 B prompt), 1,078 when the reply landed,
  and 1,025 of checking. Command: `python3 $S/timeline.py d2e18d80`.
- **Session 25, R1 fold (`a3bad9fd`, `319c414`, +168/−23 lines, 8 hunks, 17,310 B of added words):** the dispatch
  turn added 3,234 (T18 → T19, a 5,959 B prompt) and the landing 1,182 (T24 → T25). The checking after it (T25 →
  T28, 2,650) is mixed with the Session 19 archive's suite run, and the brief drafting (T15–T18) is interleaved
  with an AskUserQuestion. So about 7.1k, of which **brief drafting is UNMEASURED**: it cannot be separated in the
  transcript.

**The `implementer`'s start cost** (n=6, all its runs):

| Measure                                          | Min    | Median     | Max     | Doc folds (S25 / S26) |
| ------------------------------------------------ | ------ | ---------- | ------- | --------------------- |
| First-turn context                               | 15,663 | **17,086** | 18,094  | 18,094 / 16,703       |
| Context at its first file edit                   | 29,321 | **47,148** | 69,375  | 47,668 / 53,748       |
| Whole run (`<subagent_tokens>` in the notification) | 36,763 | —        | 130,889 | 68,116 / 68,965       |

The first-edit row is the first Edit or Write, or a Bash call with `sed -i` or `.write(`. Source: the inline
implementer script in this run.

**Against research 02 §Item detail E**, which estimated the reading before the first commit at about 25k tokens
(55,330 B): the measured growth from first turn to first edit on the two doc folds is **29,574** (S25) and
**37,045** (S26) tokens. The measured growth is 18% and 48% above the estimate.

### Proposed threshold for Decision 6

Delegate when what the coordinator would spend folding is more than what it spends delegating:

- The coordinator's side of delegating, measured once cleanly, is 5,332 tokens (Session 26). Session 25 gives
  ~7.1k with drafting not separable.
- Break-even on the hunk fit: 1,874 + 576·h = 5,332 gives **h = 6.0**. Against 7,066 it gives h = 9.0.
- On the line fit: 3,240 + 63.6·L = 5,332 gives **L ≈ 33 changed lines**.

**Proposal: a doc fold goes to `implementer` when it is 7 or more hunks, or 33 or more changed lines
(`git diff --numstat`, insertions plus deletions); otherwise the coordinator folds.**

Of the 45 self-folds, 12 cross that line, with a median growth of 7,076. Only 2 of the 18 in Sessions 19–26 cross
it (`258fa27`, `ce869c8`). So the saving is about 7,076 − 5,332 ≈ **1.7k coordinator tokens per delegated fold**,
at a cost of about **68k Sonnet tokens per `implementer` run**. Under the current review cadence (c) barely pays.
It pays for planned multi-section folds like R1 (17 KB, 168 inserted lines), where folding in the main context
would have cost more than any self-fold measured here: the largest was 10,274.

---

## F. MCP tool tokens at session start (Sessions 20–26)

Loading step 1 at `ae49392` lists: S20 19,720; S21 19,855; S22 19,855; S23 19,855; S24 19,855; S25 19,855;
S26 19,846.

**Confirmed.** Each session's first `get_usage` result in its transcript carries exactly these MCP-tools figures.
After ToolSearch loads tools, later readings rise to 20,938–21,578. Sessions 14–19's first readings were 19,218,
20,298, 19,218, 20,298, 20,298 and 19,720. The desktop delivers MCP at ~19.8k per start, and nothing in Sessions
20–26 moved it: F closes with no desktop saving.

---

## G. Duplicated facts and test-count lines

**Test counts.**

- Command: `python3 $S/counts.py` is a regex sweep of the 19 live AI-facing files at `ae49392`. It matches
  11, 18, 20, 21, 22, 25, 28 or 36 within 30 characters of Vitest, unit, Playwright, e2e, test(s), case(s) or
  passed. There is also a second grep for `have|has|is|at|reached|of (25|36|21|11)` and spelled-out forms.
- The sweep found 57 candidate lines, sorted by hand into live counts and records. Records include the
  `18 passed` on 4 September and the Handoff-facts "green (36 Vitest, 21 Playwright) on `<sha>`".
- **Live counts: 30 lines in 11 files, 4,131 B** (the bytes are an upper bound: G deletes the number or clause,
  not the line). Command: `python3 $S/livecounts.py`, run twice, 4,131 both times.
- The lines are: AGENTS.md:19, 20, 125; README.md:93–95; ARCHITECTURE.md:325; CONVENTIONS.md:343–345;
  DA-REVIEW.md:20; DEVELOPMENT.md:47, 49, 64, 435; GLOSSARY.md:79, 127; SELF-REVIEW.md:24, 218, 219;
  TESTING.md:3, 10–12, 395–397, 453; implementer.md:80; PROGRESS.md:667.
- This matches the self-audit's "30 lines in 11 files", with line numbers moved.
- `implementer.md:81` (the grep instruction naming "21 e2e" as an example) is not counted.
- One false positive was dropped: CONVENTIONS.md:201, "21 `TS2307` errors".

**Duplicated incidents** (the self-audit's clusters D5–D8).

- Command: `python3 $S/dup.py ae49392`, plus `dup_narrow.py` for D6 and D8b.
- A "paragraph" here is a blank-line block, split at list items, table rows and headings.
- Files: the live set, `PROGRESS.md` excluded; it held 0 hits for all five.
- "Outside owner" is the bytes outside the owner file the self-audit names.

| Cluster (regex)                                                    | Paragraphs / files | Bytes      | Outside owner | Self-audit                         |
| ------------------------------------------------------------------ | ------------------ | ---------- | ------------- | ---------------------------------- |
| D5, the 139-agent audit (`\b139\b`; owner REVIEW-PATTERNS)         | 11 / 8             | 4,886      | 4,498         | 11 / 8, 4,876 B                    |
| D6, the case-sensitivity incident (`TS2307\|01-Atoms\|ignorecase`) | 20 / 14            | 9,772      | 9,074         | 20 / 14, 9,752 B                   |
| D7, the version pair (`1.6.1…1.6.2`; owner GIT.md)                 | 11 / 10            | 5,925      | 5,405         | 11 / 10, 7,304 B                   |
| D8a, `all_frames`                                                  | 14 / 11            | 5,696      | 5,287         | 14 / 11, 9,470 B                   |
| D8b, the comparator (`localeCompare`)                              | 10 / 9             | 5,264      | 4,592         | 11 / 9, 5,443 B                    |
| **Total**                                                          | **66**             | **31,543** | **28,856**    | ~40 KB "paragraphs that contain them" (D5–D10) |

Two notes on the table:

- The paragraph counts agree with the self-audit. The bytes differ for D7 and D8a because my unit splits list
  items; theirs did not.
- A broader D6 regex (adding `case-sensitive|case-insensitive`) gives 36 paragraphs in 16 files, 14,889 B. It
  catches rule restatements as well as the incident.
- The self-audit's estimate of 15–20 KB saved after pointers is an estimate and was not re-made. **The measured
  ceiling is 28,856 B outside the owners, plus 4,131 B of count lines: 32,987 B ≈ 14.7k tokens at 2.24.** That is
  before subtracting the one-line pointers that replace each paragraph. Those are UNMEASURED: nobody has written
  them.

---

## Per-file bytes at `ae49392`, and how each file loads

Command: `git show ae49392:<f> | wc -c` for each file, and `git ls-tree -r -l ae49392 docs/research docs/history`
for the two trees. Both files outside git (marked †) were measured with `wc -c` at 08:39 BST on 7 October, as they
stand now. The token column is bytes ÷ 2.24.

"Opened S19–26" counts the main sessions that opened the file with the Read tool, or with `cat`, `sed -n`, `head`,
`awk` or `git show` (inline script in this run). Four load classes appear below:

- **always**: auto-loaded into every main session and every subagent;
- **every session**: by `PROGRESS.md` §Next session loading instructions, or by the session prompt;
- **on demand**: by `AGENTS.md` §Key docs, or by an agent brief's reading;
- **on dispatch**: the brief is that agent's system prompt.

| File                                         | Bytes   | ≈ tokens | Loads                                                                                                                         | Opened S19–26 |
| -------------------------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `~/.claude/CLAUDE.md` †                      | 3,170   | 1,415    | always                                                                                                                        | —             |
| `CLAUDE.md`                                  | 1,003   | 448      | always                                                                                                                        | —             |
| `AGENTS.md`                                  | 13,383  | 5,975    | always (imported by `CLAUDE.md`)                                                                                              | —             |
| memory `MEMORY.md` †                         | 2,868   | 1,280    | always (the auto-memory index)                                                                                                | —             |
| memory, the 16 topic files †                 | 25,856  | 11,543   | on demand (index links); largest are `project-workflow-optimisation.md` 2,954 and `feedback-model-opus5-high.md` 2,948          | —             |
| `PROGRESS.md`                                | 65,930  | 29,433   | every session (step 1, "top to bottom"); on demand for `copilot-surrogate` on handoff PRs (touched file in full)              | 8 of 8        |
| `docs/SESSION-HANDOFF.md`                    | 10,993  | 4,908    | every session (the session prompt; step 5; Key docs "at session start")                                                       | 8 of 8        |
| `docs/ARCHITECTURE.md`                       | 34,818  | 15,544   | on demand (`AGENTS.md` §Architecture pointer; `implementer` before `public/app`; `spec-grill` §Permissions on a manifest spec)  | 0             |
| `docs/CONVENTIONS.md`                        | 28,766  | 12,842   | on demand (Key docs; `da-review` step 3 touched sections; `implementer` before `src/**`)                                       | 0             |
| `docs/DA-REVIEW.md`                          | 37,387  | 16,691   | on demand (Key docs before reviewing or dispatching `da-review`); 15,048 B mandatory for `da-review`, 6,601 B for `copilot-surrogate` | 0       |
| `docs/DEVELOPMENT.md`                        | 32,121  | 14,340   | on demand (Key docs, the full process); 5,866 B mandatory for `spec-grill`                                                    | 3             |
| `docs/GIT.md`                                | 29,829  | 13,317   | on demand (Key docs, commit or branch); whole for `implementer` before its first commit                                       | 1             |
| `docs/GLOSSARY.md`                           | 38,995  | 17,408   | on demand (Key docs, terms); no brief requires it                                                                             | 0             |
| `docs/RATIONALIZATIONS.md`                   | 17,415  | 7,775    | on demand (Key docs; `da-review` before dismissing)                                                                           | 0             |
| `docs/REVIEW-PATTERNS.md`                    | 18,144  | 8,100    | on demand (Key docs); whole and mandatory for `da-review` and `spec-grill`                                                    | 0             |
| `docs/SELF-REVIEW.md`                        | 23,179  | 10,348   | on demand (Key docs, before a PR); 1,962 B mandatory for `copilot-surrogate`                                                  | 0             |
| `docs/TESTING.md`                            | 34,642  | 15,465   | on demand (Key docs, before tests; `implementer` before a test)                                                               | 1             |
| `.claude/agents/copilot-surrogate.md`        | 17,950  | 8,013    | on dispatch (its `description` is always in the coordinator's Agent tool list)                                                | —             |
| `.claude/agents/da-review.md`                | 14,028  | 6,262    | on dispatch                                                                                                                   | —             |
| `.claude/agents/spec-grill.md`               | 12,131  | 5,416    | on dispatch                                                                                                                   | —             |
| `.claude/agents/implementer.md`              | 7,969   | 3,558    | on dispatch                                                                                                                   | —             |
| `docs/research/**` (7 files)                 | 187,699 | 83,794   | on demand, except `02-workflow-optimisation.md` (32,858), which step 1 makes every session for now; `01-pcr-workflow-port.md` (45,868) only its PR G sections, once G is reached | research 02: 8 of 8; research 01: 2 |
| `docs/history/**` (1 file, `SESSIONS.md`)    | 31,405  | 14,020   | on demand (archive work)                                                                                                      | 5 of 8        |

`README.md` (10,155 B) is not on the list. It is in `AGENTS.md`'s review-trigger table, but nothing loads it.

**Totals:**

- Always loaded: 20,424 B ≈ 9.1k tokens.
- Read every session now: `PROGRESS.md` + `SESSION-HANDOFF.md` + research 02 = 109,781 B ≈ 49.0k tokens. That
  matches Session 26's measured loading-read cost of 50,183 tokens (row A).
- The 11 top-level `docs/*.md` hold 306,289 B, of which main sessions in 19–26 opened only DEVELOPMENT, GIT and
  TESTING, 5 times in all.
- `AGENTS.md` + `CLAUDE.md` stand at 149 prose lines, one under the 150 budget (the `AGENTS.md` awk, run at
  `ae49392`).

---

## Decisions this feeds

- **A (A's saving; whether H's share counts):** 44,559 B ≈ **19.9k tokens per start** if a session reads only the
  newest entry (4,580) and the loading block (16,791). If the "Next workstreams" block stays read with its stack
  collapsed, it is 33,259 B ≈ 14.8k. Step 7 (8,000 B) is H's and is excluded from A. The recorded `get_usage`
  "start" rows run 9.7–17.8k late; the first-turn meter (60.3–66.8k) is the true start.
- **B (B's saving; N3's label):** 12 archive PRs in Sessions 14–26, and 32 of 43 surrogate dispatches on archive
  or handoff PRs. "33 in 10 sessions" holds for Sessions 9–18. One surrogate round costs the coordinator ≈3.3k
  tokens (1.4k to dispatch + 1.9k to digest), plus a PR and a CI run per archive PR.
- **C (C's reply cap; N3's label):** reviewer replies are already capped in the dispatch prompts: median 2,577 B
  since Session 19, against 10,295 B before. A digest costs ~1.8k tokens. The cap C writes into the briefs should
  sit at or below what the prompts already get (≤4,044 B, max observed). C's saving claim needs restating against
  this base.
- **D (`maxTurns` values; which reading goes on demand):** turn medians and maxima are 9 / 30 (`copilot-surrogate`),
  10 / 19 (`da-review`), 12.5 / 16 (`spec-grill` without the two opus runs) and 14 / 45 (`implementer`). A
  `maxTurns` at about 2× the observed maximum (surrogate 60, da-review 40, spec-grill 35, implementer 90) would
  never have fired. The largest mandatory reads are REVIEW-PATTERNS whole (18,144) for `da-review` and
  `spec-grill`, and GIT.md whole (29,829) for every `implementer` run.
- **E (Decision 6's threshold; whether (c) pays):** threshold **≥7 hunks or ≥33 changed lines**, from 1,874 + 576·h
  = 5,332. Folds take 1.0–7.4% of the coordinator's peak meter in Sessions 19–26. Delegation saves ~1.7k per fold
  above the line at ~68k Sonnet tokens per run, so (c) pays only for large planned folds.
- **F:** confirmed at 19,720–19,855 MCP tokens per start, unmoved since Session 20; F closes with no desktop saving.
- **G (G's saving; which homes stay):** 28,856 B of incident retellings outside their owners plus 4,131 B of
  count lines, a 32,987 B ceiling (≈14.7k tokens) before pointers. Every one of those bytes sits in an on-demand
  doc or brief, so G saves per read of those docs, not per session start. The exception is `AGENTS.md`'s 3 count
  lines and its D5, D6, D8a and D8b paragraphs (1,625 B), which are always loaded.
