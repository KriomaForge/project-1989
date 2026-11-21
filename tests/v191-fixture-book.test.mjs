import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {makeFixtures,newGame,fixtureStreak,rebalanceRemainingFixtures} from '../js/engine.js';

test('new calendars do not create all-away runs for either division size',()=>{
 for(const n of [20,24]){
  const fixture=makeFixtures(Array.from({length:n},(_,i)=>i));
  assert.equal(fixture.length,2*(n-1));
  for(let id=0;id<n;id++){
   const sides=fixture.map(r=>r.find(([h,a])=>h===id||a===id)[0]===id?'H':'A').join('');
   assert.equal(sides.split('H').length-1,n-1);
   assert.equal(sides.split('A').length-1,n-1);
   assert.ok(Math.max(...(sides.match(/H+|A+/g)||[]).map(s=>s.length))<=3,sides);
  }
 }
});
test('rebalance legacy all-away save, preserving scores, opponents and played fixtures',()=>{
 const g=newGame(1,1989);g.round=7;
 // Emulate older bug: ensure Aston Villa is away in every first-leg match.
 const byPair=new Map();for(let w=0;w<g.fixtures.length;w++)for(let j=0;j<g.fixtures[w].length;j++){
   const f=g.fixtures[w][j];const key=[...f].sort((a,b)=>a-b).join(':');
   if(!byPair.has(key))byPair.set(key,[]);byPair.get(key).push([w,j]);
 }
 for(const pair of byPair.values()){
  if(pair.length!==2)continue;
  const first=pair.find(([w,j])=>w<19&&g.fixtures[w][j].includes(g.selected));
  if(!first)continue;
  const f=g.fixtures[first[0]][first[1]];
  if(f[0]!==g.selected)continue;
  for(const [w,j] of pair){const p=g.fixtures[w][j];g.fixtures[w][j]=[p[1],p[0]];}
 }
 const bad=fixtureStreak(g,g.selected);assert.ok(bad>=17,bad);
 const played=structuredClone(g.fixtures.slice(0,g.round));
 const opponents=g.fixtures.map(w=>w.map(f=>[...f].sort((a,b)=>a-b).join(':')));
 const changed=rebalanceRemainingFixtures(g);
 assert.ok(changed>0);assert.deepEqual(g.fixtures.slice(0,g.round),played);
 assert.deepEqual(g.fixtures.map(w=>w.map(f=>[...f].sort((a,b)=>a-b).join(':'))),opponents);
 assert.ok(fixtureStreak(g,g.selected)<bad,`${fixtureStreak(g,g.selected)} vs ${bad}`);
 assert.equal(g.calendarRebalanced.week,7);
});
test('notebook fixture/finance pages and champions wording are wired in',()=>{
 const app=fs.readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(app,/recordSpread\('Fixture Diary'/);
 assert.match(app,/recordSpread\('Club Accounts'/);
 assert.match(app,/repair-fixtures/);
 assert.match(app,/We are defending champions/);
 assert.doesNotMatch(app,/const board=rank<=3\?'The board are delighted. Promotion/);
});
