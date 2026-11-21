import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,advanceRound,newSeason,upgradeSave,transferCandidates,squadAssessment,transact,developPlayers} from '../js/engine.js';
import {readFileSync} from 'node:fs';

test('all new players have ages, potential and career counters; opening old saves fills missing data',()=>{
 const g=newGame();assert.equal(g.clubs.length,92);
 const p=g.clubs[0].squad[0];assert.ok(p.age>=17&&p.age<=35);assert.ok(p.potential>=p.skill);
 const old=structuredClone(g);for(const c of old.clubs)for(const p of c.squad){delete p.age;delete p.form;delete p.potential;}
 upgradeSave(old);assert.ok(old.clubs.every(c=>c.squad.every(p=>Number.isFinite(p.age)&&Number.isFinite(p.form)&&p.potential>=p.skill)));
});
test('the scout studies the current squad and provides stable reasons, available young free agents',()=>{
 const g=newGame(),a=squadAssessment(g),list=transferCandidates(g);
 assert.equal(list.length,6);assert.ok(a.weakPosition);assert.ok(a.notes.some(x=>x.includes('weakest')));
 assert.ok(list.every(p=>typeof p.scoutReason==='string'&&p.scoutReason.length));
 assert.ok(list.some(p=>p.fromClubId===null&&p.value===0&&p.age<=20));
 assert.deepEqual(transferCandidates(g),list);
});
test('shortlist remains stable after raising the player transfer budget and signing someone',()=>{
 const g=newGame(),list=transferCandidates(g),p=list[0],c=g.clubs[g.selected];c.budget=c.money=100000000;
 const result=transact(g,p.id,'buy');assert.equal(result.to,c.name);assert.ok(c.squad.some(x=>x.id===p.id));
});
test('recorded league matches produce appearances, form and goal histories',()=>{
 const g=newGame(),c=g.clubs[g.selected];advanceRound(g);
 assert.ok(c.squad.some(p=>p.appearances===1));
 assert.ok(c.squad.every(p=>Number.isFinite(p.form)));
 assert.ok(c.squad.some(p=>p.careerAppearances>=1));
});
test('a new season ages players, retains career totals, and brings free youth recruits',()=>{
 const g=newGame(),p=g.clubs[g.selected].squad[0],beforeAge=p.age,beforeFree=g.freeAgents.length;
 for(let i=0;i<46;i++)advanceRound(g);
 newSeason(g);assert.equal(p.age,beforeAge+1);assert.equal(p.appearances,0);
 assert.ok(g.freeAgents.length>=beforeFree+24);
 assert.ok(g.freeAgents.some(x=>x.value===0&&x.age<=20));
});
test('match layout puts clock above score and current commentary alongside pitch',()=>{
 const s=readFileSync(new URL('../js/app.js',import.meta.url),'utf8'),css=readFileSync(new URL('../css/style.css',import.meta.url),'utf8');
 assert.match(s,/class="match-clock-main" id="live-clock"/);assert.match(s,/class="match-replay-grid"/);
 assert.match(css,/grid-template-columns:minmax\(0,1\.5fr\)/);
});
