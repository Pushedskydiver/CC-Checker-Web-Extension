import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ActionCta } from '../../01-atoms/action-cta/action-cta';
import { Clipboard, Share } from '../../01-atoms/icon/icon';
import { Tooltip } from '../../01-atoms/tooltip/tooltip';

import styles from './copy-cta.module.css';

export type TCopyCta = {
	value: string;
	icon?: 'clipboard' | 'share';
	tooltipPosition?: 'top' | 'bottom';
	withBackground?: boolean;
};

export const CopyCta: React.FC<TCopyCta> = ({
	value,
	icon = 'clipboard',
	tooltipPosition = 'top',
	withBackground = false,
}) => {
	const [isCopied, setIsCopied] = useState(false);
	const hasUrl = value.includes('http');

	const copyText = hasUrl
		? 'Generate share URL'
		: `Copy ${value} to clipboard`;
	const copiedText = hasUrl ? 'URL added to clipboard' : 'Copied';
	const bodyText = isCopied ? copiedText : copyText;

	const setIsCopiedState = (): void => {
		setIsCopied(true);

		const delaySetState = setTimeout(() => {
			setIsCopied(false);
			clearTimeout(delaySetState);
		}, 2000);
	};

	return (
		<span className={styles.ctaWrapper}>
			<Tooltip
				bodyText={bodyText}
				position={tooltipPosition}
				showTooltip={isCopied}
			/>

			<CopyToClipboard text={value} onCopy={setIsCopiedState}>
				<ActionCta
					label={bodyText}
					icon={
						icon === 'clipboard' ? (
							<Clipboard size={20} />
						) : (
							<Share size={20} />
						)
					}
					withBackground={withBackground}
				/>
			</CopyToClipboard>
		</span>
	);
};
