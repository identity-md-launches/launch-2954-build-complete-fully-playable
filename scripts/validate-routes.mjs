import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';
const {chromium}=await import(pathToFileURL(resolve(process.argv[2]||'test/scratch/pw/index.mjs')));import {createServer} from 'node:http';import {readFile,writeFile,mkdir} from 'node:fs/promises';
const html=await readFile('dist/index.html');const server=createServer((q,r)=>r.end(html)).listen(0,'127.0.0.1');await new Promise(r=>server.on('listening',r));await mkdir('test/scratch/tmp',{recursive:true});const b=await chromium.launch({env:{TMPDIR:'test/scratch/tmp'},args:['--no-sandbox']});const page=await b.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/?test`);await page.evaluate(()=>__game.stop());
const reports=[];
for(let world=0;world<3;world++){
 const report=await page.evaluate(world=>{const g=__game;g.load(world);g.setTimer(999999);g.level.enemies.forEach(e=>e.dead=-1);g.level.platforms.length=0;const width=g.level.width;
 const surfaces=[];for(let x=0;x<width;x++)for(let y=2;y<14;y++)if(g.solid(g.tile(x,y))&&!g.solid(g.tile(x,y-1)))surfaces.push({x,y});
 const key=(x,y)=>y*width+x;
 const surfaceMap=new Map(surfaces.map(s=>[key(s.x,s.y),s]));
 const queue=[{x:2,y:13,path:[]}],seen=new Set([key(2,13)]);let max=2,best=[],trials=0;
 function add(x,y,path){const k=key(x,y);if(!seen.has(k)&&surfaceMap.has(k)){seen.add(k);queue.push({x,y,path});if(x>max){max=x;best=path;}}}
 for(let head=0;head<queue.length;head++){
 const s=queue[head];if(s.x>=g.level.flagX/16-1)return {world:world+1,passed:true,maxTile:max,states:seen.size,trials,path:s.path};
 // Walk across contiguous same-height surfaces; this is grounded travel on the actual map.
 for(const dir of [-1,1])if(surfaceMap.has(key(s.x+dir,s.y)))add(s.x+dir,s.y,s.path);
 // Try exact jump trajectories through the real fixed-step update. Platforms/enemies are disabled
 // only for the geometry proof. Independent interaction tests cover them separately.
 for(const offset of [1,8,14])for(const hold of [1,10,24,50]){
   trials++;g.setState('playing');g.clearInput();Object.assign(g.p,{x:s.x*16+offset,y:s.y*16-16,vx:2.5,vy:0,ground:true,coyote:4,buffer:0,h:16,power:0,inv:999999});
   g.input.right=true;g.input.run=true;g.input.jump=true;g.input.jumpPressed=true;
   for(let f=0;f<85;f++){if(f===hold)g.input.jump=false;g.advance();if(g.state==='flag')return {world:world+1,passed:true,maxTile:244,states:seen.size,trials,path:[...s.path,{from:s.x,offset,hold,flag:true}]};if(g.state!=='playing'||g.p.y>240)break;if(f>0&&g.p.ground){const ty=Math.round((g.p.y+16)/16);for(let tx=Math.floor((g.p.x+.5)/16);tx<=Math.floor((g.p.x+11.5)/16);tx++)if(tx>s.x)add(tx,ty,[...s.path,{from:s.x,to:tx,offset,hold}]);break;}}
 }
 }
 return {world:world+1,passed:false,maxTile:max,states:seen.size,trials,path:best,unreached:surfaces.filter(s=>s.x>max&&s.x<max+20)};
 },world);reports.push(report);console.log(JSON.stringify({world:report.world,passed:report.passed,maxTile:report.maxTile,states:report.states,trials:report.trials}));
}
await writeFile('artifacts/routes-validation.json',JSON.stringify({sha256:createHash('sha256').update(html).digest('hex'),method:'Geometric reachability using the actual game fixed-step update. Enemies and moving platforms disabled; selected grounded starts and run-speed takeoffs. This is not a continuous human playthrough or a proof of combat difficulty.',levels:reports},null,2));if(reports.some(r=>!r.passed))process.exitCode=1;await b.close();server.close();
