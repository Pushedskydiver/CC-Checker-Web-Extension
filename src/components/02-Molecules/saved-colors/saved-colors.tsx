import { useColourContrast } from '~/context';
import { ColorSwatch } from '~/components/01-atoms/color-swatch/color-swatch';

import styles from './saved-colors.module.css';

import type { TColors } from '~/global-types';
import clsx from 'clsx';

export const SavedColors: React.FC = () => {
	const { colors } = useColourContrast();
	const hasColors = colors.length > 0;

	const renderSwatch = (swatch: TColors, i: number): JSX.Element => (
		<li key={`${swatch.background}-${swatch.foreground}-${i}`}>
			<ColorSwatch
				background={swatch.background}
				foreground={swatch.foreground}
			/>
		</li>
	);

	return (
		<div
			className={clsx(
				styles.container,
				hasColors ? styles.containerWithColors : null,
			)}
		>
			{hasColors ? (
				<ul className={styles.list} aria-label="Saved colours">
					{colors.map(renderSwatch)}
				</ul>
			) : null}

			{hasColors ? (
				<div className={styles.aside}>
					<button>Clear all</button>
				</div>
			) : null}
		</div>
	);
};
