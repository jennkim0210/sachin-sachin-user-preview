import {demoDuration,demoStep} from './demo-sequence.mjs?v=20261018-smooth-flow';
const kind=document.body.dataset.kind,app=document.querySelector('#app'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),scroller=document.querySelector('#demo-scroll');
const duration=demoDuration[kind];
let elapsed=0,playing=true,visible=parent===window,complete=false,last=0,frameId=0,screen='',stage='',profileView='peer';
const rows=[...document.querySelectorAll('.message-row')],times=[0,450,1400,2200,3300,4200];
const input=document.querySelector('#chat-message'),send=document.querySelector('.send-btn'),log=document.querySelector('#chat-messages');
const original=rows.map(row=>row.querySelector('.msg').textContent);
const outgoing=[{start:850,end:1400,row:2},{start:2750,end:3300,row:4}];
function report(ready=false){parent.postMessage({type:'sachin-demo-status',kind,playing,complete,ready,stage,profileView},location.origin);}
function updateChat(){
 let changed=false;
 rows.forEach((row,i)=>{const show=elapsed>=times[i];if(row.hidden===!show)return;changed=true;row.hidden=!show;if(show)row.classList.add('is-arriving');});
 let draft='';for(const stage of outgoing)if(elapsed>=stage.start&&elapsed<stage.end){const letters=Array.from(original[stage.row]);draft=letters.slice(0,Math.ceil(letters.length*(elapsed-stage.start)/(stage.end-stage.start))).join('');}
 if(input.value!==draft)input.value=draft;
 if(send.disabled!==!draft)send.disabled=!draft;
 // Fixed two-line demo composer: typing no longer resizes the conversation.
 // Read layout only when a new bubble arrives, never on every animation frame.
 if(changed){if(log.scrollTo&&!reduced.matches)log.scrollTo({top:log.scrollHeight,behavior:elapsed?'smooth':'instant'});else log.scrollTop=log.scrollHeight;}
}
function showScreen(next){
 if(screen===next)return;
 const outgoing=screen&&!reduced.matches?app.lastElementChild:null;
 app.innerHTML=document.getElementById(next+'-state').innerHTML;screen=next;scroller.scrollTop=0;
 if(next==='conversation'||next==='proposal'){const chatLog=app.querySelector('#chat-messages');chatLog.scrollTop=chatLog.scrollHeight;}
 if(outgoing){outgoing.setAttribute('aria-hidden','true');outgoing.inert=true;outgoing.classList.add('demo-outgoing');app.prepend(outgoing);outgoing.addEventListener('animationend',event=>{if(event.target===outgoing)outgoing.remove();});}
}
function updateProfile(moment){
 showScreen(moment.state);
 if(moment.state==='invitation'){const consent=app.querySelector('#reveal-consent');if(consent.checked!==Boolean(moment.agreed))consent.checked=Boolean(moment.agreed);const button=app.querySelector('[data-action="request-reveal"]');if(button.disabled!==!moment.agreed)button.disabled=!moment.agreed;}

}
function update(){const moment=demoStep(kind,elapsed,profileView);if(kind==='chat')updateChat();else updateProfile(moment);if(stage!==moment.label){stage=moment.label;report();}}
function stopFrames(){if(frameId)cancelAnimationFrame(frameId);frameId=0;last=0;}
function schedule(){if(!frameId&&visible&&playing&&!complete&&!document.hidden&&!reduced.matches)frameId=requestAnimationFrame(tick);}
function restart(){stopFrames();elapsed=reduced.matches?duration:0;complete=reduced.matches;playing=!complete;screen='';if(kind==='chat')rows.forEach(row=>{row.hidden=true;row.classList.remove('is-arriving');});update();report();schedule();}
window.addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='sachin-demo')return;const command=event.data.command;if(command==='visible')visible=true;if(command==='hidden')visible=false;if(command==='pause')playing=false;if(command==='play'&&!complete)playing=true;if(command==='restart')restart();if(command==='finish'){elapsed=duration;complete=true;playing=false;update();}stopFrames();schedule();report();});
function tick(now){frameId=0;if(visible&&playing&&!complete&&!document.hidden&&!reduced.matches){if(last)elapsed+=Math.min(80,now-last);last=now;update();if(elapsed>=duration){elapsed=duration;complete=true;playing=false;report();}}else last=0;schedule();}
document.addEventListener?.('visibilitychange',()=>{stopFrames();schedule();});
reduced.addEventListener('change',restart);restart();report(true);
// A direct jump and reduced-motion preview must settle after image/font layout too.
scroller?.addEventListener?.('load',update,true);window.addEventListener('resize',update);document.fonts?.ready.then(update);
