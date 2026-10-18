# copilot-surrogate — Session 34 PR (#132), `docs/CC-007-session-34` at `985670c` against `main` `22bed93`

Worktree: `/Users/alexclapperton/Desktop/alex/colour-contrast-checker/cc-surrogate` (detached, HEAD `985670c`). No edits made. No PR comments posted.
Scope: 16 files / 270,447 bytes post-filter (ceiling 20 / 400 KB) — walked. Read in full at HEAD: `PROGRESS.md`, `docs/GIT.md`,
`docs/GLOSSARY.md`, `docs/history/SESSIONS.md`, `docs/research/03-safari-firefox-ports.md`, `docs/research/03-sources/experiments.md`,
`docs/research/03-sources/ff-harness/README.md`, the eight harness scripts, `eslint.config.mjs`.

SUMMARY: ~96 claims checked / 4 falsified / 0 BLOCKING, 2 MATERIAL, 2 LOW, 3 nits / ~19 UNCHECKED (listed below).

## Reproduced (ground truth)

- Band: `awk '/^## Session [0-9]/{p=1} /^## Next session loading instructions/{p=0} p' | wc -c` on `git show <sha>:PROGRESS.md` —
  `22bed93` 29,155 B / 5 entries; `e1c8f5a` (and `b816d37`, `26c15d2`) 23,927 B / 4; HEAD 29,750 B / 5 (over 24,000). All three stated figures match.
- SHAs/dates/authors (`git log --no-walk --format='%h %ad %an %p'`): `0a8e473` and `22bed93` are 2-parent merges by Alex at 20:54:43/20:54:54Z 17 Oct
  (`gh pr view 128/129` mergedAt 20:54:44Z / 20:54:54Z); `15fd545` (#130, 16:55:32Z) and `dfe9f09` (#131, 16:55:59Z) 18 Oct, mergedBy Pushedskydiver;
  `e1c8f5a` parent `22bed93` (first commit on the branch); `b816d37` touches exactly PROGRESS.md, GIT.md, GLOSSARY.md, research 03 ("four files");
  `26c15d2` adds the 10 harness/experiments files + `eslint.config.mjs`.
- #130: 8 dev-dependency bumps (`gh pr view 130 --json body`, package.json diff 22bed93..15fd545 shows 8). #131: react + react-dom 19.3.0 → 19.3.1.
- Row 29 of SESSIONS.md vs `git show 22bed93:PROGRESS.md` Session 29: 0/53, 2 nits declined, 123k→159k, 159k/167k/201k, `3855b83`/`52b44ea`, 25 of 34 at `ddaab4e`,
  "nothing in src/, public/ or test/ since #72" (`git log 61b5d43..ddaab4e -- src public test` prints nothing) — all reproduce. Date 7 October 2026 correct.
- The repointed cite "Session 29 pattern 1, in `git show 22bed93:PROGRESS.md`" sits in Session 30's entry (PROGRESS.md:741), as the Session 34 entry says; it is the only
  content cite of Session 29 outside dated "Updated" paragraphs.
- `CC-007`: absent at `22bed93` (`git grep CC-007 22bed93` empty); at HEAD in PROGRESS, GIT.md:13/20-21, GLOSSARY:112, research 03:5-6 and :342-344. No surviving
  "CC-001 to CC-005/006" range anywhere (`git grep -nE 'CC-00[1-9]. (to|through) .CC-00[1-9]'`). Research 03 line 6's "rode in #128, #129 under CC-006" matches
  the `0a8e473`/`22bed93` subjects.
- Counts: `grep -cE '^\s*test\(' test/e2e/extension.spec.ts` = 22; Vitest 25 (`color-utils`: 19 `it` + 6 `it.each` rows) + 11 (7 + 4) + 24 (6 + 4+5+5+4) = 60.
- Versions on this Mac: Firefox 152.0.3 (`/Applications/Firefox.app/Contents/MacOS/firefox --version`), macOS 27.0 (`sw_vers`), Xcode 27.1 (`xcodebuild -version`),
  Safari 27.0 (`Info.plist`). `xcrun safari-web-extension-packager --help` lists `--no-open` and `--no-prompt`.
- `ls ~/Library/Application\ Support/Firefox` → "Operation not permitted" from this sandbox too (experiments.md's third bullet reproduces).
- Harness README vs scripts: `marionette.mjs` exports `connect`, `newSession`, `chrome`, `exec`, `navigate`, `install` (`Addon:Install`, `temporary: true`), `quit`;
  `make-builds.mjs` makes `ext-manifest` / `ext-inject` / `ext-manifest-nodyn` with `gecko.id`, dual `background`, `storage`, `scripting` + `delete content_scripts`,
  `delete use_dynamic_url`, pushes `probe.html` into WAR, appends `probe-bg.js`; its splice markers (`// Called when the user clicks on the browser action`,
  `chrome.runtime.onMessage.addListener`) and the globals `inject-bg.js` uses (`isRestrictedUrl`, `showErrorPopup`) exist in `public/app/background.js` (lines 50, 70, 19, 29);
  `{ message: 'clicked_browser_action', type: 'initChecker' }` matches background.js:59-60; `probe-page.js` handles `sender|results|ls-set|ls-get|decode` and a copy
  button with `execCommand('copy')` + `writeText`; `server.mjs` serves a 200px red block on blue at 127.0.0.1:8765; `launch-ff.sh` resolves its own directory
  (`S="$(cd "$(dirname "$0")" && pwd)"`). `strict_min_version: '140.0'` matches research 03 (b).
- `eslint.config.mjs:16` ignores `docs/research/**/*.{js,mjs}`; `.prettierignore:9` already had `docs/research/03-sources/`.
- experiments.md table: 18 rows F1–F9, S1–S9, all "not run"; S6 = CI matches research 03's row.
- Remote heads now: `main`, `feat/CC-003-apca-3`, `chore/CC-004-copy-to-clipboard-4`, `docs/CC-007-session-34` (loading step 3's list is right; Dependabot
  branches deleted on merge). `gh pr list`: only #132 open, base `main`, head `docs/CC-007-session-34`, created 16:58:45Z 18 Oct, not draft.
- Weekly reset "15:00Z on 23 October" is consistent with Sessions 31–33's cadence (16 → 23 Oct).
- Kept GIT.md live-repo claims re-read via `gh api`: `delete_branch_on_merge` true; merge/squash title `PR_TITLE`, message `PR_BODY`; all three buttons on;
  protection: 0 approving reviews, dismiss-stale on, `enforce_admins` off, `strict` off, context `Lint, build, e2e`, force-push/deletion blocked; 11 labels
  (8 default + dependencies, github_actions, javascript); `git tag` → `v2.1.0` → `c5da9fc`; `package.json` and manifest both 2.1.0; `dependabot.yml` ignore block present.
- Kept GLOSSARY.md constants: `IFRAME_HEIGHT = 475`, `LOUPE_SIZE = 8`, 66 ms ×2, 500 ms unbind, `MAX_SAVED_COLORS = 5`, defaults `#ffe66d`/`#222222` in both
  `context.tsx` and `globals.css`, `sendToTab`, `RESTRICTED_URL_PATTERNS`, `@value --bp-medium: 768px`, `lab.l < 60`, `contrast < 3`, cited paths exist.
- Strikethrough pass: no struck text without a replacement; research 03's (g) strike carries its replacement and date. See nit 1 on the surface question.
- Instruction-file budget: `AGENTS.md`/`CLAUDE.md` not in the diff; not run.

## Findings

FINDING 1 — PROGRESS.md:404 and :771-772
Claim: "this session's PR is open (its number is in the loading block)" / "its number is in the Session 34 entry's first paragraph once recorded"
Falsifier: `git grep -n '#132' HEAD -- PROGRESS.md` prints nothing; `gh pr list` → #132 OPEN, created 2026-10-18T16:58:45Z.
Ground truth: each pointer sends the reader to the other and neither holds the number; the PR is #132. Loading step 1 is read cold.
Severity: MATERIAL. Class: internal-contradiction.

FINDING 2 — docs/research/03-sources/experiments.md:27-28
Claim: "Safari rows (S1 to S9) need the Develop menu, "Allow unsigned extensions" and the packager's Xcode project"
Falsifier: research 03:57-61 ("An Xcode project … Not needed for the experiments in §What must be run: since Safari 18.4 a built folder installs temporarily
from the Develop menu"); PROGRESS.md:801-803 (S1–S5, S7–S9 need the Develop menu and "Allow Unsigned Extensions"; only S6 names the packager).
Ground truth: only S6 (and S2's iPhone half) need the packager's project; the sentence over-claims and contradicts the file it reports on.
Severity: MATERIAL. Class: internal-contradiction / duplicate-fact-drift.

FINDING 3 — docs/GIT.md:19-20
Claim: "`CC-006` the workflow-optimisation research … and the session handoffs and archives since"
Falsifier: PROGRESS.md:419-420 "from this PR on its changes, and the session PRs, go under `CC-007`"; this PR's own subjects (`985670c`, `26c15d2`, `b816d37`) are `CC-007`.
Ground truth: session handoffs/archives are under `CC-006` only up to Session 33 (last: `e1c8f5a`); the unbounded "since" now reads as current and is not.
Severity: LOW. Class: internal-contradiction (reader-precision).

FINDING 4 — PROGRESS.md:418
Claim: "`docs/GIT.md` §Ticket keys"
Falsifier: `grep -n '^#' docs/GIT.md` has no such heading; "Ticket keys" is a bold bullet at GIT.md:13 under "What changed on the way over". Only this line uses the form (`git grep 'Ticket keys'`).
Ground truth: the `§` citation form elsewhere names real headings (§Who merges, §Merge strategy, §Releases).
Severity: LOW. Class: link-integrity.

Nits (not findings):
1. Research 03:342-344 uses `~~` in a `docs/` file. It is `docs/research/*`, self-described as "a record, not instructions", research 02 already carries three
   strikes, and loading step 5 prescribes exactly this form; decision (u) in step 7 is the open branch. Convention question for Alex, not drift.
2. docs/GLOSSARY.md:132 (kept) still names `safari-web-extension-converter`; research 03:44 records the rename to `safari-web-extension-packager`.
3. The harness's `ext-manifest` omits `browser_specific_settings.gecko.data_collection_permissions`, item 3 of research 03's "four changes". The README does not claim it;
   whether a temporary install on 152 warns or errors without it is UNCHECKED.
Out of repo: memory `project-safari-firefox-research.md` dates Alex's `CC-007` to 17 October; the repo records 18 October (Session 34's opening message). Memory is not in scope; flagging the date mismatch only.

## UNCHECKED (unverifiable from here; not treated as false)
Launch-attempt observations (log lines, exit/hang, `ps -o args=`, headless, Terminal.app route, profile file count, signal 9); the readings table and 88k→196k→210k;
5-hour reset 21:20Z; `get_session self`; "pushed at once"; "#131 still CLEAN after #130", `mergeStateStatus` `UNKNOWN` for a few seconds, "no classifier refusal";
`--remote-allow-system-access` semantics; `ExtensionParent.apiManager.global.browserActionFor(...).triggerAction`, `windowUtils.sendMouseEvent`,
`CustomizableUI.addWidgetToArea`, `Services.appinfo.version`; Puppeteer BiDi via `--remote-debugging-port`; `web-ext run`; the Develop-menu item wording
("Allow Unsigned Extensions"); research 03's "158.0 current on the calendar" (kept); nit 3's install-time behaviour.
