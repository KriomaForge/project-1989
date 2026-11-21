import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,CLUBS,CAREER_MODES,fictionalClubNames,HISTORICAL_PREVIEW,upgradeSave,validLineup} from '../js/engine.js';
import {clubColoursById} from '../js/club-colours.js';
test('all four world modes available and 92 division structure maintained',()=>{
 assert.equal(Object.keys(CAREER_MODES).length,4);
 for(const mode of Object.keys(CAREER_MODES)){
  const g=newGame(20,1989,mode);assert.equal(g.careerMode,mode);assert.equal(g.clubs.length,92);
  assert.deepEqual([0,1,2,3].map(d=>g.clubs.filter(c=>c.division===d).length),[20,24,24,24]);
  assert.equal(new Set(g.clubs.map(c=>c.name)).size,92);
  assert.ok(g.clubs.every(c=>validLineup(c)));
  assert.equal(upgradeSave(structuredClone(g)).careerMode,mode);
 }
});
test('generated football world contains fictional unique clubs, and retains its palette in save',()=>{
 const g=newGame(20,1989,'alternate');
 assert.notEqual(g.clubs[0].name,CLUBS[0].name);
 assert.ok(g.clubs.every(c=>c.worldIdentity==='generated'&&c.customColours.length===2));
 assert.deepEqual(clubColoursById(g.clubs,0),g.clubs[0].customColours);
 assert.deepEqual(g.clubs.map(c=>c.name),fictionalClubNames(1989));
 assert.notDeepEqual(fictionalClubNames(1989),fictionalClubNames(1990));
});
test('historical preview only marks sourced players, and labels the incomplete 90-club research',()=>{
 const g=newGame(1,1989,'historical');const v=g.clubs.find(c=>c.name==='Aston Villa');const x=g.clubs.find(c=>c.name==='Exeter City');
 assert.ok(v.squad.some(p=>p.historicalVerified&&p.name==='David Platt'));
 assert.ok(x.squad.some(p=>p.historicalVerified&&p.name==='Shaun Taylor'));
 assert.ok(v.squad.filter(p=>p.historicalVerified).every(p=>p.historicalSource));
 assert.ok(g.clubs.filter(c=>c.historicalResearch?.verified===0).length>=86);
 assert.match(g.historicalCoverage,/6 of 92/);
 assert.equal(HISTORICAL_PREVIEW['Aston Villa'].length,16);
});
test('existing saved careers without mode remain playable and unchanged',()=>{
 const g=newGame(1);delete g.careerMode;const migrated=upgradeSave(g);
 assert.equal(migrated.careerMode,undefined);assert.equal(migrated.clubs[1].name,'Aston Villa');
});
