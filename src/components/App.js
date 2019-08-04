import React, { Fragment, PureComponent, memo } from 'react';
import GlobalStyles from '../styles/settings.global.styles';
import { Container } from '../styles/generic.container.styles';
import { Span } from '../components/01-Atoms/Heading/Heading.styles';
import { CloseButton } from '../components/01-Atoms/Button/Button.styles';
import Ratio from '../components/01-Atoms/Ratio/Ratio';
import Label from '../components/01-Atoms/Label/Label.styles';
import Swatch from '../components/01-Atoms/Swatch/Swatch';
import Input from '../components/01-Atoms/Input/Input';
import { Close } from '../components/01-Atoms/Icon/Icon';
import Header from '../components/02-Molecules/Header/Header';
import { BlockSection, BlockDiv } from '../components/02-Molecules/Block/Block.styles';
import Controls from '../components/02-Molecules/Controls/Controls';
import Grid from '../components/03-Organisms/Grid/Grid.styles';
import Wcag from '../components/03-Organisms/Wcag/Wcag';
import { isDark, hslToHex, hexToRgb, hexToHsl, getContrast, getLevel } from '../components/Utils';

class App extends PureComponent {
  colors = localStorage.getItem('colors');
  background = localStorage.getItem('background');
  foreground = localStorage.getItem('foreground');
  contrast = localStorage.getItem('contrast');
  level = localStorage.getItem('level');

  state = {
    colors: JSON.parse(this.colors) || [],
    background: JSON.parse(this.background) || [49.73, 1, 0.71],
    foreground: JSON.parse(this.foreground) || [NaN, 0, 0.133],
    contrast: parseFloat(this.contrast) || 12.72,
    level: JSON.parse(this.level) || { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' }
  };

  checkContrast = (background, foreground) => {
    const backgroundRgb = hexToRgb(background);
    const foregroundRgb = hexToRgb(foreground);
    const contrast = getContrast(backgroundRgb, foregroundRgb);
    const level = getLevel(contrast);

    localStorage.setItem('contrast', contrast);
    localStorage.setItem('level', JSON.stringify(level));

    this.setState({ contrast, level });
  };

  handleContrastCheck = async (value, name) => {
    await this.setState({ [name]: value });
    const { background, foreground } = this.state;

    localStorage.setItem(name, JSON.stringify(value));

    document.body.style.setProperty(`--${name}`, hslToHex(value));
    this.checkContrast(hslToHex(background), hslToHex(foreground));
  };

  updateView = (background, foreground) => {
    const backgroundHex = hslToHex(background);
    const foregroundHex = hslToHex(foreground);

    document.body.style.setProperty('--background', backgroundHex);
    document.body.style.setProperty('--foreground', foregroundHex);

    this.checkContrast(backgroundHex, foregroundHex);
    this.setState({ background, foreground });
  };

  saveColors = () => {
    const colors = JSON.parse(localStorage.getItem('colors')) || [];
    const background = hslToHex(this.state.background);
    const foreground = hslToHex(this.state.foreground);
    const sameColors = colors.filter(color => color.background === background && color.foreground === foreground).length > 0;

    if (colors.length > 0 && sameColors) {
      return;
    }

    if (colors.length > 5) {
      colors.pop();
    }

    colors.unshift({ background, foreground });

    localStorage.setItem('colors', JSON.stringify(colors));
    this.setState({ colors });
  };

  reverseColors = async () => {
    const background = this.state.foreground;
    const foreground = this.state.background;

    localStorage.setItem('background', JSON.stringify(background));
    localStorage.setItem('foreground', JSON.stringify(foreground));

    await this.updateView(background, foreground);
  };

  appendColors = async ({ target }) => {
    const background = hexToHsl(target.getAttribute('data-background'));
    const foreground = hexToHsl(target.getAttribute('data-foreground'));

    localStorage.setItem('background', JSON.stringify(background));
    localStorage.setItem('foreground', JSON.stringify(foreground));

    await this.updateView(background, foreground);
  };

  async componentDidMount() {
    if (localStorage.getItem('contrast') !== null) {
      const { background, foreground } = this.state;

      if (foreground[0] === null) {
        foreground[0] = NaN;
      }

      const backgroundHex = hslToHex(background);
      const foregroundHex = hslToHex(foreground);

      document.body.style.setProperty('--background', backgroundHex);
      document.body.style.setProperty('--foreground', foregroundHex);
    }
  }

  renderSwatch = ({ background, foreground }, index) => (
    <Swatch
      key={index}
      background={background}
      foreground={foreground}
      onClick={this.appendColors}
    />
  );

  render() {
    const { background, foreground, contrast } = this.state;
    const colorState = contrast < 3 ? isDark(background) ? '#ffffff' : '#222222' : hslToHex(foreground);

    if (foreground[0] === null) {
      foreground[0] = NaN;
    }

    return (
      <Fragment>
        <Container>
          <GlobalStyles />

          <CloseButton color={colorState} aria-label="Close Colour Contrast checker">
            <Close />
          </CloseButton>

          <Grid columns="3fr 2fr 2fr" gap={50} noMargin>
            <BlockDiv noMargin>
              <Header colorState={colorState} />

              <BlockSection color={colorState} noMargin>
                <Span grade noMargin>Aa</Span>
                <Ratio contrast={contrast} />

                <Wcag id="grades" colorState={colorState} level={this.state.level} />
              </BlockSection>
            </BlockDiv>

            <BlockDiv color={colorState} noMargin>
              <Label medium htmlFor="background">Background Colour</Label>
              <Input
                value={background}
                id="background"
                name="background"
                color={colorState}
                onChange={this.handleContrastCheck}
              />

              <Controls
                value={background}
                id="background"
                name="background"
                color={colorState}
                onChange={this.handleContrastCheck}
              />
            </BlockDiv>

            <BlockDiv color={colorState} noMargin>
              <Label medium htmlFor="foreground">Foreground Colour</Label>
              <Input
                value={foreground}
                id="foreground"
                name="foreground"
                color={colorState}
                onChange={this.handleContrastCheck}
              />

              <Controls
                value={foreground}
                id="foreground"
                name="foreground"
                color={colorState}
                onChange={this.handleContrastCheck}
              />
            </BlockDiv>
          </Grid>

          {/* <Flex noMargin align="center">
          <Button type="button" color={colorState} onClick={this.reverseColors}>Reverse Colours</Button>
          <Button type="button" color={colorState} onClick={this.saveColors}>Save Colours</Button>

          {colors.map((color, index) => this.renderSwatch(color, index))}
        </Flex> */}
        </Container>
      </Fragment>
    );
  }
}

export default memo(App);
