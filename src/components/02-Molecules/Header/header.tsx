import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { BuyMeACoffeeCTA } from '~/components/01-atoms/bmc-cta/bmc-cta';
import { Text } from '~/components/01-atoms/text/text';
import { SkipLink } from '~/components/01-atoms/skip-link/skip-link';
import { Actions } from '../actions/actions';

import styles from './header.module.css';

export const Header: React.FC = () => {
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<SkipLink
					href="#score"
					bodyText="Skip to colour contrast score"
				/>
				<SkipLink
					href="#grades"
					bodyText="Skip to colour contrast grades"
				/>
				<SkipLink
					href="#background"
					bodyText="Skip to background colour input"
				/>
				<SkipLink
					href="#foreground"
					bodyText="Skip to foreground colour input"
				/>

				<Text
					tag="h1"
					size="landmark"
					weight="bold"
					className={clsx(
						styles.title,
						isPoorContrastOnLightBg ? styles.titleDark : undefined,
						isPoorContrastOnDarkBg ? styles.titleLight : undefined,
					)}
				>
					Colour contrast checker
				</Text>

				<div className={styles.meta}>
					<BuyMeACoffeeCTA />

					<Actions />
				</div>
			</div>
		</header>
	);
};
