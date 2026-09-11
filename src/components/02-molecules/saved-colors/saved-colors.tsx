import { useColourContrast } from '~/context';
import { Button, CtaContent } from '~/components/01-atoms/cta/cta';
import { ColorSwatch } from '~/components/01-atoms/color-swatch/color-swatch';

import styles from './saved-colors.module.css';

import type { TColors } from '~/global-types';

export const SavedColors: React.FC = () => {
	const { colors, saveColors } = useColourContrast();

	const renderSwatch = (swatch: TColors, i: number): React.JSX.Element => (
		<li key={`${swatch.background}-${swatch.foreground}-${i}`}>
			<ColorSwatch
				background={swatch.background}
				foreground={swatch.foreground}
			/>
		</li>
	);

	return (
		<div className={styles.actions}>
			<Button type="button" onClick={saveColors} className={styles.cta}>
				<CtaContent.Text>Save colours</CtaContent.Text>
			</Button>

			{colors.length > 0 ? (
				<ul className={styles.swatches} aria-label="Saved colours">
					{colors.map(renderSwatch)}
				</ul>
			) : null}
		</div>
	);
};
