import { css, createGlobalStyle } from 'styled-components';
import { colors } from './settings.colors.styles';
import { typography } from './settings.typography.styles';
import { maxWidth } from './settings.breakpoints.styles';
import spacing from './settings.spacing.styles';

const GlobalStyles = createGlobalStyle`
  :root {
    --background: ${colors.core};
    --foreground: ${colors.dark};
    --font: ${typography.family};
    --copy: inherit;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    color: inherit;
    font-weight: normal;
  }

  html,
  body {
    position: relative;
    height: 100%;
  }

  html {
    font-size: 16px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    font-family: var(--font);
    font-variation-settings: 'wght' ${typography.weight.regular};
    line-height: ${typography.lineHeight.body};
    transition: background-color 0.3s ease-in-out;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;

    ${maxWidth(992, () => css`
      display: none;
    `)}
  }

  body ::-moz-selection {
    background: var(--foreground);
    color: var(--background);
  }

  body ::selection {
    background: var(--foreground);
    color: var(--background);
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    opacity: 0;
  }

  h1,
  h2,
  p {
    margin-top: 0;
    margin-bottom: ${spacing.margin}px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  main {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background);
    color: var(--foreground);
    box-shadow: 0 2px 12px 15px rgba(0, 0, 0, 0.075);
    transition: background-color 0.3s ease-in-out 0s;
  }

  button {
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-family: inherit;
    cursor: pointer;
    appearance: none;
  }

  input,
  select {
    font-family: inherit;
    appearance: none;
  }
`;

export default GlobalStyles;
