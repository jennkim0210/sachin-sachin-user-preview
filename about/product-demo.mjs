import {demoDuration,demoStep} from './demo-sequence.mjs?v=20261018-open-profiles';
const kind=document.body.dataset.kind,app=document.querySelector('#app'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),scroller=document.querySelector('#demo-scroll');
const duration=demoDuration[kind];
let elapsed=0,playing=true,visible=parent===window,complete=false,last=0,screen='',stage='',profileView='peer';
const rows=[...document.querySelectorAll('.message-row')],times=[800,2700,6500,9000,12700,15300];
const input=document.querySelector('#chat-message'),send=document.querySelector('.send-btn'),log=document.querySelector('#chat-messages');
const original=rows.map(row=>row.querySelector('.msg').textContent);
const outgoing=[{start:4000,end:6500,row:2},{start:10300,end:12700,row:4}];
function report(ready=false){parent.postMessage({type:'sachin-demo-status',kind,playing,complete,ready,stage,profileView},location.origin);}
function updateChat(){
 rows.forEach((row,i)=>{const show=elapsed>=times[i];if(show&&row.hidden){row.classList.remove('is-arriving');void row.offsetWidth;row.classList.add('is-arriving');}row.hidden=!show;});
 let draft='';for(const stage of outgoing)if(elapsed>=stage.start&&elapsed<stage.end){const letters=Array.from(original[stage.row]);draft=letters.slice(0,Math.ceil(letters.length*(elapsed-stage.start)/(stage.end-stage.start))).join('');}
 if(input.value!==draft){input.value=draft;input.style.height='auto';input.style.height=Math.min(100,Math.max(42,input.scrollHeight))+'px';}
 send.disabled=!draft;log.scrollTop=log.scrollHeight;
}
function showScreen(next){if(screen===next)return;app.innerHTML=document.getElementById(next+'-state').innerHTML;screen=next;scroller.scrollTop=0;}
function updateProfile(moment){
 showScreen(moment.state);
 if(moment.state==='conversation'||moment.state==='proposal'){const log=app.querySelector('#chat-messages');log.scrollTop=log.scrollHeight;}
 if(moment.state==='invitation'){const consent=app.querySelector('#reveal-consent');consent.checked=Boolean(moment.agreed);const button=app.querySelector('[data-action="request-reveal"]');button.disabled=!moment.agreed;}

}
function update(){const moment=demoStep(kind,elapsed,profileView);if(kind==='chat')updateChat();else updateProfile(moment);if(stage!==moment.label){stage=moment.label;report();}}
function restart(){elapsed=reduced.matches?duration:0;complete=reduced.matches;playing=!complete;last=0;screen='';if(kind==='chat')rows.forEach(row=>{row.hidden=true;row.classList.remove('is-arriving');});update();report();}
window.addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='sachin-demo')return;const command=event.data.command;if(command==='visible')visible=true;if(command==='hidden')visible=false;if(command==='pause')playing=false;if(command==='play'&&!complete)playing=true;if(command==='restart')restart();if(command==='finish'){elapsed=duration;complete=true;playing=false;update();}last=0;report();});
function tick(now){if(visible&&playing&&!complete&&!document.hidden&&!reduced.matches){if(last)elapsed+=Math.min(80,now-last);last=now;update();if(elapsed>=duration){elapsed=duration;complete=true;playing=false;update();report();}}else last=0;requestAnimationFrame(tick);}
reduced.addEventListener('change',restart);restart();report(true);requestAnimationFrame(tick);
// A direct jump and reduced-motion preview must settle after image/font layout too.
scroller?.addEventListener?.('load',update,true);window.addEventListener('resize',update);document.fonts?.ready.then(update);
