# Rationalisations and their reality

The things you tell yourself right before you skip something. Each entry names the thought, says
why it is seductive rather than merely wrong, records what actually happened **here** when someone
believed it, and gives the check that defeats it.

**Read this at the moment you are about to dismiss a finding.** `docs/REVIEW-PATTERNS.md` is the
file you read _while_ reviewing; this is the file for when you have found something and are about
to decide it does not matter.

**Adapted from the `docs/RATIONALIZATIONS.md` in Alex's other repos** (chief-clancy, moe,
nas-stacks) for the form only. Their evidence stays theirs. Every entry below is evidence from this
repo, almost all of it from 4 September 2026, the day the `feat/vite-migration` branch was audited,
reproduced against and fixed before its first push. An entry with no dated incident does not belong.

---

## Quick reference

| If you catch yourself thinking…          | …stop, because                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| "It builds on my machine."               | macOS hid five wrongly-cased index entries. Linux threw 21 TS2307s.       |
| "It's the same config, just typed."      | `b - a` was a silent no-op; `b.localeCompare(a)` broke the desktop grid.  |
| "The type-checker would have caught it." | CSS-module keys are `string`. `styles.badgeContent` typed fine two years. |
| "The tests pass."                        | There were none until 4 September 2026. Green with zero tests is grey.    |
| "It works when I click it."              | Playwright cannot click the toolbar, so e2e runs on a patched manifest.   |
| "More reviewers means more rigour."      | 139 agents, two exhausted sessions, nothing five finders had not found.   |
| "It's only a LOW."                       | The copy confirmation was `aria-hidden`. In an accessibility tool.        |
| "I'll fix the a11y later."               | Later was 4 September 2026, and it was five findings, not one.            |
| "It's configured."                       | `dependabot.yml` sat in `ISSUE_TEMPLATE/` from December 2022, unread.     |
| "It's merged, so it's shipped."          | Nothing reaches the Web Store until Alex uploads a zip by hand.           |

---

## The headline

### "I ran the discipline, so the discipline ran."

**Why it's seductive.** Every entry below is a special case of this one. Having _performed_ a build,
_run_ a linter or _clicked_ the extension feels like having checked it, and the feeling arrives
before any evidence does. From the inside it is indistinguishable from the real thing.

**What happened here.** The `feat/vite-migration` branch (March–September 2026) built, linted and
worked when clicked, across six commits. On 4 September 2026 a fresh Linux clone could not compile
it, the three-column layout had never once rendered, greys saturated to the wrong hex, every
embedded iframe got its own checker and every eyedropper pick was handled twice. No discipline that
had "run" could have seen any of it: there were no tests, CI did not exist, and the build ran on
the one platform where the index bug is invisible.

**The check.** Ask what would have to be true for the discipline to have worked, then verify that.
Not "did it build" but "did it build somewhere the bug could show"; not "did I click it" but "does
`npm run test:e2e` redden if I revert the fix". Where the answer is a command, run it:

```bash
npm run lint && npm run build && npm run test:e2e
```

---

## Build

### "It builds on my machine."

**Why it's seductive.** It does, and the machine is the only evidence you have. The `~/` alias
resolves, the editor autocompletes the import, `vite build` writes a bundle.

**What happened here.** On 4 September 2026 the Git index tracked `01-Atoms/`, `02-Molecules/`,
`Icon/`, `Ratio/` and `Header/` while the disk and every import used lowercase. macOS's
case-insensitive filesystem plus `core.ignorecase=true` hid it from `git status`, `tsc` and Vite
alike. A fresh clone on Linux, reproduced on a case-sensitive APFS image, failed with
`UNRESOLVED_IMPORT` and 21 TS2307 errors: the branch would have failed its first CI run on its first
push, after months of green local builds. Fixed by `git rm -r --cached src/components && git add
src/components` and `core.ignorecase=false`; see `docs/DA-REVIEW.md` §Case-sensitivity audit.

**What to do instead.** A green build on a Mac is not evidence for a case-sensitive checkout. Before
any push that touches paths, this must print nothing:

```bash
git ls-files src | grep -E '/[A-Z]'
```

CI on Linux (`.github/workflows/ci.yml`) is the real gate — required on `main` since 11 September
2026, after a first green run (PR #28) had made it evidence of something.

### "It's the same config, just typed."

**Why it's seductive.** Inlining `postcss.config.js` into `vite.config.ts` (`583d112`) is mechanical.
The old comparator would not type-check on strings, the obvious string equivalent did, the build
went green. Nothing about the behaviour was meant to change.

**What happened here.** The old comparator, `sort: function (a, b) { return b - a; }`, ran on media
query _strings_: `NaN` every time, so `postcss-sort-media-queries` sorted nothing and source order
stood. The typed rewrite, `sort: (a, b) => b.localeCompare(a)`, actually sorted — in reverse,
putting `@media (width>=992px)` before `(width>=768px)`, so the 768px rule always won and the
three-column desktop layout never applied. A no-op became a bug by being made correct. Fixed on
4 September 2026 by taking the plugin's default `mobile-first` sort; the comment above
`postcssSortMediaQueries()` in `vite.config.ts` says why.

**What to do instead.** When a type-satisfying edit touches anything that orders, filters or
compares, look at the output, not the types. Within each module `768px` must precede `992px`:

```bash
grep -o '@media[^{]*' build/assets/*.css
```

`docs/DA-REVIEW.md` §Cascade and order audit exists because of this entry.

### "The type-checker would have caught it."

**Why it's seductive.** `tsconfig.json` is strict, with `noUncheckedIndexedAccess`, and `lint:ts`
runs on both tsconfigs. A reference to a class that does not exist ought to be a compile error.

**What happened here.** `vite/client` types every `*.module.css` import as
`{ readonly [key: string]: string }` (`node_modules/vite/client.d.ts`, line 7), so `styles.main` and
`styles.badgeContent`, naming classes in no stylesheet, typed as `string` and rendered as
`className="undefined"`. `styles.badgeContent` had been there since `26bf65c` (29 June 2024); both
were found on 4 September 2026 by reading the CSS, not by a tool. The same `tsc` resolved
`~/components/01-atoms/…` against a directory Git called `01-Atoms/`, because macOS said they were
the same thing.

**What to do instead.** Know what the checker proves: the _shape_ of a CSS-module import, not its
keys, and path resolution on _this_ filesystem. For a class, grep the module; for a path, `ls` it
(`docs/DA-REVIEW.md` §CSS Modules).

---

## Test

### "The tests pass."

**Why it's seductive.** `npm test` exits 0, and every repo you have worked in treats that as the
baseline signal. It is a real signal — about the tests that exist.

**What happened here.** Until 4 September 2026 there were no tests at all. "The tests pass" was true
the way "no alarm fired" is true in a building with no alarm: the comparator bug, the NaN hue, the
range-input `min`, the `all_frames` injection, the live picker listeners after `closeChecker` and
the double-handled `colorPicked` all sat under that green. The suite written in response — 18 Playwright tests in
`test/e2e/extension.spec.ts` that day, all passing in about seven seconds — came
_after_ the bugs had been found by hand, and is evidence only about the behaviours it encodes.

**What to do instead.** Say what the suite covers, not that it passes; `docs/TESTING.md` §What is
not tested, stated rather than implied lists the gaps (the toolbar click and `activeTab` grant, the
error popup, incognito, a real (not stubbed) refusal of the copy command, the store package, Safari). For a new fix:
revert it,
run `npm run test:e2e`, watch the test go red, restore. Still green means the test does not test it.

### "It works when I click it."

**Why it's seductive.** It is an extension. Load unpacked, click the icon, pick a colour, watch the
ratio change. What could be more direct than using the thing?

**What happened here.** Clicking proved less than it seemed, twice on 4 September 2026. Every
eyedropper pick was handled _twice_ — the content script's direct broadcast and the service-worker
relay — and from the UI it looked like one pick. With `all_frames: true` a full checker was injected
into every embedded iframe, which a click on a page without a visible child frame cannot show; it
took the `CHILD_PAGE` fixture in `test/e2e/fixtures.ts` to make it visible. The limit runs the other
way too: the only permission is `activeTab`, so `chrome.tabs.captureVisibleTab` works only after a
real toolbar click, which Playwright cannot perform. The picker tests run on a copy of `build/`
whose manifest adds `host_permissions: ["<all_urls>"]` (the `patched` fixture). They prove the
picker logic and cannot prove the grant; a hand click proves the grant and does not persist.

**What to do instead.** Name which context you exercised — content script, service worker or
extension page (`docs/ARCHITECTURE.md`) — and which message crossed which boundary. For anything on
the relay or in the manifest, write the e2e test first and keep the click for what e2e cannot
reach: the toolbar grant, the error popup, incognito.

---

## Review

### "More reviewers means more rigour."

**Why it's seductive.** Every finding deserves a verifier, verifiers should be independent, so two
per finding is the honest number. Multiplied out it is a big number, and big feels thorough.

**What happened here.** On 4 September 2026 an audit workflow dispatched 139 agents — two verifiers
for each of roughly sixty findings — against a repo of about 3,700 lines. It exhausted the session
budget twice. Five finders plus hands-on reproduction (a case-sensitive disk image, a page with a
child iframe, a grey saturated by hand) had already turned up everything that mattered; the fan-out
found nothing further that did, and consumed the sessions that would have fixed it.

**What to do instead.** `docs/DEVELOPMENT.md` §Scale the fan-out to the repo: discovery rounds until
findings converge to nits, then exactly one verification round with a distinct confirm-or-disprove
prompt; cap the default at two rounds and finish with a manual pass. An honest "nit-floor reached"
is the signal Alex wants. Sixty agents saying "confirmed" is not more evidence than five.

### "It's only a LOW."

**Why it's seductive.** Severity labels exist so that not everything is a fire. A missing ARIA
attribute on a tooltip is one line, and there are HIGHs in the same review.

**What happened here.** The copy and share confirmation — "Copied", "URL added to clipboard" —
carried `aria-hidden="true"` on the branch (`copy-cta.tsx` at `HEAD`, under the old `01-Atoms/`
path). It was a regression: before the `26bf65c` refactor (29 June 2024) the copy and share
tooltips were `aria-live="polite"`. A screen-reader user of a _colour-contrast checker_, a tool
that exists for accessibility, would press copy and hear nothing. By line count it was a LOW; by
the product's reason for existing it was the worst finding of the day. Fixed on 4 September 2026
with a `role="status"` live region that receives the text on copy, the button's own label staying
stable so it is not re-announced.

**What to do instead.** Severity is about who it hits and what the product promises, not the diff
size. `docs/DA-REVIEW.md` §Severity labels puts "an accessibility regression on a shipped control"
at BLOCKING for exactly this reason. When you feel the "only" arriving, ask who the user is for whom
it is not only.

### "I'll fix the a11y later."

**Why it's seductive.** The migration was about the toolchain. Accessibility polish is different
work with no ticket, and mixing it into a Vite branch muddies the diff. All reasonable, and exactly
how a11y debt is made.

**What happened here.** Later arrived on 4 September 2026 as five findings, not one, each found by
reading the DOM: the `aria-hidden` confirmation above; saved swatches rendered as `<button>`s
directly inside a `<ul>` with no `<li>`; tabs with no `aria-controls`, no wrap-around and every
key other than the arrows and Tab swallowed by `preventDefault`; and skip-link targets `#ratio` and
`#grades` with no `tabIndex={-1}`, so neither could take focus programmatically.
`eslint-plugin-jsx-a11y` runs in `npm run lint` and flagged none of them: its rules check
attributes on one element, and each of these was a relationship between elements. Deferral had
not made the work smaller, only invisible.

**What to do instead.** Here accessibility is the feature, so it ships in the same slice as the
component; `docs/DA-REVIEW.md` §React components and context walks the relationships the linter
cannot. If a deferral is genuinely necessary, write it as `NOTICED BUT NOT TOUCHING` in the PR
(`docs/SELF-REVIEW.md`) with a re-entry condition, not as a private intention.

---

## Ship

### "It's configured."

**Why it's seductive.** The file exists, it is committed, it has the right keys. Configuration is
declarative and the platform reads declarations. Nothing is left to do.

**What happened here.** `dependabot.yml` was added on 14 December 2022 (`4266825`) at
`.github/ISSUE_TEMPLATE/dependabot.yml`, a path GitHub never reads, and sat there until it was moved
to `.github/dependabot.yml` on 4 September 2026. The illusion had support: Dependabot _did_ open
PRs (#18–#25, security bumps from 2024), but those come from the repository's security-alert
setting, which does not use the file, so the visible activity was evidence for a different
mechanism. The same shape was live until 11 September 2026: `.github/workflows/ci.yml` was
configured but had never run and was not a required check on `main`; it became one the day of its
first green run (PR #28), which is exactly the artefact this entry asks for
(`docs/DEVELOPMENT.md` §CI, and what it can and cannot do).

**What to do instead.** Configured is not running. Find the artefact that proves the platform read
the file — a Dependabot PR whose title matches your groups, a run on the Actions tab, a status check
on a PR — and cite it with its date. Until then say "configured, never observed running", which is a
different claim.

### "It's merged, so it's shipped."

**Why it's seductive.** In most repos the pipeline finishes the job: merge to `main`, deploy runs,
users get it. Nothing in a GitHub PR view says the model does not apply here.

**What happened here.** Nothing reaches users automatically. Shipping is `npm run package`, which
zips `build/` to `cc-checker-<version>.zip`, then Alex uploading that zip by hand in the Chrome Web
Store developer dashboard — `docs/DEVELOPMENT.md` §Merged is not published. The version lives in
_both_ `package.json` and `public/manifest.json`, unlinked: on 4 September 2026 they read 1.6.1 and
1.6.2, and the manifest had at some point regressed from 1.6.4. The published version was not
known, so 1.7.0 was chosen to sit "safely above anything that might have been uploaded" — and on
11 September 2026 the public listing showed 2.0.1, a build that no commit in this repo carries. The
store rejects a version that is not greater than the published one; the release became 2.1.0.

**What to do instead.** Name the artefact users run and say when it last changed: here that is the
zip in the dashboard, not `main`. Before a release, check the dashboard for the published version,
bump both files, `npm run package`, and record the upload in `PROGRESS.md`. A merged PR changes
`main`; it changes nobody's browser.

---

## How to add an entry

1. Catch a real dismissal that turned out wrong — in review, or reading back a commit message or a
   `PROGRESS.md` note.
2. Write the thought in the words you actually used, not a tidied-up version.
3. Say why it was seductive. An entry that makes the thought sound stupid teaches nothing, because
   nobody recognises themselves in it.
4. Record what happened **here**, with the date and, where one exists, the commit SHA or PR number.
   Never invent a count or a date; if you have not run it, do not state it.
5. Give the check that defeats it — a question with an answer, or a command that exists.
6. Add the one-line version to the quick-reference table at the top.
7. Commit as `docs: CC-<n> - 📝 Add "<rationalisation>" to RATIONALIZATIONS` (`docs/GIT.md`
   §Commit messages).

`CLAUDE.md`, `docs/DA-REVIEW.md`, `docs/SELF-REVIEW.md`, `docs/GIT.md` and `docs/DEVELOPMENT.md`
point here from their own sections. `.claude/agents/da-review.md` should consult this file only
when about to dismiss a finding, never as part of the standard brief: a list of excuses read too
early becomes a menu.
