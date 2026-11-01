# da-review — PR #136 (`docs/CC-007-session-35`, head `237d677`, base `a8463b8`)

Worktree: `/Users/alexclapperton/Desktop/alex/colour-contrast-checker/cc-da`, detached at `237d677`; every read
there. Scope: `git diff a8463b8..237d677` (13 files, +499/−226). No product code changed; the substance is the
Firefox harness runner (`lib.mjs`, `run.mjs`, `f9.mjs`, `smoke.mjs` new; `launch-ff.sh`, `probe-bg.js`,
`probe-page.js` changed) and the F1 to F9 readings in `docs/research/03-sources/experiments.md`. Firefox was
not launched; where a mechanism is inferred from Firefox's source rather than a run, the finding says so. No
PR comments posted. This file is the one write outside the worktree.

SUMMARY: 0 BLOCKING, 4 MATERIAL, 4 LOW, 5 nits. Not nit-floor: three rows (F5, F6, F8) carry a reading their
evidence does not support, each with a cheap re-run named below.

## Checklist anchors (top 3)

1. `docs/DA-REVIEW.md:117-135` Verification-claim audit — "find the command and its output", and "the
   control, wherever a negative result is the claim". F5's "got no content script" and F6's "the gesture
   survived" are negative/absence claims read without a control.
2. `docs/DA-REVIEW.md:138-163` Claim-extraction pass — behaviour claims about external-tool semantics ("what
   `activeTab` grants and when; whether `chrome.action.openPopup` exists") are checked "against documentation
   or an observation, never a restatement". Applied to `triggerAction`, `activateScripts`, the `openPopup`
   gesture pref and the shape-3 double-run claim.
3. `docs/DA-REVIEW.md:165-192` Silent-failure sweep, with the red flag at `:59-60` ("Reasoning from the
   absence of a console error"). Applied to F6's unattributed `uncaught exception` on the error-popup path and
   to the probe's own `.catch(() => {})` swallows.

Also applied: `docs/DA-REVIEW.md:466-478` §Docs and prose (a comment the code has overtaken; every
loaded-extension claim dated or marked unverified). `docs/CONVENTIONS.md:47-93` §Comments is the only
CONVENTIONS section the diff touches (`launch-ff.sh`, `lib.mjs:35`). `docs/REVIEW-PATTERNS.md` §6 (double
delivery) is the class behind F8's wrap question; §10 is why this review reproduced by reading source rather than
spawning verifiers. Every dismissal below was checked against `docs/RATIONALIZATIONS.md` "It works when I click
it" (`:147-168`): a click that proves less than it seemed is this PR's whole subject.

## Findings

### MATERIAL 1 — F5: "a fresh document got no content script" was read at the instant of the click, and Firefox's click path injects the manifest script after it

`docs/research/03-sources/experiments.md:43`; carried to `docs/research/03-safari-firefox-ports.md:264` ("a site
without the host grant gets no manifest content script but `activeTab` still works (F5)") and `PROGRESS.md:12-16`,
`:60-62`.

What the harness did (`run.mjs:43-51`): revoke `<all_urls>`, navigate to a fresh document, `clickToolbar`, sleep
1.5 s, read `pageInfo` (`hasIframe`), then read the probe's click record. Both pings in that record — the product's
`initChecker` (`background.js:58`) and the probe's `probe-ping` (`probe-bg.js:26`) — are sent synchronously inside
`onClicked`. Nothing pings again later. `hasIframe: false` after 1.5 s shows only that `initChecker` was not
received *when sent*.

What Firefox's source says the click does (read at tip, 1 November 2026, from
`hg-edge.mozilla.org/mozilla-central/raw-file/tip/...`): `ext-browserAction.js`'s real-click path and
`triggerAction(window)` both call `this.action.triggerClickOrPopup(tab, clickInfo)`
(`toolkit/components/extensions/ExtensionActions.sys.mjs`), which runs, in order,
`this.extension.tabManager.addActiveTabPermission(tab)` then `this.extension.tabManager.activateScripts(tab)`, and
only then `dispatchClick` (which is what fires `onClicked`). `activateScripts` in
`toolkit/components/extensions/parent/ext-tabs-base.js` is documented "Activate MV3 content scripts if the
extension has activeTab or an (ungranted) host permission" and sends `tab.queryContent("ActivateScripts", { id })`
when `this.extension.originControls && !tab.matchesHostPermission && (optionalOrigins.matches(tab._uri) ||
hasPermission("activeTab")) && contentScripts.length` — every condition the revoked F5 click met (MV3,
`<all_urls>` removed, `activeTab`, one manifest script). The content-process injection is asynchronous, so the
`initChecker` sent from `onClicked` very probably raced ahead of it and was rejected; the script then landed in the
document with no message to act on. (Whether the 159 build has the same `activateScripts` as tip was not read;
the mechanism is MV3 origin controls, which `research 03:117` dates to 127.)

Why it matters: the status-quo answer to research 03's row 117 ("whether the click's `activeTab` grant then injects
it, or `initChecker` finds no listener and the error popup appears") is then "both — the first click shows the
error popup and the second opens the checker", which is a different user story from "content script needs the
host grant", and it is a second source of the double run F8 dismisses (MATERIAL 4). Under shape 3 on Firefox the
manifest script is gone, so shape 3 itself is unaffected.

Falsifier, one re-run: after the revoked click in `run.mjs:47`, wait ~1 s, send `probe-ping` again (or
`clickToolbar` a second time) and record whether it resolves and whether the checker opens. Rewrite the row and
the `:264` summary on the result. Labelled: very probable from source, not observed.

Also in the same row, `experiments.md:43` "A signed install's default (host permissions ungranted) was not tested;
the temporary route grants them" asserts a signed-install default the repo's own sources contradict:
`research 03:117` "Shown and granted at install from Firefox 127" and `:123` "Firefox works on a fresh install
(127 and later)". The "not tested" is right; the parenthetical is a claim stated as fact. Drop it or cite it.

The `triggerAction` half of the brief's F5 question is settled the other way: `triggerAction` and a real click
share `triggerClickOrPopup`, so the harness's `lib.mjs:35` comment and `experiments.md:24-26` are correct, and
`captureVisibleTab` resolving after the revoke (`run.mjs:51`) is direct evidence of the grant.
Checklist: `DA-REVIEW.md:117-135` (a negative result with no control), `:138-163` (behaviour claim).

### MATERIAL 2 — F6: on 159 `openPopup` needs no gesture, so the observation cannot show that "the gesture survived the await"

`experiments.md:44`; `research 03:264` ("the popup shows after the await (F6)"); `PROGRESS.md:62-63`.

`docs/research/03-sources/firefox.md:121` (VERIFIED, BCD): "Before Firefox 149, a user gesture is required to call
this API." Firefox's `ext-browserAction.js` `openPopup` API (tip) throws "openPopup requires a user gesture" only
when the pref `extensions.openPopupWithoutUserGesture.enabled` is false *and* `context.callContextData
.isHandlingUserInput` is false; on 149+ the pref defaults on. So on 159 the panel opens whether or not the
awaited `setPopup` consumed the gesture — the reading "so the gesture survived the await on 159" is not
supported by the run, and the question F6 asks ("still count as the click's gesture on Firefox below 149",
`research 03:271`) is unanswered. It is not moot: `strict_min_version` is `140.0` (`research 03:193-201`;
`make-builds.mjs:12`), so 140 to 148 users sit on the gesture rule.

"'Below 149' cannot be read on this Mac" (`:44`) is also wrong: add `user_pref("extensions.openPopupWithout
UserGesture.enabled", false)` to `profile/user.js` and re-run `f9.mjs:30-43`'s F6 block. Panel opens → the await
preserved the gesture; no panel plus "openPopup requires a user gesture" in `consoleSince` → decision (k) is live.
A second pref-off run with `openPopup()` called before the `await` separates "the await lost it" from "a
`triggerAction` click never set `isHandlingUserInput`" (the brief's question; whether the synthetic path sets it
was not read). Two runs, both cheap. Checklist: `DA-REVIEW.md:138-163` (external-tool semantics verified
against a restatement), `:117-135`.

### MATERIAL 3 — F6: an unattributed `uncaught exception` on the error-popup path, with the attribution fields discarded by the harness

`experiments.md:44` ("One console error followed the click, `uncaught exception: Object { message }`, source not
attributed"); `f9.mjs:38`.

This is the path of the 4 September 2026 incident (`error.html` left bound to a tab). The harness read
`Services.console.getMessageArray()` and kept only `x.message` (`f9.mjs:38`); an `nsIScriptError` entry also
carries `sourceName`, `lineNumber`, `errorMessage` and `stack`, so the attribution was available and dropped.
Candidates with no handler in the product path: `showErrorPopup(tab.id)` is called un-awaited and un-caught
(`background.js:53`), so a rejection of `setPopup({ tabId, popup: 'error.html' })` (`:33`) is unhandled; the 500 ms
reset `setPopup({ tabId, popup: '' })` (`:36`) has no catch, and if that is what rejected, the popup stays bound —
the incident shape exactly. Note F1 cannot have seen it: `probe-bg.js:14` swallows `setPopup({ popup: '' })`'s
rejection with `p?.catch?.(() => {})` and records only the return kind. A plain `{ message }` object is also what
Firefox's messaging rejections look like, so an unhandled `tabs.sendMessage` somewhere in the two `onClicked`
listeners is a third candidate. Which one is speculative; that the row leaves a console error on the error-popup
path unattributed while research 03 reads F6 as "the popup shows" is the finding.

Fix: map `sourceName`/`lineNumber`/`stack` in `f9.mjs:38` and re-run; or `await showErrorPopup(...)` in the probe
build with a logged catch. Checklist: `DA-REVIEW.md:165-192` (promise with no catch; the openPopup incident),
red flag `:59-60`.

### MATERIAL 4 — F8's last sentence contradicts research 03's own analysis of when the wrap is needed

`experiments.md:46`: "The ping-first flow never injects twice; an idempotent wrap is only needed if something
else does."

`research 03:155-170` (same commit) names the something else and concludes "So the wrap is required": on Chrome,
a click before `document_idle` rejects the ping, `executeScript` injects at idle and the manifest script runs at
idle too — "two copies in one isolated world"; an extension update orphaning the old listener is listed as
UNCHECKED; `§Proposal :296` makes the IIFE wrap phase 1a's first PR. MATERIAL 1 adds a Firefox source
(`activateScripts` on a revoked site, status quo), and Chrome's per-site "on click" access mode runs manifest
scripts on the click the same way (reasoned, not observed). The F8 *observation* — the run was on `ext-inject`, a
Firefox build with no manifest script, so no ordinary click ran the file twice — is sound and useful: it also
shows the cost of a double run (a `SyntaxError` at instantiation, the first copy's listener still live, the
checker still working via the first copy). The *reading* generalises from the one build where the double run is
impossible by construction. Rewrite to: "on Firefox under shape 3, the ping-first flow never ran the file twice;
the wrap stays required for the Chrome cases in research 03 §The one design change." The `closeChecker` half the
brief asked about is confirmed by the row and the code: `closeChecker` (`content.js:200-212`) removes the DOM and
leaves the `onMessage` listener (`:217`) registered, so the next ping resolves and nothing injects — the
listener-keyed guard research 03 prescribes. Checklist: `DA-REVIEW.md:138-163` (quantifier "never"),
`REVIEW-PATTERNS.md` §6.

### LOW 1 — F4's iframe half: a harness-layout candidate the row does not consider (speculative)

`experiments.md:42`; `run.mjs:32`, `f9.mjs:16`, `server.mjs:3`; `PROGRESS.md:331-334`.

The probe page has `html,body{margin:0}` and only fixed-position children, so the iframe appended with no
position (475 × 200) sits at the viewport's top-left — under `#red` (`position:fixed; top:0; left:0; 200×200`).
The Copy button is near `probe.html`'s top-left (an empty `<pre>`, then the button), roughly (30, 30) CSS px
from the viewport origin, inside the red block. Marionette's obscured-element check is per document, so inside
the frame nothing covers the button; whether its synthesised click in an out-of-process `moz-extension://` frame
is hit-tested against the parent document was not established here, so the mechanism is a candidate, not a
cause. It fits every observation (no click error, no output, twice; the top-level retest has no red block and
worked). Falsifier: `f.style.cssText = 'position:fixed;bottom:0;left:0'` (the product's own placement) and
re-run `f4('iframe')`. The loading step's planned next attempt (`windowUtils.sendMouseEvent` at the frame's
coordinates, `PROGRESS.md:331-334`) would hit the same block; try the move first. "Not established, not
failed" is the honest reading of the output; the row should name the layout as the first thing to rule out.

### LOW 2 — Permission and sender reads the runner logged are not quoted where the rows depend on them; no pick has crossed the relay on Firefox

`run.mjs:20` (`permsBefore`), `:44` (`permsAfter`), `:71` (`perms8`); `experiments.md:43`, `:46`, `:40`.

F5's revoke is evidenced by the rejected ping, not by the `permissions.getAll()` the runner took after the
remove; F8's `perms8` — `activeTab` + `scripting` with *no* host origins — is the strongest shape-3 evidence in the
set and is unquoted. One clause each. F2 (`:40`) quotes `tabId`, `frameId`, `url`, `origin` but not `windowId`,
which `probe-bg.js:38` recorded and `background.js:84` (`captureVisibleTab(t.tab.windowId, …)`) needs; and the
capture F7 decoded came from the probe's `onClicked` (`probe-bg.js:28`), not from the `getScreenshot` relay
(`background.js:81-88`). "The relay works unchanged" (`:40`, `research 03:264`) is therefore `sender.tab` present
plus capture-from-click, not a pick through the iframe. State the gap, as `docs/DA-REVIEW.md:130-133` asks.

### LOW 3 — `f1.mjs` ran but is not in the tree

`PROGRESS.md:57` names `f1.mjs` among the scripts run; `git ls-files docs/research/03-sources/ff-harness` has
`smoke.mjs`, `run.mjs`, `f9.mjs` only, and `README.md:25` lists those three. F1 (`experiments.md:39`) and the
"ext-manifest's (already seen)" warnings at `run.mjs:65` rest on it. The F1 probe is committed (`probe-bg.js:11-21`,
read back by `probe(m, 'do=results')`), so the reading is reproducible without the script; commit `f1.mjs` or
correct `PROGRESS.md:57` and say where the ext-manifest warnings were read. Checklist: `DA-REVIEW.md:117-124`.

### LOW 4 — Research 03's open rows are not "rewritten in place with a dated note"

`research 03:257-259` and `§Proposal :293-294` define phase 0's output as "this file's open rows rewritten in
place, dated". The diff adds the italic note at `:264` above the table (and strips the table's column padding,
`:263`, `:265-281`) but leaves rows `:112-118` and `:124` reading "experiment F2", "untested (F6)", "is F5"
as before. May be deliberate (wait for the review folds); if so, say so in `PROGRESS.md`'s next step. Also
`:254-255` still says "Firefox 152.0.3 … update Firefox first" and `:256` "Firefox from `about:debugging`", both
overtaken by this run. Prose drift is `copilot-surrogate`'s pass; flagged because the research is what the
readings are for. Checklist: `DA-REVIEW.md:466-478`.

## Nits (no action required)

1. `launch-ff.sh:2` "Launch Firefox 152" — overtaken (line 5 now names 159); `CONVENTIONS.md:85-93`.
2. `993f49f`'s gitmoji `🔬` is not in `docs/GIT.md`'s table (`docs` → 📝, `:135`). Drift, as the 17 March 2026
   commits were.
3. `profile/user.js:9` `extensions.webextensions.restrictedDomains = ""` is the one pref that changes extension
   permission behaviour (it unblocks Mozilla's quarantined domains). No F row touches a listed domain
   (`127.0.0.1`, `about:blank`, `moz-extension://`), so no reading depends on it; say so in the README or drop it.
4. F3's "warning" is Firefox's loader on a temporary install; AMO's linter is a separate gate
   (`firefox.md:74` records `MISSING_DATA_COLLECTION_PERMISSIONS`). Decision (c) (`research 03:329-332`) should
   not read F3 as "one manifest serves both" until `web-ext lint` has run on it (`§Proposal :306` already plans it).
5. F9 is one relaunch, but the row pairs the observation with the mechanism (`extensions.webextensions.uuids`
   read before reinstall, `f9.mjs:5`), and the harness path (shutdown-uninstall of a temporary add-on, then
   reinstall) is harsher than a user's. "Stable per install, not per profile" is the right reading. Unchecked and
   out of scope: a profile with "delete site data on close" set.

## Checked and clear

- **Representativeness of the launch.** `MOZ_DISABLE_*_SANDBOX`, `security.sandbox.*.level 0`
  (`launch-ff.sh:7`, `user.js:11-15`) govern OS process sandboxing; WebExtension permission decisions
  (`ExtensionActions.sys.mjs`, `ext-tabs-base.js`) run in the parent, and capture and clipboard are parent-proxied
  regardless of level. `MOZ_REMOTE_ALLOW_SYSTEM_ACCESS` / `-marionette` touch only the automation surface. `-no-remote`
  and the scratch profile are standard. `make-builds.mjs:15` adds `storage` to every build (the product has none);
  it affects no row. No reading depends on any of these.
- **`clickToolbar` grants `activeTab` as a click does** — `lib.mjs:35-48` and `experiments.md:24-26` verified
  against `triggerClickOrPopup` (above).
- **F7.** 2560 × 1682 for 1280 × 841 at DPR 2; sample points (50,50) and (300,300) CSS px avoid the open checker
  (fixed, bottom 475 px of 841 → y ≥ 366). `content.js:88-93` reads `devicePixelRatio` per move; consistent.
- **F8's error naming `scrollStopDelay` rather than the earlier `const IFRAME_HEIGHT`** is SpiderMonkey checking
  `let` bindings before `const`; it confirms the whole file was re-evaluated as a classic script in the same
  global lexical environment, as `research 03:156-159` predicted.
- **Probe fixes.** `probe-page.js:33` (show `execCommand` before `writeText` settles) and `probe-bg.js:45`
  (serialise `error.message`) both make the harness speak where it was silent; `probe-page.js:14-16` `do=msg` is
  generic plumbing with a comment. No new swallow added beyond the pre-existing F1 `.catch(() => {})`s
  (MATERIAL 3 notes their cost).
- **Cross-context, permissions, manifest, cascade, CSS, a11y:** untouched; `public/manifest.json` unchanged;
  `host_permissions` appears only in the harness manifests under `docs/`.
- **Case:** new paths are lowercase; `ff-harness/README.md` predates this PR.
- **Commit format:** four commits, `<type>: CC-007 - <gitmoji> …` (nit 2 on the gitmoji choice).
- **`surrogate-s34-confirm.md`:** a verbatim record; its LOW 1 strike at `PROGRESS.md:117` matches F3 (`:41`).
