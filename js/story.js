import {managerForClub,rivalryFor,derbyRecord,careerDerbyRecord,managerialDuels} from './football-world.js';
// Project 1989 narrative engine. Fictional, deterministic events based on game state.
// Narrative events are stored as data, never evaluated as HTML.
const pick=(items,seed)=>items[Math.abs(Math.trunc(seed))%items.length];
const title=(g)=>g.clubs[g.selected]?.name||'your club';
export function ensureStory(g){
 if(!g.story||!Array.isArray(g.story.items))g.story={items:[],lastWeekKey:null};
 if(!Number.isInteger(g.story.nextArticleId))g.story.nextArticleId=0;
 return g.story;
}
export function addStory(g,kind,headline,body,options=null){
 const story=ensureStory(g),id=`news:${g.season}:${g.round}:${kind}:${story.nextArticleId++}`;
 const item={id,season:g.season,week:g.round,kind,headline,body,read:false,choice:null,options};
 story.items.unshift(item);if(story.items.length>140)story.items.length=140;return item;
}
function getClubStats(g){
 const club=g.clubs[g.selected],reports=(g.matchReports||[]).filter(x=>x.competition==='LEAGUE'&&(x.home===club.id||x.away===club.id));
 const last=reports.at(-1),prev=reports.slice(-3),isWin=r=>r&&(r.home===club.id?r.hg>r.ag:r.ag>r.hg),isLoss=r=>r&&(r.home===club.id?r.hg<r.ag:r.ag<r.hg);
 return {club,reports,last,prev,wins:prev.filter(isWin).length,losses:prev.filter(isLoss).length,isWin,isLoss};
}
export function createWelcomeStory(g){
 const story=ensureStory(g);if(story.items.length)return;
 addStory(g,'chairman','A LETTER FROM THE CHAIRMAN',`Welcome to ${title(g)}. The board wish you every success. Results matter, naturally, but we also value sensible spending and loyalty to the club.`);
 addStory(g,'press','NEW BOSS AT THE HELM',`${title(g)} have appointed a new manager ahead of the ${g.season}–${String(g.season+1).slice(-2)} season. Supporters are keen to see what happens next.`);
}
export function weeklyStory(g){
 const story=ensureStory(g),key=`${g.season}:${g.round}`;
 if(story.lastWeekKey===key)return;
 story.lastWeekKey=key;
 const s=getClubStats(g),last=s.last,week=g.round,club=s.club;
 if(!last)return;
 const other=g.clubs[last.home===club.id?last.away:last.home]?.name||'the opposition';
 const score=`${last.hg}–${last.ag}`;
 const win=s.isWin(last),loss=s.isLoss(last);
 const scorerEvents=(last.events||[]).filter(e=>e.type==='goal');
 const scorers=scorerEvents.map(e=>`${e.scorer||e.text||'Unknown scorer'} (${e.minute}′)`).slice(0,6);
 const homeTeam=g.clubs[last.home]?.name||'Home',awayTeam=g.clubs[last.away]?.name||'Away';
 const positionRows=g.clubs.filter(c=>c.division===club.division);
 const table=positionRows.map(c=>({id:c.id,pts:0,gf:0,ga:0})),byId=new Map(table.map(x=>[x.id,x]));
 for(const r of g.results||[]){const h=byId.get(r.home),a=byId.get(r.away);if(!h||!a)continue;h.gf+=r.hg;h.ga+=r.ag;a.gf+=r.ag;a.ga+=r.hg;if(r.hg>r.ag)h.pts+=3;else if(r.hg<r.ag)a.pts+=3;else{h.pts++;a.pts++;}}
 table.sort((a,b)=>b.pts-a.pts||((b.gf-b.ga)-(a.gf-a.ga))||b.gf-a.gf);
 const rank=table.findIndex(x=>x.id===club.id)+1,ourRow=table[rank-1],leader=table[0];
 const played=s.reports.length,pointsBack=leader?leader.pts-ourRow.pts:0;
 const seasonContext=rank===1?`${club.name} sit top of the ${['First','Second','Third','Fourth'][club.division]} Division after ${played} league matches.`:
  rank>=table.length-3?`${club.name} are ${rank}th of ${table.length}, with the relegation places uncomfortably close.`:
  `The result leaves ${club.name} ${rank}th of ${table.length}, ${pointsBack} point${pointsBack===1?'':'s'} behind the leaders.`;
 const derby=rivalryFor(g,club.id,last.home===club.id?last.away:last.home);
 const manager=managerForClub(g,last.home===club.id?last.away:last.home);
 const titlePrefix=derby?(derby.fictional?'REGIONAL RIVALS CLASH':'DERBY DAY DRAMA'):win?'A SATURDAY TO REMEMBER':loss?'QUESTIONS AFTER DEFEAT':'HONOURS EVEN';
 const headline=derby?`${titlePrefix}: ${club.name.toUpperCase()} v ${other.toUpperCase()}`:
  win?pick(['THREE POINTS AND A STATEMENT','THE HOME SUPPORT HAVE THEIR SAY','A VICTORY TO REMEMBER'],week+g.seed):
  loss?pick(['SETBACK IN THE LEAGUE','QUESTIONS AFTER DEFEAT','A DIFFICULT SATURDAY'],week+g.seed):
  pick(['POINTS SHARED','A HARD-EARNED DRAW','HONOURS EVEN'],week+g.seed);
 const verdict=win?`${club.name} took all three points against ${other}.`:
  loss?`${other} took the points against ${club.name}.`:`Neither side could claim victory.`;
 const scoring=scorers.length?`Goals: ${scorers.join('; ')}.`:'Neither side found the net.';
 const stats=last.stats?`The match produced ${last.stats.shots?.[0]??'?'} shots for ${homeTeam} and ${last.stats.shots?.[1]??'?'} for ${awayTeam}; possession was ${last.stats.possession?.[0]??'?'}–${last.stats.possession?.[1]??'?'} percent.`:'';
 const record=derby?derbyRecord(g,club.id,last.home===club.id?last.away:last.home):null;
 const career=derby?careerDerbyRecord(g,club.id,last.home===club.id?last.away:last.home):null;
 const duel=managerialDuels(g,last.home===club.id?last.away:last.home);
 const previous=career?.previous, prior=previous?(previous.home===club.id?`${club.name} ${previous.hg}–${previous.ag} ${other}`:`${other} ${previous.hg}–${previous.ag} ${club.name}`):null;
 const revenge=previous&&(previous.home===club.id?previous.hg<previous.ag:previous.ag<previous.hg);
 const rivalryLine=derby?`${derby.name} — career head-to-head: ${career.wins} wins, ${career.draws} draws, ${career.losses} defeats in ${career.played} meetings. ${prior?`Their previous encounter ended ${prior} (${previous.season||g.season}–${String((previous.season||g.season)+1).slice(-2)}). `:''}${revenge&&win?'Revenge for the last defeat will taste especially sweet. ':''}${career.streak>=2?`${club.name} have now ${career.trend==='W'?'won':career.trend==='L'?'lost':'drawn'} ${career.streak} successive meetings. `:''}Managerial duels against ${manager.name}: ${duel.wins} wins, ${duel.draws} draws and ${duel.losses} defeats.`:'';
 const quotes=win?[`We cannot afford to dwell on one afternoon.`, `It is the next fixture that matters now.`]:
  loss?[`I expect a stronger response next time.`,`They deserved their result, but we will be ready again.`]:
  [`There was very little between the sides.`,`A draw is not always a bad result.`];
 const grudge=derby&&career?.previous&&career?.previous.hg!==career?.previous.ag;
 const managerQuote=grudge?(win?`The scoreline speaks for itself. We will be ready when these clubs meet again.`:loss?`That result will not be forgotten. We have another chance to put matters right.`:`After the last meeting, perhaps neither side wanted to give an inch today.`):quotes[Math.abs(g.seed+week+manager.clubId)%quotes.length];
 const quote=managerQuote;
 const matchText=`${homeTeam} ${last.hg}–${last.ag} ${awayTeam}. ${verdict}\n\n${scoring} ${stats}\n\n${seasonContext}${rivalryLine?'\n\n'+rivalryLine:''}\n\n${manager.name}, the ${other} manager, told the local press: “${quote}”`;
 const featureAngles=[
  'A result alone never tells the whole story. The coming fixtures will reveal whether this afternoon marks a turning point.',
  'The fixture list offers little time to dwell on it. Supporters will be watching closely when the next team comes to town.',
  'These are the afternoons the league table eventually remembers; small margins acquire great significance in the spring.',
  'Whatever the verdict in the stands, the manager must turn the conversation towards the next ninety minutes.',
  'For those travelling home, it was another chapter in a season whose final shape remains to be decided.',
  'The numbers will be entered in the record book, though the argument about the performance may continue all week.'
 ];
 const angle=featureAngles[Math.abs((g.seed||0)+week*17+club.id*13)%featureAngles.length];
 const article=addStory(g,'press',headline,matchText+'\n\nTHE BACK PAGE: '+angle);article.matchFingerprint=`${g.season}:${week}:${last.home}:${last.away}`;article.rivalry=derby?.name||null;
 if(derby){
  const preview=addStory(g,'press','RIVALRY WATCH — THE DERBY FILE: '+derby.name.toUpperCase(),`${club.name} and ${other} have renewed their rivalry. ${derby.description}\n\nThe ${career.played} league meetings recorded in this career have brought ${career.wins} victories for ${club.name}, ${career.draws} draws and ${career.losses} defeats. ${career.streak>=2?`The latest run of ${career.streak} consecutive ${career.trend==='W'?'wins':career.trend==='L'?'defeats':'draws'} is certain to be discussed on the terraces.`:''}\n\n${manager.name}, the ${other} manager, knows the supporters will remember this result. ${seasonContext}`);
  preview.rivalry=derby.name;
 }
 // Record only real simulated league results; do not invent matches or quotes from real managers.
 if(week%4===0){
  const round=(g.fixtures?.[week-1]||[]).filter(([h])=>g.clubs[h]?.division===club.division);
  const latest=(g.results||[]).filter(r=>round.some(([h,a])=>r.home===h&&r.away===a));
  const highlights=latest.filter(r=>r.home!==club.id&&r.away!==club.id).sort((a,b)=>(b.hg+b.ag)-(a.hg+a.ag)).slice(0,2);
  if(highlights.length){const leaderName=g.clubs[leader.id]?.name||'The leaders';
   const snippets=highlights.map(r=>`${g.clubs[r.home]?.name||'Home'} ${r.hg}–${r.ag} ${g.clubs[r.away]?.name||'Away'}`).join('; ');
   addStory(g,'press','THE FOOTBALL LEAGUE ROUND-UP',`Around the ${['First','Second','Third','Fourth'][club.division]} Division, the latest results include ${snippets}.\n\n${leaderName} currently lead the table on ${leader.pts} points, with ${club.name} ${rank}th. Every Saturday is reshaping the campaign.`);
  }
 }
 // Ahead of a real scheduled derby, let the opposition manager speak in the papers.
 const next=g.fixtures?.[g.round]?.find(([h,a])=>h===club.id||a===club.id);
 if(next){const otherId=next[0]===club.id?next[1]:next[0],nextDerby=rivalryFor(g,club.id,otherId);
  if(nextDerby){const opp=g.clubs[otherId],boss=managerForClub(g,otherId),record=derbyRecord(g,club.id,otherId);
   const allTime=careerDerbyRecord(g,club.id,otherId),duels=managerialDuels(g,otherId);
   const past=allTime.last,fixture=past?(past.home===club.id?`${club.name} ${past.hg}–${past.ag} ${opp.name}`:`${opp.name} ${past.hg}–${past.ag} ${club.name}`):null;
   const rematch=past&&(past.home===club.id?past.hg<past.ag:past.ag<past.hg);
   const pre=addStory(g,'press','NEXT SATURDAY: '+nextDerby.name.toUpperCase(),`${club.name} face ${opp.name} in the next round of league fixtures. ${nextDerby.description}\n\nTHE DERBY FILE: ${allTime.played} league meetings in this career; ${allTime.wins} wins, ${allTime.draws} draws, ${allTime.losses} defeats for ${club.name}. ${past?`Last meeting: ${fixture}. `:'This is their first recorded league meeting in this career. '}${rematch?`${club.name} have a score to settle after their last defeat. `:''}${allTime.streak>=2?`A run of ${allTime.streak} ${allTime.trend==='W'?'wins':allTime.trend==='L'?'defeats':'draws'} has added to the tension.`:''}\n\n${boss.name}, the ${opp.name} manager, has faced you ${duels.played} time${duels.played===1?'':'s'}: ${duels.wins} wins, ${duels.draws} draws and ${duels.losses} defeats from your perspective. The next result will add another chapter.`);
   pre.rivalry=nextDerby.name;
  }
 }
 // Milestones are derived from completed results and standings, not invented match events.
 if(week>=19&&rank===1&&week%5===0)addStory(g,'press','TITLE RACE: EVERY POINT COUNTS',`${club.name} lead the division after ${played} league appearances. The chasing clubs have not conceded the title, and the manager will be reminded that the campaign is far from over.`);
 if(week>=23&&rank>=table.length-3&&week%5===0)addStory(g,'press','RELEGATION WATCH: PRESSURE MOUNTS',`${club.name} stand ${rank}th of ${table.length} after ${played} matches. Each remaining fixture could prove crucial in the fight for survival.`);
 if(s.losses===3&&s.prev.length===3){
  addStory(g,'chairman','PRIVATE: THE BOARD EXPECT BETTER',`Three league defeats in succession are not acceptable at ${club.name}. We expect a positive response in the next fixture.`,[{id:'reassure',label:'Promise improvement'},{id:'defend',label:'Defend your approach'},{id:'rebuild',label:'Promise changes to the starting XI'}]);
 }else if(s.wins===3&&s.prev.length===3){
  addStory(g,'chairman','THE BOARD SEND THEIR CONGRATULATIONS',`Three successive league victories! The directors are pleased with the progress being made at ${club.name}. Keep the players focused.`);
 }
 if(week%3===0){
  const squad=club.squad.filter(p=>!p.injured).sort((a,b)=>a.skill-b.skill),player=squad[(week+g.seed)%Math.max(1,squad.length)];
  if(player){const unhappy=club.lineup.includes(player.id)===false;
   addStory(g,'player',unhappy?'A PLAYER KNOCKS ON YOUR DOOR':'A WORD IN THE DRESSING ROOM',unhappy?`${player.name} believes he deserves more first-team football. He asks if you have a place for him in your plans.`:`${player.name} has asked for a private conversation. He wants to know whether you still believe in the squad after the recent results.`,[{id:'support',label:'Offer encouragement'},{id:'firm',label:'Demand more effort'},{id:'rest',label:'Promise a rest and recovery'},{id:'listen',label:'Listen without making promises'}]);
   story.items[0].playerId=player.id;
  }
 }
 // Occasional conversational incidents; based on existing events, not random pop-ups.
 if(week%5===2){
  const focus=s.losses>=2?'A DIFFICULT WEEK AT THE TRAINING GROUND':s.wins>=2?'A CONFIDENT SQUAD NEEDS GUIDANCE':'THE ASSISTANT ASKS FOR A WORD';
  const concern=s.losses>=2?`The players are struggling with confidence after recent results. Your assistant suggests a quieter training week at ${club.name}.`:s.wins>=2?`There is a buoyant mood in the dressing room. Your coach thinks the squad should be reminded not to get carried away.`:`The coaching staff have asked whether you want to ease the training load ahead of the next fixture.`;
  addStory(g,'coach',focus,concern,[{id:'rotate',label:'Rotate the squad and lighten training'},{id:'intense',label:'Demand an intense week of training'},{id:'steady',label:'Keep things as they are'}]);
 }
 if(week%7===4){
  addStory(g,'chairman','AN INVITATION TO THE BOARDROOM',`The directors of ${club.name} want your view on the priorities for the coming weeks. Do you favour patient development or a push for immediate results?`,[{id:'develop',label:'Invest faith in the younger players'},{id:'results',label:'Promise short-term results'},{id:'budget',label:'Emphasise keeping costs under control'}]);
 }
if(week%4===1){
  const squad=club.squad.filter(p=>p.injured);
  addStory(g,'coach',squad.length?'THE PHYSIO HAS CONCERNS':'THE COACH REPORTS BACK',squad.length?`${squad.length} of our players are receiving treatment. We may need to rotate the squad.`:`The players have trained well this week. The staff recommend reviewing fitness before selecting the next starting eleven.`);
 }
 const cups=(g.matchReports||[]).filter(x=>x.week===undefined&&x.competition!=='LEAGUE');
 const recentCups=cups.filter(x=>!story.items.some(z=>z.cupFingerprint===`${x.competition}:${x.seed}`));
 for(const cup of recentCups.slice(-2)){
  const victorious=cup.winner===club.id,otherClub=g.clubs[cup.home===club.id?cup.away:cup.home]?.name||'the opposition';
  const item=addStory(g,'press',victorious?'CUP FEVER SWEEPS THE TOWN':'CUP DREAMS END',victorious?`${club.name} are through in the ${cup.competition} after facing ${otherClub}. The terraces will be talking about it all week.`:`${club.name} have been knocked out of the ${cup.competition} by ${otherClub}. Attention now returns to the league.`);
  item.cupFingerprint=`${cup.competition}:${cup.seed}`;
 }
}
export function markStoryRead(g,id){const item=ensureStory(g).items.find(x=>x.id===id);if(!item)throw Error('Report not found');item.read=true;return item;}
export function answerStory(g,id,decision){
 const item=markStoryRead(g,id);
 if(!item.options?.some(o=>o.id===decision)||item.choice)throw Error('That decision is no longer available');
 item.choice=decision;
 if(item.kind==='player'){
  const player=g.clubs[g.selected].squad.find(x=>x.id===item.playerId);
  const effects={support:8,firm:-5,rest:5,listen:2};
  if(player)player.morale=Math.max(0,Math.min(100,(player.morale||60)+(effects[decision]??0)));
  const outcomes={support:'The player appreciates your support. Morale rises.',firm:'The player leaves looking unconvinced. Morale falls.',rest:'The player welcomes a lighter workload. Morale improves.',listen:'The player appreciates being heard, though no promises were made.'};
  item.outcome=outcomes[decision]||'The conversation is over.';
 }else if(item.kind==='coach'){
  const change={rotate:3,intense:-4,steady:0}[decision]??0;
  const squad=g.clubs[g.selected].squad;
  for(const p of squad){p.fitness=Math.max(0,Math.min(100,(p.fitness??90)+change));}
  item.outcome=decision==='rotate'?'The lighter schedule helps the squad recover.':decision==='intense'?'The demanding sessions leave some players tired.':'Training continues as planned.';
 }else if(item.kind==='chairman'){
  const effects={reassure:3,defend:-4,rebuild:1,develop:2,results:4,budget:3};
  const manager=g.manager;
  manager.security=Math.max(0,Math.min(100,manager.security+(effects[decision]??0)));
  const outcomes={reassure:'Your assurances buy a little goodwill.',defend:'The chairman remains unimpressed by your answer.',rebuild:'The board expect to see changes on Saturday.',develop:'The board approve of your long-term thinking.',results:'The directors welcome your ambition and will hold you to it.',budget:'The chairman is pleased with your financial caution.'};
  item.outcome=outcomes[decision]||'Your reply has been noted.';
 }else item.outcome='Your decision has been recorded.';
 return item;
}
export function unreadStoryCount(g,kinds=null){return ensureStory(g).items.filter(x=>!x.read&&(!kinds||kinds.includes(x.kind))).length;}
