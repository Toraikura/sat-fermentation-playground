(()=>{
'use strict';
const D=window.RICE_LINEAGE_DATA;
const G=window.RICE_LINEAGE_GAME_DATA;
if(!D||!G)return;
const $=(s,r=document)=>r.querySelector(s);
const archiveById=new Map(D.nodes.map(n=>[n.id,n]));
const missions=G.missions;
const worlds=G.worlds;
const missionById=new Map(missions.map(m=>[m.id,m]));
const missionIndexById=new Map(missions.map((m,i)=>[m.id,i]));
const worldById=new Map(worlds.map(w=>[w.id,w]));
const STORAGE='rice-lineage-arcade-v2';
const state=loadState();
let selectedMission=missionById.get(state.selected)||missions[0];
let activeWorld=selectedMission.world;
let currentMission=null,qIndex=0,hearts=3,score=0,combo=0,choices=[],answerLocked=false,touchStartX=null,audioCtx=null;
let pendingTimer=0,dataRendered=false,flashLayer=null,flashAnimation=null,shakeAnimation=null;
function loadState(){
try{
const raw=JSON.parse(localStorage.getItem(STORAGE)||'{}');
return{completed:Array.isArray(raw.completed)?raw.completed:[],best:raw.best||{},vehicle:raw.vehicle||'coupe',selected:raw.selected||missions[0].id,sound:raw.sound!==false};
}catch{return{completed:[],best:{},vehicle:'coupe',selected:missions[0].id,sound:true}}
}
function saveState(){state.selected=selectedMission.id;try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{}}
function node(id){return archiveById.get(id)||G.nodes[id]||{id,ja:id,en:String(id).toUpperCase(),region:'—'}}
function missionIndex(id){return missionIndexById.get(id)??-1}
function isUnlocked(m){const i=missionIndex(m.id);return i===0||state.completed.includes(missions[i-1].id)||state.completed.includes(m.id)}
function worldUnlocked(w){const first=missionById.get(w.missions[0]);return !!first&&isUnlocked(first)}
function allClear(){return missions.every(m=>state.completed.includes(m.id))}
function formatScore(n){return String(Math.max(0,n)).padStart(4,'0')}
function difficultyStars(n){return '★'.repeat(n)+'☆'.repeat(Math.max(0,5-n))}
function resolveChoice(ref){return typeof ref==='string'?node(ref):ref}
function shouldDirectStartFromBoard(m){return m.id===missions[0].id&&!state.completed.includes(m.id)}
function clearPendingTimer(){if(pendingTimer){clearTimeout(pendingTimer);pendingTimer=0}}
function scheduleTransition(fn,delay){clearPendingTimer();pendingTimer=setTimeout(()=>{pendingTimer=0;fn()},delay)}
function showScreen(which){
if(which!=='arcadeScreen')clearPendingTimer();
['boardScreen','arcadeScreen','clearScreen'].forEach(id=>{const el=$('#'+id);const active=id===which;el.hidden=!active;el.classList.toggle('is-active',active)});
window.scrollTo(0,0)
}
function vehicleSVG(type=state.vehicle){
if(type==='truck')return `<svg viewBox="0 0 92 56" shape-rendering="crispEdges" aria-hidden="true"><g class="truck-sprite"><rect x="18" y="8" width="48" height="30" rx="2"/><rect x="12" y="24" width="68" height="18"/><rect class="glass" x="24" y="12" width="34" height="12"/><rect class="bumper" x="8" y="40" width="76" height="6"/><rect class="lamp" x="17" y="30" width="10" height="7"/><rect class="lamp" x="65" y="30" width="10" height="7"/><rect class="plate" x="35" y="32" width="22" height="8"/><rect class="wheel" x="18" y="45" width="13" height="8"/><rect class="wheel" x="61" y="45" width="13" height="8"/></g></svg>`;
return `<svg viewBox="0 0 108 52" shape-rendering="crispEdges" aria-hidden="true"><g class="coupe-sprite"><path d="M20 34h5l7-17h44l10 17h6v11H16V34z"/><path class="glass" d="M37 19h34l8 14H29z"/><rect class="bumper" x="13" y="39" width="82" height="7"/><rect class="lamp" x="24" y="32" width="12" height="8"/><rect class="lamp" x="72" y="32" width="12" height="8"/><rect class="plate" x="45" y="35" width="20" height="7"/><rect class="wheel" x="22" y="45" width="14" height="6"/><rect class="wheel" x="72" y="45" width="14" height="6"/></g></svg>`
}
function renderVehicle(id){const el=$('#'+id);if(el)el.innerHTML=vehicleSVG()}
function renderBoardVehicle(){
renderVehicle('vehicleMini');
$('#vehicleName').textContent=state.vehicle==='truck'?'NEON KEI TRUCK':'LINEAGE COUPE';
const sw=$('#vehicleSwitch');sw.hidden=!allClear();sw.textContent=state.vehicle==='truck'?'COUPEへ':'軽トラへ'
}
function renderGameVehicle(){renderVehicle('vehicleLarge')}
function renderClearVehicle(){renderVehicle('clearVehicle')}
function renderWorldNav(){
const nav=$('#worldNav');
nav.innerHTML='';
worlds.forEach(w=>{
const done=w.missions.filter(id=>state.completed.includes(id)).length;
const unlocked=worldUnlocked(w);
const b=document.createElement('button');
b.type='button';
b.className=`world-tab ${activeWorld===w.id?'active':''}`;
b.disabled=!unlocked;
b.innerHTML=`<small>${w.label}</small><strong>${w.name}</strong><span>${w.ja} · ${done}/${w.missions.length}${unlocked?'':' · LOCK'}</span>`;
b.addEventListener('click',()=>selectWorld(w.id));
nav.append(b)
})
}
function selectWorld(id){
const w=worldById.get(id);if(!w||!worldUnlocked(w))return;
activeWorld=id;
const candidates=w.missions.map(mid=>missionById.get(mid)).filter(Boolean);
const pick=candidates.find(m=>isUnlocked(m)&&!state.completed.includes(m.id))||candidates.find(m=>isUnlocked(m));
if(pick){selectedMission=pick;saveState()}
renderBoard()
}
function renderBoard(){
$('#boardProgress').textContent=`${state.completed.length} / ${missions.length}`;
const w=worldById.get(activeWorld)||worlds[0];
$('#worldMapTitle').textContent=`${w.label} / ${w.name}`;
$('#worldMapSub').textContent=w.ja;
renderWorldNav();
const nodesBox=$('#boardNodes');nodesBox.innerHTML='';
w.missions.forEach(id=>{
const m=missionById.get(id),n=node(m.target),[x,y]=w.layout[id],unlocked=isUnlocked(m),done=state.completed.includes(m.id);
const b=document.createElement('button');
b.type='button';b.disabled=!unlocked;
b.className=`map-node target ${done?'done':''} ${!unlocked?'locked':''} ${selectedMission.id===m.id?'selected':''}`;
b.style.left=x+'%';b.style.top=y+'%';b.dataset.id=m.id;b.dataset.stage=String(missionIndex(m.id)+1).padStart(2,'0');
b.innerHTML=`<span class="grain"></span><strong>${n.ja}</strong><small>${n.en}</small><i>${done?'CLEAR':unlocked?'DRIVE':'LOCK'}</i>`;
b.addEventListener('click',()=>{
if(shouldDirectStartFromBoard(m)){
selectedMission=m;activeWorld=m.world;saveState();startMission();return
}
selectMission(m.id)
});
nodesBox.append(b)
});
const svg=$('#boardLines');svg.innerHTML='';
for(let i=0;i<w.missions.length-1;i++){
const aId=w.missions[i],bId=w.missions[i+1],pa=w.layout[aId],pb=w.layout[bId];
const p=document.createElementNS('http://www.w3.org/2000/svg','path');
const x1=pa[0]*10,y1=pa[1]*6.5,x2=pb[0]*10,y2=pb[1]*6.5,mid=(x1+x2)/2;
p.setAttribute('d',`M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`);
const done=state.completed.includes(aId),ready=isUnlocked(missionById.get(bId));
p.setAttribute('class',`board-edge ${done?'done':ready?'ready':'locked'}`);svg.append(p)
}
$('#paperBoard').classList.toggle('all-clear',allClear());
renderDock();renderBoardVehicle()
}
function selectMission(id){
const m=missionById.get(id);if(!m||!isUnlocked(m))return;
selectedMission=m;activeWorld=m.world;saveState();renderBoard()
}
function renderDock(){
const m=selectedMission,i=missionIndex(m.id),done=state.completed.includes(m.id),unlocked=isUnlocked(m),n=node(m.target);
$('#dockNumber').textContent=String(i+1).padStart(2,'0');
$('#dockTitle').textContent=n.ja;
$('#dockSummary').textContent=m.summary;
$('#dockMeta').textContent=`${difficultyStars(m.difficulty)} · ${m.questions.length} CHECKPOINTS / ${m.region}${m.special?' · '+m.special:''}`;
$('#dockStatus').textContent=done?'CLEARED':unlocked?'READY':'LOCKED';
$('#dockStatus').className=`status-pill ${done?'done':''}`;
const btn=$('#startMission');btn.disabled=!unlocked;btn.querySelector('span').textContent=unlocked?'START ENGINE':'LOCKED'
}
function resetTransientEffects(){
flashAnimation?.cancel();flashAnimation=null;shakeAnimation?.cancel();shakeAnimation=null;
if(flashLayer)flashLayer.style.opacity='0';
const vw=$('#vehicleWrap');if(vw)vw.className='vehicle-wrap'
}
function ensureFlashLayer(){
if(flashLayer)return flashLayer;
flashLayer=document.createElement('div');
flashLayer.setAttribute('aria-hidden','true');
flashLayer.style.cssText='position:absolute;inset:0;z-index:14;pointer-events:none;opacity:0';
$('#arcadeStage').append(flashLayer);
return flashLayer
}
function playStageFlash(kind){
const layer=ensureFlashLayer(),good=kind==='correct',duration=good?350:280;
layer.style.background=good?'rgba(255,255,255,.18)':'rgba(255,55,95,.20)';
flashAnimation?.cancel();
if(layer.animate){
flashAnimation=layer.animate([{opacity:0},{opacity:1,offset:.45},{opacity:0}],{duration,easing:'ease-out'});
flashAnimation.onfinish=()=>{layer.style.opacity='0';flashAnimation=null}
}else{
layer.style.opacity='1';requestAnimationFrame(()=>{layer.style.opacity='0'})
}
if(!good){
const road=$('#roadWorld');shakeAnimation?.cancel();
if(road?.animate){
shakeAnimation=road.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:440,easing:'linear'});
shakeAnimation.onfinish=()=>{shakeAnimation=null}
}
}
}
function startMission(){
clearPendingTimer();resetTransientEffects();
currentMission=selectedMission;qIndex=0;hearts=3;score=0;combo=0;answerLocked=false;$('#gameOver').hidden=true;
$('#arcadeTitle').textContent=currentMission.special?`${currentMission.special} / SPECIAL ROUTE`:'親をさがせ！ / FIND THE ROOT';
showScreen('arcadeScreen');renderGameVehicle();renderQuestion();playTone('start')
}
function renderQuestion(){
const q=currentMission.questions[qIndex],cur=node(q.current),correct=resolveChoice(q.correct),wrong=resolveChoice(q.wrong);
$('#checkpointNow').textContent=qIndex+1;$('#checkpointTotal').textContent=currentMission.questions.length;$('#scoreValue').textContent=formatScore(score);$('#comboValue').textContent=combo;
$('#currentRiceJa').textContent=cur.ja;$('#currentRiceEn').textContent=cur.en;$('#carPlate').textContent=cur.ja+'号';
$('#questionKicker').textContent=q.kicker||`CHECKPOINT ${qIndex+1}`;$('#questionText').textContent=q.prompt;$('#questionSub').textContent=q.sub;renderHearts();
choices=Math.random()>.5?[{...correct,ok:true},{...wrong,ok:false}]:[{...wrong,ok:false},{...correct,ok:true}];
setChoice($('#leftChoice'),choices[0]);setChoice($('#rightChoice'),choices[1]);answerLocked=false;$('#feedback').className='feedback';$('#feedback').textContent='';resetTransientEffects()
}
function setChoice(el,n){
el.dataset.id=n.id;el.dataset.kind=n.kind||'rice';el.querySelector('strong').textContent=n.ja;el.querySelector('small').textContent=n.en
}
function renderHearts(){const row=$('#lifeRow');row.innerHTML='';for(let i=0;i<3;i++){const s=document.createElement('span');s.className=i<hearts?'heart live':'heart';s.textContent='♥';row.append(s)}row.setAttribute('aria-label',`残りハート${hearts}`)}
function answer(side){
if(answerLocked||!currentMission)return;answerLocked=true;
const pick=side==='left'?choices[0]:choices[1],correct=pick.ok;const vw=$('#vehicleWrap');vw.classList.add(side==='left'?'turn-left':'turn-right');
if(correct){
combo++;const gain=100+(combo-1)*20;score+=gain;$('#scoreValue').textContent=formatScore(score);$('#comboValue').textContent=combo;playStageFlash('correct');
const f=$('#feedback');f.textContent=pick.kind==='event'?'ROUTE FOUND!':`GOOD! +${gain}`;f.className='feedback show good';playTone('correct');
scheduleTransition(()=>{qIndex++;if(qIndex>=currentMission.questions.length)finishMission();else renderQuestion()},720)
}else{
combo=0;hearts--;score=Math.max(0,score-50);$('#scoreValue').textContent=formatScore(score);$('#comboValue').textContent=combo;renderHearts();playStageFlash('wrong');
const f=$('#feedback');f.textContent='WRONG WAY! -1 ♥';f.className='feedback show bad';playTone('wrong');
scheduleTransition(()=>{if(hearts<=0){$('#gameOver').hidden=false;answerLocked=false}else{answerLocked=false;$('#vehicleWrap').className='vehicle-wrap';f.className='feedback';f.textContent=''}},650)
}
}
function finishMission(){
const m=currentMission;if(!state.completed.includes(m.id))state.completed.push(m.id);state.best[m.id]=Math.max(state.best[m.id]||0,score);saveState();renderClear(m,score);playTone('clear');showScreen('clearScreen')
}
function renderClear(m,missionScore){
const target=node(m.target);$('#rewardScore').textContent='+'+missionScore;$('#learnTitle').textContent=target.ja;$('#learnText').textContent=m.learn;$('#cardName').textContent=target.ja;
$('.clear-sub').textContent=m.special?`${m.special} COMPLETE! 系譜がつながった。`:'正解！ 系譜がつながった。';
const route=$('#clearRoute');route.innerHTML=`<span class="route-child"><strong>${target.ja}</strong><small>${target.en}</small></span><b>← ROOTS ←</b><div>${m.route.slice(0,5).map(id=>`<span><strong>${node(id).ja}</strong><small>${node(id).en}</small></span>`).join('')}</div>`;renderClearVehicle()
}
function backToBoard(){
const just=currentMission;currentMission=null;resetTransientEffects();
if(just){const next=missions[missionIndex(just.id)+1];if(next&&isUnlocked(next)){selectedMission=next;activeWorld=next.world;saveState()}}
renderBoard();showScreen('boardScreen')
}
function leaveMissionToBoard(){clearPendingTimer();resetTransientEffects();currentMission=null;renderBoard();showScreen('boardScreen')}
function openInfo(){renderData();$('#infoModal').hidden=false;document.body.classList.add('modal-open');$('#closeInfo').focus()}
function closeInfo(){$('#infoModal').hidden=true;document.body.classList.remove('modal-open')}
function renderData(){
if(dataRendered)return;
$('#missionIndex').innerHTML=missions.map((m,i)=>`<article><small>${String(i+1).padStart(2,'0')} / ${worldById.get(m.world)?.name||m.world} / ${difficultyStars(m.difficulty)}</small><strong>${node(m.target).ja}</strong><span>${m.summary}${m.special?` · SPECIAL: ${m.special}`:''}</span></article>`).join('');
const allSources={...D.sources,...G.sources};
$('#sourceList').innerHTML=Object.values(allSources).map(s=>`<a href="${s.url}" target="_blank" rel="noreferrer"><span>TIER ${s.tier}</span><strong>${s.org}</strong><small>${s.title}</small><b>↗</b></a>`).join('');
dataRendered=true
}
function resetProgress(){if(!confirm('クリア状況と車両アンロックをリセットしますか？'))return;state.completed=[];state.best={};state.vehicle='coupe';selectedMission=missions[0];activeWorld=selectedMission.world;saveState();renderBoard()}
function switchVehicle(){if(!allClear())return;state.vehicle=state.vehicle==='coupe'?'truck':'coupe';saveState();renderBoardVehicle()}
function ensureAudio(){if(!state.sound)return null;if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=new AC()}if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx}
function beep(freq,dur=.08,when=0,type='square',vol=.035){const c=ensureAudio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,c.currentTime+when);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+when+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+when);o.stop(c.currentTime+when+dur)}
function playTone(kind){if(!state.sound)return;if(kind==='correct'){beep(523,.08);beep(659,.08,.08);beep(784,.12,.16)}else if(kind==='wrong'){beep(180,.16,0,'sawtooth',.025);beep(130,.18,.12,'square',.025)}else if(kind==='clear'){[523,659,784,1047].forEach((f,i)=>beep(f,.13,i*.1))}else beep(330,.06)}
function toggleSound(){
state.sound=!state.sound;saveState();renderSound();
if(!state.sound&&audioCtx?.state==='running')audioCtx.suspend().catch(()=>{});else if(state.sound)playTone('start')
}
function renderSound(){const b=$('#soundToggle');b.textContent=state.sound?'SOUND ON':'SOUND OFF';b.setAttribute('aria-pressed',state.sound?'true':'false')}
$('#startMission').addEventListener('click',startMission);$('#leftChoice').addEventListener('click',()=>answer('left'));$('#rightChoice').addEventListener('click',()=>answer('right'));$('#leftControl').addEventListener('click',()=>answer('left'));$('#rightControl').addEventListener('click',()=>answer('right'));$('#quitMission').addEventListener('click',leaveMissionToBoard);$('#backToBoard').addEventListener('click',backToBoard);$('#retryMission').addEventListener('click',startMission);$('#gameOverBoard').addEventListener('click',()=>{$('#gameOver').hidden=true;leaveMissionToBoard()});$('#openInfo').addEventListener('click',openInfo);$('#closeInfo').addEventListener('click',closeInfo);$('#infoModal').addEventListener('click',e=>{if(e.target===$('#infoModal'))closeInfo()});$('#resetProgress').addEventListener('click',resetProgress);$('#vehicleSwitch').addEventListener('click',switchVehicle);$('#soundToggle').addEventListener('click',toggleSound);
document.addEventListener('keydown',e=>{if(!$('#arcadeScreen').hidden&&$('#gameOver').hidden){if(e.key==='ArrowLeft')answer('left');if(e.key==='ArrowRight')answer('right')}if(e.key==='Escape'&&!$('#infoModal').hidden)closeInfo()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&audioCtx?.state==='running')audioCtx.suspend().catch(()=>{})});
const stage=$('#arcadeStage');stage.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0]?.clientX??null},{passive:true});stage.addEventListener('touchend',e=>{if(touchStartX===null)return;const dx=(e.changedTouches[0]?.clientX??touchStartX)-touchStartX;touchStartX=null;if(Math.abs(dx)<46)return;answer(dx<0?'left':'right')},{passive:true});
renderSound();renderBoard();
})();
