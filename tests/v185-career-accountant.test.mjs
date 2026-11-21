import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame,advanceRound,newSeason,careerSummary,accountantReport,upgradeSave,acceptJob,transact,transferCandidates} from '../js/engine.js';

test('career record counts league wins, draws and losses and follows new employers',()=>{
 const g=newGame(10,2819),first=g.selected;
 for(let n=0;n<5;n++)advanceRound(g);
 let stats=careerSummary(g);
 assert.equal(stats.total.played,5);
 assert.equal(stats.total.played,stats.total.won+stats.total.drawn+stats.total.lost);
 assert.equal(stats.teams.find(x=>x.clubId===first).played,5);
 const second=g.clubs.find(c=>c.id!==first).id;
 g.manager.offers=[{clubId:second,season:g.season,week:g.round}];
 acceptJob(g,second);
 advanceRound(g);
 stats=careerSummary(g);
 assert.equal(stats.teams.find(x=>x.clubId===first).played,5);
 assert.equal(stats.teams.find(x=>x.clubId===second).played,1);
});

test('record survives career save upgrade and season change without changing save version',()=>{
 const g=newGame(10,3643);
 for(let i=0;i<46;i++){g.manager.security=100;advanceRound(g);}
 const before=careerSummary(g);
 assert.equal(g.manager.record.matches.filter(x=>x.competition==='LEAGUE').length,38);
 assert.ok(before.total.played>=38);
 assert.ok(Array.isArray(before.honours));
 newSeason(g);
 const loaded=upgradeSave(structuredClone(g));
 assert.equal(loaded.version,3);
 assert.equal(careerSummary(loaded).total.played,before.total.played);
 advanceRound(loaded);
 assert.ok(careerSummary(loaded).total.played>=before.total.played);
});

test('older v3 career marks unavailable history without inventing it',()=>{
 const g=newGame(10,3251);
 advanceRound(g);
 delete g.manager.record;
 g.history.push({season:1988});
 const restored=upgradeSave(structuredClone(g));
 const summary=careerSummary(restored);
 assert.equal(summary.legacy,true);
 assert.equal(summary.total.played,0);
});

test('accountant offers contextual report and is not a recruitable staff slot',()=>{
 const g=newGame(10),c=g.clubs[g.selected];
 let report=accountantReport(g);
 assert.equal(report.name,'Margaret Ellis');
 assert.equal(report.recordedWeeks,0);
 assert.match(report.context,/more weeks/i);
 c.money=-50000;
 report=accountantReport(g);
 assert.match(report.advice,/overdraft/i);
 advanceRound(g);
 report=accountantReport(g);
 assert.equal(report.recordedWeeks,1);
 assert.ok(report.explanation.length>80);
 assert.equal(g.staff.accountant,undefined);
});

test('manager, finance and backroom navigation is immediately discoverable',()=>{
 const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(source,/BACKROOM STAFF · HIRE & REPLACE/);
 assert.match(source,/HIRE \/ REPLACE ASSISTANT, SCOUT OR PHYSIO/);
 assert.match(source,/THE CLUB ACCOUNTANT/);
 assert.match(source,/CAREER RECORD/);
 assert.match(source,/HONOURS & ACCOMPLISHMENTS/);
});
