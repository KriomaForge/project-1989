import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,advanceRound,transact,transferCandidates,upgradeSave} from '../js/engine.js';
import {ensureStory,weeklyStory,answerStory,markStoryRead,unreadStoryCount} from '../js/story.js';
test('a new career has letters, and weekly reports are idempotent',()=>{
 const g=newGame();assert.equal(g.story.items.length,2);advanceRound(g);const n=g.story.items.length;assert.ok(n>2);weeklyStory(g);assert.equal(g.story.items.length,n);
});
test('losing three games produces a board letter and a choice',()=>{
 const g=newGame(),c=g.clubs[g.selected];g.round=3;
 g.matchReports=[0,1,2].map(i=>({competition:'LEAGUE',home:c.id,away:(c.id+1)%92,hg:0,ag:2,seed:i}));
 weeklyStory(g);const item=g.story.items.find(x=>x.headline.includes('BOARD EXPECT BETTER'));assert.ok(item);const before=g.manager.security;answerStory(g,item.id,'reassure');assert.equal(g.manager.security,before+3);assert.throws(()=>answerStory(g,item.id,'reassure'),/no longer available/);
});
test('private player conversation can affect player morale',()=>{
 const g=newGame();g.round=3;g.matchReports=[{competition:'LEAGUE',home:g.selected,away:(g.selected+1)%92,hg:1,ag:1}];weeklyStory(g);
 const event=g.story.items.find(x=>x.kind==='player');assert.ok(event);const p=g.clubs[g.selected].squad.find(x=>x.id===event.playerId),old=p.morale;answerStory(g,event.id,'support');assert.equal(p.morale,Math.min(100,old+8));
});
test('saved legacy v3 gets story data without changing squads',()=>{
 const g=newGame();const old=structuredClone(g),n=old.clubs[g.selected].squad.length;delete old.story;upgradeSave(old);assert.equal(old.clubs[g.selected].squad.length,n);assert.deepEqual(old.story.items,[]);
});
test('signing a player records a scout entry and journal read state',()=>{
 const g=newGame(),p=transferCandidates(g)[0],c=g.clubs[g.selected];c.budget=1e8;c.money=1e8;transact(g,p.id,'buy');const story=g.story.items[0];assert.equal(story.kind,'scout');const count=unreadStoryCount(g);markStoryRead(g,story.id);assert.equal(unreadStoryCount(g),count-1);
});
test('coach advice changes fitness once and is preserved as a decision',()=>{
 const g=newGame(),c=g.clubs[g.selected];g.round=2;g.matchReports=[{competition:'LEAGUE',home:g.selected,away:(g.selected+1)%92,hg:1,ag:1}];weeklyStory(g);
 const item=g.story.items.find(x=>x.kind==='coach'&&x.options?.some(y=>y.id==='rotate'));
 assert.ok(item,'dynamic coach conversation should appear');const before=c.squad.map(p=>p.fitness);
 answerStory(g,item.id,'rotate');assert.equal(item.choice,'rotate');assert.ok(c.squad.every((p,i)=>p.fitness>=before[i]));
 assert.throws(()=>answerStory(g,item.id,'rotate'));
});
test('boardroom discussion offers new distinct choices with stored consequences',()=>{
 const g=newGame();g.round=4;g.matchReports=[{competition:'LEAGUE',home:g.selected,away:(g.selected+1)%92,hg:1,ag:0}];weeklyStory(g);
 const item=g.story.items.find(x=>x.headline==='AN INVITATION TO THE BOARDROOM');assert.ok(item);const old=g.manager.security;
 answerStory(g,item.id,'budget');assert.equal(g.manager.security,Math.min(100,old+3));assert.match(item.outcome,/financial/);
});
