# copilot-surrogate — confirm round on the Session 35 surrogate fold (PR #136, `81c69e8` over `237d677`)

Worktree: `/Users/alexclapperton/Desktop/alex/colour-contrast-checker/cc-surrogate`, detached at `81c69e8`, every read there;
no edits, no PR comments, Firefox not launched (its version read from `Firefox.app/Contents/Info.plist`). This file is the one
write. Under check: `docs/research/03-sources/surrogate-s35.md` (R1, against `237d677`) and `git diff 237d677..81c69e8`
(PROGRESS.md +24/−12, research 03, experiments.md, ff-harness/README.md, ff-harness/f1.mjs new, surrogate-s35.md new).
`AGENTS.md` and `CLAUDE.md` untouched, so the budget awk was not run.

SUMMARY: R1 findings 11 confirmed resolved / 0 disproved / 1 open (LOW 4, left by name; its loading-step pointer is wrong,
Finding 1). New: 0 BLOCKING, 1 MATERIAL, 2 LOW, 1 nit; R1's nits 2 to 5 remain as records. ~45 claims checked in the fold's
new prose, 3 falsified; 6 UNCHECKED (listed at the end).

## R1's findings, one by one

- **MATERIAL 1 (table split by the note) — CONFIRMED resolved.** Prettier's Markdown parser on research 03 at `81c69e8`
  (`require('prettier').__debug.parse(src, { parser: 'markdown' })`, node types by line): `paragraph 263-263`, `table 265-284`
  with 19 rows (header + 18), `heading 286`. At `237d677` the same read gave `paragraph 263-264`, `paragraph 266-284`.
  `prettier --check` passes on the file, now with a padded table it can see.
- **MATERIAL 2 (`f1.mjs` missing) — CONFIRMED resolved.** `git ls-files docs/research/03-sources/ff-harness/` lists `f1.mjs`
  (14 files). Its four imports (`open`, `install`, `probe`, `log`) are exported by `lib.mjs:5,6,23,50`; `m.version` is set by
  `open` (`lib.mjs:5`), `m.chrome(script, args)` and `m.close()` exist (`marionette.mjs:45,53`); `probe(m, 'do=results')`
  navigates to `probe.html?do=results` (`probe-page.js:7-8`), which sends `probe-results`, answered with `{ F1, results, log }`
  (`probe-bg.js:40`), so `r.F1` is the F1 row's data; the `extension.warnings` read on `ext-manifest` is the F3 row's
  `ext-manifest` half, the same expression `run.mjs:67` uses for the nodyn build; the literal id matches `lib.mjs:2` and
  `make-builds.mjs:12`. README.md:29's new entry ("F1 and the manifest warnings") describes what the script does.
- **MATERIAL 3 (re-dispatch range) — CONFIRMED resolved.** `git merge-base main 81c69e8` → `a8463b8`; `git log --oneline
  a8463b8..81c69e8` prints five commits, `66f2fa9` included. PROGRESS.md:755 now reads "`a8463b8..` the branch head".
- **LOW 1 (entry count) — CONFIRMED.** `grep -c '^## Session [0-9]'` on the band: `66f2fa9` → 3, `237d677` → 4, `81c69e8` → 4.
  PROGRESS.md:427 says 3, :757 says 4.
- **LOW 2 (−141) — CONFIRMED.** `git diff --numstat a8463b8..237d677 -- PROGRESS.md` → `133 172`; PROGRESS.md:453 says +133/−172.
- **LOW 3 (README's flag sentence) — CONFIRMED as a contradiction removed.** README.md:8-9, :24 and `launch-ff.sh:5,7-8` now
  agree (159: the variable; the flag kept). The new sentence's "152 took the flag" is Finding 3.
- **LOW 4 (research 03's open rows) — OPEN, by name** (PROGRESS.md:453-458 and the step-5 bullet). The pointer is wrong: Finding 1.
- **LOW 5 (five routes) — CONFIRMED.** Session 34's record (PROGRESS.md:523-525): three launch routes plus headless left the
  profile uninitialised; `open -a Firefox --args` dropped its arguments. PROGRESS.md:436-437 and :487 now say four and the fifth.
- **LOW 6 ("Alex updated it") — CONFIRMED.** experiments.md:6 reads "it was updated between the sessions".
- **LOW 7 (27.0 / 27.0) — CONFIRMED.** `sw_vers -productVersion` → 27.0.1; `defaults read /Applications/Safari.app/Contents/Info.plist
  CFBundleShortVersionString` → 27.0.1; `xcodebuild -version` → Xcode 27.1; Firefox's `Info.plist` → 159.0 (all 1 November 2026).
  experiments.md:5 matches.
- **LOW 8 (UUID "per install") — CONFIRMED.** experiments.md:47 now separates a restart (UUID kept) from an `Addon:Uninstall`
  (changed), which is what the row's two observations differ in: `f9.mjs:5` reads the pref after the relaunch and before
  `install`, whose uninstall-first throws and is caught for an add-on already gone at shutdown (`lib.mjs:8`), while `run.mjs`'s
  four `install` calls in one session each uninstall live (`run.mjs:9,66,69,96`). The pref is not read after an uninstall, so
  "clears the id's UUID" is the inference from the one differing variable, not a read — UNCHECKED mechanism, as R1 said.
- **LOW 9 (no printed line) — CONFIRMED in shape.** PROGRESS.md:421 now cites `Tests  60 passed (60)` and `22 passed (14.3s)`,
  the forms Vitest and Playwright print and the forms Sessions 32 and 33 cite (:598, :675). The 14.3 s itself is UNCHECKED.

R1's nits: nit 1 (F4's 0.8 s / 2.5 s) — `run.mjs:37` 800 ms, `f9.mjs:23` 2,500 ms, still both; nits 2, 3, 5 (PROGRESS.md:448
"one failure" vs experiments.md:23 "first failure"; `launch-ff.sh:2` "Firefox 152"; PROGRESS.md:490 "eight rows in one
script") and nit 4 (README's `marionette.mjs` list) are untouched and the fold does not claim them. Records, left.

## Findings

FINDING 1 — PROGRESS.md:781-784 (loading step 5, the "Research 03's open rows" bullet, read cold)

Claim (verbatim from file): "§What must be run's prose, §Minimum versions and §Decisions for Alex still read F1, F2, F5, F6
and F9 as open, say "152.0.3 … update Firefox first" and "from about:debugging"."
Falsifier (command/observation): `grep -nE '\bF[1-9]\b|152\.0\.3|about:debugging' docs/research/03-safari-firefox-ports.md`
against `grep -n '^#'` (section bounds). §Minimum versions (:193-211) contains no F-row, no "152.0.3" and no "about:debugging".
The sentences that read F1, F2, F5, F6 and F9 as open are at :72 and :82 (§What does Firefox need), :112, :115, :116, :117,
:118 (§The mechanisms, engine by engine — the table cells R1 cited) and :124 (§The one design change the ports force); and
§Does `public/app/*.js` need a build (:216, :220, :233: "the question is open, not closed: it fires if F1 or S8 shows …", "if F2
or S3 shows …", "If F1 or S8 shows …") reads F1 and F2 as open too, which R1's list did not include. §What must be run's prose
(:255-256) holds the "152.0.3 … update Firefox first" and "about:debugging" sentences, as the pointer says; §Decisions for Alex
holds F3 at :332 and a conditional "If F6 or S5 fails" at :354.
Ground truth: of the three sections the pointer names, one holds nothing to rewrite (§Minimum versions) and one holds only F3
and a conditional (§Decisions for Alex); the four sections holding the F1/F2/F5/F6/F9-as-open sentences (§What does Firefox
need, §The mechanisms engine by engine, §The one design change, §Does `public/app/*.js` need a build) are not named. Session 36
following the sentence as written rewrites the wrong sections and leaves the mechanisms table — the one R1 pointed at — as it
is. The set is larger than R1's LOW 4 listed; re-derived with the grep above, it is :72, :82, :112, :115-118, :124, :216, :220,
:233, :255-256, :332 and :354. Write the pointer as the section list (or the line list) above.
Severity: MATERIAL (an operational sentence in the loading block; the consequence is an incomplete fold, not a push or an upload)
Class: reader-precision

FINDING 2 — PROGRESS.md:757 (loading step 2)

Claim (verbatim from file): "with Session 35's entry the band is 4 entries and 27,454 bytes, over the 24,000-byte line."
Falsifier (command/observation): `docs/SESSION-HANDOFF.md:122`'s awk on `git show <c>:PROGRESS.md`: `a8463b8` → 31,237;
`66f2fa9` → 20,331; `237d677` → 27,454; `81c69e8` → 28,515 (the three known figures reproduce; the fold's +24/−12 to the
Session 35 entry — the Review bullet grew by eight lines — added 1,061 bytes). Entries: 4 at both.
Ground truth: 27,454 is the figure at `237d677`, written into a commit that itself moved it to 28,515. The count is right,
the conclusion (over the line, archive Session 32) holds, and the step says "Re-measure"; the number is stale in the commit
that states it. Write 28,515, or drop the byte figure and keep "over the line (re-measure)".
Severity: LOW
Class: stale-quantifier

FINDING 3 — docs/research/03-sources/ff-harness/README.md:8-9 (new in the fold); also PROGRESS.md:438 and :495, launch-ff.sh:5

Claim (verbatim from file): "needs `MOZ_REMOTE_ALLOW_SYSTEM_ACCESS=1` in Firefox's environment on 159; 152 took the
`--remote-allow-system-access` flag"; PROGRESS.md:438 "(the 152 flag no longer grants it)"; :495 "152 took a flag, 159 takes
an environment variable"; launch-ff.sh:5 "152 took the flag (kept)".
Falsifier (command/observation): Session 34's record, PROGRESS.md:566-571 — on 152.0.3 Firefox "never initialised the profile
… never listened, and either exited within seconds or hung", so no Marionette session and no chrome-context script ever ran
on 152; `grep -rn 'remote-allow-system-access' docs/research/03-sources/firefox.md` → nothing (no source row); the Session 34
surrogate listed "`--remote-allow-system-access` semantics" as UNCHECKED (surrogate-s34.md:88); R1 listed "Firefox 159 refusing
the flag without the variable" as UNCHECKED. The repo records one observation: 159's error text (experiments.md:19-20).
Ground truth: that the flag ever granted system access on 152 is not observed anywhere in the repo; Session 34 chose it from
reading and never got far enough to test it. The fold rewrote the README sentence (LOW 3's fix) into a form that states it
as fact, and PROGRESS.md states it twice more. experiments.md:20's "the 152-era flag" is the hedged form. Nothing
operational rests on it — `launch-ff.sh` exports the variable and keeps the flag — so LOW; write "the flag the harness was
written against" or cite where 152's acceptance came from.
Severity: LOW
Class: external-behaviour

## Nit (not a finding)

1. PROGRESS.md:14 "Next: fold its two review reports" was written when the two were `surrogate-s35.md` and `da-review-s35.md`;
   after the fold the two outstanding are `da-review-s35.md` and this confirm round (step 1 says so). The count holds, the
   referent moved.

## Verified (so the dispatching context need not re-check)

- The Review bullet's figures against R1's SUMMARY line: ~115 claims, 12 falsified, 0 BLOCKING, 3 MATERIAL, 9 LOW, 5 nits; its
  mapping of LOW 1, 2, 3, 5, 6, 7, 8, 9 to R1's Findings 4, 5, 6, 8, 9, 10, 11, 12 and LOW 4 to Finding 7; "moved above the
  header", "copied in", "fixed" each match the diff.
- Loading step 1: `surrogate-s35.md` is tracked at `81c69e8` (committed verbatim with its fold, as the bullet says); the main
  checkout's `docs/research/03-sources/` holds no `da-review-s35.md` and no `surrogate-s35-confirm.md` yet (`git status --short`
  clean), which the step's "may be waiting" and "a report still missing is a reviewer that died" already cover.
- Step 3's `firefox --version` expectation (159.0) against `Firefox.app/Contents/Info.plist`; step 5's "its line above the
  table" is research 03:259 ("rewritten in place with a dated note"), and the Session 35 note now sits above the table (:263).
- Research 03:263's note, unchanged in content, against experiments.md rows F1 to F9 (no shim, relay unchanged, warning, popup
  after the await, loupe maths, shape 3 and the `let` redeclaration, `localStorage` survives, F5's two halves, F4 top-level only).
- PROGRESS.md:439-440's script list against the tree: `smoke.mjs` prints the session, `Services.appinfo.version` and the
  `Addon:Install` result (:5-8); `run.mjs` is F2 to F8 plus F9's write ending in `m.quit()` = `Marionette:Quit`; `f9.mjs` is the
  read-back plus the F4, F6 and F8 retests.
- The entry's "`../cc-surrogate` removed" (Session 34's) against step 3's "`../cc-surrogate` and `../cc-da` if the reviewers
  left them": consistent (this round re-created it, per its brief, and leaves it).

## UNCHECKED (out of scope, not clean by assumption)

Whether the committed `f1.mjs` is byte-identical to the script that ran on 1 November (no run output in the repo); the
`22 passed (14.3s)` duration; what `Addon:Uninstall` does to `extensions.webextensions.uuids` (inferred, not read); whether
`--remote-allow-system-access` alone granted system access on any Firefox (Finding 3); the two reviewers' dispatch details
(model, effort, worktrees); the `da-review-s35.md` report's existence or content at the time of writing (absent from the main checkout).
