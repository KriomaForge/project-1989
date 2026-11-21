import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame,transferCandidates,transact,transferFee,upgradeSave} from '../js/engine.js';

const ui=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');

test('senior free agents have £0 asking fee regardless of market valuation',()=>{
 const g=newGame(1),p=g.freeAgents.find(p=>!p.youth&&p.value>0);
 assert.ok(p);assert.ok(p.value>0);
 assert.equal(transferFee({...p,fromClubId:null}),0);
 const c=g.clubs[g.selected];const before=c.budget;
 g.scoutShortlists={[`v184-${g.season}-${g.round}-${g.selected}`]:[{id:p.id,reason:'Senior free agent'}]};
 assert.equal(transferCandidates(g)[0].value,0);
 assert.equal(transact(g,p.id,'buy').fee,0);
 assert.equal(c.budget,before);
});

test('signing removes sign action immediately and identifies new home club without rewriting history',()=>{
 const g=newGame(1);const p=transferCandidates(g).find(p=>p.fromClubId===null);
 assert.ok(p);const source=p.fromClubId;
 const signed=transact(g,p.id,'buy');assert.equal(signed.from,'Free Agents');
 const cached=transferCandidates(g).find(x=>x.id===p.id);
 assert.equal(cached.signed,true);
 assert.equal(cached.fromClubId,g.selected);
 assert.equal(transferFee(cached),0);
 assert.ok(g.clubs[g.selected].squad.some(x=>x.id===p.id));
 assert.equal(upgradeSave(JSON.parse(JSON.stringify(g))).version,3);
 assert.equal(source,null);
});

test('transfer screens show effective fees and signed status, squad ages and discoverable releases',()=>{
 assert.match(ui,/const marketPrice=p=>p.signed\?'SIGNED':money\(transferFee\(p\)\)/);
 assert.match(ui,/p.signed\?'SIGNED'/);
 assert.match(ui,/YOUR SQUAD — SELL OR RELEASE PLAYERS/);
 assert.match(ui,/<th>Age<\/th><th>Ability<\/th><th>Interested club<\/th>/);
 assert.match(ui,/RELEASE · \$\{money\(\(p.wage\|\|0\)\*10\)\}/);
});
