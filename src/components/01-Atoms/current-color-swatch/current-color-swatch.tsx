import styles from './current-color-swatch.module.css';

export const CurrentColorSwatch: React.FC = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="80"
		height="52"
		fill="none"
		viewBox="0 0 61 40"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
	>
		<svg width="100%" height="100%" fill="none" viewBox="0 0 61 40">
			<path
				fill="#fff"
				fillRule="evenodd"
				d="M30.5 36.7583C27.3955 38.8058 23.6735 40 19.6774 40 8.8099 40 0 31.1901 0 20.3226 0 9.455 8.8099.6451 19.6774.6451c3.9961 0 7.7181 1.1943 10.8226 3.2417C33.6045 1.8394 37.3265.645 41.3226.645 52.1901.6451 61 9.4551 61 20.3226 61 31.1901 52.1901 40 41.3226 40c-3.9961 0-7.7181-1.1942-10.8226-3.2417Zm0-5.0932C27.6861 34.3508 23.8744 36 19.6774 36 11.019 36 4 28.981 4 20.3226S11.019 4.6451 19.6774 4.6451c4.197 0 8.0087 1.6492 10.8226 4.3349 2.8139-2.6857 6.6256-4.3349 10.8226-4.3349C49.981 4.6451 57 11.6642 57 20.3226S49.981 36 41.3226 36c-4.197 0-8.0087-1.6492-10.8226-4.3349Z"
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
