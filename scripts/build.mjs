import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
if (!source.includes('<canvas') || !source.includes('requestAnimationFrame(loop)')) throw new Error('Game source is incomplete');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), source);
console.log(`Exported dist/index.html (${Buffer.byteLength(source)} bytes). SHA256 ${createHash('sha256').update(source).digest('hex')}`);
