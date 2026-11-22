// Project 1989 v1.14 — Club ground identities & procedural miniature stadiums.
// Stadium names are research candidates, not a certified census of August 1989.
// Capacity/architecture/floodlight arrangements are entirely stylised game concepts.
// No external image-generation service, network request or save mutation required.
const CANDIDATES = {"Aston Villa": "Villa Park", "Liverpool": "Anfield", "Everton": "Goodison Park", "Arsenal": "Highbury", "Tottenham Hotspur": "White Hart Lane", "Manchester United": "Old Trafford", "Manchester City": "Maine Road", "Chelsea": "Stamford Bridge", "West Ham United": "Upton Park", "Southampton": "The Dell", "Norwich City": "Carrow Road", "Nottingham Forest": "City Ground", "Derby County": "Baseball Ground", "Notts County": "Meadow Lane", "Newcastle United": "St James’ Park", "Sunderland": "Roker Park", "Wolverhampton Wanderers": "Molineux", "West Bromwich Albion": "The Hawthorns", "Birmingham City": "St Andrew’s", "Walsall": "Fellows Park", "Coventry City": "Highfield Road", "Leeds United": "Elland Road", "Sheffield Wednesday": "Hillsborough", "Sheffield United": "Bramall Lane", "Portsmouth": "Fratton Park", "Bradford City": "Valley Parade", "Plymouth Argyle": "Home Park", "Exeter City": "St James Park", "Bristol City": "Ashton Gate", "Bristol Rovers": "Twerton Park", "Ipswich Town": "Portman Road", "Leicester City": "Filbert Street", "Wimbledon": "Plough Lane", "Crystal Palace": "Selhurst Park", "Middlesbrough": "Ayresome Park", "Burnley": "Turf Moor", "Blackburn Rovers": "Ewood Park", "Bolton Wanderers": "Burnden Park", "Oldham Athletic": "Boundary Park", "Huddersfield Town": "Leeds Road", "Oxford United": "Manor Ground", "Millwall": "The Den", "Brighton & Hove Albion": "Goldstone Ground", "Reading": "Elm Park", "Watford": "Vicarage Road", "Luton Town": "Kenilworth Road", "Grimsby Town": "Blundell Park", "York City": "Bootham Crescent", "Wrexham": "Racecourse Ground", "Blackpool": "Bloomfield Road", "Preston North End": "Deepdale", "Hartlepool United": "Victoria Ground", "Chester City": "Sealand Road", "Stockport County": "Edgeley Park", "Scunthorpe United": "Glanford Park", "Rotherham United": "Millmoor", "Peterborough United": "London Road", "Colchester United": "Layer Road", "AFC Bournemouth": "Dean Court", "Gillingham": "Priestfield Stadium", "Swindon Town": "County Ground", "Port Vale": "Vale Park", "Wigan Athletic": "Springfield Park", "Shrewsbury Town": "Gay Meadow", "Tranmere Rovers": "Prenton Park", "Cambridge United": "Abbey Stadium", "Lincoln City": "Sincil Bank", "Carlisle United": "Brunton Park", "Doncaster Rovers": "Belle Vue", "Mansfield Town": "Field Mill", "Northampton Town": "County Ground", "Southend United": "Roots Hall", "Torquay United": "Plainmoor", "Hereford United": "Edgar Street", "Crewe Alexandra": "Gresty Road"};
const PERIOD_ADDITIONS = {"Queens Park Rangers": "Loftus Road", "Charlton Athletic": "Selhurst Park", "Hull City": "Boothferry Park", "Barnsley": "Oakwell", "Stoke City": "Victoria Ground", "Bury": "Gigg Lane", "Brentford": "Griffin Park", "Leyton Orient": "Brisbane Road", "Swansea City": "Vetch Field", "Fulham": "Craven Cottage", "Cardiff City": "Ninian Park", "Maidstone United": "Watling Street", "Chesterfield": "Saltergate", "Rochdale": "Spotland", "Scarborough": "Seamer Road", "Aldershot": "Recreation Ground", "Halifax Town": "The Shay"};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function hash(s){let h=2166136261;for(const ch of String(s)){h=Math.imul(h^ch.charCodeAt(0),16777619);}return h>>>0;}
export function groundProfile(club){
 const n=club?.name||'Unknown club',id=Number.isInteger(club?.id)?club.id:hash(n),seed=hash(n+'|'+id);
 const division=Number.isInteger(club?.division)?club.division:3;
 const size=['Large traditional enclosure','Established league ground','Compact municipal ground','Intimate terrace ground'][Math.min(3,Math.max(0,division))];
 return {clubId:id,club:n,name:(club?.worldIdentity==='generated'?`${n} Ground`:(CANDIDATES[n]||PERIOD_ADDITIONS[n]||n+' Ground')),nameStatus:'',
   archetype:size,seed,division,capacity:club?.ground?.capacity??null,ground:club?.ground||null,capacityBand:['25,000–55,000','15,000–35,000','9,000–25,000','4,000–16,000'][Math.min(3,Math.max(0,division))],
   roofVariant:seed%4,terraceVariant:(seed>>>4)%4,lightVariant:(seed>>>7)%3,orientation:(seed>>>11)%3,
   note:'All capacities and architectural details here are illustrative, NOT researched club facts.'};
}
const poly=(coords,fill,stroke='#202c31',w=2)=>`<polygon points="${coords}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
const line=(x1,y1,x2,y2,stroke='#dfdfcf',w=2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"/>`;
const floodlight=(x,y,tall=105,shade=false)=>{
 const foot=y+56,top=y-tall,edge=shade?'#c9d3d9':'#626b70';
 return `<g stroke="${edge}" stroke-width="2" fill="none">${line(x,foot,x-10,top,edge,2)}${line(x,foot,x+10,top,edge,2)}${line(x-10,top,x+10,top,edge,1.6)}${Array.from({length:6},(_,i)=>{const yy=top+8+i*(tall+48)/7;const d=7+i*.5;return line(x-d,yy,x+d,yy,edge,.8)+line(x-d,yy,x+d,yy+15,edge,.8)+line(x+d,yy,x-d,yy+15,edge,.8)}).join('')}<rect x="${x-20}" y="${top-8}" width="40" height="9" rx="1" fill="#fff1bb" stroke="#616a70" stroke-width="1"/></g>`;
};
export function groundSvg(profile,colours=['#a13941','#e9ddc0'],options={}){
 const p=profile,night=!!options.night,primary=colours[0]||'#a13941',secondary=colours[1]||'#e9ddc0',r=p.seed||1;
 const roofTop=24+p.roofVariant*4,roofLeft=44+p.orientation*4,roofRight=410-p.terraceVariant*2;
 const devLevel=p.ground?.levels||{};const sky=night?'#253548':'#b5c1bb',field=(devLevel.pitch||0)?(night?'#28744b':'#469a59'):(night?'#1e6139':'#39854c');
 const far=[`55,${105+roofTop} 220,${60+roofTop} 404,${132+roofTop} 241,${183+roofTop}`,`61,${111+roofTop} 229,${67+roofTop} 401,${136+roofTop} 238,${187+roofTop}`];
 const dev=p.ground?.levels||{}; const terraceFill=dev.terrace?'#cfba91':(p.terraceVariant%2?secondary:'#c3b79c');
 const spots=Array.from({length:6},(_,i)=>`<rect x="${75+i*48}" y="${169+(i%2)*2}" width="29" height="4" fill="${i%2?secondary:primary}" opacity=".92"/>`).join('');
 const scene=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 304" role="img" aria-label="Football ground for ${esc(p.club)} with traditional lattice floodlights" class="ground-svg">
 <rect width="470" height="304" fill="${sky}"/>
 <path d="M0 172 L42 124 89 142 144 110 197 128 266 100 338 138 407 114 470 145 V304 H0Z" fill="${night?'#24343d':'#89938a'}" opacity=".85"/>
 ${floodlight(31,115,95+(dev.lights||0)*10,night)}${floodlight(438,126,91+(dev.lights||0)*10,night)}
 ${poly('48,151 218,87 422,161 248,231','#5b5450')}
 ${poly('55,150 222,94 414,161 244,223',terraceFill)}
 ${poly('73,150 222,104 401,162 245,213',primary)}
 ${poly('92,151 223,114 382,161 244,201','#b7b8a1')}
 ${poly('111,154 222,124 363,164 248,194',field)}
 ${poly('111,154 248,194 363,164 222,124','none','#e8dfbc',2)}
 ${line(167,170,284,138,'#f0eccf',1.4)}${line(222,124,248,194,'#eeeccc',1.2)}
 <ellipse cx="235" cy="159" rx="19" ry="6" transform="rotate(17 235 159)" fill="none" stroke="#ede5cb" stroke-width="1.1"/>
 <g stroke="#edd9aa" stroke-width="2" opacity=".85">${Array.from({length:6},(_,i)=>line(63+i*22,154-i*7,83+i*22,164-i*7,'#e3d1a7',1.7)).join('')}</g>
 ${dev.terrace?`<polygon points="46,165 247,240 247,259 46,183" fill="${primary}" stroke="#27323a" stroke-width="3"/>`:''}
 ${poly(`48,151 218,${roofTop+60} 421,161 410,147 219,${roofTop+44} ${roofLeft},139`,'#4a5456')}
 ${(p.roofVariant%2===0||dev.cover)?poly(`45,136 218,${roofTop+43} 421,146 420,150 218,${roofTop+48} 47,142`,'#d0bd94'):''}
 ${dev.stand?poly('29,154 43,148 234,222 227,232','#b5a48c'):''}${poly('48,151 248,231 248,246 48,164','#5b504b')}
 ${poly('248,231 422,161 422,178 248,246','#8d7a60')}
 ${dev.stand?`<g><polygon points="34,135 221,49 425,132 425,148 221,67 34,151" fill="#454f59" stroke="#192d35" stroke-width="3"/><polygon points="42,153 221,83 417,153 417,167 221,98 42,166" fill="${primary}" stroke="#27323a" stroke-width="2"/>${Array.from({length:9},(_,i)=>`<line x1="${56+i*36}" y1="${146-Math.sin(i/9*Math.PI)*42}" x2="${56+i*36}" y2="${153-Math.sin(i/9*Math.PI)*42}" stroke="${secondary}" stroke-width="2"/>`).join('')}<text x="228" y="73" text-anchor="middle" font-family="monospace" font-size="8" fill="${secondary}">MAIN STAND</text></g>`:''}

 <g>${spots}</g>${dev.facilities?`<rect x="66" y="224" width="45" height="18" fill="${secondary}" stroke="#313d43"/><path d="M66 225l9-8h30l6 8" fill="${primary}" stroke="#313d43"/><text x="89" y="237" font-size="7" fill="#15202c" text-anchor="middle">SHOP</text>`:''}
 ${night?'<circle cx="394" cy="45" r="16" fill="#e3e0ce" opacity=".8"/>':''}
 <rect x="12" y="260" width="446" height="32" fill="${night?'#172e3e':'#e3d6b8'}" stroke="#626058" stroke-width="2"/>
 <text x="235" y="281" fill="${night?'#eadbaa':'#263f58'}" font-family="Courier New,monospace" font-size="12" font-weight="bold" text-anchor="middle">${esc(p.club.toUpperCase().slice(0,40))} · GROUND FILE</text>
 </svg>`;
 return scene;
}
export function groundInventory(clubs){return clubs.map(c=>groundProfile(c));}
export const researchedCandidates=Object.freeze({...CANDIDATES,...PERIOD_ADDITIONS});
