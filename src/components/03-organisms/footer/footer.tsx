import { SavedColors } from '~/components/02-molecules/saved-colors/saved-colors';
import { BuyMeACoffeeCTA } from '~/components/01-atoms/bmc-cta/bmc-cta';

import styles from './footer.module.css';

export const Footer: React.FC = () => (
	<footer className={styles.footer}>
		<div className={styles.container}>
			<SavedColors />

			<BuyMeACoffeeCTA />
		</div>
	</footer>
);
