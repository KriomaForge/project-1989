import {emergingRivalryFor} from './regional-press.js';
// Project 1989 — fictional rival managers and historical club rivalry identities.
// Historical rivalry pairs are real; ALL manager names and quotes are invented.
// For PES-style worlds the same stable ID pairings form fictional regional derbies.
const RIVALRIES=[
 ['Liverpool','Everton','Merseyside derby'],['Arsenal','Tottenham Hotspur','North London derby'],
 ['Manchester United','Manchester City','Manchester derby'],['Aston Villa','Birmingham City','Second City derby'],
 ['Liverpool','Manchester United','North-West rivalry'],['Nottingham Forest','Derby County','East Midlands derby'],
 ['Newcastle United','Sunderland','Tyne–Wear derby'],['Sheffield United','Sheffield Wednesday','Steel City derby'],
 ['West Bromwich Albion','Wolverhampton Wanderers','Black Country derby'],
 ['Bristol City','Bristol Rovers','Bristol derby'],['Portsmouth','Southampton','South Coast derby'],
 ['Ipswich Town','Norwich City','East Anglian derby'],['Blackburn Rovers','Burnley','East Lancashire derby'],
 ['Stoke City','Port Vale','Potteries derby'],['Wrexham','Chester City','border derby'],
 ['Lincoln City','Grimsby Town','Lincolnshire derby'],['Oxford United','Swindon Town','A420 rivalry'],
 ['Brighton & Hove Albion','Crystal Palace','M23 rivalry'],['Watford','Luton Town','Beds–Herts derby'],
 ['Leeds United','Manchester United','Roses rivalry'],['Exeter City','Plymouth Argyle','Devon derby'],
 ['Middlesbrough','Newcastle United','North-East rivalry'],['Cardiff City','Swansea City','South Wales derby'],
 ['Bolton Wanderers','Bury','Lancashire neighbours']
];
const FIRST=['Arthur','Frank','Brian','Terry','Graham','Dennis','Alan','Martin','Colin','George','Peter','Ron','Derek','Gordon','Dave','Clive','Jack','Harry','Ray','Bob','Stan','Les'];
const LAST=['Hardwick','Baxter','Whitmore','Pritchard','Sutton','Granger','Hollis','Beaumont','Fletcher','Reeves','Morton','Keating','Simmonds','Wilcox','Marsden','Hargreaves','Bolton','Fairclough','Foster','Radcliffe','Tucker','Dawson'];
const STYLES=['wary tactician','blunt traditionalist','ambitious organiser','demanding disciplinarian','measured strategist','touchline firebrand'];
export function managerForClub(g,id){
 const c=g.clubs[id];if(!c)return null;
 const appointed=g.oppositionAppointments?.[id];
 if(appointed?.name)return {...appointed,clubId:id,fictional:true};
 const seed=Number.isFinite(g.seed)?Math.trunc(g.seed):1989;
 const a=Math.abs((id*137+seed*7+313)>>>0),b=Math.abs((id*173+seed*11+71)>>>0);
 return {name:`${FIRST[a%FIRST.length]} ${LAST[b%LAST.length]}`,style:STYLES[(id+Math.abs(seed))%STYLES.length],fictional:true,clubId:id};
}
export function rivalryFor(g,a,b){
 if(!g.clubs[a]||!g.clubs[b]||a===b)return null;
 const x=g.clubs[a],y=g.clubs[b];
 const ax=x.historicalName||x.name,by=y.historicalName||y.name;
 const item=RIVALRIES.find(([one,two])=>(ax===one&&by===two)||(ax===two&&by===one));
 const alternate=g.careerMode==='alternate';
 // Fictional worlds also have an invented rivalry for clubs not in a historic pair.
 // Adjacent original-division slots form stable reciprocal grudge pairs.
 const sameDivision=x.division===y.division;
 const peers=g.clubs.filter(c=>c.division===x.division).sort((a,b)=>a.id-b.id);
 const ix=peers.findIndex(c=>c.id===a),iy=peers.findIndex(c=>c.id===b);
 const invented=alternate&&sameDivision&&ix>=0&&iy>=0&&Math.floor(ix/2)===Math.floor(iy/2)&&ix!==iy;
 if(!item&&!invented)return emergingRivalryFor(g,a,b);
 const grudgeNames=['Old Boundary derby','Saturday grudge match','County Line derby','Railway Cup rivalry','Two Towns derby','The Old Road derby'];
 return {name:alternate?grudgeNames[(Math.min(a,b)+Math.max(a,b))%grudgeNames.length]:item[2],fictional:alternate,
  description:alternate?`A fierce local rivalry between ${x.name} and ${y.name}, with pride and bragging rights at stake.`:`A long-standing meeting between ${x.name} and ${y.name}.`};
}
export function derbyRecord(g,a,b){
 const meetings=(g.results||[]).filter(r=>(r.home===a&&r.away===b)||(r.home===b&&r.away===a));
 return {played:meetings.length,wins:meetings.filter(r=>r.home===a?r.hg>r.ag:r.ag>r.hg).length,
  draws:meetings.filter(r=>r.hg===r.ag).length,losses:meetings.filter(r=>r.home===a?r.hg<r.ag:r.ag<r.hg).length};
}

// Persistent rivalry archive stores completed LEAGUE fixtures only. Current season
// fixtures live in g.results, so there is no double-counting on save/load.
export function rivalryMeetings(g,a,b){
 const match=r=>(r.home===a&&r.away===b)||(r.home===b&&r.away===a);
 return [...(g.rivalryHistory||[]).filter(match),...(g.results||[]).filter(match).map(r=>({...r,season:g.season}))];
}
export function careerDerbyRecord(g,a,b){
 const meetings=rivalryMeetings(g,a,b),wins=meetings.filter(r=>r.home===a?r.hg>r.ag:r.ag>r.hg).length;
 const losses=meetings.filter(r=>r.home===a?r.hg<r.ag:r.ag<r.hg).length;
 const draws=meetings.length-wins-losses;
 const last=meetings.at(-1)||null,previous=meetings.at(-2)||null;
 let streak=0,trend='';
 for(let i=meetings.length-1;i>=0;i--){const r=meetings[i],out=r.hg===r.ag?'D':(r.home===a?r.hg>r.ag:r.ag>r.hg)?'W':'L';if(!trend)trend=out;if(out!==trend)break;streak++;}
 return {played:meetings.length,wins,draws,losses,last,previous,streak,trend};
}
export function rivalryDossier(g,clubId){
 return g.clubs.filter(c=>c.id!==clubId).map(c=>({club:c,rivalry:rivalryFor(g,clubId,c.id),record:careerDerbyRecord(g,clubId,c.id)}))
  .filter(x=>x.rivalry).sort((a,b)=>b.record.played-a.record.played||a.club.name.localeCompare(b.club.name));
}
export function managerialDuels(g,opponentId){
 const incumbent=managerForClub(g,opponentId).name;const games=(g.managerDuels||[]).filter(x=>x.opponentManager===incumbent||(x.opponentId===opponentId&&!x.opponentManager));
 const wins=games.filter(x=>x.gf>x.ga).length,losses=games.filter(x=>x.gf<x.ga).length;
 return {played:games.length,wins,draws:games.length-wins-losses,losses,last:games.at(-1)||null};
}
