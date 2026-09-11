(()=>{
'use strict';
const D=window.RICE_LINEAGE_DATA;
if(!D)return;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const byId=new Map(D.nodes.map(n=>[n.id,n]));
const STORAGE='rice-lineage-arcade-v1';

const missions=[
  {
    id:'yamada-nishiki',target:'yamada-nishiki',region:'HYOGO',summary:'山田錦の親と、その先のルーツを探しに行く。',
    learn:'山田錦は山田穂と短稈渡船の交配から生まれた。短稈渡船は雄町から株選抜された系統。',
    route:['yamada-ho','tankan-wataribune','omachi'],
    questions:[
      {current:'yamada-nishiki',prompt:'山田錦の親はどっち？',sub:'Find one documented parent.',correct:'yamada-ho',wrong:'gohyakumangoku'},
      {current:'yamada-nishiki',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'tankan-wataribune',wrong:'kikusui'},
      {current:'tankan-wataribune',prompt:'短稈渡船はどこから？',sub:'Which variety was it selected from?',correct:'omachi',wrong:'takane-nishiki'}
    ]
  },
  {
    id:'gohyakumangoku',target:'gohyakumangoku',region:'NIIGATA',summary:'五百万石の両親から、雄町へつながる枝をたどる。',
    learn:'五百万石は菊水と新200号の交配から育成された。菊水は中支旭と雄町を親に持つ。',
    route:['kikusui','shin200','omachi','chushi-asahi'],
    questions:[
      {current:'gohyakumangoku',prompt:'五百万石の親はどっち？',sub:'Find one documented parent.',correct:'kikusui',wrong:'yamada-nishiki'},
      {current:'gohyakumangoku',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'shin200',wrong:'tankan-wataribune'},
      {current:'kikusui',prompt:'菊水の親はどっち？',sub:'Trace one step further back.',correct:'omachi',wrong:'takane-nishiki'},
      {current:'kikusui',prompt:'菊水のもう一人の親は？',sub:'Complete the Kikusui branch.',correct:'chushi-asahi',wrong:'yamada-ho'}
    ]
  },
  {
    id:'koshi-tanrei',target:'koshi-tanrei',region:'NIIGATA',summary:'新潟の越淡麗から、山田錦と五百万石へ分かれる道を走る。',
    learn:'越淡麗は山田錦と五百万石を親に持つ。二つの大きな酒米系統がここで合流する。',
    route:['yamada-nishiki','gohyakumangoku','tankan-wataribune','kikusui'],
    questions:[
      {current:'koshi-tanrei',prompt:'越淡麗の親はどっち？',sub:'Find one documented parent.',correct:'yamada-nishiki',wrong:'miyama-nishiki'},
      {current:'koshi-tanrei',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'gohyakumangoku',wrong:'goriki'},
      {current:'yamada-nishiki',prompt:'山田錦の親へ戻れ！',sub:'Trace the Yamada Nishiki branch.',correct:'tankan-wataribune',wrong:'kikusui'},
      {current:'gohyakumangoku',prompt:'五百万石の親へ戻れ！',sub:'Trace the Gohyakumangoku branch.',correct:'kikusui',wrong:'omachi'}
    ]
  },
  {
    id:'aiyama',target:'aiyama',region:'HYOGO',summary:'愛山から山雄67へ入り、山田錦と雄町の合流点まで戻る。',
    learn:'愛山は愛船117と山雄67を親に持つ。山雄67は山田錦と雄町を親に持つため、愛山は山田錦の直子ではなく子孫。',
    route:['aisen117','yamayu67','yamada-nishiki','omachi'],
    questions:[
      {current:'aiyama',prompt:'愛山の親はどっち？',sub:'Find one documented parent.',correct:'aisen117',wrong:'gohyakumangoku'},
      {current:'aiyama',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'yamayu67',wrong:'miyama-nishiki'},
      {current:'yamayu67',prompt:'山雄67の親はどっち？',sub:'Trace one branch backward.',correct:'yamada-nishiki',wrong:'kikusui'},
      {current:'yamayu67',prompt:'山雄67のもう一人の親は？',sub:'Complete the branch.',correct:'omachi',wrong:'goriki'}
    ]
  },
  {
    id:'hattan-nishiki-1',target:'hattan-nishiki-1',region:'HIROSHIMA',summary:'八反錦1号の二つの親を当てる短距離ステージ。',
    learn:'八反錦1号は八反35号とアキツホを1973年に交配し、1984年に広島県の奨励品種となった。',
    route:['hattan35','akitsuho'],
    questions:[
      {current:'hattan-nishiki-1',prompt:'八反錦1号の親はどっち？',sub:'Find one documented parent.',correct:'hattan35',wrong:'yamada-nishiki'},
      {current:'hattan-nishiki-1',prompt:'もう一人の親はどっち？',sub:'Complete the Hattan Nishiki branch.',correct:'akitsuho',wrong:'gohyakumangoku'}
    ]
  }
];

const mapLayout={
  'omachi':[9,26], 'yamada-ho':[23,13], 'tankan-wataribune':[28,36], 'yamada-nishiki':[47,40],
  'chushi-asahi':[8,63], 'kikusui':[27,66], 'shin200':[16,86], 'gohyakumangoku':[48,74],
  'koshi-tanrei':[75,62], 'yamayu67':[68,39], 'aisen117':[70,16], 'aiyama':[88,29],
  'hattan35':[68,83], 'akitsuho':[86,83], 'hattan-nishiki-1':[80,95]
};
const mapEdges=[
  ['omachi','tankan-wataribune','yamada-nishiki'], ['tankan-wataribune','yamada-nishiki','yamada-nishiki'], ['yamada-ho','yamada-nishiki','yamada-nishiki'],
  ['chushi-asahi','kikusui','gohyakumangoku'], ['omachi','kikusui','gohyakumangoku'], ['kikusui','gohyakumangoku','gohyakumangoku'], ['shin200','gohyakumangoku','gohyakumangoku'],
  ['yamada-nishiki','koshi-tanrei','koshi-tanrei'], ['gohyakumangoku','koshi-tanrei','koshi-tanrei'],
  ['yamada-nishiki','yamayu67','aiyama'], ['omachi','yamayu67','aiyama'], ['yamayu67','aiyama','aiyama'], ['aisen117','aiyama','aiyama'],
  ['hattan35','hattan-nishiki-1','hattan-nishiki-1'], ['akitsuho','hattan-nishiki-1','hattan-nishiki-1']
];
const state=loadState();
let selectedMission=missions.find(m=>m.id===state.selected)||missions[0];
let currentMission=null,qIndex=0,hearts=3,score=0,combo=0,choices=[],answerLocked=false,touchStartX=null,audioCtx=null;

function loadState(){try{const raw=JSON.parse(localStorage.getItem(STORAGE)||'{}');return{completed:Array.isArray(raw.completed)?raw.completed:[],best:raw.best||{},vehicle:raw.vehicle||'coupe',selected:raw.selected||missions[0].id,sound:raw.sound!==false}}catch{return{completed:[],best:{},vehicle:'coupe',selected:missions[0].id,sound:true}}}
function saveState(){state.selected=selectedMission.id;localStorage.setItem(STORAGE,JSON.stringify(state))}
function node(id){return byId.get(id)||{id,ja:id,en:id.toUpperCase(),region:'—'}}
function missionIndex(id){return missions.findIndex(m=>m.id===id)}
function isUnlocked(m){const i=missionIndex(m.id);return i===0||state.completed.includes(missions[i-1].id)||state.completed.includes(m.id)}
function allClear(){return missions.every(m=>state.completed.includes(m.id))}
function formatScore(n){return String(Math.max(0,n)).padStart(4,'0')}

function showScreen(which){['boardScreen','arcadeScreen','clearScreen'].forEach(id=>{const el=$('#'+id);const active=id===which;el.hidden=!active;el.classList.toggle('is-active',active)});window.scrollTo(0,0)}

function vehicleSVG(type=state.vehicle){
  if(type==='truck')return `<svg viewBox="0 0 92 56" shape-rendering="crispEdges" aria-hidden="true"><g class="truck-sprite"><rect x="18" y="8" width="48" height="30" rx="2"/><rect x="12" y="24" width="68" height="18"/><rect class="glass" x="24" y="12" width="34" height="12"/><rect class="bumper" x="8" y="40" width="76" height="6"/><rect class="lamp" x="17" y="30" width="10" height="7"/><rect class="lamp" x="65" y="30" width="10" height="7"/><rect class="plate" x="35" y="32" width="22" height="8"/><rect class="wheel" x="18" y="45" width="13" height="8"/><rect class="wheel" x="61" y="45" width="13" height="8"/></g></svg>`;
  return `<svg viewBox="0 0 108 52" shape-rendering="crispEdges" aria-hidden="true"><g class="coupe-sprite"><path d="M20 34h5l7-17h44l10 17h6v11H16V34z"/><path class="glass" d="M37 19h34l8 14H29z"/><rect class="bumper" x="13" y="39" width="82" height="7"/><rect class="lamp" x="24" y="32" width="12" height="8"/><rect class="lamp" x="72" y="32" width="12" height="8"/><rect class="plate" x="45" y="35" width="20" height="7"/><rect class="wheel" x="22" y="45" width="14" height="6"/><rect class="wheel" x="72" y="45" width="14" height="6"/></g></svg>`
}
function renderVehicles(){['vehicleMini','vehicleLarge','clearVehicle'].forEach(id=>{const el=$('#'+id);if(el)el.innerHTML=vehicleSVG()});$('#vehicleName').textContent=state.vehicle==='truck'?'NEON KEI TRUCK':'LINEAGE COUPE';const sw=$('#vehicleSwitch');sw.hidden=!allClear();sw.textContent=state.vehicle==='truck'?'COUPEへ':'軽トラへ'}

function renderBoard(){
  $('#boardProgress').textContent=`${state.completed.length} / ${missions.length}`;
  const nodesBox=$('#boardNodes');nodesBox.innerHTML='';
  Object.entries(mapLayout).forEach(([id,[x,y]])=>{
    const n=node(id),m=missions.find(v=>v.target===id),isTarget=!!m,unlocked=m?isUnlocked(m):true,done=m?state.completed.includes(m.id):false;
    const b=document.createElement(isTarget?'button':'div');b.className=`map-node ${isTarget?'target':'support'} ${done?'done':''} ${isTarget&&!unlocked?'locked':''}`;b.style.left=x+'%';b.style.top=y+'%';b.dataset.id=id;
    b.innerHTML=`<span class="grain"></span><strong>${n.ja}</strong><small>${n.en}</small>${isTarget?`<i>${done?'CLEAR':unlocked?'DRIVE':'LOCK'}</i>`:''}`;
    if(isTarget){b.type='button';b.disabled=!unlocked;b.addEventListener('click',()=>selectMission(m.id))}
    nodesBox.append(b)
  });
  const svg=$('#boardLines');svg.innerHTML='';
  mapEdges.forEach(([a,b,owner])=>{const pa=mapLayout[a],pb=mapLayout[b];if(!pa||!pb)return;const done=state.completed.includes(owner);const ownerMission=missions.find(m=>m.id===owner);const unlocked=ownerMission?isUnlocked(ownerMission):true;const p=document.createElementNS('http://www.w3.org/2000/svg','path');const x1=pa[0]*10,y1=pa[1]*6.5,x2=pb[0]*10,y2=pb[1]*6.5,mid=(y1+y2)/2;p.setAttribute('d',`M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`);p.setAttribute('class',`board-edge ${done?'done':unlocked?'ready':'locked'}`);svg.append(p)});
  if(allClear())$('#paperBoard').classList.add('all-clear');else $('#paperBoard').classList.remove('all-clear');
  renderDock();renderVehicles();
}
function selectMission(id){const m=missions.find(v=>v.id===id);if(!m||!isUnlocked(m))return;selectedMission=m;saveState();renderDock();$$('.map-node.target').forEach(el=>el.classList.toggle('selected',el.dataset.id===m.target))}
function renderDock(){
  const m=selectedMission,i=missionIndex(m.id),done=state.completed.includes(m.id),unlocked=isUnlocked(m),n=node(m.target);
  $('#dockNumber').textContent=String(i+1).padStart(2,'0');$('#dockTitle').textContent=n.ja;$('#dockSummary').textContent=m.summary;$('#dockMeta').textContent=`${m.questions.length} CHECKPOINTS / ${m.region}`;$('#dockStatus').textContent=done?'CLEARED':unlocked?'READY':'LOCKED';$('#dockStatus').className=`status-pill ${done?'done':''}`;const btn=$('#startMission');btn.disabled=!unlocked;btn.querySelector('span').textContent=done?'RUN AGAIN':'START ENGINE';
  $$('.map-node.target').forEach(el=>el.classList.toggle('selected',el.dataset.id===m.target))
}

function startMission(){
  currentMission=selectedMission;qIndex=0;hearts=3;score=0;combo=0;answerLocked=false;$('#gameOver').hidden=true;showScreen('arcadeScreen');renderVehicles();renderQuestion();playTone('start')
}
function renderQuestion(){
  const q=currentMission.questions[qIndex],cur=node(q.current),correct=node(q.correct),wrong=node(q.wrong);
  $('#checkpointNow').textContent=qIndex+1;$('#checkpointTotal').textContent=currentMission.questions.length;$('#scoreValue').textContent=formatScore(score);$('#comboValue').textContent=combo;$('#currentRiceJa').textContent=cur.ja;$('#currentRiceEn').textContent=cur.en;$('#carPlate').textContent=cur.ja+'号';$('#questionKicker').textContent=`CHECKPOINT ${qIndex+1}`;$('#questionText').textContent=q.prompt;$('#questionSub').textContent=q.sub;renderHearts();
  choices=Math.random()>.5?[{...correct,ok:true},{...wrong,ok:false}]:[{...wrong,ok:false},{...correct,ok:true}];setChoice($('#leftChoice'),choices[0]);setChoice($('#rightChoice'),choices[1]);answerLocked=false;$('#feedback').className='feedback';$('#feedback').textContent='';$('#arcadeStage').classList.remove('wrong-flash','correct-flash');$('#vehicleWrap').className='vehicle-wrap';
}
function setChoice(el,n){el.dataset.id=n.id;el.querySelector('strong').textContent=n.ja;el.querySelector('small').textContent=n.en}
function renderHearts(){const row=$('#lifeRow');row.innerHTML='';for(let i=0;i<3;i++){const s=document.createElement('span');s.className=i<hearts?'heart live':'heart';s.textContent='♥';row.append(s)}row.setAttribute('aria-label',`残りハート${hearts}`)}
function answer(side){
  if(answerLocked||!currentMission)return;answerLocked=true;const pick=side==='left'?choices[0]:choices[1],correct=pick.ok;const vw=$('#vehicleWrap');vw.classList.add(side==='left'?'turn-left':'turn-right');
  if(correct){combo++;const gain=100+(combo-1)*20;score+=gain;$('#scoreValue').textContent=formatScore(score);$('#comboValue').textContent=combo;$('#arcadeStage').classList.add('correct-flash');const f=$('#feedback');f.textContent=`GOOD! +${gain}`;f.className='feedback show good';playTone('correct');setTimeout(()=>{qIndex++;if(qIndex>=currentMission.questions.length)finishMission();else renderQuestion()},720)}
  else{combo=0;hearts--;score=Math.max(0,score-50);$('#scoreValue').textContent=formatScore(score);$('#comboValue').textContent=combo;renderHearts();$('#arcadeStage').classList.add('wrong-flash');const f=$('#feedback');f.textContent='WRONG WAY! -1 ♥';f.className='feedback show bad';playTone('wrong');setTimeout(()=>{if(hearts<=0){$('#gameOver').hidden=false;answerLocked=false}else{answerLocked=false;$('#vehicleWrap').className='vehicle-wrap';$('#arcadeStage').classList.remove('wrong-flash');f.className='feedback';f.textContent=''}},650)}
}
function finishMission(){
  const m=currentMission;const wasDone=state.completed.includes(m.id);if(!wasDone)state.completed.push(m.id);state.best[m.id]=Math.max(state.best[m.id]||0,score);saveState();renderClear(m,score);playTone('clear');showScreen('clearScreen')
}
function renderClear(m,missionScore){
  const target=node(m.target);$('#rewardScore').textContent='+'+missionScore;$('#learnTitle').textContent=target.ja;$('#learnText').textContent=m.learn;$('#cardName').textContent=target.ja;const route=$('#clearRoute');route.innerHTML=`<span class="route-child"><strong>${target.ja}</strong><small>${target.en}</small></span><b>← ROOTS ←</b><div>${m.route.slice(0,4).map(id=>`<span><strong>${node(id).ja}</strong><small>${node(id).en}</small></span>`).join('')}</div>`;renderVehicles();
}
function backToBoard(){const just=currentMission;currentMission=null;renderBoard();if(just){const i=missionIndex(just.id),next=missions[i+1];if(next&&isUnlocked(next))selectMission(next.id)}showScreen('boardScreen')}

function openInfo(){renderData();$('#infoModal').hidden=false;document.body.classList.add('modal-open');$('#closeInfo').focus()}
function closeInfo(){$('#infoModal').hidden=true;document.body.classList.remove('modal-open')}
function renderData(){
  $('#missionIndex').innerHTML=missions.map((m,i)=>`<article><small>${String(i+1).padStart(2,'0')} / ${m.region}</small><strong>${node(m.target).ja}</strong><span>${m.summary}</span></article>`).join('');
  $('#sourceList').innerHTML=Object.values(D.sources).map(s=>`<a href="${s.url}" target="_blank" rel="noreferrer"><span>TIER ${s.tier}</span><strong>${s.org}</strong><small>${s.title}</small><b>↗</b></a>`).join('')
}
function resetProgress(){if(!confirm('クリア状況と車両アンロックをリセットしますか？'))return;state.completed=[];state.best={};state.vehicle='coupe';selectedMission=missions[0];saveState();renderBoard()}
function switchVehicle(){if(!allClear())return;state.vehicle=state.vehicle==='coupe'?'truck':'coupe';saveState();renderVehicles()}

function ensureAudio(){if(!state.sound)return null;if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=new AC()}if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}
function beep(freq,dur=.08,when=0,type='square',vol=.035){const c=ensureAudio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,c.currentTime+when);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+when+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+when);o.stop(c.currentTime+when+dur)}
function playTone(kind){if(!state.sound)return;if(kind==='correct'){beep(523,.08);beep(659,.08,.08);beep(784,.12,.16)}else if(kind==='wrong'){beep(180,.16,0,'sawtooth',.025);beep(130,.18,.12,'square',.025)}else if(kind==='clear'){[523,659,784,1047].forEach((f,i)=>beep(f,.13,i*.1))}else beep(330,.06)}
function toggleSound(){state.sound=!state.sound;saveState();renderSound();if(state.sound)playTone('start')}
function renderSound(){const b=$('#soundToggle');b.textContent=state.sound?'SOUND ON':'SOUND OFF';b.setAttribute('aria-pressed',state.sound?'true':'false')}

$('#startMission').addEventListener('click',startMission);$('#leftChoice').addEventListener('click',()=>answer('left'));$('#rightChoice').addEventListener('click',()=>answer('right'));$('#leftControl').addEventListener('click',()=>answer('left'));$('#rightControl').addEventListener('click',()=>answer('right'));$('#quitMission').addEventListener('click',()=>{currentMission=null;renderBoard();showScreen('boardScreen')});$('#backToBoard').addEventListener('click',backToBoard);$('#retryMission').addEventListener('click',startMission);$('#gameOverBoard').addEventListener('click',()=>{$('#gameOver').hidden=true;currentMission=null;renderBoard();showScreen('boardScreen')});$('#openInfo').addEventListener('click',openInfo);$('#closeInfo').addEventListener('click',closeInfo);$('#infoModal').addEventListener('click',e=>{if(e.target===$('#infoModal'))closeInfo()});$('#resetProgress').addEventListener('click',resetProgress);$('#vehicleSwitch').addEventListener('click',switchVehicle);$('#soundToggle').addEventListener('click',toggleSound);

document.addEventListener('keydown',e=>{if(!$('#arcadeScreen').hidden && $('#gameOver').hidden){if(e.key==='ArrowLeft')answer('left');if(e.key==='ArrowRight')answer('right')}if(e.key==='Escape'&&!$('#infoModal').hidden)closeInfo()});
const stage=$('#arcadeStage');stage.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0]?.clientX??null},{passive:true});stage.addEventListener('touchend',e=>{if(touchStartX===null)return;const dx=(e.changedTouches[0]?.clientX??touchStartX)-touchStartX;touchStartX=null;if(Math.abs(dx)<46)return;answer(dx<0?'left':'right')},{passive:true});

renderSound();renderBoard();selectMission(selectedMission.id);
})();
