import React from 'react';
import GlobalStyles from '../styles/settings.global.styles';
import { Container } from '../styles/generic.container.styles';
import { Span } from './01-Atoms/Heading/Heading.styles';
import Ratio from './01-Atoms/Ratio/Ratio';
// import Label from '../components/01-Atoms/Label/Label.styles';
import Input from './01-Atoms/Input/Input';
import Header from './02-Molecules/Header/Header';
import { BlockSection, BlockDiv } from './02-Molecules/Block/Block.styles';
import Controls from './02-Molecules/Controls/Controls';
import Footer from './02-Molecules/Footer/Footer';
import Options from './02-Molecules/Options/Options';
import Grid from './03-Organisms/Grid/Grid.styles';
import Wcag from './03-Organisms/Wcag/Wcag';
import { ContextProvider } from './Context';

function App() {
  return (
    <ContextProvider>
      <GlobalStyles />

      <Container>
        <Grid columns="3fr 2fr 2fr" gap={50} noMargin>
          <BlockDiv noMargin>
            <Header />

            <BlockSection noMargin>
              <Span aria-hidden="true" grade noMargin>Aa</Span>
              <Ratio />

              <Wcag id="grades" />
            </BlockSection>
          </BlockDiv>

          <BlockDiv noMargin>
            {/* <Label medium htmlFor="background">Background Colour</Label> */}
            <Input id="background" name="background" />

            <Controls id="background" name="background" />
          </BlockDiv>

          <BlockDiv noMargin>
            {/* <Label medium htmlFor="foreground">Foreground Colour</Label> */}
            <Input id="foreground" name="foreground" />

            <Controls id="foreground" name="foreground" />
          </BlockDiv>
        </Grid>

        <Footer />

        <Options />
      </Container>
    </ContextProvider>
  );
}

export default App;
