import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,autoLineup,assistantLineup,cupRoundName,validLineup,advanceRound} from '../js/engine.js';

test('assistant pick honours the formation and excludes injured players',()=>{
 const c=newGame().clubs[68];
 c.squad.find(p=>p.pos==='MID').injured=2;
 c.lineup=assistantLineup(c);
 assert.ok(validLineup(c));
 assert.ok(!c.lineup.includes(c.squad.find(p=>p.pos==='MID').id));
});
test('assistant pick can favour fitter, happier and in-form peer over slightly more skilled player',()=>{
 const c=newGame().clubs[68];
 const mids=c.squad.filter(p=>p.pos==='MID');
 // Provide enough equivalent players for a meaningful final midfield place.
 mids.forEach((p,i)=>{p.skill=i<3?90:45;p.fitness=100;p.morale=70;p.form=6.5;p.experience=20;});
 mids[3].skill=78;mids[3].fitness=30;mids[3].morale=25;mids[3].form=3;
 mids[4].skill=75;mids[4].fitness=100;mids[4].morale=95;mids[4].form=9;
 const best=autoLineup(c),assistant=assistantLineup(c);
 assert.ok(best.includes(mids[3].id));
 assert.ok(!best.includes(mids[4].id));
 assert.ok(assistant.includes(mids[4].id));
 assert.ok(!assistant.includes(mids[3].id));
});
test('cup round names cover early rounds, quarter, semi and final',()=>{
 assert.equal(cupRoundName('FA Cup',1),'First Round');
 assert.match(cupRoundName('FA Cup',6),/Quarter-final/);
 assert.equal(cupRoundName('FA Cup',7),'Semi-final');
 assert.equal(cupRoundName('FA Cup',8),'Final');
 assert.match(cupRoundName('League Cup',5),/Quarter-final/);
 assert.equal(cupRoundName('League Cup',6),'Semi-final');
 assert.equal(cupRoundName('League Cup',7),'Final');
});
test('cup reports carry their round number without changing the save schema',()=>{
 const g=newGame();for(let i=0;i<46;i++)advanceRound(g);
 for(const cup of Object.values(g.cups)){
  assert.ok(cup.completed.every(x=>cupRoundName(cup.name,x.round)));
  assert.ok(cup.winner!==null);
 }
 assert.equal(g.version,3);
});
