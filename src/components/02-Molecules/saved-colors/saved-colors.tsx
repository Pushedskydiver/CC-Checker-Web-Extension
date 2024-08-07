import { useColourContrast } from '~/context';
import { hslToHex } from '~/utils/color-utils';
import { Button, CtaContent } from '~/components/01-atoms/cta/cta';
import { ColorSwatch } from '~/components/01-atoms/color-swatch/color-swatch';

import styles from './saved-colors.module.css';

import type { TColors } from '~/global-types';

export const SavedColors: React.FC = () => {
	const { background, foreground, colors, setColors } = useColourContrast();

	const renderSwatch = (swatch: TColors, i: number): JSX.Element => (
		<ColorSwatch
			key={`${swatch.background}-${swatch.foreground}-${i}`}
			background={swatch.background}
			foreground={swatch.foreground}
		/>
	);

	const saveColors = (): void => {
		const storedColors = localStorage.getItem('colors');
		const colors: TColors[] = storedColors ? JSON.parse(storedColors) : [];
		const bg = hslToHex(background);
		const fg = hslToHex(foreground);

		const sameColors = colors.some(
			(color) => color.background === bg && color.foreground === fg,
		);

		if (colors.length > 0 && sameColors) {
			return;
		}

		if (colors.length > 5) {
			colors.pop();
		}

		colors.unshift({ background: bg, foreground: fg });
		localStorage.setItem('colors', JSON.stringify(colors));
		setColors(colors);
	};

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
