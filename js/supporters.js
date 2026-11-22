import {ensureGround,groundBenefits,activeBuildingImpact} from './ground-development.js';
// Project 1989 v1.15 — intentionally light-touch supporter and gate model.
// These are invented game parameters, NOT historical 1989 attendance or ticket figures.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function ensureSupporters(g,c){
 if(!c.supporters || typeof c.supporters!=='object')c.supporters={confidence:62,ticket:'standard',lastAttendance:0,homeGames:0,peakAttendance:0,history:[]};
 const s=c.supporters;
 s.confidence=clamp(Number.isFinite(s.confidence)?s.confidence:62,0,100);
 if(!['value','standard','premium'].includes(s.ticket))s.ticket='standard';
 s.history??=[];s.lastAttendance??=0;s.homeGames??=0;s.peakAttendance??=0;
 return s;
}
export function supporterMood(score){return score>=85?'Delighted':score>=70?'Pleased':score>=55?'Hopeful':score>=40?'Restless':score>=25?'Frustrated':'Angry';}
export function ticketDetails(tier){return ({value:{price:0.85,demand:1.12,label:'Value'},standard:{price:1,demand:1,label:'Standard'},premium:{price:1.18,demand:0.86,label:'Premium'}})[tier]||{price:1,demand:1,label:'Standard'};}
export function crowdForecast(g,c,week=g.round){
 const s=ensureSupporters(g,c),t=ticketDetails(s.ticket),home=(g.fixtures?.[week]||[]).find(([h])=>h===c.id);
 const ground=ensureGround(c);const disruption=activeBuildingImpact(c);const capacity=Math.round(ground.capacity*(1-disruption));const benefits=groundBenefits(c);
 // A home game against a good opponent, a high league position or an improved
 // supporters' mood lifts demand. All figures are fictional planning estimates.
 const rival=home?g.clubs?.[home[1]]:null;
 const last=(g.results||[]).filter(x=>x.home===c.id||x.away===c.id).slice(-5);
 const form=last.length?last.reduce((n,x)=>n+(x.home===c.id?(x.hg>x.ag?3:x.hg===x.ag?1:0):(x.ag>x.hg?3:x.hg===x.ag?1:0)),0)/(last.length*3):.45;
 const demand=clamp(.71 + .20*(s.confidence-50)/50 + .14*(form-.5) + (rival?.rating>c.rating+6?.045:0) + benefits.comfort*.002,.35,.99)*t.demand;
 const attendance=home?Math.round(capacity*clamp(demand,.24,1)):0;
 // Normalise baseline against typical ~75% occupancy, so a small club isn't
 // pushed into instant insolvency purely by an illustrative capacity setting.
 const extraCapacity=Math.max(0,capacity-ground.originalCapacity);const gateFactor=home?clamp((attendance/(ground.originalCapacity*.75))*t.price,.10,1.18+Math.min(.30,extraCapacity/ground.originalCapacity*.70)):0;
 return {capacity,fullCapacity:ground.capacity,disruption,attendance,occupancy:capacity?attendance/capacity:0,gateFactor,ticket:t,home:!!home,mood:supporterMood(s.confidence),confidence:s.confidence};
}
export function setTicketPolicy(g,c,policy){if(!['value','standard','premium'].includes(policy))throw Error('Unknown ticket policy');ensureSupporters(g,c).ticket=policy;return policy;}
export function recordCrowdWeek(g,week,completed){
 const played=new Map(completed.flatMap(m=>[[m.home,{goals:m.hg,conceded:m.ag,home:true,other:m.away}],[m.away,{goals:m.ag,conceded:m.hg,home:false,other:m.home}]]));
 const news=[];
 for(const c of g.clubs){
  const s=ensureSupporters(g,c),m=played.get(c.id);if(!m)continue;
  const old=s.confidence;
  const result=m.goals>m.conceded?1:m.goals<m.conceded?-1:0;
  // A win matters more after a lean spell, and heavy home losses hurt.
  let delta=result>0?4:result<0?-4:0;
  if(result<0&&m.home&&m.conceded-m.goals>=3)delta-=3;
  if(result>0&&m.home&&m.goals-m.conceded>=3)delta+=2;
  if(result===0)delta+=(s.confidence<45?1:0);
  if(s.ticket==='premium')delta-=m.home?1:0;
  if(s.ticket==='value'&&m.home)delta+=1;
  s.confidence=clamp(Math.round(s.confidence+delta),12,96);
  // Only the selected manager's club keeps a full match-by-match attendance log.
  if(m.home){const f=crowdForecast(g,c,week);s.lastAttendance=f.attendance;s.peakAttendance=Math.max(s.peakAttendance,f.attendance);s.homeGames++;if(c.id===g.selected){s.history.push({season:g.season,week:week+1,attendance:f.attendance,capacity:f.capacity,confidence:s.confidence,score:m.goals+'-'+m.conceded});s.history=s.history.slice(-110);}}
  if(c.id===g.selected){
   // Small crowd effects, never a replacement for the match/manager engine.
   if((old>=40&&s.confidence<40)||(old<70&&s.confidence>=70)){
    const direction=s.confidence>=70?1:-1;
    for(const p of c.squad.filter(p=>c.lineup.includes(p.id)))p.morale=clamp((p.morale??70)+direction,15,100);
   }
   if(s.confidence<28&&week%4===0&&g.manager)g.manager.security=clamp((g.manager.security??65)-1,0,100);
   if(result<0&&m.home&&m.conceded-m.goals>=3)news.push({headline:'BOOS FROM THE TERRACES',body:`${c.name} suffered a heavy home defeat, ${m.goals}–${m.conceded}. Supporters voiced their frustration as the final whistle sounded. The manager faces a difficult week, with supporter confidence now ${supporterMood(s.confidence).toLowerCase()}.`});
   else if(result>0&&m.home&&s.confidence>=85&&old<85)news.push({headline:'THE TERRACES ARE SINGING AGAIN',body:`A home victory has lifted the mood at ${c.name}. The supporters are delighted and the club is enjoying a warmer reception from the stands.`});
  }
 }
 return news;
}
