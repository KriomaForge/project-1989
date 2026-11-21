import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,estimateHistoricalRating,applyHistoricalResearch,validLineup} from '../js/engine.js';
test('Liverpool individual 1989 estimates, not uniform 63',()=>{
 const c=newGame(0,1989,'historical').clubs[0];
 const p=name=>c.squad.find(x=>x.name===name);
 assert.equal(p('John Barnes').skill,92);
 assert.equal(p('Ian Rush').skill,90);
 assert.equal(p('Steve McManaman').skill,51);
 assert.equal(p('Mike Hooper').skill,64);
 assert.ok(p('Steve McManaman').potential>90);
 assert.ok(new Set(c.squad.filter(x=>x.historicalVerified).map(x=>x.skill)).size>12);
 assert.ok(validLineup(c));
});
test('Villa existing researched players retain individual skill',()=>{
 const c=newGame(1,1989,'historical').clubs[1];
 const p=name=>c.squad.find(x=>x.name===name);
 assert.equal(p('David Platt').skill,85);assert.equal(p('Dwight Yorke').skill,54);
 assert.ok(p('Dwight Yorke').potential>=90);
});
test('missing statistics are not converted to zero or uniform abilities',()=>{
 const a=estimateHistoricalRating({team:'Other',name:'A One',pos:'MID',division:0,age:22});
 const b=estimateHistoricalRating({team:'Other',name:'B Two',pos:'MID',division:0,age:22});
 assert.notEqual(a.ability,b.ability);assert.match(a.basis,/unavailable/);
});
test('mixed positional research codes import and keep their ratings',()=>{
 const g=newGame(0,1989,'historical');
 const r=applyHistoricalResearch(g,[{Team:'Liverpool',Player:'Sample Utility',Pos:'DF/MF',DOB:'1966-01-01',Apps:'',Goals:''}],false);
 assert.equal(r.accepted,1);
 assert.equal(g.clubs[0].squad.find(p=>p.name==='Sample Utility').pos,'DEF');
});
test('real player ratings differ in opening-day mode too',()=>{
 const c=newGame(0,1989,'historical-opening').clubs[0];
 assert.equal(c.squad.find(p=>p.name==='John Barnes').skill,92);
 assert.ok(!c.squad.some(p=>p.name==='Ronny Rosenthal'));
});
test('old 1989 historical save can be repaired without changing player registrations',async()=>{
 const {recalibrateHistoricalRatings}=await import('../js/engine.js');
 const g=newGame(0,1989,'historical'); const l=g.clubs[0];
 const barnes=l.squad.find(p=>p.name==='John Barnes');barnes.skill=63;delete barnes.historicalRatingBasis;
 const before=l.squad.map(p=>p.name).join('|');
 const repaired=recalibrateHistoricalRatings(g);
 assert.ok(repaired>0);assert.equal(barnes.skill,92);
 assert.equal(l.squad.map(p=>p.name).join('|'),before);
 assert.equal(g.season,1989);assert.equal(g.round,0);
 assert.equal(recalibrateHistoricalRatings(g),0);
 g.round=1;assert.throws(()=>recalibrateHistoricalRatings(g));
});
