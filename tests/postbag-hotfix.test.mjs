import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../js/engine.js';
import {addStory,unreadStoryCount} from '../js/story.js';

test('notebook notifications lead to matching unread letters; opening marks read and keeps press alerts separate',async()=>{
 const g=newGame(10);
 // New game has one chairman welcome letter and a separate press story.
 addStory(g,'coach','TRAINING REPORT','Coach would like to speak.');
 assert.equal(unreadStoryCount(g,['chairman','coach','scout']),2);
 assert.equal(unreadStoryCount(g,['press']),1);
 let saved;
 const callbacks={};
 const root={innerHTML:'',addEventListener(k,fn){callbacks[k]=fn;}};
 globalThis.document={querySelector:()=>root,getElementById:()=>null};
 globalThis.window={scrollTo(){}};
 globalThis.localStorage={getItem(k){return k==='project1989-save-v3'?(saved??JSON.stringify(g)):null;},setItem(k,value){saved=value;}};
 try{
  await import('../js/app.js?postbag-hotfix-test');
  assert.match(root.innerHTML,/2 unread letters in your postbag/);
  assert.match(root.innerHTML,/PRESS CUTTINGS <span class="book-unread"[^>]*>1<\/span>/);
  callbacks.click({target:{closest:()=>({dataset:{book:'postbag'}})}});
  assert.match(root.innerHTML,/TRAINING REPORT/);
  assert.match(root.innerHTML,/1 unread/); // remaining chairman correspondence
  const one=JSON.parse(saved);
  assert.equal(unreadStoryCount(one,['chairman','coach','scout']),1);
  assert.equal(unreadStoryCount(one,['press']),1);
  callbacks.click({target:{closest:()=>({dataset:{book:'postbag'}})}});
  const two=JSON.parse(saved);
  assert.equal(unreadStoryCount(two,['chairman','coach','scout']),0);
  assert.equal(unreadStoryCount(two,['press']),1);
  callbacks.click({target:{closest:()=>({dataset:{book:'desk'}})}});
  assert.doesNotMatch(root.innerHTML,/unread letters in your postbag/);
  assert.match(root.innerHTML,/PRESS CUTTINGS <span class="book-unread"[^>]*>1<\/span>/);
  callbacks.click({target:{closest:()=>({dataset:{book:'press'}})}});
  assert.equal(unreadStoryCount(JSON.parse(saved),['press']),0);
 }finally{delete globalThis.document;delete globalThis.window;delete globalThis.localStorage;}
});
