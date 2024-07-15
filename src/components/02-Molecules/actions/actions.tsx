import { useColourContrast } from '~/context';
import { hslToHex } from '~/utils/color-utils';
import { ActionCta } from '~/components/01-atoms/action-cta/action-cta';
import { CopyCta } from '~/components/01-atoms/copy-cta/copy-cta';
import { Cross, Swap } from '~/components/01-atoms/icon/icon';

import styles from './actions.module.css';

export const Actions: React.FC = () => {
	const { background, foreground, reverseColors } = useColourContrast();
	const bg = hslToHex(background).split('#');
	const fg = hslToHex(foreground).split('#');
	const shareUrl = `https://colourcontrast.cc/?background=${bg[1]}&foreground=${fg[1]}`;

	const closeChecker = () => {
		// chrome.runtime.sendMessage({
		// 	type: 'closeChecker',
		// });
	};

	return (
		<ul className={styles.list} aria-label="Actions">
			<li>
				<CopyCta
					value={shareUrl}
					icon="share"
					tooltipPosition="bottom"
					withBackground={true}
				/>
			</li>

			<li>
				<ActionCta
					label="Reverse Colours"
					icon={<Swap size={20} />}
					onClick={reverseColors}
					withBackground={true}
				/>
			</li>

			<li>
				<ActionCta
					label="Close Colour Contrast Checker"
					icon={<Cross size={20} />}
					onClick={closeChecker}
					withBackground={true}
				/>
			</li>
		</ul>
	);
};
