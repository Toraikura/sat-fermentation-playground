'use strict';

const ASSET_BASE = './assets/aroma-lab/web/';

const DRINKS = {
  sake:   {label:'SAKE',   ja:'日本酒',     title:'日本酒の香り',       kicker:'SAKE / 19 STANDARDS'},
  shochu: {label:'SHOCHU', ja:'焼酎・泡盛', title:'焼酎・泡盛の香り',   kicker:'SHOCHU & AWAMORI / 20 STANDARDS'},
  wine:   {label:'WINE',   ja:'ワイン',     title:'ワインの香り',       kicker:'WINE / STANDARD + PROFESSIONAL'},
  beer:   {label:'BEER',   ja:'ビール',     title:'ビールの香り',       kicker:'BEER / 17 STANDARDS'},
  cross:  {label:'CROSS',  ja:'酒をまたぐ', title:'酒をまたぐ同じ分子', kicker:'CROSS-DRINK / SAME MOLECULE, DIFFERENT GLASS'}
};

const AROMA_VISUALS = {
  alcohol:        ['aroma-alcohol-sake.webp','酒・アルコール'],
  seaweed:        ['aroma-aonori.webp','青海苔'],
  greenapple:     ['aroma-apple-green.webp','青リンゴ'],
  apple:          ['aroma-apple-red.webp','リンゴ'],
  banana:         ['aroma-banana.webp','バナナ'],
  cabbage:        ['aroma-cabbage.webp','キャベツ'],
  caramel:        ['aroma-caramel.webp','カラメル'],
  cardboard:      ['aroma-cardboard-old-paper.webp','段ボール・古紙'],
  cheese:         ['aroma-cheese.webp','チーズ'],
  clove:          ['aroma-clove.webp','クローブ'],
  oil:            ['aroma-cooking-oil.webp','油'],
  cork:           ['aroma-cork.webp','コルク'],
  cornsoup:       ['aroma-corn-soup.webp','コーンスープ'],
  corn:           ['aroma-corn.webp','コーン'],
  butter:         ['aroma-fermented-butter.webp','発酵バター'],
  gas:            ['aroma-gas.webp','ガス'],
  ginkgo:         ['aroma-ginkgo-nut.webp','銀杏'],
  glue:           ['aroma-glue-remover.webp','接着剤・除光液'],
  grapefruit:     ['aroma-grapefruit.webp','グレープフルーツ'],
  grass:          ['aroma-grass.webp','草'],
  greenaldehydic: ['aroma-green-aldehydic.webp','青臭い・アルデヒド系'],
  bellpepper:     ['aroma-green-pepper.webp','ピーマン'],
  honey:          ['aroma-honey.webp','蜂蜜'],
  ink:            ['aroma-ink.webp','インク'],
  kerosene:       ['aroma-kerosene.webp','灯油'],
  lavender:       ['aroma-lavender.webp','ラベンダー'],
  match:          ['aroma-match-sulfite.webp','マッチ・亜硫酸'],
  mold:           ['aroma-mold.webp','カビ'],
  mouse:          ['aroma-mouse.webp','ネズミ臭'],
  mureka:         ['aroma-mureka-musty-steam.webp','ムレ香'],
  mushroom:       ['aroma-mushroom.webp','キノコ'],
  natto:          ['aroma-natto.webp','納豆'],
  nut:            ['aroma-nuts.webp','ナッツ'],
  oak:            ['aroma-oak-barrel.webp','オーク樽'],
  onion:          ['aroma-onion.webp','玉ねぎ'],
  phenol:         ['aroma-phenol.webp','フェノール'],
  pickles:        ['aroma-pickles.webp','漬物'],
  plastic:        ['aroma-plastic.webp','プラスチック'],
  resin:          ['aroma-resin.webp','樹脂'],
  rose:           ['aroma-rose.webp','バラ'],
  egg:            ['aroma-rotten-egg.webp','腐った卵'],
  skunk:          ['aroma-skunk.webp','スカンク'],
  smoke:          ['aroma-smoke.webp','煙'],
  smoked:         ['aroma-smoked.webp','燻製'],
  charred:        ['aroma-smoky-charred.webp','焦げ'],
  soap:           ['aroma-soap.webp','石鹸'],
  soil:           ['aroma-soil.webp','土'],
  solvent:        ['aroma-solvent.webp','溶剤'],
  spice:          ['aroma-spice.webp','香辛料'],
  animal:         ['aroma-stable-animal.webp','馬小屋・獣臭'],
  strawberry:     ['aroma-strawberry-candy.webp','イチゴキャンディ'],
  sweat:          ['aroma-sweat.webp','汗'],
  sweetflower:    ['aroma-sweet-flower.webp','甘い花'],
  takuan:         ['aroma-takuan.webp','たくあん'],
  vanilla:        ['aroma-vanilla.webp','バニラ'],
  vinegar:        ['aroma-vinegar.webp','酢'],
  violet:         ['aroma-violet.webp','スミレ'],
  marker:         ['aroma-whiteboard-marker.webp','ホワイトボードマーカー'],
  yogurt:         ['aroma-yogurt.webp','ヨーグルト'],
  leaf:           ['aroma-young-green-leaves.webp','青葉']
};

const C = [];
const byId = {};
function add(id, ja, en, family, aroma, visuals, query=en, note='') {
  const item = {id, ja, en, family, aroma, visuals:Array.isArray(visuals)?visuals:[visuals], query, note, apps:[]};
  C.push(item); byId[id] = item; return item;
}
function app(id, drink, no, set='main') { byId[id].apps.push({drink,no,set}); }

add('ethyl-acetate','酢酸エチル','Ethyl acetate','ESTER','除光液・接着剤様 / エステル',['glue','solvent']);
add('isoamyl-acetate','酢酸イソアミル','Isoamyl acetate','ESTER','バナナ / 吟醸香',['banana']);
add('ethyl-hexanoate','カプロン酸エチル','Ethyl hexanoate','ESTER','リンゴ / 吟醸香',['apple'],'ethyl hexanoate');
add('ethanol','エタノール','Ethanol','ALCOHOL','酒類の主成分となるアルコール',['alcohol']);
add('isoamyl-alcohol','イソアミルアルコール','Isoamyl alcohol','ALCOHOL','インク・マーカー / フーゼル',['marker','ink'],'3-methyl-1-butanol','清酒標準試薬では「高級アルコール」。SDS記載の実成分を表示。');
add('phenethyl-alcohol','フェネチルアルコール','2-Phenylethanol','ALCOHOL','バラ / 甘い花',['rose','sweetflower'],'2-phenylethanol');
add('acetaldehyde','アセトアルデヒド','Acetaldehyde','ALDEHYDE','青臭い・青リンゴ / アルデヒド',['greenaldehydic','greenapple']);
add('isovaleraldehyde','イソバレルアルデヒド','3-Methylbutanal','ALDEHYDE','ムレ香 / 刺激的',['mureka'],'3-methylbutanal');
add('4vg','4-ビニルグアイアコール','4-Vinylguaiacol','PHENOL','燻製・香辛料 / クローブ',['smoked','clove','spice'],'4-vinylguaiacol');
add('sotolon','ソトロン','Sotolon','FURANONE','カラメル・熟成の甘さ',['caramel'],'sotolon','清酒標準試薬では「カラメル様」。SDS記載の実成分を表示。');
add('ethanethiol','エタンチオール','Ethanethiol','SULFUR','玉ねぎ・ガス / 硫黄',['onion','gas'],'ethanethiol','清酒標準試薬では「メルカプタン」。SDS記載の実成分を表示。');
add('dms','ジメチルスルフィド','Dimethyl sulfide','SULFUR','青海苔・コーンスープ',['seaweed','cornsoup'],'dimethyl sulfide');
add('dmts','ジメチルトリスルフィド','Dimethyl trisulfide','SULFUR','たくあん・漬物',['takuan','pickles'],'dimethyl trisulfide','清酒標準試薬では「ポリスルフィド」。SDS記載の実成分を表示。');
add('tca246','2,4,6-トリクロロアニソール','2,4,6-Trichloroanisole','HALOAROMATIC','カビ・コルク臭',['mold','cork'],'2,4,6-trichloroanisole');
add('diacetyl','ジアセチル','Diacetyl','DIKETONE','発酵バター・ヨーグルト',['butter','yogurt'],'2,3-butanedione');
add('hexanoic-acid','ヘキサン酸','Hexanoic acid','ACID','油・樹脂様',['oil','resin'],'hexanoic acid','清酒標準試薬では「脂肪酸」。SDS記載の実成分を表示。');
add('acetic-acid','酢酸','Acetic acid','ACID','酢・酸臭',['vinegar']);
add('butyric-acid','酪酸','Butyric acid','ACID','チーズ・銀杏',['cheese','ginkgo'],'butanoic acid');
add('isovaleric-acid','イソ吉草酸','Isovaleric acid','ACID','納豆・汗様',['natto','sweat'],'3-methylbutanoic acid');
add('linalool','リナロール','Linalool','TERPENE ALCOHOL','ラベンダー・フローラル',['lavender']);
add('beta-damascenone','β-ダマセノン','β-Damascenone','NORISOPRENOID','蜂蜜・熟した果実',['honey'],'beta-damascenone');
add('vanillin','バニリン','Vanillin','PHENOLIC ALDEHYDE','バニラ',['vanilla']);
add('edmp','2-エチル-3,5-ジメチルピラジン','2-Ethyl-3,5-dimethylpyrazine','PYRAZINE','ナッツ・ロースト',['nut','charred'],'2-ethyl-3,5-dimethylpyrazine');
add('furfural','フルフラール','Furfural','FURAN ALDEHYDE','煙・トースト / 焦げ',['smoke','charred']);
add('ethyl-laurate','ラウリン酸エチル','Ethyl laurate','ESTER','石鹸様',['soap'],'ethyl dodecanoate');
add('octenol','1-オクテン-3-オール','1-Octen-3-ol','ALCOHOL','キノコ・土',['mushroom','soil'],'1-octen-3-ol');
add('furaneol','4-ヒドロキシ-2,5-ジメチル-3(2H)-フラノン','Furaneol / HDMF','FURANONE','イチゴキャンディ・カラメル',['strawberry','caramel'],'furaneol');
add('ibmp','2-イソブチル-3-メトキシピラジン','IBMP','PYRAZINE','青ピーマン・青い植物',['bellpepper','leaf'],'2-isobutyl-3-methoxypyrazine');
add('3mh','3-メルカプトヘキサノール','3-Mercaptohexan-1-ol / 3MH','SULFUR ALCOHOL','グレープフルーツ・パッションフルーツ',['grapefruit'],'3-mercaptohexan-1-ol');
add('beta-ionone','β-イオノン','β-Ionone','NORISOPRENOID','スミレ・フローラル',['violet'],'beta-ionone');
add('tdn','1,1,6-トリメチル-1,2-ジヒドロナフタレン','TDN','AROMATIC','灯油・ペトロール様',['kerosene'],'1,1,6-trimethyl-1,2-dihydronaphthalene');
add('4vp','4-ビニルフェノール','4-Vinylphenol / 4VP','PHENOL','薬品・フェノール様',['phenol'],'4-vinylphenol');
add('4eg','4-エチルグアヤコール','4-Ethylguaiacol / 4EG','PHENOL','スモーキー・スパイス',['smoked','spice'],'4-ethylguaiacol');
add('2ap','2-アセチル-1-ピロリン','2-Acetyl-1-pyrroline','HETEROCYCLE','ポップコーン・炒った穀物',['corn'],'2-acetyl-1-pyrroline','専用ポップコーン画像がないため、穀物・加熱香の補助としてコーン画像を使用。');
add('so2','二酸化硫黄','Sulfur dioxide','SULFUR OXIDE','刺激的な硫黄・マッチ様',['match'],'sulfur dioxide');
add('eugenol','オイゲノール','Eugenol','PHENOL','クローブ・香辛料',['clove','spice'],'eugenol');
add('hexadienol','trans,trans-2,4-ヘキサジエノール','trans,trans-2,4-Hexadien-1-ol','ALCOHOL','青い植物・グリーン',['greenaldehydic','leaf'],'trans,trans-2,4-hexadien-1-ol');
add('cis3hexenol','cis-3-ヘキセノール','cis-3-Hexen-1-ol','ALCOHOL','刈った草・青葉',['grass','leaf'],'cis-3-hexen-1-ol');
add('geraniol','ゲラニオール','Geraniol','TERPENE ALCOHOL','バラ・ゼラニウム',['rose']);
add('isobutanol','イソブタノール','Isobutanol','ALCOHOL','フーゼル・アルコール',['alcohol'],'2-methyl-1-propanol');
add('h2s','硫化水素','Hydrogen sulfide','SULFUR','腐卵・還元臭',['egg'],'hydrogen sulfide','ワイン官能評価標準試薬では欠番。学習用リファレンスとして表示。');
add('4ep','4-エチルフェノール','4-Ethylphenol / 4EP','PHENOL','動物・フェノール様',['animal','phenol'],'4-ethylphenol');
add('athp','2-アセチル-3,4,5,6-テトラヒドロピリジン','ATHP','HETEROCYCLE','ネズミ臭・穀物様',['mouse'],'2-acetyl-3,4,5,6-tetrahydropyridine');
add('geosmin','ジオスミン','Geosmin','TERPENOID','土・雨上がり',['soil'],'geosmin');
add('styrene','スチレン','Styrene','AROMATIC','プラスチック・樹脂様',['plastic','resin'],'styrene');
add('guaiacol','グアヤコール','Guaiacol','PHENOL','煙・フェノール',['smoke','phenol'],'guaiacol');
add('tca236','2,3,6-トリクロロアニソール','2,3,6-Trichloroanisole','HALOAROMATIC','カビ・湿った紙様',['mold','cardboard'],'2,3,6-trichloroanisole','専用「湿った紙」画像がないため、段ボール・古紙画像を補助表示。');
add('3mbt','3-メチル-2-ブテン-1-チオール','3-Methyl-2-buten-1-thiol','SULFUR','日光臭・スカンキー',['skunk'],'3-methyl-2-buten-1-thiol');
add('trans2nonenal','trans-2-ノネナール','trans-2-Nonenal','ALDEHYDE','段ボール・古紙 / 老化臭',['cardboard'],'trans-2-nonenal');
add('citronellol','シトロネロール','Citronellol','TERPENE ALCOHOL','シトラス・バラ',['grapefruit','rose'],'citronellol');
add('dcp26','2,6-ジクロロフェノール','2,6-Dichlorophenol','HALOPHENOL','薬品・消毒様',['phenol'],'2,6-dichlorophenol','専用「消毒」画像がないため、フェノール画像を補助表示。');

['ethyl-acetate','isoamyl-acetate','ethyl-hexanoate','ethanol','isoamyl-alcohol','phenethyl-alcohol','acetaldehyde','isovaleraldehyde','4vg','sotolon','ethanethiol','dms','dmts','tca246','diacetyl','hexanoic-acid','acetic-acid','butyric-acid','isovaleric-acid'].forEach((id,i)=>app(id,'sake',i+1));
['isoamyl-acetate','ethyl-hexanoate','ethyl-acetate','phenethyl-alcohol','linalool','beta-damascenone','vanillin','sotolon','edmp','furfural','4vg','dmts','acetic-acid','diacetyl','acetaldehyde','isovaleraldehyde','isoamyl-alcohol','ethyl-laurate','octenol','tca246'].forEach((id,i)=>app(id,'shochu',i+1));
['furaneol','ibmp','linalool','3mh','beta-ionone','beta-damascenone','tdn','isoamyl-acetate','isoamyl-alcohol','diacetyl','ethyl-acetate','4vp','4eg','2ap','so2','tca246','eugenol','sotolon'].forEach((id,i)=>app(id,'wine',i+1,'standard'));
['hexadienol','cis3hexenol','geraniol','ethyl-hexanoate','isobutanol','phenethyl-alcohol','h2s','ethanethiol','dms','acetaldehyde','acetic-acid','butyric-acid','isovaleric-acid','4vg','4ep','athp','geosmin','styrene','vanillin','guaiacol'].forEach((id,i)=>app(id,'wine',i+1,'professional'));
['tca236','phenethyl-alcohol','3mbt','4vg','acetaldehyde','butyric-acid','diacetyl','dms','ethyl-acetate','ethyl-hexanoate','trans2nonenal','citronellol','geraniol','linalool','dcp26','ethanethiol','isoamyl-alcohol'].forEach((id,i)=>app(id,'beer',i+1));

const state = {drink:'sake', wine:'standard', family:null, hints:false};
const storageKey = 'sat-aroma-explored-v2';
const explored = new Set(safeParse(localStorage.getItem(storageKey), []));
const crossMolecules = C.filter(c => new Set(c.apps.map(a=>a.drink)).size >= 2);

const tabsEl = document.getElementById('tabs');
const cardsEl = document.getElementById('cards');
const titleEl = document.getElementById('sectionTitle');
const kickerEl = document.getElementById('sectionKicker');
const wineModesEl = document.getElementById('wineModes');
const familyBannerEl = document.getElementById('familyBanner');
const familyTextEl = document.getElementById('familyText');
const toastEl = document.getElementById('toast');

function safeParse(value, fallback) {
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : fallback; }
  catch (_) { return fallback; }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function structureUrl(c) {
  return 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/' + encodeURIComponent(c.query) + '/PNG?record_type=2d';
}
function categories(c) { return [...new Set(c.apps.map(a=>a.drink))]; }
function officialNo(c) {
  const a = c.apps.find(x => x.drink === state.drink && (state.drink !== 'wine' || state.wine === 'all' || x.set === state.wine));
  return a ? String(a.no).padStart(2,'0') : '--';
}
function getVisible() {
  let list;
  if (state.drink === 'cross') {
    list = crossMolecules.slice().sort((a,b)=>categories(b).length-categories(a).length || a.ja.localeCompare(b.ja,'ja'));
  } else {
    list = C.filter(c => c.apps.some(a => a.drink === state.drink && (state.drink !== 'wine' || state.wine === 'all' || a.set === state.wine)));
  }
  if (state.family) list = list.filter(c => c.family === state.family);
  return list;
}
function aromaImage(visual, compact=false) {
  const item = AROMA_VISUALS[visual];
  if (!item) return '';
  const [file,label] = item;
  return `<figure class="aroma-visual ${compact?'compact':''}"><img src="${ASSET_BASE}${file}" alt="${escapeHtml(label)}" width="160" height="160" loading="lazy" decoding="async"><figcaption>${escapeHtml(label)}</figcaption></figure>`;
}
function renderTabs() {
  const defs = [
    ['sake','SAKE','日本酒','19'],
    ['shochu','SHOCHU','焼酎・泡盛','20'],
    ['wine','WINE','ワイン','18 + 20'],
    ['beer','BEER','ビール','17'],
    ['cross','CROSS-DRINK','酒をまたぐ',String(crossMolecules.length)]
  ];
  tabsEl.innerHTML = defs.map(([id,en,ja,n]) => `<button class="tab ${id==='cross'?'cross-tab':''} ${state.drink===id?'active':''}" type="button" data-tab="${id}" aria-pressed="${state.drink===id}">${en}<small>${ja} · ${n}</small></button>`).join('');
  tabsEl.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => {
    state.drink = btn.dataset.tab; state.family = null; render();
  }));
}
function cardHtml(c) {
  const cats = categories(c);
  const cross = cats.length >= 2;
  const visualHtml = c.visuals.map(v => aromaImage(v)).join('');
  const drinkRail = ['sake','shochu','wine','beer'].map(d => {
    const on = cats.includes(d);
    return `<button class="drink-dot ${on?'on':''}" type="button" data-jump="${d}" ${on?'':'disabled'}>${DRINKS[d].label}<small>${DRINKS[d].ja}</small></button>`;
  }).join('');
  return `<article class="card" id="compound-${c.id}" data-id="${c.id}" tabindex="0" role="button" aria-expanded="false" aria-label="${escapeHtml(c.ja)}。タップすると構造式と酒類の共通性を表示">
    <div class="card-inner">
      <section class="face front">
        <div class="card-topline"><span>${state.drink==='cross'?'CROSS':officialNo(c)} / AROMA</span>${cross?`<span class="cross-badge">×${cats.length} DRINKS</span>`:''}</div>
        <div class="front-copy"><h3>${escapeHtml(c.ja)}</h3><p class="compound-en">${escapeHtml(c.en)}</p><p class="aroma-cue">${escapeHtml(c.aroma)}</p></div>
        <div class="aroma-gallery count-${c.visuals.length}">${visualHtml}</div>
        <div class="card-footer"><span class="family-chip">${escapeHtml(c.family)}</span><span>STRUCTURE ↗</span></div>
      </section>
      <section class="face back-face" aria-hidden="true">
        <div class="structure-head"><span>MOLECULAR STRUCTURE</span><span class="back-family">${escapeHtml(c.family)}</span></div>
        <div class="structure-wrap"><img src="${structureUrl(c)}" alt="${escapeHtml(c.ja)}の構造式" loading="lazy" decoding="async"><div class="structure-fallback">STRUCTURE<br>UNAVAILABLE</div></div>
        <div class="back-copy"><strong>${escapeHtml(c.ja)}</strong><small>${escapeHtml(c.en)}</small>${c.note?`<p class="ref-note">${escapeHtml(c.note)}</p>`:''}<div class="drink-rail">${drinkRail}</div><button class="related" type="button" data-family="${escapeHtml(c.family)}">SIMILAR SHAPES / ${escapeHtml(c.family)} ↗</button></div>
      </section>
    </div>
  </article>`;
}
function renderCards() {
  const list = getVisible();
  cardsEl.innerHTML = list.length ? list.map(cardHtml).join('') : '<div class="empty">NO MOLECULES IN THIS FILTER</div>';
  document.getElementById('visibleCount').textContent = list.length;

  cardsEl.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    const back = card.querySelector('.back-face');
    const structImg = card.querySelector('.structure-wrap img');
    structImg.addEventListener('error', () => { structImg.hidden = true; card.querySelector('.structure-fallback').classList.add('show'); });
    card.querySelectorAll('.aroma-visual img').forEach(img => img.addEventListener('error', () => img.closest('.aroma-visual').classList.add('image-error')));

    const setExpanded = expanded => {
      card.classList.toggle('revealed', expanded);
      card.classList.toggle('pinned', expanded);
      card.setAttribute('aria-expanded', String(expanded));
      back.setAttribute('aria-hidden', String(!expanded));
      if (expanded) explore(id);
    };
    card.addEventListener('click', ev => {
      if (ev.target.closest('button')) return;
      setExpanded(!card.classList.contains('revealed'));
    });
    card.addEventListener('keydown', ev => {
      if ((ev.key === 'Enter' || ev.key === ' ') && !ev.target.closest('button')) { ev.preventDefault(); setExpanded(!card.classList.contains('revealed')); }
    });
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) card.addEventListener('mouseenter', () => explore(id));
  });

  cardsEl.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', ev => {
    ev.stopPropagation();
    if (!btn.classList.contains('on')) return;
    const id = btn.closest('.card').dataset.id;
    state.drink = btn.dataset.jump;
    state.family = null;
    if (state.drink === 'wine') state.wine = 'all';
    render();
    requestAnimationFrame(() => {
      const target = document.getElementById('compound-'+id);
      if (target) { target.scrollIntoView({behavior:'smooth', block:'center'}); target.classList.add('revealed','pinned'); target.setAttribute('aria-expanded','true'); target.querySelector('.back-face').setAttribute('aria-hidden','false'); explore(id); }
    });
  }));
  cardsEl.querySelectorAll('[data-family]').forEach(btn => btn.addEventListener('click', ev => { ev.stopPropagation(); state.family = btn.dataset.family; render(); }));
}
function renderHead() {
  const d = DRINKS[state.drink];
  titleEl.textContent = d.title;
  kickerEl.textContent = d.kicker;
  wineModesEl.classList.toggle('show', state.drink === 'wine');
  document.querySelectorAll('.wine-mode').forEach(btn => btn.classList.toggle('active', btn.dataset.wine === state.wine));
  familyBannerEl.classList.toggle('show', Boolean(state.family));
  if (state.family) familyTextEl.textContent = 'STRUCTURAL FAMILY FILTER / ' + state.family;
}
function renderProgress() {
  document.getElementById('discoveredMini').textContent = explored.size;
  const found = crossMolecules.filter(c=>explored.has(c.id)).length;
  document.getElementById('crossFound').textContent = found;
  document.getElementById('crossTotal').textContent = crossMolecules.length;
  document.getElementById('meterBar').style.width = (crossMolecules.length ? found/crossMolecules.length*100 : 0) + '%';
}
function explore(id) {
  if (explored.has(id)) return;
  explored.add(id);
  localStorage.setItem(storageKey, JSON.stringify([...explored]));
  renderProgress();
  const c = byId[id];
  const n = categories(c).length;
  if (n >= 2) showToast('CROSS-DRINK FOUND · ' + n + ' DRINKS');
}
let toastTimer;
function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 1700);
}
function renderVisualIndex() {
  const entries = Object.values(AROMA_VISUALS).sort((a,b)=>a[1].localeCompare(b[1],'ja'));
  document.getElementById('visualGrid').innerHTML = entries.map(([file,label]) => `<figure class="visual-tile"><img src="${ASSET_BASE}${file}" alt="${escapeHtml(label)}" width="160" height="160" loading="lazy" decoding="async"><figcaption>${escapeHtml(label)}</figcaption></figure>`).join('');
}
function render() { renderTabs(); renderHead(); renderCards(); renderProgress(); }

document.querySelectorAll('.wine-mode').forEach(btn => btn.addEventListener('click', () => { state.wine=btn.dataset.wine; state.family=null; render(); }));
document.getElementById('hintToggle').addEventListener('click', ev => {
  state.hints = !state.hints;
  document.body.classList.toggle('show-hints', state.hints);
  ev.currentTarget.textContent = 'CHEMISTRY HINT: ' + (state.hints?'ON':'OFF');
  ev.currentTarget.setAttribute('aria-pressed', String(state.hints));
  ev.currentTarget.classList.toggle('active', state.hints);
});
document.getElementById('clearFamily').addEventListener('click', () => { state.family=null; render(); });
document.getElementById('resetProgress').addEventListener('click', () => { explored.clear(); localStorage.removeItem(storageKey); renderProgress(); showToast('DISCOVERY LOG RESET'); });

renderVisualIndex();
render();
