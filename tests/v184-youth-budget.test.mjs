import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,advanceRound,newSeason,transferAffordability,transferCandidates,transact,staffCreditLimit} from '../js/engine.js';
import {readFileSync} from 'node:fs';

test('£18k listed player is affordable with £70,541 transfer funds and approved overdraft',()=>{
 const g=newGame(0),c=g.clubs[0];c.budget=70541;c.money=-216076;
 const offer={value:18000};assert.equal(staffCreditLimit(c),320000);
 assert.equal(transferAffordability(c,offer).affordable,true);
 assert.equal(transferAffordability(c,{value:80000}).affordable,false);
 assert.equal(transferAffordability({...c,money:-319000},offer).reason,'Chairman cannot fund this signing');
 assert.equal(transferAffordability({...c,money:-319000},{value:0}).affordable,true);
});
test('five youth per club: two promoted and three released as free agents',()=>{
 const g=newGame();const free=g.freeAgents.filter(p=>p.youth&&p.youthIntakeSeason===1989);
 const promoted=g.clubs.flatMap(c=>c.squad.filter(p=>p.youth&&p.youthIntakeSeason===1989));
 assert.equal(free.length,92*3);assert.equal(promoted.length,92*2);
 assert.ok(free.every(p=>p.age>=16&&p.age<=18&&p.value===0&&p.youthOriginClubId>=0&&p.youthOriginClubId<92));
 for(const c of g.clubs){assert.equal(free.filter(p=>p.youthOriginClubId===c.id).length,3);assert.equal(c.squad.filter(p=>p.youthIntakeSeason===1989&&p.youthOriginClubId===c.id).length,2);}
});
test('youth starting skills reflect division, but top potential can appear anywhere',()=>{
 const g=newGame();const youth=g.freeAgents.filter(p=>p.youth).concat(g.clubs.flatMap(c=>c.squad.filter(p=>p.youth)));
 const mean=d=>youth.filter(p=>g.clubs[p.youthOriginClubId].division===d).reduce((s,p)=>s+p.skill,0)/youth.filter(p=>g.clubs[p.youthOriginClubId].division===d).length;
 assert.ok(mean(0)>mean(3)+8);
 assert.ok(youth.filter(p=>g.clubs[p.youthOriginClubId].division===3).some(p=>p.potential>=86));
});
test('annual intake happens each rollover, and youth are identifiable on free shortlist',()=>{
 const g=newGame(),before=g.freeAgents.length;
 const shortlist=transferCandidates(g);assert.ok(shortlist.some(p=>p.youth&&p.value===0&&p.fromClubId===null));
 assert.ok(shortlist.some(p=>p.fromClubId!==null));
 for(let n=0;n<46;n++)advanceRound(g);
 newSeason(g);assert.equal(g.freeAgents.length,before+276);
 assert.equal(g.freeAgents.filter(p=>p.youthIntakeSeason===1990).length,276);
 const after=transferCandidates(g);assert.ok(after.some(p=>p.youth&&p.value===0));
});
test('free youth can sign even when chairman refuses cash purchases, and both views share finance rules',()=>{
 const g=newGame(0),c=g.clubs[0];c.money=-staffCreditLimit(c);c.budget=50000;
 // Cached shortlist for selected team will be generated under the updated rules.
 const p=transferCandidates(g).find(p=>p.youth&&p.value===0&&p.fromClubId===null);
 assert.ok(p);assert.equal(transferAffordability(c,p).affordable,true);
 transact(g,p.id,'buy');assert.ok(c.squad.some(x=>x.id===p.id));
 const ui=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(ui,/transferAffordability\(c,p\)/);
 assert.match(ui,/Cash available for signings/);
});
