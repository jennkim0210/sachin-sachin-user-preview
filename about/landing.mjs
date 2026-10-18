const examples={
 daily:{topic:'일상',title:'쉬는 날에도\n자꾸 일 생각이 나요',body:'주말에는 쉬고 싶은데 업무 메신저를 계속 확인하게 돼요 집에서도 마음 편히 쉬기가 어렵네요 다들 어떻게 일을 내려놓나요?',reply:'저도 그랬어요 요즘은 금요일에 월요일 할 일을 적어두고 퇴근해요 집에서는 업무 알림을 끄고 잠깐 걷고요 어떤 순간에 일 생각이 가장 많이 나요?'},
 work:{topic:'직장',title:'부탁받은 일을\n거절하기 어려워요',body:'제 일도 밀려 있는데 부탁을 받으면 일단 알겠다고 해요 결국 야근하게 되고요 관계가 불편해지지 않게 말하고 싶어요',reply:'저는 바로 답하기 전에 제 일정을 먼저 확인해요 “오늘은 어렵고 목요일이면 가능해요”처럼 가능한 시간을 같이 말하니 한결 덜 부담스럽더라고요'},
 people:{topic:'인간관계',title:'친구에게 서운한 마음을\n어떻게 말할까요?',body:'친구가 약속을 자주 바꾸는데 괜찮다고만 했어요 계속 마음에 남아서 이야기하고 싶은데 괜히 다투게 될까 봐 망설여져요',reply:'저도 참다가 한꺼번에 말해서 후회한 적 있어요 “그날 기다리면서 서운했어 다음엔 미리 알려줄래?”처럼 한 가지 일부터 이야기하니 서로 듣기 편했어요'}
};
const tabs=[...document.querySelectorAll('[data-story]')],panel=document.getElementById('story-panel');
function selectStory(tab){
 const example=examples[tab.dataset.story];if(!example)return;
 for(const item of tabs){const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;}
 panel.setAttribute('aria-labelledby',tab.id);
 for(const key of ['topic','title','body','reply'])document.getElementById('sample-'+key).textContent=example[key].replace(/[,.]/g,'');
}
tabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectStory(tab));
 tab.addEventListener('keydown',event=>{
  let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
  event.preventDefault();selectStory(tabs[next]);tabs[next].focus();
 });
});
const scene=document.getElementById('listening-scene'),replay=document.getElementById('replay-scene'),motion=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionTimer;
function playScene(){
 clearTimeout(motionTimer);scene.classList.remove('is-playing','is-complete');
 if(motion.matches){scene.classList.add('is-complete');return;}
 // Restart the original ear-to-ear drawing once; never loop while the visitor reads.
 void scene.offsetWidth;scene.classList.add('is-playing');
 motionTimer=setTimeout(()=>{scene.classList.remove('is-playing');scene.classList.add('is-complete');},2200);
}
replay.hidden=false;replay.addEventListener('click',playScene);motion.addEventListener('change',playScene);
// Begin the drawing only when its illustration reaches the viewport.
let sceneSeen=false;
const art=scene.querySelector('img');
function startScene(){if(sceneSeen)return;sceneSeen=true;if(art.complete)playScene();else art.addEventListener('load',playScene,{once:true});}
const copy=document.getElementById('copy-link'),status=document.getElementById('share-status'),url=document.querySelector('link[rel=canonical]').href;
copy.hidden=false;
copy.addEventListener('click',async()=>{
 try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(url);status.textContent='소개 링크를 복사했어요';}
 catch{document.getElementById('share-fallback').hidden=false;const input=document.getElementById('share-url');input.focus();input.select();status.textContent='주소를 선택했어요 복사해서 공유해 주세요';}
});

// Playback lives in isolated display documents. No account or draft state is accessed.
const demoLabels={chat:'대화',proposal:'공개 제안'};
const demonstrations=[...document.querySelectorAll('[data-demo]')].map(figure=>({figure,frame:figure.querySelector('iframe'),pause:figure.querySelector('[data-demo-pause]'),replay:figure.querySelector('[data-demo-replay]'),finish:figure.querySelector('[data-demo-finish]'),stage:figure.querySelector('[data-demo-stage]'),visible:false,ready:false,playing:true,complete:false}));
function sendDemo(d,command){d.frame.contentWindow?.postMessage({type:'sachin-demo',command},location.origin);}
function syncDemo(d){sendDemo(d,d.visible&&!document.hidden?'visible':'hidden');}
for(const d of demonstrations){
 d.pause.hidden=motion.matches;d.replay.hidden=motion.matches;
 d.pause.addEventListener('click',()=>{d.playing=!d.playing;sendDemo(d,d.playing?'play':'pause');});
 d.replay.addEventListener('click',()=>{d.playing=true;sendDemo(d,'restart');});
 d.finish?.addEventListener('click',()=>sendDemo(d,'finish'));
 for(const button of d.figure.querySelectorAll('[data-demo-profile]'))button.addEventListener('click',()=>sendDemo(d,'profile-'+button.dataset.demoProfile));
}
if('IntersectionObserver' in window){
 const screenObserver=new IntersectionObserver(entries=>{for(const entry of entries){const d=demonstrations.find(item=>item.figure===entry.target);d.visible=entry.isIntersecting;syncDemo(d);}},{rootMargin:'-80px 0px -10% 0px',threshold:.12});
 demonstrations.forEach(d=>screenObserver.observe(d.figure));
}else{demonstrations.forEach(d=>{d.visible=true;syncDemo(d);});}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.data?.type!=='sachin-demo-status')return;
 const d=demonstrations.find(item=>item.frame.contentWindow===event.source);if(!d)return;
 d.playing=event.data.playing;d.complete=event.data.complete;
 d.pause.disabled=d.complete;d.pause.textContent=d.complete?'재생 완료':d.playing?'일시정지':'계속 보기';
 d.pause.setAttribute('aria-label',demoLabels[d.figure.dataset.demo]+' '+d.pause.textContent);
 if(event.data.ready){d.ready=true;syncDemo(d);}
});
document.addEventListener('visibilitychange',()=>demonstrations.forEach(syncDemo));
motion.addEventListener('change',()=>{for(const d of demonstrations){d.pause.hidden=motion.matches;d.replay.hidden=motion.matches;}});

// Both full profiles remain in normal document flow, with a manual switch on mobile.
const profilePair=document.querySelector('.disclosed-profiles'),profileButtons=[...document.querySelectorAll('[data-profile-view]')],compactProfiles=matchMedia('(max-width:700px)');
let selectedProfile='peer';
function showProfiles(){
 profilePair.classList.toggle('is-switching',compactProfiles.matches);
 for(const button of profileButtons)button.setAttribute('aria-pressed',String(button.dataset.profileView===selectedProfile));
 for(const card of profilePair.children){const hidden=compactProfiles.matches&&card.id!=='profile-'+selectedProfile;card.classList.toggle('is-inactive',hidden);card.inert=hidden;if(hidden)card.setAttribute('aria-hidden','true');else card.removeAttribute('aria-hidden');}
}
for(const button of profileButtons)button.addEventListener('click',()=>{selectedProfile=button.dataset.profileView;showProfiles();});
compactProfiles.addEventListener('change',showProfiles);showProfiles();

// Animate each actual screen as it arrives, not a tall section containing it.
// Elements remain visible without JS, reduced motion, or observer support.
const arrivals=[...document.querySelectorAll('.hero-copy,.hero-art,.section-heading,.story-toolbar,.letter-pair>article,.screen-copy,.screen-demo,.profile-gallery-heading,.profile-view-switch,.disclosed-profiles,.finished-profile,.faq-section,.start-inner')];
const fields=[...document.querySelectorAll('.float-field')];
const effects=document.getElementById('motion-toggle');let decorationsPaused=false;
function syncEffects(){document.body.classList.toggle('effects-paused',decorationsPaused||document.hidden||motion.matches);effects.setAttribute('aria-pressed',String(!decorationsPaused));effects.textContent=decorationsPaused?'배경 효과 켜기':'배경 효과 멈추기';effects.hidden=motion.matches;}
effects.hidden=false;effects.addEventListener('click',()=>{decorationsPaused=!decorationsPaused;syncEffects();});
document.addEventListener('visibilitychange',syncEffects);motion.addEventListener('change',syncEffects);syncEffects();
if('IntersectionObserver' in window){
 const arrivalsObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('has-arrived');arrivalsObserver.unobserve(entry.target);}},{rootMargin:'0px 0px -7% 0px',threshold:.06});
 for(const element of arrivals){element.classList.add('arrives');arrivalsObserver.observe(element);}
 const sceneObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){startScene();sceneObserver.disconnect();}},{threshold:.25});sceneObserver.observe(scene);
 const fieldObserver=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('is-visible',entry.isIntersecting);});fields.forEach(field=>fieldObserver.observe(field));
}else{startScene();fields.forEach(field=>field.classList.add('is-visible'));}
