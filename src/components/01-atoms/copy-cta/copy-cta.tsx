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

export const CopyCta: React.FC<TCopyCta> = ({
	value,
	icon = 'clipboard',
	tooltipPosition = 'top',
	withBackground = false,
}) => {
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

	const handleCopy = (): void => {
		// `copy` returns false when the document's copy command is refused — a host
		// page whose `Permissions-Policy` forbids it, or a browser that blocks it.
		// Announcing then would put the confirmation into the `role="status"`
		// region below while nothing reached the clipboard. That is what shipped
		// until 12 September 2026: `react-copy-to-clipboard` called `onCopy(text,
		// result)` whatever `result` was, and this handler took no arguments, so a
		// failed copy still announced "URL added to clipboard" to a screen reader.
		if (!copy(value)) return;

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
