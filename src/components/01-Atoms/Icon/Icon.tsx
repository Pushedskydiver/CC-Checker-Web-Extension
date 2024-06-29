import clsx from 'clsx';

import styles from './icon.module.css';

export type TIconName =
  | 'clipboard'
  | 'tick'
  | 'cross'
  | 'eyedropper'
  | 'swap'
  | 'share'

export type TIcon = {
  size?: number;
  className?: string;
}

export const Clipboard: React.FC<TIcon> = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={ size ? size : '24'}
    height={size ? size : '24'}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    pointerEvents="none"
    className={clsx(styles.icon, className)}
  >
    <path fill="currentColor" fillRule="nonzero" d="M3.429 19.2h6.857v1.6H3.429v-1.6zM12 9.6H3.429v1.6H12V9.6zm3.429 4.8v-3.2L10.286 16l5.143 4.8v-3.2H24v-3.2h-8.571zm-7.715-1.6H3.43v1.6h4.285v-1.6zM3.43 17.6h4.285V16H3.43v1.6zm15.428 1.6h1.714v3.2c-.034.448-.188.832-.514 1.12-.326.288-.72.448-1.2.48H1.714C.771 24 0 23.28 0 22.4V4.8c0-.88.771-1.6 1.714-1.6h5.143c0-1.776 1.526-3.2 3.429-3.2 1.903 0 3.428 1.424 3.428 3.2h5.143c.943 0 1.714.72 1.714 1.6v8h-1.714V8H1.714v14.4h17.143v-3.2zM3.43 6.4h13.714c0-.88-.772-1.6-1.714-1.6h-1.715C12.771 4.8 12 4.08 12 3.2c0-.88-.771-1.6-1.714-1.6S8.57 2.32 8.57 3.2c0 .88-.771 1.6-1.714 1.6H5.143c-.943 0-1.714.72-1.714 1.6z" />
  </svg>
)

export const Tick: React.FC<TIcon> = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ? size : '24'}
    height={size ? size : '24'}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    pointerEvents="none"
    className={clsx(styles.icon, className)}
  >
    <path fill="currentColor" d="M9 16.172 19.594 5.578 21 6.984l-12 12-5.578-5.578L4.828 12z" />
  </svg>
);

export const Cross: React.FC<TIcon> = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ? size : '24'}
    height={size ? size : '24'}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    pointerEvents="none"
    className={clsx(styles.icon, className)}
  >
    <path fill="currentColor" d="M18.984 6.422 13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z" />
  </svg>
);

export const Eyedropper: React.FC<TIcon> = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ? size : '24'}
    height={size ? size : '24'}
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
    pointerEvents="none"
    className={clsx(styles.icon, className)}
  >
    <path fill="currentColor" d="M30.828 1.172a4 4 0 0 0-5.657 0l-5.379 5.379-3.793-3.793-4.243 4.243 3.326 3.326L.328 25.081a1.123 1.123 0 0 0-.322.921h-.008v5a1 1 0 0 0 1 1h5.125c.288 0 .576-.11.795-.329l14.754-14.754 3.326 3.326 4.243-4.243-3.793-3.793 5.379-5.379a4 4 0 0 0 0-5.657zM5.409 30H2v-3.409l14.674-14.674 3.409 3.409L5.409 30z" />
  </svg>
);

export const Swap: React.FC<TIcon> = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ? size : '24'}
    height={size ? size : '24'}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    pointerEvents="none"
    className={clsx(styles.icon, className)}
  >
    <path fill="currentColor" d="M9 3l3.984 3.984h-3v7.031H8.015V6.984h-3zm6.984 14.016h3L15 21l-3.984-3.984h3V9.985h1.969v7.031z" />
  </svg>
);

export const Share: React.FC<TIcon> = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ? size : '24'}
    height={size ? size : '24'}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    pointerEvents="none"
    className={clsx(styles.icon, className)}
  >
    <path fill="currentColor" d="M15.984 5.016l-1.406 1.406-1.594-1.594v11.156h-1.969v-11.156l-1.594 1.594-1.406-1.406 3.984-4.031zM20.016 9.984v11.016q0 0.844-0.586 1.43t-1.43 0.586h-12q-0.844 0-1.43-0.586t-0.586-1.43v-11.016q0-0.797 0.586-1.383t1.43-0.586h3v1.969h-3v11.016h12v-11.016h-3v-1.969h3q0.844 0 1.43 0.586t0.586 1.383z"></path>
  </svg>
);
