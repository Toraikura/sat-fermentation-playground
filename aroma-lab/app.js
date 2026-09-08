const DRINKS={
  sake:{label:'SAKE',ja:'日本酒',title:'日本酒の香り',kicker:'SAKE / 19 STANDARDS',icon:'sakebottle'},
  shochu:{label:'SHOCHU',ja:'焼酎・泡盛',title:'焼酎・泡盛の香り',kicker:'SHOCHU & AWAMORI / 20 STANDARDS',icon:'shochu'},
  wine:{label:'WINE',ja:'ワイン',title:'ワインの香り',kicker:'WINE / STANDARD + PROFESSIONAL',icon:'wine'},
  beer:{label:'BEER',ja:'ビール',title:'ビールの香り',kicker:'BEER / 17 STANDARDS',icon:'beer'},
  cross:{label:'CROSS',ja:'酒をまたぐ',title:'酒をまたぐ同じ分子',kicker:'CROSS-DRINK / SAME MOLECULE, DIFFERENT GLASS'}
};
const ICON_LABEL={banana:'BANANA',apple:'APPLE',greenapple:'GREEN APPLE',rose:'ROSE',violet:'VIOLET',lavender:'LAVENDER',honey:'HONEY',vanilla:'VANILLA',strawberry:'STRAWBERRY',citrus:'CITRUS',passion:'PASSION FRUIT',leaf:'GREEN LEAF',grass:'CUT GRASS',bellpepper:'GREEN PEPPER',onion:'ONION',corn:'CORN',seaweed:'SEAWEED',pickle:'PICKLE',butter:'BUTTER',yogurt:'YOGURT',cheese:'CHEESE',mushroom:'MUSHROOM',earth:'EARTH',rain:'RAIN / SOIL',cork:'CORK',mold:'MOLD',caramel:'CARAMEL',nut:'NUT',toast:'TOAST',smoke:'SMOKE',clove:'CLOVE',popcorn:'POPCORN',rice:'RICE',match:'MATCH',petrol:'PETROL',plastic:'PLASTIC',cardboard:'CARDBOARD',medicine:'MEDICINAL',disinfectant:'DISINFECTANT',vinegar:'VINEGAR',sakebottle:'ALCOHOL',shochu:'SHOCHU',wine:'WINE',beer:'BEER',nailpolish:'NAIL POLISH',marker:'INK / MARKER',soap:'SOAP',oil:'OIL',resin:'RESIN',natto:'NATTO',sweat:'SWEAT',gas:'GAS',egg:'ROTTEN EGG',animal:'ANIMAL',mouse:'MOUSE',skunk:'SKUNK',damppaper:'DAMP PAPER',steam:'MURE / PUNGENT',abstract:'AROMA'};
const C=[];const byId={};
function add(id,ja,en,family,aroma,icons,query=en,note=''){const x={id,ja,en,family,aroma,icons:Array.isArray(icons)?icons:[icons],query,note,apps:[]};C.push(x);byId[id]=x;return x}
function app(id,drink,no,set='main'){byId[id].apps.push({drink,no,set})}
add('ethyl-acetate','酢酸エチル','Ethyl acetate','ESTER','除光液・接着剤様 / エステル',['nailpolish']);
add('isoamyl-acetate','酢酸イソアミル','Isoamyl acetate','ESTER','バナナ / 吟醸香',['banana']);
add('ethyl-hexanoate','カプロン酸エチル','Ethyl hexanoate','ESTER','リンゴ / 吟醸香',['apple'],'ethyl hexanoate');
add('ethanol','エタノール','Ethanol','ALCOHOL','酒類の主成分となるアルコール',['sakebottle']);
add('isoamyl-alcohol','イソアミルアルコール','Isoamyl alcohol','ALCOHOL','インク・マーカー / フーゼル',['marker'],'3-methyl-1-butanol','清酒標準試薬では「高級アルコール」。SDSの実成分を表示。');
add('phenethyl-alcohol','フェネチルアルコール','2-Phenylethanol','ALCOHOL','バラ / 甘い花',['rose'],'2-phenylethanol');
add('acetaldehyde','アセトアルデヒド','Acetaldehyde','ALDEHYDE','青リンゴ・木・草',['greenapple','grass']);
add('isovaleraldehyde','イソバレルアルデヒド','3-Methylbutanal','ALDEHYDE','ムレ香 / 刺激的',['steam'],'3-methylbutanal');
add('4vg','4-ビニルグアイアコール','4-Vinylguaiacol','PHENOL','燻製・香辛料 / クローブ',['smoke','clove'],'4-vinylguaiacol');
add('sotolon','ソトロン','Sotolon','FURANONE','カラメル・熟成の甘さ',['caramel'],'sotolon','清酒標準試薬では「カラメル様」。SDSの実成分を表示。');
add('ethanethiol','エタンチオール','Ethanethiol','SULFUR','玉ねぎ・ガス / 硫黄',['onion','gas'],'ethanethiol','清酒標準試薬では「メルカプタン」。SDSの実成分を表示。');
add('dms','ジメチルスルフィド','Dimethyl sulfide','SULFUR','青海苔・コーンスープ',['seaweed','corn'],'dimethyl sulfide');
add('dmts','ジメチルトリスルフィド','Dimethyl trisulfide','SULFUR','たくあん・漬物',['pickle'],'dimethyl trisulfide','清酒標準試薬では「ポリスルフィド」。SDSの実成分を表示。');
add('tca246','2,4,6-トリクロロアニソール','2,4,6-Trichloroanisole','HALOAROMATIC','カビ・コルク臭',['cork','mold'],'2,4,6-trichloroanisole');
add('diacetyl','ジアセチル','Diacetyl','DIKETONE','発酵バター・ヨーグルト',['butter','yogurt'],'2,3-butanedione');
add('hexanoic-acid','ヘキサン酸','Hexanoic acid','ACID','油・樹脂様',['oil','resin'],'hexanoic acid','清酒標準試薬では「脂肪酸」。SDSの実成分を表示。');
add('acetic-acid','酢酸','Acetic acid','ACID','酢・酸臭',['vinegar']);
add('butyric-acid','酪酸','Butyric acid','ACID','チーズ・銀杏',['cheese'],'butanoic acid');
add('isovaleric-acid','イソ吉草酸','Isovaleric acid','ACID','納豆・汗様',['natto','sweat'],'3-methylbutanoic acid');
add('linalool','リナロール','Linalool','TERPENE ALCOHOL','ラベンダー・フローラル',['lavender']);
add('beta-damascenone','β-ダマセノン','β-Damascenone','NORISOPRENOID','蜂蜜・熟した果実',['honey'],'beta-damascenone');
add('vanillin','バニリン','Vanillin','PHENOLIC ALDEHYDE','バニラ',['vanilla']);
add('edmp','2-エチル-3,5-ジメチルピラジン','2-Ethyl-3,5-dimethylpyrazine','PYRAZINE','ナッツ・ロースト',['nut','toast'],'2-ethyl-3,5-dimethylpyrazine');
add('furfural','フルフラール','Furfural','FURAN ALDEHYDE','煙・トースト',['smoke','toast']);
add('ethyl-laurate','ラウリン酸エチル','Ethyl laurate','ESTER','石鹸様',['soap'],'ethyl dodecanoate');
add('octenol','1-オクテン-3-オール','1-Octen-3-ol','ALCOHOL','キノコ・土',['mushroom','earth'],'1-octen-3-ol');
add('furaneol','4-ヒドロキシ-2,5-ジメチル-3(2H)-フラノン','Furaneol / HDMF','FURANONE','いちご・カラメル',['strawberry','caramel'],'furaneol');
add('ibmp','2-イソブチル-3-メトキシピラジン','IBMP','PYRAZINE','青ピーマン・青い植物',['bellpepper','leaf'],'2-isobutyl-3-methoxypyrazine');
add('3mh','3-メルカプトヘキサノール','3-Mercaptohexan-1-ol / 3MH','SULFUR ALCOHOL','グレープフルーツ・パッションフルーツ',['citrus','passion'],'3-mercaptohexan-1-ol');
add('beta-ionone','β-イオノン','β-Ionone','NORISOPRENOID','スミレ・フローラル',['violet'],'beta-ionone');
add('tdn','1,1,6-トリメチル-1,2-ジヒドロナフタレン','TDN','AROMATIC','灯油・ペトロール様',['petrol'],'1,1,6-trimethyl-1,2-dihydronaphthalene');
add('4vp','4-ビニルフェノール','4-Vinylphenol / 4VP','PHENOL','薬品・フェノール様',['medicine'],'4-vinylphenol');
add('4eg','4-エチルグアヤコール','4-Ethylguaiacol / 4EG','PHENOL','スモーキー・スパイス',['smoke','clove'],'4-ethylguaiacol');
add('2ap','2-アセチル-1-ピロリン','2-Acetyl-1-pyrroline','HETEROCYCLE','ポップコーン・炒った穀物',['popcorn','rice'],'2-acetyl-1-pyrroline');
add('so2','二酸化硫黄','Sulfur dioxide','SULFUR OXIDE','刺激的な硫黄・マッチ様',['match'],'sulfur dioxide');
add('eugenol','オイゲノール','Eugenol','PHENOL','クローブ・スパイス',['clove'],'eugenol');
add('hexadienol','trans,trans-2,4-ヘキサジエノール','trans,trans-2,4-Hexadien-1-ol','ALCOHOL','青い植物・グリーン',['leaf'],'trans,trans-2,4-hexadien-1-ol');
add('cis3hexenol','cis-3-ヘキセノール','cis-3-Hexen-1-ol','ALCOHOL','刈った草・青葉',['grass'],'cis-3-hexen-1-ol');
add('geraniol','ゲラニオール','Geraniol','TERPENE ALCOHOL','バラ・ゼラニウム',['rose']);
add('isobutanol','イソブタノール','Isobutanol','ALCOHOL','フーゼル・アルコール',['sakebottle'],'2-methyl-1-propanol');
add('h2s','硫化水素','Hydrogen sulfide','SULFUR','腐卵・還元臭',['egg'],'hydrogen sulfide','ワイン官能評価標準試薬では欠番。学習用リファレンスとして表示。');
add('4ep','4-エチルフェノール','4-Ethylphenol / 4EP','PHENOL','動物・フェノール様',['animal','medicine'],'4-ethylphenol');
add('athp','2-アセチル-3,4,5,6-テトラヒドロピリジン','ATHP','HETEROCYCLE','ネズミ臭・穀物様',['mouse','rice'],'2-acetyl-3,4,5,6-tetrahydropyridine');
add('geosmin','ジオスミン','Geosmin','TERPENOID','土・雨上がり',['earth','rain'],'geosmin');
add('styrene','スチレン','Styrene','AROMATIC','プラスチック・樹脂様',['plastic','resin'],'styrene');
add('guaiacol','グアヤコール','Guaiacol','PHENOL','煙・フェノール',['smoke','medicine'],'guaiacol');
add('tca236','2,3,6-トリクロロアニソール','2,3,6-Trichloroanisole','HALOAROMATIC','カビ・湿った紙様',['mold','damppaper'],'2,3,6-trichloroanisole');
add('3mbt','3-メチル-2-ブテン-1-チオール','3-Methyl-2-buten-1-thiol','SULFUR','日光臭・スカンキー',['skunk'],'3-methyl-2-buten-1-thiol');
add('trans2nonenal','trans-2-ノネナール','trans-2-Nonenal','ALDEHYDE','段ボール・紙・老化臭',['cardboard'],'trans-2-nonenal');
add('citronellol','シトロネロール','Citronellol','TERPENE ALCOHOL','シトラス・バラ',['citrus','rose'],'citronellol');
add('dcp26','2,6-ジクロロフェノール','2,6-Dichlorophenol','HALOPHENOL','薬品・消毒様',['disinfectant'],'2,6-dichlorophenol');
['ethyl-acetate','isoamyl-acetate','ethyl-hexanoate','ethanol','isoamyl-alcohol','phenethyl-alcohol','acetaldehyde','isovaleraldehyde','4vg','sotolon','ethanethiol','dms','dmts','tca246','diacetyl','hexanoic-acid','acetic-acid','butyric-acid','isovaleric-acid'].forEach((id,i)=>app(id,'sake',i+1));
['isoamyl-acetate','ethyl-hexanoate','ethyl-acetate','phenethyl-alcohol','linalool','beta-damascenone','vanillin','sotolon','edmp','furfural','4vg','dmts','acetic-acid','diacetyl','acetaldehyde','isovaleraldehyde','isoamyl-alcohol','ethyl-laurate','octenol','tca246'].forEach((id,i)=>app(id,'shochu',i+1));
['furaneol','ibmp','linalool','3mh','beta-ionone','beta-damascenone','tdn','isoamyl-acetate','isoamyl-alcohol','diacetyl','ethyl-acetate','4vp','4eg','2ap','so2','tca246','eugenol','sotolon'].forEach((id,i)=>app(id,'wine',i+1,'standard'));
['hexadienol','cis3hexenol','geraniol','ethyl-hexanoate','isobutanol','phenethyl-alcohol','h2s','ethanethiol','dms','acetaldehyde','acetic-acid','butyric-acid','isovaleric-acid','4vg','4ep','athp','geosmin','styrene','vanillin','guaiacol'].forEach((id,i)=>app(id,'wine',i+1,'professional'));
['tca236','phenethyl-alcohol','3mbt','4vg','acetaldehyde','butyric-acid','diacetyl','dms','ethyl-acetate','ethyl-hexanoate','trans2nonenal','citronellol','geraniol','linalool','dcp26','ethanethiol','isoamyl-alcohol'].forEach((id,i)=>app(id,'beer',i+1));
const state={drink:'sake',wine:'standard',family:null,hints:false};
const discovered=new Set(JSON.parse(localStorage.getItem('sat-aroma-discovered')||'[]'));
const tabsEl=document.getElementById('tabs'),cardsEl=document.getElementById('cards'),titleEl=document.getElementById('sectionTitle'),kickerEl=document.getElementById('sectionKicker'),wineModes=document.getElementById('wineModes'),familyBanner=document.getElementById('familyBanner'),familyText=document.getElementById('familyText'),toast=document.getElementById('toast');
const crossMolecules=C.filter(c=>new Set(c.apps.map(a=>a.drink)).size>=2);
function structureUrl(c){return 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+encodeURIComponent(c.query)+'/PNG?record_type=2d'}
function categories(c){return [...new Set(c.apps.map(a=>a.drink))]}
function officialNo(c){const a=c.apps.find(a=>a.drink===state.drink&&(state.drink!=='wine'||state.wine==='all'||a.set===state.wine));return a?String(a.no).padStart(2,'0'):'--'}
function getVisible(){let arr;if(state.drink==='cross'){arr=crossMolecules.slice().sort((a,b)=>categories(b).length-categories(a).length||a.ja.localeCompare(b.ja,'ja'))}else{arr=C.filter(c=>c.apps.some(a=>a.drink===state.drink&&(state.drink!=='wine'||state.wine==='all'||a.set===state.wine)))}if(state.family)arr=arr.filter(c=>c.family===state.family);return arr}
function renderTabs(){const defs=[['sake','SAKE','日本酒','19'],['shochu','SHOCHU','焼酎・泡盛','20'],['wine','WINE','ワイン','18 + 20'],['beer','BEER','ビール','17'],['cross','CROSS-DRINK','酒をまたぐ',String(crossMolecules.length)]];tabsEl.innerHTML=defs.map(([id,en,ja,n])=>`<button class="tab ${id==='cross'?'cross-tab':''} ${state.drink===id?'active':''}" data-tab="${id}">${en}<small>${ja} · ${n}</small></button>`).join('');tabsEl.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{state.drink=b.dataset.tab;state.family=null;render()})}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function iconHtml(name){const label=ICON_LABEL[name]||name.toUpperCase();return `<div class="pico-item"><svg class="pico" viewBox="0 0 100 100" aria-hidden="true"><use href="./pictograms.svg#p-${escapeHtml(name)}"></use></svg><div class="pico-caption">${escapeHtml(label)}</div></div>`}
function drinkIcon(d){const icon=DRINKS[d].icon;return `<svg viewBox="0 0 100 100" aria-hidden="true"><use href="./pictograms.svg#p-${icon}"></use></svg><span>${DRINKS[d].label}</span>`}
function cardHtml(c){const cats=categories(c),cross=cats.length>=2,watermark=(c.icons.map(i=>ICON_LABEL[i]||i).join(' / ')).toUpperCase();return `<article class="card" tabindex="0" id="compound-${c.id}" data-id="${c.id}" aria-label="香り成分カード。操作すると答えを表示"><div class="card-inner"><div class="face front"><span class="card-index">${state.drink==='cross'?'X':officialNo(c)} / STRUCTURE</span>${cross?`<span class="cross-badge">×${cats.length} DRINKS</span>`:''}<div class="structure-wrap"><img loading="lazy" alt="香気成分の構造式" src="${structureUrl(c)}"><span class="structure-fallback">2D STRUCTURE<br>NOT LOADED</span></div><div class="card-footer"><span class="family-chip">${escapeHtml(c.family)}</span><span class="tap-cue">REVEAL ↗</span></div></div><div class="face back-face"><div class="answer-art">${c.icons.slice(0,2).map(iconHtml).join('')}<div class="watermark">${escapeHtml(watermark)}</div></div><div class="answer-copy"><h3>${escapeHtml(c.ja)}</h3><div class="en">${escapeHtml(c.en)}</div><p class="aroma-cue">${escapeHtml(c.aroma)}</p>${c.note?`<div class="ref-note">${escapeHtml(c.note)}</div>`:''}<div class="drink-rail">${['sake','shochu','wine','beer'].map(d=>`<button class="drink-dot ${cats.includes(d)?'on':''}" data-jump="${d}" ${cats.includes(d)?'':'disabled'}>${drinkIcon(d)}</button>`).join('')}</div><button class="related" data-family="${escapeHtml(c.family)}">SIMILAR SHAPES / ${escapeHtml(c.family)} ↗</button></div></div></div></article>`}
function renderCards(){const arr=getVisible();cardsEl.innerHTML=arr.length?arr.map(cardHtml).join(''):'<div class="empty">NO MOLECULES IN THIS FILTER</div>';document.getElementById('visibleCount').textContent=arr.length;cardsEl.querySelectorAll('.card').forEach(card=>{const id=card.dataset.id;const img=card.querySelector('.structure-wrap img');img.onerror=()=>{img.style.display='none';card.querySelector('.structure-fallback').style.display='grid'};card.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches)discover(id)});card.addEventListener('click',e=>{if(e.target.closest('button'))return;card.classList.toggle('revealed');card.classList.toggle('pinned',card.classList.contains('revealed'));if(card.classList.contains('revealed'))discover(id)});card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();card.click()}})});cardsEl.querySelectorAll('[data-jump]').forEach(b=>b.onclick=e=>{e.stopPropagation();const card=b.closest('.card'),id=card.dataset.id,d=b.dataset.jump;if(!b.classList.contains('on'))return;state.drink=d;state.family=null;if(d==='wine')state.wine='all';render();setTimeout(()=>{const target=document.getElementById('compound-'+id);if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.classList.add('revealed','pinned');discover(id)}},60)});cardsEl.querySelectorAll('[data-family]').forEach(b=>b.onclick=e=>{e.stopPropagation();state.family=b.dataset.family;render()})}
function renderHead(){const d=DRINKS[state.drink];titleEl.textContent=d.title;kickerEl.textContent=d.kicker;wineModes.classList.toggle('show',state.drink==='wine');document.querySelectorAll('.wine-mode').forEach(b=>b.classList.toggle('active',b.dataset.wine===state.wine));familyBanner.classList.toggle('show',!!state.family);if(state.family)familyText.textContent='STRUCTURAL FAMILY FILTER / '+state.family}
function renderProgress(){document.getElementById('discoveredMini').textContent=discovered.size;const found=crossMolecules.filter(c=>discovered.has(c.id)).length;document.getElementById('crossFound').textContent=found;document.getElementById('crossTotal').textContent=crossMolecules.length;document.getElementById('meterBar').style.width=(crossMolecules.length?found/crossMolecules.length*100:0)+'%'}
function discover(id){if(discovered.has(id))return;discovered.add(id);localStorage.setItem('sat-aroma-discovered',JSON.stringify([...discovered]));renderProgress();const c=byId[id],n=categories(c).length;if(n>=2)showToast('CROSS-DRINK FOUND · '+n+' DRINKS')}
let toastTimer;function showToast(t){toast.textContent=t;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1700)}
function render(){renderTabs();renderHead();renderCards();renderProgress()}
document.querySelectorAll('.wine-mode').forEach(b=>b.onclick=()=>{state.wine=b.dataset.wine;state.family=null;render()});
document.getElementById('hintToggle').onclick=e=>{state.hints=!state.hints;document.body.classList.toggle('show-hints',state.hints);e.currentTarget.textContent='CHEMISTRY HINT: '+(state.hints?'ON':'OFF');e.currentTarget.classList.toggle('active',state.hints)};
document.getElementById('clearFamily').onclick=()=>{state.family=null;render()};
document.getElementById('resetProgress').onclick=()=>{discovered.clear();localStorage.removeItem('sat-aroma-discovered');renderProgress();showToast('DISCOVERY LOG RESET')};
render();
