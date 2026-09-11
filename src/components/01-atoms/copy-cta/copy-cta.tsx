import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CopyToClipboard from 'react-copy-to-clipboard';

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

			<CopyToClipboard text={value} onCopy={handleCopy}>
				<ActionCta
					label={copyText}
					icon={
						icon === 'clipboard' ? (
							<Clipboard size={20} />
						) : (
							<Share />
						)
					}
					withBackground={withBackground}
				/>
			</CopyToClipboard>
		</span>
	);
};
