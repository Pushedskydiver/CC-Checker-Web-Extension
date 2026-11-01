# Firefox experiment harness (phase 0, research 03)

Scripts to run research 03's F1 to F9 against the built extension on this Mac, driving Firefox over its
built-in Marionette port (2828) from Node, with no new binaries. Written in Session 34 (18 October 2026);
first run in Session 35 (1 November 2026, Firefox 159.0) — results in `../experiments.md`.

- `marionette.mjs` — a minimal Marionette client: `connect`, `newSession`, `chrome(script)` (runs in the
  browser-chrome context, needs `MOZ_REMOTE_ALLOW_SYSTEM_ACCESS=1` in Firefox's environment on 159; the `--remote-allow-system-access` flag the script also passes was written for 152 and never seen to work there), `exec`, `navigate`,
  `install(path)` (`Addon:Install`, temporary), `quit`.
- `make-builds.mjs <build/> <outRoot>` — copies `build/` three times with a patched manifest: `ext-manifest`
  (status quo plus `gecko.id`, dual `background`, `storage`), `ext-inject` (no `content_scripts`,
  `activeTab` + `scripting`, the shape-3 click handler from `inject-bg.js`), `ext-manifest-nodyn` (as the
  first, `use_dynamic_url` removed, for F3). Each gets `probe-bg.js` appended to `background.js` and a
  `probe.html` page (`probe-page.js`) listed in `web_accessible_resources`.
- `probe-bg.js` — records F1's promise checks at load, every toolbar click (`tab.url`, a ping's settle state
  and latency, `captureVisibleTab` under the grant) and `probe-*` messages (sender shape for F2, revoke for
  F5, explicit injections for F8), all into `storage.local`.
- `probe-page.js` — `probe.html?do=sender|results|ls-set|ls-get|decode` (F2, readback, F9, F7's pixel check)
  and a Copy button for F4 (`execCommand('copy')` and `navigator.clipboard.writeText`).
- `server.mjs` — serves the probe web page (a red 200px block on blue) at `http://127.0.0.1:8765/`.
- `launch-ff.sh`, `profile/user.js` — the Firefox launch and the scratch profile's prefs. Run it with the
  session shell's sandbox off (the Bash tool's `dangerouslyDisableSandbox: true`); inside the sandbox Firefox
  never initialises the profile. Firefox 159 wants `MOZ_REMOTE_ALLOW_SYSTEM_ACCESS=1` (exported there).
- `lib.mjs` — the runner's helpers: `install` (parks the tab on `about:blank` first: an uninstall destroys tabs
  showing the extension's pages), `probe(query)` (navigates to `probe.html?…` and returns `#out`),
  `clickToolbar` (`browserActionFor(policy.extension).triggerAction(window)` from the chrome context, which
  grants `activeTab` as a real click does), `newTab`/`switchTo`.
- `smoke.mjs`, `f1.mjs`, `run.mjs`, `f9.mjs` — the plumbing check; F1 and the manifest warnings; F2 to F8 plus F9's write, ending in `Marionette:Quit`;
  F9's read-back after a relaunch, plus the F4, F6 and F8 retests. `node server.mjs &` first.

Run from a copy outside the repo (the scratchpad or `$TMPDIR`): `node make-builds.mjs <repo>/build .`,
`node server.mjs &`, `./launch-ff.sh`, then a runner that uses `marionette.mjs`.
