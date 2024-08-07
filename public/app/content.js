let scrollStopDelay = null;
let keyValue = null;

const dpr = window.devicePixelRatio || 1;
const image = new Image();

const css = `
  body {
    padding-bottom: 475px !important;
    height: auto !important;
  }

  .cc__iframe {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 475px;
    border: none;
    transform: translateY(0);
    z-index: 2147483647;
  }

  .cc-canvas__wrapper {
    display: none;
    position: absolute;
    width: 64px;
    height: 64px;
    transform: translate3d(0px, 0px, 0px) translateY(0) !important;
    border: 2px solid #dddddd;
    border-image: initial;
    border-radius: 1e+07px;
    overflow: hidden;
    z-index: 999999999;
  }

  .cc-canvas__wrapper::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    width: 80px;
    height: 80px;
    background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100% 100%" xmlns="http://www.w3.org/2000/svg"> <defs> <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse"> <path d="M 10 0 L 0 0 0 10" fill="none" stroke="black" stroke-width="0.5" /> </pattern> </defs> <svg x="0" y="0"> <rect width="100%" height="100%" fill="url(%23smallGrid)" /> </svg> <svg x="-10" y="-10"> <rect x="50%" y="50%" width="10" height="10" fill="none" stroke="red" stroke-width="1" /> </svg> </svg>');
    z-index: 999999999;
  }

  .cc-canvas {
    position: absolute;
    top: -4px;
    left: -4px;
    width: 80px;
    height: 80px;
    image-rendering: pixelated;
  }
`;

function getColorData(e) {
	const key = keyValue;
	const canvas = e.target.querySelector('[data-cc-canvas]');
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	const data = ctx.getImageData(3, 3, 1, 1).data;
	const rgb = [data[0], data[1], data[2]];

	e.target.removeEventListener(e.type, (f) => getColorData(f.key));

	chrome.runtime.sendMessage({
		type: 'colorPicked',
		key,
		rgb,
	});
}

function setCanvasData(e) {
	const canvasWrapper = document.querySelector('[data-cc-canvas-wrapper]');
	const canvas = canvasWrapper.querySelector('[data-cc-canvas]');
	const ctx = canvas.getContext('2d', { willReadFrequently: true });

	const r = e.clientX * dpr - 8;
	const o = e.clientY * dpr - 8;
	const f = e.pageY - 40;
	const c = e.pageX - 40;

	ctx.drawImage(image, r, o, 8, 8, 0, 0, 8, 8);

	canvasWrapper.style.top = `${f}px`;
	canvasWrapper.style.left = `${c}px`;
}

function updateScreenShot() {
	const canvasWrapper = document.querySelector('[data-cc-canvas-wrapper]');

	canvasWrapper.style.display = 'none';

	const delayScreenshot = setTimeout(() => {
		chrome.runtime.sendMessage({ type: 'updateScreenShot' });

		clearTimeout(delayScreenshot);
	}, 66);
}

function scrollStop() {
	clearTimeout(scrollStopDelay);

	scrollStopDelay = setTimeout(() => {
		updateScreenShot();
	}, 66);
}

function closeColorPicker() {
	const canvasWrapper = document.querySelector('[data-cc-canvas-wrapper]');

	canvasWrapper.style.display = 'none';

	window.removeEventListener('resize', scrollStop);
	window.removeEventListener('scroll', scrollStop);

	document.body.removeEventListener('mousemove', setCanvasData);
	document.body.style.cursor = 'auto';

	canvasWrapper.removeEventListener('click', getColorData);
}

function getScreenshot({ key, data }) {
	const canvasWrapper = document.querySelector('[data-cc-canvas-wrapper]');

	keyValue = key;
	image.src = data;
	canvasWrapper.style.display = 'block';
	document.body.style.cursor = 'none';

	window.addEventListener('resize', scrollStop);
	window.addEventListener('scroll', scrollStop);
	document.body.addEventListener('mousemove', setCanvasData);
	canvasWrapper.addEventListener('click', getColorData);
}

function updateImage({ data }) {
	const canvasWrapper = document.querySelector('[data-cc-canvas-wrapper]');

	canvasWrapper.style.display = 'block';
	image.src = data;
}

function addIframe() {
	const iframe = document.createElement('iframe');

	iframe.setAttribute('data-cc-checker', '');
	iframe.setAttribute('referrerpolicy', 'no-referrer');
	iframe.className = 'cc__iframe';
	iframe.title = 'Colour contrast checker browser extension';
	iframe.src = chrome.runtime.getURL('index.html');

	document.body.appendChild(iframe);
}

function addCanvas() {
	const style = document.createElement('style');
	const canvasWrapper = document.createElement('div');
	const canvas = document.createElement('canvas');

	style.ty = 'text/css';
	style.setAttribute('data-cc-styles', '');
	style.appendChild(document.createTextNode(css));

	canvasWrapper.className = 'cc-canvas__wrapper';
	canvasWrapper.setAttribute('data-cc-canvas-wrapper', '');

	canvas.setAttribute('data-cc-canvas', '');
	canvas.className = 'cc-canvas';
	canvas.width = 8;
	canvas.height = 8;

	canvasWrapper.appendChild(canvas);

	document.body.appendChild(style);
	document.body.appendChild(canvasWrapper);
}

function initChecker() {
	const checker = document.querySelector('[data-cc-checker]');

	if (checker !== null) return;

	addIframe();
	addCanvas();
}

function closeChecker() {
	const checker = document.querySelector('[data-cc-checker]');
	const canvasWrapper = document.querySelector('[data-cc-canvas-wrapper]');
	const styles = document.querySelector('[data-cc-styles]');

	document.body.setAttribute('style', 'cursor: auto;');

	canvasWrapper.style.display = 'none';

	checker.remove();
	styles.remove();
}

chrome.runtime.onMessage.addListener((r) => {
	switch (r.type) {
		case 'closeColorPicker':
			closeColorPicker();
			break;

		case 'getScreenshot':
			getScreenshot(r);
			break;

		case 'updateScreenShot':
			updateImage(r);
			break;

		case 'initChecker':
			initChecker();
			break;

		case 'closeChecker':
			closeChecker();
			break;

		default:
	}
});
