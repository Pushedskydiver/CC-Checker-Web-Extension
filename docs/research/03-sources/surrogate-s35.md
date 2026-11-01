# copilot-surrogate — PR #136 (`docs/CC-007-session-35`, head `237d677`, base `a8463b8`)

Worktree: `/Users/alexclapperton/Desktop/alex/colour-contrast-checker/cc-surrogate`, detached at `237d677`, every read there. Scope:
`git log --oneline a8463b8..237d677` = `66f2fa9`, `4e70daa`, `993f49f`, `237d677`; 13 files post-filter, ~218 KB (ceiling 20 / 400 KB not tripped).
All 13 read at HEAD in full, plus the untouched harness files the rows rest on (`inject-bg.js`, `make-builds.mjs`, `marionette.mjs`) and
`git show 0fae782:PROGRESS.md` lines 644-790 for the archived entries. No edits to the worktree, no PR comments; this file is the one write.
`AGENTS.md` and `CLAUDE.md` untouched, so the budget awk was not run.

SUMMARY: ~115 claims checked / 12 falsified / 0 BLOCKING, 3 MATERIAL, 9 LOW, 5 nits; ~22 UNCHECKED (listed at the end).

## Findings

FINDING 1 — docs/research/03-safari-firefox-ports.md:263-266

Claim (verbatim from file): "| # | Browser | Question | Decides |" then "_1 November 2026 (Session 35): F1 to F9 ran on Firefox 159.0; …_" then a blank line, then "| --- | ------- | …"
Falsifier (command/observation): Prettier's own Markdown parser (`require('prettier').__debug.parse(src, { parser: 'markdown' })`, node types by line) — at `a8463b8`: `table 263-282`; at `237d677`: `paragraph 263-264`, `paragraph 266-284`. The GFM rule it is applying: the delimiter row must be the line after the header row.
Ground truth: the dated note was inserted between the header row and the delimiter row, so the eighteen-row experiments table (the contract for phase 0, `§What must be run before any code`) no longer parses as a table: lines 263-264 render as one paragraph and 266-284 as a second, pipes and all. `prettier --check` passes only because it no longer sees a table (which is also why the diff could un-pad every row). The fix is placement: the note above line 263, or below line 284, with a blank line each side.
Severity: MATERIAL
Class: other (structural)

FINDING 2 — PROGRESS.md:438-440; docs/research/03-sources/experiments.md:39 (F1) and :41 (F3, the `ext-manifest` warning); docs/research/03-sources/ff-harness/README.md:3 and :28-29

Claim (verbatim from file): "Then `smoke.mjs` (session, `Services.appinfo.version`, `Addon:Install`), `f1.mjs`, `run.mjs` (F2 to F8 and F9's write, one batched script) and `f9.mjs` (…)"; experiments.md F1: "`tabs.sendMessage`, `action.setPopup` and `action.getPopup` with no callback each return a `Promise`; … The background ran as a document"; F3: "`use_dynamic_url` in `web_accessible_resources` is a manifest warning ("An unexpected property was found in the WebExtension manifest")".
Falsifier (command/observation): `git ls-files docs/research/03-sources/ff-harness/` — 13 files, no `f1.mjs`. `grep -n 'F1\|warnings' run.mjs f9.mjs smoke.mjs` — the only hits are run.mjs:17 (logs `r2.results.senders`, not `.F1`) and run.mjs:67 (reads `extension.warnings` for `ext-manifest-nodyn` only; its comment says ext-manifest's were "already seen"). `probe-bg.js:11-21` records `__cc.F1` and `:40` returns it under `probe-results`, so a one-line `probe(m, 'do=results')` would print it — but no committed script does.
Ground truth: the F1 row and the F3 row's `ext-manifest` half are the two readings no script in the repo could have produced; the script that did (`f1.mjs`, named in the entry) was not committed. The dispatch premise "the runner's output is not in the repo; the scripts are" holds for F2 to F9 and fails for F1. Loading step 5's "Firefox, if a row needs re-reading" has nothing to re-run for F1. Either commit `f1.mjs`, or add the F1/warnings read to `smoke.mjs`, and drop or footnote the name in PROGRESS.md:439.
Severity: MATERIAL
Class: unverified-verification-claim

FINDING 3 — PROGRESS.md:747-748 (loading step 1, read cold)

Claim (verbatim from file): "re-dispatch it against the same commits (`66f2fa9..` the branch head), not from memory."
Falsifier (command/observation): `git log --oneline 66f2fa9..237d677` prints three commits (`4e70daa`, `993f49f`, `237d677`); a two-dot range excludes its left end. The reviewers this session dispatched were given `a8463b8..237d677` (four commits, `66f2fa9` included — this report's own brief).
Ground truth: the written range is not "the same commits": a re-dispatch following it would drop the archive commit, so `docs/history/SESSIONS.md` rows 30 and 31 would go unreviewed. Write `a8463b8..` (the merge-base, `git merge-base main <branch>`), or "the four commits from `66f2fa9`".
Severity: MATERIAL (an operational sentence in the loading block, per the brief's rule; the consequence is a narrower re-review, not a push or an upload)
Class: reader-precision

FINDING 4 — PROGRESS.md:427-428 and :749

Claim (verbatim from file): "Session 30 alone left the band at 26,211 bytes, so both went, to 4 entries and 20,331."; "with Session 35's entry the band is 5 entries and over the 24,000-byte line."
Falsifier (command/observation): `docs/SESSION-HANDOFF.md:122`'s awk on `git show <c>:PROGRESS.md`: `a8463b8` → 31,237 (5 entries: 34, 33, 32, 31, 30); minus Session 30 only → 26,211; `66f2fa9` → 20,331 with headings 34, 33, 32 (`grep -c '^## Session [0-9]'` = 3); `237d677` → 27,454 with 35, 34, 33, 32 (= 4). `grep -c '^## Session '` without the digit class gives 4 and 5, because `## Session archive` matches.
Ground truth: every byte figure reproduces (31,237; 26,211; 20,331; and 27,454 is over the line, so step 2's "archive Session 32" is right). Both entry counts are one high: 3 after the archive, 4 now. Session 34's "4 entries and 23,927" (PROGRESS.md:507) used the right count, so this is a new slip, not a convention.
Severity: LOW
Class: stale-quantifier

FINDING 5 — PROGRESS.md:453

Claim (verbatim from file): "the diff is over 200 lines without `package-lock.json` (`PROGRESS.md` alone is −141)"
Falsifier (command/observation): `git diff --numstat a8463b8..237d677 -- PROGRESS.md` → `133 172` (net −39); `a8463b8..66f2fa9` → `2 139` (net −137); `993f49f..237d677` → `131 33`. Whole diff excluding the lockfile: 499 added, 226 removed, 725 changed.
Ground truth: −141 reproduces by no method tried (not the deletions, 172 or 139; not a net, −39 or −137). The "over 200 lines" claim holds either way. Report the figure the dispatch used, or drop the parenthesis.
Severity: LOW
Class: stale-quantifier

FINDING 6 — docs/research/03-sources/ff-harness/README.md:7-8 against :21-23

Claim (verbatim from file): "`chrome(script)` (runs in the browser-chrome context, needs Firefox's `--remote-allow-system-access`)"
Falsifier (command/observation): README.md:23 "Firefox 159 wants `MOZ_REMOTE_ALLOW_SYSTEM_ACCESS=1` (exported there)"; experiments.md:18-21 (the flag alone was refused on 159); PROGRESS.md:437-438 "(the 152 flag no longer grants it)"; `launch-ff.sh:5,7` exports the variable and keeps the flag.
Ground truth: on the Firefox this harness now documents, the chrome context needs the environment variable; the flag is kept for 152. Line 7-8 is the Session 34 sentence left in place. (`launch-ff.sh:2` "Launch Firefox 152" is the same family; nit 3.)
Severity: LOW
Class: internal-contradiction

FINDING 7 — docs/research/03-safari-firefox-ports.md:82, 96, 112, 115, 116, 117, 118, 124, 254-257, 332

Claim (verbatim from file): e.g. :116 "is not stated anywhere read: experiment F1"; :112 "undocumented and uncovered by Firefox's own tests: experiment F2"; :115 "is untested (F6)"; :118 "is undocumented (`firefox.md` row 169, UNVERIFIED): experiment F9"; :124 "what happens on a site the user has revoked is F5"; :255 "Firefox 152.0.3 (read 17 October 2026; six releases behind the calendar's 158.0, so update Firefox first)"; :256-257 "Firefox from `about:debugging` (Load Temporary Add-on, …; not re-checked here)".
Falsifier (command/observation): experiments.md:39-47 answers each (F1, F2, F5, F6, F9 read on 1 Nov 2026); the rows ran via Marionette `Addon:Install` (`marionette.mjs:50`, `lib.mjs:9`), not `about:debugging`; `firefox --version` → 159.0. The file's own convention, :259 "this file's open rows are then rewritten in place with a dated note, as research 02's fold was, not deleted" and :293-294 "this file's open rows rewritten in place, dated"; Session 34's loading step said the same.
Ground truth: the one dated note at :264 covers the experiments table; the mechanisms table and the surrounding prose still present F1, F2, F5, F6 and F9 as open, and :254-257 still describes a Firefox and a route that were not used. Living research prose, so rewrite in place with the date (the (g) row at :344-346 is the form), not strike.
Severity: LOW
Class: unstruck-superseded-claim

FINDING 8 — PROGRESS.md:436 and :480-483

Claim (verbatim from file): "Session 34's five routes all ran inside the sandbox."; "Session 34 spent 108k of context on five launch routes, all children of the sandboxed shell, and the log said so"
Falsifier (command/observation): Session 34's own record, PROGRESS.md:517-519 ("Three launch routes … and headless mode all left the scratch profile uninitialised …; `open -a Firefox --args` dropped the arguments and opened the default profile") and :567-568; `git show a8463b8:docs/research/03-sources/experiments.md` §Harness status (checked "with `ps -o args=`").
Ground truth: four routes failed the sandbox way; the fifth, `open -a Firefox --args`, launched Firefox (via LaunchServices, not as the shell's child) and failed by dropping its arguments. "All five" and "all children of the sandboxed shell" overstate the record. The 108k (88k → 196k) reproduces. Whether `open -a` would have worked with the sandbox off is UNCHECKED.
Severity: LOW
Class: internal-contradiction

FINDING 9 — docs/research/03-sources/experiments.md:5-6

Claim (verbatim from file): "Firefox was 152.0.3 when the harness was written (Session 34) and 159.0 when it first ran; Alex updated it between the sessions."
Falsifier (command/observation): `git grep -n 'updated\|update Firefox' -- PROGRESS.md docs/research` — nothing records Alex doing it; PROGRESS.md:451-452 "Alex's only message this session was the Dependabot one"; Session 34's loading step said only "updating it needs Alex". Firefox self-updates by default.
Ground truth: the version change is verified (`firefox --version` → 159.0); who or what did it is not in the repo. Write "it had been updated" unless Alex said so.
Severity: LOW
Class: other (unsupported attribution)

FINDING 10 — docs/research/03-sources/experiments.md:5

Claim (verbatim from file): "Safari 27.0, macOS 27.0, Xcode 27.1."
Falsifier (command/observation): `defaults read /Applications/Safari.app/Contents/Info.plist CFBundleShortVersionString` → 27.0.1; `sw_vers -productVersion` → 27.0.1; `xcodebuild -version` → Xcode 27.1 (all read 1 November 2026). `grill-r2.md:52` read 27.0 / 27.0 on 17 October.
Ground truth: the status sentence was rewritten by this PR (dated "Session 35, 1 November 2026") and re-read Firefox but restated Safari and macOS from October. Nothing rests on it yet (no Safari row ran); it will when S-rows record "read on" versions.
Severity: LOW
Class: version-pair-drift

FINDING 11 — docs/research/03-sources/experiments.md:47 (F9)

Claim (verbatim from file): "An uninstall-then-reinstall within a session changed the UUID (`bf80a141…` → `13764d37…`), so the origin is stable per install, not per profile."
Falsifier (command/observation): the same row's first sentence: the three keys "read back after `Marionette:Quit`, a relaunch and a reinstall: `extensions.webextensions.uuids` kept the id's UUID across the restart"; `f9.mjs:5,10-11` (pref read before `install`, then `ls-get` after it); `lib.mjs:7-9` (`install` uninstalls first).
Ground truth: the post-relaunch reinstall kept the UUID, so "per install" is contradicted by the row's own data. What the two observations separate is an explicit `Addon:Uninstall` (pref entry cleared) from a shutdown (pref kept); for a signed install that persists until the user removes it, the origin is stable within the profile. The mechanism (what clears the pref) is UNCHECKED.
Severity: LOW
Class: internal-contradiction

FINDING 12 — PROGRESS.md:420-421

Claim (verbatim from file): "After `npm install` for #135's seven bumps the pre-push suite was green (60 Vitest, 22 Playwright) on `a8463b8`."
Falsifier (command/observation): `npm run test:unit` → `Tests  60 passed (60)`; `npx playwright test --list` → `Total: 22 tests in 1 file`; #135's subject "… with 7 updates". No printed line is cited; Sessions 32 and 33 cite `22 passed (18.0s)` / `22 passed (11.6s)` (`docs/SELF-REVIEW.md` §Before you write the word verified).
Ground truth: the counts are right today; the sentence carries no output. Same shape as Session 34's (:501), so a precedent, not a new habit — but the rule is per sentence.
Severity: LOW
Class: unverified-verification-claim

## Nits (not findings)

1. experiments.md:42 F4 "`#out` stayed empty twice, 2.5 s" — `run.mjs:37` waited 800 ms, `f9.mjs:23` 2,500 ms; one of the two was 0.8 s.
2. PROGRESS.md:449 "The runner's one failure" vs experiments.md:23 "The runner's first failure" — one of them is the count.
3. `launch-ff.sh:2` "Launch Firefox 152 on the scratch profile" — line 5 of the same file already says 159.
4. README.md:7-9's `marionette.mjs` list omits `uninstall`, `chromeAsync`, `cmd` and `close` (`marionette.mjs:46,51,53`), which `lib.mjs` and the runners use.
5. PROGRESS.md:484 "eight rows in one script" — `run.mjs` is F2 to F8 plus F9's write; F9's read-back is `f9.mjs` (as :439-440 says).

## Verified (so the dispatching context need not re-check)

- GitHub: #132 merged 18 Oct as `0fae782`; #134 and #135 merged by `Pushedskydiver` at 00:50:33Z and 00:50:46Z on 1 Nov as `6c42f70` and `a8463b8`; #136 open, base `main`, head `docs/CC-007-session-35`, created 01:04:44Z; #127's head was `docs/CC-006-session-31`, merged `6821ca5` (row 31's "#127"); #124's head `docs/CC-006-session-30`. `git ls-remote --heads origin`: `main`, `feat/CC-003-apca-3`, `chore/CC-004-copy-to-clipboard-4`, `docs/CC-007-session-35` (step 3's list).
- The four commits' subjects, order (`66f2fa9` first) and dates (1 Nov 2026, 00:57Z to 01:04Z); the "Session archive" line's "Sessions 30 and 31, 1 November 2026".
- `docs/history/SESSIONS.md` rows 30 and 31 against `git show 0fae782:PROGRESS.md` lines 644-790: every figure and hash (74/1, 2 LOW + 1 nit declined; 84% / §1; 2 MATERIAL, 6 LOW, 3 nits; "not NaN"; 1 MATERIAL; 89k → 141k; 141k / 176k / 208k; `30ed283`; `94595a8`, `c24ba57`; 24,309 → 19,692; `4587bfe` after two TLS timeouts; Sonnet ~171k, six commits, `refactor/CC-004-typed-messages`; 3 LOW; 95 / 9 / 2 / 6; `e21c271`, 24th case; `docs/TESTING.md:12`, fourth incident; `bd44e35` 16:25Z; 180k). Dates 7 and 16 October.
- The Session 34 confirm round: SUMMARY 4 of 4, 2 LOW, 4 nits, nit-floor (surrogate-s34-confirm.md:8); its LOW 1 struck at PROGRESS.md:535 with replacement, date and the F3 reading; LOW 2 overtaken (step 1 now "fold what they disprove or add"); nit 1 gone (experiments.md:30 reads "S1 to S5 and S7 to S9"); nits 2 to 4 left as records.
- Rows F2 to F9 against the scripts: every named field exists and is logged — senders' `tabId`/`frameId`/`url`/`origin` (`probe-bg.js:38-39`, `run.mjs:15-17`); `pingMs`, `captureKind`, `capture` (`probe-bg.js:24-31`); `permissions.getAll().origins` and `permissions.remove({ origins: ['<all_urls>'] })` (`:42-43`); the nodyn `extension.warnings` (`run.mjs:67`); F6's `panel` id + `browserSrc` and the time-filtered console (`run.mjs:55-59`, `f9.mjs:35-40`); F7's `imgW`/`imgH`/`redAt50`/`blueAt300` at `round(50·dpr)` (`probe-page.js:21-26`; 2,560 = 1,280 × 2, 1,682 = 841 × 2); F8's `firstPingMs`/`injectMs`/`secondPingMs` on `initChecker` itself (`inject-bg.js`), and `make-builds.mjs` replacing the product's `onClicked` block for `ext-inject`, so no second handler; the `probe-inject` error now stringified (`probe-bg.js:45`) and `public/app/content.js:8` `let scrollStopDelay = null`; F8's close-then-inject-then-click order (`run.mjs:89-94`); F9's `ls-set` of `background`, `foreground`, `colors` then `m.quit()` = `Marionette:Quit` (`run.mjs:96-99`, `marionette.mjs:52`), the `uuids` pref read before the reinstall (`f9.mjs:5,10`), `ls-get` after; `install` parks on `about:blank` first (`lib.mjs:7`); `clickToolbar` is `browserActionFor(policy.extension).triggerAction(window)` (`lib.mjs:40-44`). `content.js:217-240` ignores unknown types without a response, so `probe-ping` resolves when the script is resident and rejects when it is not (F5's inference to `initChecker` is sound: same tab, no listener).
- Session 34's untested alternatives (`web-ext run`, BiDi via Puppeteer) match `a8463b8`'s §Harness status; "152.0.3 is installed; updating it needs Alex" is in `0fae782`'s loading step; "Session 34 pattern 2" and "Session 35 pattern 3" exist; 108k = 196k − 88k; ~30k ≈ 173k − 142k; decision (l)'s cite to `git show 0fae782:PROGRESS.md` holds Session 31; no other live cite of Session 30 or 31 content remains in PROGRESS.md.
- Tooling: `firefox --version` → Mozilla Firefox 159.0; `xcodebuild -version` → Xcode 27.1; `prettier --check` passes on all six touched Markdown files (`03-sources/` is prettier-ignored; research 03 is not, see Finding 1); experiments.md:30-33's Safari sentence matches research 03:57-61 and S6's row.

## UNCHECKED (out of scope, not clean by assumption)

Session state and readings: the four-row readings table, 142k / 173k / 188k, "5-hour window resets at 05:30Z" and "weekly at 15:00Z on 6 November", "pushed at once", `../cc-surrogate` at `5efa3db` at session start, `gh pr merge 134` answering "already merged", "~1.5k output", "within a second", the profile's "22 files", the `da-review` dispatch (model, effort, worktree), Alex's closing message re-asking (a) to (f) and (h) to (k). Run readings with no repo record beyond the row: `frameId` 21474836481, `tabId` 3, the two UUID prefixes, the millisecond latencies, `customizationui-widget-panel`, the "uncaught exception: Object { message }" text. External behaviour stated from the run: Firefox 159 refusing the flag without the variable, `Addon:Uninstall` destroying extension-page tabs, no warning for a missing `data_collection_permissions` on a temporary install, what clears `extensions.webextensions.uuids`, whether `open -a Firefox` works with the sandbox off, `windowUtils.sendMouseEvent` / `EventUtils` as the F4 route.
