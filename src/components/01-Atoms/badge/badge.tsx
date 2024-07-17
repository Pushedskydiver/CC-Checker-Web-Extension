import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { Cross, Tick } from '../icon/icon';
import { Text } from '../text/text';

import styles from './badge.module.css';

export type TBadge = {
	type: 'AA Large' | 'AAA Large' | 'AA Normal' | 'AAA Normal';
	grade: 'Pass' | 'Fail';
	children: React.ReactNode;
};

export const Badge: React.FC<TBadge> = ({ grade, type, children }) => {
	const isPass = grade === 'Pass';
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<>
			<Text
				size="pulse"
				weight="semiBold"
				role="presentation"
				className={clsx(
					styles.badge,
					isPoorContrastOnLightBg ? styles.badgeDark : undefined,
					isPoorContrastOnDarkBg ? styles.badgeLight : undefined,
				)}
			>
				<span className={styles.badgeContent} role="presentation">
					{children}
				</span>

				{isPass ? <Tick size={20} /> : <Cross size={20} />}
			</Text>

			<Text
				size="whisper"
				weight="semiBold"
				role="presentation"
				className={clsx(
					styles.badgeText,
					isPoorContrastOnLightBg ? styles.badgeTextDark : undefined,
					isPoorContrastOnDarkBg ? styles.badgeTextLight : undefined,
				)}
			>
				{type}
			</Text>
		</>
	);
};
