import clsx from 'clsx';
import { useColourContrast } from '~/context';

import styles from './skip-link.module.css';

export type TSkipLink = {
	href: string;
	bodyText: string;
};

export const SkipLink = ({ href, bodyText }: TSkipLink) => {
	const { isPoorContrast, isBackgroundDark } = useColourContrast();

	return (
		<a
			href={href}
			className={clsx(
				styles.link,
				isPoorContrast && !isBackgroundDark
					? styles.linkDark
					: undefined,
				isPoorContrast && isBackgroundDark
					? styles.linkLight
					: undefined,
			)}
		>
			{bodyText}
		</a>
	);
};
