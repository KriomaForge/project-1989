// Project 1989 — Matchday programme: saved facts, period-print style, no external service.
import {standings} from './engine.js';
import {groundProfile} from './ground.js';
import {ensureSupporters,supporterMood,crowdForecast} from './supporters.js';
import {managerForClub,rivalryFor} from './football-world.js';
const ordinal=n=>n+(n%100>=11&&n%100<=13?'th':({1:'st',2:'nd',3:'rd'}[n%10]||'th'));
const position=(g,c)=>{const t=standings(g,c.division);return {rank:t.findIndex(x=>x.id===c.id)+1,played:t.find(x=>x.id===c.id)?.p||0,pts:t.find(x=>x.id===c.id)?.pts||0};};
export function currentHomeFixture(g){const fx=g.fixtures?.[g.round]?.find(x=>x.includes(g.selected));return fx&&fx[0]===g.selected?fx:null;}
export function programmeForFixture(g,homeId,awayId,week=g.round){
 const home=g.clubs[homeId],away=g.clubs[awayId];if(!home||!away)throw Error('Invalid programme fixture');
 const hs=position(g,home),as=position(g,away),f=g.fixtures?.[week]?.find(x=>x[0]===homeId&&x[1]===awayId);
 const derby=rivalryFor(g,homeId,awayId),s=ensureSupporters(g,home),crowd=f?crowdForecast(g,home,week):null;
 const firstHome=!(g.results||[]).some(r=>r.home===homeId);
 const landmark=(firstHome?'home-opener':derby?'derby':hs.rank<=3&&as.rank<=5&&week>5?'title-race':week>=34&&hs.rank>=18&&as.rank>=16?'relegation':week>=39?'run-in':null);
 const guard=home.lineup?.map(id=>home.squad.find(p=>p.id===id)).filter(Boolean)||[];
 const visitors=away.lineup?.map(id=>away.squad.find(p=>p.id===id)).filter(Boolean)||[];
 const danger=[...away.squad].filter(p=>p.pos==='FWD'||p.pos==='MID').sort((a,b)=>(b.skill||0)-(a.skill||0))[0];
 const heading=derby?'BRAGGING RIGHTS ON THE LINE':landmark==='title-race'?'A BIG DAY AT THE TOP':landmark==='relegation'?'EVERY POINT COUNTS':landmark==='run-in'?'THE RUN-IN BEGINS':(landmark==='season-opener'||landmark==='home-opener')?'A NEW SEASON BEGINS':'WELCOME TO MATCH DAY';
 const opener=derby?`There is more than league position at stake when ${home.name} welcome ${away.name}. ${derby.name} has given supporters plenty to talk about.`:landmark==='title-race'?`Both clubs have their eyes on the upper reaches of the table. The outcome could influence the shape of the promotion or title race.`:landmark==='relegation'?`Both clubs need points as the season enters its decisive weeks. Nobody wants to be looking over their shoulder in May.`:(landmark==='season-opener'||landmark==='home-opener')?`The turnstiles open on a new league season, with the promise of fresh beginnings and new rivalries.`:`The visitors arrive with their own ambitions, and the home support will be hoping for a performance worth remembering.`;
 const ground=groundProfile(home),place=ground.name;
 const recent=(g.results||[]).filter(r=>r.home===homeId||r.away===homeId).slice(-4).reverse().map(r=>{const ours=r.home===homeId?r.hg:r.ag,theirs=r.home===homeId?r.ag:r.hg;return ours>theirs?'W':ours<theirs?'L':'D'}).reverse().join(' · ');
 const price='MATCHDAY PROGRAMME · '+g.season+'–'+String(g.season+1).slice(-2);
 return {id:`${g.season}-${week+1}-${homeId}-${awayId}`,season:g.season,week:week+1,homeId,awayId,home:home.name,away:away.name,venue:place,competition:'FOOTBALL LEAGUE',division:home.division,landmark,headline:heading,opener,programmeLine:price,rankHome:hs.rank,rankAway:as.rank,pointsHome:hs.pts,pointsAway:as.pts,playedHome:hs.played,playedAway:as.played,form:recent||'Season begins',manager:managerForClub(g,awayId).name,danger:danger?.name||'Visitors to watch',mood:supporterMood(s.confidence),confidence:s.confidence,attendanceForecast:crowd?.attendance??null,groundSnapshot:structuredClone(home.ground||{}),groundSeed:ground.seed,homeXI:guard.map(p=>({name:p.name,pos:p.pos})),awayXI:visitors.map(p=>({name:p.name,pos:p.pos})),hostManager:g.manager?.name||'The Manager',clubColours:[homeId,awayId]};
}
export function collectProgramme(g,item){
 if(!item||!Number.isInteger(item.homeId)||!item.id)throw Error('Invalid matchday programme');
 g.programmeArchive??=[];
 const existing=g.programmeArchive.find(p=>p.id===item.id);
 if(existing)return existing;
 const copy=structuredClone(item);
 copy.collected=true;
 g.programmeArchive.push(copy);
 return copy;
}
export function archiveProgramme(g,fixture,result){
 if(!fixture||fixture[0]!==g.selected)return null;
 const item=programmeForFixture(g,fixture[0],fixture[1],g.round);
 // Preserve manually kept ordinary editions as well as automatically archived special ones.
 const saved=(g.programmeArchive||[]).find(p=>p.id===item.id);
 if(!item.landmark&&!saved)return null;
 item.finalScore=`${result.hg}–${result.ag}`;item.result={hg:result.hg,ag:result.ag};
 const existing=(g.programmeArchive||[]).find(p=>p.id===item.id);
 if(existing){existing.finalScore=item.finalScore;existing.result=item.result;return existing;}
 return collectProgramme(g,item);
}
export function programmeArchive(g){return Array.isArray(g.programmeArchive)?g.programmeArchive:[];}
