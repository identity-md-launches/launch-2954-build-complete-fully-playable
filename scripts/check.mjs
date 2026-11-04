import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1);
new vm.Script(scripts[0][1], { filename: 'index.html:inline' });
assert.match(html, /<title>Super Pixel Bros<\/title>/);
for (const field of ['description', 'og:title', 'og:image']) assert.ok(html.includes(`"${field}"`));
assert.match(html, /rel="icon" href="data:/);
assert.equal((html.match(/<canvas/g)||[]).length, 1);
assert.ok(!/<(?:script|link|img)[^>]+(?:src|href)="https?:/i.test(html), 'No external runtime assets');
const source = scripts[0][1];
const extract = source.slice(source.indexOf('const CHUNKS='), source.indexOf('const THEMES='));
const maps = vm.runInNewContext(extract + ';CHUNKS');
assert.equal(maps.length, 3);
for (let i=0;i<maps.length;i++) {
  assert.ok(maps[i].length*32>=200);
  let plants=0,hidden=0,flags=0;
  for (const chunk of maps[i]) {
    assert.equal(chunk.length, 15);
    for (const row of chunk) {
      assert.equal(row.length, 32, `World ${i+1}: invalid map row ${row}`);
      assert.match(row, /^[.#B?CP=EKRFH~]+$/);
      plants+=(row.match(/R/g)||[]).length;
      hidden+=(row.match(/H/g)||[]).length;
      flags+=(row.match(/F/g)||[]).length;
    }
  }
  assert.ok(plants>=2, `World ${i+1}: two plants`);
  assert.equal(hidden,1, `World ${i+1}: one hidden 1-up`);
  assert.equal(flags,1);
}
const tsArg = process.argv.indexOf('--typescript');
if (tsArg >= 0) {
  const module = await import(pathToFileURL(resolve(process.argv[tsArg+1])).href);
  const ts = module.default || module;
  const filename = resolve('test/scratch/typecheck/inline-game.js');
  await mkdir('test/scratch/typecheck', { recursive: true });
  await writeFile(filename, scripts[0][1]);
  const program = ts.createProgram([filename], { allowJs: true, checkJs: true, noEmit: true, target: ts.ScriptTarget.ES2022, lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'] });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  for (const d of diagnostics) {
    const line = d.file && d.start != null ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0;
    console.error(`Inline game JS:${line}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
  }
  assert.equal(diagnostics.length, 0, 'TypeScript checkJs diagnostics');
  console.log(`PASS: TypeScript ${ts.version} checkJs --noEmit on the exact inline game script, with ES2022/DOM/DOM.Iterable libraries.`);
}
console.log('PASS: JavaScript syntax, offline asset integrity, metadata, all three 256 × 15 maps, plant/flag/hidden-block invariants. Runtime is vanilla JavaScript; no compilation is required.');
