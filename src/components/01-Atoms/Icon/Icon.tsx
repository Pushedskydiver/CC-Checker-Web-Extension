import IconStyles from './Icon.styles';
import { useColourContrast } from '../../Context';

export interface MarkProps {
  mark: string
}

export interface MoveProps {
  expand: boolean
}

export function GitHub() {
  const { colorState } = useColourContrast();

  return (
    <IconStyles
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      pointer-events="none"
    >
      <path fill={colorState} d="M16 .395c-8.836 0-16 7.163-16 16 0 7.069 4.585 13.067 10.942 15.182.8.148 1.094-.347 1.094-.77 0-.381-.015-1.642-.022-2.979-4.452.968-5.391-1.888-5.391-1.888-.728-1.849-1.776-2.341-1.776-2.341-1.452-.993.11-.973.11-.973 1.606.113 2.452 1.649 2.452 1.649 1.427 2.446 3.743 1.739 4.656 1.33.143-1.034.558-1.74 1.016-2.14-3.554-.404-7.29-1.777-7.29-7.907 0-1.747.625-3.174 1.649-4.295-.166-.403-.714-2.03.155-4.234 0 0 1.344-.43 4.401 1.64a15.353 15.353 0 0 1 4.005-.539c1.359.006 2.729.184 4.008.539 3.054-2.07 4.395-1.64 4.395-1.64.871 2.204.323 3.831.157 4.234 1.026 1.12 1.647 2.548 1.647 4.295 0 6.145-3.743 7.498-7.306 7.895.574.497 1.085 1.47 1.085 2.963 0 2.141-.019 3.864-.019 4.391 0 .426.288.925 1.099.768C27.421 29.457 32 23.462 32 16.395c0-8.837-7.164-16-16-16z" />
    </IconStyles>
  );
}

export function Twitter() {
  const { colorState } = useColourContrast();

  return (
    <IconStyles
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      pointer-events="none"
    >
      <path fill={colorState} d="M32 7.075a12.941 12.941 0 0 1-3.769 1.031 6.601 6.601 0 0 0 2.887-3.631 13.21 13.21 0 0 1-4.169 1.594A6.565 6.565 0 0 0 22.155 4a6.563 6.563 0 0 0-6.563 6.563c0 .512.056 1.012.169 1.494A18.635 18.635 0 0 1 2.23 5.195a6.56 6.56 0 0 0-.887 3.3 6.557 6.557 0 0 0 2.919 5.463 6.565 6.565 0 0 1-2.975-.819v.081a6.565 6.565 0 0 0 5.269 6.437 6.574 6.574 0 0 1-2.968.112 6.588 6.588 0 0 0 6.131 4.563 13.17 13.17 0 0 1-9.725 2.719 18.568 18.568 0 0 0 10.069 2.95c12.075 0 18.681-10.006 18.681-18.681 0-.287-.006-.569-.019-.85A13.216 13.216 0 0 0 32 7.076z" />
    </IconStyles>
  );
}

export function Clipboard() {
  const { colorState } = useColourContrast();

  return (
    <IconStyles
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      pointer-events="none"
    >
      <path fill={colorState} fillRule="nonzero" d="M3.429 19.2h6.857v1.6H3.429v-1.6zM12 9.6H3.429v1.6H12V9.6zm3.429 4.8v-3.2L10.286 16l5.143 4.8v-3.2H24v-3.2h-8.571zm-7.715-1.6H3.43v1.6h4.285v-1.6zM3.43 17.6h4.285V16H3.43v1.6zm15.428 1.6h1.714v3.2c-.034.448-.188.832-.514 1.12-.326.288-.72.448-1.2.48H1.714C.771 24 0 23.28 0 22.4V4.8c0-.88.771-1.6 1.714-1.6h5.143c0-1.776 1.526-3.2 3.429-3.2 1.903 0 3.428 1.424 3.428 3.2h5.143c.943 0 1.714.72 1.714 1.6v8h-1.714V8H1.714v14.4h17.143v-3.2zM3.43 6.4h13.714c0-.88-.772-1.6-1.714-1.6h-1.715C12.771 4.8 12 4.08 12 3.2c0-.88-.771-1.6-1.714-1.6S8.57 2.32 8.57 3.2c0 .88-.771 1.6-1.714 1.6H5.143c-.943 0-1.714.72-1.714 1.6z" />
    </IconStyles>
  );
}

export const Mark = (props: MarkProps) => (
  <IconStyles
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    pointer-events="none"
  >
    {props.mark === 'Pass' ? <path fill="currentColor" d="M9 16.172L19.594 5.578 21 6.984l-12 12-5.578-5.578L4.828 12z" /> : <path fill="currentColor" d="M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z" />}
  </IconStyles>
);

export const Eyedropper = () => (
  <IconStyles
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 32 32"
    pointer-events="none"
    colorPicker
  >
    <path fill="currentColor" d="M30.828 1.172a4 4 0 0 0-5.657 0l-5.379 5.379-3.793-3.793-4.243 4.243 3.326 3.326L.328 25.081a1.123 1.123 0 0 0-.322.921h-.008v5a1 1 0 0 0 1 1h5.125c.288 0 .576-.11.795-.329l14.754-14.754 3.326 3.326 4.243-4.243-3.793-3.793 5.379-5.379a4 4 0 0 0 0-5.657zM5.409 30H2v-3.409l14.674-14.674 3.409 3.409L5.409 30z" />
  </IconStyles>
);

export const Close = () => (
  <IconStyles
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    pointer-events="none"
  >
    <path fill="currentColor" d="M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z" />
  </IconStyles>
);

export const Move = (props: MoveProps) => (
  <IconStyles
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 32 32"
    pointer-events="none"
  >
    {props.expand ? <path fill="currentColor" d="M24 22V10h-2v12h-5l6 6 6-6zM10 8v6H4V8h6zm2-2H2v10h10V6zM2 20h3v2H2v-2zM6 20h3v2H6v-2zM10 20h2v3h-2v-3zM2 27h2v3H2v-3zM5 28h3v2H5v-2zM9 28h3v2H9v-2zM2 23h2v3H2v-3zM10 24h2v3h-2v-3z" /> : <path fill="currentColor" d="M22 16v12h2V16h5l-6-6-6 6zM2 6h3v2H2V6zM6 6h3v2H6V6zM10 6h2v3h-2V6zM2 13h2v3H2v-3zM5 14h3v2H5v-2zM9 14h3v2H9v-2zM2 9h2v3H2V9zM10 10h2v3h-2v-3zM10 22v6H4v-6h6zm2-2H2v10h10V20z" />}
  </IconStyles>
);

export const Swap = () => (
  <IconStyles
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    pointer-events="none"
  >
    <path fill="currentColor" d="M9 3l3.984 3.984h-3v7.031H8.015V6.984h-3zm6.984 14.016h3L15 21l-3.984-3.984h3V9.985h1.969v7.031z" />
  </IconStyles>
);

export const Share = () => (
  <IconStyles
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    pointer-events="none"
  >
    <path fill="currentColor" d="M15.984 5.016l-1.406 1.406-1.594-1.594v11.156h-1.969v-11.156l-1.594 1.594-1.406-1.406 3.984-4.031zM20.016 9.984v11.016q0 0.844-0.586 1.43t-1.43 0.586h-12q-0.844 0-1.43-0.586t-0.586-1.43v-11.016q0-0.797 0.586-1.383t1.43-0.586h3v1.969h-3v11.016h12v-11.016h-3v-1.969h3q0.844 0 1.43 0.586t0.586 1.383z"></path>
  </IconStyles>
);
