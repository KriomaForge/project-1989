import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame} from '../js/engine.js';

test('League table click opens inspected club squad, then returns',async()=>{
 const g=newGame(10,1989);const handlers={};const app={innerHTML:'',addEventListener(name,fn){handlers[name]=fn;}};
 const saved=JSON.stringify(g);
 globalThis.document={querySelector:()=>app,getElementById:()=>null};globalThis.localStorage={getItem:k=>k==='project1989-save-v3'?saved:null,setItem(){}};globalThis.window={scrollTo(){}};
 try{
   await import('../js/app.js?v196');
   handlers.click({target:{closest:()=>({dataset:{nav:'league'}})}});
   assert.match(app.innerHTML,/data-inspect-club="0"/);
   handlers.click({target:{closest:()=>({dataset:{inspectClub:'0'}})}});
   assert.match(app.innerHTML,/CLUB SQUAD — Liverpool/);
   assert.match(app.innerHTML,/Age/);assert.match(app.innerHTML,/Ability/);
   assert.match(app.innerHTML,/BACK TO LEAGUE TABLE/);
   handlers.click({target:{closest:()=>({dataset:{action:'backleague'}})}});
   assert.match(app.innerHTML,/FOOTBALL LEAGUE TABLES/);
   assert.ok(g.clubs[0].squad.length>=20);
 }finally{delete globalThis.document;delete globalThis.localStorage;delete globalThis.window;}
});
test('First Division source register has exactly 20 clubs; no false opening-day approvals',()=>{
 const csv=readFileSync(new URL('../research/FIRST_DIVISION_OPENING_DAY_AUDIT.csv',import.meta.url),'utf8').trim().split(/\r?\n/);
 assert.equal(csv.length,21);
 assert.ok(csv.every((r,i)=>i===0||r.includes('NOT VERIFIED')||r.includes('NO')));
 assert.ok(csv.every((r,i)=>i===0||r.includes('/season/1990/')));
});
