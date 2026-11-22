// Project 1989 v1.16 — concise ground development, never claims that simulated capacity is a historic fact.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const PROJECTS=Object.freeze({
 terrace:{name:'Expand the terrace',cost:115000,weeks:8,seats:2400,upkeep:170,comfort:1,levelMax:2},
 cover:{name:'Roof the open terrace',cost:90000,weeks:6,seats:0,upkeep:120,comfort:3,levelMax:1},
 stand:{name:'Build a new stand',cost:410000,weeks:14,seats:5700,upkeep:650,comfort:5,levelMax:2},
 facilities:{name:'Improve shops & refreshments',cost:85000,weeks:5,seats:0,upkeep:190,comfort:4,levelMax:2},
 pitch:{name:'Improve pitch & drainage',cost:68000,weeks:4,seats:0,upkeep:140,comfort:2,levelMax:2},
 lights:{name:'Upgrade the floodlights',cost:105000,weeks:6,seats:0,upkeep:230,comfort:2,levelMax:1}
});
export function initialCapacity(c){const base=[42000,27000,16000,10500][Math.max(0,Math.min(3,c.division??3))];return Math.round(base*clamp((c.rating??60)/65,.76,1.24)/100)*100;}
export function ensureGround(c){
 if(!c.ground||typeof c.ground!=='object')c.ground={capacity:initialCapacity(c),originalCapacity:initialCapacity(c),levels:{},project:null,completed:[],createdAt:'game-start'};
 const p=c.ground; if(!Number.isSafeInteger(p.capacity)||p.capacity<=0)p.capacity=initialCapacity(c);
 if(!p.levels||typeof p.levels!=='object')p.levels={};if(!Number.isSafeInteger(p.originalCapacity)||p.originalCapacity<=0)p.originalCapacity=Math.max(1000,p.capacity-Object.entries(PROJECTS).reduce((n,[k,v])=>n+(p.levels[k]||0)*v.seats,0));if(!Array.isArray(p.completed))p.completed=[];
 return p;
}
export function groundBenefits(c){const p=ensureGround(c),l=p.levels;const facility=l.facilities||0;
 return {capacity:p.capacity,facilities:facility,weeklyUpkeep:Object.entries(PROJECTS).reduce((n,[k,v])=>n+(l[k]||0)*v.upkeep,0),comfort:Math.min(14,Object.entries(PROJECTS).reduce((n,[k,v])=>n+(l[k]||0)*v.comfort,0))};
}
export function projectPrice(c,key,method='now'){
 const def=PROJECTS[key];if(!def)throw Error('Unknown construction project');
 const level=ensureGround(c).levels[key]||0;
 return Math.round(def.cost*(1+.28*level)*(method==='summer'?.85:1));
}
export function activeBuildingImpact(c){
 const p=ensureGround(c).project;
 if(!p||p.method==='summer')return 0;
 // Active work restricts available turnstiles; the whole ground never closes.
 return p.key==='stand'?.22:p.key==='terrace'?.16:p.key==='cover'?.10:p.key==='facilities'?.06:p.key==='pitch'?.08:.04;
}
export function finishGroundProject(g,c){
 const p=ensureGround(c),project=p.project;if(!project)return null;
 const def=PROJECTS[project.key];p.levels[project.key]=(p.levels[project.key]||0)+1;
 p.capacity+=def.seats;
 const record={key:project.key,name:def.name,season:g.season,week:g.round+1,capacity:p.capacity,method:project.method||'now',cost:project.cost};
 p.completed.push(record);p.project=null;
 if(c.supporters)c.supporters.confidence=clamp(Math.round((c.supporters.confidence??62)+2),12,96);
 return record;
}
export function completeSummerProjects(g){
 const completed=[];
 for(const c of g.clubs){const p=ensureGround(c);if(p.project?.method!=='summer')continue;
 const record=finishGroundProject(g,c);if(record)completed.push({club:c,record});}
 return completed;
}
export function startProject(g,c,key,method='now'){const type=PROJECTS[key];if(!type)throw Error('Unknown construction project');const p=ensureGround(c);
 if(p.project)throw Error('One ground project must finish before another begins');
 const level=p.levels[key]||0;if(level>=type.levelMax)throw Error('This improvement is already at its maximum');
 if(!['now','summer'].includes(method))throw Error('Unknown building timetable');
 const cost=projectPrice(c,key,method); if(c.money-cost < 0)throw Error('Insufficient club cash; the board will not approve this project');
 c.money-=cost;p.project={key,cost,method,weeksLeft:method==='summer'?0:type.weeks,startedSeason:g.season,startedWeek:g.round+1};
 if(c.id===g.selected){g.financeLedger??=[];g.financeLedger.unshift({season:g.season,week:g.round+1,clubId:c.id,type:'GROUND DEVELOPMENT',amount:-cost,note:`${type.name} · ${method==='summer'?'reserved for close season':'work starts immediately'}`});}
 return {...p.project,name:type.name};
}
export function progressGrounds(g){const completed=[];
 for(const c of g.clubs){const p=ensureGround(c);if(!p.project||p.project.method==='summer')continue;
 p.project.weeksLeft--;if(p.project.weeksLeft>0)continue;
 const record=finishGroundProject(g,c);
 if(c.id===g.selected)completed.push({club:c,record});
 }return completed;
}
