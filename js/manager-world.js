import {managerForClub} from './football-world.js';
// Original fictional managers only. Appointments are simulated, never historical claims.
export function managerWorld(g){
 if(!g.oppositionAppointments||typeof g.oppositionAppointments!=='object')g.oppositionAppointments={};
 if(!Array.isArray(g.oppositionManagerHistory))g.oppositionManagerHistory=[];
 return g.oppositionAppointments;
}
export function managerProfile(g,id){
 const a=managerWorld(g),current=a[id]||managerForClub(g,id);
 const record=(g.managerDuels||[]).filter(x=>x.opponentManager===current.name||(x.opponentId===id&&!x.opponentManager));
 const w=record.filter(x=>x.gf>x.ga).length,l=record.filter(x=>x.gf<x.ga).length;
 const tenure=(g.oppositionManagerHistory||[]).filter(x=>x.name===current.name);
 return {...current,club:g.clubs[id]?.name,meetings:record.length,againstPlayer:{wins:w,draws:record.length-w-l,losses:l},appointments:tenure};
}
export function closeManagerSeason(g,summary){
 managerWorld(g);
 if(g.oppositionManagerHistory.some(x=>x.type==='review'&&x.season===summary.season))return [];
 const changes=[];
 // Review the bottom-placed AI club of each division, keeping turnover rare.
 for(let d=0;d<4;d++){
  const rows=summary.tables?.[d]||[],last=rows.at(-1);if(!last||last.id===g.selected)continue;
  if(((g.seed||0)+summary.season+d*17)%3!==0)continue;
  const previous=managerForClub(g,last.id);
  const nextYear=summary.season+1;
  const replacement={name:['Arthur','Les','Graham','Terry','Gordon','Frank','Peter','Derek'][(nextYear+d+last.id)%8]+' '+['Harcourt','Dunmore','Chadwick','Warrington','Cresswell','Fenton','Hollis','Pritchard'][(nextYear*3+last.id)%8],style:['pragmatic organiser','attacking optimist','demanding traditionalist','patient developer'][(nextYear+last.id)%4],appointedSeason:nextYear};
  if(replacement.name===previous.name)replacement.name='Cliff '+replacement.name;
  g.oppositionAppointments[last.id]=replacement;
  changes.push({type:'appointment',season:nextYear,clubId:last.id,club:g.clubs[last.id].name,name:replacement.name,previous:previous.name,reason:'following a difficult league season'});
 }
 g.oppositionManagerHistory.push({type:'review',season:summary.season},...changes);
 return changes;
}
export function managerCareerNotes(g,id){
 const p=managerProfile(g,id),meet=p.againstPlayer;
 const lines=[`${p.name} — ${p.style}.`];
 if(meet.wins+meet.draws+meet.losses)lines.push(`Against you: ${meet.wins} wins, ${meet.draws} draws and ${meet.losses} defeats from your perspective.`);
 const changes=(g.oppositionManagerHistory||[]).filter(x=>x.type==='appointment'&&x.clubId===id).slice(-3);
 for(const change of changes)lines.push(`${change.season}: ${change.name} appointed at ${change.club}, succeeding ${change.previous}.`);
 return lines;
}
