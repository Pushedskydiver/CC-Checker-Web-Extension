import { useColourContrast } from '~/context';
import { colorToHsl } from '~/utils/color-utils';
import { Text } from '../text/text';

import styles from './color-swatch.module.css';
import clsx from 'clsx';

export type TColorSwatch = {
	background: string;
	foreground: string;
};

export const ColorSwatch: React.FC<TColorSwatch> = ({
	background,
	foreground,
}) => {
	const { isPoorContrast, isBackgroundDark, updateView } =
		useColourContrast();

	const applyColors = (): void => {
		const bg = colorToHsl(background);
		const fg = colorToHsl(foreground);

		localStorage.setItem('background', JSON.stringify(bg));
		localStorage.setItem('foreground', JSON.stringify(fg));

		updateView(bg, fg);
	};

	return (
		<button
			type="button"
			onClick={applyColors}
			aria-label={`Background = ${background}. Foreground = ${foreground}. Select to apply these colours.`}
			style={{
				backgroundColor: background,
				color: foreground,
				border: `2px solid ${foreground}`,
			}}
			className={clsx(
				styles.swatch,
				isPoorContrast && !isBackgroundDark
					? styles.swatchDark
					: undefined,
				isPoorContrast && isBackgroundDark
					? styles.swatchLight
					: undefined,
			)}
		>
			<Text size="script" weight="semiBold" role="presentation">
				Aa
			</Text>
		</button>
	);
};
