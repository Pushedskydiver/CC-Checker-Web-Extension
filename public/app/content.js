// Content script. Injects the checker UI (an extension page in a fixed iframe at
// the bottom of the viewport) and implements the eyedropper loupe over a
// screenshot of the visible tab supplied by the service worker.

const IFRAME_HEIGHT = 475;
const LOUPE_SIZE = 8; // sampled pixels per side

let scrollStopDelay = null;
let keyValue = null;

const image = new Image();

const css = `
  body {
    padding-bottom: ${IFRAME_HEIGHT}px !important;
    height: auto !important;
  }

  .cc__iframe {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${IFRAME_HEIGHT}px;
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

const getCanvasWrapper = () => document.querySelector('[data-cc-canvas-wrapper]');

function getColorData(e) {
	const canvas = e.currentTarget.querySelector('[data-cc-canvas]');
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	const data = ctx.getImageData(3, 3, 1, 1).data;
	const rgb = [data[0], data[1], data[2]];

	chrome.runtime.sendMessage({
		type: 'colorPicked',
		key: keyValue,
		rgb,
	});
}

function setCanvasData(e) {
	const canvasWrapper = getCanvasWrapper();

	if (!canvasWrapper) return;

	const canvas = canvasWrapper.querySelector('[data-cc-canvas]');
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	// Read on every move: the page zoom (and so the screenshot scale) can change
	// after this script was loaded.
	const dpr = window.devicePixelRatio || 1;

	const sourceX = e.clientX * dpr - LOUPE_SIZE;
	const sourceY = e.clientY * dpr - LOUPE_SIZE;

	ctx.drawImage(image, sourceX, sourceY, LOUPE_SIZE, LOUPE_SIZE, 0, 0, LOUPE_SIZE, LOUPE_SIZE);

	canvasWrapper.style.top = `${e.pageY - 40}px`;
	canvasWrapper.style.left = `${e.pageX - 40}px`;
}

function updateScreenShot() {
	const canvasWrapper = getCanvasWrapper();

	if (canvasWrapper) canvasWrapper.style.display = 'none';

	setTimeout(() => {
		chrome.runtime.sendMessage({ type: 'updateScreenShot' });
	}, 66);
}

function scrollStop() {
	clearTimeout(scrollStopDelay);

	scrollStopDelay = setTimeout(updateScreenShot, 66);
}

function closeColorPicker() {
	const canvasWrapper = getCanvasWrapper();

	clearTimeout(scrollStopDelay);

	window.removeEventListener('resize', scrollStop);
	window.removeEventListener('scroll', scrollStop);

	document.body.removeEventListener('mousemove', setCanvasData);
	document.body.style.cursor = 'auto';

	if (!canvasWrapper) return;

	canvasWrapper.style.display = 'none';
	canvasWrapper.removeEventListener('click', getColorData);
}

function getScreenshot({ key, data }) {
	const canvasWrapper = getCanvasWrapper();

	if (!canvasWrapper) return;

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
	const canvasWrapper = getCanvasWrapper();

	if (!canvasWrapper) return;

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

	style.setAttribute('data-cc-styles', '');
	style.appendChild(document.createTextNode(css));

	canvasWrapper.className = 'cc-canvas__wrapper';
	canvasWrapper.setAttribute('data-cc-canvas-wrapper', '');

	canvas.setAttribute('data-cc-canvas', '');
	canvas.className = 'cc-canvas';
	canvas.width = LOUPE_SIZE;
	canvas.height = LOUPE_SIZE;

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
	// Tear the picker down first so no listener or pending screenshot can bring
	// the loupe back after the UI has gone.
	closeColorPicker();

	const checker = document.querySelector('[data-cc-checker]');
	const canvasWrapper = getCanvasWrapper();
	const styles = document.querySelector('[data-cc-styles]');

	if (canvasWrapper) canvasWrapper.remove();
	if (checker) checker.remove();
	if (styles) styles.remove();
}

// Only the top-level document hosts the checker. The service worker addresses
// the tab, not a frame, so every frame receives these messages.
if (window.self === window.top) {
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
}
