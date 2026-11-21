import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,advanceRound,accountantReport,makeFixtures,newSeason} from '../js/engine.js';

test('every newly generated league calendar avoids home or away marathon',()=>{
 for(const n of [20,24]){
  const rounds=makeFixtures(Array.from({length:n},(_,i)=>i));
  for(let id=0;id<n;id++){
   const seq=rounds.map(week=>{const pair=week.find(([h,a])=>h===id||a===id);return pair[0]===id?'H':'A';});
   assert.equal(seq.filter(x=>x==='H').length,n-1);
   let run=1,max=1;for(let w=1;w<seq.length;w++){run=seq[w]===seq[w-1]?run+1:1;max=Math.max(run,max);}
   assert.ok(max<=3,`club ${id}, ${n} clubs: ${seq.join('')}`);
  }
 }
});

test('accountant offers concrete steps and average gate forecast without booking imaginary income',()=>{
 const g=newGame(1),c=g.clubs[1];
 c.money=-140000;
 let r=accountantReport(g,c);
 assert.ok(r.actions.length>=2);
 assert.ok(r.averageGate>0);
 assert.match(r.actions.join(' '),/overdraft|wage|receipts/i);
 const before=c.money;
 accountantReport(g,c);assert.equal(c.money,before);
 const away=g.fixtures.findIndex(w=>w.some(([h,a])=>a===c.id));
 for(let i=0;i<=away;i++)advanceRound(g);
 assert.match(g.financeLedger.find(x=>x.type==='WEEKLY OPERATIONS'&&x.week===away+1).note,/Away league fixture — no home gate/);
});

test('legacy fixture arrays retain their played matches during upgrade',()=>{
 const g=newGame(1);advanceRound(g);const played=g.results.map(x=>`${x.home}:${x.away}:${x.hg}:${x.ag}`);
 const fixture=g.fixtures[0].map(x=>x.join('-'));
 assert.deepEqual(g.fixtures[0].map(x=>x.join('-')),fixture);
 assert.deepEqual(g.results.map(x=>`${x.home}:${x.away}:${x.hg}:${x.ag}`),played);
});
