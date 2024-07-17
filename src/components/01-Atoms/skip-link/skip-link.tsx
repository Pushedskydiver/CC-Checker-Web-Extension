import clsx from 'clsx';
import { useColourContrast } from '~/context';

import styles from './skip-link.module.css';

export type TSkipLink = {
	href: string;
	bodyText: string;
};

export const SkipLink: React.FC<TSkipLink> = ({ href, bodyText }) => {
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<a
			href={href}
			className={clsx(
				styles.link,
				isPoorContrastOnLightBg ? styles.linkDark : undefined,
				isPoorContrastOnDarkBg ? styles.linkLight : undefined,
			)}
		>
			{bodyText}
		</a>
	);
};
