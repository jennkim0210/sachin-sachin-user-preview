export const demoDuration={chat:4600,proposal:2800};
export const exampleCopy={bio:'천천히 이야기를 나누는 걸 좋아해요',travelTitle:'여행 · 바다 · 수영',travelBody:'바다로 떠나는 여행을 좋아해요\n수영하고 해변을 걸으며 쉬어요',caption:'수영하고 파도 소리 들으며 쉬던 날'};
export function demoStep(kind,time,profileView='peer'){
 if(kind==='proposal'){
  if(time<900)return {state:'proposal',label:'프로필 공개 제안'};
  return {state:'invitation',agreed:time>=2100,label:time>=2100?'공개에 동의하기':'공개 여부 선택'};
 }
 return {state:'chat',label:'익명으로 대화하기'};
}
