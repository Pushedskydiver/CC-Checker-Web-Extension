_Recorded verbatim from the Session 33 `copilot-surrogate` R2 (confirm round) run on `6a738ac` (Fable 5.1, 17 October 2026): 0 BLOCKING, 0 MATERIAL, 5 LOW, 5 nits. The agent had no Write tool, so the report came back as its reply. Folded in Session 33 with the coordinator's manual pass; see `PROGRESS.md` §Session 33._

SUMMARY: ~165 claims checked, 5 falsified; 0 BLOCKING, 0 MATERIAL, 5 LOW, 5 nits

No report file written: the Write tool was not available in this run (not in the surfaced tool list), so per the brief's fallback the full report follows here. Please write it to `/private/tmp/claude-501/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension/01d1e362-d12d-4dd2-87fa-2a9604617b84/scratchpad/surrogate-r2.md` if you want it on disk.

# copilot-surrogate R2 (confirm round) — docs/CC-006-session-33 at `6a738ac`

Worktree `/private/tmp/claude-501/…/scratchpad/wt-surrogate2`, detached at `6a738ac`; `origin/main` = `6821ca5`. No edits made anywhere; the main checkout was not read. Scratch fetches went to `scratchpad/fetch-r2/` (three pages plus two BCD files), nothing was executed from them.

Post-filter set: 9 files / ~374 KB (`.prettierignore` 192, `PROGRESS.md` 69,486, `docs/ARCHITECTURE.md` 35,663, `docs/history/SESSIONS.md` 42,066, research 03 53,151, `firefox.md` 68,603, `grill-r1.md` 24,607, `safari.md` 60,703, `surrogate-r1.md` 19,647) — under the 20 / 400 KB ceiling. All nine read at HEAD in full, plus `public/app/background.js`, `public/app/content.js`, `test/e2e/fixtures.ts`, `test/e2e/extension.spec.ts` (cited parts), `public/manifest.json`, `package.json`, `.nvmrc`, `ci.yml`, `docs/GIT.md:12-15`, `docs/DEVELOPMENT.md` §One change in flight, `docs/SESSION-HANDOFF.md` §6 line, section headings of the cited docs. Instruction-file budget not run (`AGENTS.md`/`CLAUDE.md` untouched).

## Counts

- Claims extracted: ~165 (repo code/config 48; engine claims mapped to `03-sources/` rows 84; PROGRESS/SESSIONS archive and band figures 18; external pages fetched today 7; cross-doc pointers 8).
- Held: ~150. Falsified or misstated: 10 (0 BLOCKING, 0 MATERIAL, 5 LOW, 5 nits). UNCHECKED: 10 (listed at the end).
- All 16 `surrogate-r1.md` findings are folded (F1–F4, F6–F16 confirmed in the text; F5's pointer now reads "§Session 33" and resolves when that entry lands — not reported, per the brief). Spot-check of the grill's 25: B1/B2 → shape 3 and the consequence list; M1 → (j); M2 → S7; M3 → S8; M4 → F7; M5 → F8/S1 rewritten; M6 → table row + F9/S9; M7 → phase 1a; M8 → (c); M9 → (f); L1 → (k); L2 → (i) done; L3 → ESR; L4 → versions read; L5 → `build-firefox/`; L6 → phase 2 ignores; L7 → `document.body`; L8 → private windows; L9 → (c) worker; L10 → conditional; L11 → definition of done; N1–N3 folded. All present.

## Findings

FINDING 1 — docs/research/03-safari-firefox-ports.md:102-103
Claim (verbatim): "the eight rows below are the mechanisms they rest on, plus the store, which the `spec-grill` R1 (M6) added."
Falsifier: `awk 'NR>=106 && NR<=117' docs/research/03-safari-firefox-ports.md | grep -c '^|'` → 11 (header + separator + 9 body rows).
Ground truth: nine rows are below (the eight at `be835b7` plus the `localStorage` row M6 added). "The eight rows below" is the pre-fold count with the addition bolted on.
Severity: LOW. Class: stale-quantifier.
Fix: "the nine rows below are the mechanisms they rest on — the eight of `be835b7` plus the store, which the `spec-grill` R1 (M6) added."

FINDING 2 — docs/research/03-safari-firefox-ports.md:113 (Safari cell of the `action.openPopup` row)
Claim (verbatim): "`docs/ARCHITECTURE.md` says it "is not available"; that is stale."
Falsifier: `sed -n '365,368p' docs/ARCHITECTURE.md` at HEAD → "`chrome.action.openPopup` exists from Safari 16 (… this bullet said "not available" until then)"; `git diff origin/main...6a738ac -- docs/ARCHITECTURE.md` shows the rewrite in this PR; the research's own §Corrections (line 347) says "rewritten here".
Ground truth: the present-tense sentence was true at `be835b7` and is false at `6a738ac`; the fold rewrote the target but not this cell.
Severity: LOW. Class: internal-contradiction / unstruck-superseded-claim.
Fix: "`docs/ARCHITECTURE.md` said "is not available" until this PR rewrote it (§Corrections)."

FINDING 3 — docs/research/03-sources/surrogate-r1.md:1 (Session 33 preamble), restated at PROGRESS.md:418
Claim (verbatim): "0 BLOCKING, 4 MATERIAL, 10 LOW, 2 nits."
Falsifier: `grep -c 'Severity: MATERIAL' docs/research/03-sources/surrogate-r1.md` → 4; `grep -c 'Severity: LOW'` → 9 (F5–F13); `grep -c 'Severity: nit'` → 3 (F14, F15, F16).
Ground truth: the report's sixteen findings grade 4 / 9 / 3. Its own line 16 ("10 LOW, 2 nit") is the R1 reviewer's self-miscount — a verbatim record, so leave it — but the preamble is new Session 33 prose that copied the summary without re-deriving, and the Session 32 entry restates it. (The grill preamble's 2 / 9 / 11 / 3 reproduces: `grep -cE '^### B[0-9]'` 2, `M` 9, `L` 11, `^- N[0-9]` 3.)
Severity: LOW. Class: stale-quantifier / duplicate-fact-drift.
Fix: preamble "0 BLOCKING, 4 MATERIAL, 9 LOW, 3 nits (its own §Counts says 10 and 2; the sixteen findings grade 4/9/3)"; same correction, or a note, in the Session 32 entry's sentence or Session 33's.

FINDING 4 — docs/ARCHITECTURE.md:369 and docs/research/03-safari-firefox-ports.md:348-349
Claim (verbatim): "`web_accessible_resources[].use_dynamic_url` is Chrome-only in effect" / "`use_dynamic_url` is Chrome-only in effect rather than "Chromium-only"".
Falsifier: `curl …/mdn/browser-compat-data/main/webextensions/manifest/web_accessible_resources.json` → `use_dynamic_url` support: chrome 130, **edge "mirror"**, firefox false, safari 14 partial ("always dynamic"). `docs/ARCHITECTURE.md:380` in the same section: "Edge is Chromium and loads the same zip".
Ground truth: Edge honours the key exactly as Chrome does (BCD mirror), so the old word "Chromium-only" was the accurate one; the rewrite narrowed it to "Chrome-only" with a BCD citation that only establishes the Chrome 130 floor. Edge is the browser the same section says ships this zip.
Severity: LOW. Class: reader-precision / external-behaviour.
Fix: "Chromium-only in effect (Chrome 130 and Edge, which mirrors it): Firefox does not support the key, and Safari's host changes on every launch whatever the manifest says." Same in the research's §Corrections bullet.

FINDING 5 — docs/research/03-safari-firefox-ports.md:30-31
Claim (verbatim): "(seven VERIFIED rows carry an UNVERIFIED tail, where its footer estimates "about ten"; all are repeated in its Open points)."
Falsifier: `grep -nE '^\|.*\| *VERIFIED[^|]*UNVERIFIED[^|]*\|$' docs/research/03-sources/firefox.md` → lines 65, 95, 113, 145, 146, 161, 169 (seven — reproduces). `sed -n '361,374p'` (Open points 1–12): 65 → point 10; 95 and 145 → point 3; 161 → point 6. **113** (Android `captureVisibleTab` on a device), **146** (Firefox behaviour for tabs already open at install) and **169** (UUID stable within a profile) have no Open point.
Ground truth: four of the seven are repeated in the source's Open points, not all; the "picks up" sentence is the source footer's own claim restated. (169 is this file's F9; 146 is what shape 3's ping covers; 113 is out of scope until Android.)
Severity: LOW. Class: reader-precision / stale-quantifier.
Fix: "four of which its Open points repeat; rows 113, 146 and 169 are not there (169 is F9 below)".

Nits (not graded above):
- N1 — research:137 "every one of the 22 e2e tests loses its resident content script": `sed -n '7,34p' test/e2e/extension.spec.ts` — test 1 ("registers and classifies restricted URLs") uses only the `serviceWorker` fixture and opens no page, so 21 of 22 would be affected. Fix: "21 of the 22 e2e tests (every one that opens a page)".
- N2 — research:155-158 lists six top-level declarations; `grep -nE '^(const|let|var) ' public/app/content.js` → seven: `const getCanvasWrapper` at line 64 is omitted (the grill's B1 listed it). Not claimed exhaustive, so a nit.
- N3 — research:191-193 (ESR dates), checked against the fetched <https://whattrainisitnow.com/calendar/>: 143.0 on 2025-09-16 with "128.15 + 140.3" (held: 128.15 was ESR 128's last); 144.0 on 2025-10-14 with "140.4" alone (held: 140 the only ESR from then); 153.0 shipped 2026-07-21 beside 140.13, 157.0 on 2026-09-29 with "140.17 + 153.4", and 158.0 on 2026-10-13 with "153.5" alone. So "succeeded by ESR 153 on 13 October 2026" holds on the only-ESR reading but could be read as ESR 153's first release (21 July 2026); and ESR 140's own last build was 140.17 on 29 September 2026, which does not change (b) (a floor admits everything above it) but is worth one clause.
- N4 — research:138 "`page` fixture waits for `document_idle`": `test/e2e/fixtures.ts:112-114` waits for `load` then 300 ms, with the comment "content scripts are registered at document_idle". Paraphrase, not the mechanism.
- N5 — research:36 "Nothing in the repo was changed by the research." True of Session 32's research; this PR's fold changed `docs/ARCHITECTURE.md` (§Corrections). Reader trip only.

## Held — the load-bearing ones (command and result)

- Code cites in §The one design change and the experiments: `background.js` 26 and 58 `chrome.tabs.sendMessage`, 84 `.captureVisibleTab(…)` (83–88 the chain), 33 `await chrome.action.setPopup`, 43 `await chrome.action.openPopup()`, 63–64 the "tab that was open before the extension was installed/updated" comment; `isRestrictedUrl(undefined)` → `true` (line 20); `content.js` 166/187/188 `document.body.appendChild` unguarded; listener registered at 217 and never removed; `closeChecker` (200–212) removes DOM only; manifest `run_at: document_idle`, `permissions: ["activeTab"]`, WAR with `use_dynamic_url: true`; `fixtures.ts` `openChecker` sends `initChecker` (140–143) and the harness never clicks the toolbar; `test.use({ patched: true })` at spec:678 covers exactly the three picker tests (680, 717, 728); `undefinedUrl` at spec:19/28; `grep -cE '^\s*test\('` → 22.
- Counts: `src/` `chrome.` lines → 6 calls (color-picker-cta 32, 38; actions 16; useColorPicked 17, 50, 53) + 1 type reference (useColorPicked:25). safari.md 143 / 129 / 11 / 3 and firefox.md 168 / 151 / 13 / 4 reproduce from the Status column (header/separator rows excluded). firefox.md footer line 378 says "about ten". Research 03 at `be835b7` is 258 lines (Session 32 entry's figure holds).
- Row numbers cited all equal line numbers and say what the file says: safari 25 (worker advice), 41 (chrome.* Promise UNVERIFIED), 65 (`tab.url`), 105 (`moveLocalStorageIfNeeded`), 109 and 193 (Apple-staff forum replies, VERIFIED), 113 (per-launch UUID UNVERIFIED), 219 (`scripting` in `supportedPermissions()`); firefox 49 (should load in both, UNVERIFIED), 64 (older Chrome warning, SOURCES DISAGREE), 114 (device-pixel capture UNVERIFIED), 130 (registered scripts need host permission), 169 (UUID stability UNVERIFIED). Forum rows marked VERIFIED are 109, 111, 193 of safari.md, all Apple staff (111 is the same thread as 109 plus BCD), so the rewritten method sentence holds.
- Quotes: `PROGRESS.md:297` "Re-entry: the Safari `browser.*` shim"; `:229-232` item 4 "now also the re-entry condition for giving `public/app/*.js` a build and a shared `messages.ts`"; `:229-230` "Let's look at safari and Firefox too"; `docs/GIT.md:13-14` "keys in Alex's own tracker"; `docs/ARCHITECTURE.md:381` "Firefox is not a target and nothing has been checked against it"; `:415` "Safari has no `featurePolicy`".
- Sections exist as cited: ARCHITECTURE §The one decision (four numbered consequences), §Testing seam, §Safari and other browsers (still five bullets), §Deliberately not changed; TESTING §Why the picker tests use a patched manifest; REVIEW-PATTERNS §6 "Double delivery"; DEVELOPMENT §One change in flight (a PR touching the three contexts "is three changes"), §Merged is not published, §Verification rounds; GIT §Releases, §Merge strategy. `scripts/package.mjs` exists; `.nvmrc` 24 and `ci.yml` `node-version-file: .nvmrc`; `browserslist` `chrome >= 111`; both `version` fields 2.1.0; `package.json` name/description and `README.md:3` say "chrome extension"; `.prettierignore` lists `02-sources/` and `03-sources/`; `gh repo view` → PUBLIC.
- External, fetched today: Chrome permissions list — `activeTab` "Gives temporary access to the active tab through a user gesture" and `scripting` "Gives access to the chrome.scripting API", neither with a "Warning displayed" line; MDN `incognito` — "By default, extensions do not run in private browsing windows. Whether an extension can access private browsing windows is under user control."; BCD `api/Document.json` `featurePolicy`: safari `false`, firefox "69" behind `dom.security.featurePolicy.webidl.enabled` (research:352-355 holds). Mac: `defaults read …/Safari.app/…` → 27.0, `sw_vers -productVersion` → 27.0, Firefox → 152.0.3.
- ARCHITECTURE §Safari bullets vs sources: openPopup from 16 (safari 89–90), `setPopup` `null` from 18 and `''` UNVERIFIED (95), packager rename (135), Firefox no `use_dynamic_url` (firefox 163), Safari host per launch and WebKit not reading the key (safari 104, 107). The diff touches exactly those three bullets, as §Corrections and decision (i) say.
- Archives and band: rows 27 and 28 of SESSIONS.md reproduce every figure in `git show 6821ca5:PROGRESS.md` sessions 27–28 (0 of 34 / 2 nits; ~286k, ~21 min, `ae49392`; 2,577 B n=28 vs 10,295 B n=92; 7 hunks / 33 lines; 9.7k–17.8k; four corrections; ~10 points; 151k/173k; 1 of 39; 77k→112k→146k; 146k/168k; `bcd5bc1`). `22391af`'s message: "5 entries and 26,578 bytes with Session 32's entry" reproduces at its parent `9297c26` (awk → 26578, 5 headings); "4 entries and 22773" reproduces at `22391af` and HEAD. Session 32 entry: 25,572 at `6821ca5` and 19,939 / 4 at `f7f3077` both reproduce. Session 29's "Session 28 pattern 2, in `git show 6821ca5:PROGRESS.md`" (PROGRESS:617) and Session 32's "Session 28 pattern 1 … `git show 6821ca5:PROGRESS.md`" (:399-400) point at a `main` commit that holds both entries. §Session archive: "Session 27, 17 October 2026; Session 28, 17 October 2026" — `git log --format=%ci f7f3077 22391af` → both 2026-10-17.

## UNCHECKED

1. research:155-159 — that `scripting.executeScript` re-running a classic script re-declares top-level `const`/`let` and throws `SyntaxError` before any guard runs (ECMAScript global declaration instantiation; no repo observation; not run).
2. research:216 — Vite's `publicDir` default name; `docs/ARCHITECTURE.md` §Build pipeline records the verbatim copy, the option name was not checked.
3. research:246-247 — `about:debugging` temporary load of a built folder; the file marks it "not re-checked here".
4. research:237 — `npm ci && npm run build` byte-identical rebuild; not built twice.
5. research:20 — the two research agents were "Fable 5.1, `high`"; only PROGRESS Session 32's say-so.
6. research:8-9 — "review state is in `PROGRESS.md` §Session 33"; resolves when that entry lands (not reported, per the brief).
7. PROGRESS:394 and :691 — "60 Vitest": `it.each` tables make a grep count unreliable and the worktree has no `node_modules`; held on the recorded `npm run test:unit` output in Sessions 31 and 32.
8. research:248-249 — "as research 02's fold was" (rows rewritten in place with a dated note); research 02 has two matching phrases but was not read in full.
9. research:80-81 — Safari runs `scripts` as a page when both background keys are present; carried from safari.md rows 27–28 (MDN + a WebKit comment), not run.
10. research:114, :227 — Chrome 148 exposes `browser.*`; carried from firefox.md row 213 (MDN), not re-fetched.

## NOTICED BUT NOT TOUCHING

- The band at HEAD is 4 entries / 22,773 bytes; a Session 33 entry of the usual 4–6 KB crosses `docs/SESSION-HANDOFF.md` §6's 24,000-byte line, so a Session 29 archive is probably due in this PR — the coordinator's call.
- PROGRESS:8-14 ("Updated … end of Session 32": "both force on-click injection") and loading step 5 ("F1 to F6 and S1 to S6", "18.4 or later") describe `be835b7`'s pre-fold state; dated, not reported, but Session 33's "Updated" paragraph and loading block must supersede them (the recommendation is now shape 3, ping-then-inject; experiments are F1–F9 and S1–S9).
- The installed Firefox 152.0.3 is six releases behind 158.0 (13 October 2026 on the calendar fetched); phase 0 would run on a stale build unless updated first. Advice, not a finding.
