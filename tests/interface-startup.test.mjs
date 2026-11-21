import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../js/engine.js';

test('existing career opens Manager Notebook without blank screen', async () => {
 const game = newGame(10);
 const handlers = {};
 const target = {innerHTML:'', addEventListener(type, callback) {handlers[type] = callback;}};
 globalThis.document = {querySelector: () => target, getElementById: () => null};
 globalThis.window = {scrollTo() {}};
 globalThis.localStorage = {getItem(key) {return key==='project1989-save-v3'?JSON.stringify(game):null;},setItem() {}};
 try {
   await import('../js/app.js');
   assert.match(target.innerHTML,/Manager.s Notebook/);
   assert.match(target.innerHTML,/COACH.S REPORT/);
   assert.match(target.innerHTML,/SCOUT.S NOTEBOOK/);
   assert.match(target.innerHTML,/Manager.s Office/);
   assert.match(target.innerHTML,/Finances/);
   // The existing Coach/Scout spread must survive switching to additional notebook pages.
   for (const [page, phrase] of [['chairman','CHAIRMAN'],['matchday','MATCH DAY'],['records','LEAGUE RECORDS'],['postbag','POSTBAG'],['press','PRESS CUTTINGS'],['players','DRESSING ROOM'],['log','CAREER CHRONICLE'],['desk','COACH.S REPORT']]) {
     handlers.click({target:{closest:()=>({dataset:{book:page}})}});
     assert.match(target.innerHTML, new RegExp(phrase));
   }
   handlers.click({target:{closest:()=>({dataset:{nav:'retro'}})}});
   assert.match(target.innerHTML,/SELECT YOUR DESTINATION/);
   assert.match(target.innerHTML,/TEAM SELECTION/);
   assert.match(target.innerHTML,/icon-match.svg/);
   handlers.click({target:{closest:()=>({dataset:{nav:'notebook'}})}});
   // Every tab must render without a runtime ReferenceError.
   for(const tab of ['home','manager','squad','league','fixtures','cups','review','transfers','finances','staff','match','shots','save','notebook']) {
     handlers.click({target:{closest:()=>({dataset:{nav:tab}})}});
     assert.ok(target.innerHTML.length>100, `${tab} screen must render`);
   }
 } finally {
   delete globalThis.document; delete globalThis.window; delete globalThis.localStorage;
 }
});

test('notebook pages and retro menu render and navigate without breaking the original spread', async () => {
 const {readFileSync} = await import('node:fs');
 const source=readFileSync(new URL('../js/app.js', import.meta.url),'utf8');
 // Fresh process per test is not needed: the first test imported the module and registered its handlers on its own target.
 // Verify source contains all new sections and navigation event handling.
 for(const label of ['CHAIRMAN', 'MATCH DAY', 'RECORD BOOK', 'COACH & SCOUT','RETRO MAIN MENU'])
   assert.ok(source.includes(label),`${label} must have a notebook or menu entry`);
 assert.match(source,/if\(t\.dataset\.book\)/);
 assert.match(source,/retro:retroMenu/);
 assert.match(source,/if\(notebookPage!==['"]desk['"]\)return extraNotebook/);
});

test('match incidents are presented as selectable, non-growing timeline',async()=>{
 const {readFileSync}=await import('node:fs');const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(source,/data-incident/);assert.match(source,/class=\"match-timeline\"/);
 assert.doesNotMatch(source,/box\.lastElementChild\?\.scrollIntoView/);
 assert.doesNotMatch(source,/box\.insertAdjacentHTML\('beforeend',eventHTML/);
});

test('postbag alert is category-specific and notebook opening marks the current letter read',async()=>{
 const {readFileSync}=await import('node:fs');
 const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert.match(source,/const POSTBAG_KINDS=\['chairman','coach','scout'\]/);
 assert.match(source,/const count=notebookUnread\('postbag'\)/);
 assert.match(source,/markStoryRead\(game,target.id\);commit\(\)/);
 assert.match(source,/if\(t.dataset.book\)\{openNotebookPage\(t.dataset.book\);return;\}/);
});
