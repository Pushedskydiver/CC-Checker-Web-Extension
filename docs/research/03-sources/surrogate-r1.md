_Recorded verbatim from the Session 32 `copilot-surrogate` run on `be835b7` (Fable 5.1, 17 October 2026): 0 BLOCKING, 4 MATERIAL, 9 LOW, 3 nits (its own §Counts says 10 and 2; the sixteen findings grade 4/9/3). Folded in Session 33; the fold and its confirm round are in `PROGRESS.md` §Session 33._

# copilot-surrogate R1 — docs/research/03-safari-firefox-ports.md (be835b7)

Worktree: /private/tmp/claude-501/-Users-alexclapperton-Desktop-alex-colour-contrast-checker-CC-Checker-Web-Extension/9b1cd162-9153-4afc-acae-6506728c2cd8/scratchpad/wt-surrogate, HEAD `be835b7`, `main` = `6821ca5` (matches the file's header). No edits made anywhere.

Files read at HEAD in full: `docs/research/03-safari-firefox-ports.md` (259 lines), `.prettierignore`, `docs/research/03-sources/safari.md`, `docs/research/03-sources/firefox.md` (as evidence base, not fact-checked row by row), plus the cited parts of `public/app/background.js` (whole file), `public/app/content.js`, `src/**`, `public/manifest.json`, `package.json`, `.nvmrc`, `.github/workflows/ci.yml`, `scripts/`, `test/e2e/fixtures.ts`, `docs/ARCHITECTURE.md`, `docs/GIT.md`, `PROGRESS.md`. Re-fetched today: playwright.dev/docs/chrome-extensions, docs.github.com about-billing-for-github-actions, MDN `background` and `activeTab_permission` pages, actions/runner-images macos-15 README, BCD `api/Document.json`.

**Scope note.** `git diff main...HEAD --name-only` lists six files, not two: `.prettierignore`, `PROGRESS.md`, `docs/history/SESSIONS.md`, the research file and the two sources. `PROGRESS.md` and `SESSIONS.md` come from `f7f3077` "Archive Session 27" (3 insertions, 76 deletions), which is on this branch and not on `main`. Per the brief I did not walk them; they need a surrogate pass before the PR (archive counts, §Session archive index).

Instruction-file budget: not run — `AGENTS.md` / `CLAUDE.md` untouched.

## Counts

- Claims extracted: ~140 (repo facts 38, engine claims mapped to source rows ~88, external fetches 4, cross-references 8).
- Held: ~118. Falsified or misstated: 16 (0 BLOCKING, 4 MATERIAL, 10 LOW, 2 nit). UNCHECKED: 6 (listed at the end).
- Source-file counts reproduce exactly: safari.md 143 rows / 129 VERIFIED / 11 UNVERIFIED / 3 SOURCES DISAGREE; firefox.md 168 / 151 / 13 / 4 (Node script over the Status column, header and separator rows excluded; firefox.md's own footer line 378 says the same).
- Both coordinator fetches quoted accurately: Playwright "Extensions only work in Chromium when launched with a persistent context" is verbatim; GitHub's page says "GitHub Actions usage is free for self-hosted runners and for public repositories that use standard GitHub-hosted runners" and "The use of standard GitHub-hosted runners is free: In public repositories" — the file's paraphrase holds; `gh repo view` → PUBLIC. macos-15 README line 167: "16.4 (default)" — holds.

## Findings

FINDING 1 — docs/research/03-safari-firefox-ports.md:154
Claim: "Neither port renames a message or adds a context, so §Next workstreams item 4's re-entry condition does not fire."
Falsifier: `grep -rnE 'renames? a message|adds? a (new )?context|Re-entry: the Safari' PROGRESS.md docs/*.md docs/history/SESSIONS.md` → only PROGRESS.md:289.
Ground truth: PROGRESS.md:289 records the shared-`messages.ts` re-entry condition as "**Re-entry: the Safari `browser.*` shim.**" ("No message name has ever been renamed" is rationale, not the condition). PROGRESS.md:218-219 says item 4 (the Safari/Firefox work) "is now also the re-entry condition for giving `public/app/*.js` a build and a shared `messages.ts`". No "renames a message or adds a context" condition exists anywhere in the repo. The file itself proposes that very shim at lines 110 and 163-165 (`globalThis.browser ?? chrome`, `src/utils/browser-api.ts`), so the recorded condition may fire if F1 fails.
Severity: MATERIAL. Class: factual-claim-against-code / internal-contradiction.
Fix: quote the real condition and say whether it fires: "PROGRESS.md records the re-entry as 'the Safari `browser.*` shim'; if F1 shows the shim is needed, the shared `messages.ts` question reopens with it — otherwise not."

FINDING 2 — docs/research/03-safari-firefox-ports.md:190 (F1) and :110
Claim: "Does `chrome.tabs.sendMessage(...)` with no callback return a Promise? (`background.js` lines 26, 58 and 83 depend on it.)" / "which `background.js` relies on in three places".
Falsifier: `cat -n public/app/background.js` lines 24-27, 57-61, 83-85.
Ground truth: line 26 `chrome.tabs.sendMessage(...).catch(...)` and line 58 `await chrome.tabs.sendMessage(...)` are sendMessage; lines 83-84 are `chrome.tabs.captureVisibleTab(...).then(...)`, a different API. Lines 33 and 43 also `await chrome.action.setPopup/openPopup` (the reset-before-openPopup ordering depends on those being Promises). firefox.md row 212 words it correctly ("`chrome.tabs.sendMessage(...).catch`, `chrome.tabs.captureVisibleTab(...).then`"); the main file narrowed it to sendMessage and kept the three line numbers.
Severity: MATERIAL (a wrong line citation in the experiment that decides the shim). Class: factual-claim-against-code.
Fix: "Do callback-less `chrome.tabs.*` / `chrome.action.*` calls return Promises? (`background.js` 26 and 58 `sendMessage`, 84 `captureVisibleTab`, 33 and 43 `action.*`.)"

FINDING 3 — docs/research/03-safari-firefox-ports.md:25 (and :108, :21-25 method)
Claim: "Forum posts are cited only as secondary and never as VERIFIED." (Both source preambles, line 1, say the same.)
Falsifier: `grep -n 'forums/thread' docs/research/03-sources/safari.md` → rows at lines 109, 111, 193 all end `| VERIFIED |`.
Ground truth: safari.md row 109 (developer.apple.com/forums/thread/788670, Apple Frameworks Engineer reply, June 2025) and row 193 (forums/thread/723757, Apple, Jan 2023) are forum posts marked VERIFIED; row 111 cites 788670 alongside BCD. The main file's line 108 "An Apple engineer gave exactly this recipe in June 2025" rests on row 109. The method statement is false for the Safari report, and the primary-source list at lines 21-25 omits Apple-staff forum replies, Chromium source and Mozilla's blog, all of which VERIFIED rows rest on.
Severity: MATERIAL (it defines what the VERIFIED label means for every row cited). Class: internal-contradiction.
Fix: "Forum posts count as primary only where the reply is from Apple staff (safari.md rows 109, 193); other forum posts are secondary and never VERIFIED." Add Chromium source and blog.mozilla.org to the primary list.

FINDING 4 — docs/research/03-safari-firefox-ports.md:111 and :116-117
Claim: "On a revoked site `initChecker` finds no listener and the error popup appears." / "Firefox works on a fresh install (127 and later) but shows the error popup on any site the user has revoked".
Falsifier: firefox.md rows 143 ("Does `activeTab` plus a toolbar click make a manifest-declared content script run on an ungranted host? ... UNVERIFIED") and 145 (mid-session revoke cutting the channel "UNVERIFIED"); the file's own F5 at line 194 asks exactly this.
Ground truth: the behaviour on a revoked site is the open question F5 exists for; the file's rule at line 34 is "anything UNVERIFIED is in §What must be run, not asserted as fact". Stated as fact in two places and as open in a third.
Severity: MATERIAL. Class: internal-contradiction / unverified-verification-claim.
Fix: "On a revoked site the manifest script does not run (row 130); whether the toolbar click's `activeTab` grant then injects it, or `initChecker` finds no listener and the error popup appears, is F5."

FINDING 5 — docs/research/03-safari-firefox-ports.md:7-8
Claim: "Review state is in `PROGRESS.md`."
Falsifier: `grep -nE 'Session 32|research/03|03-s' PROGRESS.md docs/history/SESSIONS.md` → nothing.
Ground truth: at HEAD PROGRESS.md has no Session 32 entry and never mentions this research or `03-sources/`. The pointer resolves only if the handoff lands in the same PR.
Severity: LOW. Class: link-integrity.
Fix: add the Session 32 entry before merge, or change to "will be in `PROGRESS.md` §Session 32".

FINDING 6 — docs/research/03-safari-firefox-ports.md:165
Claim: "the seven `src/` call sites".
Falsifier: `grep -rnE '\bchrome\.' src` → 7 lines; `src/hooks/useColorPicked.ts:25` is `sender: chrome.runtime.MessageSender` (a type annotation).
Ground truth: 6 call sites (color-picker-cta.tsx 32, 38; actions.tsx 16; useColorPicked.ts 17, 50, 53) plus one type reference, which stays `chrome.` under a `typeof chrome`-typed shim.
Severity: LOW. Class: stale-quantifier.
Fix: "six `src/` call sites (and one type reference that stays)".

FINDING 7 — docs/research/03-safari-firefox-ports.md:97, :99
Claim: "## The five mechanisms, engine by engine" / "`docs/ARCHITECTURE.md` names five things everything rests on."
Falsifier: `awk 'NR>=104 && NR<=111' ...` → 8 table rows; `sed -n '7,44p' docs/ARCHITECTURE.md` → four numbered consequences; §Safari has five bullets.
Ground truth: the table has eight rows; ARCHITECTURE §The one decision lists four; "five" matches only §Safari's bullet count, which is not what the sentence cites.
Severity: LOW. Class: stale-quantifier / internal-contradiction.
Fix: "The eight mechanisms" and "the four consequences `docs/ARCHITECTURE.md` §The one decision lists, plus ..." or drop the number.

FINDING 8 — docs/research/03-safari-firefox-ports.md:28-29
Claim: "about ten VERIFIED rows carry an UNVERIFIED tail".
Falsifier: `grep -nE '^\|.*\| *VERIFIED[^|]*UNVERIFIED[^|]*\|$' docs/research/03-sources/firefox.md` → 7 rows (lines 65, 95, 113, 145, 146, 161, 169).
Ground truth: seven. The figure is restated from firefox.md's footer ("about ten") without re-deriving.
Severity: LOW. Class: stale-quantifier.
Fix: "seven".

FINDING 9 — docs/research/03-safari-firefox-ports.md:12
Claim: Alex, Session 31: "Let's look at safari and firefox".
Falsifier: `sed -n '216,217p' PROGRESS.md`.
Ground truth: PROGRESS.md records "Let's look at safari and Firefox too" (capital F, with "too").
Severity: LOW. Class: reader-precision (quote accuracy).
Fix: match the recorded wording.

FINDING 10 — docs/research/03-safari-firefox-ports.md:76-77
Claim: "so the same file runs as a page in Firefox and a worker in Chrome."
Falsifier: firefox.md line 49: "today's file uses neither, so the same file should load in both (UNVERIFIED until run)". My grep confirms no `self`, `importScripts`, `document` or `window` in background.js.
Ground truth: the premise (no worker-only or DOM API) is true at HEAD; the conclusion is UNVERIFIED in the source and stated as fact here. Not in §What must be run (implicitly covered: every F experiment loads the file).
Severity: LOW. Class: unverified-verification-claim.
Fix: "should run ... (every F experiment loads it, so F1 settles this too)".

FINDING 11 — docs/research/03-safari-firefox-ports.md:247-248
Claim: the ARCHITECTURE sentence "Safari has no `featurePolicy`" is "which the Permissions-Policy BCD supports (no `clipboard-write` in Safari or Firefox)".
Falsifier: `curl .../mdn/browser-compat-data/main/api/Document.json` → `Document.featurePolicy` safari `version_added: false`; firefox `"69"` behind pref `dom.security.featurePolicy.webidl.enabled`.
Ground truth: the ARCHITECTURE sentence is about the `document.featurePolicy` API, which BCD `api/Document.json` confirms absent in Safari. The cited `http/headers/Permissions-Policy.json` `clipboard-write` entry supports a different claim (the directive). Conclusion right, evidence mis-cited; and Firefox has `featurePolicy` behind a pref, so "or Firefox" needs the directive reading, not the API one.
Severity: LOW. Class: reader-precision.
Fix: cite `api/Document.json` `featurePolicy` for the API claim; keep the Permissions-Policy BCD for the directive.

FINDING 12 — docs/research/03-safari-firefox-ports.md:120, :123-124
Claim: "The pattern both document for 'run on click' is `permissions: ["activeTab", "scripting"]` ..." ; "Safari supports `scripting` (WebKit's permission list)".
Falsifier: firefox.md row 144 (MDN activeTab page example, VERIFIED); safari.md has no row showing Apple documenting the pattern — row 219 is WebKit's `supportedPermissions()` (Code), open point 2 is the agent's recommendation.
Ground truth: Firefox documents the pattern; for Safari the file has WebKit source listing the permission and no Apple documentation of the pattern.
Severity: LOW. Class: reader-precision.
Fix: "The pattern MDN documents ... Safari's WebKit lists `scripting` among supported permissions".

FINDING 13 — docs/research/03-safari-firefox-ports.md:59 and :174 (table)
Claim: "iOS is App Store only." / "App Store only."
Falsifier: safari.md row 158 status: "VERIFIED (iOS alternative distribution in some regions not addressed by this page)".
Ground truth: the row carries a regional caveat the main file drops.
Severity: LOW. Class: reader-precision.
Fix: "App Store (Apple's page does not address regional alternative distribution)".

FINDING 14 — docs/research/03-safari-firefox-ports.md:52 and :174
Claim: "Simulators are free." / "Device testing needs the Program; simulators do not."
Falsifier: safari.md row 153 quote: "You must be a member of the Apple Developer Program to test on a device." — the simulator half is in the claim column only.
Ground truth: unsourced by the file's own standard (almost certainly true in practice).
Severity: nit. Class: external-behaviour (UNCHECKED beyond the row).

FINDING 15 — docs/research/03-safari-firefox-ports.md:140-141
Claim: Firefox minimums "121 ..., 126 ..., 129 ... and 140".
Falsifier: firefox.md open point 8 lists 121, 126, **127** (content-script hosts granted at install), 129, 140.
Ground truth: 127 is omitted here but relied on at line 116 ("127 and later").
Severity: nit. Class: duplicate-fact-drift.

FINDING 16 — docs/research/03-safari-firefox-ports.md:81
Claim: "Chrome ignores the whole key without a warning (Chromium's `kIgnoredUnrecognizedKeys`)".
Falsifier: firefox.md row 63 VERIFIED (current Chromium main); row 64 SOURCES DISAGREE (older Chrome printed "Unrecognized manifest key 'browser_specific_settings'").
Ground truth: true for current Chromium; the disagreement about older Chrome is dropped.
Severity: nit. Class: reader-precision.

## Verified (held) — the load-bearing ones

- Repo: `main` = `6821ca5`; `.prettierignore` line 9 `docs/research/03-sources/` (one added line, as stated) and `02-sources/` ignored; `package.json` name `cc-checker-chrome-extension`, description "...chrome extension", `browserslist` `chrome >= 111`, `README.md:3` "A Chrome extension"; `.nvmrc` 24, `engines.node >=24.0.0`, `ci.yml` job "Lint, build, e2e" on `ubuntu-latest`; `scripts/package.mjs` exists; `test/e2e/fixtures.ts` uses `chromium.launchPersistentContext` and patches `host_permissions: ['<all_urls>']`; manifest: `permissions: ["activeTab"]`, WAR `matches: ["<all_urls>"]`, `use_dynamic_url: true`, `background.service_worker`, content script `<all_urls>`; `background.js`: `format: 'png'` (84), `typeof chrome.action.openPopup` guard (42), `setPopup({ tabId, popup: '' })` (36), `showErrorPopup` awaits `setPopup` then `openPopup` (33, 43), "tab that was open before the extension was installed/updated" comment (63-64), no `self`/`importScripts`/`document`/`window`; `content.js`: `data-cc-checker` (160, 192, 205), `runtime.getURL('index.html')` (164), `devicePixelRatio` (88), `mousemove`/`click` listeners (144-145), `window.self === window.top` (216).
- Cross-references: `docs/ARCHITECTURE.md` §Safari and other browsers exists with five bullets, says "`chrome.action.openPopup` is not available", "Chromium-only", `safari-web-extension-converter`, "Firefox is not a target and nothing has been checked against it" (verbatim); §Deliberately not changed line 413 "Chromium-only, since Safari has no `featurePolicy`"; `docs/GIT.md` §Releases exists (line 339); `docs/GIT.md` line 13-14 "`CC-001` to `CC-005` are keys in Alex's own tracker"; PROGRESS.md §Next workstreams item 4 exists at line 216.
- Engine quotes checked against their rows and found carried correctly (quote and status): packager rename and in-place references (safari rows 135, 138); 99 USD (152); Xcode for iOS/distribution (145); 18.4 temporary install, 24 h (144); Developer ID + notarization 18.4 (154-155, 157); guidelines 4.4 / 4.4.2 (159-160); bug 1573659 NEW (firefox 31); dual background keys and Firefox 121 / Chrome 121 (37-39); WebKit "Scripts takes precedence" (safari 28); gecko.id quote and 80-char ID (55, 58); `kIgnoredUnrecognizedKeys` (63); Safari "ignore any unsupported manifest keys" (187); data-collection key, 140/142, Nov 3 2025, 128 warning (67-75); `use_dynamic_url` unsupported, 111 forum vs schema (163-166, SOURCES DISAGREE carried as disputed); moz-extension per-instance UUID and `getURL` (167, 170); activeTab 48 / "active tab only" / "Any navigation resulting in a new document ends the access" / no warning (89, 96, 97, 100 — MDN re-fetched today, exact); Safari activeTab 14/iOS 15, "minimize access requests", WebKit temporary pattern, WWDC21 no prompt (50-55); captureVisibleTab 47 / 126 / data URL / "Doesn't require `all_urls`" / WebKit error string (107, 93, 110; safari 74-76); iOS capture reports UNVERIFIED → S2 (81); `sender.tab` MDN quote and Firefox test gap → F2 (219, 221); WebKit `sender.tab` and 64 MiB (safari 175-176); clipboard quotes and policy gaps (firefox 187, 196, 198 → F4; safari 121, 124, 126 → S4); WAR 109, "any path", mochitest, bug 1258347/49 (161-162, 171-172); WWDC20 per-launch host, "always dynamic", WebKit does not read the key (safari 104, 106-107); openPopup 109 / gesture before 149 / F6 UNVERIFIED (120-121, 124); Safari 16 release-note quote, `setPopup null` from 18 (89, 95); `chrome.*` "compatible with Chrome", callbacks, Promise question UNVERIFIED → F1, Chrome 148 `browser.*` (210-213); content scripts "only executed if ... granted host permissions", 127 install prompt, revocable (130, 134-135, 138); WWDC20 badge quote, WebKit static scripts for granted patterns → S1 (safari 57, 59); `scripting.executeScript` under activeTab quote (94); addons-linter rule names (42, 57, 74); AMO 24 h, manual review, 2017 listed+unlisted (231-232, 242); source-submission quotes and "There must be no differences" (236-237); Notarization "is not App Review" (157); macos-15 Xcode 16.4 default (143 + fetched); Playwright quote (fetched, exact); Safari 26 WebDriver (146); Android Dec 2023, `gecko_android`, BCD `matches` false (245-247, 161); "across all profiles, private browsing", 16.4 turned off on update (64, 66); pointer-events quote (206); 15.4 MV3 floor quote (19); `strict_min_version` key and iOS = Safari version (190); bug 1851083 / 129 (101); 128 floor (75-76).

## UNCHECKED (out of scope or no query possible)

1. Line 133-134: Chrome's install-time warning for `<all_urls>` content scripts going away — the file marks it "Not re-checked"; no row.
2. Line 183-184: Firefox temporary add-on loading of a built folder — file marks it "not re-checked here"; no row.
3. Line 157: "Vite copies `public/` verbatim" — true by Vite's `publicDir` default and AGENTS.md's statement, not run here.
4. Line 175: "`npm ci && npm run build` from `.nvmrc`'s Node is the whole recipe today; byte-identical output must be checked once" — not built twice here.
5. Line 19: that the two agents were "Fable 5.1, `high`" — not recoverable from the tree beyond the preambles' own say-so.
6. Lines 12, 5: the Session 31/32 attributions ("Alex, Session 31", "Session 32, 17 October 2026") beyond the PROGRESS.md quote in Finding 9; no Session 32 record exists yet (Finding 5).
