// Period-inspired club colours for the 1989-90 starting Football League.
// Simplified home-shirt palettes, not reproductions of licensed kits or 1989 shirt artwork.
// The away side always wears white in the match replay (Project 1989 visual convention).
const clubPalette = Object.create(null);
function assign(names,primary,secondary=primary){for(const name of names.split('|'))clubPalette[name]=[primary,secondary];}
assign('Liverpool|Manchester United|Nottingham Forest|Charlton Athletic|Bristol City|Swindon Town|Barnsley|Rotherham United|Walsall|Crewe Alexandra|Exeter City|Lincoln City|Doncaster Rovers|Aldershot|Scarborough|Middlesbrough|Southampton', '#c42b35','#f4f0e8');
assign('Aston Villa|West Ham United|Burnley', '#762344','#80c7e9');
assign('Arsenal', '#cd2639','#ffffff');
assign('Tottenham Hotspur|Leeds United|Fulham|Derby County|Preston North End|Colchester United', '#f4f1e6','#1e3558');
assign('Chelsea|Everton|Portsmouth|Ipswich Town|Birmingham City|Cardiff City|Leicester City|Oxford United|Gillingham|Rochdale|Chesterfield|Halifax Town', '#2761bc','#f4f4f2');
assign('Manchester City|Coventry City|Luton Town|Grimsby Town|Southend United|Cambridge United|Peterborough United|Brighton & Hove Albion', '#76b9df','#f0f4f7');
assign('Norwich City|Watford|Bradford City', '#f0d033','#168548');
assign('Newcastle United|Notts County', '#f5f3ef','#191a20');
assign('Sunderland|Stoke City|Sheffield United|Brentford|Southend United', '#c82e37','#ffffff');
assign('Wolverhampton Wanderers|Hull City', '#db9b2c','#161d22');
assign('West Bromwich Albion|Queens Park Rangers|Reading|Oldham Athletic|Bolton Wanderers|Huddersfield Town|Hartlepool United|Chester City|Carlisle United', '#f8f8f4','#234e96');
assign('Crystal Palace|Wimbledon|Blackburn Rovers|AFC Bournemouth|Tranmere Rovers|Bury|Northampton Town|Blackpool|Stockport County|Wigan Athletic|Scunthorpe United|Port Vale|Shrewsbury Town|Mansfield Town', '#234eaa','#d2363c');
assign('Plymouth Argyle|Yeovil Town', '#19754b','#f6f6ee');
assign('Millwall|Swansea City|Leyton Orient|Wrexham|Bristol Rovers|Torquay United|Hereford United|York City', '#173d73','#fffaf1');
assign('Sheffield Wednesday|Gillingham|Brighton & Hove Albion|Huddersfield Town|Hartlepool United|Grimsby Town|Chesterfield|Rochdale|Halifax Town', '#2254a6','#f6f6ee');
assign('Bradford City','#8b2c4f','#f7b444');
assign('Southend United','#1c3e74','#ffffff');
assign('Cambridge United','#e0b92d','#151b24');
assign('Northampton Town','#812b43','#ffffff');
assign('Blackpool','#e88142','#ffffff');
assign('Bristol Rovers','#2464a6','#ffffff');
assign('Wrexham','#d32f39','#ffffff');
assign('Swansea City','#ffffff','#222831');
assign('Leyton Orient','#d8323f','#ffffff');
assign('Maidstone United','#e8cf37','#1b2231');
assign('Colchester United','#2269bb','#ffffff');
assign('Scunthorpe United','#933249','#63b5e1');
assign('Shrewsbury Town','#e5aa42','#224f92');
assign('Port Vale','#f5f2ef','#191a20');
assign('Rotherham United','#ce3339','#ffffff');
assign('Bury','#f3f3ef','#2461b7');
assign('Birmingham City','#2464b6','#ffffff');
assign('Bradford City','#8c2c46','#e4a83a');
export function clubColours(name){return clubPalette[name]||['#355c80','#f0ede4'];}
export function clubColoursById(clubs,id){return id>=0&&clubs?.[id]?(clubs[id].customColours||clubColours(clubs[id].name)):['#426b71','#dfd7ca'];}
export function allColourNames(){return Object.keys(clubPalette);}
