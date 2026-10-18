# Firefox experiment harness (phase 0, research 03)

Scripts to run research 03's F1 to F9 against the built extension on this Mac, driving Firefox over its
built-in Marionette port (2828) from Node, with no new binaries. Written in Session 34 (18 October 2026);
**no experiment has run yet** — see `../experiments.md` §Harness status for what blocked the launch.

- `marionette.mjs` — a minimal Marionette client: `connect`, `newSession`, `chrome(script)` (runs in the
  browser-chrome context, needs Firefox's `--remote-allow-system-access`), `exec`, `navigate`,
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
- `launch-ff.sh`, `profile/user.js` — the Firefox launch and the scratch profile's prefs.

Run from a copy outside the repo (the scratchpad or `$TMPDIR`): `node make-builds.mjs <repo>/build .`,
`node server.mjs &`, `./launch-ff.sh`, then a runner that uses `marionette.mjs`.
