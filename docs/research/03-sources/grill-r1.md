_Recorded verbatim from the Session 32 `spec-grill` R1 run on `be835b7` (Fable 5.1, 17 October 2026): 2 BLOCKING, 9 MATERIAL, 11 LOW, 3 nits. Unfolded at the Session 32 handoff; the fold is the next session's (PROGRESS.md loading step 5)._

# spec-grill R1 (discovery) — `docs/research/03-safari-firefox-ports.md`

Worktree: `/private/tmp/claude-501/.../scratchpad/wt-grill` at `be835b7`. No edits made anywhere. Read: the proposal, both source reports in full, `docs/ARCHITECTURE.md`, `public/manifest.json`, `public/app/background.js`, `public/app/content.js`, `PROGRESS.md` §Next workstreams item 4 and the killed-`messages.ts` bullet, `docs/GIT.md` §Ticket keys and §Releases, `docs/DEVELOPMENT.md` §Lifecycle, §One change in flight and §Verification rounds, `docs/TESTING.md` §Why the patched manifest and §What is not tested, `docs/REVIEW-PATTERNS.md` §6, `test/e2e/fixtures.ts`, `.github/workflows/ci.yml`, `scripts/package.mjs`, `public/error.html`.

Checked before use, all true: `main` is `6821ca5`; the row counts the proposal gives for both reports (143 / 129 / 11 / 3 and 168 / 151 / 13 / 4) reproduce from an awk over the status columns; `background.js` lines 26, 58 and 83 are the three promise-dependent sites; the Safari on this Mac is 27.0 on macOS 27.0 and `/Applications/Firefox.app` exists.

Totals: 2 BLOCKING, 9 MATERIAL, 11 LOW, 3 nits.

---

## BLOCKING

### B1. Decision (a)'s "idempotent `content.js`" consequence describes a guard that cannot work, and the fault is in the recommended design itself

- Anchors: proposal lines 126-129 ("a second click injects it again, so the `onMessage` listener and the module's state need a `window`-level guard, or the file registers nothing when `[data-cc-checker]` already exists"); `public/app/content.js` lines 5-11 and 64 (top-level `const IFRAME_HEIGHT`, `const LOUPE_SIZE`, `let scrollStopDelay`, `let keyValue`, `const image`, `const css`, `const getCanvasWrapper`); lines 200-212 (`closeChecker` removes the iframe, styles and loupe but not the `onMessage` listener at 216-241).
- Failure scenario. `scripting.executeScript({ files: ['app/content.js'] })` evaluates the file as a classic script in the tab's isolated world. On the **second** click on the same document, the top-level `const`/`let` declarations are re-declared in the same global lexical environment and the script fails at instantiation with `SyntaxError: Identifier 'IFRAME_HEIGHT' has already been declared` — before any runtime guard can run. The promise rejects; in the flow the proposal sketches that lands in the `catch` → `showErrorPopup`, so the second click on an open checker shows the error popup instead of being the no-op the e2e test "a second initChecker is a no-op" (`test/e2e/extension.spec.ts:72`) asserts today. Even with the declarations restructured, the proposed DOM key is wrong: after `closeChecker` there is no `[data-cc-checker]` but the first listener is still registered, so a re-injection registers a second listener and every later message is handled twice — `docs/REVIEW-PATTERNS.md` §6 (double delivery), the exact defect class this repo has already paid for, exercised by "close removes the iframe…; reopen restores persisted state".
- Why BLOCKING. This is the central recommendation, and the consequence list is the proposal's own evidence that the design has been thought through. The question the brief exists to ask — *what does the thing you are replacing actually do?* — shows the manifest script is run once per document by the browser, which is the property the plan removes and does not replace.
- Fix. Rewrite the consequence honestly: (i) the file must be wrapped (IIFE or block) or switch to `var`, and the guard must be a flag on the isolated-world global (`globalThis.__ccCheckerInstalled`), keyed on the listener's existence and never on DOM presence; or (ii) do not re-inject at all — ping first. The ping shape is also a third option the proposal does not consider: keep the manifest script, add `scripting`, and in `onClicked` try `tabs.sendMessage(initChecker)` and only on rejection `executeScript` then send again. That is one code path on all three browsers, changes nothing for Chrome users, keeps the e2e harness valid (B2), and covers the revoked-site, ungranted-site and stale-tab cases. Line 135-136's "Nothing found favours it" is unargued; this does.

### B2. The proposal is silent on what decision (a) does to the e2e suite and the required CI check — which is everything

- Anchors: proposal §Distribution "Automated e2e" row (line 178) and phase 1 (lines 211-213) say nothing about `test/e2e/`; `test/e2e/fixtures.ts:110-116` (the `page` fixture waits 300 ms "content scripts are registered at document_idle"), `:138-143` (`openChecker` fakes the click by sending `initChecker` to a tab it assumes already hosts the script); `docs/ARCHITECTURE.md:342-349` (`chrome.action.onClicked` never fires, so `activeTab` is never granted; only the picker block uses the patched manifest); `docs/TESTING.md:92-103` ("why that is honest": only the permission that lets the screenshot happen is widened, and only for three tests); `.github/workflows/ci.yml` (`Lint, build, e2e` is the required check, `docs/DEVELOPMENT.md:148-157`).
- Failure scenario. With no `content_scripts` entry, no test page has a content script; `openChecker` times out and all 22 tests fail, so no phase 1 PR can merge. To inject from the harness the service worker would call `scripting.executeScript`, which without the grant needs a host permission — i.e. the `host_permissions: ["<all_urls>"]` patch on **every** test, not three. That hollows out TESTING.md's honesty argument (the thing under test would then be the unshipped permission model) and leaves the shipped `activeTab`+`scripting` flow with zero automated coverage on Chrome, where it is a behaviour change for existing users.
- Fix. Add a plan row before any code: either the ping-then-inject design in B1 (harness unchanged, Chrome unchanged), or a rewritten harness and a rewritten TESTING.md §Why the patched manifest with the new "what is not tested" stated. Name which. Also say what proves the Firefox build works after merge: a named loaded-temporary-add-on step per PR (the brief's first question), since the row admits nothing automated runs it.

---

## MATERIAL

### M1. "`messages.ts` stays killed" misreads its own precedent

- Anchors: proposal lines 152-155 ("Neither port renames a message or adds a context, so §Next workstreams item 4's re-entry condition does not fire"); `PROGRESS.md:289` — the killed-`messages.ts` bullet ends "**Re-entry: the Safari `browser.*` shim.**"; `PROGRESS.md:221-224` makes the Safari/Firefox work "the re-entry condition for giving `public/app/*.js` a build and a shared `messages.ts`".
- Scenario. The re-entry condition on the record is not a rename; it is the shim — and the proposal proposes exactly that shim (lines 163-165: one line in each plain script plus `src/utils/browser-api.ts`, three copies of one thing, which is the duplication the module was meant to end). The question is therefore open, not closed, and a reader taking line 154 at face value would skip the argument.
- Fix. Quote the actual condition, say it fires if F1 (or M3) makes the shim necessary, and either argue why three copies of one line still do not earn a build, or defer the decision to the end of phase 0 as decision (j). Note also L10: the "no new message" claim is conditional on F2 and S3.

### M2. Safari may hand `onClicked` a tab with no `url`, and `isRestrictedUrl(undefined)` is `true`

- Anchors: `docs/research/03-sources/safari.md` row at line 65 (`tabs` "needs host permission", so "`tab.url` in `action.onClicked` may be unavailable until granted"; WebKit fires the URL update only *after* the temporary grant); `public/app/background.js:19-22` (`if (!url) return true`) and `:51-55` (restricted → `showErrorPopup`, no `initChecker`); the proposal's Safari column (lines 104, 111) and S1 (line 196) never mention `tab.url`.
- Scenario. On the first click on any not-yet-granted site, Safari shows the error popup (or nothing, see L1) and never injects. That is every site, for every new user, until "all websites" is chosen — the port would appear broken on first use. The row is VERIFIED-sourced in the report and absent from the proposal and the experiments.
- Fix. Add S7: "In `action.onClicked` on an ungranted site, is `tab.url` populated?" If not, the classifier needs a Safari path (treat a missing URL as "attempt injection; the rejection decides"), and the e2e case `undefinedUrl` at `extension.spec.ts:19` changes meaning — say so.

### M3. Whether Safari's `chrome.*` returns Promises is UNVERIFIED, but the shim is gated on Firefox alone

- Anchors: `safari.md` row at line 41 (UNVERIFIED: Apple's sentence "does not say `chrome.*` returns Promises"); proposal line 110 presents the same sentence as settling it, and lines 163-165 and F1 (line 190) make the shim depend only on Firefox.
- Scenario. If Safari's `chrome.tabs.captureVisibleTab(...)` without a callback returns `undefined`, `background.js:83-88` throws `TypeError: Cannot read properties of undefined (reading 'then')` on every pick, and the proposal's §Method rule (line 34: anything UNVERIFIED goes in §What must be run) is broken by its own table.
- Fix. Add it to S2 or as S8; or adopt the shim unconditionally, since Chrome 148+ exposes `browser.*` and the cost is one line.

### M4. Firefox `captureVisibleTab` scale is UNVERIFIED and missing from the F-list, while S2 covers it for Safari

- Anchors: `firefox.md` row at line 114 ("The screenshot is of the visible viewport at device pixels, so the loupe's `devicePixelRatio` maths carries over — UNVERIFIED"); proposal line 105 says only that the format difference is moot; F1-F6 have no capture experiment. `content.js:88-93` multiplies `clientX/Y` by `devicePixelRatio` against the image.
- Scenario. If Firefox returns a CSS-pixel image, every sample is taken from the wrong pixel on any HiDPI Mac (every Mac). The eyedropper is the feature the extension exists for; phase 1 would ship it untested on the engine it ships to.
- Fix. Add F7: capture under `activeTab` on this Mac, compare image size to `innerWidth * devicePixelRatio`, and pick a known block's colour.

### M5. The experiments test the status quo, not the recommended design

- Anchors: S1 (line 196) asks whether the *manifest* script is injected in time for the same click's `initChecker`; F5 (line 194) is marked "Only if decision (a) keeps the manifest script". Nothing in F1-F6 or S1-S5 runs `scripting.executeScript` under the temporary `activeTab` grant on either engine — the flow (a) recommends for all three browsers.
- Scenario. Phase 0 completes, (a) is adopted on MDN's example alone, and the first time the real flow runs is inside a phase 1 PR. On Safari in particular, whether the temporary pattern WebKit attaches on the gesture (`safari.md` row 54) satisfies `executeScript` is "Safari's delegate choice UNVERIFIED" (row 56). "Go and look" is the standing instruction.
- Fix. Rewrite S1 and add F8 to run the (a) flow against a patched manifest (`permissions: ["activeTab","scripting"]`, no `content_scripts`) on both engines, and keep the status-quo variant only if the ping-then-inject design (B1) is chosen.

### M6. `localStorage` persistence is a sixth mechanism the table omits, and it is UNVERIFIED on both engines

- Anchors: `safari.md` rows at lines 104-105 and 113 (host changes per launch; WebKit's `moveLocalStorageIfNeeded` migrates storage — but "Current Safari behaviour not re-documented since 2020… UNVERIFIED for Safari ≥ 15"), its Open point 5; `firefox.md` row at line 169 ("the UUID is stable within a profile — UNVERIFIED"); `src/context.tsx:53-135` reads and writes `background`, `foreground`, `colors` on the extension origin; the proposal's five-mechanism table (lines 97-111) and the experiment list say nothing about it.
- Scenario. Saved colours and the last pair reset on every Safari launch (or Firefox restart) and the port looks like it has no memory. Nothing in the plan would notice until a user does.
- Fix. Add S9/F9: set colours, quit, relaunch, reopen; and add the row to the mechanisms table as "`localStorage` on the extension origin", since `docs/ARCHITECTURE.md:189` names it the store.

### M7. Phase 1's scope breaks §One change in flight and forgets that it is also a Chrome release with no rollback

- Anchors: proposal lines 211-213 ("one or two PRs": manifest step, injection model, shim, idempotent `content.js`, `web-ext lint`, README, AMO account, first listed version); `docs/DEVELOPMENT.md:164-175` (a PR changing `content.js`, `background.js` and `src/` together "is three changes", and the message flow between them is where the last two relay defects hid); `:109-129` (Merged is not published); `docs/GIT.md:345-367` (version bump in both files, check the public listing, tag).
- Scenario. Under (a) the Chrome manifest loses `content_scripts` and gains `scripting`, `background.js` and `content.js` both change — that is a Chrome behaviour change for every existing user, so phase 1 implies a Chrome release (2.2.0, both version fields, upload, store review) that appears nowhere in the plan. The brief's rollback question is unanswered: if on-click injection fails on some Chrome configuration, every click on every page shows the error popup until the next upload clears review, and the only "rollback" is another upload with a higher version.
- Fix. Split phase 1 by execution context and by browser; add a "Chrome release" row with the user-visible failure mode and the observation window before Firefox builds on the new flow; or choose the B1 ping-then-inject design so Chrome's path does not change in phase 1 at all. State the between-upload-and-fix experience explicitly, as the brief requires for anything touching `content.js` or the manifest.

### M8. Decision (c)'s shared-manifest option silently removes `use_dynamic_url` from Chrome, and the proposal lists only the floor move as the cost

- Anchors: proposal lines 160-162 and 227-228 ("at the cost of Chrome's floor moving to 121"); `docs/ARCHITECTURE.md:28-34` and `:159-165` (the dynamic URL is why `allow="clipboard-write"` cannot work and why only the host-fetched resources need listing), `:385-402` (the measured isolation: removing `use_dynamic_url` is what made the `allow` attribute start working).
- Scenario. The key exists so a web page cannot probe `chrome-extension://<static-id>/index.html` to fingerprint the extension's presence; one shared manifest drops that for Chrome users to save a 40-line script, and also changes the clipboard reasoning that `docs/ARCHITECTURE.md` §Deliberately not changed rests on. F3 is presented as deciding (c); it decides only whether Firefox tolerates the key, not whether Chrome should lose it.
- Fix. Record both consequences under (c) and recommend per-browser manifests regardless of F3's outcome; F3 then only decides whether the Firefox patch must delete the key or may leave it.

### M9. "Same repo" adds a third and fourth home for the version, and the plan does not say who keeps them in step

- Anchors: proposal lines 38-46 and (f) (line 233: "derived data ignored"); `AGENTS.md` ("The version lives in both `package.json` and `public/manifest.json`, unlinked") and `docs/DEVELOPMENT.md:119-122` (they disagreed on 4 September 2026); an Xcode project carries `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in `project.pbxproj`, and App Store Connect rejects a build number that does not increase.
- Scenario. The pair that already drifted once becomes a quartet, with the two new copies inside a generated file nobody reads, and the brief's question — *does anything have to be remembered?* — is answered "yes, twice more" without a check.
- Fix. Have the manifest script (or `xcodebuild MARKETING_VERSION=… CURRENT_PROJECT_VERSION=…` in the Safari package step) derive both from `package.json`, and add a one-line lint/CI check that every copy agrees. Say so under (f).

---

## LOW

### L1. The error-popup path has no named fallback on either new engine, and its text and classifier are Chrome-shaped

- Anchors: F6 (line 195) and S5 (line 200) decide "whether the error popup shows" and stop there; `background.js:29-48` (`setPopup('')`, 500 ms unbind, `openPopup` behind `typeof`); `public/error.html:55` ("The Chrome Web Store"); `background.js:6-17` (`chrome://`, `edge://`, both Chrome store hosts; nothing for `moz-extension://`, `safari-web-extension://`, or — my recollection, not a row in `firefox.md` — `addons.mozilla.org`, where Firefox refuses injection).
- Scenario. On Firefox below 149, if F6 fails, a click on a restricted page does nothing visible unless the user clicks again within 500 ms. Under (a) the `executeScript` rejection would catch the engine-specific pages, so the classifier is a fast path, but the popup copy still names the wrong store.
- Fix. Name the fallback if F6/S5 fail (badge text, or accept "nothing visible" and write it down); plan per-browser `error.html` wording with the per-browser manifest patch.

### L2. Decision (i) is decidable, and the answer is "now"

- Anchors: proposal line 236 and §Corrections (242-249); `docs/ARCHITECTURE.md:365` ("`chrome.action.openPopup` is not available" — wrong since Safari 16 per `safari.md` rows 89-92); the spec-grill brief: the `docs/*.md` rule documents are updated in place and "a stale sentence there is a finding, not history".
- Fix. Fold the three corrections into the session PR, not phase 1; they are prose, `copilot-surrogate` reviews them, no code waits on them.

### L3. Decision (b) may not be Alex's: check the Firefox ESR lifecycle first

- Anchors: proposal lines 140-143 and 226 (`128.0` "the floor at which nothing errors" vs `140.0`); `firefox.md` row at line 60 (115 ESR / 128 are about the root-certificate expiry, not support status).
- Speculative, flagged as such: my recollection is that ESR 128 reached end of life in 2025 when ESR 140 took over. If that is right, nothing below 140 receives security updates, `128.0` admits only unsupported browsers, and (b) collapses to 140 by evidence. One fetch of Mozilla's ESR release-calendar page settles it; do that before putting the choice to Alex.

### L4. Phase 0 asks for facts that are readable on this Mac

- Anchor: proposal lines 209-210 ("Needs Alex's Safari version (18.4 or later…) and a Firefox install"). `defaults read /Applications/Safari.app/Contents/Info.plist CFBundleShortVersionString` gives 27.0; `sw_vers` gives macOS 27.0; `/Applications/Firefox.app` exists. Go and look; record them.

### L5. The manifest script writing into `build/` in place makes CI and the Xcode reference order-dependent

- Anchors: proposal lines 157-162 ("writes the target's manifest into `build/`"), 166-168 (`web-ext lint` in the Linux job), 214-215 (`safari/` references `build/`); `ci.yml` runs `npm run build` then e2e against `build/`.
- Scenario. CI needs a Chrome manifest in `build/` for e2e and a Firefox one for `web-ext lint`; the Xcode project packages whatever manifest `build/` last held — a stale Chrome manifest ships inside the Safari app silently (Safari ignores unknown keys, so nothing errors).
- Fix. Per-target output directories (`build/` stays Chrome; `build-firefox/`, `build-safari/`), or the script runs as the last step of each `package -- <target>` and the Xcode project points at `build-safari/`.

### L6. `safari/` brings generated JS, CSS and HTML into `eslint .` and `prettier --check "**/*.{js,…,html,css}"`

- Anchors: (f) line 233 mentions only derived data; `package.json` scripts `lint:js` (`eslint .`) and `format:check`; the packager's containing-app template ships `Resources/Script.js`, `Style.css`, `Main.html`.
- Fix. Plan the ignore entries (`.prettierignore`, ESLint `ignores`, `.gitignore` for `xcuserdata/` and `DerivedData/`) in the phase 2 PR that commits the project.

### L7. Under (a) the script can run before `document.body` exists

- Anchors: `public/manifest.json:46` (`run_at: document_idle` guarantees a body today); `content.js:166`, `:187-188` (`document.body.appendChild`, unguarded); proposal's consequence list (126-136) does not mention it.
- Fix. Guard for `document.body` (or wait for `DOMContentLoaded`) in the on-click variant; add it to the consequences.

### L8. Firefox private windows are not in the report or the proposal

- Anchors: the proposal's Firefox column (lines 104-111) says nothing about window mode; `useColorPicked.ts:27-29` exists for Chrome incognito; `firefox.md` has no row on private browsing. My recollection, UNCHECKED here: Firefox disables extensions in private windows by default, so the toolbar click there does nothing. The brief's "which window mode" question is unanswered for Firefox.
- Fix. One row in the report, one line in the README's first-use flow.

### L9. Safari's background environment is undecided and unlettered

- Anchors: proposal line 159 ("the dual background key if Safari is to run a page"); `safari.md` rows 25 (Apple: "Use a service worker for better compatibility") and 32 (the 15.4 worker "was rough"; fixes through 18).
- Fix. Decide (worker, matching Chrome and Apple's advice, with `preferred_environment` from Safari 18 if the dual key is used) or add it to (c).

### L10. "Neither port renames a message or adds a context" is conditional

- Anchors: proposal line 154 vs F2/S3 (lines 191, 198: "or the iframe needs a tab id handshake"). A handshake is a new message name in all three contexts.
- Fix. State the conditional.

### L11. Phase 1's proof of working is unnamed

- Anchors: proposal line 178 ("Firefox extension automation was not researched"); the brief's first question (a loaded step with a named observer for every case the harness cannot reach).
- Fix. Add the manual check (`about:debugging` → Load Temporary Add-on, the five mechanisms walked, version noted) to phase 1's definition of done, the way `AGENTS.md` names load-unpacked for Chrome. `web-ext run` is the obvious lever if automation is wanted later.

---

## nits

- N1. Line 165 "seven `src/` call sites": six calls plus one type reference (`useColorPicked.ts:25`, `chrome.runtime.MessageSender`).
- N2. Lines 208-209 "this file's open rows rewritten as facts" vs line 3 "A record": say how (in place, dated, as research 02 was folded), so the rewrite does not read as history being deleted.
- N3. Line 5 cites `docs/GIT.md` for "the keys are Alex's"; the wording there (line 13-14) is "keys in Alex's own tracker" — fine, but quote it so `copilot-surrogate` does not have to.

---

## The questions asked, answered directly

- **"Safari does not need its own repo" — holds.** The packager's in-place references (`safari.md` row 138) carry it. The costs the answer leaves out are M9 (version copies), L5 (which manifest the project packages) and L6 (tooling ignores); none is a reason for a second repo.
- **Decision (a) and its consequences — not ready.** B1 (re-injection fails as described; DOM-keyed guard double-registers), B2 (e2e and CI unaddressed), L7, and the unargued dismissal of the alternative. The ping-then-inject shape is a third option that keeps Chrome unchanged.
- **Minimum versions — reasoning sound, one check missing.** L3 may collapse (b); Safari 15.4 and the Chrome 111/121 distinction are correctly sourced.
- **"No build, `messages.ts` stays killed" — misreads the record.** M1, L10.
- **Firefox-first — defensible, but it is really "Chrome re-architecture first".** M7. (h) remains Alex's because Safari was the stated goal.
- **Are the twelve experiments the right set?** No: they test the status quo not the design (M5), omit two UNVERIFIED load-bearing rows the proposal's own method says must be run (M3, M4), omit `tab.url` (M2) and storage persistence (M6). F1-F4 and F6 are right; F5 only matters under the ping-then-inject design; S1 needs rewriting.
- **Omissions the dispatch named:** e2e/CI (B2), Chrome Web Store re-review and rollback (M7), Safari error-popup path (M2, L1), Safari `localStorage` (M6).
- **Decisions:** (a) Alex's, because it widens permissions and changes Chrome, but the recommendation must be re-argued after B1/B2. (b) possibly evidence (L3). (c) evidence plus a privacy consequence (M8) → per-browser regardless of F3. (d), (e), (g), (h) Alex's. (f) evidence says yes; Alex's on shape. (i) decidable: now (L2). A (j) — whether the shim re-opens `messages.ts` — belongs on the list (M1).
