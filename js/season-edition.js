import {makePressPerspectives,updateEmergingRivalries} from './regional-press.js';
// Season Narrative Review: historical memory derived solely from simulated results.
// Editions are stored in the season archive, rather than reconstructed from reset player stats.
import {rivalryFor,managerForClub} from './football-world.js';
const label=(g,id)=>g.clubs[id]?.name||'Unknown club';
const score=(g,r)=>`${label(g,r.home)} ${r.hg}–${r.ag} ${label(g,r.away)}`;
const inFixture=(r,id)=>r.home===id||r.away===id;
const ours=(r,id)=>r.home===id?r.hg:r.ag;
const theirs=(r,id)=>r.home===id?r.ag:r.hg;
const ord=n=>`${n}${n%100>=11&&n%100<=13?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th'}`;
const line=(r,id)=>`${ours(r,id)}–${theirs(r,id)}`;
const seasonName=year=>`${year}–${String(year+1).slice(-2)}`;
export function makeSeasonEdition(g,summary){
 const season=summary.season,club=g.clubs[g.selected],id=club.id;
 const table=(summary.tables||[]).find(t=>t.some(r=>r.id===id))||[];
 const standing=table.find(r=>r.id===id),rank=table.findIndex(r=>r.id===id)+1;
 const results=(g.results||[]).filter(r=>inFixture(r,id));
 const reportMatches=(g.matchReports||[]).filter(r=>(r.competition==='LEAGUE'||!r.competition)&&inFixture(r,id));
 const cupMatches=(g.matchReports||[]).filter(r=>r.competition&&r.competition!=='LEAGUE'&&inFixture(r,id));
 const winners=Object.entries(summary.cupWinners||{}).filter(([,winner])=>winner===id).map(([name])=>name);
 const promoted=summary.promote?.[club.division]?.includes(id)||false;
 const relegated=summary.relegate?.[club.division]?.includes(id)||false;
 const champion=rank===1;
 const outcome=champion?`champions of the ${['First','Second','Third','Fourth'][club.division]} Division`:promoted?'promotion winners':relegated?'relegated':rank>0?`${ord(rank)} in the ${['First','Second','Third','Fourth'][club.division]} Division`:'unplaced';
 const best=[...results].sort((a,b)=>(ours(b,id)-theirs(b,id))-(ours(a,id)-theirs(a,id))||theirs(a,id)-theirs(b,id))[0];
 const worst=[...results].sort((a,b)=>(ours(a,id)-theirs(a,id))-(ours(b,id)-theirs(b,id))||theirs(b,id)-theirs(a,id))[0];
 const positives=results.filter(r=>ours(r,id)>theirs(r,id));
 const negatives=results.filter(r=>ours(r,id)<theirs(r,id));
 const draws=results.filter(r=>ours(r,id)===theirs(r,id));
 const derbyResults=results.map(r=>({r,rival:rivalryFor(g,id,r.home===id?r.away:r.home)})).filter(x=>x.rival);
 const derbyGroups=new Map();for(const item of derbyResults){const opponent=item.r.home===id?item.r.away:item.r.home;
  const key=item.rival.name+':'+opponent;if(!derbyGroups.has(key))derbyGroups.set(key,{name:item.rival.name,opponent,results:[]});
  derbyGroups.get(key).results.push(item.r);
 }
 const derby=[...derbyGroups.values()].sort((a,b)=>b.results.length-a.results.length||a.name.localeCompare(b.name))[0];
 // Event-level goals are preferable to mutable squad-season counters after transfers.
 const playerGoals=new Map();for(const r of reportMatches)for(const event of r.events||[]){
  if(event.type!=='goal'||event.team!==id)continue;
  const name=String(event.scorer||'').trim();if(!name||/own goal/i.test(name))continue;
  playerGoals.set(name,(playerGoals.get(name)||0)+1);
 }
 // Fallback for old saves whose reports have no scorer names: take current season counters.
 if(!playerGoals.size)for(const p of club.squad||[])if(p.goals>0)playerGoals.set(p.name,(playerGoals.get(p.name)||0)+p.goals);
 const leaders=[...playerGoals].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 const star=leaders[0]||null;
 const late=results.slice(-8);
 const turning=[...late].sort((a,b)=>Math.abs(ours(b,id)-theirs(b,id))-Math.abs(ours(a,id)-theirs(a,id)))[0];
 const line1=`${label(g,id)} end the ${seasonName(season)} campaign as ${outcome}. ${standing?`Across ${standing.p} league fixtures they collected ${standing.pts} points, with ${standing.w} wins, ${standing.d} draws and ${standing.l} defeats. They scored ${standing.gf} and conceded ${standing.ga}.`:`The final league figures were not available.`}`;
 const headline=champion?'CHAMPIONS! THE SEASON BELONGS TO '+club.name.toUpperCase():promoted?'GOING UP! '+club.name.toUpperCase()+' EARN PROMOTION':relegated?'THE DROP: '+club.name.toUpperCase()+' FACE THE CONSEQUENCES':`${club.name.toUpperCase()}: A SEASON FOR THE RECORD BOOKS`;
 const articles=[{heading:'THE FINAL VERDICT',body:line1+(winners.length?` Silverware also arrived in the ${winners.join(' and ')}.`:'')}];
 if(best)articles.push({heading:'THE DAY EVERYTHING CLICKED',body:`The biggest league victory was ${score(g,best)}, a ${ours(best,id)-theirs(best,id)}-goal winning margin.${best.home===id?' The home crowd witnessed it.':' It came away from home.'}`});
 if(worst&&ours(worst,id)<theirs(worst,id))articles.push({heading:'THE AFTERNOON TO FORGET',body:`The heaviest league defeat came in ${score(g,worst)}. The margin was ${theirs(worst,id)-ours(worst,id)} goal${theirs(worst,id)-ours(worst,id)===1?'':'s'}.`});
 if(derby){const dw=derby.results.filter(r=>ours(r,id)>theirs(r,id)).length,dl=derby.results.filter(r=>ours(r,id)<theirs(r,id)).length,dd=derby.results.length-dw-dl;
  const boss=managerForClub(g,derby.opponent).name;
  articles.push({heading:'THE RIVALRY THAT MATTERED',body:`In the ${derby.name} against ${label(g,derby.opponent)}, ${club.name} recorded ${dw} win${dw===1?'':'s'}, ${dd} draw${dd===1?'':'s'} and ${dl} defeat${dl===1?'':'s'}. Last meeting: ${score(g,derby.results.at(-1))}. Across the touchline was ${boss}. These are meetings supporters will remember.`});
 }
 if(star)articles.push({heading:'THE PLAYER WHO MADE THE HEADLINES',body:`${star[0]} led the club's recorded league goalscorers with ${star[1]} goal${star[1]===1?'':'s'} from available match reports.${leaders[1]?` ${leaders[1][0]} followed with ${leaders[1][1]}.`:''}`});
 if(turning)articles.push({heading:'THE RUN-IN',body:`Among the final eight league results, ${score(g,turning)} produced the largest winning or losing margin. The closing stretch brought ${late.filter(r=>ours(r,id)>theirs(r,id)).length} wins, ${late.filter(r=>ours(r,id)===theirs(r,id)).length} draws and ${late.filter(r=>ours(r,id)<theirs(r,id)).length} defeats.`});
 if(cupMatches.length)articles.push({heading:'THE CUP TRAIL',body:`The club played ${cupMatches.length} recorded cup tie${cupMatches.length===1?'':'s'} during the campaign. The last recorded tie was ${score(g,cupMatches.at(-1))}${cupMatches.at(-1).penalties?' (decided on penalties)':''}.${winners.length?` Trophy cabinet: ${winners.join(', ')}.`:''}`});
 const edition={season,clubId:id,clubName:club.name,headline,subtitle:`THE FOOTBALL LEAGUE GAZETTE · SEASON ${seasonName(season)} · SPECIAL EDITION`,outcome,articles,record:{played:results.length,wins:positives.length,draws:draws.length,losses:negatives.length,points:standing?.pts??null,position:rank||null},topScorer:star?{name:star[0],goals:star[1]}:null};
 return edition;
}
export function archiveSeasonEdition(g,summary){
 if(summary.edition)return summary.edition;
 updateEmergingRivalries(g,summary);const edition=makeSeasonEdition(g,summary);edition.perspectives=makePressPerspectives(g,summary,edition);summary.edition=edition;
 return edition;
}
