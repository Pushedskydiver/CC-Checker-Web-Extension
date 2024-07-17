import { CurrentColorSwatch } from '~/components/01-atoms/current-color-swatch/current-color-swatch';
import { Text } from '~/components/01-atoms/text/text';

import styles from './text-swatch.module.css';

export const TextSwatch: React.FC = () => (
	<div className={styles.container}>
		<Text size="horizon" weight="bold" className={styles.swatch}>
			Aa
		</Text>

		<CurrentColorSwatch />
	</div>
);
