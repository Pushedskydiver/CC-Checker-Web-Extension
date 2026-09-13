/**
 * Copies `text` with `document.execCommand('copy')` and returns whether the browser accepted it.
 * On refusal it shows the text in `window.prompt` so the user can still copy it by hand.
 *
 * `execCommand` is the only clipboard path that works in this panel: `navigator.clipboard` is
 * blocked by the iframe's permissions policy (`docs/ARCHITECTURE.md` §Deliberately not changed).
 * This used to be `copy-to-clipboard` 3.3.3. Its 4.x tries `navigator.clipboard.writeText` first
 * and only then falls back, and on 13 September 2026 that attempt made Chrome log "Permissions
 * policy violation: The Clipboard API has been blocked" as a `console.error` on every copy click,
 * with no option to skip it — so the part of 3.3.3 this app used is ported here instead.
 *
 * Ported from `copy-to-clipboard` 3.3.3 and `toggle-selection` 1.0.6 (both MIT, sudodoki). Dropped
 * because nothing here uses them: the `format`, `onCopy`, `message` and `debug` options, and the
 * IE11 `window.clipboardData` fallback. One deliberate difference: the prompt opens after the
 * hidden span and the previous selection are cleaned up, not while they are still in place.
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
		copied = false;
	} finally {
		selection?.removeRange(range);
		mark.remove();
		restoreSelection();
	}

	if (!copied) window.prompt(promptMessage(), text);

	return copied;
};

/**
 * Empties the selection so only the hidden span is copied, and returns a function that puts the
 * previous ranges back and refocuses the text field that held them. A focused input or textarea is
 * blurred first, because its own selection would otherwise win over the range added to the span —
 * the hex `CopyCta` sits next to `input#background`.
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
