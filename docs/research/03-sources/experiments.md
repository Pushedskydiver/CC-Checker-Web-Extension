# Research 03 experiments — results

The output of research 03 §What must be run before any code: one row per experiment, each result with the
browser version it was read on. **Status (Session 35, 1 November 2026): F1 to F9 ran on Firefox 159.0; no
Safari row has run.** Safari 27.0, macOS 27.0, Xcode 27.1. Firefox was 152.0.3 when the harness was written
(Session 34) and 159.0 when it first ran; Alex updated it between the sessions.

## Harness status

The Firefox harness is in `ff-harness/` (its README says what each file does). Session 34 could not launch
Firefox from this app; Session 35 did, and the whole Firefox set ran in one session:

- **The launch needs the session shell's sandbox off.** `launch-ff.sh` run through the Bash tool with
  `dangerouslyDisableSandbox: true` had Marionette listening on 2828 within a second and the profile
  initialised (22 files). Every Session 34 attempt ran inside the sandbox, which is what the log's
  `sandbox_extension_issue_file_to_process failed` line meant: the parent could not issue sandbox extensions to
  `plugin-container.app`. Alex's own terminal was not needed.
- **Firefox 159 grants system access by environment variable, not flag.** The first chrome-context script
  failed with "System access is required. Start Firefox with the `MOZ_REMOTE_ALLOW_SYSTEM_ACCESS=1`
  environment variable"; `launch-ff.sh` now exports it and keeps the 152-era `--remote-allow-system-access`
  flag.
- **`Addon:Uninstall` destroys any tab showing the extension's own pages**, so `lib.mjs`'s `install` parks the
  current tab on `about:blank` first. The runner's first failure ("no such window") was that.
- **A real toolbar click from the chrome context works:**
  `ExtensionParent.apiManager.global.browserActionFor(policy.extension).triggerAction(window)` granted
  `activeTab` (F5's `captureVisibleTab` resolved on a site with no host permission) and opened the popup (F6).
- **Session 34's untested alternatives** (`web-ext run`, WebDriver BiDi via Puppeteer) were not needed and
  were not tried.

Safari rows (S1 to S5 and S7 to S9) need the Develop menu ("Add Temporary Extension…", Safari 18.4 and
later); only S6, and S2's iPhone half, need the packager's Xcode project (research 03 §Does Safari need its
own repo). None was attempted, and S6's local half (`xcrun safari-web-extension-packager --no-open
--no-prompt`, then `xcodebuild`) is the one row that needs no Safari UI.

## Results

| #   | Browser (version) | Result  | Read on | Notes |
| --- | ----------------- | ------- | ------- | ----- |
| F1  | Firefox 159.0 | Promises | 1 Nov 2026 | `tabs.sendMessage`, `action.setPopup` and `action.getPopup` with no callback each return a `Promise`; `action.openPopup` is a function; `browser === chrome`. The background ran as a document (`background.scripts` won over `service_worker`: no `ServiceWorkerGlobalScope`, `document` present). No shim needed. |
| F2  | Firefox 159.0 | `sender.tab` set | 1 Nov 2026 | A `runtime.sendMessage` from `probe.html` inside an iframe in a web tab arrived with `sender.tab` (`tabId` 3, `frameId` 21474836481, `url` and `origin` the `moz-extension://` page); the same from a top-level extension tab had `frameId` 0. The relay works unchanged; no tab-id handshake (decision (j)). |
| F3  | Firefox 159.0 | warning | 1 Nov 2026 | `use_dynamic_url` in `web_accessible_resources` is a manifest warning ("An unexpected property was found in the WebExtension manifest"), and `Addon:Install` (temporary) succeeds; the build without it loads with no warnings. The manifests also omit `data_collection_permissions`, and the temporary install raised no warning for it. |
| F4  | Firefox 159.0 | top-level yes; iframe not established | 1 Nov 2026 | On the top-level extension page a Marionette `ElementClick` on the Copy button gave `execCommand('copy')` `true`, `navigator.clipboard.writeText` resolved, `isSecureContext` true, and the system clipboard held the written value. Inside `probe.html` embedded in the web tab the same click fired nothing (`#out` stayed empty twice, 2.5 s, no click error), so the iframe case is not established by this harness, not failed. |
| F5  | Firefox 159.0 | content script needs the host grant; `activeTab` still works | 1 Nov 2026 | A temporary install starts with `<all_urls>` granted (`permissions.getAll().origins`). With it, the click's ping resolved in 3 ms and the checker opened (iframe, 475 px padding). After `permissions.remove({ origins: ['<all_urls>'] })`, a fresh document got no content script: the ping rejected ("Could not establish connection. Receiving end does not exist."), the checker did not open, and `captureVisibleTab` still resolved under the click's `activeTab`. A revoked site rejects `initChecker`, which is shape 3's trigger. A signed install's default (host permissions ungranted) was not tested; the temporary route grants them. |
| F6  | Firefox 159.0 | popup shows | 1 Nov 2026 | A click on `about:blank` (`tab.url` populated, restricted) opened `customizationui-widget-panel` showing `error.html` after the awaited `setPopup`, so the gesture survived the await on 159. "Below 149" cannot be read on this Mac. One console error followed the click, `uncaught exception: Object { message }`, source not attributed. |
| F7  | Firefox 159.0 | device pixels; colours exact | 1 Nov 2026 | The capture was 2560 × 1682 for `innerWidth` 1280, `innerHeight` 841, `devicePixelRatio` 2; the red block sampled `[255, 0, 0]` at (50, 50) and the blue page `[0, 0, 255]` at (300, 300), both scaled by the ratio. The loupe maths holds. |
| F8  | Firefox 159.0 | shape 3 works; a second injection throws | 1 Nov 2026 | With no `content_scripts` and `activeTab` + `scripting`: first ping rejected in 1 ms, `executeScript` resolved in 9 ms, second ping resolved in 6 ms, checker open. A second click found the script (first ping resolved, 1 ms, no inject). An explicit `executeScript` on the same document returns `error: "redeclaration of let scrollStopDelay"` and adds no iframe; after `closeChecker` the iframe is gone, a further injection errors the same way, and the next click reopens the checker. The ping-first flow never injects twice; an idempotent wrap is only needed if something else does. |
| F9  | Firefox 159.0 | survives quit and relaunch | 1 Nov 2026 | `background`, `foreground` and `colors` written on the extension origin read back after `Marionette:Quit`, a relaunch and a reinstall: `extensions.webextensions.uuids` kept the id's UUID across the restart (temporary add-ons are removed at shutdown, the pref is not). An uninstall-then-reinstall within a session changed the UUID (`bf80a141…` → `13764d37…`), so the origin is stable per install, not per profile. |
| S1  | Safari            | not run |         |       |
| S2  | Safari            | not run |         |       |
| S3  | Safari            | not run |         |       |
| S4  | Safari            | not run |         |       |
| S5  | Safari            | not run |         |       |
| S6  | CI                | not run |         |       |
| S7  | Safari            | not run |         |       |
| S8  | Safari            | not run |         |       |
| S9  | Safari            | not run |         |       |
