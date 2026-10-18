export const demoDuration={chat:16400,proposal:10500,profile:20000,editor:26000};
export const exampleCopy={bio:'천천히 이야기를 나누는 걸 좋아해요',travelTitle:'여행 · 바다 · 수영',travelBody:'바다로 떠나는 여행을 좋아해요\n수영하고 해변을 걸으며 쉬어요',caption:'수영하고 파도 소리 들으며 쉬던 날'};
export function demoStep(kind,time,profileView='peer'){
 if(kind==='proposal'){
  if(time<3000)return {state:'proposal',label:'프로필 공개 제안'};
  return {state:'invitation',agreed:time>=7500,label:time>=7500?'공개에 동의하기':'공개 여부 선택'};
 }
 if(kind==='profile')return {state:profileView==='self'?'own':'open',label:profileView==='self'?'내 공개 프로필':'상대 프로필'};
 if(kind==='editor'){
  if(time<5200)return {state:'intro',menu:time>=3600?'note':null,label:time>=3600?'내용 추가':'내 소개 쓰기'};
  if(time<13000)return {state:'note',menu:time>=11000?'photo':null,label:time>=11000?'사진 추가':'좋아하는 것 쓰기'};
  if(time<19000)return {state:'photo',label:'바다 사진에 이야기 더하기'};
  return {state:'preview',label:'완성된 프로필 미리보기'};
 }
 return {state:'chat',label:time<800?'채팅방이 열렸어요':'익명으로 대화하기'};
}
