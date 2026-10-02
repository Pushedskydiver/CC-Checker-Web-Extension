# Workflow self-audit: CC-Checker-Web-Extension

Read-only audit. All line citations are against `main` at `bf9f8d1`, read through `git show main:<path>`.
While this audit ran, the working tree moved to `docs/CC-005-archive-session-13` (`eb4683f`, which archives
Session 13). That commit changes `PROGRESS.md` (56,526 → 52,672 bytes), `docs/SESSION-HANDOFF.md` (4 lines) and
`docs/history/SESSIONS.md`. No other rule doc differs from `main`. Bytes come from `wc -c` or a Python
per-section splitter (headings outside fences). Tokens are estimated at 2.1–2.5 bytes per token.

## 0. What a session start and a dispatch cost today

**Session start, mandatory** (PROGRESS.md:573-574, step 1; step 5 adds SESSION-HANDOFF):

| Load | Bytes |
| --- | --- |
| `AGENTS.md` + `CLAUDE.md` (auto) | 14,386 |
| `~/.claude/CLAUDE.md` + `MEMORY.md` (auto) | 5,378 |
| `PROGRESS.md`, "top to bottom" | 56,526 |
| `docs/research/01-pcr-workflow-port.md` (step 1) | 45,784 |
| `docs/SESSION-HANDOFF.md` (step 5) | 10,853 |
| **Total** | **132,927 ≈ 53–63k tokens** |

That fits SESSION-HANDOFF.md:29, which records session starts of 67k to 107k. The extra comes from the system prompt
and tools.

**Per dispatch** (the brief, the docs it says to read, and the auto-loaded `CLAUDE.md` hierarchy of 17,390 bytes):

| Agent | Brief | Mandatory docs | Total before the diff | Conditional extras |
| --- | --- | --- | --- | --- |
| `da-review` | 14,028 | DA-REVIEW §Red flags 2,262 + §Approval 853 + §Required disciplines intro 3,040 + the six always-on 6,771 + §Severity 2,112 + REVIEW-PATTERNS (step 5, "consult", the whole file) 18,144 = 33,182 | **64,600** | RATIONALIZATIONS 17,415 on dismissal; trigger-gated disciplines ≤9,495; file-type sections ≤9,446; CONVENTIONS sections |
| `copilot-surrogate` | 17,950 | DA-REVIEW §Claim-extraction 1,914 + §Cross-context 3,295 + §Verification-claim 1,389 + SELF-REVIEW §Before you write the word verified 1,961 = 8,559 | **43,899** | **Every touched file in full.** A handoff PR touches `PROGRESS.md`, which adds 56,526, so ~100 KB |
| `spec-grill` | 12,131 | DEVELOPMENT §Verification rounds + §Scale 5,794 + REVIEW-PATTERNS 18,144 = 23,938 | **53,459** | the plan precedent (PROGRESS §approved plan 6,720, research §8 5,039); the lifecycle sections 5,239; CONVENTIONS §Authoring |
| `implementer` | 7,969 | the item; `docs/GIT.md` whole before the first commit, 29,829; CONVENTIONS whole for `src/**`, 28,766; TESTING whole for any test, 117,068; ARCHITECTURE whole for `public/app`, 34,818 (implementer.md:39-45) | src+test item: **201,022** (≈ 118,600 after F) | — |

## 1. Duplication clusters (each fact, every home, and who should own it)

`docs/DEVELOPMENT.md:387` says "Each fact has exactly one home. Other surfaces point at it". Two agent briefs say the
opposite: `copilot-surrogate.md:19-23` and `:169-174` ("deliberately restated … each is meant to be readable alone"),
and `implementer.md:80` ("restated in several files on purpose"). **That contradiction is the root cause of the
count and date drift** (decisions (l) and (m)). Settle it in favour of DEVELOPMENT.md:387, then apply the clusters
below.

| # | Fact | Where it is stated | Owner | Others become |
| --- | --- | --- | --- | --- |
| D1 | Merge policy, the Dependabot delegation, the rebase default | AGENTS.md:51-61; GIT.md:227-236, 237-245; DEVELOPMENT.md:31-33; SELF-REVIEW.md:326-327; GLOSSARY.md:113; README.md:162 | GIT.md §Who merges, §Merge strategy | AGENTS keeps one sentence plus a pointer |
| D2 | Which review fires on which path | AGENTS.md:126-137; copilot-surrogate.md:31-51; da-review.md:3; spec-grill.md:3; GLOSSARY.md:88-92; DEVELOPMENT.md:199 | AGENTS.md table (DEVELOPMENT.md:394 says so) | copilot §Trigger shrinks to its superset deltas (comment blocks, `PROGRESS.md`), or `PROGRESS.md` joins the AGENTS table. That settles half of decision (i) |
| D3 | Model and effort pins | frontmatter of all four agents; CLAUDE.md:8-11; SESSION-HANDOFF.md:146; PROGRESS.md:626-628 | the frontmatter | CLAUDE.md:5-6 already admits the roster "goes stale first". Drop the roster |
| D4 | Handoff lines (130k/150k/250k/85%) | SESSION-HANDOFF.md:13-22; CLAUDE.md:15-17; GLOSSARY.md:109; PROGRESS.md:629-634 | SESSION-HANDOFF §1 | PROGRESS step 6 breaks SESSION-HANDOFF.md:115-116 ("must not restate rules") |
| D5 | The 139-agent audit story | AGENTS.md:145-147; DEVELOPMENT.md:297-304; DA-REVIEW.md:63-65, 321-323; RATIONALIZATIONS.md:27, 176; REVIEW-PATTERNS.md:196; GLOSSARY.md:96; spec-grill.md:29-32, 152-156; da-review.md:175-178 | REVIEW-PATTERNS §10 (incident), DEVELOPMENT §Scale (rule) | one-line pointers. 11 paragraphs in 8 files, 4,876 B |
| D6 | The case-sensitivity incident | AGENTS.md:107-111; CONVENTIONS.md:199-202; DA-REVIEW.md:44-45, 271-288; ARCHITECTURE.md:273-278; RATIONALIZATIONS.md:62-84; GIT.md:175; SELF-REVIEW.md:76-77; da-review.md:95-104; copilot-surrogate.md:102-107; REVIEW-PATTERNS.md:26-43; DEVELOPMENT.md:140-146, 365-369 | REVIEW-PATTERNS §1; rule in DA-REVIEW §Case-sensitivity audit | 20 paragraphs in 14 files, 9,752 B |
| D7 | Version pair 1.6.1/1.6.2 | README.md:106; DA-REVIEW.md:238; DEVELOPMENT.md:120; GLOSSARY.md:111; RATIONALIZATIONS.md:259-260; GIT.md:346; SELF-REVIEW.md:248-249; copilot-surrogate.md:121, 176-178; da-review.md:137; spec-grill.md:26-28 | GIT.md §Releases | 11 paragraphs in 10 files, 7,304 B |
| D8 | `all_frames` and the comparator incidents | 14 paragraphs in 11 files (9,470 B) and 11 in 9 (5,443 B) | REVIEW-PATTERNS §4 and §2 | pointers |
| D9 | The pre-push command | AGENTS.md:24; README.md:67; CONVENTIONS.md:329; GLOSSARY.md:80; GIT.md:278; RATIONALIZATIONS.md:55; DEVELOPMENT.md:57, 90; SELF-REVIEW.md:320; TESTING.md:51; PROGRESS.md:591 (11) | AGENTS.md:24 | "the pre-push suite" |
| D10 | What e2e does not cover | README.md:90; da-review.md:129-133; spec-grill.md:83-89; CONVENTIONS.md:349; ARCHITECTURE.md:355; DEVELOPMENT.md:64-66; DA-REVIEW.md:132-134; SELF-REVIEW.md:70; RATIONALIZATIONS.md:158; TESTING.md:136-160 | TESTING §What is not tested | pointers |
| D11 | "Required check since 11 September 2026" | AGENTS.md:56; README.md:71; CONVENTIONS.md:334; SELF-REVIEW.md:324; TESTING.md:48; DA-REVIEW.md:13; DEVELOPMENT.md:150; da-review.md:99, 165 | DEVELOPMENT §CI | drop the date elsewhere |
| D12 | The state of decision (f), the mutation gate | DA-REVIEW.md:20-21; SELF-REVIEW.md:340-341; DEVELOPMENT.md:433-435; GLOSSARY.md:127; TESTING.md:337-338; spec-grill.md:45-46; PROGRESS.md:642-643 | DEVELOPMENT §Not ported | 6 restatements of "still open"; see §4 |
| D13 | The strikethrough convention | SESSION-HANDOFF.md:112-114; copilot-surrogate.md:195-210; spec-grill.md:137-141; GLOSSARY.md:12-14 | SESSION-HANDOFF §5 | copilot keeps only its report list |
| D14 | In-chat only, no PR comments | AGENTS.md:139-140; DA-REVIEW.md:325-330; DEVELOPMENT.md:201; SELF-REVIEW.md:326; GIT.md:229-231; da-review.md:159-161; copilot-surrogate.md:85, 251-253; spec-grill.md:157-158 | DA-REVIEW §Reporting channel (which names only da-review and copilot, :327-328) | one line in the shared report contract (§3) |

Rough saving if D5–D10 collapse to pointers: the paragraphs that contain them total ~40 KB. Most of that is
retelling, so expect **15–20 KB** (an estimate). Risk is M: CONVENTIONS §"Name the incident and its date"
(CONVENTIONS.md:59-67) has to accept "REVIEW-PATTERNS §1, 4 September 2026" as naming it.

## 2. History in rule documents

| Item | Evidence | Bytes |
| --- | --- | --- |
| Session-pattern cites, which must be repointed on every archive PR (`PROGRESS.md:581`, "cites of it: git grep") | DEVELOPMENT.md:288-291, 317-318, 324, 343-346; SESSION-HANDOFF.md:33-39, 69, 74, 135, 139; implementer.md:14-18, 31, 75 | ~2.5 KB. The bigger gain is quality: cite PR numbers or REVIEW-PATTERNS entries instead |
| Incident narrative in agent briefs, loaded on every dispatch | copilot-surrogate.md:13-29 (1,473), 64-76 (the ceiling's measurement story with `b4de022` figures and the symlink history, 1,178), 176-193 (worked examples, 1,275); spec-grill.md:12-47 ("why ported", 2,769); implementer.md:14-18 (405) | ~7.1 KB per dispatch set |
| Overlap between da-review.md §What to be adversarial and DA-REVIEW §Red flags and the disciplines | da-review.md:50-155, 8,617 B | ~4–5 KB per da-review dispatch |
| Provenance and "not ported" sections | DEVELOPMENT.md:407-444 (2,771); CONVENTIONS.md:385-399 (1,830); GIT.md:387-408 (1,605) and 1-29 (2,018); SELF-REVIEW.md:334-349 (993); TESTING.md:335-344 (677); GLOSSARY.md:117-135 (4,225); ARCHITECTURE.md:380-426, part of 3,666; DA-REVIEW.md:16-24 | ~12–15 KB to a `docs/history/PROVENANCE.md`, keeping the re-entry conditions. Costs only when a doc is read whole, which the implementer does |
| GIT.md narrative | §Live branches 71-79 (1,446), §Dependabot 303-338 (2,721; #48 story, #18–#25), §Merge strategy 239-245, §After the merge 287-292 | ~3 KB |
| Struck text in rule docs (decision (u)) | DEVELOPMENT.md:433-434; GIT.md:396-398; SELF-REVIEW.md:340-341; GLOSSARY.md:127 | ~0.5 KB. Close (u) as "rewrite, don't strike" |
| History in AGENTS.md (loaded every session and every dispatch; 149 of ~150 budget lines) | AGENTS.md:39-43 (gitmoji drift), 52-59 (dated merge-policy history), 95-97 (ESLint 10 story), 102-106 (copy history), 125 ("25 as of 18 September"), 145-147 (139 story) | ~1.5–2 KB, and budget headroom |

**Stale facts found while reading** (fix them in passing):

- GIT.md:71-79 "Live branches, 11 September 2026" lists the deleted `feat/vite-migration`. It omits
  `chore/CC-004-copy-to-clipboard-4`, which is on the remote (`git ls-remote`) and is "do not delete" per
  PROGRESS.md:587.
- GIT.md:327-328 still says "#48 is to be asked to `@dependabot recreate`". That is done: PROGRESS.md:83-85 records
  #48 closed and #55 recreated.
- The "Last reviewed: 11 September 2026" stamps at DA-REVIEW.md:34, GLOSSARY.md:17 and SELF-REVIEW.md:30 are stale:
  all three files changed on 28–29 September (`git log -1`), and nothing maintains the stamps. Delete them.
- REVIEW-PATTERNS.md:248-258 says no second round has happened. That is the carried item at PROGRESS.md:615-617;
  Session 8's `notacolor` confirm round is the instance.
- DA-REVIEW.md:327-328's reporting-channel paragraph names `da-review` and `copilot-surrogate` but not `spec-grill`
  or `implementer`.
- PROGRESS.md:573-574 makes the research file required reading. The research file says it is "never required
  reading" (research:355) and "a record, not instructions" (research:3).

## 3. Agent report formats, and one shared contract

The four briefs report in four different shapes:

| | da-review | copilot-surrogate | spec-grill | implementer |
| --- | --- | --- | --- | --- |
| Opening | must cite the top 3 DA-REVIEW checks by file:line (da-review.md:36-37) | `SCOPE_ESCALATION` header if over the ceiling (:74-76) | infer the phase, or ask (:69-71) | — |
| Severity | B/M/L per DA-REVIEW §Severity (:46-47) | B/M/L, plus its own escalation rule (:242-243), with no pointer to the definitions | B/M/L, no pointer to the definitions (:72) | none |
| Finding template | none; needs file:line plus a checklist anchor | `FINDING <N>` with Claim, Falsifier, Ground truth, Severity, Class (:214-222) | none | 8 ordered sections (:106-118) |
| Uncertainty word | "speculative" (:171-172) | "UNCHECKED" (:136-151, :236-237) | "speculative" (:146) | — |
| Summary | "nit-floor reached" plus what was checked (:173-174) | counts of claims, verified, falsified, UNCHECKED (:224-226) | verification: confirm or disprove, flag fabrications (:74-76) | "Not done", "Docs opened" |
| Channel | :159-161 | :85, :251-253 (said twice) | :157-158 | never push (:92) |

Proposed contract, stated once in DA-REVIEW (§Report contract, ~1.5 KB), with each brief keeping only its role-specific
fields:

```
HEADER   agent · round (R1 discovery | Rn verify) · ref (sha) · files read in full
FINDING  F<n> [BLOCKING|MATERIAL|LOW] path:line — one-line claim
         Evidence: command run → output line (or "UNCHECKED: why")
         Anchor:   checklist §, REVIEW-PATTERNS #, or claim class
         Status:   CONFIRMED | SPECULATIVE | UNCHECKED
VERIFY   (Rn only) R<k>-F<n>: FIXED | NOT FIXED | FABRICATED — evidence
SUMMARY  counts by severity + UNCHECKED; nit-floor: yes/no + what was checked
OUT      noticed-not-touching; escalations for Alex (scope, permission, policy)
RULES    severity = DA-REVIEW §Severity labels; in-chat only, never gh comments
```

The implementer maps onto it: Commits and Mutation table are its findings, with commands as evidence, and Not done
is OUT. Folding the four restated channel, severity and speculative paragraphs into this contract saves about 2 KB
across the briefs. It also makes the coordinator's triage mechanical.

**Reading that could become on-demand:**

- **REVIEW-PATTERNS** for da-review and spec-grill: add a quick-reference table like RATIONALIZATIONS.md:18-33
  (pattern → trigger path), so each dispatch reads only the matching entries. That takes 18 KB to about 3–4 KB, per
  dispatch, for both agents.
- **implementer**, per item:
  - GIT.md §Format + §Types + §Bodies (5,240 B) instead of the whole file. Saves 24.6 KB per dispatch.
  - TESTING §Writing tests here + §Flakiness + §Unit tests (10,598 B) instead of the whole file. Saves ~106 KB
    before F and ~24 KB after it.
  - CONVENTIONS by section, as da-review.md:38 already does.
- **copilot-surrogate** on a handoff PR reads the whole of `PROGRESS.md`. Each cut in §4 is also saved on every
  handoff review.

## 4. `PROGRESS.md` shape

Measured at `main`:

| Block | Lines | Bytes | Live state or record |
| --- | --- | --- | --- |
| Stack of 12 "Updated …" paragraphs | 8-86 | 6,381 | Only the newest (8-10) is state. Six say outright "so the paragraph below is history" (12-14, 22-23, 31-33, 41-43, 51-54, 64-65) |
| Workstream items | 88-118 | 3,310 | Items 2 and 3 are struck and done (94-99, 578 B). Item 6 is done (110-118, 902 B) |
| The approved CC-004 plan | 120-187 | 6,720 | Paused until CC-005 ends (PROGRESS.md:577). Rows 1-10 are ✅ (1,764 B). "What the grill killed" (147-185, ~3.9 KB) is a record of re-entry conditions |
| Session entries 13-18 | 189-569 | 26,246 | Record: Done 9,833, Handoff facts 6,703, Patterns 5,983, Setup 2,097 |
| Loading block | 571-702 | 13,284 | Step 7, the decision branches, is 7,538 |

**SESSION-HANDOFF.md:130-132 already says** settled decision branches and finished sequences move to SESSIONS
§Retired. These blocks don't follow it:

- The settled (p), (q), (r), (s) and (t): 639-641 and 692-702, ~1.9 KB.
- The struck loading lines: 578-579 (381 B) and 609-613 (494 B).
- The done workstream items, and the grill record.

**Open decisions, and a suggested disposition** (each is Alex's call; these are proposals):

| Branch | Bytes | Status | Suggest |
| --- | --- | --- | --- |
| (b) workstream 5 before or after CC-004 | in 645-646 | open, duplicates item 5 (102-109) | merge into item 5 as "Alex to schedule" |
| (f) mutation gate | in 642-643 | open since 17 September; restated as open in 6 docs (D12). The implementer's per-slice mutation table (implementer.md:64-76) is a manual gate in practice | close: "hand mutation table adopted in implementer; no tooling gate". Rewrite the 6 restatements |
| (g) `docs/INDEX.md` | in 643-644 | open | close as not adopted; AGENTS.md §Key docs (164-176) is the index |
| (h) Dependabot merge button | 647-649, 325 B | GIT.md:232-234 already records the choice ("kept as written: decision (h)") | close |
| (i) copilot trigger superset; TESTING fixture line cite | 650-655, 629 B | half stale (the 2.1.0 sentence is unrelated record) | fold into D2. F already touches TESTING, so turn the line cite into a section cite there |
| (j) classifier refused a merge | 655-661, 748 B | already in global `~/.claude/CLAUDE.md` §Harness ("auto-mode classifier can block…") | close and move to memory |
| (k) SELF-REVIEW "same PR" line | 661-668, 817 B | open since Session 8, against 13+ counter-instances | rewrite SELF-REVIEW.md:271 to match practice |
| (l) derive counts | 668-674, 709 B | open; PR G carries only a sweep (research:381, :566) | see §5 |
| (m) 17 vs 18 September date drift | 674-683, 1,055 B | carried since Session 8; 9 cites | disappears if (l) removes the dated counts |
| (n) `--max-warnings 0` | 684-688 | open; costs nothing (`exit 0` on #68) | a small PR |
| (o) 🏷️ gitmoji | 689-691 | its default is already "a slip" | close |
| (u) dated strikes in rule docs | 635-639 | open | close as "rewrite" (§2) |

**Shape changes:**

- **"Updated" stack:**
  - Replace it with a single `## Current state` paragraph, rewritten in place by each handoff (~600 B).
  - Amend SESSION-HANDOFF.md:80, which prescribes the stack.
  - Saves about 5.8 KB.
- **Loading step 6** (625-634): replace with "apply SESSION-HANDOFF §1, §7". It restates rules, which
  SESSION-HANDOFF.md:115-116 forbids.
- **Detail band:** it stays at about 24 KB in steady state, because SESSION-HANDOFF.md:120-122 archives only above
  five entries or 24,000 B.
  - Move each entry's Handoff facts readings (6.7 KB across six entries) to an append-only
    `docs/history/handoff-readings.md` table. That is the input the Session 20 review needs anyway (SESSION-HANDOFF.md:150).
  - Lower the band to 2–3 entries, or 12,000 B.
  - Saves ~12 KB per session start. Risk M: it moves Alex's dial.

## 5. Hard-coded test counts

Today, `npx vitest run` prints `Tests 36 passed (36)` and `npx playwright test --list` prints `Total: 21 tests in 1 file`.
**`npx vitest list` prints 28 lines, not 36** (verified, `--json` as well). Any derivation for decision (l) must use the
`vitest run` summary line, not `list`.

**Live occurrences, which will go stale** (30 lines in 11 files):

- AGENTS.md:19 (36), :20 (21), :125 (25, "as of 18 September")
- README.md:93 (25), :95 (36)
- docs/DEVELOPMENT.md:47 (36), :49 (21), :64 (21), :435 (25, dated)
- docs/CONVENTIONS.md:343 (36, 25), :344 (11), :345 (21)
- docs/GLOSSARY.md:79 (36, "21-test"), :127 (25)
- docs/ARCHITECTURE.md:325 (21)
- docs/TESTING.md:3 (21), :10 (36), :11 (25), :12 (11), :263 (21), :264 (25), :265 (11), :321 (11)
- docs/SELF-REVIEW.md:24 (36), :218 (25), :219 (11, 36)
- docs/DA-REVIEW.md:20 (25)
- .claude/agents/implementer.md:80 (36, 21, as examples)
- PROGRESS.md:591-592 (36, 21 expected), :595 ("21 rows")

**Record, fine as is:** PROGRESS.md:78, 81, 196, 249, 308, 376, 393, 447, 514; TESTING.md:46 ("22 passed" at #58).
copilot-surrogate.md:189 is a dated historical example.

**Proposal:**

- One home: AGENTS.md:19-20 (always loaded) and TESTING.md §Baselines (263-265), with the derivation commands
  beside them.
- Everywhere else, "the Vitest suite" or "the e2e suite", with no number and no date. That also dissolves decision (m).
- A CI check only if drift recurs after that, per DEVELOPMENT.md §Process-rule promotion.
- Fits PR G's planned count sweep (research:381, L5): make G remove the counts instead of bumping them.

## 6. Other session-start costs

- **The research file in loading step 1** (PROGRESS.md:573-576): 45,784 B on every start, for two remaining rows.
  - F is fully scripted at PROGRESS.md:594-605.
  - G needs §8's row (research:381) and §"PR G, the hook" (research:483-516, 2,852 B).
  - Pointing at those sections saves ~40 KB (≈17–19k tokens) per session.
  - This is the single largest, lowest-risk cut.
- **The CC-004 plan** (6,720 B) is read on every start while paused. Collapse it to rows 11-12 and their
  dependencies; the rest goes to SESSIONS §Retired.
- **AGENTS.md has one line of budget left** (149 of ~150, by the awk at AGENTS.md:160). The history trims in §2 free
  about 10 lines.
- **Agent descriptions** (305, 530, 459 and 286 chars) are fine; no action.

## Ranked summary

| # | Finding | Evidence | Saved / gain | Risk | PR |
| --- | --- | --- | --- | --- | --- |
| 1 | Research file read at every start against its own "never required" | PROGRESS.md:573-576; research:3, 355 | ~40 KB/start | L | next handoff |
| 2 | "Updated" stack, settled decisions, struck lines, done items still in PROGRESS | PROGRESS.md:8-86, 94-118, 578-579, 609-613, 639-641, 692-702; SESSION-HANDOFF.md:80, 130-132 | ~12 KB/start, also every handoff review | L | next handoff (or the archive PR) |
| 3 | 7 stale open decisions (f, g, h, j, k, m, o) + (u) | PROGRESS.md:642-702; GIT.md:232; ~/.claude/CLAUDE.md §Harness | ~5 KB + D12's 6 doc restatements | L (Alex rules) | one decisions PR |
| 4 | Agent mandatory reading: whole REVIEW-PATTERNS, GIT, TESTING | da-review.md:42; spec-grill.md:68; implementer.md:41-44 | 15 KB/review dispatch; 50–130 KB/implementer dispatch | L | agents PR |
| 5 | Counts in 30 lines/11 files; `vitest list` ≠ 36 | §5 list | kills (l), (m) | L-M | fold into PR G |
| 6 | One-home rule contradicted by two briefs | DEVELOPMENT.md:387 vs copilot-surrogate.md:19-23, 169-174; implementer.md:80 | root cause of drift | L | agents PR |
| 7 | Shared report contract | §3 table | ~2 KB + mechanical triage | L | agents PR |
| 8 | Detail band and Handoff-facts readings | SESSION-HANDOFF.md:120-122; PROGRESS.md:189-569 | ~12 KB/start | M | SESSION-HANDOFF PR |
| 9 | Incident retold in up to 14 files | D5–D10 | 15–20 KB (est.) | M | docs dedupe PR |
| 10 | History in briefs and session-pattern cites | §2 table | ~7 KB/dispatch set; no repoint per archive | L-M | agents PR |
| 11 | Stale facts | GIT.md:71-79, 327-328; DA-REVIEW.md:34; GLOSSARY.md:17; SELF-REVIEW.md:30; REVIEW-PATTERNS.md:248-258 | correctness | L | small docs PR |
| 12 | Provenance / not-ported sections | §2 | 12–15 KB | M | later |
