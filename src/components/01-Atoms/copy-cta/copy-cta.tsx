import { useState } from "react";
import clsx from "clsx";
import CopyToClipboard from "react-copy-to-clipboard";
import { useColourContrast } from "~/context";
import { ActionCta } from "../action-cta/action-cta";
import { Clipboard, Share } from "../icon/icon";
import { Text } from "../text/text";

import styles from './copy-cta.module.css';

export type TCopyCta = {
	value: string;
	icon?: 'clipboard' | 'share';
	tooltipPosition?: 'top' | 'bottom';
	withBackground?: boolean;
}

export const CopyCta: React.FC<TCopyCta> = ({
	value,
	icon = 'clipboard',
	tooltipPosition = 'top',
	withBackground = false,
}) => {
	const isUrl = value.includes('http');
	const [copied, setCopiedState] = useState(false);
	const { isPoorContrast, isBackgroundDark } = useColourContrast();
	const copyText = isUrl ? 'Generate share URL' : `Copy ${value} to clipboard`;
	const copiedText = isUrl ? 'URL added to clipboard' : 'Copied';
	const bodyText = copied ? copiedText : copyText;

	const setCopyState = (): void => {
		setCopiedState(true);

		const delaySetState = setTimeout(() => {
			setCopiedState(false);
			clearTimeout(delaySetState);
		}, 2000);
	}

	return (
		<span className={styles.ctaWrapper}>
			<Text
				size="pulse"
				weight="medium"
				aria-hidden="true"
				className={clsx(
					styles.tooltip,
					styles[`${tooltipPosition}Tooltip`],
					isPoorContrast && !isBackgroundDark ? styles.tooltipDark : undefined,
					isPoorContrast && isBackgroundDark ? styles.tooltipLight : undefined,
					copied ? styles.tooltipFadeInOut : undefined,
				)}
			>
				{bodyText}
			</Text>

			<CopyToClipboard text={value} onCopy={setCopyState}>
				<ActionCta
					label={bodyText}
					icon={icon === 'clipboard' ? <Clipboard size={20} /> : <Share />}
					withBackground={withBackground}
				/>
			</CopyToClipboard>
		</span>
	)
}
