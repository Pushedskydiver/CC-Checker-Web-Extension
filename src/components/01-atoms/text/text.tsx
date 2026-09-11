import { clsx } from 'clsx';

import styles from './text.module.css';

export type TextSizes =
	'horizon' | 'landmark' | 'pinnacle' | 'script' | 'whisper' | 'pulse';

export type TextWeights =
	'light' | 'thin' | 'regular' | 'medium' | 'semiBold' | 'bold';

export type TTextTag =
	| 'span'
	| 'div'
	| 'p'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'strong'
	| 'em'
	| 'small';

export type TText = {
	tag?: TTextTag;
	size?: TextSizes;
	weight?: TextWeights;
} & React.HTMLAttributes<HTMLElement>;

export const Text: React.FC<TText> = ({
	tag: Tag = 'span',
	size = 'pulse',
	weight = 'regular',
	className,
	children,
	...rest
}) => (
	<Tag
		className={clsx(
			styles.base,
			styles[`${size}Text`],
			styles[`${weight}Weight`],
			className,
		)}
		{...rest}
	>
		{children}
	</Tag>
);
