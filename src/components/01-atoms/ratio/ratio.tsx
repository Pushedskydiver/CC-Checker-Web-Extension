import { useColourContrast } from '~/context';
import { Text } from '../text/text';

import styles from './ratio.module.css';

export const Ratio = () => {
	const { contrast } = useColourContrast();

	return (
		<Text
			id="ratio"
			tabIndex={-1}
			size="landmark"
			weight="semiBold"
			className={styles.ratio}
		>
			{contrast.toFixed(2)}
		</Text>
	);
};
