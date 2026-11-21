import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CLUBS,newGame,youthIntake} from '../js/engine.js';
import {clubColours,clubColoursById,allColourNames} from '../js/club-colours.js';
import {scenePlan} from '../js/retro-match.js';

test('every Football League club has explicit home palette and Villa has claret and blue',()=>{
 for(const c of CLUBS)assert.ok(allColourNames().includes(c.name),`Missing club palette: ${c.name}`);
 assert.deepEqual(clubColours('Aston Villa'),['#762344','#80c7e9']);
 assert.deepEqual(clubColoursById(CLUBS,1),clubColours('Aston Villa'));
});
test('all 92 clubs promote two youth and release three in the start-season intake',()=>{
 const g=newGame(1);
 for(const c of g.clubs){
  const promoted=c.squad.filter(p=>p.youthIntakeSeason===1989);
  const free=g.freeAgents.filter(p=>p.youthOriginClubId===c.id&&p.youthIntakeSeason===1989);
  assert.equal(promoted.length,2,c.name);assert.equal(free.length,3,c.name);
  assert.ok(promoted.every(p=>p.academyPromoted&&p.age>=16&&p.age<=18));
  assert.ok(free.every(p=>!p.academyPromoted&&p.value===0));
 }
});
test('home shirt palette flows to scene and away shirt is always white',()=>{
 const scene=readFileSync(new URL('../js/retro-match.js',import.meta.url),'utf8');
 assert.match(scene,/isRight\?p.homeShirt:\['#f3f3ef','#f3f3ef'\]/);
 const p=scenePlan({home:1,away:2,homeShirt:clubColours('Aston Villa')},{team:1,type:'goal',minute:35});
 assert.equal(p.homeShirt[0],'#762344');
 const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(app,/clubTag\(a,true\)/);
 assert.match(app,/clubTag\(r.id\)/);
});
