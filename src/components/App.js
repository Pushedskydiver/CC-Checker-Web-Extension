import React, { Component } from 'react';
import GlobalStyles from '../styles/settings.global.styles';
import { Container } from '../styles/generic.container.styles';
import Header from '../components/02-Molecules/Header/Header';
import { isDark, hslToHex } from '../components/Utils';

class App extends Component {
  state = {
    background: [49.73, 1, 0.71],
    foreground: [NaN, 0, 0.133],
    contrast: 12.72,
    level: { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' },
  };

  render() {
    const { background, foreground, contrast } = this.state;
    const colorState =
      contrast < 3
        ? isDark(background)
          ? '#ffffff'
          : '#222222'
        : hslToHex(foreground);

    return (
      <Container>
        <GlobalStyles />
        <Header colorState={colorState} />
      </Container>
    );
  }
}

export default App;
