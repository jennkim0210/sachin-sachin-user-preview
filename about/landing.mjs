const examples={
 daily:{topic:'일상',title:'주말에 아무것도 안 하면,\n괜히 뒤처지는 기분이에요.',body:'평일에는 쉬고 싶다가도, 막상 쉬는 날엔 마음이 조급해져요. 다들 쉬는 시간을 어떻게 보내나요?',reply:'저도 그랬어요. 요즘은 주말에 해야 할 일 대신, 하고 싶은 일 하나만 적어요. 오늘은 창문 열고 노래 듣기. 그 정도여도 꽤 괜찮은 하루더라고요.'},
 work:{topic:'직장',title:'잘하고 있는 건지,\n가끔은 잘 모르겠어요.',body:'일은 열심히 하는데 제가 제대로 하고 있는지 모르겠어요. 작은 실수 하나에도 하루 종일 마음이 쓰이네요.',reply:'퇴근할 때 오늘 해낸 일 하나만 적어보면 어때요? 저도 실수한 것만 생각했는데, 적고 보니 꽤 많은 일을 하고 있더라고요. 오늘도 애썼어요.'},
 people:{topic:'인간관계',title:'오래된 친구에게,\n먼저 연락하기가 어려워요.',body:'별일 없이 연락하던 사이였는데 어느새 몇 달이 지났어요. 다시 말을 걸면 어색할까 봐 망설이고 있어요.',reply:'저는 얼마 전에 “이거 보니까 네 생각 났어” 하고 사진을 보냈어요. 친구도 연락할까 고민 중이었다더라고요. 반가운 마음은 생각보다 잘 전해져요.'}
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
 motionTimer=setTimeout(()=>{scene.classList.remove('is-playing');scene.classList.add('is-complete');},3900);
}
replay.hidden=false;replay.addEventListener('click',playScene);motion.addEventListener('change',playScene);
const art=scene.querySelector('img');if(art.complete)playScene();else art.addEventListener('load',playScene,{once:true});
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
const screenObserver=new IntersectionObserver(entries=>{for(const entry of entries){const d=demonstrations.find(item=>item.figure===entry.target);d.visible=entry.isIntersecting;syncDemo(d);}},{threshold:.15});
demonstrations.forEach(d=>screenObserver.observe(d.figure));
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
