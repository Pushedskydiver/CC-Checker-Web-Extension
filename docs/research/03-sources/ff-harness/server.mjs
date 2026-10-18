import http from 'node:http';
const page = `<!doctype html><html><head><meta charset="utf-8"><title>CC probe page</title>
<style>html,body{margin:0;background:#0000ff}#red{position:fixed;top:0;left:0;width:200px;height:200px;background:#ff0000}</style></head>
<body><div id="red"></div><p style="position:fixed;top:220px;left:10px;color:#fff">probe page</p></body></html>`;
http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(page); }).listen(8765, '127.0.0.1', () => console.log('listening 8765'));
