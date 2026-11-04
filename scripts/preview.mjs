import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.argv[2] || 4173);
const html = await readFile(new URL('../dist/index.html', import.meta.url));
createServer((req, res) => {
  if (new URL(req.url, 'http://localhost').pathname.endsWith('/') || new URL(req.url, 'http://localhost').pathname.endsWith('/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html);
  } else { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}/ (Ctrl+C to stop)`));
