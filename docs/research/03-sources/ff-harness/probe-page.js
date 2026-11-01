const out = document.getElementById('out');
const show = (o) => { out.textContent = JSON.stringify(o); };
const q = new URLSearchParams(location.search);
window.__probeResult = null;
if (q.get('do') === 'sender') {
	chrome.runtime.sendMessage({ type: 'probe-sender', from: window.self === window.top ? 'top' : 'iframe' }).then(show, (e) => show({ error: String(e) }));
} else if (q.get('do') === 'results') {
	chrome.runtime.sendMessage({ type: 'probe-results' }).then(show, (e) => show({ error: String(e) }));
} else if (q.get('do') === 'ls-set') {
	localStorage.setItem('background', JSON.stringify([200, 50, 50])); localStorage.setItem('foreground', JSON.stringify([0, 0, 10])); localStorage.setItem('colors', JSON.stringify([['#aabbcc', '#112233']]));
	show({ set: true, origin: location.origin });
} else if (q.get('do') === 'ls-get') {
	show({ origin: location.origin, background: localStorage.getItem('background'), foreground: localStorage.getItem('foreground'), colors: localStorage.getItem('colors') });
} else if (q.get('do') === 'msg') { // generic: ?do=msg&type=probe-xxx[&tabId=n] -> the background's reply
	const msg = { type: q.get('type') }; if (q.has('tabId')) msg.tabId = Number(q.get('tabId'));
	chrome.runtime.sendMessage(msg).then(show, (e) => show({ error: String(e) }));
} else if (q.get('do') === 'decode') {
	chrome.runtime.sendMessage({ type: 'probe-results' }).then((r) => {
		const clicks = r.results.clicks || []; const last = clicks[clicks.length - 1];
		if (!last?.captureDataUrl) return show({ error: 'no capture', last });
		const img = new Image(); img.onload = () => {
			const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
			const px = (x, y) => Array.from(ctx.getImageData(x, y, 1, 1).data).slice(0, 3);
			const dpr = Number(q.get('dpr')); const iw = Number(q.get('iw')); const ih = Number(q.get('ih'));
			show({ imgW: img.width, imgH: img.height, innerWidth: iw, innerHeight: ih, dpr, expectedW: iw * dpr, redAt50: px(Math.round(50 * dpr), Math.round(50 * dpr)), blueAt300: px(Math.round(300 * dpr), Math.round(300 * dpr)) });
		}; img.src = last.captureDataUrl;
	});
}
document.getElementById('copy').addEventListener('click', () => {
	const r = { isSecureContext: window.isSecureContext, origin: location.origin, inIframe: window.self !== window.top };
	const range = document.createRange(); range.selectNodeContents(document.getElementById('sel')); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
	try { r.execCommand = document.execCommand('copy'); } catch (e) { r.execCommand = 'threw: ' + e.message; }
	r.writeText = 'pending'; show(r); // shown at once, so a writeText that never settles still reports execCommand
	const p = navigator.clipboard?.writeText?.('WRITETEXT-VALUE');
	Promise.resolve(p).then(() => { r.writeText = 'resolved'; show(r); }, (e) => { r.writeText = 'rejected: ' + e.name + ': ' + e.message; show(r); });
	if (!p) { r.writeText = 'no clipboard API'; show(r); }
});
