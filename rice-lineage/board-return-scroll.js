(()=>{
'use strict';

function scrollToBoardReturnPosition(){
  const target=document.getElementById('missionDock')||document.getElementById('paperBoard');
  if(!target)return;
  target.style.scrollMarginTop='8px';
  requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'auto'}));
}

['backToBoard','quitMission','gameOverBoard'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.addEventListener('click',scrollToBoardReturnPosition);
});
})();
