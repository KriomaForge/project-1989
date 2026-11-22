// The Three Voices of Football: regional coverage and organic rivalries.
// All season facts come from the completed simulation; regional groupings are
// editorial coverage, not a claim that every pair is a historical derby.
const REGIONS={
 'West Midlands':['Aston Villa','Birmingham City','West Bromwich Albion','Wolverhampton Wanderers','Walsall','Coventry City','Shrewsbury Town','Hereford United'],
 'Merseyside & Cheshire':['Liverpool','Everton','Tranmere Rovers','Chester City','Crewe Alexandra'],
 'East Midlands':['Nottingham Forest','Derby County','Notts County','Leicester City','Mansfield Town','Chesterfield','Northampton Town','Lincoln City'],
 'North East':['Newcastle United','Sunderland','Middlesbrough','Hartlepool United','Darlington','Carlisle United'],
 'South Yorkshire':['Sheffield United','Sheffield Wednesday','Rotherham United','Barnsley','Doncaster Rovers'],
 'West Yorkshire':['Leeds United','Bradford City','Huddersfield Town','Halifax Town','York City'],
 'Manchester & Greater Manchester':['Manchester United','Manchester City','Oldham Athletic','Stockport County','Rochdale','Bolton Wanderers','Bury','Wigan Athletic'],
 'Lancashire & Fylde':['Blackburn Rovers','Burnley','Preston North End','Blackpool','Wigan Athletic','Bolton Wanderers','Bury'],
 'North Staffordshire':['Stoke City','Port Vale','Crewe Alexandra','Walsall'],
 'Humberside & Lincolnshire':['Hull City','Grimsby Town','Scunthorpe United','Lincoln City','Doncaster Rovers','Scarborough'],
 'East Anglia':['Norwich City','Ipswich Town','Cambridge United','Peterborough United','Colchester United'],
 'Bristol & South West':['Bristol City','Bristol Rovers','Swindon Town','Plymouth Argyle','Exeter City','Torquay United','AFC Bournemouth'],
 'South Wales & Borders':['Cardiff City','Swansea City','Wrexham','Chester City','Hereford United'],
 'South Coast':['Southampton','Portsmouth','Brighton & Hove Albion','AFC Bournemouth','Gillingham'],
 'Thames Valley & Home Counties':['Reading','Oxford United','Swindon Town','Watford','Luton Town','Aldershot','Northampton Town'],
 'South & East London':['West Ham United','Millwall','Charlton Athletic','Crystal Palace','Leyton Orient','Gillingham','Southend United','Maidstone United','Chelsea'],
 'North & West London':['Arsenal','Tottenham Hotspur','Queens Park Rangers','Brentford','Fulham','Chelsea','Watford','Wimbledon']
};
const MAIN_REGION={
 'Aston Villa':'West Midlands','Birmingham City':'West Midlands','West Bromwich Albion':'West Midlands','Wolverhampton Wanderers':'West Midlands','Walsall':'West Midlands','Coventry City':'West Midlands',
 'Liverpool':'Merseyside & Cheshire','Everton':'Merseyside & Cheshire','Tranmere Rovers':'Merseyside & Cheshire',
 'Nottingham Forest':'East Midlands','Derby County':'East Midlands','Notts County':'East Midlands',
 'Newcastle United':'North East','Sunderland':'North East','Middlesbrough':'North East',
 'Sheffield United':'South Yorkshire','Sheffield Wednesday':'South Yorkshire',
 'Manchester United':'Manchester & Greater Manchester','Manchester City':'Manchester & Greater Manchester',
 'Wolverhampton Wanderers':'West Midlands'
};
const base=c=>c?.historicalName||c?.name||'';
const ordinal=n=>`${n}${n%100>=11&&n%100<=13?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th'}`;
export function regionForClub(g,id){const name=base(g.clubs[id]);return MAIN_REGION[name]||Object.keys(REGIONS).find(r=>REGIONS[r].includes(name))||null;}
export function nearbyClubs(g,id){const name=base(g.clubs[id]),region=regionForClub(g,id);if(!region)return {region:'Football League',clubs:[]};
 const candidates=g.clubs.filter(c=>c.id!==id&&REGIONS[region].includes(base(c))).sort((a,b)=>{
  const an=base(a),bn=base(b);return REGIONS[region].indexOf(an)-REGIONS[region].indexOf(bn);
 });
 return {region,clubs:candidates};
}
const pairKey=(a,b)=>[a,b].sort((x,y)=>x-y).join(':');
const rowFor=(summary,id)=>{for(let d=0;d<(summary.tables||[]).length;d++){const t=summary.tables[d]||[],pos=t.findIndex(r=>r.id===id);if(pos>=0)return {row:t[pos],position:pos+1,division:d};}return null;};
const seasonHeadToHead=(g,a,b)=>(g.results||[]).filter(r=>(r.home===a&&r.away===b)||(r.home===b&&r.away===a));
// Evidence accumulates over multiple completed seasons. A single local meeting
// cannot create a rivalry. Old careers with no tracker retain ordinary local coverage.
export function updateEmergingRivalries(g,summary){
 g.emergingRivalries??={};
 const seen=new Set();
 for(const club of g.clubs){
  const local=nearbyClubs(g,club.id).clubs;
  const ownRow=rowFor(summary,club.id);
  const titleChallengers=ownRow&&ownRow.position<=4?g.clubs.filter(c=>c.id!==club.id&&rowFor(summary,c.id)?.division===ownRow.division&&rowFor(summary,c.id)?.position<=4):[];
  const candidates=[...new Map([...local,...titleChallengers].map(c=>[c.id,c])).values()];
  for(const other of candidates){
  const key=pairKey(club.id,other.id);if(seen.has(key))continue;seen.add(key);
  const matches=seasonHeadToHead(g,club.id,other.id),a=rowFor(summary,club.id),b=rowFor(summary,other.id);
  if(!a||!b||!matches.length)continue;
  const close=a.division===b.division&&Math.abs(a.position-b.position)<=4;
  const stakes=a.division===b.division&&a.position<=6&&b.position<=6;
  const isLocal=local.some(c=>c.id===other.id);
  const points=(matches.length>=2?2:1)+(close?2:0)+(stakes?2:0)+(isLocal?0:1);
  const prev=g.emergingRivalries[key]||{score:0,seasons:0,meetings:0,established:false};
  if(prev.lastSeason===summary.season)continue;
  const next={...prev,score:prev.score+points,seasons:prev.seasons+1,meetings:prev.meetings+matches.length,lastSeason:summary.season};
  next.established=next.seasons>=3&&next.meetings>=5&&next.score>=12;
  g.emergingRivalries[key]=next;
 }}
 return g.emergingRivalries;
}
export function emergingRivalryFor(g,a,b){const v=g.emergingRivalries?.[pairKey(a,b)];if(!v?.established)return null;const local=nearbyClubs(g,a).clubs.some(c=>c.id===b);return {name:local?'Growing regional rivalry':'New title rivalry',emerging:true,description:`A rivalry forged through ${v.meetings} competitive league meetings over ${v.seasons} seasons.`};}
function localHighlights(g,summary,clubId){
 const area=nearbyClubs(g,clubId),nearby=area.clubs.map(c=>({club:c,standing:rowFor(summary,c.id)})).filter(x=>x.standing);
 // Include the whole region in the source facts, then choose diverse prominent stories.
 nearby.sort((a,b)=> (a.standing.position===1?-100:0)-(b.standing.position===1?-100:0) || a.standing.position-b.standing.position||a.club.id-b.club.id);
 const selected=nearby.slice(0,6);
 const notes=selected.map(({club,standing})=>`${club.name} finished ${ordinal(standing.position)} in the ${['First','Second','Third','Fourth'][standing.division]} Division on ${standing.row.pts} points`);
 const emergent=Object.entries(g.emergingRivalries||{}).filter(([key,v])=>v.established&&key.split(':').map(Number).includes(clubId)).map(([key,v])=>({clubId:key.split(':').map(Number).find(id=>id!==clubId),...v}));
 return {region:area.region,neighbours:area.clubs.map(c=>c.name),notes,emergent};
}
export function makePressPerspectives(g,summary,edition){
 const id=edition.clubId,club=g.clubs[id],stand=rowFor(summary,id),outcome=edition.outcome||'the campaign';
 const tally=edition.record||{},wins=tally.wins||0,losses=tally.losses||0;
 const lead=edition.topScorer;
 const trophy=(Object.entries(summary.cupWinners||{}).filter(([,winner])=>winner===id).map(([name])=>name));
 const positives=stand?.position===1||trophy.length||summary.promote?.[stand?.division]?.includes(id);
 const relegated=summary.relegate?.[stand?.division]?.includes(id);
 const bad=!!relegated||(!positives&&losses>wins)||(stand&&stand.position>Math.ceil((summary.tables[stand.division]||[]).length*.7));
 const clubTitle=club.name.toUpperCase();
 const supporterHeadline=positives?`WHAT A SEASON! ${clubTitle} GIVE US SOMETHING TO CELEBRATE`:bad?`NOT GOOD ENOUGH! QUESTIONS FOR THE ${clubTitle} BOSS`:`${clubTitle}: THE FANS WANT MORE NEXT YEAR`;
 const supporterBody=positives
  ?`We'll remember this one for years. ${club.name} finished as ${outcome}${trophy.length?` and lifted ${trophy.join(' and ')}`:''}. ${lead?`${lead.name}'s ${lead.goals} recorded league goals deserve a special mention. `:''}The supporters will expect the club to build on this success.`
  :bad?`The terraces have had precious little to cheer. ${club.name} finished as ${outcome}, with ${wins} league victories and ${losses} defeats. Questions are being asked of the manager, and some supporters are calling for a change. It is opinion, not a board decision.`
  :`There were good Saturdays and bad ones. ${club.name} finished as ${outcome}, recording ${wins} victories and ${losses} defeats. The fans want a stronger campaign next season, and will be watching the manager's decisions closely.`;
 const worst=edition.articles.find(x=>x.heading==='THE AFTERNOON TO FORGET');
 const supporterArticles=[{heading:'FROM THE TERRACES',body:supporterBody}];
 if(worst)supporterArticles.push({heading:'THE RESULT THAT STILL HURTS',body:`Nobody has forgotten it. ${worst.body}`});
 if(lead)supporterArticles.push({heading:'A PLAYER TO SING ABOUT',body:`${lead.name} led the recorded scoring charts with ${lead.goals} league goals. Supporters will hope for more of the same.`});

 // An editorial desk with distinct angles; all claims depend on stored statistics.
 const core=edition.record||{},played=core.played||0,points=core.points;
 const derby=edition.articles.find(x=>x.heading==='THE RIVALRY THAT MATTERED');
 const best=edition.articles.find(x=>x.heading==='THE DAY EVERYTHING CLICKED');
 const run=edition.articles.find(x=>x.heading==='THE RUN-IN');
 const cup=edition.articles.find(x=>x.heading==='THE CUP TRAIL');
 const toneIndex=Math.abs((Number(g.seed)||0)+summary.season*13+id*7)%5;
 const openings=[
  `The arguments will continue long after the last whistle. ${club.name} have finished ${outcome}, and the terraces have a verdict of their own.`,
  `A football season is measured in points, but remembered in Saturdays. ${club.name} end this one ${outcome}.`,
  `Ask a supporter what matters and the answer rarely begins with a balance sheet. For ${club.name}, the season ended ${outcome}.`,
  `There were afternoons to celebrate and others best forgotten. ${club.name}'s final place in the record book is ${outcome}.`,
  `The programme sellers have gone home and the turnstiles are locked. ${club.name}'s supporters are left to weigh up a season ending ${outcome}.`
 ];
 supporterArticles.unshift({heading:'THE EDITOR WRITES',body:openings[toneIndex]});
 if(best)supporterArticles.push({heading:positives?'A DAY TO FRAME':'ONE FOR THE MEMORY BOOK',body:`Even the most hard-bitten critic ought to remember this one. ${best.body} ${bad?'It raises the question of why such afternoons were not more frequent.':'There is no reason the club cannot build on such a performance.'}`});
 if(derby)supporterArticles.push({heading:'LOCAL PRIDE IS NOT OPTIONAL',body:`For a section of the support, the league position is only half the story. ${derby.body} A derby has a way of outlasting the headlines about everything else.`});
 if(cup)supporterArticles.push({heading:'SATURDAYS OF CUP FEVER',body:`There was another competition to occupy the conversation at the ground. ${cup.body}`});
 if(run)supporterArticles.push({heading:'THE LAST EIGHT SATURDAYS',body:`What supporters saw in the run-in will shape expectations for the summer. ${run.body}`});
 const nationalExtra=[
  {heading:'IN NUMBERS',body:`The season brought ${played} recorded league fixtures, ${wins} victories, ${core.draws||0} draws and ${losses} defeats${points!==null&&points!==undefined?`, producing ${points} points`:''}. These figures explain the verdict more clearly than any flourish of prose.`},
  ...(best?[{heading:'THE RESULT TO REMEMBER',body:best.body}]:[]),
  ...(derby?[{heading:'RIVALRY WATCH',body:derby.body}]:[])
 ];
 edition.articles.push(...nationalExtra);
 const local=localHighlights(g,summary,id);
 const localName=local.region==='Football League'?'THE COUNTY FOOTBALL HERALD':`THE ${local.region.toUpperCase()} FOOTBALL HERALD`;
 const other=local.notes.length?local.notes.join('. ')+'.':`No other local club's final league position was recorded in this edition.`;
 const localArticles=[{heading:'THE LOCAL FOOTBALL PICTURE',body:`${club.name} ended the season as ${outcome}. But the story goes beyond one club. ${other}`}];
 const rising=local.emergent.slice(0,2).map(v=>g.clubs[v.clubId]?.name).filter(Boolean);
 if(rising.length)localArticles.push({heading:'NEW RIVALRIES TAKE ROOT',body:`Repeated close contests have added a new edge to matches involving ${club.name} and ${rising.join(' and ')}. Those meetings have become fixtures supporters mark on the calendar.`});
 if(local.neighbours.length)localArticles.push({heading:'AROUND THE GROUNDS',body:`Local coverage includes ${local.neighbours.join(', ')}. These are neighbouring clubs, not necessarily established derby rivals.`});
 const tableNotes=local.notes;
 if(tableNotes.length){const detail=tableNotes.slice(-Math.min(3,tableNotes.length));localArticles.push({heading:'ELSEWHERE IN THE REGION',body:`While attention centres on ${club.name}, the surrounding football towns have their own stories. ${detail.join('. ')}. Supporters across the area will have plenty to discuss over the summer.`});}
 if(derby)localArticles.push({heading:'ANOTHER CHAPTER IN A FAMILIAR FIXTURE',body:derby.body});
 if(best)localArticles.push({heading:'THE RESULT THAT FILLED THE BACK PAGE',body:best.body});
 return {fans:{paper:'THE SUPPORTERS’ VOICE',headline:supporterHeadline,articles:supporterArticles,stance:positives?'celebratory':bad?'critical':'demanding'},regional:{paper:localName,headline:`${local.region.toUpperCase()}: A SEASON ACROSS THE GROUNDS`,articles:localArticles,region:local.region,coveredClubs:local.neighbours}};
}
export const regionalGroups=REGIONS;
