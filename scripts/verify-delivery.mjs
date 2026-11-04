import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import assert from 'node:assert/strict';
const source=await readFile('index.html'),exported=await readFile('dist/index.html');
assert.ok(source.equals(exported),'Source and production export must match');
const sha256=createHash('sha256').update(exported).digest('hex');
for(const path of ['README.md','DESIGN.md','VALIDATION.md','artifacts/validation.md','LICENSES/design-guidance.txt'])assert.ok((await readFile(path)).length>100,`${path} must contain documentation`);
assert.equal(await readFile('VALIDATION.md','utf8'),await readFile('artifacts/validation.md','utf8'));
for(const path of ['package.json','package-lock.json'])JSON.parse(await readFile(path,'utf8'));
const game=JSON.parse(await readFile('artifacts/game-validation.json','utf8'));
const routes=JSON.parse(await readFile('artifacts/routes-validation.json','utf8'));
const design=JSON.parse(await readFile('artifacts/design-probe.json','utf8'));
for(const r of [game,routes,design])assert.equal(r.sha256,sha256,'Reports must describe the delivered export');
assert.equal(game.failed,0);assert.equal(game.passed,32);assert.equal(routes.levels.length,3);assert.ok(routes.levels.every(x=>x.passed));assert.equal(design.checks.length,16);assert.ok(design.checks.every(x=>x.passed));
const files=['index.html','package.json','package-lock.json','README.md','DESIGN.md','VALIDATION.md'];
async function walk(dir){for(const d of await readdir(dir,{withFileTypes:true})){assert.ok(!['node_modules','.git','.github','.cache'].includes(d.name)&&!d.name.startsWith('.env'),'No protected/dependency/cache paths in delivered trees');assert.ok(!d.isSymbolicLink(),'No linked dependencies');const p=dir+'/'+d.name;if(d.isDirectory())await walk(p);else{assert.ok(!/\.(?:tgz|zip|tar|gz)$/.test(p),'No dependency archives');files.push(p);}}}
for(const dir of ['scripts','dist','artifacts','LICENSES'])await walk(dir);
function crc32(buf){let c=0xffffffff;for(let i=0;i<buf.length;i++){c^=buf[i];for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;}return(c^0xffffffff)>>>0;}
function validatePNG(buf){assert.ok(buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));let at=8,width=0,height=0,depth=0,color=0,end=false;const data=[];while(at<buf.length){const len=buf.readUInt32BE(at),type=buf.toString('ascii',at+4,at+8);assert.ok(at+12+len<=buf.length);assert.equal(crc32(buf.subarray(at+4,at+8+len)),buf.readUInt32BE(at+8+len));if(type==='IHDR'){width=buf.readUInt32BE(at+8);height=buf.readUInt32BE(at+12);depth=buf[at+16];color=buf[at+17];assert.ok(width>0&&height>0);assert.equal(depth,8);}if(type==='IDAT')data.push(buf.subarray(at+8,at+8+len));if(type==='IEND')end=true;at+=12+len;}assert.ok(end&&data.length);const channels={0:1,2:3,3:1,4:2,6:4}[color];assert.ok(channels);const raw=inflateSync(Buffer.concat(data));assert.equal(raw.length,(Math.ceil(width*channels*depth/8)+1)*height);}
let total=0,pngCount=0;const integrityPath='artifacts/integrity.json';
for(const p of files){if(p===integrityPath)continue;const data=await readFile(p);total+=data.length;if(p.endsWith('.json'))JSON.parse(data.toString());if(p.endsWith('.png')){validatePNG(data);pngCount++;}}
const report={exportBytes:exported.length,sha256,sourceEqualsExport:true,gameplayChecks:32,designChecks:16,reachableLevels:3,pngCount,pngsValidated:true,jsonDocumentsValidated:true,bundleFiles:files.filter(p=>p!==integrityPath).length+1,bundleBytes:total,limitBytes:8388608,excludes:'Provided inputs and disposable test/scratch tooling are not part of the deliverable.'};
let encoded='';for(let i=0;i<10;i++){encoded=JSON.stringify(report,null,2)+'\n';const n=total+Buffer.byteLength(encoded);if(n===report.bundleBytes)break;report.bundleBytes=n;}
encoded=JSON.stringify(report,null,2)+'\n';assert.equal(report.bundleBytes,total+Buffer.byteLength(encoded));assert.ok(report.bundleBytes<=report.limitBytes,'Delivery must be below 8 MiB');await writeFile(integrityPath,encoded);
console.log(JSON.stringify({passed:true,exportBytes:exported.length,bundleBytes:report.bundleBytes,limitBytes:report.limitBytes,pngCount}));
