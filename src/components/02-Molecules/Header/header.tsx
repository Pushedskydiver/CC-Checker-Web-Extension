import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { BuyMeACoffeeCTA } from '~/components/01-atoms/bmc-cta/bmc-cta';
import { Text } from '~/components/01-atoms/text/text';
import { SkipLink } from '~/components/01-atoms/skip-link/skip-link';
import { Actions } from '../actions/actions';

import styles from './header.module.css';

export const Header: React.FC = () => {
	const { isPoorContrast, isBackgroundDark } = useColourContrast();

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<SkipLink
					href="#ratio"
					bodyText="Skip to colour contrast ratio"
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
					size="pinnacle"
					weight="semiBold"
					className={clsx(
						styles.title,
						isPoorContrast && !isBackgroundDark
							? styles.titleDark
							: undefined,
						isPoorContrast && isBackgroundDark
							? styles.titleLight
							: undefined,
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
