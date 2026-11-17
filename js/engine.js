import {ensureStory,createWelcomeStory,weeklyStory,addStory} from './story.js';
// Project 1989 v0.2 — source-informed 1989/90 clubs; fictional players and results.
const DIV_NAMES=['First Division','Second Division','Third Division','Fourth Division'];
export {DIV_NAMES};
const DIVISIONS=[
['Liverpool','Aston Villa','Tottenham Hotspur','Arsenal','Chelsea','Everton','Southampton','Wimbledon','Nottingham Forest','Norwich City','Queens Park Rangers','Coventry City','Manchester United','Manchester City','Crystal Palace','Derby County','Luton Town','Sheffield Wednesday','Charlton Athletic','Millwall'],
['Leeds United','Sheffield United','Newcastle United','Swindon Town','Blackburn Rovers','Sunderland','West Ham United','Oldham Athletic','Ipswich Town','Wolverhampton Wanderers','Port Vale','Portsmouth','Leicester City','Hull City','Watford','Plymouth Argyle','Oxford United','Brighton & Hove Albion','Barnsley','West Bromwich Albion','Middlesbrough','AFC Bournemouth','Bradford City','Stoke City'],
['Bristol Rovers','Bristol City','Notts County','Tranmere Rovers','Bury','Bolton Wanderers','Birmingham City','Huddersfield Town','Rotherham United','Reading','Shrewsbury Town','Crewe Alexandra','Brentford','Leyton Orient','Mansfield Town','Chester City','Swansea City','Wigan Athletic','Preston North End','Fulham','Cardiff City','Northampton Town','Blackpool','Walsall'],
['Exeter City','Grimsby Town','Southend United','Stockport County','Maidstone United','Cambridge United','Chesterfield','Carlisle United','Peterborough United','Lincoln City','Scunthorpe United','Rochdale','York City','Gillingham','Torquay United','Burnley','Hereford United','Scarborough','Hartlepool United','Doncaster Rovers','Wrexham','Aldershot','Halifax Town','Colchester United']];
export const CLUBS=DIVISIONS.flatMap((names,div)=>names.map((name,i)=>({id:DIVISIONS.slice(0,div).reduce((n,a)=>n+a.length,0)+i,name,division:div})));
export const FORMATIONS={'4-4-2':{GK:1,DEF:4,MID:4,FWD:2},'4-3-3':{GK:1,DEF:4,MID:3,FWD:3},'5-3-2':{GK:1,DEF:5,MID:3,FWD:2}};
export function rng(seed){let s=seed>>>0;return ()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296)}
const first=['Alan','Steve','Gary','Mark','David','Paul','Ian','John','Chris','Kevin','Peter','Tony','Neil','Brian','Andy','Simon','Martin','Graham','Phil','Darren'];
const last=['Baker','Hughes','Williams','Taylor','Smith','Jones','Brown','Evans','Davies','Roberts','Wilson','Walker','Turner','White','Hall','Wood','Cooper','King','Green','Hill'];
const rand=(r,a,b)=>a+Math.floor(r()*(b-a+1));
function player(id,pos,r,div=3){const skill=rand(r,38,70)+(3-div)*5;return {id,name:first[rand(r,0,19)]+' '+last[rand(r,0,19)],pos,skill,fitness:100,morale:70,injured:0,goals:0,wage:rand(r,80,350)*(4-div),value:rand(r,5,55)*1000*(4-div)};}
export function makeFixtures(ids=Array.from({length:24},(_,i)=>i)){const n=ids.length,arr=[...ids],rounds=[];if(n%2)throw Error('Even number of teams required');for(let k=0;k<n-1;k++){const round=[];for(let j=0;j<n/2;j++){const a=arr[j],b=arr[n-1-j];round.push((k+j)%2?[b,a]:[a,b]);}rounds.push(round);arr.splice(1,0,arr.pop());}return [...rounds,...rounds.map(r=>r.map(([h,a])=>[a,h]))];}
export function autoLineup(c){return Object.entries(FORMATIONS[c.formation]).flatMap(([pos,n])=>c.squad.filter(p=>p.pos===pos&&!p.injured).sort((a,b)=>b.skill-a.skill).slice(0,n).map(p=>p.id));}
export function toggleStarter(club,playerId,checked){const id=Number(playerId),p=club.squad.find(p=>p.id===id);if(!p)throw Error('Player not found');if(checked){if(p.injured)throw Error('Injured players cannot start');if(club.lineup.includes(id))return {action:'unchanged'};const cap=FORMATIONS[club.formation]?.[p.pos]??0;if(!cap)throw Error('Position unavailable');const starters=club.squad.filter(x=>x.pos===p.pos&&club.lineup.includes(x.id));if(starters.length>=cap){const out=[...starters].sort((a,b)=>a.skill-b.skill||a.id-b.id)[0];club.lineup=club.lineup.map(x=>x===out.id?id:x);return {action:'swapped',replaced:out.name,added:p.name};}club.lineup.push(id);return {action:'added',added:p.name};}club.lineup=club.lineup.filter(x=>x!==id);return {action:'removed',removed:p.name};}
export function swapPlayers(c,onId,offId){const incoming=c.squad.find(p=>p.id===Number(onId)),outgoing=c.squad.find(p=>p.id===Number(offId));if(!incoming||!outgoing||incoming.pos!==outgoing.pos)throw Error('Choose a replacement in the same position');if(incoming.injured||!c.lineup.includes(outgoing.id)||c.lineup.includes(incoming.id))throw Error('Invalid replacement');c.lineup=c.lineup.map(id=>id===outgoing.id?incoming.id:id);return {action:'swapped',replaced:outgoing.name,added:incoming.name};}
export function validLineup(c){if(!FORMATIONS[c.formation]||c.lineup.length!==11||new Set(c.lineup).size!==11)return false;return Object.entries(FORMATIONS[c.formation]).every(([pos,n])=>c.squad.filter(p=>c.lineup.includes(p.id)&&p.pos===pos&&!p.injured).length===n);}
function initialiseCup(g,name){const league=g.clubs.filter(c=>c.division>=2).map(c=>c.id);let entrants=name==='FA Cup'?[...league,...Array.from({length:32},(_,i)=>-(i+1))]:[...league,...g.clubs.filter(c=>c.division===1).slice(0,8).map(c=>c.id)];return {name,stage:0,entrants,completed:[],winner:null};}
export function newGame(selected=CLUBS.find(c=>c.name==='Exeter City').id,seed=1989){const r=rng(seed);let pid=1;const clubs=CLUBS.map(({id,name,division})=>{const squad=[...Array.from({length:2},()=>player(pid++,'GK',r,division)),...Array.from({length:6},()=>player(pid++,'DEF',r,division)),...Array.from({length:6},()=>player(pid++,'MID',r,division)),...Array.from({length:6},()=>player(pid++,'FWD',r,division))];const c={id,name,division,squad,formation:'4-4-2',tactic:'Balanced',lineup:[],rating:rand(r,43,65)+(3-division)*5,budget:rand(r,40,150)*1000*(4-division),money:rand(r,150,500)*1000*(4-division)};c.lineup=autoLineup(c);return c;});const freeAgents=Array.from({length:35},(_,i)=>player(pid++,['GK','DEF','MID','FWD'][i%4],r));const g={version:3,manager:{clubId:selected,reputation:45,security:65,employed:true,offers:[],applications:[],career:[],lastReviewWeek:-1},transferHistory:[],matchReports:[],versionLabel:'1.0',seed,selected,round:0,season:1989,status:'active',clubs,freeAgents,fixtures:[],results:[],lastMatch:null,messages:['Welcome to your club. The 1989–90 campaign begins!'],history:[],cups:{}};refreshFixtures(g);g.cups={'FA Cup':initialiseCup(g,'FA Cup'),'League Cup':initialiseCup(g,'League Cup')};createWelcomeStory(g);return g;}
function refreshFixtures(g){g.fixtures=Array.from({length:46},()=>[]);for(let d=0;d<4;d++){const f=makeFixtures(g.clubs.filter(c=>c.division===d).map(c=>c.id));f.forEach((fixtures,i)=>g.fixtures[i].push(...fixtures));}}
function strength(c){if(c.id<0)return 45;const chosen=c.squad.filter(p=>c.lineup.includes(p.id)&&!p.injured);return (chosen.reduce((s,p)=>s+p.skill*(.65+.35*p.fitness/100),0)/(chosen.length||1))*.7+c.rating*.3+(c.tactic==='Attack'?2:c.tactic==='Defend'?-1:0);}
function poisson(r,lambda){let p=1,k=0,l=Math.exp(-lambda);do{k++;p*=r()}while(p>l&&k<15);return k-1;}
const commentary={
 goal:['GOAL! The crowd erupts as {player} finds the net!','A wonderful finish from {player}!','{player} strikes low and scores!','The keeper has no answer to {player}!','It is in! {player} has broken the deadlock!','{player} powers home from close range!','A sweeping move ends with a goal from {player}!','{player} beats the goalkeeper at the near post!','The ball hits the net! {player} wheels away in celebration!','What a moment! {player} makes no mistake!','An unstoppable drive from {player}!','{player} reacts first and fires home!'],
 chance:['A speculative effort drifts harmlessly wide.','A dangerous cross flashes across the six-yard box.','The goalkeeper pushes a curling attempt away.','A free kick skims the roof of the net.','A promising break ends with a poor final touch.','A shot is deflected narrowly past the post.','The defence scrambles clear from a crowded area.','A header is tipped over the crossbar.','The ball strikes the outside of the post!','A long-range effort sails over the bar.','A one-on-one chance is wasted!','A fine save keeps the scores unchanged.','A teasing corner causes panic in the box.','Great movement creates space, but the shot is blocked.'],
 yellow:['Late challenge — the referee reaches for a yellow card.','A mistimed tackle earns a booking.','The referee has seen enough: yellow card.'],
 injury:['Play stops as a player receives attention.','An awkward landing prompts concern on the touchline.'],
 kickoff:['The referee blows his whistle and we are under way!'],
 halftime:['Half-time. Both managers have plenty to think about.'],
 fulltime:['Full time! The crowd makes its feelings known.']};
function eventText(type,r,player){const a=commentary[type]||commentary.chance;return a[Math.floor(r()*a.length)].replace('{player}',player||'the striker');}
export function simulateMatch(home,away,seed){
 const r=rng(seed),delta=strength(home)-strength(away),hg=poisson(r,Math.max(.2,Math.min(3.5,1.52+delta*.035))),ag=poisson(r,Math.max(.2,Math.min(3.5,1.18-delta*.035)));
 const events=[{minute:0,team:home.id,type:'kickoff',text:eventText('kickoff',r)}];
 const goalEntries=[];
 for(const [c,n] of [[home,hg],[away,ag]])for(let i=0;i<n;i++){
  const pool=c.squad?.filter(p=>c.lineup.includes(p.id)&&p.pos!=='GK')||[];
  const weighted=pool.flatMap(p=>Array.from({length:p.pos==='FWD'?5:p.pos==='MID'?3:1},()=>p));
  const p=weighted.length?weighted[rand(r,0,weighted.length-1)]:null;
  goalEntries.push({minute:rand(r,2,89),team:c.id,type:'goal',scorer:p?.name||'Own goal',playerId:p?.id,text:eventText('goal',r,p?.name)});
 }
 events.push(...goalEntries);
 const shotsHome=Math.max(hg,rand(r,5,10)+Math.round(Math.max(0,delta)/7)),shotsAway=Math.max(ag,rand(r,4,9)+Math.round(Math.max(0,-delta)/7));
 const chances=shotsHome+shotsAway-hg-ag;
 for(let i=0;i<chances;i++){const c=r()<shotsHome/(shotsHome+shotsAway)?home:away;events.push({minute:rand(r,2,89),team:c.id,type:'chance',text:eventText('chance',r)});}
 for(let i=0;i<rand(r,0,3);i++){const c=r()<.5?home:away;events.push({minute:rand(r,5,87),team:c.id,type:'yellow',text:eventText('yellow',r)});}
 if(r()<.16){const c=r()<.5?home:away;events.push({minute:rand(r,15,84),team:c.id,type:'injury',text:eventText('injury',r)});}
 events.push({minute:45,team:null,type:'halftime',text:eventText('halftime',r)},{minute:90,team:null,type:'fulltime',text:eventText('fulltime',r)});
 const rank={kickoff:0,goal:1,chance:2,yellow:3,injury:4,halftime:5,fulltime:6};events.sort((a,b)=>a.minute-b.minute||rank[a.type]-rank[b.type]);
 const stats={shots:[shotsHome,shotsAway],onTarget:[Math.min(shotsHome,hg+rand(r,1,4)),Math.min(shotsAway,ag+rand(r,1,4))],possession:[Math.max(32,Math.min(68,50+Math.round(delta*.35)+rand(r,-5,5))),0],corners:[rand(r,2,10),rand(r,1,9)],fouls:[rand(r,6,17),rand(r,6,17)]};stats.possession[1]=100-stats.possession[0];
 return {home:home.id,away:away.id,hg,ag,events,stats,seed};
}
export function standings(g,division=g.clubs[g.selected].division){const teams=g.clubs.filter(c=>c.division===division).map(c=>({id:c.id,name:c.name,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0})),byId=new Map(teams.map(t=>[t.id,t]));for(const x of g.results){const h=byId.get(x.home),a=byId.get(x.away);if(!h||!a)continue;h.p++;a.p++;h.gf+=x.hg;h.ga+=x.ag;a.gf+=x.ag;a.ga+=x.hg;if(x.hg>x.ag){h.w++;a.l++;h.pts+=3}else if(x.hg<x.ag){a.w++;h.l++;a.pts+=3}else{h.d++;a.d++;h.pts++;a.pts++;}}return teams.sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.name.localeCompare(b.name));}
function getCupClub(g,id){return id<0?{id,name:'Non-League XI '+(-id),lineup:[],squad:[],rating:45,tactic:'Balanced'}:g.clubs[id];}
function cupDecider(g,homeId,awayId,salt){const r=simulateMatch(getCupClub(g,homeId),getCupClub(g,awayId),salt);let winner;if(r.hg!==r.ag)winner=r.hg>r.ag?homeId:awayId;else {const rr=rng(salt+7191);winner=rr()<.5?homeId:awayId;r.penalties=true;}return {...r,winner,cup:true};}
const CUP_WEEKS={'FA Cup':[8,12,16,21,26,31,36,41,45],'League Cup':[2,6,11,18,25,33,40,44]};
function progressCup(g,name){const cup=g.cups[name],stage=cup.stage;if(cup.winner!==null)return;let entrants=[...cup.entrants];if(name==='FA Cup'&&stage===2){entrants.push(...g.clubs.filter(c=>c.division<=1).map(c=>c.id));}if(name==='League Cup'&&stage===1){entrants.push(...g.clubs.filter(c=>c.division===0).map(c=>c.id));entrants.push(...g.clubs.filter(c=>c.division===1).slice(8).map(c=>c.id));}const r=rng(g.seed+g.season*1000+stage*787+(name==='FA Cup'?1:2));for(let i=entrants.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[entrants[i],entrants[j]]=[entrants[j],entrants[i]];}if(entrants.length%2)throw Error(name+' unmatched draw');const fixtures=[];for(let i=0;i<entrants.length;i+=2){const home=entrants[i],away=entrants[i+1],result=cupDecider(g,home,away,g.seed+g.season*111+stage*507+i*123+ (name==='FA Cup'?21:42));fixtures.push(result);if(result.home===g.selected||result.away===g.selected){g.messages.unshift(`${name}: ${getCupClub(g,home).name} ${result.hg}–${result.ag} ${getCupClub(g,away).name}${result.penalties?' (penalties)':''}`);g.lastCupMatch={name,competition:name,...result};g.matchReports.push(g.lastCupMatch);}}cup.completed.push({round:stage+1,matches:fixtures});cup.entrants=fixtures.map(x=>x.winner);cup.stage++;if(cup.entrants.length===1){cup.winner=cup.entrants[0];g.messages.unshift(`${name} winners: ${getCupClub(g,cup.winner).name}!`);}}
export function advanceRound(g){if(g.status==='finished')return g;const week=g.round;for(const [i,[h,a]] of g.fixtures[week].entries()){const result=simulateMatch(g.clubs[h],g.clubs[a],g.seed+week*1009+i*7919);g.results.push(result);if(h===g.selected||a===g.selected){g.lastMatch={...result,competition:'LEAGUE',division:g.clubs[h].division,week:week+1};g.matchReports.push(g.lastMatch);}for(const e of result.events)if(e.playerId){const p=g.clubs[e.team].squad.find(p=>p.id===e.playerId);if(p)p.goals++;}}for(const name of ['FA Cup','League Cup'])if(CUP_WEEKS[name].includes(week))progressCup(g,name);for(const c of g.clubs){const chosen=new Set(c.lineup);for(const p of c.squad){if(p.injured){p.injured--;p.fitness=Math.min(100,p.fitness+8);}else if(chosen.has(p.id)){p.fitness=Math.max(55,p.fitness-rand(rng(g.seed+week*333+p.id),3,8));if(rng(g.seed+week*10007+p.id*97)()<.008)p.injured=rand(rng(g.seed+p.id+week),1,3);}else p.fitness=Math.min(100,p.fitness+7);}c.money+=Math.round(2500+(c.rating-50)*150-c.squad.reduce((s,p)=>s+p.wage,0));if(!validLineup(c))c.lineup=autoLineup(c);}g.round++;updateManager(g);weeklyStory(g);if(g.round===46){g.status='finished';finishSeason(g);}g.messages.unshift(`Week ${g.round}: league fixtures completed`);return g;}
function playoffWinner(g,ids,seed){const semi1=cupDecider(g,ids[0],ids[3],seed),semi2=cupDecider(g,ids[1],ids[2],seed+13),final=cupDecider(g,semi1.winner,semi2.winner,seed+91);return {winner:final.winner,matches:[semi1,semi2,final]};}
export function finishSeason(g){if(g.history.length&&g.history.at(-1).season===g.season)return g;const tables=[0,1,2,3].map(d=>standings(g,d));const promote=[[],[],[],[]],relegate=[[],[],[],[]],playoffs={};for(let d=1;d<=3;d++){const count=d===3?3:2;promote[d]=tables[d].slice(0,count).map(x=>x.id);const eligible=tables[d].slice(count,count+4).map(x=>x.id);const po=playoffWinner(g,eligible,g.seed+g.season*17+d*1103);playoffs[d]=po;promote[d].push(po.winner);}relegate[0]=tables[0].slice(-3).map(x=>x.id);relegate[1]=tables[1].slice(-3).map(x=>x.id);relegate[2]=tables[2].slice(-4).map(x=>x.id);const summary={season:g.season,tables:tables.map(t=>t.map(x=>({...x}))),promote,relegate,playoffs,cupWinners:Object.fromEntries(Object.entries(g.cups).map(([name,c])=>[name,c.winner]))};g.history.push(summary);g.messages.unshift('Season complete! Promotions and relegations decided. See the Season Review.');return g;}
export function newSeason(g){if(g.status!=='finished')throw Error('Finish the season first');const h=g.history.at(-1);for(let d=1;d<=3;d++)for(const id of h.promote[d])g.clubs[id].division=d-1;for(let d=0;d<=2;d++)for(const id of h.relegate[d])g.clubs[id].division=d+1;g.season++;g.round=0;g.status='active';g.results=[];g.lastMatch=null;g.lastCupMatch=null;refreshFixtures(g);g.cups={'FA Cup':initialiseCup(g,'FA Cup'),'League Cup':initialiseCup(g,'League Cup')};for(const c of g.clubs){c.budget=Math.max(10000,c.budget+Math.round(c.money*.08));for(const p of c.squad){p.fitness=100;p.injured=0;p.goals=0;p.morale=70;}c.lineup=autoLineup(c);}g.matchReports=[];g.messages.unshift('A new season begins with fresh fixtures!');addStory(g,'chairman','A NEW CAMPAIGN BEGINS',`The ${g.season}–${String(g.season+1).slice(-2)} season is upon us. The board expects a fresh effort from everyone at ${g.clubs[g.selected].name}.`);ensureStory(g).lastWeekKey=null;if(g.manager)g.manager.lastReviewWeek=-1;return g;}
// Manager appointments and transfers are fictional simulation mechanics, not reconstructed historical negotiations.
export function updateManager(g){
 if(!g.manager)g.manager={clubId:g.selected,reputation:45,security:65,employed:true,offers:[],applications:[],career:[],lastReviewWeek:-1};
 const m=g.manager;if(!m.employed)return;
 const c=g.clubs[m.clubId],table=standings(g,c.division),rank=table.findIndex(x=>x.id===c.id)+1;
 if(g.round%5===0||g.round===46){const expected=c.division===0?12:10,performance=(expected-rank)*1.5;m.security=Math.max(0,Math.min(100,Math.round(m.security+performance+(rank>table.length-4?-9:2))));m.reputation=Math.max(10,Math.min(99,Math.round(m.reputation+(expected-rank)*.35)));}
 if(g.round%10===0&&g.round!==m.lastReviewWeek){m.lastReviewWeek=g.round;
  const r=rng(g.seed+g.season*701+g.round*149+m.clubId);const potential=g.clubs.filter(x=>x.id!==m.clubId&&x.division>=Math.max(0,c.division-(m.reputation>=55?1:0))&&x.division<=Math.min(3,c.division+1));
  m.offers=[];if(m.reputation>=43&&r()<.6){const choice=potential[Math.floor(r()*potential.length)];m.offers.push({clubId:choice.id,season:g.season,week:g.round});g.messages.unshift(`JOB OFFER: ${choice.name} invite you to take over as manager.`);}
 }
 if(m.security<=0){m.employed=false;m.career.push({clubId:m.clubId,season:g.season,week:g.round,reason:'Dismissed'});g.messages.unshift(`SACKED: ${c.name} have terminated your contract. Visit Manager's Office to apply for a new job.`);m.offers=g.clubs.filter(x=>x.id!==c.id&&x.division>=2).slice(0,6).map(x=>({clubId:x.id,season:g.season,week:g.round}));}
}
export function acceptJob(g,clubId){const m=g.manager;if(!m)throw Error('Manager data missing');const id=Number(clubId),offer=m.offers.find(o=>o.clubId===id);if(!offer)throw Error('That job offer is no longer available');if(m.employed)m.career.push({clubId:m.clubId,season:g.season,week:g.round,reason:'Resigned for a new job'});m.clubId=id;m.employed=true;m.security=65;m.offers=[];g.selected=id;g.messages.unshift(`APPOINTED: You are the new manager of ${g.clubs[id].name}.`);addStory(g,'press','NEW MANAGER UNVEILED',`${g.clubs[id].name} have appointed you as their new manager. The supporters want to see what your next chapter brings.`);return g;}
export function applyForJob(g,clubId){const m=g.manager,id=Number(clubId),club=g.clubs[id];if(!club||id===m.clubId)throw Error('Choose another club');if(m.employed&&m.offers.length)throw Error('Please respond to your current offers first');const r=rng(g.seed+g.season*567+g.round*131+id*17+m.reputation);const threshold=Math.max(.1,Math.min(.9,.50+(m.reputation-50)*.012+(club.division-2)*.11));if(r()>threshold){g.messages.unshift(`${club.name} have rejected your application.`);return false;}m.offers=[{clubId:id,season:g.season,week:g.round}];g.messages.unshift(`${club.name} have offered you the manager's job!`);return true;}
export function transferCandidates(g){
 // Stable per matchweek: only the scout's fresh recommendations can be purchased.
 // Never consume the random stream when simply opening the market screen.
 const choices=g.clubs.filter(c=>c.id!==g.selected).flatMap(c=>c.squad.filter(p=>!c.lineup.includes(p.id)).map(p=>({...p,fromClubId:c.id})));
 const available=[...choices,...g.freeAgents.map(p=>({...p,fromClubId:null}))];
 const r=rng(g.seed+g.season*7919+g.round*100003+g.selected*151);
 for(let i=available.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
 return available.slice(0,6);
}
export function transact(g,id,action,targetId=null){
 const c=g.clubs[g.selected],pid=Number(id);let p,from,to;
 if(action==='buy'){
  from=g.clubs.find(x=>x.id!==c.id&&x.squad.some(p=>p.id===pid))||null;
  const source=from?from.squad:g.freeAgents,i=source.findIndex(p=>p.id===pid);
  if(i<0)throw Error('Player unavailable');if(!transferCandidates(g).some(p=>p.id===pid))throw Error('This player is not in your scout’s current shortlist');p=source[i];
  if(from&&from.lineup.includes(pid))throw Error('That player is not transfer listed');
  if(p.value>c.budget||p.value>c.money)throw Error('Insufficient funds');
  source.splice(i,1);c.squad.push(p);c.budget-=p.value;c.money-=p.value;if(from){from.money+=p.value;from.budget+=Math.round(p.value*.8);}to=c;
 }else if(action==='sell'){
  if(c.squad.length<=16)throw Error('Minimum squad size is 16');
  const i=c.squad.findIndex(p=>p.id===pid);if(i<0)throw Error('Player unavailable');
  from=c;to=targetId===null?null:g.clubs[Number(targetId)];if(to?.id===c.id)throw Error('Cannot sell to your own club');
  [p]=c.squad.splice(i,1);c.lineup=c.lineup.filter(x=>x!==p.id);
  if(to){to.squad.push(p);to.money=Math.max(0,to.money-p.value);to.budget=Math.max(0,to.budget-p.value);}else g.freeAgents.push(p);
  c.budget+=p.value;c.money+=p.value;
  if(!validLineup(c))c.lineup=autoLineup(c);
 }else throw Error('Unknown transfer type');
 const entry={season:g.season,week:g.round,player:p.name,playerId:p.id,from:from?.name||'Free Agents',to:to?.name||'Free Agents',fee:p.value};
 g.transferHistory??=[];g.transferHistory.unshift(entry);g.messages.unshift(`TRANSFER: ${entry.player} · ${entry.from} → ${entry.to} (${entry.fee.toLocaleString('en-GB')} GBP)`);addStory(g,'scout',action==='buy'?'SCOUT REPORT: NEW ARRIVAL':'TRANSFER DEPARTURE',`${entry.player} has moved from ${entry.from} to ${entry.to} for £${entry.fee.toLocaleString('en-GB')}.`);return entry;
}
export function upgradeSave(g){if(g.version===3){ensureStory(g);return g;}if(g.version!==2||g.clubs?.length!==92)throw Error('Unsupported save');g.version=3;g.manager={clubId:g.selected,reputation:45,security:65,employed:true,offers:[],applications:[],career:[],lastReviewWeek:-1};g.transferHistory=[];g.matchReports=[];ensureStory(g);return g;}

export function sortLeagueRows(rows,sort='pts',order='desc',query=''){
 const filtered=rows.map((r,i)=>({...r,rank:i+1,gd:r.gf-r.ga})).filter(r=>r.name.toLowerCase().includes(query.toLowerCase().trim()));
 const keys={rank:'rank',name:'name',p:'p',w:'w',d:'d',l:'l',gf:'gf',ga:'ga',gd:'gd',pts:'pts'};
 const key=keys[sort]||'pts',dir=order==='asc'?1:-1;
 return filtered.sort((a,b)=>{const compare=key==='name'?a.name.localeCompare(b.name):a[key]-b[key];return compare*dir||a.rank-b.rank;});
}
