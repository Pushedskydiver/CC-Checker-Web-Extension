import clsx from 'clsx';

import { useColourContrast } from '~/context';
import { colorToHsl } from '~/utils/color-utils';
import { Text } from '../text/text';

import styles from './color-swatch.module.css';

export type TColorSwatch = {
	background: string;
	foreground: string;
};

export const ColorSwatch = ({ background, foreground }: TColorSwatch) => {
	const { isPoorContrast, isBackgroundDark, updateView } =
		useColourContrast();

	const applyColors = (): void => {
		updateView(colorToHsl(background), colorToHsl(foreground));
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
