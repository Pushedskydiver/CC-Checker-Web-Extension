import clsx from 'clsx';
import { Text } from '../text/text';

import styles from './cta.module.css';

export type TButton = React.ButtonHTMLAttributes<HTMLButtonElement> &
	TCtaShared;

type TCtaShared = React.PropsWithChildren<{
	className?: string;
}>;

export const Button = ({
	children,
	type = 'button',
	className,
	onClick,
	...buttonAttributes
}: TButton) => {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
		if (onClick) {
			onClick(e);
		}
	};

	return (
		<button
			type={type}
			onClick={handleClick}
			className={clsx(styles.cta, className)}
			{...buttonAttributes}
		>
			{children}
		</button>
	);
};

type TCtaText = {
	children: React.ReactNode;
	className?: string;
};

const CtaText = ({ children, className }: TCtaText) => (
	<Text
		role="presentation"
		weight="medium"
		className={clsx(styles.content, className)}
	>
		{children}
	</Text>
);

export const CtaContent = {
	Text: CtaText,
};
