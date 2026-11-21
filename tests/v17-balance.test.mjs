import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,simulateMatch,teamStrength,replayScore,validLineup} from '../js/engine.js';
const formation={GK:1,DEF:4,MID:4,FWD:2};
function weakestXI(c){const w=structuredClone(c);w.lineup=Object.entries(formation).flatMap(([pos,n])=>w.squad.filter(p=>p.pos===pos).sort((a,b)=>a.skill-b.skill).slice(0,n).map(p=>p.id));return w;}
test('new careers have unique fictional full names within every squad',()=>{
 for(const seed of [1989,1990,2001]){const g=newGame(68,seed);for(const c of g.clubs){assert.equal(new Set(c.squad.map(p=>p.name)).size,c.squad.length,c.name);}}
});
test('starting XI differences have stronger consequences in 1000 matched games',()=>{
 const g=newGame(68);const strong=g.clubs[68],weak=weakestXI(strong),opponent=g.clubs[69];
 assert.ok(validLineup(weak));
 let goodPts=0,badPts=0;
 for(let i=0;i<1000;i++){
  for(const [club,good] of [[strong,true],[weak,false]]){const r=simulateMatch(club,opponent,10000+i);const pts=r.hg>r.ag?3:r.hg===r.ag?1:0;if(good)goodPts+=pts;else badPts+=pts;}
 }
 assert.ok(goodPts>badPts+350,`${goodPts} vs ${badPts}`);
});
test('position-specific ratings respond to loss of defensive and attacking quality',()=>{
 const g=newGame(68),base=g.clubs[68];const v=structuredClone(base);const fwd=v.squad.find(p=>p.pos==='FWD'&&v.lineup.includes(p.id));fwd.skill=20;
 assert.ok(teamStrength(v).attack<teamStrength(base).attack);
 const d=structuredClone(base);const gk=d.squad.find(p=>p.pos==='GK'&&d.lineup.includes(p.id));gk.skill=20;
 assert.ok(teamStrength(d).defence<teamStrength(base).defence);
});
test('a replay only scores goals that occurred before its current incident',()=>{
 const g=newGame(),r=simulateMatch(g.clubs[0],g.clubs[1],4242);
 assert.deepEqual(replayScore(r,0),[0,0]);
 for(let i=0;i<r.events.length;i++){
  const [h,a]=replayScore(r,i+1);const previous=replayScore(r,i);
  assert.ok(h>=previous[0]&&a>=previous[1]);
  assert.ok(h+a<=r.hg+r.ag);
  if(r.events[i].type!=='goal')assert.deepEqual([h,a],previous);
 }
 assert.deepEqual(replayScore(r,r.events.length),[r.hg,r.ag]);
});
test('match centre source conceals scores while watching and reveals results at full time', async()=>{
 const {readFileSync}=await import('node:fs');
 const src=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(src,/id="live-score"/);
 assert.match(src,/watch\?"0 – 0"/);
 assert.match(src,/replayScore\(r,replayIndex\)/);
 assert.match(src,/if\(e\.type==='fulltime'\)/);
 assert.match(src,/id="replay-detail"/);
 assert.match(src,/watch\?"hidden":""/);
});
