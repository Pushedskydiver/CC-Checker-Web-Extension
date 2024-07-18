import styles from './current-color-swatch.module.css';

export const CurrentColorSwatch: React.FC = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="80"
		height="49"
		fill="none"
		viewBox="0 0 65 40"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
	>
		<svg width="100%" height="100%" fill="none" viewBox="0 0 65 40">
			<path
				fill="#fff"
				fillRule="evenodd"
				d="M32.5 35.2483C29.0584 38.2069 24.5774 40 19.6774 40 8.8099 40 0 31.1901 0 20.3226 0 9.455 8.8099.6451 19.6774.6451c4.9 0 9.381 1.7931 12.8226 4.7517C35.9416 2.4382 40.4226.6451 45.3226.6451 56.1901.6451 65 9.4551 65 20.3226 65 31.1901 56.1901 40 45.3226 40c-4.9 0-9.381-1.7931-12.8226-4.7517Zm-2.7576-2.9054C27.0192 34.6256 23.5088 36 19.6774 36 11.019 36 4 28.981 4 20.3226S11.019 4.6451 19.6774 4.6451c3.8314 0 7.3418 1.3744 10.065 3.6571A15.769 15.769 0 0 1 32.5 11.3001a15.7657 15.7657 0 0 1 2.7576-2.9979c2.7232-2.2827 6.2336-3.657 10.065-3.657C53.981 4.6451 61 11.6641 61 20.3225S53.981 36 45.3226 36c-3.8314 0-7.3418-1.3744-10.065-3.6571A15.763 15.763 0 0 1 32.5 29.345a15.7663 15.7663 0 0 1-2.7576 2.9979Z"
				clipRule="evenodd"
			/>
		</svg>

		<svg width="32" height="32" x="4" y="4" fill="none" viewBox="0 0 32 32">
			<path
				fill="var(--background-color)"
				d="M31.3548 16.3226C31.3548 24.981 24.3358 32 15.6774 32S0 24.981 0 16.3226 7.019.6451 15.6774.6451s15.6774 7.019 15.6774 15.6775Z"
			/>

			<text
				x="50%"
				y="65%"
				fill="var(--foreground-color)"
				textAnchor="middle"
				className={styles.text}
			>
				BG
			</text>
		</svg>

		<svg
			width="32"
			height="32"
			x="calc(100% - 35.35px)"
			y="4"
			fill="none"
			viewBox="0 0 32 32"
		>
			<path
				fill="var(--foreground-color)"
				d="M31.3548 16.3226C31.3548 24.981 24.3358 32 15.6774 32S0 24.981 0 16.3226 7.019.6451 15.6774.6451s15.6774 7.019 15.6774 15.6775Z"
			/>

			<text
				x="50%"
				y="65%"
				fill="var(--background-color)"
				textAnchor="middle"
				className={styles.text}
			>
				FG
			</text>
		</svg>
	</svg>
);
