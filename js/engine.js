import {ensureStory,createWelcomeStory,weeklyStory,addStory} from './story.js';
import {RESEARCH_PILOT} from './research-pilot.js';
// Project 1989 v0.2 — source-informed 1989/90 clubs; fictional players and results.
const DIV_NAMES=['First Division','Second Division','Third Division','Fourth Division'];
export {DIV_NAMES};
const DIVISIONS=[
['Liverpool','Aston Villa','Tottenham Hotspur','Arsenal','Chelsea','Everton','Southampton','Wimbledon','Nottingham Forest','Norwich City','Queens Park Rangers','Coventry City','Manchester United','Manchester City','Crystal Palace','Derby County','Luton Town','Sheffield Wednesday','Charlton Athletic','Millwall'],
['Leeds United','Sheffield United','Newcastle United','Swindon Town','Blackburn Rovers','Sunderland','West Ham United','Oldham Athletic','Ipswich Town','Wolverhampton Wanderers','Port Vale','Portsmouth','Leicester City','Hull City','Watford','Plymouth Argyle','Oxford United','Brighton & Hove Albion','Barnsley','West Bromwich Albion','Middlesbrough','AFC Bournemouth','Bradford City','Stoke City'],
['Bristol Rovers','Bristol City','Notts County','Tranmere Rovers','Bury','Bolton Wanderers','Birmingham City','Huddersfield Town','Rotherham United','Reading','Shrewsbury Town','Crewe Alexandra','Brentford','Leyton Orient','Mansfield Town','Chester City','Swansea City','Wigan Athletic','Preston North End','Fulham','Cardiff City','Northampton Town','Blackpool','Walsall'],
['Exeter City','Grimsby Town','Southend United','Stockport County','Maidstone United','Cambridge United','Chesterfield','Carlisle United','Peterborough United','Lincoln City','Scunthorpe United','Rochdale','York City','Gillingham','Torquay United','Burnley','Hereford United','Scarborough','Hartlepool United','Doncaster Rovers','Wrexham','Aldershot','Halifax Town','Colchester United']];
export const CLUBS=DIVISIONS.flatMap((names,div)=>names.map((name,i)=>({id:DIVISIONS.slice(0,div).reduce((n,a)=>n+a.length,0)+i,name,division:div})));
// Three starting worlds. Never present incomplete historic sources as a complete database.
export const CAREER_MODES = Object.freeze({
 fictional: 'Historical clubs · Generated players',
 historical: 'Historical full-season squads · Partial real names',
 'historical-opening': 'Historical opening-day candidates · Partial real names',
 alternate: 'PES-inspired English leagues · PES aliases and generated clubs'
});
// Documented PES 5–2008 English League aliases. These names originated in later
// games; clubs absent from those editions receive original, generated alternatives.
// The PES-inspired mode is NOT a historical reconstruction of a 1989 PES game.
export const PES_ALIASES=Object.freeze({
 'Arsenal':'North London','Aston Villa':'West Midlands Village',
 'Birmingham City':'West Midlands City','Blackburn Rovers':'Lancashire',
 'Bolton Wanderers':'Middlebrook','Chelsea':'London FC',
 'Derby County':'Derbyshire','Everton':'Merseyside Blue',
 'Fulham':'West London White','Liverpool':'Merseyside Red',
 'Manchester City':'Man Blue','Manchester United':'Man Red',
 'Middlesbrough':'Teesside','Newcastle United':'Tyneside',
 'Portsmouth':'Pompy','Reading':'Berkshire Blues',
 'Sunderland':'Wearside','Tottenham Hotspur':'North East London',
 'West Ham United':'East London','Wigan Athletic':'Lancashire Athletic',
 'West Bromwich Albion':'West Midlands Stripes',
 'Queens Park Rangers':'North West London'
});
// Starting ages are calculated at the beginning of August 1989. Dates of birth
// listed here were cross-checked against season records/player biographies. Other
// historical preview names receive a plainly flagged age estimate. Skill ratings
// and potential are ALL subjective game balancing, not historical statistics.
// Format: [DOB (or null), starting ability, potential].
export const HISTORICAL_PLAYER_PROFILES=Object.freeze({
 'Aston Villa':{
  'Nigel Spink':['1958-08-08',81,83],'Lee Butler':['1966-05-30',59,70],
  'Paul McGrath':['1959-12-04',84,85],'Derek Mountfield':['1962-11-02',79,81],
  'Kent Nielsen':['1961-12-28',82,84],'Chris Price':['1960-03-30',72,76],
  'Stuart Gray':['1960-04-19',75,77],'Kevin Gage':['1964-04-21',72,77],
  'Gordon Cowans':['1958-10-27',84,84],'David Platt':['1966-06-10',85,91],
  'Paul Birch':['1962-11-20',74,76],'Mark Blake':['1970-12-16',61,79],
  'Tony Daley':['1967-10-18',80,88],'Ian Olney':['1969-12-17',75,84],
  'Ian Ormondroyd':['1964-09-22',75,78],'Dwight Yorke':['1971-11-03',54,93]
 },
 'Exeter City':{
  'Kevin Miller':['1969-06-14',67,82],'David Walter':[null,57,65],
  'Shaun Taylor':['1963-02-26',67,72],'Lee Rogers':[null,61,70],
  'Richard Dryden':[null,60,68],'Gary Elkins':[null,59,69],
  'Scott Hiley':['1968-09-27',62,82],'Jim McNichol':[null,64,68],
  'Chris Vinnicombe':[null,65,79],'Danny Bailey':[null,66,72],
  'Paul Batty':[null,63,71],'Mark Cooper':[null,63,70],
  'Tom Kelly':[null,61,69],'Kevin Summerfield':[null,64,70],
  'Steve Neville':[null,70,73],'Ian Benjamin':[null,59,71],
  'Ben Rowe':[null,57,69]
 }
});
export function ageOnSeasonStart(dob,season=1989){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(dob||''))return null;
 const [year,month,day]=dob.split('-').map(Number);
 return season-year-(month>8||(month===8&&day>19)?1:0);
}

const PLACE_ROOTS=['Ashmere','Briarford','Calderwick','Dunleigh','Eastmere','Fernbrook','Glenford','Highmarsh','Ironbridge','Kingshaven','Larkford','Millbrook','Northwick','Oakleigh','Redbridge','Stonehaven','Thornwick','Valebrook','Westford','Wychmere','Amberley','Brackenford','Cinderwick','Dalesbury','Elmsford','Foxleigh','Greenmere','Hazelbrook','Ivygate','Juniperford','Kirkmarsh','Lowbridge','Moorhaven','Newcombe','Oldhaven','Pinewick','Quarryford','Ravenleigh','Silverbrook','Tarnwick','Underleigh','Whitecombe','Yewford','Brookhaven','Coldstream','Draytonmere','Eldenbury'];
const CLUB_ENDINGS=['United','City','Town','Rovers','Athletic','Wanderers','Albion','County','Villa','Olympic','FC','Harriers'];
export function fictionalClubNames(seed=1989){
 const r=rng(seed+3297),used=new Set(Object.values(PES_ALIASES)),names=[];
 // Random fictional English settlements and traditional 1980s club suffixes.
 for(let i=0;i<92;i++){
  let candidate,tries=0;
  do{const root=PLACE_ROOTS[rand(r,0,PLACE_ROOTS.length-1)];const district=['','North ','South ','East ','West ','Old ','New '][rand(r,0,6)];candidate=district+root+' '+CLUB_ENDINGS[rand(r,0,CLUB_ENDINGS.length-1)];if(++tries>5000)throw Error('Fictional club name generation exhausted');}while(used.has(candidate));
  used.add(candidate);names.push(PES_ALIASES[CLUBS[i].name]||candidate);
 }return names;
}
// Research preview: positions and season association corroborated by 11v11's
// 1989-90 season lists. Age/skill/fitness/wages are simulated, not historical.
// A season-long roster does NOT imply opening-day registration.
export const HISTORICAL_PREVIEW = Object.freeze({
 'Aston Villa': [
 ['Nigel Spink','GK'],['Lee Butler','GK'],['Paul McGrath','DEF'],['Derek Mountfield','DEF'],['Kent Nielsen','DEF'],['Chris Price','DEF'],['Stuart Gray','DEF'],['Kevin Gage','DEF'],['Gordon Cowans','MID'],['David Platt','MID'],['Paul Birch','MID'],['Mark Blake','MID'],['Tony Daley','FWD'],['Ian Olney','FWD'],['Ian Ormondroyd','FWD'],['Dwight Yorke','FWD']
 ],
 'Exeter City': [
 ['Kevin Miller','GK'],['David Walter','GK'],['Shaun Taylor','DEF'],['Lee Rogers','DEF'],['Richard Dryden','DEF'],['Gary Elkins','DEF'],['Scott Hiley','DEF'],['Jim McNichol','DEF'],['Chris Vinnicombe','DEF'],['Danny Bailey','MID'],['Paul Batty','MID'],['Mark Cooper','MID'],['Tom Kelly','MID'],['Kevin Summerfield','MID'],['Steve Neville','FWD'],['Ian Benjamin','FWD'],['Ben Rowe','FWD']
 ]
});
export const HISTORICAL_SOURCES=Object.freeze({
 'Aston Villa':'https://www.11v11.com/teams/aston-villa/tab/players/season/1990/',
 'Exeter City':'https://www.11v11.com/teams/exeter-city/tab/players/season/1990/'
});

export const FORMATIONS={'4-4-2':{GK:1,DEF:4,MID:4,FWD:2},'4-3-3':{GK:1,DEF:4,MID:3,FWD:3},'5-3-2':{GK:1,DEF:5,MID:3,FWD:2}};
export function rng(seed){let s=seed>>>0;return ()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296)}
// Larger era-appropriate fictional name pools. A team cannot start with duplicate full names.
const first=['Alan','Steve','Gary','Mark','David','Paul','Ian','John','Chris','Kevin','Peter','Tony','Neil','Brian','Andy','Simon','Martin','Graham','Phil','Darren','Michael','Robert','Stephen','Andrew','Richard','Colin','Nigel','Keith','Gordon','Derek','Trevor','Lee','Stuart','Craig','Dean','Barry','Carl','Jason','Patrick','Philip','Terry','Clive','Sean','Shaun','Gavin','Adrian','Wayne','Tim','Ray','Les','Danny','Nicky','Mick','Frank','Gareth','Duncan','Des','Lloyd','Ashley','Neville','Dennis','Eric','Gerry','Marcus','Eddie','Graeme','Ricky','Julian','Leslie','Stan','Kenny','Jamie','Norman','Glen','Billy','Roy','Dave','Aaron','Nathan','Anthony','Warren','Scott','Rodney','Roger','Jonathan','Jeremy','Stephen','Leon','Leroy','Dwight','Keith','Vince','Dion','Clive','Sanjay','Raj','Imran','Mohammed','Gary','Shane','Colm','Niall','Eamon','Shay','Gary','Gary'];
const givenNames=[...new Set(first)];
const familyNames=['Baker','Hughes','Williams','Taylor','Smith','Jones','Brown','Evans','Davies','Roberts','Wilson','Walker','Turner','White','Hall','Wood','Cooper','King','Green','Hill','Adams','Allen','Anderson','Armstrong','Atkinson','Bailey','Barnes','Bennett','Bishop','Black','Booth','Bradley','Brooks','Burke','Burns','Butler','Campbell','Carter','Chapman','Clark','Clarke','Cole','Collins','Cook','Cox','Crawford','Cross','Dawson','Dean','Dixon','Doyle','Dunn','Edwards','Ellis','Ferguson','Fisher','Fletcher','Foster','Fox','Francis','Gibson','Gilbert','Goodwin','Graham','Grant','Gray','Griffiths','Harris','Harrison','Hart','Harvey','Hayes','Henderson','Higgins','Holland','Holmes','Howard','Hudson','Hunt','Jackson','James','Jenkins','Johnson','Johnston','Kelly','Kennedy','Kerr','Knight','Lambert','Lawrence','Lee','Lewis','Lloyd','Long','Lowe','MacDonald','Mackay','Marshall','Martin','Mason','Matthews','McCarthy','McDonald','McLean','Miller','Mills','Mitchell','Moore','Morgan','Morris','Murphy','Murray','Nelson','Newman','Nicholson','Noble',"O'Brien","O'Connor","O'Neill",'Owen','Palmer','Parker','Patel','Pearce','Perry','Phillips','Powell','Price','Quinn','Reed','Reid','Reynolds','Richards','Richardson','Riley','Robinson','Rogers','Rose','Ross','Russell','Ryan','Saunders','Scott','Shaw','Simpson','Singh','Spencer','Stevens','Stewart','Sullivan','Sutton','Thomas','Thompson','Thorpe','Todd','Townsend','Tucker','Walsh','Ward','Watson','Webb','Wells','West','Wheeler','Wilkinson','Williamson','Willis','Woods','Wright','Young','Akhtar','Ali','Baptiste','Benn','Blake','Dawes','Desai','Fashanu','Hinds','McKenzie','Ndlovu','Osei','Ramsey','Small','Thomas'];
const rand=(r,a,b)=>a+Math.floor(r()*(b-a+1));
function player(id,pos,r,div=3){const skill=rand(r,38,70)+(3-div)*5,age=rand(r,17,35);return {id,age,potential:Math.min(96,skill+rand(r,2,23)),experience:Math.max(0,(age-17)*3),form:6.5,appearances:0,assists:0,careerGoals:0,careerAssists:0,careerAppearances:0,name:givenNames[rand(r,0,givenNames.length-1)]+' '+familyNames[rand(r,0,familyNames.length-1)],pos,skill,fitness:100,morale:70,injured:0,goals:0,wage:rand(r,80,350)*(4-div),value:rand(r,5,55)*1000*(4-div)};}
export function enrichPlayer(p,seed=0){if(!Number.isFinite(p.age))p.age=18+(Math.abs(p.id*17+seed)%18);if(!Number.isFinite(p.potential))p.potential=Math.min(96,p.skill+8+(p.id%13));if(!Number.isFinite(p.experience))p.experience=Math.max(0,(p.age-17)*3);if(!Number.isFinite(p.form))p.form=6.5;if(!Number.isFinite(p.appearances))p.appearances=0;if(!Number.isFinite(p.assists))p.assists=0;if(!Number.isFinite(p.careerGoals))p.careerGoals=p.goals||0;if(!Number.isFinite(p.careerAssists))p.careerAssists=p.assists||0;if(!Number.isFinite(p.careerAppearances))p.careerAppearances=p.appearances||0;return p;}
function uniqueNames(players,r){const used=new Set();for(const p of players){let name=p.name,tries=0;while(used.has(name)){name=givenNames[rand(r,0,givenNames.length-1)]+' '+familyNames[rand(r,0,familyNames.length-1)];if(++tries>2000)throw Error('Name pool exhausted');}p.name=name;used.add(name);}return players;}
export function makeFixtures(ids=Array.from({length:24},(_,i)=>i)){
 const n=ids.length,arr=[...ids],rounds=[],last=new Map(),streak=new Map(),homes=new Map();
 if(n%2)throw Error('Even number of teams required');
 // Balanced first-half pair orientations. Previous algorithm forced some clubs
 // to play every first-leg fixture away, producing 19 consecutive £0 gates.
 for(let k=0;k<n-1;k++){
  const round=[];
  for(let j=0;j<n/2;j++){
   const a=arr[j],b=arr[n-1-j];
   const cost=(home,away)=>[ [home,'H'],[away,'A'] ].reduce((sum,[id,side])=>{
    const consecutive=last.get(id)===side?(streak.get(id)||0):0;
    return sum+(consecutive?(consecutive+1)**2*4:0)+Math.abs((homes.get(id)||0)+(side==='H'?1:0)-(k+1)/2)*2;
   },0);
   const ab=cost(a,b),ba=cost(b,a);
   const [home,away]=ab<ba?[a,b]:ba<ab?[b,a]:(k+j)%2?[b,a]:[a,b];
   round.push([home,away]);
   for(const [id,side] of [[home,'H'],[away,'A']]){
    streak.set(id,last.get(id)===side?(streak.get(id)||0)+1:1);
    last.set(id,side);if(side==='H')homes.set(id,(homes.get(id)||0)+1);
   }
  }
  rounds.push(round);arr.splice(1,0,arr.pop());
 }
 return [...rounds,...rounds.map(r=>r.map(([h,a])=>[a,h]))];
}
// Repair ONLY upcoming orientations in a legacy saved calendar. Opponent pairs,
// matchweeks, completed scores and one-home/one-away pairings all remain intact.
export function fixtureStreak(g,clubId){
 let last='',run=0,max=0;
 for(const week of g.fixtures){const f=week.find(([h,a])=>h===clubId||a===clubId);if(!f)continue;
 const side=f[0]===clubId?'H':'A';run=side===last?run+1:1;last=side;max=Math.max(max,run);
 }return max;
}
export function rebalanceRemainingFixtures(g){
 if(g.status!=='active'||g.round>=46)throw Error('There are no remaining fixtures to rebalance.');
 const before=g.fixtures.map(round=>round.map(pair=>[...pair]));
 const pairs=new Map(),byClub=new Map();
 for(let w=0;w<g.fixtures.length;w++)for(let j=0;j<g.fixtures[w].length;j++){
 const f=g.fixtures[w][j],key=[...f].sort((a,b)=>a-b).join(':');
 if(!pairs.has(key))pairs.set(key,[]);pairs.get(key).push({w,j});
 for(const id of f){if(!byClub.has(id))byClub.set(id,[]);byClub.get(id).push({w,j});}
 }
 const mutable=[...pairs.values()].filter(v=>v.length===2&&v.every(x=>x.w>=g.round));
 // The calendar must be two-leg round robin before editing it.
 for(const v of pairs.values())if(v.length!==2)throw Error('Cannot repair an invalid fixture calendar.');
 const cost=id=>{
 const events=byClub.get(id).map(({w,j})=>({w,home:g.fixtures[w][j][0]===id})).sort((a,b)=>a.w-b.w);
 let last=null,streak=0,cost=0,firstHome=0,firstCount=0;
 for(const event of events){
  if(event.w < 23){firstCount++;if(event.home)firstHome++;}
  streak=event.home===last?streak+1:1;last=event.home;
  if(streak>1)cost+=8*(streak-1)**2;
 }
 // Keep the first-leg distribution close to half to avoid long stretches without gates.
 cost+=2*(firstHome-firstCount/2)**2;
 return cost;
 };
 let changes=0;
 const flip=v=>{for(const {w,j} of v){const p=g.fixtures[w][j];g.fixtures[w][j]=[p[1],p[0]];}};
 for(let pass=0;pass<10;pass++){
  let improved=0;
  for(const v of mutable){
   const ids=g.fixtures[v[0].w][v[0].j];const old=cost(ids[0])+cost(ids[1]);
   flip(v);const next=cost(ids[0])+cost(ids[1]);
   if(next+1e-6<old){improved++;changes++;}else flip(v);
  }
  if(!improved)break;
 }
 // Verify that completed matchweeks were untouched, each fixture retains
 // its opponent pair, and each pair still has reciprocal home/away matches.
 for(let w=0;w<46;w++)for(let j=0;j<g.fixtures[w].length;j++){
  const orig=before[w][j],now=g.fixtures[w][j];
  if((w<g.round&&(orig[0]!==now[0]||orig[1]!==now[1]))||[...orig].sort((a,b)=>a-b).join(':')!==[...now].sort((a,b)=>a-b).join(':'))throw Error('Fixture repair validation failed');
 }
 for(const v of pairs.values()){const p=g.fixtures[v[0].w][v[0].j],q=g.fixtures[v[1].w][v[1].j];if(p[0]!==q[1]||p[1]!==q[0])throw Error('Home/away fixture pairing invalid');}
 g.calendarRebalanced={season:g.season,week:g.round,changes};return changes;
}
export function autoLineup(c){return Object.entries(FORMATIONS[c.formation]).flatMap(([pos,n])=>c.squad.filter(p=>p.pos===pos&&!p.injured).sort((a,b)=>b.skill-a.skill).slice(0,n).map(p=>p.id));}
// Staff personalities are deliberately short descriptions; no extra visible staff statistics.
// Saved as part of the existing career object without changing its schema version.
const ASSISTANT_STYLES={
 balanced:{title:'Balanced team organiser',description:'Your assistant weighs ability, fitness, form and morale before settling on an eleven.'},
 attacking:{title:'Attack-minded coach',description:'Your assistant favours attacking football and the strongest forwards, even when a little rotation might help.'},
 fitness:{title:'Fitness-first organiser',description:'Your assistant trusts fresh legs and is quick to rest tired regulars.'},
 morale:{title:'Dressing-room motivator',description:'Your assistant values confidence and form, giving happy, in-form players more chances.'},
 experience:{title:'Experienced campaigner',description:'Your assistant trusts seasoned professionals to handle important fixtures.'}
};
const SCOUT_STYLES={
 bargains:{title:'Bargain hunter',description:'Your scout is good at spotting useful players at affordable prices.'},
 veterans:{title:'Experienced-player specialist',description:'Your scout likes experienced players at a sensible price and can identify reliable short-term cover.'},
 youth:{title:'Youth talent spotter',description:'Your scout has a good eye for young players who could develop into first-team regulars.'},
 upgrades:{title:'First-team specialist',description:'Your scout concentrates on players who can strengthen your starting eleven immediately.'}
};
// Club economy: fictional 1989-flavoured model; avoids stadium/ticket-price micromanagement.
const PHYSIO_STYLES={
 careful:{title:'Careful rehabilitation specialist',description:'Your physio favours careful treatment and helps reduce repeat setbacks.',recovery:.29},
 quick:{title:'Quick recovery specialist',description:'Your physio works to get injured players back into training sooner.',recovery:.48},
 traditional:{title:'Experienced club physio',description:'A reliable physio who takes a steady, practical approach to injuries.',recovery:.19}
};
const SALARIES={assistant:{balanced:480,attacking:620,fitness:530,morale:560,experience:650},scout:{bargains:350,veterans:460,youth:410,upgrades:580},physio:{careful:480,quick:650,traditional:340}};
export function staffSalary(role,style){return SALARIES[role]?.[style]??0;}
export function staffCreditLimit(c){return [320000,175000,90000,50000][c.division];}
// A signing must fit both the allocated transfer budget and the chairman's cash/overdraft limit.
export function transferFee(p){return p.fromClubId===null?0:Math.max(0,p.value||0);}
export function transferAffordability(c,p){const fee=transferFee(p);const withinBudget=fee<=c.budget;const headroom=Math.max(0,c.money+staffCreditLimit(c));const withinCash=fee<=headroom;return {affordable:withinBudget&&withinCash,withinBudget,withinCash,headroom,fee,reason:!withinBudget?'Beyond transfer budget':!withinCash?'Chairman cannot fund this signing':'Available to sign'};}

export function staffCandidates(g,role){
 if(!['assistant','scout','physio'].includes(role))throw Error('Unknown staff role');
 const styles=Object.keys(role==='assistant'?ASSISTANT_STYLES:role==='scout'?SCOUT_STYLES:PHYSIO_STYLES),current=ensureStaff(g)[role].style;
 return styles.filter(style=>style!==current).map(style=>({role,style,title:(role==='assistant'?ASSISTANT_STYLES:role==='scout'?SCOUT_STYLES:PHYSIO_STYLES)[style].title,description:(role==='assistant'?ASSISTANT_STYLES:role==='scout'?SCOUT_STYLES:PHYSIO_STYLES)[style].description,wage:staffSalary(role,style),severance:Math.max(0,staffSalary(role,current)*4)}));
}
export function hireStaff(g,role,style){
 const candidate=staffCandidates(g,role).find(s=>s.style===style);
 if(!candidate)throw Error('That staff appointment is unavailable');
 const c=g.clubs[g.selected];
 if(c.money-candidate.severance < -staffCreditLimit(c))throw Error('The chairman will not approve an appointment beyond the club overdraft limit');
 c.money-=candidate.severance;ensureStaff(g)[role]={style};
 if(role==='scout')g.scoutShortlists={};
 g.staffHistory??=[];g.staffHistory.unshift({season:g.season,week:g.round,role,style,fee:candidate.severance,wage:candidate.wage,club:c.name});
 g.financeLedger??=[];g.financeLedger.unshift({season:g.season,week:g.round,clubId:c.id,type:'STAFF APPOINTMENT',amount:-candidate.severance,note:`${candidate.title}; outgoing staff compensation`});
 addStory(g,'chairman','NEW BACKROOM APPOINTMENT',`The chairman has approved our new ${role}: ${candidate.title}. Compensation cost £${candidate.severance.toLocaleString('en-GB')}; weekly salary £${candidate.wage.toLocaleString('en-GB')}.`);
 return candidate;
}
export function weeklyStaffWages(g){const st=ensureStaff(g);return Object.entries(st).reduce((sum,[role,s])=>sum+staffSalary(role,s.style),0);}
// The accountant is a permanent narrative adviser, not a recruitable employee.
export const ACCOUNTANT_NAME='Margaret Ellis';
export function accountantReport(g,club=g.clubs[g.selected]){
 const estimate=clubEconomy(g,club), entries=(g.financeLedger||[]).filter(x=>x.clubId===club.id);
 const weekly=entries.filter(x=>x.type==='WEEKLY OPERATIONS');
 const recent=weekly.slice(0,4), prior=weekly.slice(4,8);
 const recentAvg=recent.length?recent.reduce((n,x)=>n+x.amount,0)/recent.length:null;
 const priorAvg=prior.length?prior.reduce((n,x)=>n+x.amount,0)/prior.length:null;
 const trend=recentAvg===null?'not yet established':priorAvg===null?'too early to judge':recentAvg>priorAvg+350?'improving':recentAvg<priorAvg-350?'worsening':'broadly steady';
 const liquidity=club.money < -staffCreditLimit(club)*.75?'serious pressure':club.money<0?'under pressure':club.money<estimate.playerWages*4?'tight':'comfortable';
 const weeks=g.fixtures.length||46,homeGames=g.fixtures.filter(round=>round.some(([h])=>h===club.id)).length;
 const typicalGate=Math.round(72000*[1,.68,.43,.29][club.division]*Math.max(.7,Math.min(1.4,(club.rating||60)/65)));
 const averageGate=Math.round(typicalGate*homeGames/weeks);
 const regularIncome=estimate.commercial+estimate.success,weeklyCosts=estimate.playerWages+estimate.staffWages;
 // This is a simplified planning forecast, not an extra cash posting.
 const sustainableNet=regularIncome+averageGate-weeklyCosts;
 const cashHeadroom=Math.max(0,club.money+staffCreditLimit(club));
 const wageGap=Math.max(0,weeklyCosts-regularIncome-averageGate);
 const actions=[];
 if(club.money<0)actions.push(`Protect the overdraft: the chairman currently has about £${Math.round(cashHeadroom).toLocaleString('en-GB')} of remaining headroom. Postpone non-essential appointments or fees until cash improves.`);
 if(wageGap>0)actions.push(`Reduce the weekly cost base by roughly £${Math.ceil(wageGap/100)*100} through wages or staff costs, or consider selling surplus players. This is an average-season estimate, not an away-week panic.`);
 else actions.push(`Our typical league home receipts average approximately £${averageGate.toLocaleString('en-GB')} per calendar week. The current wage bill looks supportable across a full season, even if an away week is negative.`);
 if(homeGames>0)actions.push(`Plan cash flow around ${homeGames} home league fixtures in ${weeks} calendar weeks. Away games earn no home gate receipts; cup gates and end-of-season distributions are additional, variable income.`);
 else actions.push('No home league fixtures remain in the current calendar. Keep sufficient cash for wages until the next season or distribution.');
 if(club.budget>0&&club.money<0)actions.push('Transfer funds are a spending allocation, not cash in the bank. Check available cash and the overdraft before committing to a player.');
 const explanation=sustainableNet<0
  ?`Projected average operating cash flow over the full fixture calendar is about £${Math.round(sustainableNet).toLocaleString('en-GB')} per week after wages. Home gates are uneven, and are not recorded on away fixtures.`
  :`Projected average operating cash flow over the full fixture calendar is about £${Math.round(sustainableNet).toLocaleString('en-GB')} per week after wages. Individual away weeks may still show a loss.`;
 const context=trend==='improving'?'Our recent weekly results are improving.':trend==='worsening'?'Recent weekly results have weakened.':trend==='broadly steady'?'Recent weekly results have been broadly steady.':'We need more weeks of records before assessing the trend.';
 return {name:ACCOUNTANT_NAME,liquidity,trend,weeklyNet:estimate.net,sustainableNet,averageGate,cashHeadroom,explanation,context,advice:actions[0],actions,recordedWeeks:weekly.length};
}
// Record managerial results at the point of play. Historical club results alone do not
// prove the user managed those fixtures, so older seasons are not invented retroactively.
export function ensureCareerRecord(g){
 if(!g.manager)return {matches:[],honours:[]};
 if(!g.manager.record)g.manager.record={matches:[],honours:[],startedTrackingAt:{season:g.season,week:g.round},legacy:!!((g.round||0)||(g.history||[]).length)};
 g.manager.record.matches??=[];g.manager.record.honours??=[];
 return g.manager.record;
}
export function careerSummary(g){
 const rec=ensureCareerRecord(g), matches=rec.matches, clubIds=new Set([g.manager?.clubId,...matches.map(x=>x.clubId),...(g.manager?.career||[]).map(x=>x.clubId)].filter(Number.isInteger));
 const stats=list=>({played:list.length,won:list.filter(x=>x.gf>x.ga).length,drawn:list.filter(x=>x.gf===x.ga).length,lost:list.filter(x=>x.gf<x.ga).length,for:list.reduce((v,x)=>v+x.gf,0),against:list.reduce((v,x)=>v+x.ga,0)});
 const teams=[...clubIds].map(id=>({clubId:id,name:g.clubs[id]?.name||'Unknown club',...stats(matches.filter(x=>x.clubId===id))}));
 const transfers=g.transferHistory||[],records=transfers.filter(x=>Number.isFinite(x.fee));
 const bought=records.filter(x=>teams.some(t=>t.name===x.to)).sort((a,b)=>b.fee-a.fee)[0]||null;
 const sold=records.filter(x=>teams.some(t=>t.name===x.from)).sort((a,b)=>b.fee-a.fee)[0]||null;
 const legacyClubHistory=rec.legacy&&(g.manager?.career||[]).length===0
  ? (g.history||[]).map(h=>{const row=h.tables?.flat().find(x=>x.id===g.manager.clubId);return row?{season:h.season,clubId:g.manager.clubId,played:row.p??row.played??0,won:row.w??row.won??0,drawn:row.d??row.drawn??0,lost:row.l??row.lost??0}:null;}).filter(Boolean):[];
 return {total:stats(matches),teams,honours:rec.honours,bought,sold,legacy:rec.legacy,legacyClubHistory,startedTrackingAt:rec.startedTrackingAt};
}
export function clubEconomy(g,c,week=g.round){
 const homeFixtures=(g.fixtures[week]||[]).filter(pair=>pair[0]===c.id).length;
 const last=g.results.filter(x=>x.home===c.id||x.away===c.id).slice(-5);
 const form=last.length?last.reduce((sum,r)=>sum+(r.home===c.id?(r.hg>r.ag?3:r.hg===r.ag?1:0):(r.ag>r.hg?3:r.hg===r.ag?1:0)),0)/(last.length*3):.45;
 const scale=[1,.68,.43,.29][c.division];
 const quality=Math.max(.7,Math.min(1.4,(c.rating||60)/65));
 // Fictional, period-inspired operating receipts, not actual historical accounts.
 // The old £24k top-division gate estimate was less than £1 per supporter for
 // a well-attended ground, and led to artificial insolvency of successful clubs.
 // Gate figure is NET club receipt after simplified staging costs/levies.
 const gate=homeFixtures?Math.round(72000*scale*quality*(0.82+0.36*form)):0;
 const commercial=Math.round(9500*scale*quality);
 const success=Math.round(2200*scale*form);
 const playerWages=c.squad.reduce((sum,p)=>sum+(p.wage||0),0);
 const staffWages=c.id===g.selected?weeklyStaffWages(g):Math.round(1400*scale);
 return {gate,commercial,success,playerWages,staffWages,net:gate+commercial+success-playerWages-staffWages};
}
export function seasonRevenue(g,c,tableRank){
 const tiers=[480000,240000,120000,65000],scale=[1,.7,.45,.28][c.division],rankBonus=Math.round((25-tableRank)*2500*scale);
 return Math.round(tiers[c.division]+Math.max(0,rankBonus));
}
export function ensureStaff(g){
 if(!g.staff)g.staff={};
 const base=Math.abs((g.seed??1989)*17+(g.manager?.clubId??g.selected??0)*31);
 if(!ASSISTANT_STYLES[g.staff.assistant?.style])g.staff.assistant={style:Object.keys(ASSISTANT_STYLES)[base%Object.keys(ASSISTANT_STYLES).length]};
 if(!SCOUT_STYLES[g.staff.scout?.style])g.staff.scout={style:Object.keys(SCOUT_STYLES)[Math.floor(base/5)%Object.keys(SCOUT_STYLES).length]};
 if(!PHYSIO_STYLES[g.staff.physio?.style])g.staff.physio={style:Object.keys(PHYSIO_STYLES)[Math.floor(base/11)%Object.keys(PHYSIO_STYLES).length]};
 return g.staff;
}
export function staffReport(g){
 const staff=ensureStaff(g);
 return {assistant:{...staff.assistant,...ASSISTANT_STYLES[staff.assistant.style]},scout:{...staff.scout,...SCOUT_STYLES[staff.scout.style]},physio:{...staff.physio,...PHYSIO_STYLES[staff.physio.style]}};
}
// Assistant Manager uses the same positional constraints as Auto Pick but values
// match readiness. Injury exclusion is hard; form and morale only modify selection.
export function assistantLineup(c,staff=null){
 const weights={GK:{skill:.70,fitness:.14,morale:.08,form:.05,experience:.03},DEF:{skill:.69,fitness:.14,morale:.08,form:.06,experience:.03},MID:{skill:.65,fitness:.17,morale:.09,form:.06,experience:.03},FWD:{skill:.65,fitness:.13,morale:.09,form:.10,experience:.03}};
 const style=staff?.style||'balanced';
 const rate=p=>{
  const w={...weights[p.pos]};
  if(style==='attacking'){w.skill+=.09;w.fitness-=.05;w.morale-=.02;w.form-=.02;}
  if(style==='fitness'){w.skill-=.10;w.fitness+=.13;w.morale-=.02;w.experience-=.01;}
  if(style==='morale'){w.skill-=.09;w.morale+=.08;w.form+=.04;w.fitness-=.03;}
  if(style==='experience'){w.skill-=.08;w.experience+=.10;w.fitness-=.02;}
  const fitness=Math.max(0,Math.min(100,p.fitness??100));
  const morale=Math.max(0,Math.min(100,p.morale??70));
  const form=Math.max(0,Math.min(10,p.form??6.5))*10;
  const experience=Math.max(0,Math.min(100,p.experience??0));
  return p.skill*w.skill+fitness*w.fitness+morale*w.morale+form*w.form+experience*w.experience;
 };
 return Object.entries(FORMATIONS[c.formation]).flatMap(([pos,n])=>c.squad
   .filter(p=>p.pos===pos&&!p.injured)
   .sort((a,b)=>rate(b)-rate(a)||b.skill-a.skill||a.id-b.id)
   .slice(0,n).map(p=>p.id));
}
// Presentation labels only. Cup brackets remain the existing simplified model.
export function cupRoundName(name,round){
 const rounds=name==='FA Cup'?
  ['First Round','Second Round','Third Round','Fourth Round','Fifth Round','Quarter-final (Sixth Round)','Semi-final','Final']:
  ['First Round','Second Round','Third Round','Fourth Round','Quarter-final (Fifth Round)','Semi-final','Final'];
 return rounds[Number(round)-1]||`Round ${round}`;
}
export function toggleStarter(club,playerId,checked){const id=Number(playerId),p=club.squad.find(p=>p.id===id);if(!p)throw Error('Player not found');if(checked){if(p.injured)throw Error('Injured players cannot start');if(club.lineup.includes(id))return {action:'unchanged'};const cap=FORMATIONS[club.formation]?.[p.pos]??0;if(!cap)throw Error('Position unavailable');const starters=club.squad.filter(x=>x.pos===p.pos&&club.lineup.includes(x.id));if(starters.length>=cap){const out=[...starters].sort((a,b)=>a.skill-b.skill||a.id-b.id)[0];club.lineup=club.lineup.map(x=>x===out.id?id:x);return {action:'swapped',replaced:out.name,added:p.name};}club.lineup.push(id);return {action:'added',added:p.name};}club.lineup=club.lineup.filter(x=>x!==id);return {action:'removed',removed:p.name};}
export function swapPlayers(c,onId,offId){const incoming=c.squad.find(p=>p.id===Number(onId)),outgoing=c.squad.find(p=>p.id===Number(offId));if(!incoming||!outgoing||incoming.pos!==outgoing.pos)throw Error('Choose a replacement in the same position');if(incoming.injured||!c.lineup.includes(outgoing.id)||c.lineup.includes(incoming.id))throw Error('Invalid replacement');c.lineup=c.lineup.map(id=>id===outgoing.id?incoming.id:id);return {action:'swapped',replaced:outgoing.name,added:incoming.name};}
export function validLineup(c){if(!FORMATIONS[c.formation]||c.lineup.length!==11||new Set(c.lineup).size!==11)return false;return Object.entries(FORMATIONS[c.formation]).every(([pos,n])=>c.squad.filter(p=>c.lineup.includes(p.id)&&p.pos===pos&&!p.injured).length===n);}
function initialiseCup(g,name){const league=g.clubs.filter(c=>c.division>=2).map(c=>c.id);let entrants=name==='FA Cup'?[...league,...Array.from({length:32},(_,i)=>-(i+1))]:[...league,...g.clubs.filter(c=>c.division===1).slice(0,8).map(c=>c.id)];return {name,stage:0,entrants,completed:[],winner:null};}
export function newGame(selected=CLUBS.find(c=>c.name==='Exeter City').id,seed=1989,mode='fictional'){if(!Object.hasOwn(CAREER_MODES,mode))throw Error('Unknown career mode');const r=rng(seed);let pid=1;const clubs=CLUBS.map(({id,name,division})=>{const squad=[...Array.from({length:2},()=>player(pid++,'GK',r,division)),...Array.from({length:6},()=>player(pid++,'DEF',r,division)),...Array.from({length:6},()=>player(pid++,'MID',r,division)),...Array.from({length:6},()=>player(pid++,'FWD',r,division))];uniqueNames(squad,r);const c={id,name,division,squad,formation:'4-4-2',tactic:'Balanced',lineup:[],rating:rand(r,43,65)+(3-division)*5,budget:rand(r,40,150)*1000*(4-division),money:rand(r,150,500)*1000*(4-division)};c.lineup=autoLineup(c);return c;});if(mode==='alternate'){
 const fictionalNames=fictionalClubNames(seed);
 for(const c of clubs){c.historicalName=c.name;c.name=fictionalNames[c.id];c.worldIdentity='generated';const palettes=[['#8b2c46','#a7c8dc'],['#2255a6','#f4e5ce'],['#b62b38','#e8dec9'],['#1a704c','#efb640'],['#e9aa31','#171f31'],['#faf7ec','#182d54'],['#653996','#f7c9a0']];c.customColours=palettes[(c.id+Math.floor(seed%7))%palettes.length];}
 }
 if(mode==='historical'||mode==='historical-opening'){
  for(const c of clubs){
   const known=HISTORICAL_PREVIEW[c.name];
   c.historicalResearch={verified:known?.length||0,total:c.squad.length,source:HISTORICAL_SOURCES[c.name]||null};
   if(!known)continue;
   // Replace one same-position fictional record per verified season player,
   // retaining all gameplay attributes as simulated estimates.
   for(const [name,pos] of known){
    let candidate=c.squad.find(p=>p.pos===pos&&!p.historicalVerified);
    if(!candidate){candidate=player(pid++,pos,r,c.division);c.squad.push(candidate);}
    candidate.name=name;candidate.historicalVerified=true;
    const [birth,ability,potential]=HISTORICAL_PLAYER_PROFILES[c.name]?.[name]||[null,null,null];
    candidate.dateOfBirth=birth;candidate.ageEstimated=!birth;
    candidate.age=birth?ageOnSeasonStart(birth,1989):18+(candidate.id%16);
    candidate.skill=ability??candidate.skill;
    candidate.potential=Math.max(candidate.skill,potential??candidate.potential);
    candidate.experience=Math.max(0,(candidate.age-17)*3);
    candidate.historicalSource=HISTORICAL_SOURCES[c.name];
   }
   uniqueNames(c.squad,r);
   c.lineup=autoLineup(c);
  }
 }
 if(mode==='historical'||mode==='historical-opening'){
  applyHistoricalResearch({clubs},RESEARCH_PILOT,mode==='historical-opening');
  if(mode==='historical-opening'){
   const lateVilla=new Set(['Dwight Yorke','Tony Cascarino','Andy Comyn']);
   const villa=clubs.find(c=>c.name==='Aston Villa');
   for(const p of villa.squad){if(lateVilla.has(p.name)){const replacement=player(p.id,p.pos,r,villa.division);Object.assign(p,replacement);}}
   villa.lineup=autoLineup(villa);
  }
 }
 const freeAgents=Array.from({length:35},(_,i)=>player(pid++,['GK','DEF','MID','FWD'][i%4],r));const g={version:3,careerMode:mode,historicalCoverage:mode.startsWith('historical')?'Research preview: 6 of 92 clubs have partial season-name coverage. Only some opening-day registrations evidenced; other players generated.':null,financeLedger:[],staffHistory:[],manager:{clubId:selected,reputation:45,security:65,employed:true,offers:[],applications:[],career:[],lastReviewWeek:-1},transferHistory:[],matchReports:[],versionLabel:'1.0',seed,selected,round:0,season:1989,status:'active',clubs,freeAgents,fixtures:[],results:[],lastMatch:null,messages:['Welcome to your club. The 1989–90 campaign begins!'],history:[],cups:{}};refreshFixtures(g);g.cups={'FA Cup':initialiseCup(g,'FA Cup'),'League Cup':initialiseCup(g,'League Cup')};ensureStaff(g);ensureCareerRecord(g);youthIntake(g);createWelcomeStory(g);return g;}

// Individual, subjective 1989 starting assessments (ability, potential).
// Ratings are original game balancing, NOT scraped or measurable historical data.
// Names supplied in player research are scored by 1989 standing, not future fame.
export const HISTORICAL_RATING_OVERRIDES=Object.freeze({
 'Liverpool':{
  'Bruce Grobbelaar':[86,86],'Mike Hooper':[64,68],
  'Gary Ablett':[77,81],'David Burrows':[75,85],'Gary Gillespie':[80,81],
  'Alan Hansen':[87,87],'Steve Harkness':[52,79],'Glenn Hysén':[85,85],
  'Barry Jones':[49,68],'Steve Nicol':[86,86],'Steve Staunton':[76,88],
  'Nick Tanner':[64,70],'Barry Venison':[78,80],'Alex Watson':[61,73],
  'Spencer Whelan':[49,70],'John Barnes':[92,93],'Charlie Boyd':[55,68],
  'Ray Houghton':[85,86],'Jim Magilton':[63,83],'Mike Marsh':[59,79],
  'Steve McMahon':[84,85],'Jan Mølby':[82,83],'Ronnie Whelan':[83,84],
  'Steve McManaman':[51,92],'John Aldridge':[84,84],
  'Peter Beardsley':[88,89],'Kenny Dalglish':[70,70],
  'Wayne Harrison':[52,65],'Ian Rush':[90,90],'Ronny Rosenthal':[78,81]
 },
 'Aston Villa':{
  'Lee Butler':[59,69],'Nigel Spink':[81,83],
  'Bernie Gallacher':[64,73],'Kevin Gage':[72,77],
  'Stuart Gray':[75,77],'Paul McGrath':[84,85],
  'Derek Mountfield':[79,81],'Kent Nielsen':[82,84],
  'Chris Price':[72,76],'Andy Comyn':[60,76],
  'Paul Birch':[74,76],'Mark Blake':[61,79],
  'Gordon Cowans':[84,84],'Adrian Heath':[76,78],
  'David Platt':[85,91],'Gareth Williams':[61,74],
  'Nigel Callaghan':[72,75],'Tony Daley':[80,88],
  'Ian Olney':[75,84],'Ian Ormondroyd':[75,78],
  'Tommy Mooney':[52,78],'Dwight Yorke':[54,93],
  'Tony Cascarino':[79,80]
 }
});
function stableNameHash(value){let h=2166136261;for(const ch of value){h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;}return h>>>0;}
export function estimateHistoricalRating({team,name,pos,division=0,age=null,apps=null,subs=null,goals=null}){
 const manual=HISTORICAL_RATING_OVERRIDES[team]?.[name]||HISTORICAL_PLAYER_PROFILES[team]?.[name]?.slice(1);
 if(manual?.every(Number.isFinite))return {ability:manual[0],potential:manual[1],basis:'individual 1989 assessment'};
 const hash=stableNameHash(`${team}|${name}|${pos}`);
 const total=Number.isFinite(apps)?Math.max(0,apps)+Math.max(0,Number.isFinite(subs)?subs:0)*.4:null;
 // Appearances distinguish regulars from fringe players, without letting missing
 // columns become zero appearances and identical starting values.
 const participation=total===null?((hash%19)-9)*.7:
   total>=32?12:total>=22?8:total>=12?4:total>=5?0:total>0?-5:-10;
 const base=pos==='GK'?58:pos==='DEF'?56:pos==='MID'?57:59;
 const randomness=((hash>>>8)%11)-5;
 const goalsBonus=Number.isFinite(goals)?Math.min(6,Math.max(0,goals)*.32):0;
 const ability=Math.max(38,Math.min(90,Math.round(base+(3-division)*4+participation+randomness+goalsBonus)));
 const growth=age!==null&&age<=18?23:age!==null&&age<=21?19:age!==null&&age<=24?13:age!==null&&age<=28?8:age!==null&&age>=34?1:5;
 const potential=Math.min(95,Math.max(ability,ability+growth+((hash>>>16)%5)-2));
 return {ability,potential,basis:total===null?'estimated: statistics unavailable':'estimated: appearances, age, position and club level'};
}

// Import researched names without changing the simulation engine. CSV and pilot
// records are evidence candidates, NOT a certified registered squad database.
export function applyHistoricalResearch(g, records, openingOnly=false){
 if(!Array.isArray(records))throw Error('Historical research must be a list of player records');
 const grouped=new Map();let accepted=0, skipped=0;
 const cutoff='1989-08-19';
 for(const row of records){
  const name=String(row.Player||row.name||'').trim(),team=String(row.Team||row.team||'').trim();
  if(!name||!team){skipped++;continue;}
  const p=String(row.Pos||row.pos||'').toLowerCase();
  const pos=/goalkeeper|^gk(?:\/|$)/.test(p)?'GK':/def|back|^df(?:\/|$)/.test(p)?'DEF':/mid|^mf(?:\/|$)/.test(p)?'MID':/forw|strik|wing|^fw(?:\/|$)/.test(p)?'FWD':null;
  if(!pos){skipped++;continue;}
  const joined=String(row.Joined||row.joined||'').trim(),left=String(row.Left||row.left||'').trim();
  const hasDates=/^\d{4}-\d{2}-\d{2}$/.test(joined);
  const departure=/^\d{4}-\d{2}-\d{2}$/.test(left);
  // A historical season appearance is not proof of opening-day registration.
  // Refuse uncertain and contradictory club spells for this stricter mode.
  if(openingOnly&&((!hasDates&&!/^User research: opening-day candidate/.test(String(row.Registration_Status||'')))||(hasDates&&joined>cutoff)||(departure&&left<cutoff))){skipped++;continue;}
  if(!grouped.has(team))grouped.set(team,[]);
  grouped.get(team).push({...row,Player:name,Pos:pos});
 }
 for(const club of g.clubs){
  const rows=grouped.get(club.name);if(!rows?.length)continue;
  // Pilot data takes precedence over the older partial preview for these clubs.
  let slots=club.squad.filter(p=>!p.historicalVerified);
  for(const row of rows){
   let target=club.squad.find(p=>p.name===row.Player);
   if(!target){target=slots.find(p=>p.pos===row.Pos);if(target)slots.splice(slots.indexOf(target),1);}
   if(!target){const nextId=Math.max(0,...g.clubs.flatMap(c=>c.squad.map(p=>p.id)))+1;
    target={...club.squad.find(p=>p.pos===row.Pos)||club.squad[0],id:nextId,pos:row.Pos};club.squad.push(target);}
   const dob=String(row.DOB||row.dob||'');
   const age=ageOnSeasonStart(dob,1989);
   // Missing statistics are NULL (not zero): 30 Liverpool profiles in the
   // original user research had blank Apps/Goals, which made ALL players 63.
   const numberOrNull=value=>value===undefined||value===null||String(value).trim()===''||String(value).trim()==='-'?null:(Number.isFinite(Number(value))?Number(value):null);
   const apps=numberOrNull(row.Apps),subs=numberOrNull(row.Subs),goals=numberOrNull(row.Goals);
   const estimated=estimateHistoricalRating({team:club.name,name:row.Player,pos:row.Pos,division:club.division,age,apps,subs,goals});
   target.name=row.Player;target.pos=row.Pos;target.historicalVerified=true;
   target.historicalSource=row.Profile_URL||row.Squad_URL||'User-supplied research';
   target.dateOfBirth=age===null?null:dob;target.ageEstimated=age===null;
   if(age!==null)target.age=age;
   target.skill=estimated.ability;target.potential=Math.max(target.skill,estimated.potential);
   target.historicalRatingBasis=estimated.basis;
   target.experience=Math.max(0,(target.age-17)*3);
   target.historicalRegistration=openingOnly?'Opening-day candidate':'Season-associated (may be later arrival)';
   target.historicalResearchFlag=row.QA_Flags||'';
   accepted++;
  }
  club.historicalResearch={verified:club.squad.filter(p=>p.historicalVerified).length,total:club.squad.length,source:rows[0].Squad_URL||'User-supplied research'};
  club.lineup=autoLineup(club);
 }
 return {accepted,skipped,clubs:[...grouped.keys()].length};
}

// Explicit opt-in repair for early 1.9.7 browser saves created before ratings
// were differentiated. Never rewrites career progress or historic match results.
export function recalibrateHistoricalRatings(g){
 if(!g||!String(g.careerMode||'').startsWith('historical')||g.season!==1989||g.round!==0)
  throw Error('Rating repair is available only before playing week one of a 1989 historical career.');
 let updated=0;
 for(const c of g.clubs){
  for(const p of c.squad){
   if(!p.historicalVerified||p.historicalRatingBasis)continue;
   const r=estimateHistoricalRating({team:c.name,name:p.name,pos:p.pos,division:c.division,
    age:p.age,apps:null,subs:null,goals:null});
   p.skill=r.ability;p.potential=Math.max(r.ability,r.potential);
   p.historicalRatingBasis=r.basis;updated++;
  }
 }
 return updated;
}

function refreshFixtures(g){g.fixtures=Array.from({length:46},()=>[]);for(let d=0;d<4;d++){const f=makeFixtures(g.clubs.filter(c=>c.division===d).map(c=>c.id));f.forEach((fixtures,i)=>g.fixtures[i].push(...fixtures));}}
// Match ratings use the XI, not the badge. Positional units and selection penalties are
// deliberately consequential; a little club infrastructure remains as an influence.
export function teamStrength(c){
 if(c.id<0)return {attack:44,midfield:44,defence:44,overall:44};
 const formation=FORMATIONS[c.formation]||FORMATIONS['4-4-2'];
 const byPosition={};
 for(const [pos,required] of Object.entries(formation)){
  const selected=(c.squad||[]).filter(p=>c.lineup?.includes(p.id)&&p.pos===pos&&!p.injured);
  let sum=selected.reduce((n,p)=>n+p.skill*(.55+.45*(p.fitness??100)/100)*(.82+.18*(p.morale??70)/70)*(0.93+Math.min(10,Math.max(0,(p.form??6.5)-5))*0.018)*(0.97+Math.min(25,p.experience??0)*0.001),0);
  // Never reward a missing starter or the wrong number of defenders/forwards.
  byPosition[pos]=(sum+Math.max(0,required-selected.length)*18)/required;
 }
 const attack=.69*byPosition.FWD+.23*byPosition.MID+.08*byPosition.DEF;
 const midfield=.63*byPosition.MID+.21*byPosition.DEF+.16*byPosition.FWD;
 const defence=.46*byPosition.DEF+.31*byPosition.GK+.23*byPosition.MID;
 const infrastructure=(c.rating??50)*.08;
 const overall=.92*(attack+midfield+defence)/3+infrastructure;
 return {attack,midfield,defence,overall};
}
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
 const r=rng(seed),h=teamStrength(home),a=teamStrength(away),delta=h.overall-a.overall;
 const homeEdge=.14;
 const chanceHome=Math.max(.16,Math.min(3.7,1.28+homeEdge+(h.attack-a.defence)*.055+(h.midfield-a.midfield)*.022));
 const chanceAway=Math.max(.16,Math.min(3.7,1.19+(a.attack-h.defence)*.055+(a.midfield-h.midfield)*.022));
 const hg=poisson(r,chanceHome),ag=poisson(r,chanceAway);
 const events=[{minute:0,team:home.id,type:'kickoff',text:eventText('kickoff',r)}];
 const goalEntries=[];
 for(const [c,n] of [[home,hg],[away,ag]])for(let i=0;i<n;i++){
  const pool=c.squad?.filter(p=>c.lineup.includes(p.id)&&p.pos!=='GK')||[];
  const weighted=pool.flatMap(p=>Array.from({length:p.pos==='FWD'?5:p.pos==='MID'?3:1},()=>p));
  const p=weighted.length?weighted[rand(r,0,weighted.length-1)]:null;
  const assistOptions=pool.filter(x=>x.id!==p?.id&&x.pos!=='GK');const assist=assistOptions.length&&r()<.63?assistOptions[rand(r,0,assistOptions.length-1)]:null;
  goalEntries.push({assistId:assist?.id??null,minute:rand(r,2,89),team:c.id,type:'goal',scorer:p?.name||'Own goal',playerId:p?.id,text:eventText('goal',r,p?.name)});
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
// Reconstruct a replay score from incidents already seen, never from final totals.
export function replayScore(report,seenCount=0){
 const events=(report?.events||[]).slice(0,Math.max(0,seenCount));
 return [events.filter(e=>e.type==='goal'&&e.team===report.home).length,
         events.filter(e=>e.type==='goal'&&e.team===report.away).length];
}
export function standings(g,division=g.clubs[g.selected].division){const teams=g.clubs.filter(c=>c.division===division).map(c=>({id:c.id,name:c.name,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0})),byId=new Map(teams.map(t=>[t.id,t]));for(const x of g.results){const h=byId.get(x.home),a=byId.get(x.away);if(!h||!a)continue;h.p++;a.p++;h.gf+=x.hg;h.ga+=x.ag;a.gf+=x.ag;a.ga+=x.hg;if(x.hg>x.ag){h.w++;a.l++;h.pts+=3}else if(x.hg<x.ag){a.w++;h.l++;a.pts+=3}else{h.d++;a.d++;h.pts++;a.pts++;}}return teams.sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.name.localeCompare(b.name));}
function getCupClub(g,id){return id<0?{id,name:'Non-League XI '+(-id),lineup:[],squad:[],rating:45,tactic:'Balanced'}:g.clubs[id];}
function cupDecider(g,homeId,awayId,salt){const r=simulateMatch(getCupClub(g,homeId),getCupClub(g,awayId),salt);let winner;if(r.hg!==r.ag)winner=r.hg>r.ag?homeId:awayId;else {const rr=rng(salt+7191);winner=rr()<.5?homeId:awayId;r.penalties=true;}return {...r,winner,cup:true};}
const CUP_WEEKS={'FA Cup':[8,12,16,21,26,31,36,41,45],'League Cup':[2,6,11,18,25,33,40,44]};
function progressCup(g,name){const cup=g.cups[name],stage=cup.stage;if(cup.winner!==null)return;let entrants=[...cup.entrants];if(name==='FA Cup'&&stage===2){entrants.push(...g.clubs.filter(c=>c.division<=1).map(c=>c.id));}if(name==='League Cup'&&stage===1){entrants.push(...g.clubs.filter(c=>c.division===0).map(c=>c.id));entrants.push(...g.clubs.filter(c=>c.division===1).slice(8).map(c=>c.id));}const r=rng(g.seed+g.season*1000+stage*787+(name==='FA Cup'?1:2));for(let i=entrants.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[entrants[i],entrants[j]]=[entrants[j],entrants[i]];}if(entrants.length%2)throw Error(name+' unmatched draw');const fixtures=[];for(let i=0;i<entrants.length;i+=2){const home=entrants[i],away=entrants[i+1],result=cupDecider(g,home,away,g.seed+g.season*111+stage*507+i*123+ (name==='FA Cup'?21:42));fixtures.push(result);
 // Simplified cup receipts: modest home gate plus round-progress bonus for the winning club.
 const winnerClub=g.clubs[result.winner];
 const roundPrize=Math.round((name==='FA Cup'?6000:4000)*(1+stage*.65));
 if(winnerClub){winnerClub.money+=roundPrize;if(winnerClub.id===g.selected){g.financeLedger??=[];g.financeLedger.unshift({season:g.season,week:g.round+1,clubId:winnerClub.id,type:'CUP PRIZE',amount:roundPrize,note:`${name} · ${cupRoundName(name,stage+1)} victory`});}}
 const host=g.clubs[home];if(host){const gate=Math.round(7500*[1,.7,.48,.30][host.division]);host.money+=gate;if(host.id===g.selected){g.financeLedger??=[];g.financeLedger.unshift({season:g.season,week:g.round+1,clubId:host.id,type:'CUP GATE',amount:gate,note:`${name} · home tie`});}}
 if(result.home===g.selected||result.away===g.selected){g.messages.unshift(`${name}: ${getCupClub(g,home).name} ${result.hg}–${result.ag} ${getCupClub(g,away).name}${result.penalties?' (penalties)':''}`);g.lastCupMatch={name,competition:name,round:stage+1,weekRecorded:g.round+1,seasonRecorded:g.season,...result};g.matchReports.push(g.lastCupMatch);}}cup.completed.push({round:stage+1,matches:fixtures});cup.entrants=fixtures.map(x=>x.winner);cup.stage++;if(cup.entrants.length===1){cup.winner=cup.entrants[0];g.messages.unshift(`${name} winners: ${getCupClub(g,cup.winner).name}!`);}}
export function advanceRound(g){if(g.status==='finished')return g;const week=g.round;for(const [i,[h,a]] of g.fixtures[week].entries()){const result=simulateMatch(g.clubs[h],g.clubs[a],g.seed+week*1009+i*7919);g.results.push(result);if(h===g.selected||a===g.selected){g.lastMatch={...result,competition:'LEAGUE',division:g.clubs[h].division,week:week+1};g.matchReports.push(g.lastMatch);}for(const e of result.events)if(e.playerId){const p=g.clubs[e.team].squad.find(p=>p.id===e.playerId);if(p){p.goals++;p.careerGoals=(p.careerGoals??0)+1;}}for(const [club,ours,theirs] of [[g.clubs[h],result.hg,result.ag],[g.clubs[a],result.ag,result.hg]]){const delta=ours>theirs?0.35:ours<theirs?-0.38:0.05;for(const p of club.squad.filter(p=>club.lineup.includes(p.id))){enrichPlayer(p,g.seed);p.appearances++;p.careerAppearances++;const scored=result.events.filter(e=>e.type==='goal'&&e.playerId===p.id).length;p.form=Math.max(3,Math.min(10,0.68*p.form+0.32*(6.4+delta+scored*1.7)));p.morale=Math.max(15,Math.min(100,p.morale+(ours>theirs?2:ours<theirs?-2:0)+(scored?3:0)));}for(const goal of result.events.filter(e=>e.type==='goal'&&e.team===club.id&&e.assistId)){const a=club.squad.find(p=>p.id===goal.assistId);if(a){a.assists=(a.assists||0)+1;a.careerAssists=(a.careerAssists||0)+1;}}}}for(const name of ['FA Cup','League Cup'])if(CUP_WEEKS[name].includes(week))progressCup(g,name);for(const c of g.clubs){const chosen=new Set(c.lineup);for(const p of c.squad){if(p.injured){p.injured--;if(c.id===g.selected&&p.injured>0&&rng(g.seed+week*12391+p.id*49)()<staffReport(g).physio.recovery)p.injured--;p.fitness=Math.min(100,p.fitness+8);}else if(chosen.has(p.id)){p.fitness=Math.max(55,p.fitness-rand(rng(g.seed+week*333+p.id),3,8));if(rng(g.seed+week*10007+p.id*97)()<.008)p.injured=rand(rng(g.seed+p.id+week),1,3);}else p.fitness=Math.min(100,p.fitness+7);}const econ=clubEconomy(g,c,week);c.money+=econ.net;if(c.id===g.selected){g.financeLedger??=[];g.financeLedger.unshift({season:g.season,week:week+1,clubId:c.id,type:'WEEKLY OPERATIONS',amount:econ.net,note:`${g.fixtures[week].some(([h])=>h===c.id)?`Home league gate £${econ.gate}`:g.fixtures[week].some(([h,a])=>a===c.id)?'Away league fixture — no home gate':'No league fixture this week'}; club income £${econ.commercial+econ.success}; player wages £${econ.playerWages}; staff wages £${econ.staffWages}`});}if(!validLineup(c))c.lineup=autoLineup(c);}
 if(g.manager?.employed){
  const rec=ensureCareerRecord(g), clubId=g.manager.clubId;
  // League results are always present in g.results, regardless of which screen is open.
  const league=g.results.findLast(x=>(x.home===clubId||x.away===clubId) && g.fixtures[week].some(pair=>pair[0]===x.home&&pair[1]===x.away));
  if(league){const home=league.home===clubId;rec.matches.push({season:g.season,week:week+1,clubId,competition:'LEAGUE',gf:home?league.hg:league.ag,ga:home?league.ag:league.hg});}
  // Cup fixtures are recorded directly from this week's newly produced reports.
  const playedCups=(g.matchReports||[]).filter(x=>x.competition!=='LEAGUE'&&(x.home===clubId||x.away===clubId)&&x.weekRecorded===week+1&&x.seasonRecorded===g.season);
  for(const x of playedCups){const home=x.home===clubId;rec.matches.push({season:g.season,week:week+1,clubId,competition:x.competition,gf:home?x.hg:x.ag,ga:home?x.ag:x.hg});}
 }
 g.round++;updateManager(g);weeklyStory(g);if(g.round===46){g.status='finished';finishSeason(g);}g.messages.unshift(`Week ${g.round}: league fixtures completed`);return g;}
function playoffWinner(g,ids,seed){const semi1=cupDecider(g,ids[0],ids[3],seed),semi2=cupDecider(g,ids[1],ids[2],seed+13),final=cupDecider(g,semi1.winner,semi2.winner,seed+91);return {winner:final.winner,matches:[semi1,semi2,final]};}
export function finishSeason(g){if(g.history.length&&g.history.at(-1).season===g.season)return g;const tables=[0,1,2,3].map(d=>standings(g,d));const promote=[[],[],[],[]],relegate=[[],[],[],[]],playoffs={};for(let d=1;d<=3;d++){const count=d===3?3:2;promote[d]=tables[d].slice(0,count).map(x=>x.id);const eligible=tables[d].slice(count,count+4).map(x=>x.id);const po=playoffWinner(g,eligible,g.seed+g.season*17+d*1103);playoffs[d]=po;promote[d].push(po.winner);}relegate[0]=tables[0].slice(-3).map(x=>x.id);relegate[1]=tables[1].slice(-3).map(x=>x.id);relegate[2]=tables[2].slice(-4).map(x=>x.id);const summary={season:g.season,tables:tables.map(t=>t.map(x=>({...x}))),promote,relegate,playoffs,cupWinners:Object.fromEntries(Object.entries(g.cups).map(([name,c])=>[name,c.winner]))};g.history.push(summary);for(const c of g.clubs){const rank=tables[c.division].findIndex(x=>x.id===c.id)+1,award=seasonRevenue(g,c,rank);c.money+=award;c.budget=Math.max(0,c.budget+Math.round(award*.17));if(c.id===g.selected){g.financeLedger??=[];g.financeLedger.unshift({season:g.season,week:46,clubId:c.id,type:'SEASON DISTRIBUTION',amount:award,note:`${DIV_NAMES[c.division]} finish: ${rank}${rank===1?'st':'th'}; prize and league distribution`});}}if(g.manager?.employed){
 const rec=ensureCareerRecord(g),id=g.manager.clubId,div=g.clubs[id].division;
 const rank=tables[div].findIndex(x=>x.id===id)+1;
 const add=(type,title)=>{if(!rec.honours.some(x=>x.season===g.season&&x.clubId===id&&x.title===title))rec.honours.push({season:g.season,clubId:id,type,title});};
 if(rank===1)add('title',DIV_NAMES[div]+' champions');
 if(div>0&&promote[div].includes(id))add('promotion','Promoted from '+DIV_NAMES[div]);
 for(const [name,winner] of Object.entries(summary.cupWinners))if(winner===id)add('cup',name+' winners');
 }
 g.messages.unshift('Season complete! Promotions and relegations decided. See the Season Review.');return g;}
export function newSeason(g){if(g.status!=='finished')throw Error('Finish the season first');const h=g.history.at(-1);for(let d=1;d<=3;d++)for(const id of h.promote[d])g.clubs[id].division=d-1;for(let d=0;d<=2;d++)for(const id of h.relegate[d])g.clubs[id].division=d+1;developPlayers(g);g.season++;youthIntake(g);g.round=0;g.status='active';g.results=[];g.lastMatch=null;g.lastCupMatch=null;refreshFixtures(g);g.cups={'FA Cup':initialiseCup(g,'FA Cup'),'League Cup':initialiseCup(g,'League Cup')};for(const c of g.clubs){c.budget=Math.max(10000,c.budget+Math.round(c.money*.08));for(const p of c.squad){p.fitness=100;p.injured=0;p.morale=Math.max(35,Math.min(85,(p.morale??70)+5));}c.lineup=autoLineup(c);}g.matchReports=[];g.messages.unshift('A new season begins with fresh fixtures!');addStory(g,'chairman','A NEW CAMPAIGN BEGINS',`The ${g.season}–${String(g.season+1).slice(-2)} season is upon us. The board expects a fresh effort from everyone at ${g.clubs[g.selected].name}.`);ensureStory(g).lastWeekKey=null;if(g.manager)g.manager.lastReviewWeek=-1;return g;}
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
export function squadAssessment(g){
 const c=g.clubs[g.selected],pos=['GK','DEF','MID','FWD'];
 const notes=[],ratings={};
 for(const key of pos){
  const players=c.squad.filter(p=>p.pos===key).sort((a,b)=>b.skill-a.skill),required=FORMATIONS[c.formation]?.[key]||1;
  const first=players.slice(0,required),average=first.length?first.reduce((s,p)=>s+p.skill,0)/first.length:0;
  ratings[key]=Math.round(average);
  if(players.length<=required)notes.push(`We lack cover in ${key}.`);
 }
 const ordered=Object.entries(ratings).sort((a,b)=>a[1]-b[1]);
 const weak=ordered[0]?.[0]||'MID';
 notes.unshift(`Our weakest unit is ${weak} (rating ${ratings[weak]}). We need a player who improves it, not just another squad number.`);
 const low=c.squad.filter(p=>(p.morale??70)<48).sort((a,b)=>a.morale-b.morale)[0];
 if(low)notes.push(`${low.name} has poor morale; a conversation could help.`);
 const veteran=c.squad.filter(p=>(p.age??26)>=33).sort((a,b)=>b.age-a.age)[0];
 if(veteran)notes.push(`${veteran.name} is ${veteran.age}; we should plan for a replacement.`);
 const struggling=c.squad.filter(p=>(p.appearances??0)>=4&&(p.form??6.5)<5.5).sort((a,b)=>a.form-b.form)[0];
 if(struggling)notes.push(`${struggling.name} is struggling for form.`);
 const inexperienced=c.lineup.map(id=>c.squad.find(p=>p.id===id)).filter(Boolean).filter(p=>(p.age??25)<21).length;
 if(inexperienced>=4)notes.push(`We are fielding ${inexperienced} youngsters; experience could make us more consistent.`);
 if(notes.length<3)notes.push('Our scout will prioritise value and stronger first-team options.');
 return {ratings,weakPosition:weak,notes};
}
export function transferCandidates(g){
 const cacheKey=`v184-${g.season}-${g.round}-${g.selected}`;
 g.scoutShortlists??={};
 if(g.scoutShortlists[cacheKey]){const cached=g.scoutShortlists[cacheKey].map(({id,reason})=>{const c=g.clubs.find(c=>c.squad.some(p=>p.id===id));const p=c?.squad.find(p=>p.id===id)||g.freeAgents.find(p=>p.id===id);return p?{...enrichPlayer(p),value:c&&c.id!==g.selected?p.value:0,fromClubId:c?.id??null,...(c?.id===g.selected?{signed:true}:{}),scoutReason:reason}:null;}).filter(Boolean);return cached;}
 // Deterministic, squad-aware recommendations. Each shortlist uses the same six slots all week.
 const club=g.clubs[g.selected],assessment=squadAssessment(g),r=rng(g.seed+g.season*7919+g.round*100003+g.selected*151);
 const candidates=g.clubs.filter(c=>c.id!==g.selected).flatMap(c=>c.squad.filter(p=>!c.lineup.includes(p.id)).map(p=>({...enrichPlayer(p),fromClubId:c.id})))
    .concat(g.freeAgents.map(p=>({...enrichPlayer(p),value:0,fromClubId:null})));
 const selected=[],used=new Set(),variance=new Map(candidates.map(p=>[p.id,r()]));
 const scoutStyle=ensureStaff(g).scout.style;
 const preference=p=>scoutStyle==='veterans'?((p.age??24)>=28?10:0)+Math.max(0,8-p.value/30000):scoutStyle==='youth'?((p.age??30)<=21?12:0)+Math.max(0,(p.potential??p.skill)-p.skill)*.35:scoutStyle==='upgrades'?Math.max(0,p.skill-(assessment.ratings[p.pos]??60))*.8:Math.max(0,10-p.value/22000)+(p.fromClubId===null?5:0);

 const take=(filter,score,reason)=>{
  const list=candidates.filter(p=>!used.has(p.id)&&filter(p)).sort((a,b)=>score(b)+preference(b)-score(a)-preference(a)||a.id-b.id);
  if(list.length){const best=list[reason==='Affordable listed player from another club'?g.round%Math.min(8,list.length):0];used.add(best.id);selected.push({...best,scoutReason:reason});}
 };
 const affordable=p=>transferAffordability(club,p).affordable;
 const upgrade=p=>p.skill>assessment.ratings[p.pos]+3;
 const valueScore=p=>p.skill-assessment.ratings[p.pos]+(p.fromClubId===null?5:0)+Math.min(6,Math.round((club.budget-p.value)/40000));
 take(p=>p.pos===assessment.weakPosition&&affordable(p)&&upgrade(p),valueScore,'First-team improvement in our weakest position');
 take(p=>affordable(p)&&upgrade(p),valueScore,'An immediate first-team improvement');
 // Make the free market genuinely visible every week, including released youth from any division.
 take(p=>affordable(p)&&p.fromClubId===null&&p.youth&&p.potential>=p.skill+12,p=>(p.potential-p.skill)*1.6+p.skill*.35,'Free youth prospect with room to improve');
 take(p=>affordable(p)&&p.fromClubId===null&&p.youth,p=>(p.potential-p.skill)*1.4+p.skill*.3,'Unattached youngster — no transfer fee');
 take(p=>affordable(p)&&p.fromClubId===null,p=>p.potential+p.skill*.3,'Available on a free transfer');
 take(p=>affordable(p)&&p.fromClubId!==null&&(p.skill>=assessment.ratings[p.pos]-9||p.potential>=assessment.ratings[p.pos]+3),valueScore,'Affordable listed player from another club');
 // Fill remaining slots with feasible recommendations before suggesting players the chairman cannot fund.
 while(selected.length<6){const rest=candidates.filter(p=>!used.has(p.id)&&affordable(p));if(!rest.length)break;rest.sort((a,b)=>(b.skill+b.potential*.4-b.value/15000+preference(b))-(a.skill+a.potential*.4-a.value/15000+preference(a)));const p=rest[Math.floor(r()*Math.min(12,rest.length))];used.add(p.id);selected.push({...p,scoutReason:p.fromClubId===null?'Free agent: a possible long-term option':'Within budget; scout recommends a closer look'});}
 while(selected.length<6){const rest=candidates.filter(p=>!used.has(p.id));if(!rest.length)break;rest.sort((a,b)=>(b.skill-b.value/20000)-(a.skill-a.value/20000));const p=rest[0];used.add(p.id);selected.push({...p,scoutReason:transferAffordability(club,p).reason});}
 g.scoutShortlists[cacheKey]=selected.map(p=>({id:p.id,reason:p.scoutReason}));
 return selected;
}
export function youthIntake(g,countPerClub=5){
 // Five 16–18-year-olds per club: two promoted to its squad, three released as free agents.
 // The releasing club affects starting ability, never the independent wonderkid roll.
 const r=rng(g.seed+g.season*3821+123),all=g.clubs.flatMap(c=>c.squad).concat(g.freeAgents||[]),used=new Set(all.map(p=>p.name));
 let id=Math.max(...all.map(p=>p.id),0)+1;const added=[];
 for(const club of g.clubs){
  const leagueBaseline=[58,53,48,43][club.division];
  const squadAverage=club.squad.reduce((sum,p)=>sum+p.skill,0)/Math.max(1,club.squad.length);
  const base=Math.round(leagueBaseline*.65+squadAverage*.35);
  for(let i=0;i<countPerClub;i++){
   const pos=['GK','DEF','MID','FWD','MID'][(i+club.id)%5];
   const p=player(id++,pos,r,club.division);
   p.age=rand(r,16,18);p.skill=Math.max(28,Math.min(78,base+rand(r,-12,12)));
   // Every league has the same independent chance to produce a future star.
   const exceptional=r()<.055;
   const longTerm=exceptional?rand(r,86,96):rand(r,50,86);
   p.potential=Math.max(p.skill,longTerm);p.experience=0;p.form=6.5;
   p.value=0;p.wage=rand(r,55,180)*(club.division===0?2:1);p.youth=true;p.freeSinceSeason=g.season;
   p.youthOriginClubId=club.id;p.youthIntakeSeason=g.season;p.wonderkid=exceptional;
   let attempts=0;while(used.has(p.name)){p.name=givenNames[rand(r,0,givenNames.length-1)]+' '+familyNames[rand(r,0,familyNames.length-1)];if(++attempts>10000)throw Error('Name pool exhausted');}
   used.add(p.name);
   if(i<2){
    p.academyPromoted=true;p.freeSinceSeason=null;
    p.value=Math.max(2000,Math.round(p.skill*250*(4-club.division)));
    club.squad.push(p);
   }else{
    p.academyPromoted=false;g.freeAgents.push(p);
   }
   added.push(p);
  }
 }
 return added;
}
export function developPlayers(g){
 const r=rng(g.seed+g.season*9973+71);
 for(const p of g.clubs.flatMap(c=>c.squad).concat(g.freeAgents)){
  enrichPlayer(p,g.seed);p.age++;
  let change=0;
  if(p.age<=23)change=(p.potential>p.skill?rand(r,0,3):0);
  else if(p.age>=33)change=-rand(r,0,3);
  else if(p.age>=30)change=-rand(r,0,1);
  else change=rand(r,-1,1);
  p.skill=Math.max(20,Math.min(p.potential,p.skill+change));p.experience=Math.min(100,p.experience+Math.max(1,Math.round((p.appearances||0)/5)));
  p.appearances=0;p.goals=0;p.assists=0;p.form=6.5;
 }
}
export function transact(g,id,action,targetId=null){
 const c=g.clubs[g.selected],pid=Number(id);let p,from,to;
 if(action==='buy'){
  from=g.clubs.find(x=>x.id!==c.id&&x.squad.some(p=>p.id===pid))||null;
  const source=from?from.squad:g.freeAgents,i=source.findIndex(p=>p.id===pid);
  if(i<0)throw Error('Player unavailable');if(!transferCandidates(g).some(p=>p.id===pid&&!p.signed))throw Error('This player is not available in your scout’s current shortlist');p=source[i];
  if(from&&from.lineup.includes(pid))throw Error('That player is not transfer listed');
  {const affordability=transferAffordability(c,{value:from?p.value:0});if(!affordability.affordable)throw Error(affordability.reason);}
  const fee=from?p.value:0;source.splice(i,1);c.squad.push(p);c.budget-=fee;c.money-=fee;if(from){from.money+=fee;from.budget+=Math.round(fee*.8);}to=c;
 }else if(action==='release'){
  if(c.squad.length<=16)throw Error('Minimum squad size is 16');
  const i=c.squad.findIndex(p=>p.id===pid);if(i<0)throw Error('Player unavailable');
  p=c.squad[i];const compensation=Math.max(0,(p.wage||0)*10);
  if(c.money-compensation < -staffCreditLimit(c))throw Error('The chairman cannot fund the contract termination');
  c.squad.splice(i,1);c.lineup=c.lineup.filter(x=>x!==pid);
  c.money-=compensation;p.value=0;p.freeSinceSeason=g.season;p.releasedByClubId=c.id;
  g.freeAgents.push(p);from=c;to=null;
  g.financeLedger??=[];g.financeLedger.unshift({season:g.season,week:g.round,clubId:c.id,type:'PLAYER RELEASE',amount:-compensation,note:`${p.name}: ten weeks' salary compensation`});
  if(!validLineup(c))c.lineup=autoLineup(c);
  const entry={season:g.season,week:g.round,player:p.name,playerId:p.id,from:c.name,to:'Free Agents',fee:0,action:'release',compensation};
  g.transferHistory??=[];g.transferHistory.unshift(entry);
  g.messages.unshift(`RELEASED: ${p.name} (compensation £${compensation.toLocaleString('en-GB')})`);
  addStory(g,'chairman','PLAYER RELEASED',`${p.name} has left ${c.name} by mutual termination. Compensation: £${compensation.toLocaleString('en-GB')}.`);
  return entry;
 }else if(action==='sell'){
  if(c.squad.length<=16)throw Error('Minimum squad size is 16');
  const i=c.squad.findIndex(p=>p.id===pid);if(i<0)throw Error('Player unavailable');
  from=c;to=targetId===null?null:g.clubs[Number(targetId)];if(to?.id===c.id)throw Error('Cannot sell to your own club');
  [p]=c.squad.splice(i,1);c.lineup=c.lineup.filter(x=>x!==p.id);
  if(to){to.squad.push(p);to.money=Math.max(0,to.money-p.value);to.budget=Math.max(0,to.budget-p.value);}else g.freeAgents.push(p);
  c.budget+=p.value;c.money+=p.value;
  if(!validLineup(c))c.lineup=autoLineup(c);
 }else throw Error('Unknown transfer type');
 const entry={season:g.season,week:g.round,player:p.name,playerId:p.id,from:from?.name||'Free Agents',to:to?.name||'Free Agents',fee:action==='buy'&&!from?0:p.value};
 g.transferHistory??=[];g.transferHistory.unshift(entry);g.messages.unshift(`TRANSFER: ${entry.player} · ${entry.from} → ${entry.to} (${entry.fee.toLocaleString('en-GB')} GBP)`);addStory(g,'scout',action==='buy'?'SCOUT REPORT: NEW ARRIVAL':'TRANSFER DEPARTURE',`${entry.player} has moved from ${entry.from} to ${entry.to} for £${entry.fee.toLocaleString('en-GB')}.`);return entry;
}
export function upgradeSave(g){if(g.version===3){for(const p of g.clubs.flatMap(c=>c.squad).concat(g.freeAgents||[]))enrichPlayer(p,g.seed);ensureStaff(g);ensureStory(g);ensureCareerRecord(g);return g;}if(g.version!==2||g.clubs?.length!==92)throw Error('Unsupported save');g.version=3;g.manager={clubId:g.selected,reputation:45,security:65,employed:true,offers:[],applications:[],career:[],lastReviewWeek:-1};g.transferHistory=[];g.matchReports=[];ensureStaff(g);ensureStory(g);ensureCareerRecord(g);return g;}

export function sortLeagueRows(rows,sort='pts',order='desc',query=''){
 const filtered=rows.map((r,i)=>({...r,rank:i+1,gd:r.gf-r.ga})).filter(r=>r.name.toLowerCase().includes(query.toLowerCase().trim()));
 const keys={rank:'rank',name:'name',p:'p',w:'w',d:'d',l:'l',gf:'gf',ga:'ga',gd:'gd',pts:'pts'};
 const key=keys[sort]||'pts',dir=order==='asc'?1:-1;
 return filtered.sort((a,b)=>{const compare=key==='name'?a.name.localeCompare(b.name):a[key]-b[key];return compare*dir||a.rank-b.rank;});
}
