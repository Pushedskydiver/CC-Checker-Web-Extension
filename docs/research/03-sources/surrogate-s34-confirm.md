# copilot-surrogate — confirm round on the Session 34 fold (`5efa3db`, PR #132, `docs/CC-007-session-34`)

Worktree: `/Users/alexclapperton/Desktop/alex/colour-contrast-checker/cc-surrogate`, detached at `5efa3db`. R1 report under check:
`docs/research/03-sources/surrogate-s34.md` (on `985670c`). Fold diff: `git diff 985670c..5efa3db` — `PROGRESS.md`, `docs/GIT.md`,
`docs/research/03-sources/experiments.md`, plus the report file; `813c2e0` recorded #132 between them. No edits to the worktree. No PR comments posted.
This file is the one write outside the worktree, as the brief named.

SUMMARY: 4 of 4 R1 findings confirmed resolved; new sentences true; 0 BLOCKING, 0 MATERIAL, 2 LOW, 4 nits; nit-floor reached. 3 UNCHECKED (listed).

## (1) Each R1 finding, against the Review bullet (PROGRESS.md:436-448)

- **F1 (PR number, MATERIAL) — resolved.** `git grep -n '#132' 5efa3db -- PROGRESS.md` → :405 (entry's first paragraph, a link) and :785, :789
  (loading step 1). Fixed by `813c2e0` (17:58:57+01:00, 12 s after the PR's 16:58:45Z creation), before the report landed in `5efa3db` (18:06:50+01:00)
  — the bullet's "already fixed by `813c2e0`" is right.
- **F2 (every Safari row needs the packager, MATERIAL) — resolved.** experiments.md:26-30 now: Develop menu ("Add Temporary Extension…", Safari 18.4
  and later); "only S6, and S2's iPhone half, need the packager's Xcode project (research 03 §Does Safari need its own repo)". Loading step 5's Safari
  bullet (PROGRESS.md:815-817) rewritten to match. Both agree with research 03:57-61 and :256-258.
- **F3 (`CC-006` scope unbounded, LOW) — resolved.** docs/GIT.md:19-20 now "the session handoffs and archives of Sessions 20 to 33".
- **F4 ("§Ticket keys" named a bullet, LOW) — resolved.** PROGRESS.md:419 now "`docs/GIT.md`'s Ticket keys bullet"; `git grep 'Ticket keys' 5efa3db`
  finds only GIT.md:13 (the bullet) and that line.
- **Review bullet's counts vs the R1 SUMMARY line** ("~96 claims checked / 4 falsified / 0 BLOCKING, 2 MATERIAL, 2 LOW, 3 nits"): the bullet says
  "~96 claims, 4 falsified; 2 MATERIAL … 2 LOW … 3 nits declined" — matches. "Fable, `high`" matches the brief's model; "~193k tokens" UNCHECKED.
- **The three declined nits' justifications:** (g)'s strike is at research 03:342-344 in `docs/research/` — true; research 02 carries a strike
  (lines 93-96; its line 47 `~~strikethrough~~` is the convention named in prose) — "already strikes" true; decision (u) is in loading step 7 at
  PROGRESS.md:837-840, still open — true; `docs/GLOSSARY.md:132` names `safari-web-extension-converter` at `22bed93` too (`git grep` on that
  commit, same line) — "predates this PR" true. The `data_collection_permissions` justification: see LOW 1.

## (2) The new sentences

- **experiments.md:26-30 Safari sentence.** Research 03:57-61: "An Xcode project, needed for iOS testing and for any distribution … Not needed for the
  experiments in §What must be run: since Safari 18.4 a built folder installs temporarily from the Develop menu ("Add Temporary Extension…")". S6
  (research 03:276) runs the packager and `xcodebuild`, so it needs the project; S2 (:272) ends "Then on an iPhone", iOS = Xcode project. The
  wording "Add Temporary Extension…" and "18.4" also match research 03:256-258 and `03-sources/safari.md:144` (VERIFIED row). True. See nit 1.
- **docs/GIT.md:19-20 "Sessions 20 to 33".** `git log main` subjects: Session 19's close is `CC-005` (`5444852`, `3398776`); Session 20's close is
  `CC-006` (`f973aa4`, `9d242b0`; SESSIONS.md row 20 records Alex assigning `CC-006` that session); every "Close/Archive/Session N" subject from
  there to `22bed93` (Session 33's merge, `#129`) is `CC-006`, including Sessions 30 and 31 whose PROGRESS headings say `CC-004` (`903bceb`,
  `6821ca5`). `git log --format=%s b583a23~1..22bed93 | grep -v CC-006 | grep -iE 'session|archive|handoff'` prints nothing (the 15 non-`CC-006`
  subjects in the span are all `CC-004` code rows). SESSIONS.md holds rows 20-29; Sessions 30-33 are still in PROGRESS.md (:486-:717). True. See nit 2.
- **Review bullet** — see (1); counts and the four resolutions reproduce.
- **Loading step 1's bold sentence (PROGRESS.md:788-789).** The path matches :447 and this file's own path; "Session 34's MATERIAL fold" is the one
  MATERIAL that was folded (F2; F1 was `813c2e0`); "#132's branch" matches :785. True as a fact; see LOW 2 on its wording.

## (3) New in the fold — findings

FINDING LOW 1 — PROGRESS.md:443-444
Claim: "the harness manifests omit `data_collection_permissions`, which a temporary install does not need"
Falsifier: `grep -n data_collection docs/research/03-safari-firefox-ports.md docs/research/03-sources/firefox.md` — research 03:88-91 says the key is
"mandatory for a 'new extension submitted to addons.mozilla.org from November 3, 2025'" and that on Firefox 128 to 139 an unknown `gecko` sub-key is a
warning; firefox.md:74 records `MISSING_DATA_COLLECTION_PERMISSIONS` as a linter warning. Nothing in the repo records what a temporary install on
Firefox 152 does without it, and R1 nit 3 marked exactly that UNCHECKED.
Ground truth: the repo supports "an AMO-submission requirement, and a linter warning", not "a temporary install does not need it". The fold upgraded an
UNCHECKED behaviour claim to fact. The harness's first `Addon:Install` will settle it; until then write it as the inference it is.
Severity: LOW. Class: external-behaviour.

FINDING LOW 2 — PROGRESS.md:788-789 (loading step 1, read cold)
Claim: "it is the confirm round on Session 34's MATERIAL fold: commit it verbatim, fold anything it confirms"
Falsifier: `docs/DEVELOPMENT.md` §Verification rounds — a confirm-or-disprove round's actionable output is what it disproves or newly finds; what it
confirms needs no fold.
Ground truth: as written, the instruction tells Session 35 to fold the confirmations. Intended reading is "fold anything it disproves or adds" (this file:
two LOWs, four nits). Not false about the repo, but an operational sentence that inverts its own verb.
Severity: LOW. Class: reader-precision.

Nits (not findings):
1. experiments.md:26-27 "Safari rows (S1 to S9) need the Develop menu" includes S6, which the table (:50) labels CI and the same paragraph (:28-30)
   says needs no Safari UI. PROGRESS.md:815-817 says "S1 to S5 and S7 to S9". Pre-existing shape, rewritten by the fold; self-corrects two lines on.
2. docs/GIT.md:19-20 "Sessions 20 to 33": `e1c8f5a` (this branch, Session 34) is `docs: CC-006 - 📝 Archive Session 29` — a `CC-006` archive commit made
   in Session 34, after PROGRESS.md:420-421's "from this PR on … `CC-007`". Reads fine if "of Sessions 20 to 33" means the entries archived; off by one
   commit if it means the sessions that did the archiving.
3. The fold dropped "Allow unsigned extensions" from experiments.md:27 and PROGRESS.md:816-817. `03-sources/safari.md:163` (VERIFIED) ties that toggle
   to unsigned Xcode-built extensions; :144 describes the temporary route without it. Consistent with the sources; whether Safari 27's temporary install
   also wants the toggle is UNCHECKED, and the step already says "Ask, with the exact steps".
4. The R1 report, kept verbatim (surrogate-s34.md:72), says research 02 "already carries three strikes"; `grep -o '~~' docs/research/02-workflow-optimisation.md | wc -l`
   is 4 tokens = one strike (:93-96) plus the convention named at :47. The fold's own wording ("already strikes") is right; the record's count is not.
   Reports are records, not edited; noted for the next reader.

## UNCHECKED
"~193k tokens" and "past the soft line" for the R1 dispatch (session state); Firefox 152's temporary-install behaviour without
`data_collection_permissions` (LOW 1); whether Safari 27's "Add Temporary Extension…" route also needs "Allow unsigned extensions" (nit 3).

## Reproduced on the way
`git log --no-walk --format='%h %cI %s' 985670c 813c2e0 5efa3db`: 17:57:55, 17:58:57, 18:06:50 (+01:00), 18 October. `grep -n '^## Session' PROGRESS.md`:
34, 33, 32, 31, 30 (band 5 entries; step 2's "archive Session 30" is the right next one). Loading step 5 is the step holding the Safari bullet. The
`(g)` row at research 03:342-344 carries settled text in italics, the old text struck, dated 18 October 2026 (the form loading step 5 prescribes).
