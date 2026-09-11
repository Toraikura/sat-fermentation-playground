(()=>{
'use strict';

function scrollToBoardReturnPosition(){
  const target=document.getElementById('missionDock')||document.getElementById('paperBoard');
  if(!target)return;

  const move=()=>{
    const y=window.scrollY+target.getBoundingClientRect().top-8;
    window.scrollTo({top:Math.max(0,y),behavior:'auto'});
  };

  requestAnimationFrame(()=>requestAnimationFrame(move));
  setTimeout(move,80);
}

['backToBoard','quitMission','gameOverBoard'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.addEventListener('click',scrollToBoardReturnPosition);
});
})();
