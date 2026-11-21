// Project 1989 narrative engine. Fictional, deterministic events based on game state.
// Narrative events are stored as data, never evaluated as HTML.
const pick=(items,seed)=>items[Math.abs(Math.trunc(seed))%items.length];
const title=(g)=>g.clubs[g.selected]?.name||'your club';
export function ensureStory(g){
 if(!g.story||!Array.isArray(g.story.items))g.story={items:[],lastWeekKey:null};
 return g.story;
}
export function addStory(g,kind,headline,body,options=null){
 const story=ensureStory(g),id=`${g.season}:${g.round}:${kind}:${story.items.length}`;
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
 const headline=win?pick(['A SATURDAY TO REMEMBER','THE FANS HAVE SOMETHING TO CHEER','THREE POINTS IN THE BAG'],week+g.seed):loss?pick(['A TOUGH AFTERNOON','QUESTIONS AFTER DEFEAT','THE BOSS FACES THE PRESS'],week+g.seed):pick(['HONOURS EVEN','A POINT TO BUILD ON','THE SPOILS ARE SHARED'],week+g.seed);
 const matchText=win?`A ${score} result against ${other} has lifted spirits at ${club.name}. Supporters will expect more of the same.`:loss?`After losing ${score} against ${other}, questions are being asked about the team's form. The manager insists there is work to do.`:`A ${score} draw against ${other} leaves supporters divided. Some saw determination; others wanted more ambition.`;
 addStory(g,'press',headline,matchText);
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
