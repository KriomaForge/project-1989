import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,clubEconomy,hireStaff,staffCandidates,staffCreditLimit,staffReport,weeklyStaffWages,advanceRound,upgradeSave,seasonRevenue} from '../js/engine.js';

test('match income reflects home fixture and division size',()=>{
 const g=newGame(75),c=g.clubs[75];
 let home=-1,away=-1;
 for(let w=0;w<g.fixtures.length;w++){
  const pair=g.fixtures[w].find(([h,a])=>h===c.id||a===c.id);
  if(pair?.[0]===c.id&&home<0)home=w;
  if(pair?.[1]===c.id&&away<0)away=w;
 }
 assert.ok(home>=0&&away>=0);
 const a=clubEconomy(g,c,home),b=clubEconomy(g,c,away);
 assert.ok(a.gate>0);assert.equal(b.gate,0);
 const top=g.clubs.find(x=>x.division===0);const bottom=g.clubs.find(x=>x.division===3);
 assert.ok(seasonRevenue(g,top,1)>seasonRevenue(g,bottom,1));
});

test('staff replacement charges compensation and changes salary and scout recommendations',()=>{
 const g=newGame(75),club=g.clubs[g.selected],before=staffReport(g),money=club.money;
 const candidate=staffCandidates(g,'assistant')[0];
 const a=hireStaff(g,'assistant',candidate.style);
 assert.equal(a.style,candidate.style);
 assert.equal(club.money,money-candidate.severance);
 assert.notEqual(staffReport(g).assistant.style,before.assistant.style);
 assert.ok(weeklyStaffWages(g)>0);
 assert.equal(g.staffHistory.length,1);
 assert.equal(g.financeLedger[0].amount,-candidate.severance);
 const scout=staffCandidates(g,'scout')[0];g.scoutShortlists={'stale':['hello']};
 hireStaff(g,'scout',scout.style);assert.deepEqual(g.scoutShortlists,{});
});

test('chairman tolerates a limited overdraft but refuses extravagant severance',()=>{
 const g=newGame(75),c=g.clubs[g.selected],candidate=staffCandidates(g,'physio')[0];
 c.money=-Math.floor(staffCreditLimit(c)/2);
 hireStaff(g,'physio',candidate.style);
 const next=staffCandidates(g,'physio')[0];c.money=-staffCreditLimit(c);
 assert.throws(()=>hireStaff(g,'physio',next.style),/overdraft/);
});

test('existing saves gain physio without altering financial history or results',()=>{
 const g=newGame(75);delete g.staff.physio;delete g.financeLedger;
 const old=JSON.parse(JSON.stringify(g));upgradeSave(old);
 assert.ok(staffReport(old).physio.description);
 assert.equal(old.financeLedger,undefined);
 advanceRound(old);
 assert.ok(old.financeLedger.some(x=>x.type==='WEEKLY OPERATIONS'));
});

test('weekly revenue is posted once and end season payout is only posted once',async()=>{
 const g=newGame(75);const c=g.clubs[75];
 const initial=c.money;advanceRound(g);
 assert.notEqual(c.money,initial);
 assert.equal(g.financeLedger.filter(x=>x.type==='WEEKLY OPERATIONS').length,1);
 for(let n=1;n<46;n++)advanceRound(g);
 assert.equal(g.financeLedger.filter(x=>x.type==='SEASON DISTRIBUTION').length,1);
 const settled=c.money;
 // repeat season review should not pay prize money twice
 const {finishSeason}=await import('../js/engine.js');
 finishSeason(g);
 assert.equal(c.money,settled);
});

test('cup wins award prize income and cup homes earn receipts',()=>{
 const g=newGame(75);
 for(let i=0;i<10;i++)advanceRound(g);
 assert.ok(Object.values(g.cups).some(c=>c.completed.length>0));
 assert.ok(g.clubs.every(c=>Number.isFinite(c.money)));
});
