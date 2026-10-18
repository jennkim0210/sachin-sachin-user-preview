export const demoDuration={chat:16400,profile:23500,editor:24500};
export const exampleCopy={bio:'천천히 이야기를 나누는 걸 좋아해요',travelTitle:'여행을 좋아해요',travelBody:'여행지에서는 바다를 오래 바라봐요\n함께 걷고 싶은 곳도 나누고 싶어요',caption:'파도 소리를 들으며 보낸 오후'};
export function demoStep(kind,time){
 if(kind==='profile'){
  if(time<2600)return {state:'conversation',label:'대화 중'};
  if(time<5300)return {state:'proposal',label:'프로필 공개 제안'};
  if(time<10300)return {state:'invitation',agreed:time>=8200,label:time>=8200?'공개 수락':'공개 여부 선택'};
  return {state:'open',label:'서로의 프로필 공개'};
 }
 if(kind==='editor'){
  if(time<5200)return {state:'intro',menu:time>=3600?'note':null,label:time>=3600?'내용 추가':'내 소개 쓰기'};
  if(time<12800)return {state:'note',menu:time>=11000?'photo':null,label:time>=11000?'사진 추가':'좋아하는 것 쓰기'};
  if(time<18500)return {state:'photo',label:'내 사진과 이야기'};
  return {state:'preview',label:'완성된 프로필 미리보기'};
 }
 return {state:'chat',label:time<800?'채팅방이 열렸어요':'익명으로 대화하기'};
}
