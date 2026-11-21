import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,advanceRound} from '../js/engine.js';

test('completed-season Season Review renders clubs and cup winners without crashing', async () => {
 const g=newGame(10);for(let i=0;i<46;i++)advanceRound(g);
 const callbacks={};const app={innerHTML:'',addEventListener:(name,cb)=>{callbacks[name]=cb;}};
 const storage=new Map([['project1989-save-v3',JSON.stringify(g)]]);
 globalThis.document={querySelector:()=>app,getElementById:()=>null};
 globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val)};
 globalThis.window={scrollTo(){}};
 try {
  await import('../js/app.js?v193');
  callbacks.click({target:{closest:()=>({dataset:{nav:'review'}})}});
  assert.match(app.innerHTML,/SEASON REVIEW/);
  assert.match(app.innerHTML,/CUP WINNERS/);
  assert.match(app.innerHTML,/FA Cup/);
  assert.match(app.innerHTML,/League Cup/);
  // Old or incomplete historical save entries must not blank the screen.
  g.history.at(-1).playoffs={};g.history.at(-1).cupWinners=null;
  storage.set('project1989-save-v3',JSON.stringify(g));
  callbacks.click({target:{closest:()=>({dataset:{nav:'newgame'}})}});
  assert.match(app.innerHTML,/START A NEW CAREER/);
  assert.match(app.innerHTML,/REAL NAMES/);
  assert.match(app.innerHTML,/PES-STYLE ENGLISH LEAGUES/);
  callbacks.click({target:{closest:()=>({dataset:{nav:'save'}})}});
  assert.match(app.innerHTML,/NEW GAME — CHOOSE FOOTBALL WORLD/);
  assert.doesNotMatch(app.innerHTML,/not compatible with v1\.0|separate browser save from v0\.1/i);
  callbacks.click({target:{closest:()=>({dataset:{nav:'review'}})}});
  assert.match(app.innerHTML,/SEASON REVIEW/);
 } finally {delete globalThis.document;delete globalThis.localStorage;delete globalThis.window;}
});
