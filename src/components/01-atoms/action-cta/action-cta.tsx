import clsx from 'clsx';

import styles from './action-cta.module.css';

export type TActionCta = {
	label: string;
	icon?: React.ReactNode;
	withBackground?: boolean;
	className?: string;
	children?: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const ActionCta = ({
	label,
	icon,
	withBackground = false,
	className,
	children,
	onClick,
}: TActionCta) => {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className={clsx(
				styles.cta,
				withBackground ? styles.ctaWithBackground : undefined,
				className,
			)}
		>
			{icon}
			{children}
		</button>
	);
};
