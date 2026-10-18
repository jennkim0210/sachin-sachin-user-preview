import {demoDuration,demoStep,exampleCopy} from './demo-sequence.mjs?v=20261018-separate-disclosure';
const kind=document.body.dataset.kind,app=document.querySelector('#app'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),scroller=document.querySelector('#demo-scroll');
const duration=demoDuration[kind];
let elapsed=0,playing=true,visible=parent===window,complete=false,last=0,screen='',stage='';
const rows=[...document.querySelectorAll('.message-row')],times=[800,2700,6500,9000,12700,15300];
const input=document.querySelector('#chat-message'),send=document.querySelector('.send-btn'),log=document.querySelector('#chat-messages');
const original=rows.map(row=>row.querySelector('.msg').textContent);
const outgoing=[{start:4000,end:6500,row:2},{start:10300,end:12700,row:4}];
function report(ready=false){parent.postMessage({type:'sachin-demo-status',kind,playing,complete,ready,stage},location.origin);}
function updateChat(){
 rows.forEach((row,i)=>{const show=elapsed>=times[i];if(show&&row.hidden){row.classList.remove('is-arriving');void row.offsetWidth;row.classList.add('is-arriving');}row.hidden=!show;});
 let draft='';for(const stage of outgoing)if(elapsed>=stage.start&&elapsed<stage.end){const letters=Array.from(original[stage.row]);draft=letters.slice(0,Math.ceil(letters.length*(elapsed-stage.start)/(stage.end-stage.start))).join('');}
 if(input.value!==draft){input.value=draft;input.style.height='auto';input.style.height=Math.min(100,Math.max(42,input.scrollHeight))+'px';}
 send.disabled=!draft;log.scrollTop=log.scrollHeight;
}
const progress=(start,end)=>Math.max(0,Math.min(1,(elapsed-start)/(end-start)));
function showScreen(next){if(screen===next)return;app.innerHTML=document.getElementById(next+'-state').innerHTML;screen=next;scroller.scrollTop=0;sizeFields();}
function sizeFields(){for(const field of app.querySelectorAll('textarea[data-profile-autosize]')){field.style.height='0px';field.style.height=field.scrollHeight+'px';}}
function typeField(selector,text,start,end){const field=app.querySelector(selector);if(!field)return;const value=Array.from(text).slice(0,Math.ceil(Array.from(text).length*progress(start,end))).join('');if(field.value!==value){field.value=value;sizeFields();}field.classList.toggle('is-demo-typing',elapsed>=start&&elapsed<end);}
function scrollToPart(selector,start,end,offset=92){const target=app.querySelector(selector);if(!target)return;const top=target.getBoundingClientRect().top+scroller.scrollTop-scroller.getBoundingClientRect().top-offset;const p=progress(start,end);scroller.scrollTop=Math.max(0,top)*(p*p*(3-2*p));}
function updateProfile(moment){
 showScreen(moment.state);
 if(moment.state==='conversation'||moment.state==='proposal'){const log=app.querySelector('#chat-messages');log.scrollTop=log.scrollHeight;}
 if(moment.state==='invitation'){const consent=app.querySelector('#reveal-consent');consent.checked=Boolean(moment.agreed);const button=app.querySelector('[data-action="request-reveal"]');button.disabled=!moment.agreed;button.classList.toggle('is-demo-target',Boolean(moment.agreed));scrollToPart('.reveal-letter-actions',4300,5600,innerHeight-230);}
 if(moment.state==='open'){if(elapsed<5000)scrollToPart('.canvas-bio',1800,3500,200);else scrollToPart('[data-block-id="travel"]',5000,8000,150);}
}
function updateEditor(moment){
 showScreen(moment.state);
 const picker=document.getElementById('demo-picker');picker.hidden=!moment.menu;
 for(const button of picker.querySelectorAll('.canvas-menu-row'))button.classList.toggle('is-demo-target',button.dataset.action==='add-profile-'+moment.menu);
 if(moment.state==='intro'){typeField('textarea[name="bio"]',exampleCopy.bio,1200,3200);scrollToPart('.canvas-identity',500,1200,150);}
 if(moment.state==='note'){typeField('[name="block-travel-title"]',exampleCopy.travelTitle,5700,7000);typeField('[name="block-travel-body"]',exampleCopy.travelBody,7100,10300);scrollToPart('[data-block-id="travel"]',5200,5700,125);}
 if(moment.state==='preview'){if(elapsed<15000)scrollToPart('.canvas-bio',12500,14000,190);else scrollToPart('[data-block-id="travel"]',15000,17500,150);}
}
function update(){const moment=demoStep(kind,elapsed);if(kind==='chat')updateChat();else if(kind==='profile'||kind==='proposal')updateProfile(moment);else updateEditor(moment);if(stage!==moment.label){stage=moment.label;report();}}
function restart(){elapsed=reduced.matches?duration:0;complete=reduced.matches;playing=!complete;last=0;screen='';if(kind==='chat')rows.forEach(row=>{row.hidden=true;row.classList.remove('is-arriving');});update();report();}
window.addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='sachin-demo')return;const command=event.data.command;if(command==='visible')visible=true;if(command==='hidden')visible=false;if(command==='pause')playing=false;if(command==='play'&&!complete)playing=true;if(command==='restart')restart();if(command==='finish'){elapsed=duration;complete=true;playing=false;update();}last=0;report();});
function tick(now){if(visible&&playing&&!complete&&!document.hidden&&!reduced.matches){if(last)elapsed+=Math.min(80,now-last);last=now;update();if(elapsed>=duration){elapsed=duration;complete=true;playing=false;update();report();}}else last=0;requestAnimationFrame(tick);}
reduced.addEventListener('change',restart);restart();report(true);requestAnimationFrame(tick);
// A direct jump and reduced-motion preview must settle after image/font layout too.
scroller?.addEventListener?.('load',update,true);window.addEventListener('resize',update);document.fonts?.ready.then(update);
