import { Ratio } from '~/components/01-atoms/ratio/ratio';
import { TextSwatch } from '~/components/01-atoms/text-swatch/text-swatch';
import { SavedColors } from '~/components/02-molecules/saved-colors/saved-colors';
import { Wcag } from '~/components/02-molecules/wcag/wcag';

import styles from './score.module.css';

export const Score: React.FC = () => (
	<section className={styles.section} aria-label="Ratio and grades">
		<div className={styles.container}>
			<div className={styles.content}>
				<TextSwatch />
				<Ratio />
			</div>

			<Wcag id="grades" />
		</div>

		<SavedColors />
	</section>
);
