import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,CLUBS,ageOnSeasonStart,applyHistoricalResearch,validLineup} from '../js/engine.js';
test('pilot names, birth dates, ages and game-estimated ratings appear at Arsenal',()=>{
 const g=newGame(3,1989,'historical'),a=g.clubs[3];
 const t=a.squad.find(p=>p.name==='Tony Adams');
 assert.equal(t.age,22);assert.equal(t.dateOfBirth,'1966-10-10');assert.equal(t.ageEstimated,false);
 assert.ok(t.skill>=38&&t.potential>=t.skill);
 assert.ok(a.squad.filter(p=>p.historicalVerified).length>=28);assert.ok(validLineup(a));
});
test('opening day uses dated evidence and excludes late joins, season mode includes them',()=>{
 const rows=[{Team:'Arsenal',Player:'Example Earlier',Pos:'Defender',DOB:'1968-01-01',Joined:'1980-01-01',Left:'1991-01-01'},
 {Team:'Arsenal',Player:'Example Later',Pos:'Midfielder',DOB:'1966-01-01',Joined:'1990-01-01',Left:'1992-01-01'}];
 const g=newGame(3,1989,'historical-opening');
 const result=applyHistoricalResearch(g,rows,true);
 assert.equal(result.accepted,1);assert.equal(result.skipped,1);
 assert.ok(g.clubs[3].squad.some(p=>p.name==='Example Earlier'));
 assert.ok(!g.clubs[3].squad.some(p=>p.name==='Example Later'));
 const full=newGame(3,1989,'historical');applyHistoricalResearch(full,rows,false);
 assert.ok(full.clubs[3].squad.some(p=>p.name==='Example Later'));
});
test('opening-day age uses 19 August, not 1 August',()=>{
 assert.equal(ageOnSeasonStart('1964-08-16'),25);
 assert.equal(ageOnSeasonStart('1958-08-08'),31);
 assert.equal(ageOnSeasonStart('1971-08-27'),17);
});
test('generated and alternate careers unaffected',()=>{
 assert.ok(newGame(3,1989,'fictional').clubs[3].squad.every(p=>!p.historicalVerified));
 assert.equal(newGame(3,1989,'alternate').clubs.length,CLUBS.length);
});

test('Liverpool research includes supplied 1989 names and sensible dates',()=>{
 const g=newGame(0,1989,'historical');
 const l=g.clubs[0];
 assert.ok(l.squad.some(p=>p.name==='Ian Rush'&&p.age===27));
 assert.ok(l.squad.some(p=>p.name==='John Barnes'&&p.dateOfBirth==='1963-11-07'));
 assert.ok(l.squad.some(p=>p.name==='Ronny Rosenthal'));
 assert.ok(validLineup(l));
 const opening=newGame(0,1989,'historical-opening');
 assert.ok(!opening.clubs[0].squad.some(p=>p.name==='Ronny Rosenthal'));
 assert.ok(opening.clubs[0].squad.some(p=>p.name==='Steve McManaman'));
});
