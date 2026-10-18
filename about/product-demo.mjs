const kind=document.body.dataset.kind,app=document.querySelector('#app'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const duration=kind==='chat'?16400:10600;
let elapsed=0,playing=true,visible=parent===window,complete=false,last=0,profileOpen=false,agreed=false;
const rows=[...document.querySelectorAll('.message-row')],times=[800,2700,6500,9000,12700,15300];
const input=document.querySelector('#chat-message'),send=document.querySelector('.send-btn'),log=document.querySelector('#chat-messages');
const original=rows.map(row=>row.querySelector('.msg').textContent);
const outgoing=[{start:4000,end:6500,row:2},{start:10300,end:12700,row:4}];
function report(ready=false){parent.postMessage({type:'sachin-demo-status',kind,playing,complete,ready},location.origin);}
function updateChat(){
 rows.forEach((row,i)=>{const show=elapsed>=times[i];if(show&&row.hidden){row.classList.remove('is-arriving');void row.offsetWidth;row.classList.add('is-arriving');}row.hidden=!show;});
 let draft='';for(const stage of outgoing)if(elapsed>=stage.start&&elapsed<stage.end){const letters=Array.from(original[stage.row]);draft=letters.slice(0,Math.ceil(letters.length*(elapsed-stage.start)/(stage.end-stage.start))).join('');}
 if(input.value!==draft){input.value=draft;input.style.height='auto';input.style.height=Math.min(100,Math.max(42,input.scrollHeight))+'px';}
 send.disabled=!draft;log.scrollTop=log.scrollHeight;
}
function updateProfile(){
 const open=elapsed>=7200;
 if(open!==profileOpen){app.innerHTML=document.getElementById(open?'open-state':'invitation-state').innerHTML;profileOpen=open;agreed=false;window.scrollTo(0,0);}
 if(!open){const consent=document.getElementById('reveal-consent');if(consent){const next=elapsed>=4300;if(next!==agreed){consent.checked=next;agreed=next;document.querySelector('[data-action="request-reveal"]').disabled=!next;}if(elapsed>=2200){const box=consent.getBoundingClientRect();if(box.bottom>innerHeight-100)window.scrollTo(0,window.scrollY+box.bottom-innerHeight+120);}}}
 else if(elapsed>8900&&!reduced.matches){const bio=document.querySelector('.canvas-bio');if(bio?.getBoundingClientRect().bottom>innerHeight-20)window.scrollTo(0,Math.min(145,Math.max(0,elapsed-8900)*.09));}
}
function update(){if(kind==='chat')updateChat();else updateProfile();}
function restart(){elapsed=reduced.matches?duration:0;complete=reduced.matches;playing=!complete;last=0;if(kind==='chat'){rows.forEach(row=>{row.hidden=true;row.classList.remove('is-arriving');});}else{app.innerHTML=document.getElementById('invitation-state').innerHTML;profileOpen=false;agreed=false;window.scrollTo(0,0);}update();report();}
window.addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='sachin-demo')return;const command=event.data.command;if(command==='visible')visible=true;if(command==='hidden')visible=false;if(command==='pause')playing=false;if(command==='play'&&!complete)playing=true;if(command==='restart')restart();last=0;report();});
function tick(now){if(visible&&playing&&!complete&&!document.hidden&&!reduced.matches){if(last)elapsed+=Math.min(80,now-last);last=now;update();if(elapsed>=duration){elapsed=duration;complete=true;playing=false;update();report();}}else last=0;requestAnimationFrame(tick);}
reduced.addEventListener('change',restart);restart();report(true);requestAnimationFrame(tick);
