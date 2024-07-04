import ColourContrastProvider from '../context';
import { Header } from './02-molecules/header/header';
import { ColorControls } from './03-organisms/color-controls/color-controls';
import { Footer } from './03-organisms/footer/footer';
import { Score } from './03-organisms/score/score';
import { MainLayout } from './04-layouts/main-layout/main-layout';

import '../styles/globals.css';

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
