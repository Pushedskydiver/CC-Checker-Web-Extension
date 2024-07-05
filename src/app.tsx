import ColourContrastProvider from './context';
import { Header } from './components/02-molecules/header/header';
import { ColorControls } from './components/03-organisms/color-controls/color-controls';
import { Footer } from './components/03-organisms/footer/footer';
import { Score } from './components/03-organisms/score/score';
import { MainLayout } from './components/04-layouts/main-layout/main-layout';

import './styles/globals.css';

const App = (): JSX.Element => (
	<ColourContrastProvider>
		<Header />

		<MainLayout>
			<Score />

			<ColorControls />
		</MainLayout>

		<Footer />
	</ColourContrastProvider>
);

export default App;
