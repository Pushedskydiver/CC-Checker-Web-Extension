// /*global chrome*/

import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

const app = document.createElement('main');
const body = document.body;

app.className = 'cc-checker';
body.appendChild(app);

// function toggle() {
//   if (app.style.display === 'none') {
//     app.style.display = 'block';
//   } else {
//     app.style.display = 'none';
//   }
// }

render(<App />, app);

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.message === 'clicked_browser_action') {
//     toggle();
//   }
// });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
