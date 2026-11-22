// Project 1989 — dependency-free browser PNG/PDF exports. All artwork original and locally rendered.
import {groundProfile,groundSvg} from './ground.js';
const escapeXml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const WIDTH=600,HEIGHT=849;
const svgText=(x,y,value,size=18,colour='#172d40',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${colour}" ${extra}>${escapeXml(value)}</text>`;
const wrap=(s,max=62)=>{const result=[];let line='';for(const word of String(s||'').split(/\s+/)){if(line&&(line+' '+word).length>max){result.push(line);line=word;}else line=line?line+' '+word:word;}if(line)result.push(line);return result;};
function page(content){return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"><rect width="600" height="849" fill="#f1e5c9"/><rect x="20" y="20" width="560" height="809" fill="none" stroke="#243e57" stroke-width="4"/>${content}</svg>`;}
function multiline(text,x,y,size=17,spacing=24,max=64){return wrap(text,max).map((line,i)=>svgText(x,y+i*spacing,line,size)).join('');}
function groundArt(p,club,colours){const profile={...groundProfile(club),ground:p.groundSnapshot};return groundSvg(profile,colours,{night:p.landmark==='derby'||p.week%5===0}).replace('<svg ','<svg x="62" y="376" width="476" height="308" ');}
export function programmeCoverSvg(p,club,colours=['#b12e33','#ece2d2']){
 const primary=colours[0]||'#a72a37';
 const lines=wrap(`${p.home.toUpperCase()}  v  ${p.away.toUpperCase()}`,28);
 return page(`<rect x="30" y="30" width="540" height="12" fill="${primary}"/>${svgText(300,82,'THE FOOTBALL LEAGUE',21,'#1d344c','text-anchor="middle" font-family="Georgia,serif" font-weight="bold"')}${svgText(300,145,'OFFICIAL',60,primary,'text-anchor="middle" font-family="Impact,Arial Narrow,sans-serif" font-weight="900"')}${svgText(300,216,'MATCHDAY',72,primary,'text-anchor="middle" font-family="Impact,Arial Narrow,sans-serif" font-weight="900"')}${svgText(300,287,'PROGRAMME',66,primary,'text-anchor="middle" font-family="Impact,Arial Narrow,sans-serif" font-weight="900"')}<rect x="45" y="313" width="510" height="55" fill="${primary}"/>${lines.map((line,i)=>svgText(300,335+i*20,line,21,'#fff8e8','text-anchor="middle" font-family="Courier New,monospace" font-weight="bold"')).join('')}${groundArt(p,club,colours)}<line x1="46" y1="709" x2="554" y2="709" stroke="#253d53" stroke-width="3"/>${svgText(300,743,String(p.venue||'THE FOOTBALL GROUND').toUpperCase(),19,'#223d53','text-anchor="middle" font-family="Courier New,monospace" font-weight="bold"')}${svgText(300,774,`${p.season}–${String(p.season+1).slice(-2)} · MATCHWEEK ${p.week}`,18,'#223d53','text-anchor="middle" font-family="Courier New,monospace"')}${svgText(300,808,'YOUR CLUB. YOUR DECISIONS. YOUR LEGACY.',14,'#574c3f','text-anchor="middle" font-family="Courier New,monospace"')}`);
}
export function programmeInsideSvg(p){
 const notes=[];function header(t){notes.push({type:'header',value:t});}function para(t){for(const line of wrap(t,69))notes.push({type:'text',value:line});notes.push({type:'spacer'});}
 header('FROM THE MANAGER’S DESK');para(p.opener||'Welcome to today’s fixture.');
 header('TODAY’S VISITORS');para(`${p.away} · League position ${p.rankAway} · Manager: ${p.manager}. Player to watch: ${p.danger}.`);
 header('OUR GROUND');para(`${p.venue} · Supporters: ${p.mood}. ${p.attendanceForecast==null?'':`Expected attendance: ${Number(p.attendanceForecast).toLocaleString('en-GB')}.`}`);
 header('HOME XI');para((p.homeXI||[]).map(x=>x.name).join(' · ')||'Awaiting team selection');
 header('VISITORS XI');para((p.awayXI||[]).map(x=>x.name).join(' · ')||'Awaiting team selection');
 if(p.finalScore){header('THE FINAL WHISTLE');para(`${p.home} ${p.finalScore} ${p.away}.`);}
 let y=164,body='';for(const row of notes){if(row.type==='header'){y+=16;body+=svgText(58,y,row.value,17,'#1f3c57','font-family="Courier New,monospace" font-weight="bold"');y+=22;}else if(row.type==='spacer'){y+=12;}else{body+=svgText(58,y,row.value,15,'#40382f','font-family="Georgia,serif"');y+=21;}}
 return page(`${svgText(300,74,'THE MATCHDAY PROGRAMME',30,'#203c53','text-anchor="middle" font-family="Georgia,serif" font-weight="bold"')}<line x1="50" y1="96" x2="550" y2="96" stroke="#263e53" stroke-width="3"/>${svgText(300,122,`${p.home} v ${p.away}`,20,'#293c4d','text-anchor="middle" font-family="Courier New,monospace"')}${body}${svgText(300,801,`${p.season}–${String(p.season+1).slice(-2)} · ${p.venue}`,14,'#645a47','text-anchor="middle" font-family="Courier New,monospace"')}`);
}
function saveBlob(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),7000);}
async function canvasFromSvg(svg,scale=2){const img=new Image(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('SVG rendering failed'));img.src=url;});const canvas=document.createElement('canvas');canvas.width=WIDTH*scale;canvas.height=HEIGHT*scale;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas not supported');ctx.fillStyle='#f1e5c9';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);return canvas;}finally{URL.revokeObjectURL(url);}}
const canvasBlob=(canvas,mime,quality=.92)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image encoding failed')),mime,quality));
// Minimal, standards-compliant two-page PDF with JPEG /DCTDecode image XObjects.
export function pdfFromJpegs(jpegArrays,w=WIDTH,h=HEIGHT){
 const enc=new TextEncoder(),parts=[],offsets=[0];let size=0;
 const push=b=>{const z=typeof b==='string'?enc.encode(b):b;parts.push(z);size+=z.length;};
 push('%PDF-1.4\n');
 const n=2+jpegArrays.length*3;const objects=[];
 objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
 objects[2]=`<< /Type /Pages /Kids [${jpegArrays.map((_,i)=>3+i*3+' 0 R').join(' ')}] /Count ${jpegArrays.length} >>`;
 jpegArrays.forEach((jpeg,i)=>{const page=3+i*3,image=page+1,content=page+2;
  objects[page]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im1 ${image} 0 R >> >> /Contents ${content} 0 R >>`;
  objects[image]=['image',jpeg,`<< /Type /XObject /Subtype /Image /Width ${w*2} /Height ${h*2} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`];
  const stream=`q\n${w} 0 0 ${h} 0 0 cm\n/Im1 Do\nQ\n`;
  objects[content]=['content',enc.encode(stream),`<< /Length ${enc.encode(stream).length} >>`];
 });
 for(let i=1;i<=n;i++){offsets[i]=size;push(`${i} 0 obj\n`);const obj=objects[i];if(Array.isArray(obj)){push(obj[2]+'\nstream\n');push(obj[1]);push('\nendstream\n');}else push(obj+'\n');push('endobj\n');}
 const xref=size;push(`xref\n0 ${n+1}\n0000000000 65535 f \n`);for(let i=1;i<=n;i++)push(String(offsets[i]).padStart(10,'0')+' 00000 n \n');push(`trailer\n<< /Size ${n+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
 const out=new Uint8Array(size);let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;
}
export async function downloadProgramme(p,club,colours,type='png'){
 const base=`Project1989-programme-${p.season}-${p.week}-${p.home.replace(/[^a-z0-9]+/gi,'-')}-v-${p.away.replace(/[^a-z0-9]+/gi,'-')}`;
 const cover=await canvasFromSvg(programmeCoverSvg(p,club,colours));
 if(type==='png'){saveBlob(await canvasBlob(cover,'image/png'),base+'.png');return;}
 if(type!=='pdf')throw Error('Unknown export format');
 const inside=await canvasFromSvg(programmeInsideSvg(p));const blobs=await Promise.all([cover,inside].map(c=>canvasBlob(c,'image/jpeg',.93)));
 const bytes=await Promise.all(blobs.map(async b=>new Uint8Array(await b.arrayBuffer())));
 saveBlob(new Blob([pdfFromJpegs(bytes)],{type:'application/pdf'}),base+'.pdf');
}
