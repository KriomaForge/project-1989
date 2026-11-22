import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,advanceRound,newSeason} from '../js/engine.js';
import {managerProfile} from '../js/manager-world.js';
test('public package contains no bundled researched player records',()=>{const text=fs.readFileSync(new URL('../js/historical-1989-data.js',import.meta.url),'utf8');assert.match(text,/HISTORICAL_1989_DATA=\[\]/);assert.throws(()=>newGame(0,1989,'historical'),/permission/);});
test('generated-player and alternative worlds can play a full season',()=>{for(const mode of ['fictional','alternate']){const g=newGame(0,1989,mode);for(let i=0;i<46;i++)advanceRound(g);assert.equal(g.history.length,1);assert.ok(g.history[0].edition.perspectives.fans);assert.equal(g.status,'finished');assert.ok(managerProfile(g,1).name);newSeason(g);assert.equal(g.season,1990);}});
test('build and sources is accessible on the home screen and main toolbar',()=>{const app=fs.readFileSync(new URL('../js/app.js',import.meta.url),'utf8');assert.ok((app.match(/BUILD_AND_SOURCES.html/g)||[]).length>=2);});
