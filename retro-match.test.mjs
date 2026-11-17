import test from 'node:test';
import assert from 'node:assert/strict';
import {scenePlan,drawRetroScene,stopRetroScene} from '../js/retro-match.js';
import {newGame,simulateMatch} from '../js/engine.js';

test('pixel replay uses existing match events rather than changing game scores',()=>{
  const game=newGame(10),a=game.clubs[10],b=game.clubs[11],match=simulateMatch(a,b,12345);
  const before=JSON.stringify(match),event=match.events.find(x=>x.type==='goal'||x.type==='chance');
  assert.ok(event,'expected a shot or goal incident');
  const plan=scenePlan(match,event);
  assert.equal(plan.type,event.type);
  assert.equal(plan.attacking,event.team===match.home);
  assert.equal(plan.goal,event.type==='goal');
  assert.equal(plan.variant,scenePlan(match,event).variant);
  drawRetroScene(null,match,event);
  assert.equal(JSON.stringify(match),before);
});

test('pixel replayer draws at exactly 320 x 180 and safely supports replay cancellation',()=>{
  const game=newGame(10),m=simulateMatch(game.clubs[10],game.clubs[11],188);
  const calls=[];
  const ctx={clearRect(){calls.push('clear')},fillRect(){calls.push('fill')},strokeRect(){calls.push('stroke')},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set font(v){},set imageSmoothingEnabled(v){}};
  const canvas={width:320,height:180,getContext(k){assert.equal(k,'2d');return ctx}};
  drawRetroScene(canvas,m,m.events[0]);
  assert.ok(calls.includes('fill')&&calls.includes('stroke'));
  stopRetroScene();
});
