import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const app = document.createElement('main');
const body = document.body;

body.appendChild(app);

render(<App />, app);
