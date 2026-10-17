# Safari and Firefox ports — research and proposal

_A record, not instructions. Once the PRs it leads to merge, the docs they change are the authority._

Session 32, 17 October 2026. `main` at `6821ca5`. Ticket: **none assigned** — `docs/GIT.md` calls the existing ones "keys in Alex's own
tracker"; this file rides in the session PR under `CC-006` until he names one (decision (g)). Status: **researched;
nothing built.** The two engine reports it rests on are verbatim in `03-sources/` (§Sources), as are its two R1 reviews
(`grill-r1.md`, `surrogate-r1.md`, on `be835b7`), folded here in Session 33; review state is in `PROGRESS.md`
§Session 33.

## Why

Alex, Session 31: "Let's look at safari and Firefox too", including whether Safari needs its own repo, and what
Firefox needs. `docs/ARCHITECTURE.md` §Safari and other browsers lists five untried Safari points and says Firefox
"is not a target and nothing has been checked against it". The sibling web app shares domain logic and no code,
which is the shape a second repo would repeat.

## Method

Two research agents (Fable 5.1, `high`), one per engine, read-only, each answering twelve or thirteen questions
with a table of claim, source URL, verbatim quote under 15 words (or a marked paraphrase), version, and a status
of VERIFIED, UNVERIFIED or SOURCES DISAGREE. Primary sources only count as VERIFIED: Apple's documentation (read
through its Markdown endpoints, since the HTML is a JavaScript app), WebKit's source and bug tracker, Apple's
release notes and WWDC transcripts, Apple staff's replies on Apple's developer forums (`safari.md` rows 109 and
193), Chromium's source, MDN pages plus the `mdn/browser-compat-data` JSON (MDN's rendered compat tables are not
in its HTML), extensionworkshop.com, blog.mozilla.org, Bugzilla, Firefox's manifest schema and the addons-linter
rules. Other forum posts are cited only as secondary and never as VERIFIED.

- `03-sources/safari.md`: 143 rows, 129 VERIFIED, 11 UNVERIFIED, 3 SOURCES DISAGREE.
- `03-sources/firefox.md`: 168 rows, 151 VERIFIED, 13 UNVERIFIED, 4 SOURCES DISAGREE (seven VERIFIED rows carry an
  UNVERIFIED tail, where its footer estimates "about ten"; four of them its Open points repeat, and rows 113, 146
  and 169 are not there, 169 being F9 below).

The coordinator re-fetched two of the Firefox report's load-bearing pages itself (MDN's `background` key page and
its `activeTab` page) and found the quotes exact, and fetched the Playwright and GitHub billing facts in
§Distribution directly. Every engine claim below is one of those rows, cited by URL where it carries a decision;
anything UNVERIFIED is in §What must be run, not asserted as fact. Nothing in the repo was changed by the research itself; its fold rewrote three `docs/ARCHITECTURE.md` sentences
(§Corrections).

## The two questions Alex asked

### Does Safari need its own repo? No.

Apple's packaging tool, `xcrun safari-web-extension-packager` (renamed from `safari-web-extension-converter`;
<https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari>), generates an
Xcode project with a macOS and/or iOS containing app and a web-extension target. Unless `--copy-resources` is
passed, "the project references the original extension files", and "changes you make to the original extension
update your packaged Safari web extension and vice versa". So the Xcode project can sit in a folder of this repo
(`safari/`) and reference `build/`, and the extension stays one codebase with one build. A second repo would hold
only the Xcode project and a copy of the built files, which is the sibling web app's shape again.

What Safari needs that this repo does not have, none of it a reason for a second repo:

- **An Apple Developer Program membership, 99 USD a year**, to distribute at all and to test on an iOS device
  (<https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension>,
  <https://developer.apple.com/programs/whats-included/>). Simulators are free (the row's own claim; Apple's sentence covers only the device).
- **An Xcode project**, needed for iOS testing and for any distribution
  (<https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension>). Not needed for
  the experiments in §What must be run: since Safari 18.4 a built folder installs temporarily from the Develop
  menu ("Add Temporary Extension…") and is removed after 24 hours or when Safari quits (same page; Safari 18.4
  release notes).
- **A distribution channel**: the Mac App Store, or since Safari 18.4 a Developer-ID-signed and notarized app
  outside it (distributing page; 18.4 release notes). iOS is App Store as far as Apple's page goes (it does not address regional alternative distribution). App Review guideline 4.4 wants the
  containing app to "include some functionality, such as help screens and settings interfaces where possible",
  and 4.4.2 says extensions "should not claim access to more websites than strictly necessary"
  (<https://developer.apple.com/app-store/review/guidelines/>). Whether the packager's default "enable me in
  Safari" screen satisfies 4.4 is not stated anywhere Apple writes.

### What does Firefox need?

A manifest of its own, or one shared manifest if experiment F3 allows it, with four changes; then AMO signing
with a source-code submission; and two runtime behaviours confirmed by running, not reading (F1 and F2 in §What
must be run).

1. **`background.scripts` beside `background.service_worker`.** Firefox has no extension service workers
   (bug 1573659, open since 2019, still NEW). MDN's documented cross-browser pattern is one file under both keys:
   "specify both `scripts` and `service_worker` in the `background` key". Firefox 121 and later start the page
   regardless of the other key; Chrome 121 and later ignore `scripts` in an MV3 manifest and earlier Chromes
   refuse to load it (<https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background>).
   `public/app/background.js` uses no worker-only API (`self`, `importScripts`) and no DOM, so the same file
   should run as a page in Firefox and a worker in Chrome (UNVERIFIED until run, `firefox.md` line 49; every F
   experiment loads it, so F1 settles it). Safari, given both keys, runs `scripts` as a page too unless
   `preferred_environment` says otherwise (same page; WebKit's `WebExtension.cpp`: "Scripts takes precedence").
2. **`browser_specific_settings.gecko.id`**: "You must create an ID for signing Manifest V3 extensions; AMO does
   not assign an ID" (<https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings>).
   Email-shaped, 80 characters or fewer. Current Chromium ignores the whole key without a warning (`kIgnoredUnrecognizedKeys`; an older Chrome
   printed "Unrecognized manifest key" and ran the extension anyway, `firefox.md` row 64); Safari "ignore[s] any unsupported manifest keys".
3. **`browser_specific_settings.gecko.data_collection_permissions: { "required": ["none"] }`**, mandatory for a
   "new extension submitted to addons.mozilla.org from November 3, 2025" (same MDN page; Firefox 140 desktop,
   142 Android). The extension sends nothing anywhere, so `none` is the whole declaration. On Firefox 128 to 139
   an unknown `gecko` sub-key is a warning, not an install error (Firefox 128 release notes).
4. **No `use_dynamic_url`.** "Firefox does not support the `use_dynamic_url` property"
   (<https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/>). Whether it is an install
   error or a warning today is disputed: a March 2023 forum post shows Firefox 111 rejecting the manifest, while
   the current schema's `UnrecognizedProperty` and bug 1495908 (unexpected properties are warnings since 71)
   imply a warning. Experiment F3 decides whether one manifest can serve Chrome and Firefox (decision (c)).

Firefox's `moz-extension://<uuid>` origin is "randomly generated for every browser instance", so the iframe URL is
already per-profile without any key, and `runtime.getURL` from the content script is the documented way to get
it, as now.

## The mechanisms, engine by engine

`docs/ARCHITECTURE.md` §The one decision lists four consequences of the iframe design; the nine rows below are
the mechanisms they rest on, the last being the store, which the `spec-grill` R1 (M6) added. Chrome is today's behaviour; the other two columns
are what the documentation says, with the open points named.

| Mechanism                                                                     | Firefox                                                                                                                                                                                                                                                                                                                                                                                                                                           | Safari (macOS; iOS where it differs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeTab` from the toolbar click                                            | Since Firefox 48. Grants "the active tab only" (Chrome derives host permissions from the URL); "any navigation resulting in a new document ends the access". No install-time warning.                                                                                                                                                                                                                                                             | Since Safari 14, iOS 15. Apple: "Use the `activeTab` permission to minimize access requests". WebKit attaches a temporary pattern for the current URL on the gesture and clears it when the site changes; "Safari won't display a prompt when granting this permission" (WWDC21).                                                                                                                                                                                                                                                                          |
| `tabs.captureVisibleTab` from the background                                  | Since 47; under `activeTab` only "from Firefox 126" (125 and earlier needed `<all_urls>`). Returns a data URL; the repo passes `format: 'png'`, so the default-format difference is moot.                                                                                                                                                                                                                                                         | Since 14, iOS 15. Apple: "Doesn't require `all_urls` permission"; WebKit's error string names "either the 'activeTab' permission or granted host permissions". iOS has unresolved developer-forum reports of cropped or half-resolution captures (iOS 16 to 17), unconfirmed by Apple: experiment S2.                                                                                                                                                                                                                                                      |
| The background relay, addressed by `sender.tab`                               | The background is an event page, not a worker (§What does Firefox need, item 1). `sender.tab` is "only present when the connection was opened from a tab (including content scripts)"; whether a message from the `moz-extension://` iframe embedded in a tab carries it is undocumented and uncovered by Firefox's own tests: experiment F2.                                                                                                     | Service worker since 15.4, but with both background keys Safari runs the page. WebKit populates `sender.tab` whenever the sending page maps to a tab (`WebExtensionContextAPIRuntimeCocoa.mm`), which an iframe in a tab does; Safari's own behaviour untested: experiment S3. Messages are capped at 64 MiB of JSON, far above a PNG of the viewport.                                                                                                                                                                                                     |
| `document.execCommand('copy')` inside the cross-origin iframe                 | Documented to work in extensions "without special permission in short-lived event handlers triggered by user actions" (MDN, Interact with the clipboard). Firefox supports neither the `Permissions-Policy` header nor the `clipboard-write` directive, so Chrome's `allow` story has no counterpart; `writeText` in the iframe is untested.                                                                                                      | WebKit gates copy on `processingUserGesture()` and `writeText` on transient activation, with no origin or policy check in either path; its Permissions-Policy token list has no clipboard entry. Untested in the iframe: experiment S4.                                                                                                                                                                                                                                                                                                                    |
| The iframe panel (`web_accessible_resources` + `getURL`)                      | MV3 object form since 109; "any path can be included" in `matches`. Firefox's own mochitest loads an extension page in an iframe created by a content script, with full extension privileges (bug 1258347, fixed in 49).                                                                                                                                                                                                                          | `safari-web-extension://<UUID>`, and "the host of your extension URL changes across every launch of Safari" (WWDC20), so `use_dynamic_url` is "always dynamic" and WebKit does not even read the key. An Apple engineer gave exactly this recipe in June 2025: list the HTML under `web_accessible_resources`, build the iframe with `getURL()`.                                                                                                                                                                                                           |
| `action.openPopup` for the error popup                                        | Since 109; a user gesture is required before 149. Whether an awaited `setPopup` then `openPopup` inside `onClicked` still counts as the gesture is untested (F6).                                                                                                                                                                                                                                                                                 | Since Safari 16 ("Added the ability to open a Safari Web Extension popover programmatically"). `docs/ARCHITECTURE.md` said it "is not available" until this PR rewrote it (§Corrections). `setPopup({ popup: null })` is accepted from 18; the repo passes `''`, untested (S5).                                                                                                                                                                                                                                                                            |
| The `chrome.*` namespace                                                      | Supported "for APIs that are compatible with Chrome", with callbacks. Whether callback-less `chrome.tabs.*` and `chrome.action.*` calls return Promises, which `background.js` relies on at five sites (lines 26, 58, 84, 33 and 43), is not stated anywhere read: experiment F1. Chrome itself exposes `browser.*` from Chrome 148, so a `globalThis.browser ?? chrome` shim is the fallback.                                                    | "Safari web extensions support both the `chrome.*` and `browser.*` namespaces" and "both the callback and `Promise` approaches" (Apple's compatibility page). Whether `chrome.*` without a callback returns a Promise is not said separately (`safari.md` row 41, UNVERIFIED): experiment S8.                                                                                                                                                                                                                                                              |
| The manifest content script on `<all_urls>`                                   | An opt-in host permission in MV3: "Registered content scripts are only executed if the extension is granted host permissions for the domain." Shown and granted at install from Firefox 127 (not before), revocable per site afterwards. On a revoked site the manifest script does not run (`firefox.md` row 130); whether the click's `activeTab` grant then injects it, or `initChecker` finds no listener and the error popup appears, is F5. | Does not run until the user grants the site: "the user will see your extension's toolbar icon badge the first time they visit a web site" (WWDC20), and WebKit adds static scripts only for granted patterns. The first click on each new site is the grant; whether the script is injected in time for the same click's `initChecker` is undocumented: experiment S1. `tab.url` in `onClicked` may also be absent until the grant (`safari.md` row 65), and `isRestrictedUrl(undefined)` is `true`, so the error popup would show instead: experiment S7. |
| `localStorage` on the extension origin (`background`, `foreground`, `colors`) | The `moz-extension://` UUID is per browser instance; whether it is stable across restarts within a profile is undocumented (`firefox.md` row 169, UNVERIFIED): experiment F9.                                                                                                                                                                                                                                                                     | The host changes on every launch (WWDC20) and WebKit's `moveLocalStorageIfNeeded` migrates origin-keyed storage with it, but current Safari's behaviour is not re-documented since 2020 (`safari.md` rows 105 and 113, UNVERIFIED): experiment S9.                                                                                                                                                                                                                                                                                                         |

## The one design change the ports force: how the content script gets in

Chrome injects a manifest content script everywhere at install. Firefox and Safari both treat `<all_urls>` as a
host permission the user controls, so the current flow degrades differently on each: Firefox works on a fresh
install (127 and later), and what happens on a site the user has revoked is F5; Safari badges the icon on every
new site and injects only after the grant, with a possible race against the same click's message (S1) and a
possibly empty `tab.url` before it (S7).

The pattern MDN documents for "run on click" is `permissions: ["activeTab", "scripting"]` and
`scripting.executeScript({ target: { tabId }, files: ["app/content.js"] })` inside `action.onClicked`, then
`tabs.sendMessage(initChecker)` (MDN's `activeTab` page example; MDN's `scripting.executeScript` page: it works
"either explicitly as a host permission or using the `activeTab` permission"). Apple documents no such pattern; WebKit
lists `scripting` among its supported permissions (`safari.md` row 219), and App Review guideline 4.4.2 pushes the
same way. Chrome's permission list shows no install warning for `scripting` or `activeTab` (read 17 October 2026).

Three shapes, for decision (a). The `spec-grill` R1 (B1, B2) showed that the first, recommended at `be835b7`, had
not been thought through, and proposed the third:

1. **On-click injection everywhere, no manifest script.** One code path, but a Chrome behaviour change for every
   existing user, and 21 of the 22 e2e tests lose their resident content script (the service-worker test uses no
   page): `test/e2e/fixtures.ts`'s `page` fixture waits for `load` and then 300 ms for `document_idle`, `openChecker` sends `initChecker` to a tab it assumes already hosts
   the script, and the harness never clicks the toolbar, so `activeTab` is never granted (`docs/ARCHITECTURE.md`
   §Testing seam). Injecting from the harness would need `host_permissions: ["<all_urls>"]` on every test, not the
   three picker tests, which hollows out `docs/TESTING.md` §Why the patched manifest and leaves the shipped flow
   with no automated coverage on Chrome.
2. **Two paths: the manifest script for Chrome, on-click injection for Firefox and Safari.** Chrome unchanged, two
   flows to keep in step.
3. **Ping, then inject (recommended).** `background.js` keeps its `tabs.sendMessage(initChecker)` and, on
   rejection, calls `scripting.executeScript` and sends again; the manifest gains `scripting`. Chrome's manifest
   keeps its content script, so Chrome users and the e2e harness see no change on any page where the script is
   resident, and the "tab open before install" failure that `background.js` lines 63 to 64 only report is fixed.
   Firefox's and Safari's manifests drop the `content_scripts` entry (the per-browser patch of decision (c)), so
   neither asks for `<all_urls>` at install, and the same `background.js` injects on the click. One code path in
   the service worker, one manifest difference, and the harness stays valid.

Consequences under shape 3 (shapes 1 and 2 share the first two):

- **`content.js` must survive being run twice in one document, and today it cannot.** `scripting.executeScript`
  evaluates the file as a classic script in the tab's isolated world; its top-level `const IFRAME_HEIGHT`,
  `const LOUPE_SIZE`, `let scrollStopDelay`, `let keyValue`, `const image`, `const css` and `const getCanvasWrapper` would be re-declared in
  the same global lexical environment, and the second run fails at instantiation with a `SyntaxError` before any
  guard can run. The file gets wrapped in an IIFE (or a block) and a flag on the isolated-world global
  (`globalThis.__ccCheckerInstalled`, say) keyed on the listener's existence, never on the DOM: after
  `closeChecker` there is no `[data-cc-checker]` but the first `onMessage` listener is still registered, so a
  DOM-keyed guard would register a second one and every later message would be handled twice, the defect class
  `docs/REVIEW-PATTERNS.md` §6 records. Under shape 3 the realistic double run is Chrome-only: a click before
  `document_idle` on a loading page, where the ping rejects (no listener yet), `executeScript` injects at idle,
  and the manifest script runs at idle too, two copies in one isolated world. (An extension update also orphans the old listener so
  the next ping fails; whether that re-run lands in the same world is UNCHECKED.) So the wrap is required, and
  since no ordinary click under shape 3 runs the file twice, F8 and the Chrome inject-path test call
  `scripting.executeScript` twice explicitly and assert one iframe and one `closeColorPicker` relay per pick.
- **`document.body` may not exist yet.** The manifest entry's `run_at: document_idle` guarantees a body today;
  `addIframe` and `addCanvas` append to it unguarded. The on-click variant guards for it or waits for
  `DOMContentLoaded`.
- **The inject path needs its own test on Chrome, and a seam to reach it.** The harness never fires
  `action.onClicked` (`docs/ARCHITECTURE.md` §Testing seam), so `background.js` hoists the click body into a
  global `handleActionClick(tab)` registered with `chrome.action.onClicked.addListener(handleActionClick)`, and a
  fourth patched-manifest test (no `content_scripts`, `host_permissions: ["<all_urls>"]` so `executeScript` is
  legal without the click) calls it through `serviceWorker.evaluate`, as the first e2e test calls
  `isRestrictedUrl`. `docs/TESTING.md` §Why the patched manifest names both.
- The content script is no longer resident on every page the user visits in Firefox and Safari; the `<all_urls>`
  entry in `web_accessible_resources` stays as is, because the iframe is still built from any site.
- Chrome's install-time warning for the `<all_urls>` content script stays under shape 3, since Chrome's manifest
  keeps the script; the Chrome Web Store listing is re-reviewed for the added `scripting` permission only.
- `isRestrictedUrl` keeps its place as a fast path; the `executeScript` rejection catches the engine-specific pages
  (`moz-extension://`, `safari-web-extension://`, addons.mozilla.org) that its Chrome-shaped list does not. If
  `tab.url` is absent on Safari before the grant (S7), the classifier needs a Safari path (treat a missing URL as
  "attempt injection; the rejection decides"), and the `undefinedUrl` case in `test/e2e/extension.spec.ts` changes
  meaning with it.
- Shape 3 is also a Chrome release (§Proposal, phase 1a). Between the upload and any fix, a Chrome user on a page
  where the ping succeeds sees nothing new; on one where it fails and `executeScript` also fails they see the
  error popup, which is what they see today.

## Minimum versions

- **Firefox.** The documented facts imply 121 (dual background keys), 126 (`captureVisibleTab` under
  `activeTab`), 127 (content-script hosts granted at install), 129 (no attention dot for `activeTab`-only MV3
  extensions, bug 1851083) and 140 (the data-collection key recognised without a warning).
  `strict_min_version: "140.0"` admits every behaviour above with no warnings; `"128.0"` is the floor at which
  nothing errors, but ESR 128's last release was 128.15 on 16 September 2025 and ESR 140 has been the only ESR
  since 14 October 2025; ESR 153 has shipped since 21 July 2026 and 140's last release was 140.17 on 29 September
  2026 (Mozilla's release calendar at
  <https://whattrainisitnow.com/calendar/>, read 17 October 2026), so `128.0` admits only browsers Mozilla no
  longer updates. Decision (b), now with one defensible answer.
- **Safari.** 15.4 is the MV3 floor (Apple: "Safari 15.4 and later supports manifest versions 2 and 3"); 16 adds
  `openPopup`, which the `typeof` guard already tolerates missing; 18.4 adds temporary install and Developer ID
  distribution, both developer-side. App Review requires the extension to "run on the current version of
  Safari" anyway. `browser_specific_settings.safari.strict_min_version: "15.4"` is the documented choice; on iOS
  the Safari version equals the iOS version.
- **Chrome.** `browserslist` is `chrome >= 111`. A shared manifest carrying `background.scripts` moves the real
  floor to 121, where Chrome starts ignoring the key; per-browser manifests leave Chrome's as it is.

## Does `public/app/*.js` need a build, and does a shared `messages.ts` come back?

Not yet, and that is conditional. `PROGRESS.md` §Next workstreams records the re-entry for a build and a shared
`messages.ts` as "**Re-entry: the Safari `browser.*` shim**", and item 4 (this work) as the re-entry condition for
both. So the question is open, not closed: it fires if F1 or S8 shows that `chrome.*` without a callback returns
no Promise on either engine, because the shim below is then one line in each plain script plus a typed copy for
`src/`, three copies of one thing, which is the duplication the module was meant to end. Three one-liners are
still well short of a bundler, so the recommendation is to decide at the end of phase 0 (decision (j)). The "no
new message name" half is conditional too: if F2 or S3 shows the iframe's messages arrive without `sender.tab`,
the tab-id handshake is a new message in all three contexts, and the shared-constants argument strengthens.

What the ports add:

- **A per-browser manifest step.** Vite copies `public/` verbatim (its `publicDir` default), so a small script
  beside `scripts/package.mjs` (`scripts/manifest.mjs`, say) writes each target's manifest from the base plus a
  per-browser patch: Firefox, the four changes above (with `scripts` replacing `service_worker`, since the dual key
  only matters for a shared manifest) minus `content_scripts`; Safari, `browser_specific_settings.safari` minus
  `content_scripts`, the background left as the worker (decision (c)). Each target gets its own output directory
  (`build/` stays Chrome's, for the e2e suite; `build-firefox/`, `build-safari/`), so the Linux job can lint the
  Firefox manifest while e2e runs against Chrome's, and the Xcode project references a folder that only ever holds
  a Safari manifest. `npm run package -- firefox` zips the right one.
- **Possibly one line per file.** If F1 or S8 shows `chrome.*` returns no Promise, `const api =
globalThis.browser ?? chrome;` at the top of both plain scripts and a `src/utils/browser-api.ts` typed as
  `typeof chrome` for the six `src/` call sites (the one type reference, `chrome.runtime.MessageSender` in
  `src/hooks/useColorPicked.ts`, stays). Chrome 148 and later expose `browser.*` itself.
- **`web-ext lint`** (addons-linter) in the Linux CI job, against `build-firefox/`: it is what flags
  `ADDON_ID_REQUIRED`, `BACKGROUND_SERVICE_WORKER_NOFALLBACK` and `MISSING_DATA_COLLECTION_PERMISSIONS`, each
  already named in the Firefox report.

## Distribution, cost and testing

|                | Firefox                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Safari on macOS                                                                                                                                                                                    | Safari on iOS                                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Channel        | addons.mozilla.org, listed or self-distributed; both signed by AMO, "up to 24 hours", manual review possible at any time. Listed and unlisted versions may share one ID (Mozilla, 2017).                                                                                                                                                                                                                                                                                                              | Mac App Store, or Developer ID plus notarization (Safari 18.4 and later). Notarization "is not App Review".                                                                                        | App Store (Apple's page does not address regional alternative distribution). Device testing needs the Program; simulators do not (the row's claim, not Apple's sentence). |
| Source review  | Required for bundled or minified code: "You must upload your extension's source code" with a README of build steps, environment and tool versions, and the lockfile; the reviewer rebuilds and "There must be no differences" (<https://extensionworkshop.com/documentation/publish/source-code-submission/>). `npm ci && npm run build` from `.nvmrc`'s Node is the whole recipe today; byte-identical output must be checked once.                                                                  | App Review of the containing app (guideline 4.4), or none under Developer ID.                                                                                                                      | App Review.                                                                                                                                                               |
| Cost           | Free.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 99 USD a year.                                                                                                                                                                                     | Same membership.                                                                                                                                                          |
| CI             | The existing Linux job can lint (`web-ext lint`) and zip the Firefox build.                                                                                                                                                                                                                                                                                                                                                                                                                           | `xcodebuild` on GitHub's `macos-15` image (Xcode 16.4 default); standard GitHub-hosted runners are free for public repositories, and this one is public. The packager on a runner is untried (S6). | Same image; a simulator run at most.                                                                                                                                      |
| Automated e2e  | None in this harness: Playwright says "Extensions only work in Chromium when launched with a persistent context" (<https://playwright.dev/docs/chrome-extensions>). Firefox extension automation was not researched; phase 1b's proof of working is a manual walk (§Proposal), and `web-ext run` is the lever if automation is wanted later.                                                                                                                                                          | None in this harness. Safari 26 "Added support for web extensions in WebDriver", so SafariDriver is a future path.                                                                                 | None.                                                                                                                                                                     |
| Platform notes | Firefox for Android lists MV3 extensions on AMO (since December 2023) and needs at least an empty `gecko_android` object, set only after verifying on a device; BCD oddly marks `web_accessible_resources.matches` false there. Out of scope until desktop ships. Extensions do not run in Firefox private windows by default, and whether one may is "under user control" (MDN's `incognito` key page, read 17 October 2026): a README line, and the toolbar click does nothing there until allowed. | Granting a site "grants the extension access to the site across all profiles, private browsing". A version that "requests more host permissions" is turned off on update (16.4).                   | The loupe uses `mousemove` and `click`; Apple: "Use pointer events instead of mouse events to handle touch interactions." Phase 3 at best.                                |

## What must be run before any code

Each is a load-bearing behaviour the documentation does not settle. This Mac has Safari 27.0 on macOS 27.0 and
Firefox 152.0.3 (read 17 October 2026; six releases behind the calendar's 158.0, so update Firefox first), so every
row runs here: Firefox from `about:debugging` (Load Temporary
Add-on, a built folder with the patched manifest; not re-checked here), Safari from the Develop menu ("Add
Temporary Extension…", 18.4 and later). Results go to `03-sources/experiments.md`, each with the browser version,
and this file's open rows are then rewritten in place with a dated note, as research 02's fold was, not deleted.
F8 and S1 run the recommended shape 3 flow against a patched manifest (`permissions: ["activeTab", "scripting"]`,
no `content_scripts`); F5 runs the status quo, which shape 3 keeps on Chrome.

| #   | Browser | Question                                                                                                                                                                                                                                                                                                                                        | Decides                                                                                         |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| F1  | Firefox | Do callback-less `chrome.tabs.*` and `chrome.action.*` calls return Promises? (`background.js` lines 26 and 58 `sendMessage`, 84 `captureVisibleTab`, 33 and 43 `action.*`.)                                                                                                                                                                    | Whether the shim is needed; and that the file loads as a page at all.                           |
| F2  | Firefox | Does a `runtime.sendMessage` from the `moz-extension://` iframe inside a tab arrive with `sender.tab` set?                                                                                                                                                                                                                                      | Whether the relay works unchanged, or the iframe needs a tab id handshake (decision (j)).       |
| F3  | Firefox | Is `use_dynamic_url` in an MV3 `web_accessible_resources` entry an install error or a warning on current Firefox?                                                                                                                                                                                                                               | Whether the Firefox patch must delete the key or may leave it; (c) is per-browser either way.   |
| F4  | Firefox | Does `execCommand('copy')` return `true` in the iframe's click handler? Does `navigator.clipboard.writeText` also work there?                                                                                                                                                                                                                   | Whether `copyText` is enough as is.                                                             |
| F5  | Firefox | With the manifest script kept, does a toolbar click under `activeTab` reach a site whose host permission was revoked, or does `initChecker` reject?                                                                                                                                                                                             | The revoked-site row above; under shape 3 the rejection is what triggers the inject.            |
| F6  | Firefox | Does `showErrorPopup`'s awaited `setPopup` then `openPopup` still count as the click's gesture on Firefox below 149?                                                                                                                                                                                                                            | Whether the error popup shows; if not, decision (k).                                            |
| F7  | Firefox | Does `captureVisibleTab` under `activeTab` return the viewport at device pixels (image width equals `innerWidth * devicePixelRatio`), and does a known block sample to its colour?                                                                                                                                                              | Whether the loupe's `devicePixelRatio` maths holds (`firefox.md` row 114, UNVERIFIED).          |
| F8  | Firefox | With no `content_scripts` and `activeTab` + `scripting`, does `scripting.executeScript` from `onClicked` inject `content.js`, and does `initChecker` then open the checker? Record whether the ping resolves, rejects or never settles, and its latency; then call `executeScript` twice on one document, and once more after `closeChecker`.   | Shape 3's flow on Firefox, and the idempotent wrap.                                             |
| F9  | Firefox | Set colours, quit Firefox, relaunch, reopen: are `background`, `foreground` and `colors` still there?                                                                                                                                                                                                                                           | Whether the `moz-extension://` origin, and so `localStorage`, is stable within a profile.       |
| S1  | Safari  | With no `content_scripts` and `activeTab` + `scripting`, does the first click on an ungranted site inject and open the checker, and does the ping resolve, reject or never settle first (no source row covers the no-listener case on Safari)? And with the manifest script instead, is it injected in time for the same click's `initChecker`? | Decision (a) on Safari, and the first-use flow in the README.                                   |
| S2  | Safari  | Does `captureVisibleTab` succeed under the temporary `activeTab` grant on macOS, and does the loupe's `devicePixelRatio` maths hold? Then on an iPhone.                                                                                                                                                                                         | Whether the eyedropper ports; whether iOS is viable at all.                                     |
| S3  | Safari  | Does the iframe's `runtime.sendMessage` carry `sender.tab`?                                                                                                                                                                                                                                                                                     | As F2.                                                                                          |
| S4  | Safari  | Does `execCommand('copy')` work in the iframe's click handler; is the extension origin a secure context for `navigator.clipboard`?                                                                                                                                                                                                              | As F4.                                                                                          |
| S5  | Safari  | Does `setPopup({ popup: '' })` unbind the error popup (only `null` is documented, from 18)?                                                                                                                                                                                                                                                     | A one-token change in `background.js` if not; if the popup never shows, decision (k).           |
| S6  | CI      | Do `xcrun safari-web-extension-packager --no-open --no-prompt` and `xcodebuild` run on `macos-15`?                                                                                                                                                                                                                                              | Whether Safari gets a CI job, and when.                                                         |
| S7  | Safari  | In `action.onClicked` on a site not yet granted, is `tab.url` populated?                                                                                                                                                                                                                                                                        | Whether `isRestrictedUrl` needs a Safari path (§The one design change).                         |
| S8  | Safari  | Does `chrome.tabs.captureVisibleTab(...)` with no callback return a Promise?                                                                                                                                                                                                                                                                    | As F1; `background.js` lines 83 to 88 would throw on every pick otherwise (`safari.md` row 41). |
| S9  | Safari  | Set colours, quit Safari, relaunch, reopen: still there?                                                                                                                                                                                                                                                                                        | Whether WebKit's storage migration survives the per-launch host (`safari.md` rows 105 and 113). |

## Proposal

Order: Firefox first, because it costs nothing, needs no Xcode and no Program membership, its experiments run on
this Mac in minutes, and it forces the per-browser manifest and the injection decision that Safari then reuses.
The `spec-grill` R1 (M7) named what that order hid at `be835b7`: under any shape of (a), phase 1 starts with a
Chrome release.

0. **Experiments (one session, no code merged).** F1 to F9 and S1 to S9 above, on this Mac. Output:
   `03-sources/experiments.md`, and this file's open rows rewritten in place, dated. Decision (j) at the end.
1. **Phase 1a: Chrome (two PRs, then a release).** First the idempotent `content.js` (the IIFE wrap, the
   listener-keyed flag, the `document.body` guard; no behaviour change, the e2e suite proves it). Then
   `background.js`'s ping-then-inject with `scripting` in the manifest, `handleActionClick` as the seam, and the
   patched-manifest test for the inject path (two explicit injections), with `docs/TESTING.md` §Why the patched
   manifest rewritten to say what it now covers. The shim's lines, if F1 or S8 needs them, wait for 1b: Chrome
   does not need them, and whether `globalThis.browser` is the same object as `chrome` on Chrome 148 and later is
   UNCHECKED. Two execution contexts, so two PRs (`docs/DEVELOPMENT.md` §One change in flight). Released
   as 2.2.0 (both version fields, the public listing read first, `docs/GIT.md` §Releases), with an observation
   window before 1b builds on it, since the only rollback is another upload. User-visible failure if the inject
   path is wrong on some Chrome: the error popup, which is today's behaviour on an un-scripted tab.
2. **Phase 1b: Firefox (one or two PRs).** Decisions (b) to (d) built: the shim if F1 or S8 needs it, the
   manifest script and `build-firefox/`, `web-ext lint` in CI, the per-browser `error.html` wording, the source-submission README, an AMO account and
   the first listed version. Definition of done, since nothing automated runs it: a loaded temporary add-on walked
   through the mechanisms table (open, pick, copy, close and reopen, the error popup, a private window, storage
   after a restart), with the Firefox version in the PR body, as `AGENTS.md` names load-unpacked for Chrome.
   `docs/ARCHITECTURE.md` and `README.md` updated in the same PR.
3. **Phase 2: Safari on macOS.** `safari/` holding the packager's Xcode project referencing `build-safari/`; the
   Program membership; the channel chosen (decision (e)); the containing app's screen; the version derived from
   `package.json` (decision (f)); ignore entries for the packager's template files (`.prettierignore`, ESLint
   `ignores`, `.gitignore` for `xcuserdata/` and `DerivedData/`); a release checklist beside the Chrome one in
   `docs/GIT.md` §Releases. CI job only if S6 passes and Alex wants it.
4. **Phase 3: Safari on iOS, if ever.** Pointer events for the loupe, `captureVisibleTab` quality on a device, App
   Review. Nothing above depends on it.

### Decisions for Alex (lettered; each with the recommendation)

- **(a) Injection model.** Shape 3, ping-then-inject, with Chrome's manifest script kept and dropped from the
  other two manifests (recommended: one service-worker path, Chrome and the e2e harness unchanged wherever the
  script is resident, the stale-tab failure fixed); shape 1, on-click injection everywhere (a Chrome behaviour
  change and a rewritten harness); or shape 2, two flows. The recommendation changed from shape 1 at `be835b7` on
  the `spec-grill` R1's B1 and B2. Alex's, because it adds a permission and changes Chrome.
- **(b) Firefox `strict_min_version`.** `140.0`. `128.0` would admit only browsers Mozilla stopped updating on
  16 September 2025 (§Minimum versions), so this is evidence rather than a choice unless Alex wants the older
  floor anyway.
- **(c) Manifests.** Per-browser manifests written by a script, whatever F3 says (recommended): one shared
  manifest would drop `use_dynamic_url` from Chrome, which is what stops a web page probing
  `chrome-extension://<static-id>/index.html` for the extension's presence and what the clipboard reasoning in
  `docs/ARCHITECTURE.md` §Deliberately not changed rests on, as well as moving Chrome's floor to 121. F3 decides
  only whether the Firefox patch must delete the key. Safari's background stays the service worker, as Chrome's
  and as Apple advises ("Use a service worker for better compatibility", `safari.md` row 25); a page with
  `preferred_environment` is the fallback if the S experiments show the worker misbehaving.
- **(d) The Firefox add-on ID.** Email-shaped, 80 characters or fewer, e.g. `cc-checker@alexclapperton.co.uk`;
  Alex's string, since it is permanent.
- **(e) Safari channel and scope.** Mac App Store, Developer ID, or both; whether iOS is in scope at all; and
  when the 99 USD is spent (recommended: after S1 to S9 pass, not before).
- **(f) Same repo.** `safari/` in this repo, the Xcode project committed, derived data ignored (recommended), with
  `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` passed to `xcodebuild` from `package.json` by the package step
  rather than kept in `project.pbxproj`, and a one-line check that every version copy agrees, so the pair that
  drifted once (`AGENTS.md` §Non-obvious constraints) does not become an unwatched quartet.
- **(g) Ticket key(s).** One for both ports, or one each; also whether this research file moves under it.
- **(h) Order.** Firefox first (recommended, with phase 1a's Chrome release named), or Safari first because it was
  the stated goal.
- **(i) Doc corrections now or with phase 1.** Now (recommended, and done for the three `docs/ARCHITECTURE.md`
  sentences in this PR; §Corrections). The `package.json` and `README.md` wording waits for phase 1b, when it
  stops being true.
- **(j) Whether the shim reopens the shared `messages.ts`** (new, from the `spec-grill` R1's M1). Decided at the
  end of phase 0: no shim and no handshake, no question; either, and the copies are weighed against a build.
- **(k) The error popup's fallback** (new, from L1). If F6 or S5 fails: badge text on the toolbar icon, or accept
  "nothing visible" and say so in the README. Per-browser `error.html` wording either way, since it names the
  Chrome Web Store.

## Corrections to existing docs found on the way

Three `docs/ARCHITECTURE.md` sentences are rewritten in this PR (decision (i)); the rest wait for the PR that
makes them true.

- `docs/ARCHITECTURE.md` §Safari and other browsers, rewritten here: `chrome.action.openPopup` **is** available
  from Safari 16; the converter is now `safari-web-extension-packager`; "Chromium-only" for `use_dynamic_url` now says why
  (BCD: effective from Chrome 130, mirrored by Edge, "always dynamic" in Safari, unsupported in Firefox). Left for phase 1: Safari's `activeTab` and `captureVisibleTab` are now documented and the per-site
  grant model is the real difference; "Firefox is not a target" changes when (h) is decided.
- `docs/ARCHITECTURE.md` §Deliberately not changed: the clipboard re-entry says "Safari has no `featurePolicy`",
  which BCD's `api/Document.json` confirms (`featurePolicy` is `version_added: false` for Safari; Firefox has it
  behind a pref). The `clipboard-write` directive is a separate claim, supported by the Permissions-Policy BCD
  (absent in Safari and Firefox). Left as is.
- `package.json` `name` and `description`, and `README.md`, say "chrome extension": phase 1b.

## Sources

- `03-sources/safari.md` and `03-sources/firefox.md`: the two agents' reports, verbatim, each ending with the
  list of every URL read and its open points. Prettier ignores the folder, as it does `02-sources/`.
- Fetched by the coordinator: <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background>,
  <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission>,
  <https://playwright.dev/docs/chrome-extensions>,
  <https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-actions>; in
  Session 33, for the fold: <https://developer.chrome.com/docs/extensions/reference/permissions-list>,
  <https://whattrainisitnow.com/calendar/>,
  <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/incognito>.
- `03-sources/grill-r1.md` and `03-sources/surrogate-r1.md`: the two R1 reviews of `be835b7`, verbatim;
  `03-sources/grill-r2.md` and `03-sources/surrogate-r2.md`: the confirm round on the fold, `6a738ac`, verbatim.
