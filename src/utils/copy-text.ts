/**
 * Copies `text` with `document.execCommand('copy')` and returns whether the browser accepted it.
 * On refusal it shows the text in `window.prompt` so the user can still copy it by hand.
 *
 * `execCommand` is the only clipboard path that works in this panel: `navigator.clipboard` is
 * blocked by the iframe's permissions policy (`docs/ARCHITECTURE.md` §Deliberately not changed).
 * This used to be `copy-to-clipboard` 3.3.3. Its 4.x tries `navigator.clipboard.writeText` first
 * and only then falls back, and on 13 September 2026 that attempt made the e2e suite's Chromium log
 * "Permissions policy violation: The Clipboard API has been blocked…" as a `console.error` on every
 * copy click, with no option to skip it — so the part of 3.3.3 this app used is ported here instead.
 *
 * Ported from `copy-to-clipboard` 3.3.3 and `toggle-selection` 1.0.6 (both MIT; licence notices at
 * the end of this file). Dropped because nothing here needs them: the `format`, `onCopy`, `message`
 * and `debug` options, the IE11 `window.clipboardData` fallback, the `MozUserSelect` and
 * `msUserSelect` prefixes, and the `removeAllRanges` fallback for engines without `removeRange`.
 * Two deliberate differences: the prompt opens after the hidden span and the previous selection are
 * cleaned up, not while they are still in place; and cleanup cannot throw (see `finally` below).
 */
export const copyText = (text: string): boolean => {
	const selection = document.getSelection();
	const restoreSelection = clearSelection(selection);
	const range = document.createRange();
	const mark = createHiddenSpan(text);
	let copied = false;

	try {
		document.body.appendChild(mark);
		range.selectNodeContents(mark);
		selection?.addRange(range);
		copied = document.execCommand('copy');
	} catch {
		// An engine that throws instead of returning false — the open question for the Safari
		// port — takes the same refusal path, prompt included.
		copied = false;
	} finally {
		// `removeAllRanges` behind a count, not 3.3.3's `removeRange(range)`: that throws
		// `NotFoundError` when the range was never added, which would skip the two lines after it
		// and leave the span in the page. Only this range can be selected here, because
		// `clearSelection` emptied the selection first.
		if (selection?.rangeCount) selection.removeAllRanges();
		mark.remove();
		restoreSelection();
	}

	if (!copied) window.prompt(promptMessage(), text);

	return copied;
};

/**
 * Empties the selection so only the hidden span is copied, and returns a function that puts the
 * previous ranges back and refocuses the text field that held them. Blurring a focused input or
 * textarea first is inherited from `toggle-selection`, not observed to be needed here: on
 * 14 September 2026 a da-review scratch spec (not kept) copied the span's text in the suite's
 * Chromium with `input#background` still focused and part of its value selected, and a mouse click
 * on the button moves focus off the input before this runs anyway. Kept for engines where a field's
 * own selection does win over the added range — the Safari port is where to check.
 */
const clearSelection = (selection: Selection | null): (() => void) => {
	if (!selection || selection.rangeCount === 0) return () => {};

	const ranges = Array.from({ length: selection.rangeCount }, (_, i) =>
		selection.getRangeAt(i),
	);
	const active = document.activeElement;
	const field =
		active instanceof HTMLInputElement ||
		active instanceof HTMLTextAreaElement
			? active
			: null;

	field?.blur();
	selection.removeAllRanges();

	return () => {
		if (selection.type === 'Caret') selection.removeAllRanges();
		if (selection.rangeCount === 0) {
			ranges.forEach((previous) => selection.addRange(previous));
		}
		field?.focus();
	};
};

const createHiddenSpan = (text: string): HTMLSpanElement => {
	const mark = document.createElement('span');

	mark.textContent = text;
	mark.setAttribute('aria-hidden', 'true');
	// `all: unset` first, so the declarations after it are not reset by it.
	mark.style.all = 'unset';
	// Fixed and clipped: no scroll to the end of the page, nothing visible.
	mark.style.position = 'fixed';
	mark.style.top = '0';
	mark.style.clip = 'rect(0, 0, 0, 0)';
	// Keeps spaces and line breaks in the copied text.
	mark.style.whiteSpace = 'pre';
	// The span must be selectable even if an ancestor sets `user-select: none`.
	mark.style.userSelect = 'text';
	mark.style.webkitUserSelect = 'text';
	// The copy is ours; do not let it bubble to anything listening higher up.
	mark.addEventListener('copy', (event) => event.stopPropagation());

	return mark;
};

const promptMessage = (): string =>
	`Copy to clipboard: ${/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'}+C, Enter`;

/*
 * Licence notices for the code this file is ported from.
 *
 * copy-to-clipboard 3.3.3 — its LICENSE file, verbatim:
 *
 * MIT License
 *
 * Copyright (c) 2017 sudodoki <smd.deluzion@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * toggle-selection 1.0.6 — `"license": "MIT"`, author sudodoki <smd.deluzion@gmail.com>,
 * contributor Aleksej Shvajka (its package.json). The package ships no LICENSE file and states no
 * copyright year; the MIT permission notice above is the licence it declares.
 */
