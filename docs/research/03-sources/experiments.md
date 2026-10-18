# Research 03 experiments — results

The output of research 03 §What must be run before any code: one row per experiment, each result with the
browser version it was read on. **Status (Session 34, 18 October 2026): no row has run.** Firefox 152.0.3,
Safari 27.0, macOS 27.0, Xcode 27.1.

## Harness status

The Firefox harness is in `ff-harness/` (its README says what each file does). It was written and its
builds were made, but Firefox could not be driven from this session:

- Launched from the session's shell (sandboxed), from the app's Terminal panel, or from Terminal.app via
  `open -a Terminal`, `firefox -marionette --remote-allow-system-access -no-remote -profile <dir>` never
  initialised the profile (the directory kept only `user.js` after 45 s), never listened on 2828, and
  either exited within seconds or hung. The log shows `sandbox_extension_issue_file_to_process failed for
  …/plugin-container.app: 1 (Operation not permitted)`; with `MOZ_DISABLE_*_SANDBOX=1` the child process
  is instead killed on signal 9. A headless launch (`-headless`) hung the same way, and so did a bare
  `-headless -profile <fresh dir> -screenshot` with no Marionette flags.
- `open -a Firefox --args …` started Firefox, but on the default profile with the arguments dropped (checked
  with `ps -o args=`).
- The session's sandbox cannot read `~/Library/Application Support/Firefox`, so the user's own profiles
  were not usable from the shell either.

Untested next steps, cheapest first: Alex launches `ff-harness/launch-ff.sh` (or the same command) from his
own terminal and the session drives it over 2828; `web-ext run` from a scratch install; a WebDriver BiDi
session via `--remote-debugging-port` with Puppeteer's Firefox support. Safari rows (S1 to S9) need the
Develop menu ("Add Temporary Extension…", Safari 18.4 and later); only S6, and S2's iPhone half, need the
packager's Xcode project (research 03 §Does Safari need its own repo). None was attempted, and S6's
local half (`xcrun safari-web-extension-packager --no-open --no-prompt`, then `xcodebuild`) is the one
row that needs no Safari UI.

## Results

| #   | Browser (version) | Result  | Read on | Notes |
| --- | ----------------- | ------- | ------- | ----- |
| F1  | Firefox           | not run |         |       |
| F2  | Firefox           | not run |         |       |
| F3  | Firefox           | not run |         |       |
| F4  | Firefox           | not run |         |       |
| F5  | Firefox           | not run |         |       |
| F6  | Firefox           | not run |         |       |
| F7  | Firefox           | not run |         |       |
| F8  | Firefox           | not run |         |       |
| F9  | Firefox           | not run |         |       |
| S1  | Safari            | not run |         |       |
| S2  | Safari            | not run |         |       |
| S3  | Safari            | not run |         |       |
| S4  | Safari            | not run |         |       |
| S5  | Safari            | not run |         |       |
| S6  | CI                | not run |         |       |
| S7  | Safari            | not run |         |       |
| S8  | Safari            | not run |         |       |
| S9  | Safari            | not run |         |       |
