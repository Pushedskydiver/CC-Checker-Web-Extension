import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { ColorSwatch } from '~/components/01-atoms/color-swatch/color-swatch';
import { Save } from '~/components/01-atoms/icon/icon';
import { Text } from '~/components/01-atoms/text/text';

import styles from './saved-colors.module.css';

import type { TColors } from '~/global-types';

export const SavedColors: React.FC = () => {
	const { colors, clearColors } = useColourContrast();
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
					<button className={styles.cta} onClick={clearColors}>
						<Text weight="medium" role="presentation">
							Clear all
						</Text>
					</button>
				</div>
			) : null}

			{!hasColors ? (
				<div className={styles.contentNoColors}>
					<Text tag="p" weight="medium">
						You can save your colour combinations to revisit later
					</Text>

					<Save size={40} className={styles.iconNoColors} />
				</div>
			) : null}
		</div>
	);
};
