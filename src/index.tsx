import { createRoot } from 'react-dom/client';
import App from './components/App';

const container = document.getElementById('main');
const root = createRoot(container!);

root.render(<App />);
