import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { Text } from '../text/text';

import styles from './score.module.css';

export type TScore = {
	score: number | string;
};

export const Score: React.FC<TScore> = ({ score }) => {
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<div
			className={clsx(
				styles.container,
				isPoorContrastOnLightBg ? styles.containerDark : undefined,
				isPoorContrastOnDarkBg ? styles.containerLight : undefined,
			)}
		>
			<Text id="score" tag="h2" weight="bold" className={styles.title}>
				Score:
			</Text>

			<Text
				id="score"
				size="pinnacle"
				weight="bold"
				className={styles.score}
			>
				{score}
			</Text>
		</div>
	);
};
