import { useColourContrast } from '~/context';
import { Score } from '~/components/01-atoms/score/score';
import { TextSwatch } from '~/components/02-molecules/text-swatch/text-swatch';
import { Wcag } from '~/components/02-molecules/wcag/wcag';

import styles from './results.module.css';

export const Results: React.FC = () => {
	const { contrast } = useColourContrast();

	return (
		<section className={styles.section} aria-label="Score and grades">
			<div className={styles.container}>
				<TextSwatch />

				<Score score={contrast.toFixed(2)} />

				<Wcag />
			</div>
		</section>
	);
};
