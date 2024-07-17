import clsx from 'clsx';

import styles from './icon.module.css';

export type TIconName =
	| 'clipboard'
	| 'tick'
	| 'cross'
	| 'eyedropper'
	| 'swap'
	| 'share';

export type TIcon = {
	size?: number;
	className?: string;
};

export const Bin: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.25 2.25a1 1 0 0 1 1-1h7.5a1 1 0 1 1 0 2h-7.5a1 1 0 0 1-1-1Zm-4.5 3a1 1 0 0 1 1-1h16.5a1 1 0 1 1 0 2h-.5V19.5A1.75 1.75 0 0 1 18 21.25H6a1.75 1.75 0 0 1-1.75-1.75V6.25h-.5a1 1 0 0 1-1-1Zm3.5 1v13h11.5v-13H6.25Z"
		/>
	</svg>
);

export const Clipboard: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3.429 19.2h6.857v1.6H3.429v-1.6zM12 9.6H3.429v1.6H12V9.6zm3.429 4.8v-3.2L10.286 16l5.143 4.8v-3.2H24v-3.2h-8.571zm-7.715-1.6H3.43v1.6h4.285v-1.6zM3.43 17.6h4.285V16H3.43v1.6zm15.428 1.6h1.714v3.2c-.034.448-.188.832-.514 1.12-.326.288-.72.448-1.2.48H1.714C.771 24 0 23.28 0 22.4V4.8c0-.88.771-1.6 1.714-1.6h5.143c0-1.776 1.526-3.2 3.429-3.2 1.903 0 3.428 1.424 3.428 3.2h5.143c.943 0 1.714.72 1.714 1.6v8h-1.714V8H1.714v14.4h17.143v-3.2zM3.43 6.4h13.714c0-.88-.772-1.6-1.714-1.6h-1.715C12.771 4.8 12 4.08 12 3.2c0-.88-.771-1.6-1.714-1.6S8.57 2.32 8.57 3.2c0 .88-.771 1.6-1.714 1.6H5.143c-.943 0-1.714.72-1.714 1.6z"
		/>
	</svg>
);

export const Tick: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9 16.172 19.594 5.578 21 6.984l-12 12-5.578-5.578L4.828 12z"
		/>
	</svg>
);

export const Cross: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M18.984 6.422 13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z"
		/>
	</svg>
);

export const Eyedropper: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 32 32"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M30.828 1.172a4 4 0 0 0-5.657 0l-5.379 5.379-3.793-3.793-4.243 4.243 3.326 3.326L.328 25.081a1.123 1.123 0 0 0-.322.921h-.008v5a1 1 0 0 0 1 1h5.125c.288 0 .576-.11.795-.329l14.754-14.754 3.326 3.326 4.243-4.243-3.793-3.793 5.379-5.379a4 4 0 0 0 0-5.657zM5.409 30H2v-3.409l14.674-14.674 3.409 3.409L5.409 30z"
		/>
	</svg>
);

export const Pallette: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19 4.8706c-1.92-1.88-4.42-2.9-7.1-2.87-2.65.03-5.14 1.08-7 2.97-1.87 1.88-2.9 4.38-2.9 7.03 0 4.14 2.55 7.61 6.67 9.06.35.12.72.18 1.09.18.15 0 .3 0 .44-.03.51-.07 1.01-.27 1.43-.57.42-.3.77-.7 1.01-1.16.24-.46.36-.98.36-1.49 0-.33.13-.65.37-.88.24-.23.55-.37.88-.37h4.33c.73 0 1.45-.25 2.03-.71.57-.46.98-1.1 1.14-1.82.17-.76.26-1.53.25-2.31-.02-2.66-1.09-5.16-3-7.04v.01Zm.8 8.91c-.06.27-.22.52-.44.7-.22.18-.5.27-.78.27h-4.33c-.86 0-1.69.35-2.3.95-.61.61-.95 1.43-.95 2.3 0 .2-.05.4-.14.57-.09.18-.23.33-.39.45-.16.11-.35.19-.55.22-.2.03-.4 0-.59-.06-3.29-1.16-5.33-3.91-5.33-7.18 0-2.12.82-4.12 2.31-5.63 1.49-1.51 3.48-2.35 5.6-2.37h.08c2.1 0 4.08.82 5.6 2.3 1.53 1.5 2.39 3.5 2.4 5.63 0 .62-.06 1.24-.2 1.85h.01Zm-7.8-5.53c.6186 0 1.12-.5014 1.12-1.12 0-.6185-.5014-1.12-1.12-1.12-.6186 0-1.12.5015-1.12 1.12 0 .6186.5014 1.12 1.12 1.12Zm-3.01 1.13c0 .6186-.5014 1.12-1.12 1.12-.6186 0-1.12-.5014-1.12-1.12 0-.6185.5014-1.12 1.12-1.12.6186 0 1.12.5015 1.12 1.12Zm-1.12 6.37c.6186 0 1.12-.5014 1.12-1.12 0-.6185-.5014-1.12-1.12-1.12-.6186 0-1.12.5015-1.12 1.12 0 .6186.5014 1.12 1.12 1.12Zm9.37-6.37c0 .6186-.5014 1.12-1.12 1.12-.6186 0-1.12-.5014-1.12-1.12 0-.6185.5014-1.12 1.12-1.12.6186 0 1.12.5015 1.12 1.12Z"
		/>
	</svg>
);

export const Save: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 20 20"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3.9584 3.9584v12.0833h1.4584v-4.1666a1.4583 1.4583 0 0 1 1.4583-1.4584h6.25a1.4583 1.4583 0 0 1 1.4583 1.4584v4.1666h1.4583V6.5953l-2.6368-2.6369H3.9584Zm3.125 8.125v3.9583h5.8333v-3.9583H7.0834Zm9.1667 5.625h-12.5a1.4583 1.4583 0 0 1-1.4584-1.4583v-12.5a1.4583 1.4583 0 0 1 1.4584-1.4584h9.7414c.3862.0002.757.1536 1.0303.4266l2.7597 2.7597c.273.2733.4267.644.4269 1.0303V16.25a1.4582 1.4582 0 0 1-1.4583 1.4583Zm-8.75-12.9167a.8333.8333 0 1 0 0 1.6667h4.375a.8333.8333 0 0 0 0-1.6666h-4.375Z"
		/>
	</svg>
);

export const Swap: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9 3l3.984 3.984h-3v7.031H8.015V6.984h-3zm6.984 14.016h3L15 21l-3.984-3.984h3V9.985h1.969v7.031z"
		/>
	</svg>
);

export const Share: React.FC<TIcon> = ({ className, size = 24 }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		aria-hidden="true"
		focusable="false"
		pointerEvents="none"
		className={clsx(styles.icon, className)}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M15.984 5.016l-1.406 1.406-1.594-1.594v11.156h-1.969v-11.156l-1.594 1.594-1.406-1.406 3.984-4.031zM20.016 9.984v11.016q0 0.844-0.586 1.43t-1.43 0.586h-12q-0.844 0-1.43-0.586t-0.586-1.43v-11.016q0-0.797 0.586-1.383t1.43-0.586h3v1.969h-3v11.016h12v-11.016h-3v-1.969h3q0.844 0 1.43 0.586t0.586 1.383z"
		></path>
	</svg>
);
