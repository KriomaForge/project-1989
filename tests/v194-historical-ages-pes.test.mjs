import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,ageOnSeasonStart,fictionalClubNames,PES_ALIASES,HISTORICAL_PLAYER_PROFILES,CLUBS,upgradeSave} from '../js/engine.js';
test('Yorke aged 17 in August 1989, with a modest initial ability and exceptional potential',()=>{
 const g=newGame(1,1989,'historical'); const yorke=g.clubs[1].squad.find(p=>p.name==='Dwight Yorke');
 assert.equal(yorke.age,17);assert.equal(yorke.dateOfBirth,'1971-11-03');assert.equal(yorke.ageEstimated,false);
 assert.equal(yorke.skill,54);assert.equal(yorke.potential,93);
 assert.equal(ageOnSeasonStart('1971-11-03',1990),18);
});
test('verified Villa birth dates and game-balanced abilities are applied, unknown ages flagged',()=>{
 const g=newGame(1,1989,'historical');const villa=g.clubs[1];
 assert.equal(villa.squad.find(p=>p.name==='David Platt').age,23);
 assert.equal(villa.squad.find(p=>p.name==='Gordon Cowans').age,30);
 assert.equal(villa.squad.find(p=>p.name==='Chris Price').ageEstimated,false);
 assert.equal(villa.squad.find(p=>p.name==='Chris Price').age,29);
 assert.equal(villa.squad.find(p=>p.name==='Paul McGrath').skill,84);
 assert.equal(Object.keys(HISTORICAL_PLAYER_PROFILES['Aston Villa']).length,16);
});
test('Exeter verified birth dates and estimated dates are distinguished',()=>{
 const g=newGame(72,1989,'historical');const ex=g.clubs.find(c=>c.name==='Exeter City');
 assert.equal(ex.squad.find(p=>p.name==='Kevin Miller').age,20);
 assert.equal(ex.squad.find(p=>p.name==='Shaun Taylor').age,26);
 assert.equal(ex.squad.find(p=>p.name==='David Walter').ageEstimated,true);
 assert.equal(ex.squad.filter(p=>p.historicalVerified).length,17);
});
test('PES alias mapping preserves familiar names, others receive generated identities',()=>{
 assert.equal(PES_ALIASES['Aston Villa'],'West Midlands Village');
 assert.equal(PES_ALIASES['Birmingham City'],'West Midlands City');
 const g=newGame(1,1989,'alternate');
 assert.equal(g.clubs.find(c=>c.historicalName==='Aston Villa').name,'West Midlands Village');
 assert.equal(g.clubs.find(c=>c.historicalName==='Birmingham City').name,'West Midlands City');
 assert.equal(new Set(g.clubs.map(c=>c.name)).size,92);
 assert.equal(g.clubs[0].name,fictionalClubNames(1989)[0]);
 assert.equal(upgradeSave(structuredClone(g)).careerMode,'alternate');
});
test('generated normal world remains historic club names with fictional players',()=>{
 const g=newGame(1,1989,'fictional');assert.equal(g.clubs[1].name,'Aston Villa');
 assert.ok(g.clubs[1].squad.every(p=>!p.historicalVerified));
});
