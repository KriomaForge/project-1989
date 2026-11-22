// The Club and The Crowd: career scrapbook. Only events recorded by the game.
// Sources: manager.record, completed season editions, transfer ledger and appointments.
// No external AI service or runtime image generation required.
const sname = year => `${year}–${String(year+1).slice(-2)}`;
const clubName = (g,id) => g.clubs?.[id]?.name || 'Unknown club';
export function scrapbook(g){
 const record=g.manager?.record||{};
 const matches=record.matches||[],honours=record.honours||[];
 const entries=[];
 const add=(id,season,kind,headline,detail,clubId=null)=>entries.push({id,season,kind,headline,detail,clubId});
 // Do not assume that historic results pre-dating tracking were managed by the player.
 const first=matches[0];
 if(first)add('first-match',first.season,'FIRST MATCH','THE FIRST CHAPTER',`${clubName(g,first.clubId)}: the first match recorded under your management.`,first.clubId);
 const win=matches.find(m=>m.gf>m.ga);
 if(win)add('first-win',win.season,'MILESTONE','THE FIRST VICTORY',`${clubName(g,win.clubId)} recorded your first tracked managerial victory, ${win.gf}–${win.ga}.`,win.clubId);
 for(const [i,h] of honours.entries())add('honour-'+i,h.season,'HONOURS',h.title.toUpperCase(),`${clubName(g,h.clubId)} · ${sname(h.season)}`,h.clubId);
 for(const [i,j] of (g.manager?.career||[]).entries())add('appointment-'+i,j.season,'CAREER','A CHAPTER CLOSES',`${clubName(g,j.clubId)} · ${j.reason||'Appointment ended'} · Week ${j.week??'—'}`,j.clubId);
 for(const summary of g.history||[]){const edition=summary.edition;if(!edition)continue;
  add('season-'+summary.season,summary.season,'SEASON',edition.headline,`${edition.clubName} · ${edition.outcome}`,edition.clubId);
  for(const [voice,issue] of Object.entries(edition.perspectives||{})) add(`season-${summary.season}-${voice}`,summary.season,'SEASON',issue.headline,`${issue.paper}: ${issue.articles.map(a=>a.body).join(' ')}`,edition.clubId);
  for(const [i,a] of edition.articles.entries())if(/DAY EVERYTHING CLICKED|AFTERNOON TO FORGET|RIVALRY THAT MATTERED|PLAYER WHO MADE THE HEADLINES/.test(a.heading))
   add(`season-${summary.season}-feature-${i}`,summary.season,/RIVALRY/.test(a.heading)?'RIVALRY':/PLAYER/.test(a.heading)?'LEGENDS':'MATCHES',a.heading,a.body,edition.clubId);
 }
 for(const programme of g.programmeArchive||[])add('programme-'+programme.id,programme.season,'PROGRAMMES',programme.headline,`${programme.home} v ${programme.away} · ${programme.venue} · Week ${programme.week}${programme.finalScore?' · '+programme.finalScore:''}.`,programme.homeId);
 const involved=new Set([g.selected,g.manager?.clubId,...matches.map(m=>m.clubId)].filter(Number.isInteger));
 const transfers=(g.transferHistory||[]).filter(t=>Number.isFinite(t.fee)&&t.fee>0&&(involved.has(g.clubs?.find(c=>c.name===t.from)?.id)||involved.has(g.clubs?.find(c=>c.name===t.to)?.id)));
 const biggest=[...transfers].sort((a,b)=>b.fee-a.fee)[0];
 if(biggest)add('record-transfer',biggest.season??g.season,'TRANSFERS','THE BIG MONEY MOVE',`${biggest.player}: ${biggest.from} to ${biggest.to} for £${Math.round(biggest.fee).toLocaleString('en-GB')}.`,null);
 // A career may legitimately have no entries yet. Do not fabricate press cuttings.
 const categories=['ALL','HONOURS','SEASON','MATCHES','RIVALRY','LEGENDS','MILESTONE','CAREER','TRANSFERS','PROGRAMMES','FIRST MATCH'];
 return {entries:entries.sort((a,b)=>b.season-a.season||a.id.localeCompare(b.id)),categories,statistics:{played:matches.length,won:matches.filter(m=>m.gf>m.ga).length,drawn:matches.filter(m=>m.gf===m.ga).length,lost:matches.filter(m=>m.gf<m.ga).length,honours:honours.length,seasons:(g.history||[]).filter(x=>x.edition).length},legacy:!!record.legacy};
}
