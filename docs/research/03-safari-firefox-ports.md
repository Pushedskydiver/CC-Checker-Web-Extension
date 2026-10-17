# Safari and Firefox ports — research and proposal

_A record, not instructions. Once the PRs it leads to merge, the docs they change are the authority._

Session 32, 17 October 2026. `main` at `6821ca5`. Ticket: **none assigned** — `docs/GIT.md` says the keys are
Alex's; this file rides in the session PR under `CC-006` until he names one (decision (g)). Status: **researched;
nothing built.** The two engine reports it rests on are verbatim in `03-sources/` (§Sources). Review state is in
`PROGRESS.md`.

## Why

Alex, Session 31: "Let's look at safari and firefox", including whether Safari needs its own repo, and what
Firefox needs. `docs/ARCHITECTURE.md` §Safari and other browsers lists five untried Safari points and says Firefox
"is not a target and nothing has been checked against it". The sibling web app shares domain logic and no code,
which is the shape a second repo would repeat.

## Method

Two research agents (Fable 5.1, `high`), one per engine, read-only, each answering twelve or thirteen questions
with a table of claim, source URL, verbatim quote under 15 words (or a marked paraphrase), version, and a status
of VERIFIED, UNVERIFIED or SOURCES DISAGREE. Primary sources only count as VERIFIED: Apple's documentation (read
through its Markdown endpoints, since the HTML is a JavaScript app), WebKit's source and bug tracker, Apple's
release notes and WWDC transcripts, MDN pages plus the `mdn/browser-compat-data` JSON (MDN's rendered compat
tables are not in its HTML), extensionworkshop.com, Bugzilla, Firefox's manifest schema and the addons-linter
rules. Forum posts are cited only as secondary and never as VERIFIED.

- `03-sources/safari.md`: 143 rows, 129 VERIFIED, 11 UNVERIFIED, 3 SOURCES DISAGREE.
- `03-sources/firefox.md`: 168 rows, 151 VERIFIED, 13 UNVERIFIED, 4 SOURCES DISAGREE (about ten VERIFIED rows
  carry an UNVERIFIED tail, all repeated in its Open points).

The coordinator re-fetched two of the Firefox report's load-bearing pages itself (MDN's `background` key page and
its `activeTab` page) and found the quotes exact, and fetched the Playwright and GitHub billing facts in
§Distribution directly. Every engine claim below is one of those rows, cited by URL where it carries a decision;
anything UNVERIFIED is in §What must be run, not asserted as fact. Nothing in the repo was changed by the research.

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
  <https://developer.apple.com/programs/whats-included/>). Simulators are free.
- **An Xcode project**, needed for iOS testing and for any distribution
  (<https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension>). Not needed for
  the experiments in §What must be run: since Safari 18.4 a built folder installs temporarily from the Develop
  menu ("Add Temporary Extension…") and is removed after 24 hours or when Safari quits (same page; Safari 18.4
  release notes).
- **A distribution channel**: the Mac App Store, or since Safari 18.4 a Developer-ID-signed and notarized app
  outside it (distributing page; 18.4 release notes). iOS is App Store only. App Review guideline 4.4 wants the
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
   runs as a page in Firefox and a worker in Chrome. Safari, given both keys, runs `scripts` as a page too unless
   `preferred_environment` says otherwise (same page; WebKit's `WebExtension.cpp`: "Scripts takes precedence").
2. **`browser_specific_settings.gecko.id`**: "You must create an ID for signing Manifest V3 extensions; AMO does
   not assign an ID" (<https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings>).
   Email-shaped, 80 characters or fewer. Chrome ignores the whole key without a warning (Chromium's
   `kIgnoredUnrecognizedKeys`); Safari "ignore[s] any unsupported manifest keys".
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

## The five mechanisms, engine by engine

`docs/ARCHITECTURE.md` names five things everything rests on. Chrome is today's behaviour; the other two columns
are what the documentation says, with the open points named.

| Mechanism                                                     | Firefox                                                                                                                                                                                                                                                                                                                                                    | Safari (macOS; iOS where it differs)                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeTab` from the toolbar click                            | Since Firefox 48. Grants "the active tab only" (Chrome derives host permissions from the URL); "any navigation resulting in a new document ends the access". No install-time warning.                                                                                                                                                                      | Since Safari 14, iOS 15. Apple: "Use the `activeTab` permission to minimize access requests". WebKit attaches a temporary pattern for the current URL on the gesture and clears it when the site changes; "Safari won't display a prompt when granting this permission" (WWDC21).                                                                                      |
| `tabs.captureVisibleTab` from the background                  | Since 47; under `activeTab` only "from Firefox 126" (125 and earlier needed `<all_urls>`). Returns a data URL; the repo passes `format: 'png'`, so the default-format difference is moot.                                                                                                                                                                  | Since 14, iOS 15. Apple: "Doesn't require `all_urls` permission"; WebKit's error string names "either the 'activeTab' permission or granted host permissions". iOS has unresolved developer-forum reports of cropped or half-resolution captures (iOS 16 to 17), unconfirmed by Apple: experiment S2.                                                                  |
| The background relay, addressed by `sender.tab`               | The background is an event page, not a worker (§What does Firefox need, item 1). `sender.tab` is "only present when the connection was opened from a tab (including content scripts)"; whether a message from the `moz-extension://` iframe embedded in a tab carries it is undocumented and uncovered by Firefox's own tests: experiment F2.              | Service worker since 15.4, but with both background keys Safari runs the page. WebKit populates `sender.tab` whenever the sending page maps to a tab (`WebExtensionContextAPIRuntimeCocoa.mm`), which an iframe in a tab does; Safari's own behaviour untested: experiment S3. Messages are capped at 64 MiB of JSON, far above a PNG of the viewport.                 |
| `document.execCommand('copy')` inside the cross-origin iframe | Documented to work in extensions "without special permission in short-lived event handlers triggered by user actions" (MDN, Interact with the clipboard). Firefox supports neither the `Permissions-Policy` header nor the `clipboard-write` directive, so Chrome's `allow` story has no counterpart; `writeText` in the iframe is untested.               | WebKit gates copy on `processingUserGesture()` and `writeText` on transient activation, with no origin or policy check in either path; its Permissions-Policy token list has no clipboard entry. Untested in the iframe: experiment S4.                                                                                                                                |
| The iframe panel (`web_accessible_resources` + `getURL`)      | MV3 object form since 109; "any path can be included" in `matches`. Firefox's own mochitest loads an extension page in an iframe created by a content script, with full extension privileges (bug 1258347, fixed in 49).                                                                                                                                   | `safari-web-extension://<UUID>`, and "the host of your extension URL changes across every launch of Safari" (WWDC20), so `use_dynamic_url` is "always dynamic" and WebKit does not even read the key. An Apple engineer gave exactly this recipe in June 2025: list the HTML under `web_accessible_resources`, build the iframe with `getURL()`.                       |
| `action.openPopup` for the error popup                        | Since 109; a user gesture is required before 149. Whether an awaited `setPopup` then `openPopup` inside `onClicked` still counts as the gesture is untested (F6).                                                                                                                                                                                          | Since Safari 16 ("Added the ability to open a Safari Web Extension popover programmatically"). `docs/ARCHITECTURE.md` says it "is not available"; that is stale. `setPopup({ popup: null })` is accepted from 18; the repo passes `''`, untested (S5).                                                                                                                 |
| The `chrome.*` namespace                                      | Supported "for APIs that are compatible with Chrome", with callbacks. Whether `chrome.tabs.sendMessage(...)` with no callback returns a Promise, which `background.js` relies on in three places, is not stated anywhere read: experiment F1. Chrome itself exposes `browser.*` from Chrome 148, so a `globalThis.browser ?? chrome` shim is the fallback. | "Safari web extensions support both the `chrome.*` and `browser.*` namespaces" and "both the callback and `Promise` approaches" (Apple's compatibility page).                                                                                                                                                                                                          |
| The manifest content script on `<all_urls>`                   | An opt-in host permission in MV3: "Registered content scripts are only executed if the extension is granted host permissions for the domain." Shown and granted at install from Firefox 127 (not before), revocable per site afterwards. On a revoked site `initChecker` finds no listener and the error popup appears.                                    | Does not run until the user grants the site: "the user will see your extension's toolbar icon badge the first time they visit a web site" (WWDC20), and WebKit adds static scripts only for granted patterns. The first click on each new site is the grant; whether the script is injected in time for the same click's `initChecker` is undocumented: experiment S1. |

## The one design change the ports force: how the content script gets in

Chrome injects a manifest content script everywhere at install. Firefox and Safari both treat `<all_urls>` as a
host permission the user controls, so the current flow degrades differently on each: Firefox works on a fresh
install (127 and later) but shows the error popup on any site the user has revoked; Safari badges the icon on
every new site and injects only after the grant, with a possible race against the same click's message.

The pattern both document for "run on click" is `permissions: ["activeTab", "scripting"]` and
`scripting.executeScript({ target: { tabId }, files: ["app/content.js"] })` inside `action.onClicked`, then
`tabs.sendMessage(initChecker)` (MDN's `activeTab` page example; `scripting.executeScript` works "either
explicitly as a host permission or using the `activeTab` permission"). Safari supports `scripting` (WebKit's
permission list) and its review guideline 4.4.2 pushes the same way.

Consequences if adopted for all three browsers (decision (a)):

- `content.js` must be idempotent: a second click injects it again, so the `onMessage` listener and the module's
  state need a `window`-level guard, or the file registers nothing when `[data-cc-checker]` already exists.
- The "tab open before install" failure in `background.js` disappears, since nothing has to be there already.
- The content script is no longer resident on every page the user visits, which is also what the `<all_urls>`
  entry in `web_accessible_resources` keeps allowing; that entry stays as is.
- Chrome's install-time warning for `<all_urls>` content scripts would go too. Not re-checked in this research;
  the Chrome Web Store listing would need re-review either way.
- The alternative is two code paths: the manifest script for Chrome, on-click injection for the others. Nothing
  found favours it.

## Minimum versions

- **Firefox.** The documented facts imply 121 (dual background keys), 126 (`captureVisibleTab` under
  `activeTab`), 129 (no attention dot for `activeTab`-only MV3 extensions, bug 1851083) and 140 (the
  data-collection key recognised without a warning). `strict_min_version: "140.0"` admits every behaviour above
  with no warnings; `"128.0"` is the floor at which nothing errors. Decision (b).
- **Safari.** 15.4 is the MV3 floor (Apple: "Safari 15.4 and later supports manifest versions 2 and 3"); 16 adds
  `openPopup`, which the `typeof` guard already tolerates missing; 18.4 adds temporary install and Developer ID
  distribution, both developer-side. App Review requires the extension to "run on the current version of
  Safari" anyway. `browser_specific_settings.safari.strict_min_version: "15.4"` is the documented choice; on iOS
  the Safari version equals the iOS version.
- **Chrome.** `browserslist` is `chrome >= 111`. A shared manifest carrying `background.scripts` moves the real
  floor to 121, where Chrome starts ignoring the key; per-browser manifests leave Chrome's as it is.

## Does `public/app/*.js` need a build, and does a shared `messages.ts` come back?

No, and no. Neither port renames a message or adds a context, so §Next workstreams item 4's re-entry condition
does not fire. What the ports add is:

- **A per-browser manifest step.** Vite copies `public/` verbatim, so a small script beside `scripts/package.mjs`
  (`scripts/manifest.mjs`, say) writes the target's manifest into `build/` from the base plus a per-browser patch
  (Firefox: the four changes above; Safari: `browser_specific_settings.safari`, and the dual background key if
  Safari is to run a page). `npm run package -- firefox` then zips the right manifest. If F3 shows Firefox only
  warns on `use_dynamic_url`, one manifest with both background keys serves all three and the script goes away,
  at the cost of Chrome's floor moving to 121 (decision (c)).
- **Possibly one line per file.** If F1 shows `chrome.*` returns no Promise in Firefox, `const api =
globalThis.browser ?? chrome;` at the top of both plain scripts and a `src/utils/browser-api.ts` typed as
  `typeof chrome` for the seven `src/` call sites. Chrome 148 and later expose `browser.*` itself.
- **`web-ext lint`** (addons-linter) in the Linux CI job: it is what flags `ADDON_ID_REQUIRED`,
  `BACKGROUND_SERVICE_WORKER_NOFALLBACK` and `MISSING_DATA_COLLECTION_PERMISSIONS`, each already named in the
  Firefox report.

## Distribution, cost and testing

|                | Firefox                                                                                                                                                                                                                                                                                                                                                                                                                              | Safari on macOS                                                                                                                                                                                    | Safari on iOS                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Channel        | addons.mozilla.org, listed or self-distributed; both signed by AMO, "up to 24 hours", manual review possible at any time. Listed and unlisted versions may share one ID (Mozilla, 2017).                                                                                                                                                                                                                                             | Mac App Store, or Developer ID plus notarization (Safari 18.4 and later). Notarization "is not App Review".                                                                                        | App Store only. Device testing needs the Program; simulators do not.                                                                       |
| Source review  | Required for bundled or minified code: "You must upload your extension's source code" with a README of build steps, environment and tool versions, and the lockfile; the reviewer rebuilds and "There must be no differences" (<https://extensionworkshop.com/documentation/publish/source-code-submission/>). `npm ci && npm run build` from `.nvmrc`'s Node is the whole recipe today; byte-identical output must be checked once. | App Review of the containing app (guideline 4.4), or none under Developer ID.                                                                                                                      | App Review.                                                                                                                                |
| Cost           | Free.                                                                                                                                                                                                                                                                                                                                                                                                                                | 99 USD a year.                                                                                                                                                                                     | Same membership.                                                                                                                           |
| CI             | The existing Linux job can lint (`web-ext lint`) and zip the Firefox build.                                                                                                                                                                                                                                                                                                                                                          | `xcodebuild` on GitHub's `macos-15` image (Xcode 16.4 default); standard GitHub-hosted runners are free for public repositories, and this one is public. The packager on a runner is untried (S6). | Same image; a simulator run at most.                                                                                                       |
| Automated e2e  | None in this harness: Playwright says "Extensions only work in Chromium when launched with a persistent context" (<https://playwright.dev/docs/chrome-extensions>). Firefox extension automation was not researched.                                                                                                                                                                                                                 | None in this harness. Safari 26 "Added support for web extensions in WebDriver", so SafariDriver is a future path.                                                                                 | None.                                                                                                                                      |
| Platform notes | Firefox for Android lists MV3 extensions on AMO (since December 2023) and needs at least an empty `gecko_android` object, set only after verifying on a device; BCD oddly marks `web_accessible_resources.matches` false there. Out of scope until desktop ships.                                                                                                                                                                    | Granting a site "grants the extension access to the site across all profiles, private browsing". A version that "requests more host permissions" is turned off on update (16.4).                   | The loupe uses `mousemove` and `click`; Apple: "Use pointer events instead of mouse events to handle touch interactions." Phase 3 at best. |

## What must be run before any code

Each is a load-bearing behaviour the documentation does not settle. Firefox runs need only a temporary install of
a built folder with a patched manifest (Firefox's temporary add-on loading, not re-checked here); Safari runs
need Safari 18.4 or later and "Add Temporary Extension…". Results go to `03-sources/experiments.md`, each with the
browser version.

| #   | Browser | Question                                                                                                                                                | Decides                                                                    |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| F1  | Firefox | Does `chrome.tabs.sendMessage(...)` with no callback return a Promise? (`background.js` lines 26, 58 and 83 depend on it.)                              | Whether the shim is needed.                                                |
| F2  | Firefox | Does a `runtime.sendMessage` from the `moz-extension://` iframe inside a tab arrive with `sender.tab` set?                                              | Whether the relay works unchanged, or the iframe needs a tab id handshake. |
| F3  | Firefox | Is `use_dynamic_url` in an MV3 `web_accessible_resources` entry an install error or a warning on current Firefox?                                       | Decision (c): one manifest or per-browser.                                 |
| F4  | Firefox | Does `execCommand('copy')` return `true` in the iframe's click handler? Does `navigator.clipboard.writeText` also work there?                           | Whether `copyText` is enough as is.                                        |
| F5  | Firefox | With the manifest script kept, does a toolbar click under `activeTab` reach a site whose host permission was revoked?                                   | Only if decision (a) keeps the manifest script.                            |
| F6  | Firefox | Does `showErrorPopup`'s awaited `setPopup` then `openPopup` still count as the click's gesture on Firefox below 149?                                    | Whether the error popup shows.                                             |
| S1  | Safari  | On a site not yet granted, does the first toolbar click inject the content script before `initChecker` arrives, or does `tabs.sendMessage` reject?      | Decision (a), and the first-use flow in the README.                        |
| S2  | Safari  | Does `captureVisibleTab` succeed under the temporary `activeTab` grant on macOS, and does the loupe's `devicePixelRatio` maths hold? Then on an iPhone. | Whether the eyedropper ports; whether iOS is viable at all.                |
| S3  | Safari  | Does the iframe's `runtime.sendMessage` carry `sender.tab`?                                                                                             | As F2.                                                                     |
| S4  | Safari  | Does `execCommand('copy')` work in the iframe's click handler; is the extension origin a secure context for `navigator.clipboard`?                      | As F4.                                                                     |
| S5  | Safari  | Does `setPopup({ popup: '' })` unbind the error popup (only `null` is documented, from 18)?                                                             | A one-token change in `background.js` if not.                              |
| S6  | CI      | Do `xcrun safari-web-extension-packager --no-open --no-prompt` and `xcodebuild` run on `macos-15`?                                                      | Whether Safari gets a CI job, and when.                                    |

## Proposal

Order: Firefox first, because it costs nothing, needs no Xcode and no Program membership, its experiments run on
this Mac in minutes, and it forces the per-browser manifest and the injection decision that Safari then reuses.

0. **Experiments (one session, no code merged).** F1 to F6 and S1 to S5 above, on this Mac. Output:
   `03-sources/experiments.md`, and this file's open rows rewritten as facts. Needs Alex's Safari version
   (18.4 or later for the temporary install) and a Firefox install.
1. **Firefox port (one or two PRs).** Decisions (a) to (d) built: the manifest step, the injection model, the
   shim if F1 needs it, the idempotent `content.js`, `web-ext lint` in CI, the source-submission README, an AMO
   account and the first listed version. `docs/ARCHITECTURE.md` and `README.md` updated in the same PR.
2. **Safari on macOS.** `safari/` holding the packager's Xcode project referencing `build/`; the Program
   membership; the channel chosen (decision (e)); the containing app's screen; a release checklist beside the
   Chrome one in `docs/GIT.md` §Releases. CI job only if S6 passes and Alex wants it.
3. **Safari on iOS, if ever.** Pointer events for the loupe, `captureVisibleTab` quality on a device, App Review.
   Nothing above depends on it.

### Decisions for Alex (lettered; each with the recommendation)

- **(a) Injection model.** On-click `scripting.executeScript` under `activeTab` + `scripting` for all three
  browsers (recommended: one code path, the documented pattern on both new engines, and it removes the
  stale-tab failure), or the manifest script kept for Chrome with on-click injection only for Firefox and
  Safari.
- **(b) Firefox `strict_min_version`.** `140.0` (recommended) or `128.0`.
- **(c) Manifests.** Per-browser manifests written by a script (recommended until F3 says otherwise), or one
  shared manifest with both background keys and Chrome's floor at 121.
- **(d) The Firefox add-on ID.** Email-shaped, 80 characters or fewer, e.g. `cc-checker@alexclapperton.co.uk`;
  Alex's string, since it is permanent.
- **(e) Safari channel and scope.** Mac App Store, Developer ID, or both; whether iOS is in scope at all; and
  when the 99 USD is spent (recommended: after S1 to S5 pass, not before).
- **(f) Same repo.** `safari/` in this repo, the Xcode project committed, derived data ignored (recommended).
- **(g) Ticket key(s).** One for both ports, or one each; also whether this research file moves under it.
- **(h) Order.** Firefox first (recommended), or Safari first because it was the stated goal.
- **(i) Doc corrections now or with phase 1.** §Corrections below.

## Corrections to existing docs found on the way

For `copilot-surrogate` when the PR that touches them comes; this research changes none of them.

- `docs/ARCHITECTURE.md` §Safari and other browsers: `chrome.action.openPopup` **is** available from Safari 16;
  the converter is now `safari-web-extension-packager`; `use_dynamic_url` is not "Chromium-only" so much as
  Chrome-only in effect (BCD: effective from Chrome 130, "always dynamic" in Safari, unsupported in Firefox);
  Safari's `activeTab` and `captureVisibleTab` are now documented, the per-site grant model is the real
  difference; "Firefox is not a target" changes when (h) is decided.
- `docs/ARCHITECTURE.md` §Deliberately not changed: the clipboard re-entry says "Safari has no
  `featurePolicy`", which the Permissions-Policy BCD supports (no `clipboard-write` in Safari or Firefox).
- `package.json` `name` and `description`, and `README.md`, say "chrome extension".

## Sources

- `03-sources/safari.md` and `03-sources/firefox.md`: the two agents' reports, verbatim, each ending with the
  list of every URL read and its open points. Prettier ignores the folder, as it does `02-sources/`.
- Fetched by the coordinator: <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background>,
  <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission>,
  <https://playwright.dev/docs/chrome-extensions>,
  <https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-actions>.
