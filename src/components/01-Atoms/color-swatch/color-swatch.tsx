import { useColourContrast } from '~/context';
import { colorToHsl } from '~/utils/color-utils';
import { Bin } from '../icon/icon';
import { Text } from '../text/text';

import styles from './color-swatch.module.css';

export type TColorSwatch = {
	background: string;
	foreground: string;
};

export const ColorSwatch: React.FC<TColorSwatch> = ({
	background,
	foreground,
}) => {
	const { removeColors, updateView } = useColourContrast();

	const handleApplyColors = (): void => {
		const bg = colorToHsl(background);
		const fg = colorToHsl(foreground);

		localStorage.setItem('background', JSON.stringify(bg));
		localStorage.setItem('foreground', JSON.stringify(fg));

		updateView(bg, fg);
	};

	const handleRemoveColors = () => {
		removeColors(background, foreground);
	};

	return (
		<span className={styles.swatchWrapper}>
			<button
				type="button"
				aria-label={`Background ${background}. Foreground ${foreground}. Select to apply these colours.`}
				className={styles.swatch}
				onClick={handleApplyColors}
				style={{
					backgroundColor: background,
					color: foreground,
					border: `2px solid ${foreground}`,
				}}
			>
				<Text size="script" weight="semiBold" role="presentation">
					Aa
				</Text>
			</button>

			<button
				type="button"
				aria-label="Remove colours"
				className={styles.remove}
				onClick={handleRemoveColors}
			>
				<Bin size={12} />
			</button>
		</span>
	);
};
