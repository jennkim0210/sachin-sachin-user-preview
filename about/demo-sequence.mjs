export const demoDuration={chat:16400,proposal:10500,profile:10000,editor:18000};
export const exampleCopy={bio:'천천히 이야기를 나누는 걸 좋아해요',travelTitle:'여행을 좋아해요',travelBody:'여행지에서는 바다를 오래 바라봐요\n함께 걷고 싶은 곳도 나누고 싶어요',caption:'파도 소리를 들으며 보낸 오후'};
export function demoStep(kind,time){
 if(kind==='proposal'){
  if(time<3000)return {state:'proposal',label:'프로필 공개 제안'};
  return {state:'invitation',agreed:time>=7500,label:time>=7500?'공개에 동의하기':'공개 여부 선택'};
 }
 if(kind==='profile')return {state:'open',label:'서로 수락한 뒤의 프로필'};
 if(kind==='editor'){
  if(time<5200)return {state:'intro',menu:time>=3600?'note':null,label:time>=3600?'내용 추가':'내 소개 쓰기'};
  if(time<12000)return {state:'note',label:'좋아하는 것 쓰기'};
  return {state:'preview',label:'완성된 프로필 미리보기'};
 }
 return {state:'chat',label:time<800?'채팅방이 열렸어요':'익명으로 대화하기'};
}
