import clsx from 'clsx';
import { useColourContrast } from '~/context';

import styles from './action-cta.module.css';

export type TActionCta = {
	label: string;
	icon?: React.ReactElement<'svg'>;
	withBackground?: boolean;
	className?: string;
	children?: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ActionCta: React.FC<TActionCta> = ({
	label,
	icon,
	withBackground = false,
	className,
	children,
	onClick,
}) => {
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className={clsx(
				styles.cta,
				isPoorContrastOnLightBg ? styles.ctaDark : undefined,
				isPoorContrastOnDarkBg ? styles.ctaLight : undefined,
				withBackground ? styles.ctaWithBackground : undefined,
				className,
			)}
		>
			{icon}
			{children}
		</button>
	);
};
