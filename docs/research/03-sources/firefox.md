_Recorded verbatim from the Session 32 Firefox research agent (Fable 5.1, 17 October 2026). Read-only research; forum sources are secondary and never VERIFIED. The proposal it feeds is `../03-safari-firefox-ports.md`._

# Firefox port: documented facts (gathered 17 October 2026)

Scope: what MDN (pages and browser-compat-data, "BCD"), extensionworkshop.com, Mozilla's add-on
policies, Bugzilla and Firefox's own source/test tree say about the twelve questions. Read-only
research; nothing in the repo was changed. The extension under study: MV3, `activeTab` only,
manifest content script on `<all_urls>` top frame only, service worker relay, `captureVisibleTab`
from the service worker, extension page (`index.html`) in an iframe injected into the host page,
`document.execCommand('copy')` inside that iframe, `web_accessible_resources` with
`use_dynamic_url: true`, Vite bundle plus two verbatim scripts.

Conventions. Quotes are verbatim and under 15 words; longer material is paraphrased and marked
"(paraphrase)". "Version" is the Firefox version the source gives; "—" means the source gives none.
Status: VERIFIED = read in a primary source (MDN, BCD, extensionworkshop, Bugzilla, Firefox source);
UNVERIFIED = only a secondary source (forum, blog comment) or no source found; SOURCES DISAGREE =
two sources read conflict, both quoted. BCD "mirror" for Firefox for Android means the same value as
desktop Firefox. WebFetch strips MDN's rendered compat tables, so every compat number below comes
from the BCD JSON on GitHub, which is what those tables render.

---

## 1. Manifest V3 in Firefox and the background script

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| MV3 is generally available in Firefox 109; developer preview from 101 | https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | "Manifest V3 became generally available in Firefox 109" | 109 (preview 101) | VERIFIED |
| Firefox 109 release notes confirm signing and release of MV3 on AMO | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/109 | "Manifest V3 is now supported with the ability to sign and release" | 109 | VERIFIED |
| `background.service_worker` is not supported in Firefox | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background | "`background.service_worker` is not supported (see Firefox bug 1573659)" | — (still true on page as read) | VERIFIED |
| BCD: `service_worker` firefox `false`, firefox_android mirror; Chrome 88; Safari 15.4 | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/background.json | version_added: firefox false (paraphrase of JSON) | — | VERIFIED |
| Tracking bug is open, meta, P3, no resolution, last touched today | https://bugzilla.mozilla.org/rest/bug/1573659?include_fields=id,summary,status,resolution,priority,cf_user_story,last_change_time,creation_time,whiteboard,keywords | summary "[meta] Background Service Worker for Manifest v3"; status "NEW"; priority P3; created 2019-08-13; last_change 2026-10-17T16:32:22Z; user story "user-impact-score:450" | — | VERIFIED |
| Firefox for Android has no background service workers either; use event pages | https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/ | (paraphrase) background service workers aren't supported on Firefox for Android, so use event pages | — | VERIFIED |
| Event page = `background.scripts` with `persistent: false`; MV3 defaults to false; `true` in MV3 is an error | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background | "defaults to `true` in Manifest V2 and `false` in Manifest V3. Setting to `true` in Manifest V3 results in an error." (two quotes) | — | VERIFIED |
| Non-persistent background pages supported from Firefox 106; 105 and earlier run them as persistent | https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | "Firefox supports non-persistent background pages from Firefox 106." | 106 | VERIFIED |
| Firefox schema marks `persistent` as `max_manifest_version: 2` | https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/schemas/manifest.json | `"persistent"`: optional boolean, `"max_manifest_version": 2` (paraphrase of schema) | — | VERIFIED |
| Listener registration survives event-page unload; other state does not — use `storage` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background | "Registration of listeners is persistent when the page is unloaded from memory" | — | VERIFIED |
| Declaring both `scripts` and `service_worker` is the documented cross-browser pattern | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background | "specify both `scripts` and `service_worker` in the `background` key" | — | VERIFIED |
| Firefox uses `scripts` when both present — but only from Firefox 121; 120 and earlier did not start the background page if `service_worker` was present (bug 1860304) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background | "From Firefox 121, the background page starts as expected, regardless of the presence of `service_worker`." | 121 | VERIFIED |
| Chrome: before 121 refuses to load an MV3 manifest with `background.scripts`; from 121 ignores it | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background | "From Chrome 121, their presence in a Manifest V3 extension is ignored." | Chrome 121 | VERIFIED |
| Safari: supports both; uses `scripts` unless `preferred_environment: service_worker` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background | "Safari uses `background.scripts` (or `background.page`) unless `preferred_environment` is set" | Safari 18 for `preferred_environment` (BCD) | VERIFIED |
| `preferred_environment` is not needed for the fallback; Firefox 136 recognises the key | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/background.json | preferred_environment firefox "136"; chrome false; safari 18 (paraphrase) | 136 | VERIFIED |
| addons-linter: a `service_worker` without `scripts` is an error; with `scripts` a warning | https://raw.githubusercontent.com/mozilla/addons-linter/master/docs/rules.md | `BACKGROUND_SERVICE_WORKER_NOFALLBACK` (error): "must be paired with use of `/background/scripts`"; `BACKGROUND_SERVICE_WORKER_IGNORED` (warning): "unsupported and ignored on Firefox" | — | VERIFIED |
| `background.type: "module"` is supported for page/scripts, not for service_worker (bug 1775574) | https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/schemas/manifest.json | "Only supported for page/scripts; not for service_worker yet, see bug 1775574" | BCD: `type` Firefox 112 | VERIFIED |
| In Firefox the background script is a page (has `document`, `Image`, `alert` restrictions); the service-worker API surface (`self`, no DOM) is Chrome's | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension | "Firefox retains the use of background pages, while Safari supports background pages and service workers." | — | VERIFIED |

Design consequence: `public/app/background.js` must run both as a Chrome service worker and as a Firefox
event-page script. The documented pattern is a single `background.js` listed under both keys. Anything
in it that is service-worker-only (`self.addEventListener`, `importScripts`) or DOM-only (`document`)
breaks one side; today's file uses neither, so the same file should load in both (UNVERIFIED until run).

## 2. `browser_specific_settings`

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| `gecko.id` is mandatory for signing any MV3 extension (AMO or self-distributed); AMO will not assign one | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | "You must create an ID for signing Manifest V3 extensions; AMO does not assign an ID." | — | VERIFIED |
| MV3 migration guide says the same | https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | "The add-on ID is required to publish your extension." | — | VERIFIED |
| addons-linter enforces it as an error | https://raw.githubusercontent.com/mozilla/addons-linter/master/docs/rules.md | `ADDON_ID_REQUIRED` (error): "The add-on ID is mandatory for Manifest Version 3" | — | VERIFIED |
| ID format: email-like string of 80 chars or less (recommended) or a GUID | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | regex `^[a-zA-Z0-9-._]*@[a-zA-Z0-9-._]+$` (paraphrase) | — | VERIFIED |
| `strict_min_version`: Firefox below it will not install or run the extension; `*` not valid | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | "the extension is not installed or not run" | — | VERIFIED |
| Oldest version that can receive updates is 115 ESR, or 128 without ESR (root cert expiry, March 2025) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | "The minimum supported version capable of receiving updates is 115.0 (ESR)" | 115 / 128 | VERIFIED |
| AMO: a new version must be submitted to change the compatible range | https://extensionworkshop.com/documentation/publish/version-compatibility/ | "you must submit a new version of the extension to modify the range" | — | VERIFIED |
| Chrome ignores the key | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | "Chrome doesn't use this key and ignores it if present" | — | VERIFIED |
| Chrome does not even warn: Chromium's `kIgnoredUnrecognizedKeys` lists `browser_specific_settings` and `$schema` | https://chromium.googlesource.com/chromium/src/+/main/extensions/common/manifest_constants.h?format=TEXT | "A list of keys that do not generate warnings when specified in the manifest" | current Chromium main | VERIFIED |
| Older Chrome did show "Unrecognized manifest key 'browser_specific_settings'" | https://discourse.mozilla.org/t/allow-upload-zip-file-without-extension-id-via-amo-web-ui/125882 (forum, via search summary) | (paraphrase) loading in Chrome showed that warning; extension still ran | — | SOURCES DISAGREE (forum report vs current Chromium source; no Chrome version for the change found) |
| Safari: the key is "not required"; what Safari does with the `gecko` sub-key is not stated | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | "In Safari, not required." | — | VERIFIED (that it is not required); UNVERIFIED (warning vs ignore — undocumented) |
| Safari's converter warns about many unsupported manifest keys in general | https://developer.apple.com/forums/thread/696367 (Apple forum, via search summary) | (paraphrase) converter flagged "basically every key"; builds still ran | — | UNVERIFIED (secondary) |
| `data_collection_permissions`: declares required/optional data types the extension collects and transmits | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | "data types that the extension collects and transmits for storage and processing outside the extension" (paraphrase; quote cut) | — | VERIFIED |
| Supported from Firefox 140 desktop, 142 Android | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/browser_specific_settings.json | data_collection_permissions firefox "140", firefox_android "142" | 140 / 142 | VERIFIED |
| extensionworkshop confirms 140 / 142 | https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/ | "Firefox for desktop 140 and later, and Firefox for Android 142 and later" | 140 / 142 | VERIFIED |
| Required by AMO for new extensions submitted from 3 November 2025 | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings | "new extension submitted to addons.mozilla.org from November 3, 2025" | — | VERIFIED |
| Existing (pre-3 Nov 2025) extensions: not yet required for updates; "at a later date", no date given | https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/ | (paraphrase) add-ons created before 3 November don't need it yet; required "at a later date" | — | VERIFIED |
| An extension that collects nothing sets `"required": ["none"]`; install prompt then says no data collected | https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/ | (paraphrase) `"required": ["none"]`; about:addons lists "no data collected" | 140 | VERIFIED |
| `none` must not be combined with other required types (linter error) | https://raw.githubusercontent.com/mozilla/addons-linter/master/docs/rules.md | `NONE_DATA_COLLECTION_IS_EXCLUSIVE` (error) | — | VERIFIED |
| Linter warns when the key is missing | https://raw.githubusercontent.com/mozilla/addons-linter/master/docs/rules.md | `MISSING_DATA_COLLECTION_PERMISSIONS` (warning): "required for all new Firefox extensions" | — | VERIFIED |
| On Firefox older than 140 the key is an unrecognised `gecko` sub-property: a warning, not an install error, from Firefox 128 | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/128 | "Extensions containing an unrecognized property in manifest key browser_specific_settings.gecko now load with a warning." | 128 (bug 1757293) | VERIFIED |
| Before 128 an unknown `gecko` sub-property errored on install | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/128 | "Previously, these extensions errored on installation." | <128 | VERIFIED |
| `gecko_android`: at least an empty object signals Android compatibility to AMO; absent → AMO assumes not Android-compatible | https://extensionworkshop.com/documentation/publish/version-compatibility/ | "AMO assumes that the extension is not compatible with Android." | BCD: `gecko_android` Firefox for Android 113 | VERIFIED |

Design consequence: this extension sends no data anywhere, so `"data_collection_permissions": { "required": ["none"] }`
is the whole declaration; it is mandatory for a new AMO listing and harmless on 128–139 (warning only).
A `strict_min_version` of 140 would silence that warning but is not required; one of at least 121 is
implied by the dual `scripts`/`service_worker` manifest (§1), and 126 by `captureVisibleTab` under
`activeTab` (§3).

## 3. `activeTab`

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| Supported in Firefox since 48 (Android mirror); Chrome 26; Safari 14 | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/permissions.json | activeTab firefox "48" (paraphrase of JSON) | 48 | VERIFIED |
| Granted by clicking the toolbar button, a context-menu item, a `commands` shortcut (from 63), an omnibox suggestion (from 142) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "clicking the extension's toolbar button or page action." | 63 / 142 for the later two | VERIFIED |
| Grants: script/CSS injection via `scripting` (needs the `scripting` permission too), privileged `url`/`title`/`favIconUrl`, `captureVisibleTab` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "Capture the tab's contents with `tabs.captureVisibleTab()` (from Firefox 126)." | 126 | VERIFIED |
| It is an API permission, not a host permission, and does not by itself grant any API | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "`activeTab` is an API permission, not a host permission." | — | VERIFIED |
| `captureVisibleTab` with `activeTab`: Firefox 126+; 125 and earlier needed `<all_urls>` | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/tabs.json | "From Firefox 126, available with either the `<all_urls>` or `activeTab` permissions." | 126 | VERIFIED |
| `scripting.executeScript` works with `activeTab` (plus the `scripting` permission) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript | "either explicitly as a host permission or using the `activeTab` permission" | MV3 from Firefox 101; MV2 from 102 | VERIFIED |
| `tabs.sendMessage` and `activeTab`: no permission requirement is documented for `tabs.sendMessage`; the activeTab page never mentions it | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission ; https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/tabs.json | (paraphrase) sendMessage: Firefox 45, Android 54, no notes; activeTab page silent | 45 | VERIFIED that it is undocumented; the practical question (does a message reach a content script on an ungranted host) is UNVERIFIED — see §6 |
| Firefox grants access to the active tab only; Chrome derives host permissions from the tab's URL (more access) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "Firefox and Safari grant access to the active tab only." | — | VERIFIED |
| Firefox access ends on any navigation that creates a new document; restored from bfcache; Chrome keeps it across same-origin reloads | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "Any navigation resulting in a new document ends the access" | — | VERIFIED |
| Scope: top-level page and same-origin frames; cross-origin frames need host permissions | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "grants scripting access to the top-level page in the tab and to same-origin frames" | — | VERIFIED |
| Special pages (reader view, view-source, PDF viewer, browser UI) refuse injection even with activeTab | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "Some special pages don't allow script injection, including reader view, view-source, the PDF viewer" | — | VERIFIED |
| `activeTab` avoids an install-time warning in Firefox and Chrome | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | "so `activeTab` avoids an install-time warning" | — | VERIFIED |
| In Firefox, an MV3 extension with only `activeTab` no longer shows the blue attention dot on every site (bug 1851083), fixed 129 and ESR 128.1 | https://bugzilla.mozilla.org/rest/bug/1851083/comment ; https://bugzilla.mozilla.org/rest/bug/1851083?include_fields=id,summary,status,resolution,cf_status_firefox129,target_milestone,creation_time,last_change_time | patch "Do not show the attention badge for mv3 extensions requiring the activeTab permission"; VERIFIED FIXED, "129 Branch" | 129 (ESR 128.1) | VERIFIED |

## 4. `tabs.captureVisibleTab`

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| Supported: Firefox 47, Firefox for Android 54, Chrome 5, Safari 14 | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/tabs.json | captureVisibleTab firefox "47", firefox_android "54" (paraphrase) | 47 / 54 | VERIFIED |
| Permission: `<all_urls>` or `activeTab`; `activeTab` only from 126 | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/captureVisibleTab | "In Firefox 125 and earlier, this method was only available with the `<all_urls>` permission." | 126 | VERIFIED |
| With `activeTab` it can even capture sensitive pages (browser UI, other extensions' pages) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/captureVisibleTab | "These sensitive sites can only be captured with the `activeTab` permission." | — | VERIFIED |
| Signature: `captureVisibleTab(windowId?, options?: extensionTypes.ImageDetails)`; returns a Promise of a data URL | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/captureVisibleTab | "fulfilled with a data URL that encodes the captured image" | — | VERIFIED |
| Default format differs: Chrome and Safari note "The default file format is 'jpeg'"; Firefox has no such note (MDN `ImageDetails` default is `png`) | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/tabs.json | chrome/safari notes: "The default file format is 'jpeg'." | — | VERIFIED (the repo passes `format: 'png'` explicitly, so moot) |
| `ImageDetails` fields (`format`, `quality`, `rect`, `scale`) were not read on the captureVisibleTab page | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/extensionTypes/ImageDetails | not fetched | — | UNVERIFIED (not needed: the repo uses only `format`) |
| Firefox for Android: BCD gives 54 and no Android-specific note | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/tabs.json | firefox_android "54", no notes | 54 | VERIFIED (BCD); real device behaviour UNVERIFIED |
| The screenshot is of the visible viewport at device pixels, so the loupe's `devicePixelRatio` maths carries over | — | undocumented on MDN | — | UNVERIFIED |

## 5. `action.openPopup`

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| MV3-only API; Firefox 109 (Android mirror); Chrome 127 generally (118–126 policy-installed only); Safari 16 | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/action.json | openPopup firefox "109"; chrome "127" and "118"–"127" policy-only | 109 | VERIFIED |
| User gesture required before Firefox 149; not from 149 | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/action.json | "Before Firefox 149, a user gesture is required to call this API." | 149 | VERIFIED |
| `windowId`: in Chrome and from Firefox 149 an unfocused window rejects the call | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/action/openPopup | "In Chrome and from Firefox 149, if the window ID is for an unfocused window, the API call is rejected." | 149 | VERIFIED |
| Returns a Promise; rejects with an error message if the popup isn't opened | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/action/openPopup | "If the popup isn't opened, rejects with an error message." | — | VERIFIED |
| Whether `await setPopup(...)` followed by `openPopup()` inside `action.onClicked` still counts as the click's user gesture in Firefox <149 | — | undocumented | — | UNVERIFIED (the repo's `showErrorPopup` does exactly this) |

## 6. Manifest content scripts on `<all_urls>` under MV3

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| Registered content scripts run only if the extension holds host permission for the domain | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts | "Registered content scripts are only executed if the extension is granted host permissions for the domain." | — | VERIFIED |
| `content_scripts.matches` are requested as host permissions at install; users can opt in or out afterwards | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts | "Users can opt in or out of host permissions after installing the extension." | — | VERIFIED |
| MV3 host permissions are opt-in in Firefox (Mozilla add-ons blog, 17 Nov 2022) | https://blog.mozilla.org/addons/2022/11/17/unified-extensions-button-and-how-to-handle-permissions-in-manifest-v3/ | "MV3 treats host permissions (listed in the extension manifest) as opt-in." | 109 | VERIFIED (primary Mozilla blog) |
| Most browsers treat `host_permissions` as optional | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions | "most browsers treat `host_permissions` as optional" | — | VERIFIED |
| Firefox 126 and earlier: MV3 host permissions neither shown nor granted at install | https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | "In Firefox 126 and earlier, Manifest V3 host permissions were not granted during installation." | ≤126 | VERIFIED |
| From Firefox 127: host permissions from `host_permissions` AND `content_scripts` are shown in the install prompt (and, per the migration guide, granted at install) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions ; https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | "From Firefox 127, host permissions listed in `host_permissions` and `content_scripts` are displayed" | 127 (bug 1889402 "Grant origin permissions during install for mv3", FIXED, 127 Branch) | VERIFIED |
| Release note for 127 says the same | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/127 | "`host_permissions` for Manifest V3 extensions are now displayed to users during installation" | 127 | VERIFIED |
| New host permissions in an update are not shown (bug 1893232, still NEW) | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/127 ; https://bugzilla.mozilla.org/rest/bug?id=1839129,1889402,1893232&include_fields=id,summary,status,resolution,target_milestone | "if an extension update requests new host permissions, these are not shown to the user" | 127+ | VERIFIED |
| Users can grant or revoke any host permission at any time, so the extension should check and request | https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | "grant or revoke any host permission on an ad-hoc basis" | — | VERIFIED |
| `optional_host_permissions` exists from Firefox 128 | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/128 | "The optional_host_permissions manifest key has been added." | 128 | VERIFIED |
| Install-prompt controls for MV3 host permissions are still an open bug | https://bugzilla.mozilla.org/rest/bug?id=1839129,1889402,1893232&include_fields=id,summary,status,resolution,target_milestone | 1839129 "Offer controls for MV3 host permissions during install flow", NEW | — | VERIFIED |
| What the user sees: extensions button, per-site states "Only When Clicked" (default when not granted) and "Always Allow on <host>" | https://discourse.mozilla.org/t/content-js-now-need-permissions-on-each-matching-url/137164 | user quotes "Only When Clicked" and "Always Allow on chatgpt.com" | — (Nov 2024) | UNVERIFIED (forum; the SUMO page https://support.mozilla.org/en-US/kb/extensions-button failed to load) |
| Attention dot on the extensions button when a site needs a permission (green in panel per SUMO, via search summary) | https://support.mozilla.org/en-US/kb/extensions-button | (paraphrase) a notification dot appears when a site requires permissions | — | UNVERIFIED (page not readable; search summary only) |
| Does `activeTab` plus a toolbar click make a manifest-declared content script run on an ungranted host? MDN is silent; a forum user (non-staff) says yes, a second thread reports scripts "load only when user clicks" | https://discourse.mozilla.org/t/request-permissions-at-install-time-manifest-v3/121543 ; https://discourse.mozilla.org/t/content-js-now-need-permissions-on-each-matching-url/137164 | (paraphrase) juraj.masiar: clicking the toolbar icon grants activeTab host permission for the page, which lets the content script run | — | UNVERIFIED (undocumented on MDN; forum only) |
| The documented path for "run on click" is `scripting.executeScript` under `activeTab` + `scripting`, not a manifest script | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission | example manifest `"permissions": ["activeTab", "scripting"]` with `scripting.executeScript` in `action.onClicked` | — | VERIFIED |
| A content script already running in a top frame receives `tabs.sendMessage` (`runtime.onMessage` in content scripts) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts | table: background sends with `browser.tabs.sendMessage()`, content script receives with `browser.runtime.onMessage` (paraphrase) | 45 | VERIFIED (that the channel exists); whether a host grant can be revoked mid-session and cut the channel is undocumented — UNVERIFIED |
| Chrome does not inject manifest scripts into tabs already open at install; MDN gives no equivalent Firefox note | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/content_scripts.json | chrome note: "Content scripts are not applied to tabs already open when the extension is loaded." | — | VERIFIED (Chrome); Firefox behaviour UNVERIFIED |
| `all_frames` defaults to false (top frame only) — the repo's `window.self === window.top` guard is belt-and-braces | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts | "Defaults to `false`." | 48 | VERIFIED |
| In Firefox, content scripts stay injected after the user navigates away (bfcache); window properties are destroyed; Chrome destroys them | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "Content scripts remain injected in a web page after the user has navigated away." | — | VERIFIED |
| Firefox content-script global is not strictly `window` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "The global scope of the content script environment is not strictly equal to `window`" | — | VERIFIED |

Design consequence: in Firefox the `<all_urls>` manifest script is an opt-in host permission. From 127 it
is granted at install (so the status quo works on a fresh install), but a user can revoke it per site
or globally, after which `initChecker` has no listener and the service worker's `catch` shows the
error popup. The robust port is `scripting.executeScript` on click under `activeTab` + `scripting`
(the documented pattern), optionally keeping the manifest script for the already-granted case.

## 7. `web_accessible_resources`, `use_dynamic_url`, `moz-extension://`

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| MV3 object form (`resources` + `matches` or `extension_ids`) supported from Firefox 109; `matches`/`resources` Firefox for Android `false` in BCD | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/web_accessible_resources.json | matches firefox "109", firefox_android false; resources firefox "109", firefox_android false; extension_ids 109, Android mirror | 109 | VERIFIED (BCD) — the Android `false` is odd and worth testing; UNVERIFIED on device |
| `matches`: Firefox and Safari accept any path; Chrome requires `/*` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources | "In Firefox and Safari, any path can be included. In Chrome, the path must be set to `/*`." | — | VERIFIED |
| `use_dynamic_url` is not supported in Firefox | https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | "Firefox does not support the `use_dynamic_url` property." | — | VERIFIED |
| BCD: `use_dynamic_url` firefox `false`; Chrome effective from 130 (88–129 "Setting the property had no effect"); Safari "always dynamic" | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/web_accessible_resources.json | Chrome 88 note: "Setting the property had no effect."; Safari: "The extension's base URL is always dynamic in Safari." | Chrome 130 | VERIFIED |
| Firefox's manifest schema has no `use_dynamic_url`; the MV3 item object uses `additionalProperties: UnrecognizedProperty` | https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/schemas/manifest.json | (paraphrase) items: resources, matches, extension_ids; `"additionalProperties": { "$ref": "UnrecognizedProperty" }` | current main | VERIFIED |
| Firefox 111 rejected a manifest with `use_dynamic_url` as an error | https://discourse.mozilla.org/t/web-accessible-resources-error-in-manifest-json/112508 | "must not contain an unexpected "use_dynamic_url" property" | 111.0.1 (Mar 2023) | SOURCES DISAGREE: forum shows an error in 111; the current schema's `UnrecognizedProperty` plus bug 1495908 (unexpected properties labelled Warning, Firefox 71) imply a warning. Which applies to this nested array item today is UNVERIFIED — test it |
| Firefox pages live at `moz-extension://<uuid>/`; the UUID is random per browser instance, not the add-on ID | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources | "This ID is randomly generated for every browser instance." | — | VERIFIED |
| Chrome incompatibilities page: same, and so the manifest `key` property is unsupported | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "a random UUID that changes for every instance of Firefox" | — | VERIFIED |
| "Per install" is not the wording anywhere; MDN says per browser instance/profile | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources | (paraphrase) page says "per browser instance", never "per install" | — | VERIFIED (the UUID is stable within a profile — UNVERIFIED, undocumented here) |
| `runtime.getURL` is the documented way to get the URL, in content scripts too (Firefox 45) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources ; https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/runtime.json | "The recommended approach to obtaining the URL of the resource is to use `runtime.getURL`"; getURL firefox 45 | 45 | VERIFIED |
| An extension page can be loaded in an iframe inside a web page; Firefox's own test does it (content script creates `<iframe src=runtime.getURL(...)>`, listed in WAR) | https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/test/mochitest/test_ext_subframes_privileges.html | test `test_webext_contentscript_iframe_subframe_privileges` (paraphrase) | current main | VERIFIED (by Firefox test, not MDN prose) |
| Such an iframe gets full extension privileges (same as its parent extension context) — bug 1258347 fixed in 49 | https://bugzilla.mozilla.org/rest/bug/1258347?include_fields=id,summary,status,resolution,target_milestone | "ExtensionPage sub-frames should have the same privileges of the parent window", RESOLVED FIXED, mozilla49 | 49 | VERIFIED |
| But a nested sub-frame of that iframe has only content-script-level APIs (no `browser.tabs`) | https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/test/mochitest/test_ext_subframes_privileges.html | "Subframe of a content script privileged iframes has no access to privileged APIs" | — | VERIFIED (irrelevant to this repo: one level only) |
| A 2022 forum report of `chrome.tabs.query` missing in a moz-extension iframe went unanswered | https://discourse.mozilla.org/t/iframe-cant-find-chrome-tabs-query/102267 | (paraphrase) "Firefox don't allow me to use this API"; no replies | Aug 2022 | UNVERIFIED (secondary; the repo's iframe only uses `runtime`, which the Firefox test shows is available) |
| Since Firefox 105 other extensions need the resource listed to access it | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources (via search summary) | (paraphrase) from Firefox 105 resources must be listed for other extensions | 105 | VERIFIED |
| Firefox resolves URLs in injected CSS relative to the CSS file; Chrome relative to the page | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "URLs in injected CSS files are resolved relative to _the CSS file_." | — | VERIFIED (repo injects a `<style>` with a data: URL, so moot) |

Design consequence: drop `use_dynamic_url` from the Firefox manifest (and probably from Chrome's too, or
keep two manifests). Without a dynamic URL, the repo's stated reason the clipboard `allow` attribute
failed on Chrome disappears, but see §8: Firefox has no `clipboard-write` policy at all.

## 8. Clipboard inside the cross-origin extension iframe

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| `execCommand('copy')`/`('cut')` are deprecated and "no longer guaranteed to work" | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "deprecated and no longer guaranteed to work or be available on any browser" | — | VERIFIED |
| They still work in extensions without a permission inside a short-lived user-event handler | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "without special permission in short-lived event handlers triggered by user actions" | — | VERIFIED |
| Outside such a handler Firefox denies it with a console message; `clipboardWrite` lifts that | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "was denied because it was not called from inside a short running user-generated event handler." | — | VERIFIED |
| `execCommand` does not work on hidden inputs / `display: none` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "doesn't work on input fields of `type="hidden"`" | — | VERIFIED (the repo's `copyText` port uses an off-screen, not hidden, span — re-check) |
| `execCommand` returns `true` only when invoked from a user interaction; cannot be used for feature detection | https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand | "only returns `true` if it is invoked as part of a user interaction" | — | VERIFIED |
| `navigator.clipboard.writeText`: Firefox 63; requires a user gesture; `clipboardWrite` permission waives it | https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/Clipboard.json | "Web extensions with the `clipboardWrite` permission in their manifest can write data without a user gesture." | 63 | VERIFIED |
| Same rule stated for extensions: transient activation, or `clipboardWrite` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "with the `"clipboardWrite"` permission, transient activation isn't required" | — | VERIFIED |
| `clipboardWrite` works from all extension contexts and content scripts in Firefox and Chrome; Safari extension contexts only | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "enables writing to the clipboard from all extension contexts and content scripts" | BCD: clipboardWrite Firefox 51 | VERIFIED |
| Clipboard API write/read are secure-context only (fine for `moz-extension://`; not from content scripts on `http:`) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "only available in secure contexts" | — | VERIFIED |
| The web `clipboard-write` permission (navigator.permissions) is not supported in Firefox or Safari | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard | "The `clipboard-write` permission is not supported in Firefox or Safari." | — | VERIFIED |
| Firefox does not support the `Permissions-Policy` HTTP header at all, nor the `clipboard-write`/`clipboard-read` directives | https://raw.githubusercontent.com/mdn/browser-compat-data/main/http/headers/Permissions-Policy.json | Permissions-Policy firefox false; clipboard-write firefox false; clipboard-read firefox false (paraphrase) | — | VERIFIED |
| Firefox does support the iframe `allow` attribute (74) for some features, but `clipboard-write` is not among them | https://raw.githubusercontent.com/mdn/browser-compat-data/main/html/elements/iframe.json ; https://raw.githubusercontent.com/mdn/browser-compat-data/main/http/headers/Permissions-Policy.json | allow firefox "74" (paraphrase); clipboard-write false | 74 | VERIFIED |
| Whether `writeText` in a cross-origin `moz-extension://` iframe inside a web page is gated by the embedder (as Chrome gates it via permissions policy) | — | undocumented on MDN | — | UNVERIFIED — Firefox has no clipboard-write policy, so the Chrome failure mode cannot occur the same way; actual behaviour must be tested |
| Chrome's `console.error` on a blocked `writeText` attempt has no Firefox equivalent documented | — | undocumented | — | UNVERIFIED |

Design consequence: keep `execCommand('copy')` as the path that works in a click handler (documented to
work in Firefox extensions without permission). The Chrome-specific reason the `allow` attribute was
abandoned does not transfer: Firefox has no `clipboard-write` policy to grant or deny. Whether
`writeText` from the iframe works in Firefox is a one-line experiment, not something MDN answers.

## 9. The `chrome.*` namespace in Firefox

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| Firefox supports `chrome.*` for Chrome-compatible APIs, to assist porting; `browser.*` preferred | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension | "Firefox also supports the `chrome.*` namespace for APIs that are compatible with Chrome" | — | VERIFIED |
| Firefox supports callbacks on `chrome.*` APIs | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension | "Firefox also supports callbacks for the APIs that support the `chrome.*` namespace." | — | VERIFIED |
| Whether `chrome.*` in Firefox also returns promises when no callback is passed (as the repo relies on: `chrome.tabs.sendMessage(...).catch`, `chrome.tabs.captureVisibleTab(...).then`) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension ; https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | pages say "Firefox and Safari support promises on all asynchronous APIs" but attribute promises to `browser.*`; neither page states `chrome.*` returns promises in Firefox | — | UNVERIFIED — undocumented; the repo's three `.then/.catch` call sites must be tested or switched to `browser.*` / a `globalThis.browser ?? chrome` shim |
| Chrome exposes `browser.*` from Chrome 148 (152 with `devtools_page`); so `browser.*` is now cross-browser | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "Before Chrome 148, Chrome exposed APIs only under the `chrome` namespace rather than `browser`." | Chrome 148 / 152 | VERIFIED |
| Chrome promise coverage complete in 152 | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Differences_between_API_implementations | "with full coverage in Chrome 152" | Chrome 152 | VERIFIED |
| Polyfill for older Chrome: mozilla/webextension-polyfill; no-op in Chrome 152+ | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension | "In Chrome 152 or later, the polyfill is no-op." | — | VERIFIED |
| `runtime.onMessage`: async reply by returning a Promise (preferred) or `return true` + `sendResponse` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage | "Return a Promise from the listener function and resolve the promise when the response is ready. This is the preferred approach." (paraphrase-length) | BCD: promise return Firefox ≤62 | VERIFIED |
| Returning a Promise is not supported in Chrome (crbug 1185241); BCD: chrome `false` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage ; https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/runtime.json | "Promise as a return value is not supported in Chrome until Chrome bug 1185241 is resolved." | — | VERIFIED |
| Do not make the listener `async`: it then answers every message and blocks other listeners | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage | "Do not prepend `async` to the function." | — | VERIFIED (the repo's listeners are sync and return undefined — fine) |
| `sender.tab` is present only when the message came from a tab, including content scripts | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/MessageSender | "only present when the connection was opened from a tab (including content scripts)" | 45 | VERIFIED |
| `sender.frameId` only set when `tab` is set; zero for top frame | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/MessageSender | "Zero for top-level frames, positive for child frames. This is only set when `tab` is set." | — | VERIFIED |
| Whether a message from a `moz-extension://` iframe embedded in a web page carries `sender.tab` in Firefox (the relay depends on it) | https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/test/mochitest/test_ext_runtime_connect_iframe.html | the test covers a web-page iframe inside the background page ("Sender is not a tab") and a content script in a tab frame ("Sender is the tab"), not an extension iframe in a tab | — | UNVERIFIED — undocumented; must be tested, it is load-bearing for the relay and for the iframe's `sender.tab === undefined` filter |
| `sender.url` for an extension page is `moz-extension://<uuid>/path` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/MessageSender | "the URL is in the form `"moz-extension://<extension-internal-id>/path/to/page.html"`" | — | VERIFIED |
| `alert()`/`confirm()`/`prompt()` unsupported in Firefox background pages | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "`alert()`, `confirm()`, and `prompt()` are not supported in background pages." | — | VERIFIED (repo uses none) |

## 10. Distribution

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| Signing is mandatory for release and beta Firefox; Developer Edition, Nightly and ESR can disable the check | https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/ | "Add-ons need to be signed before they can be installed into release and beta versions of Firefox." | — | VERIFIED |
| Two channels: listed on AMO, or unlisted/self-distributed; both signed through AMO | https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/ | "This signing process takes place through addons.mozilla.org (AMO)" | — | VERIFIED |
| Every submission is automatically validated before signing; manual review possible at any time, including self-distributed | https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/ | "All add-ons, including self-distributed ones, are subject to be manually reviewed at any time after submission." | — | VERIFIED |
| Typical time: up to 24 hours to be signed and published, longer if selected for manual review | https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/ | "It can take up to 24 hours for your submission to be signed and published" | — | VERIFIED |
| Forum anecdotes: automatic review minutes, manual review about ten days, no fixed timeline | https://discourse.mozilla.org/t/my-extension-is-still-on-status-awaiting-review-how-much-time-is-needed-for-the-review/148931 (via search summary) | (paraphrase) "automatic reviews takes ~2 minutes; manual reviews ~10 days" | — | UNVERIFIED (secondary) |
| `web-ext sign --channel listed|unlisted` with `--api-key`/`--api-secret` (`WEB_EXT_API_KEY`/`WEB_EXT_API_SECRET`); `--amo-metadata` JSON required for a first listed version | https://extensionworkshop.com/documentation/develop/web-ext-command-reference/ | "Metadata is required for the first version of an extension listed on AMO." | — | VERIFIED |
| `web-ext lint` runs addons-linter; `--self-hosted` disables AMO-only messages; `-w` treats warnings as errors; checks APIs against `strict_min_version` and flags `ANDROID_INCOMPATIBLE_API` | https://extensionworkshop.com/documentation/develop/web-ext-command-reference/ ; https://raw.githubusercontent.com/mozilla/addons-linter/master/docs/rules.md | "Treat warnings as errors by exiting non-zero for warnings." | — | VERIFIED |
| Source code must be submitted when the package was produced by a minifier, a bundler (webpack, browserify named), a template engine or any pre-processing tool | https://extensionworkshop.com/documentation/publish/source-code-submission/ | "You must upload your extension's source code when its code was created using:" | — | VERIFIED (Vite not named; it is a bundler plus minifier, so it qualifies) |
| What to provide: source, a README with build instructions, OS and environment requirements, tool versions, the lockfile; the reviewer rebuilds and "There must be no differences." | https://extensionworkshop.com/documentation/publish/source-code-submission/ | "There must be no differences." | — | VERIFIED |
| Build tools must be open source and run locally (no web-based or commercial build tools) | https://extensionworkshop.com/documentation/publish/source-code-submission/ | "we cannot verify a build made with commercial tools" | — | VERIFIED |
| Submitted source is visible only to a small group of admin reviewers | https://extensionworkshop.com/documentation/publish/source-code-submission/ | "only accessible to a small group of admin reviewers" | — | VERIFIED |
| Policy: minified/transpiled/machine-generated code allowed with source; obfuscation forbidden everywhere | https://extensionworkshop.com/documentation/publish/add-on-policies/ | "Add-ons are not allowed to contain obfuscated code" | — | VERIFIED |
| Policies apply regardless of distribution channel | https://extensionworkshop.com/documentation/publish/add-on-policies/ | "All add-ons are subject to these policies, regardless of how they are distributed." | — | VERIFIED |
| Same add-on (ID) may have both listed and unlisted versions since January 2017; version numbers must be unique across channels | https://blog.mozilla.org/addons/2017/01/26/mixing-listed-and-unlisted-on-amo/ | "The only limitation is that version numbers need to be unique across both channels." | — | VERIFIED (Mozilla blog, 2017; current extensionworkshop pages read are silent) |
| Older (2015–16) forum answers said one ID could not be both — superseded by the 2017 post | https://discourse.mozilla.org/t/mixing-listed-and-unlisted-add-ons/13968 (via search summary) | (paraphrase) earlier: delete and resubmit to switch channels | — | SOURCES DISAGREE (dated; the 2017 primary post wins) |
| Unlisted update without `update_url` → Firefox checks AMO for a listed update | https://extensionworkshop.com/documentation/publish/self-distribution/ | "If it doesn't include an `update_url`, Firefox checks AMO for a listed update." | — | VERIFIED |
| Firefox for Android: open extension ecosystem on AMO since 14 December 2023; 450+ at launch | https://blog.mozilla.org/addons/?p=9133 | "More than 450 Firefox for Android extensions are now discoverable" | Firefox 120 cycle | VERIFIED |
| Android listing requires `browser_specific_settings.gecko_android` (at least `{}`) in the manifest | https://extensionworkshop.com/documentation/publish/version-compatibility/ | "at least, an empty `browser_specific_settings.gecko_android` object in your manifest" | — | VERIFIED |
| Set `gecko_android` only after verifying on Android; web-ext 7.12.0+; Mozilla recommends MV2 for Android-targeted extensions on that page | https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/ | (paraphrase) set `gecko_android` after explicitly verifying compatibility; page recommends Manifest V2 for Android | — | VERIFIED (the MV2 recommendation is on the page as read; it may be stale relative to MV3 GA — flag) |
| Install-from-web (`InstallTrigger`/link) doesn't work on Android; install-from-file does | https://extensionworkshop.com/documentation/publish/self-distribution/ | "This method doesn't work in Firefox for Android." | — | VERIFIED |
| Reviewers may reject an Android listing on "basic usability requirements" | https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/ | "reviewers may reject it or request changes if it doesn't meet basic usability requirements" | — | VERIFIED |

## 11. Unknown and Chrome-only manifest keys

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| Unexpected top-level manifest properties are labelled a Warning (not an error) since Firefox 71 | https://bugzilla.mozilla.org/rest/bug/1495908?include_fields=id,summary,status,resolution,target_milestone | "Label unexpected WebExtension manifest.json properties as a Warning", VERIFIED FIXED, mozilla71 | 71 | VERIFIED |
| Unknown sub-properties of `browser_specific_settings.gecko` are a warning from 128, an install error before | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/128 | "now load with a warning. Previously, these extensions errored on installation." | 128 | VERIFIED |
| `minimum_chrome_version` is in Firefox's schema as a plain optional string — accepted silently | https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/schemas/manifest.json | `minimum_chrome_version`: `{"type": "string", "optional": true}` (paraphrase) | current main | VERIFIED (the repo does not set it anyway) |
| MDN has no `minimum_chrome_version` BCD entry or page statement for Firefox | https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/minimum_chrome_version.json (404) ; https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json | 404; manifest.json page does not mention it | — | VERIFIED that MDN is silent |
| `use_dynamic_url` inside the MV3 WAR item: unknown property → `UnrecognizedProperty` in the schema (warning per bug 1495908), but a 2023 forum post shows a hard error in 111 | see §7 | see §7 | — | SOURCES DISAGREE — test on current Firefox |
| The manifest `key` property is unsupported in Firefox (random UUID instead) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "As Firefox uses random UUIDs for `web_accessible_resources`, this property is unsupported." | — | VERIFIED |
| MDN's manifest.json page states no general rule for unrecognised keys; only "`browser_specific_settings` is not supported in Google Chrome" | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json | "`"browser_specific_settings"` is not supported in Google Chrome." | — | VERIFIED (no MDN page says "warning vs error" — Bugzilla and release notes are the sources) |
| addons-linter: `MANIFEST_FIELD_UNSUPPORTED` is a warning | https://raw.githubusercontent.com/mozilla/addons-linter/master/docs/rules.md | "A manifest field is not supported (or not supported for the extension manifest_version)" | — | VERIFIED |
| Chrome's own treatment of Firefox keys: `browser_specific_settings` and `$schema` ignored without warning (current Chromium) | https://chromium.googlesource.com/chromium/src/+/main/extensions/common/manifest_constants.h?format=TEXT | see §2 | — | VERIFIED |

## 12. Pages listing Chrome incompatibilities

| Claim | Source URL | Quote or paraphrase | Version | Status |
| --- | --- | --- | --- | --- |
| "Chrome incompatibilities" — the main list (APIs, manifest keys, content-script environment, WAR UUIDs, data cloning, historical namespace) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | headings: JavaScript APIs; manifest.json keys; Native messaging; Data cloning algorithm; Historical differences (paraphrase) | — | VERIFIED |
| "Differences between API implementations" — namespace, promises, API coverage, manifest keys | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Differences_between_API_implementations | "Firefox is the most compliant with the emerging standard" | — | VERIFIED |
| "Build a cross-browser extension" — namespace/polyfill, background pages vs service workers, per-browser manifests | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension | "creating and editing a static version for each browser is usually the simplest approach" | — | VERIFIED |
| Extension Workshop MV3 migration guide — Firefox-specific MV3 differences (event pages, host permissions, WAR, action) | https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/ | see §1, §6, §7 | — | VERIFIED |
| Relevant incompatibility not covered above: `tabs.executeScript` relative URLs resolve against the page in Firefox, the extension in Chrome (MV2 API; moot) | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "Relative URLs passed are resolved relative to the current page URL." | — | VERIFIED |
| Content-script `fetch` of relative URLs: Firefox requires absolute URLs | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "When a content script makes an HTTP(S) request, you _must_ provide absolute URLs." | — | VERIFIED (repo's content script fetches nothing) |
| Firefox content scripts share one `element.onclick` slot with the page; use `addEventListener` | https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities | "the most recent content script to request `element.onclick = xxx` overwrites the page's" | — | VERIFIED (repo uses `addEventListener` throughout; `document.body.style.cursor` is a style, fine) |

---

## Sources fetched (every URL actually read)

Primary — MDN pages
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/captureVisibleTab
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/action/openPopup
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/MessageSender
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Differences_between_API_implementations
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
- https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/109
- https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/127
- https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/128
- https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/129 (no add-on section)
- https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand

Primary — MDN browser-compat-data (GitHub raw)
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/background.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/browser_specific_settings.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/content_scripts.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/web_accessible_resources.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/permissions.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/manifest/minimum_chrome_version.json (404)
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/tabs.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/action.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/runtime.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/http/headers/Permissions-Policy.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/http/headers/Permissions-Policy/clipboard-write.json (404; directive lives in the parent file)
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/html/elements/iframe.json
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/Clipboard.json

Primary — Extension Workshop, policies, linter
- https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/
- https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/
- https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/
- https://extensionworkshop.com/documentation/develop/web-ext-command-reference/
- https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/
- https://extensionworkshop.com/documentation/publish/source-code-submission/
- https://extensionworkshop.com/documentation/publish/add-on-policies/
- https://extensionworkshop.com/documentation/publish/self-distribution/
- https://extensionworkshop.com/documentation/publish/submitting-an-add-on/
- https://extensionworkshop.com/documentation/publish/version-compatibility/
- https://extensionworkshop.com/documentation/publish/add-ons-review-process/ (404)
- https://extensionworkshop.com/documentation/publish/what-does-review-look-like/ (404)
- https://raw.githubusercontent.com/mozilla/addons-linter/master/docs/rules.md

Primary — Bugzilla, Firefox source, Chromium source, Mozilla blog
- https://bugzilla.mozilla.org/show_bug.cgi?id=1573659
- https://bugzilla.mozilla.org/rest/bug/1573659?include_fields=...
- https://bugzilla.mozilla.org/rest/bug/1851083?include_fields=... and /rest/bug/1851083/comment
- https://bugzilla.mozilla.org/rest/bug/1495908?include_fields=...
- https://bugzilla.mozilla.org/rest/bug/1258347?include_fields=...
- https://bugzilla.mozilla.org/rest/bug?id=1839129,1889402,1893232&include_fields=...
- https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/schemas/manifest.json
- https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/test/mochitest/test_ext_runtime_connect_iframe.html
- https://raw.githubusercontent.com/mozilla-firefox/firefox/main/toolkit/components/extensions/test/mochitest/test_ext_subframes_privileges.html
- https://chromium.googlesource.com/chromium/src/+/main/extensions/common/manifest_constants.h?format=TEXT
- https://blog.mozilla.org/addons/2022/11/17/unified-extensions-button-and-how-to-handle-permissions-in-manifest-v3/
- https://blog.mozilla.org/addons/2017/01/26/mixing-listed-and-unlisted-on-amo/
- https://blog.mozilla.org/addons/?p=9133 (14 Dec 2023, Firefox for Android open ecosystem)
- https://blog.mozilla.org/addons/2023/12/14/firefox-for-android-open-ecosystem-extensions/ (404; the ?p=9133 link is the post)

Secondary (forums; dated in the tables)
- https://discourse.mozilla.org/t/web-accessible-resources-error-in-manifest-json/112508 (Mar 2023)
- https://discourse.mozilla.org/t/iframe-cant-find-chrome-tabs-query/102267 (Aug 2022, unanswered)
- https://discourse.mozilla.org/t/content-js-now-need-permissions-on-each-matching-url/137164 (Nov 2024)
- https://discourse.mozilla.org/t/request-permissions-at-install-time-manifest-v3/121543 (Jul 2023)
- https://support.mozilla.org/en-US/kb/extensions-button (failed to load; search-summary only)

Search-result summaries (not read in full; cited only as UNVERIFIED): Apple forum thread 696367; discourse 125882, 13968, 148931.

## Open points

1. **`chrome.*` + promises in Firefox is undocumented.** MDN says Firefox supports `chrome.*` with callbacks and `browser.*` with promises; nothing read says `chrome.tabs.sendMessage(...)` without a callback returns a Promise in Firefox. The repo relies on that in three places (`background.js`) plus whatever `src/` does. Either test it or switch to `browser.*`/a shim.
2. **`sender.tab` for a `moz-extension://` iframe embedded in a tab** — the relay's only addressing mechanism — is not documented and not covered by the Firefox test read. Must be tested first; if absent, the iframe would need another way to name its tab (e.g. a content-script-relayed handshake).
3. **`activeTab` + toolbar click → does a manifest `<all_urls>` content script run on a site whose host permission the user revoked?** Only forum claims. The documented pattern is `scripting.executeScript` under `activeTab` + `scripting`.
4. **`use_dynamic_url` in Firefox: warning or install error today?** A 2023 forum post shows a hard error in 111; the schema and bug 1495908 imply a warning. Remove the key for Firefox regardless; test whether one shared manifest is viable.
5. **Clipboard inside the iframe on Firefox**: `execCommand('copy')` is documented to work in a click handler; `writeText` behaviour in a cross-origin extension iframe is undocumented (Firefox has no `clipboard-write` policy to gate it).
6. **`web_accessible_resources.matches`/`resources` BCD says `false` for Firefox for Android** while `extension_ids` mirrors desktop — looks like a data quirk, but an Android port cannot assume the iframe loads until tested.
7. **`action.openPopup` from `onClicked` after an awaited `setPopup`** in Firefox <149 (user-gesture rule) — untested.
8. **Minimum Firefox version** implied by the documented facts: 121 (dual background keys), 126 (`captureVisibleTab` with `activeTab`), 127 (content-script hosts granted at install), 129 (no attention dot for activeTab-only MV3), 140 (data-collection key recognised without warning). A `strict_min_version` of 128 (ESR) or 140 are the two defensible choices; which is Alex's call.
9. **AMO review timeline** beyond "up to 24 hours" is anecdotal.
10. **Safari's handling of `browser_specific_settings`** (warning vs ignore) is undocumented in anything read.
11. The MV3 migration guide and web-ext reference pages were read to their 100,000-character limit; the last ~3k/~9k characters were not read.
12. The last ~42k characters of BCD `tabs.json` were read only via the offset fetch for `sendMessage`; other `tabs.*` sub-features were not reviewed.

## Claim counts

168 table rows: VERIFIED 151 · UNVERIFIED 13 · SOURCES DISAGREE 4 (counted mechanically from the Status column; a row with a split status such as "VERIFIED that it is undocumented; … UNVERIFIED" counts under its first label, so about ten of the 151 carry an UNVERIFIED tail that the Open points list picks up; the §11 `use_dynamic_url` row restates §7 and is counted twice).
