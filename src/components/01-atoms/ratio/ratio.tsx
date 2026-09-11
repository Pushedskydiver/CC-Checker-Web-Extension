import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { Text } from '../text/text';

import styles from './ratio.module.css';

export const Ratio: React.FC = () => {
	const { contrast, isPoorContrast, isBackgroundDark } = useColourContrast();

	return (
		<Text
			id="ratio"
			tabIndex={-1}
			size="landmark"
			weight="semiBold"
			className={clsx(
				styles.ratio,
				isPoorContrast && !isBackgroundDark
					? styles.ratioDark
					: undefined,
				isPoorContrast && isBackgroundDark
					? styles.ratioLight
					: undefined,
			)}
		>
			{contrast.toFixed(2)}
		</Text>
	);
};
