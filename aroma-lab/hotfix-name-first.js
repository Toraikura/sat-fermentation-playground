(() => {
  const ASSET_BASE = './assets/aroma-lab/web/';
  const MASTER_BASE = './assets/aroma-lab/master/';

  const AROMA_BY_COMPOUND = {
    'ethyl-acetate':['aroma-glue-remover'],
    'isoamyl-acetate':['aroma-banana'],
    'ethyl-hexanoate':['aroma-apple-red'],
    'ethanol':['aroma-alcohol-sake'],
    'isoamyl-alcohol':['aroma-whiteboard-marker','aroma-ink'],
    'phenethyl-alcohol':['aroma-rose','aroma-sweet-flower'],
    'acetaldehyde':['aroma-apple-green','aroma-green-aldehydic'],
    'isovaleraldehyde':['aroma-mureka-musty-steam'],
    '4vg':['aroma-smoked','aroma-clove'],
    'sotolon':['aroma-caramel'],
    'ethanethiol':['aroma-onion','aroma-gas'],
    'dms':['aroma-aonori','aroma-corn-soup'],
    'dmts':['aroma-takuan','aroma-pickles'],
    'tca246':['aroma-cork','aroma-mold'],
    'diacetyl':['aroma-fermented-butter','aroma-yogurt'],
    'hexanoic-acid':['aroma-cooking-oil','aroma-resin'],
    'acetic-acid':['aroma-vinegar'],
    'butyric-acid':['aroma-cheese','aroma-ginkgo-nut'],
    'isovaleric-acid':['aroma-natto','aroma-sweat'],
    'linalool':['aroma-lavender'],
    'beta-damascenone':['aroma-honey'],
    'vanillin':['aroma-vanilla'],
    'edmp':['aroma-nuts'],
    'furfural':['aroma-smoke','aroma-smoky-charred'],
    'ethyl-laurate':['aroma-soap'],
    'octenol':['aroma-mushroom','aroma-soil'],
    'furaneol':['aroma-strawberry-candy','aroma-caramel'],
    'ibmp':['aroma-green-pepper','aroma-young-green-leaves'],
    '3mh':['aroma-grapefruit'],
    'beta-ionone':['aroma-violet'],
    'tdn':['aroma-kerosene'],
    '4vp':['aroma-phenol'],
    '4eg':['aroma-smoked','aroma-spice'],
    '2ap':['aroma-corn'],
    'so2':['aroma-match-sulfite'],
    'eugenol':['aroma-clove','aroma-spice'],
    'hexadienol':['aroma-green-aldehydic','aroma-young-green-leaves'],
    'cis3hexenol':['aroma-grass','aroma-young-green-leaves'],
    'geraniol':['aroma-rose'],
    'isobutanol':['aroma-alcohol-sake','aroma-solvent'],
    'h2s':['aroma-rotten-egg'],
    '4ep':['aroma-stable-animal','aroma-phenol'],
    'athp':['aroma-mouse'],
    'geosmin':['aroma-soil'],
    'styrene':['aroma-plastic','aroma-resin'],
    'guaiacol':['aroma-smoke','aroma-phenol'],
    'tca236':['aroma-mold','aroma-cardboard-old-paper'],
    '3mbt':['aroma-skunk'],
    'trans2nonenal':['aroma-cardboard-old-paper'],
    'citronellol':['aroma-rose','aroma-grapefruit'],
    'dcp26':['aroma-phenol']
  };

  const VISUAL_INDEX = [
    ['aroma-banana','バナナ'],['aroma-apple-red','リンゴ'],['aroma-apple-green','青リンゴ'],['aroma-strawberry-candy','イチゴキャンディ'],['aroma-grapefruit','グレープフルーツ'],
    ['aroma-rose','バラ'],['aroma-violet','スミレ'],['aroma-lavender','ラベンダー'],['aroma-sweet-flower','甘い花'],['aroma-honey','蜂蜜'],['aroma-vanilla','バニラ'],
    ['aroma-clove','クローブ'],['aroma-spice','香辛料'],['aroma-caramel','カラメル'],['aroma-nuts','ナッツ'],['aroma-fermented-butter','発酵バター'],['aroma-yogurt','ヨーグルト'],['aroma-cheese','チーズ'],['aroma-mushroom','キノコ'],['aroma-ginkgo-nut','銀杏'],['aroma-oak-barrel','オーク樽'],
    ['aroma-grass','草'],['aroma-young-green-leaves','青葉'],['aroma-green-pepper','ピーマン'],['aroma-aonori','青海苔'],['aroma-corn','コーン'],['aroma-corn-soup','コーンスープ'],['aroma-takuan','たくあん'],['aroma-pickles','漬物'],['aroma-natto','納豆'],
    ['aroma-alcohol-sake','酒・アルコール'],['aroma-vinegar','酢'],['aroma-glue-remover','接着剤・除光液系'],['aroma-whiteboard-marker','ホワイトボードマーカー'],['aroma-solvent','溶剤'],['aroma-ink','インク'],['aroma-soap','石鹸'],['aroma-cooking-oil','油'],['aroma-resin','樹脂'],['aroma-plastic','プラスチック'],
    ['aroma-smoke','煙'],['aroma-smoked','燻製'],['aroma-smoky-charred','焦げ'],['aroma-match-sulfite','マッチ・亜硫酸'],['aroma-gas','ガス'],['aroma-onion','玉ねぎ'],['aroma-rotten-egg','腐った卵'],['aroma-mold','カビ'],['aroma-cork','コルク'],['aroma-cardboard-old-paper','段ボール・古紙'],
    ['aroma-kerosene','灯油'],['aroma-phenol','フェノール'],['aroma-green-aldehydic','青臭い・アルデヒド系'],['aroma-mureka-musty-steam','ムレ香'],['aroma-sweat','汗'],['aroma-stable-animal','馬小屋・獣臭'],['aroma-mouse','ネズミ臭'],['aroma-soil','土'],['aroma-skunk','スカンク'],['aroma-cabbage','キャベツ']
  ];

  function esc(s){return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
  function aromaImage(slug,label='香りのイメージ'){
    return `<img class="final-aroma-img" loading="lazy" decoding="async" width="320" height="320" src="${ASSET_BASE}${slug}.webp" data-master="${MASTER_BASE}${slug}.png" alt="${esc(label)}">`;
  }
  function drinkRail(c){
    const cats=[...new Set(c.apps.map(a=>a.drink))];
    return `<div class="drink-rail hotfix-rail">${['sake','shochu','wine','beer'].map(d=>`<button class="drink-dot ${cats.includes(d)?'on':''}" data-jump="${d}" ${cats.includes(d)?'':'disabled'}><span>${DRINKS[d].label}</span></button>`).join('')}</div>`;
  }

  function bindNewControls(card,c){
    card.querySelectorAll('[data-jump]').forEach(b=>b.onclick=e=>{
      e.stopPropagation();
      if(!b.classList.contains('on')) return;
      const d=b.dataset.jump,id=card.dataset.id;
      state.drink=d; state.family=null; if(d==='wine') state.wine='all';
      render();
      setTimeout(()=>{
        const target=document.getElementById('compound-'+id);
        if(target){ target.scrollIntoView({behavior:'smooth',block:'center'}); target.classList.add('revealed','pinned'); discover(id); }
      },80);
    });
    const related=card.querySelector('[data-family]');
    if(related) related.onclick=e=>{e.stopPropagation();state.family=related.dataset.family;render()};
    card.querySelectorAll('.final-aroma-img').forEach(img=>{
      img.onerror=()=>{ if(img.dataset.master && img.src!==new URL(img.dataset.master,location.href).href){ img.src=img.dataset.master; } };
    });
    const structure=card.querySelector('.hotfix-structure img');
    if(structure) structure.onerror=()=>{structure.style.display='none';const f=card.querySelector('.hotfix-structure-fallback');if(f)f.style.display='grid'};
  }

  function transformCard(card){
    if(card.dataset.nameFirstReady==='1') return;
    const c=byId[card.dataset.id];
    if(!c) return;
    card.dataset.nameFirstReady='1';
    card.setAttribute('aria-label',`${c.ja}。操作すると構造式と香りの画像を表示`);
    const cats=[...new Set(c.apps.map(a=>a.drink))],cross=cats.length>=2;
    const idx=state.drink==='cross'?'X':officialNo(c);
    const front=card.querySelector('.front');
    const back=card.querySelector('.back-face');
    if(!front||!back) return;

    front.innerHTML=`
      <span class="card-index">${idx} / NAME</span>
      ${cross?`<span class="cross-badge">×${cats.length} DRINKS</span>`:''}
      <div class="name-front">
        <h3>${esc(c.ja)}</h3>
        <div class="name-front-en">${esc(c.en)}</div>
      </div>
      <div class="name-front-foot"><span>${esc(c.family)}</span><span class="tap-cue"><span class="desktop-only">HOVER</span><span class="mobile-only">TAP</span> ↗</span></div>`;

    const assets=AROMA_BY_COMPOUND[c.id]||[];
    back.innerHTML=`
      <div class="reveal-head"><span>${idx} / AROMA + STRUCTURE</span>${cross?`<span>×${cats.length} DRINKS</span>`:''}</div>
      <div class="reveal-body">
        <div class="aroma-reveal">
          <div class="aroma-reveal-images">${assets.slice(0,2).map(s=>aromaImage(s,c.aroma)).join('')}</div>
          <div class="aroma-reveal-copy"><strong>${esc(c.aroma)}</strong><small>AROMA VISUAL</small></div>
        </div>
        <div class="chem-reveal">
          <div class="hotfix-structure"><img loading="lazy" decoding="async" alt="${esc(c.ja)}の構造式" src="${structureUrl(c)}"><span class="hotfix-structure-fallback">2D STRUCTURE<br>NOT LOADED</span></div>
          <div class="chem-caption"><strong>${esc(c.ja)}</strong><span>${esc(c.en)}</span><em>${esc(c.family)}</em></div>
        </div>
      </div>
      <div class="reveal-actions">${drinkRail(c)}<button class="related" data-family="${esc(c.family)}">SIMILAR SHAPES / ${esc(c.family)} ↗</button></div>`;
    bindNewControls(card,c);
  }

  let queued=false;
  function transformAll(){
    queued=false;
    document.querySelectorAll('#cards .card').forEach(transformCard);
  }
  function queueTransform(){if(queued)return;queued=true;requestAnimationFrame(transformAll)}

  function buildVisualIndex(){
    if(document.getElementById('aromaVisualIndex')) return;
    const progress=document.querySelector('.progress-panel');
    if(!progress) return;
    const section=document.createElement('details');
    section.id='aromaVisualIndex';
    section.className='visual-index';
    section.innerHTML=`<summary><span><b>AROMA VISUAL INDEX</b><small>完成版 60種類</small></span><i>OPEN / 60 ↗</i></summary><div class="visual-index-grid">${VISUAL_INDEX.map(([slug,ja],i)=>`<figure><span>${String(i+1).padStart(2,'0')}</span>${aromaImage(slug,ja)}<figcaption>${esc(ja)}</figcaption></figure>`).join('')}</div>`;
    progress.parentNode.insertBefore(section,progress);
    section.querySelectorAll('.final-aroma-img').forEach(img=>img.onerror=()=>{if(img.dataset.master)img.src=img.dataset.master});
  }

  const cards=document.getElementById('cards');
  if(cards){
    new MutationObserver(queueTransform).observe(cards,{childList:true,subtree:false});
    transformAll();
  }
  buildVisualIndex();
})();
