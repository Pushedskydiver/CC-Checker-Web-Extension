import clsx from 'clsx';
import { useColourContrast } from '~/context';

import styles from './bmc-cta.module.css';

export const BuyMeACoffeeCTA: React.FC = () => {
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<a
			href="https://buymeacoffee.com/alexclapperton"
			aria-label="Buy me a coffee"
			rel="external noopener noreferrer"
			target="_blank"
			className={clsx(
				styles.cta,
				isPoorContrastOnLightBg ? styles.ctaDark : undefined,
				isPoorContrastOnDarkBg ? styles.ctaLight : undefined,
			)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="250"
				height="55"
				aria-hidden="true"
				focusable="false"
				pointerEvents="none"
			>
				<image
					href="/images/logos/buy-me-a-coffee.svg"
					height="100%"
					width="100%"
				/>
			</svg>
		</a>
	);
};
