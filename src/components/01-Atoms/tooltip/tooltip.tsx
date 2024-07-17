import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { Text } from '../text/text';

import styles from './tooltip.module.css';

export type TTooltip = {
	bodyText: string;
	position?: 'top' | 'bottom';
	showTooltip?: boolean;
};

export const Tooltip: React.FC<TTooltip> = ({
	bodyText,
	position = 'top',
	showTooltip = false,
}) => {
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<Text
			size="pulse"
			weight="medium"
			aria-hidden="true"
			className={clsx(
				styles.tooltip,
				styles[`${position}Tooltip`],
				showTooltip ? styles.tooltipFadeInOut : undefined,
				isPoorContrastOnLightBg ? styles.tooltipDark : undefined,
				isPoorContrastOnDarkBg ? styles.tooltipLight : undefined,
			)}
		>
			{bodyText}
		</Text>
	);
};
