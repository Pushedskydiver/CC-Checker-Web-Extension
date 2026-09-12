import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { Text } from '../text/text';

import styles from './cta.module.css';

export type TButton = React.ButtonHTMLAttributes<HTMLButtonElement> & CtaShared;

type CtaShared = React.PropsWithChildren<{
	className?: string;
}>;

export const Button: React.FC<TButton> = ({
	children,
	type = 'button',
	className,
	onClick,
	...buttonAttributes
}) => {
	const { isPoorContrast, isBackgroundDark } = useColourContrast();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
		if (onClick) {
			onClick(e);
		}
	};

	return (
		<button
			type={type}
			onClick={handleClick}
			className={clsx(
				styles.cta,
				isPoorContrast && !isBackgroundDark
					? styles.ctaDark
					: undefined,
				isPoorContrast && isBackgroundDark
					? styles.ctaLight
					: undefined,
				className,
			)}
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

const CtaText: React.FC<TCtaText> = ({ children, className }) => (
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
