import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame,transact,transferCandidates,clubEconomy,advanceRound,upgradeSave,seasonRevenue,staffCreditLimit} from '../js/engine.js';

test('free youngsters have zero fee and an origin without being contracted to that club',()=>{
 const g=newGame(1), p=transferCandidates(g).find(p=>p.youth&&p.fromClubId===null);
 assert.ok(p);assert.equal(p.value,0);assert.equal(typeof p.youthOriginClubId,'number');
 const ui=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(ui,/FREE AGENT · academy:/);assert.match(ui,/marketOrigin\(p\)/);
});
test('releasing an unwanted player deducts 10 weeks pay and adds a genuinely free agent',()=>{
 const g=newGame(1),c=g.clubs[1],p=c.squad.find(x=>!c.lineup.includes(x.id));
 const cash=c.money,budget=c.budget,fee=p.wage*10;
 const entry=transact(g,p.id,'release');
 assert.equal(entry.compensation,fee);assert.equal(entry.fee,0);assert.equal(c.money,cash-fee);assert.equal(c.budget,budget);
 assert.ok(!c.squad.some(x=>x.id===p.id));
 const free=g.freeAgents.find(x=>x.id===p.id);
 assert.equal(free.value,0);assert.equal(free.releasedByClubId,c.id);
 assert.ok(g.financeLedger.some(x=>x.type==='PLAYER RELEASE'&&x.amount===-fee));
 assert.equal(upgradeSave(JSON.parse(JSON.stringify(g))).version,3);
});
test('release respects minimum squad and permitted credit',()=>{
 const g=newGame(1),c=g.clubs[1];c.money=-staffCreditLimit(c);
 assert.throws(()=>transact(g,c.squad.at(-1).id,'release'),/cannot fund/);
 c.money=0;c.squad=c.squad.slice(0,16);
 assert.throws(()=>transact(g,c.squad.at(-1).id,'release'),/Minimum squad/);
});
test('no extra youth arrive midseason but exactly 460 arrive per season',()=>{
 const g=newGame(1),initial=g.freeAgents.filter(p=>p.youth).length;
 advanceRound(g);assert.equal(g.freeAgents.filter(p=>p.youth).length,initial);
});
test('first division gate model improves success-driven finances without an unlimited cash injection',()=>{
 const g=newGame(1),c=g.clubs[1],home=g.fixtures.findIndex(r=>r.some(x=>x[0]===c.id));
 const e=clubEconomy(g,c,home);
 assert.ok(e.gate>=35000&&e.gate<=160000);
 assert.ok(e.net> -5000,'home fixtures should meaningfully support wages');
 assert.ok(seasonRevenue(g,c,1)>seasonRevenue(g,c,16));
});
test('all free agents, including senior unattached players, have no transfer fee',()=>{
 const g=newGame(1),c=g.clubs[1];
 const outsider=g.freeAgents.find(p=>!p.youth && p.value>0);
 assert.ok(outsider);
 g.scoutShortlists={[`v184-${g.season}-${g.round}-${g.selected}`]:[{id:outsider.id,reason:'Senior free agent'}]};
 const displayed=transferCandidates(g).find(p=>p.id===outsider.id);
 assert.equal(displayed.value,0);
 const beforeCash=c.money,beforeBudget=c.budget;
 const entry=transact(g,outsider.id,'buy');
 assert.equal(entry.fee,0);assert.equal(c.money,beforeCash);assert.equal(c.budget,beforeBudget);
 assert.ok(c.squad.some(p=>p.id===outsider.id));
});
test('release and no-offer options are present on the squad sales screen',()=>{
 const ui=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(ui,/No offers/);assert.match(ui,/data-release=/);assert.match(ui,/t\.dataset\.release/);
});
