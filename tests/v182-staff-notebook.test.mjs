import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame,staffReport,ensureStaff,assistantLineup,validLineup,upgradeSave,transferCandidates} from '../js/engine.js';

test('staff descriptions persist in existing save format and old saves gain staff',()=>{
 const g=newGame(75),report=staffReport(g);
 assert.ok(report.assistant.description.length>30);
 assert.ok(report.scout.description.length>30);
 assert.equal(g.version,3);
 const loaded=upgradeSave(JSON.parse(JSON.stringify(g)));
 assert.deepEqual(staffReport(loaded),report);
 delete loaded.staff;
 ensureStaff(loaded);
 assert.deepEqual(staffReport(loaded),report);
});

test('assistant staff personalities can make different decisions but always pick a valid XI',()=>{
 const g=newGame(75);const c=g.clubs[75];
 const mids=c.squad.filter(p=>p.pos==='MID');
 for(const [i,p] of mids.entries()){
  p.skill=i<3?88:(i===3?85:74);
  p.fitness=100;p.morale=80;p.form=6.5;p.experience=40;
 }
 mids[3].fitness=50;mids[3].morale=70;mids[3].experience=100;
 mids[4].fitness=100;mids[4].morale=85;mids[4].experience=10;
 const experienced=assistantLineup(c,{style:'experience'});
 const rested=assistantLineup(c,{style:'fitness'});
 assert.notDeepEqual(experienced,rested);
 for(const lineup of [experienced,rested]){c.lineup=lineup;assert.ok(validLineup(c));}
});

test('scout traits are stable and influence ranking without breaking transfer lists',()=>{
 const a=newGame(75),b=newGame(75);
 a.staff.scout.style='youth';b.staff.scout.style='veterans';
 const young=transferCandidates(a),vets=transferCandidates(b);
 assert.equal(young.length,6);assert.equal(vets.length,6);
 assert.ok(young.every(p=>p.scoutReason));
 assert.ok(vets.every(p=>p.scoutReason));
 assert.ok(young.some((p,i)=>p.id!==vets[i].id),'staff specialisms should influence actual player recommendations');
});

test('all notebook sections have consecutive page numbers',()=>{
 const s=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 for(const [page,num] of [['chairman',3],['matchday',5],['records',7],['postbag',9],['press',11],['players',13],['log',15]]){
  assert.match(s,new RegExp(`${page}:${num}`));
 }
 assert.match(s,/bookNumber\(NOTEBOOK_PAGES\[notebookPage\]/);
 assert.match(s,/bookNumber\(\(NOTEBOOK_PAGES\[notebookPage\]/);
});
