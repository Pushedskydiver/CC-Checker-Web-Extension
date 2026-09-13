import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';

import { useColourContrast } from '~/context';
import { ActionCta } from '../action-cta/action-cta';
import { Clipboard, Share } from '../icon/icon';
import { Text } from '../text/text';

import styles from './copy-cta.module.css';

export type TCopyCta = {
	value: string;
	icon?: 'clipboard' | 'share';
	tooltipPosition?: 'top' | 'bottom';
	withBackground?: boolean;
};

const COPIED_VISIBLE_MS = 2000;

export const CopyCta = ({
	value,
	icon = 'clipboard',
	tooltipPosition = 'top',
	withBackground = false,
}: TCopyCta) => {
	const isUrl = value.includes('http');
	const [copied, setCopied] = useState(false);
	const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { isPoorContrast, isBackgroundDark } = useColourContrast();
	const copyText = isUrl
		? 'Generate share URL'
		: `Copy ${value} to clipboard`;
	const copiedText = isUrl ? 'URL added to clipboard' : 'Copied';

	useEffect(() => {
		return () => {
			if (resetTimer.current) clearTimeout(resetTimer.current);
		};
	}, []);

	const handleCopy = async (): Promise<void> => {
		// Announcing when the copy failed would put the confirmation into the
		// `role="status"` region below while nothing reached the clipboard. That is
		// what shipped until 12 September 2026: `react-copy-to-clipboard` called
		// `onCopy(text, result)` whatever `result` was, and this handler took no
		// arguments, so a failed copy still announced "URL added to clipboard" to a
		// screen reader. `copy` resolves false when `document.execCommand('copy')`
		// is refused — an enterprise clipboard policy, or a browser that does not
		// implement it, which is a live question for the Safari port.
		//
		// Since 13 September 2026 (`copy-to-clipboard` 4.x) `copy` tries
		// `navigator.clipboard.writeText` first and falls back to `execCommand`
		// when it throws. In this iframe it throws — `use_dynamic_url` means no
		// `allow` attribute can grant `clipboard-write`, and a host page's
		// `Permissions-Policy` can revoke it anyway (`docs/ARCHITECTURE.md`
		// §Deliberately not changed) — so `execCommand` is still the path that
		// works. `fallbackToPrompt` keeps the 3.x last resort, which 4.x turned off.
		//
		// `copied` is annotated rather than inlined into the `if`, and the
		// annotation is the gate. Without the `await`, `copy(value)` is a
		// `Promise`, on which `!copied` is always false: the guard would vanish
		// silently. That is how the 4.x bump arrived (#48, a `TS2322` in
		// `lint:ts`), and it is what the annotation still catches.
		const copied: boolean = await copy(value, { fallbackToPrompt: true });

		if (!copied) return;

		if (resetTimer.current) clearTimeout(resetTimer.current);

		setCopied(true);

		resetTimer.current = setTimeout(() => {
			setCopied(false);
		}, COPIED_VISIBLE_MS);
	};

	return (
		<span className={styles.ctaWrapper}>
			{/* A live region: the confirmation is inserted on copy so screen readers announce it. */}
			<Text
				size="pulse"
				weight="medium"
				role="status"
				className={clsx(
					styles.tooltip,
					styles[`${tooltipPosition}Tooltip`],
					isPoorContrast && !isBackgroundDark
						? styles.tooltipDark
						: undefined,
					isPoorContrast && isBackgroundDark
						? styles.tooltipLight
						: undefined,
					copied ? styles.tooltipFadeInOut : undefined,
				)}
			>
				{copied ? copiedText : ''}
			</Text>

			<ActionCta
				label={copyText}
				onClick={handleCopy}
				icon={
					icon === 'clipboard' ? <Clipboard size={20} /> : <Share />
				}
				withBackground={withBackground}
			/>
		</span>
	);
};
