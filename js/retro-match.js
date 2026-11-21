// Project 1989: deterministic pixel-art incident replays.
// A short diagram of the EVENT already recorded in the match engine, never an independent match simulation.
// Fixed 320x180 internal resolution deliberately evokes late-1980s computer football.
let running=null;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);
export function scenePlan(match,event){
 const attacking=event.team===match.home;
 const type=['goal','chance','yellow','injury','kickoff','halftime','fulltime'].includes(event.type)?event.type:'chance';
 const minute=clamp(Number(event.minute)||0,0,90);
 const variant=(minute*17 + (Number(event.team)||0)*7 + (Number(match.seed)||0))>>>0;
 return {type,minute,attacking,variant,homeShirt:match.homeShirt||['#c42b35','#ffffff'],goal:type==='goal',isAction:type==='goal'||type==='chance'};
}
export function stopRetroScene(){if(running){running.cancelled=true;if(running.raf&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(running.raf);running=null;}}
function rect(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function line(ctx,a,b,c,d,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(Math.round(a)+.5,Math.round(b)+.5);ctx.lineTo(Math.round(c)+.5,Math.round(d)+.5);ctx.stroke();}
function drawPitch(ctx){
 for(let i=0;i<8;i++)rect(ctx,0,i*23,320,23,i%2?'#237d3e':'#288a43');
 ctx.strokeStyle='#cce6a6';ctx.lineWidth=1;ctx.strokeRect(9.5,8.5,301,163);line(ctx,160,9,160,171,'#cce6a6');
 ctx.beginPath();ctx.arc(160,90,23,0,Math.PI*2);ctx.stroke();ctx.strokeRect(9.5,48.5,45,83);ctx.strokeRect(265.5,48.5,45,83);
 ctx.strokeRect(9.5,69.5,19,42);ctx.strokeRect(291.5,69.5,19,42);ctx.strokeStyle='#ffffff';ctx.strokeRect(311.5,73.5,7,34);ctx.strokeRect(1.5,73.5,7,34);
 for(let x=313;x<=320;x+=3)line(ctx,x,74,x,107,'#d7e2d5');
 for(let y=74;y<=108;y+=5)line(ctx,312,y,319,y,'#d7e2d5');
}
function pixelPlayer(ctx,x,y,shirt,skin='#ebad78',keeper=false){
 const px=Math.round(x),py=Math.round(y);
 rect(ctx,px-3,py-14,7,3,'#171e18');rect(ctx,px-3,py-12,7,5,skin);
 if(Array.isArray(shirt)){rect(ctx,px-5,py-6,6,8,shirt[0]);rect(ctx,px+1,py-6,5,8,shirt[1]||shirt[0]);}else rect(ctx,px-5,py-6,11,8,shirt);rect(ctx,px-7,py-4,2,7,skin);rect(ctx,px+6,py-4,2,7,skin);
 rect(ctx,px-4,py+2,3,7,'#191b27');rect(ctx,px+2,py+2,3,7,'#191b27');
 rect(ctx,px-5,py+9,4,2,'#e9e3c4');rect(ctx,px+2,py+9,4,2,'#e9e3c4');
 if(keeper)rect(ctx,px-6,py-6,13,3,'#e4ce6f');
}
function ball(ctx,x,y){rect(ctx,x-2,y-2,5,5,'#fdf9d7');rect(ctx,x,y,2,2,'#161f19');}
function board(ctx,p,scoreText){rect(ctx,0,0,320,18,'#081c19');rect(ctx,2,2,316,14,'#15292a');ctx.font='bold 8px monospace';ctx.fillStyle='#e9d183';ctx.fillText(`${String(p.minute).padStart(2,'0')}'  ${p.type.toUpperCase()}`,8,12);ctx.fillStyle='#d9ebcb';ctx.fillText(scoreText,210,12);}
function paint(ctx,p,progress,scoreText){
 ctx.clearRect(0,0,320,180);ctx.imageSmoothingEnabled=false;drawPitch(ctx);
 const isRight=p.attacking,reverse=isRight?1:-1,tx=x=>isRight?x:320-x;
 // Every frame shares a recognisable attack pattern. Only the event type determines its outcome.
 const run=ease(clamp(progress*1.35,0,1)),shot=ease(clamp((progress-.49)/.43,0,1));
 const lane=[67,89,108][p.variant%3];
 const ax=tx(mix(125,242,run)),ay=mix(lane,90,run*.48);
 const bx=tx(84),cx=tx(116),dx=tx(164);
 const attack=isRight?p.homeShirt:['#f3f3ef','#f3f3ef'],defend=isRight?['#f3f3ef','#f3f3ef']:p.homeShirt;
 pixelPlayer(ctx,bx,51,attack);pixelPlayer(ctx,cx,130,attack);pixelPlayer(ctx,ax,ay,attack);
 pixelPlayer(ctx,tx(176),56,defend);pixelPlayer(ctx,tx(210),130,defend);pixelPlayer(ctx,tx(255),90,defend);
 // keeper shifts toward the shot; no random teleporting ball.
 const gy=p.goal?96:(p.variant%2?73:116);pixelPlayer(ctx,tx(292),mix(89,gy,shot), '#dd7858','#e7b184',true);
 if(p.isAction){
  const startX=mix(131,241,run),startY=mix(lane,90,run*.48);
  const x=progress<.49?startX:mix(241,p.goal?314:302,shot);
  const y=progress<.49?startY:mix(90,p.goal?96:(p.variant%2?55:132),shot);
  ball(ctx,tx(x),y);
  if(progress>.85){rect(ctx,122,19,76,14,'#071b16');ctx.font='bold 12px monospace';ctx.fillStyle=p.goal?'#ffe28e':'#e7f0e5';ctx.fillText(p.goal?'GOAL!':'CHANCE!',133,30);}
 }else{
  ball(ctx,tx(160),90);
  if(p.type==='yellow'){rect(ctx,tx(166),66,7,10,'#ffe04d');}
  if(p.type==='injury'){rect(ctx,tx(166),64,14,11,'#f2e6d5');rect(ctx,tx(172),66,3,8,'#cf3d3d');rect(ctx,tx(169),69,9,3,'#cf3d3d');}
 }
 board(ctx,p,scoreText);
}
export function drawRetroScene(canvas,match,event){
 stopRetroScene();if(!canvas?.getContext||!match||!event)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const p=scenePlan(match,event);
 const scoreText=event?.scoreText||`${match.hg} - ${match.ag}`;
 const duration=p.isAction?980:600;const state={cancelled:false,raf:null};running=state;
 if(typeof requestAnimationFrame!=='function'){paint(ctx,p,1,scoreText);return;}
 let start=null;
 const frame=t=>{if(state.cancelled)return;if(start===null)start=t;const progress=clamp((t-start)/duration,0,1);paint(ctx,p,progress,scoreText);if(progress<1)state.raf=requestAnimationFrame(frame);};
 state.raf=requestAnimationFrame(frame);
}
