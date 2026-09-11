import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

const container = document.getElementById('app');

if (!container) {
	throw new Error('CC Checker: #app root element is missing');
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
