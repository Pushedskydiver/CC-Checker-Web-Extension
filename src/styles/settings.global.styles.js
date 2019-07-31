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
  }

  .cc-checker {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font);
    font-variation-settings: 'wght' ${typography.weight.regular};
    line-height: ${typography.lineHeight.body};
    box-shadow: 0 2px 12px 15px rgba(0, 0, 0, 0.075);
    transition: background-color 0.3s ease-in-out;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;

    ${maxWidth('992', () => css`
      display: none;
    `)}
  }

  .cc-checker h1,
  .cc-checker h2,
  .cc-checker p {
    margin-top: 0;
    margin-bottom: ${spacing.margin}px;
  }

  .cc-checker button {
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-family: inherit;
    cursor: pointer;
    appearance: none;
  }

  .cc-checker input,
  .cc-checker select {
    font-family: inherit;
    appearance: none;
  }
`;

export default GlobalStyles;
