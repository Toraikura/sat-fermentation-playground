(() => {
  const IMAGE_BASE = './assets/aroma-lab/master/';
  const FINE_POINTER = window.matchMedia ? window.matchMedia('(hover:hover) and (pointer:fine)') : {matches:false};

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
    'vanillin':['aroma-vanilla','aroma-oak-barrel'],
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

  function esc(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function aromaImage(slug, label) {
    return `<img class="final-aroma-img" loading="lazy" decoding="async" width="320" height="320" src="${IMAGE_BASE}${slug}.png" alt="${esc(label)}">`;
  }

  function deferredAromaImage(slug, label) {
    return `<img class="final-aroma-img" loading="lazy" decoding="async" width="320" height="320" data-aroma-src="${IMAGE_BASE}${slug}.png" alt="${esc(label)}">`;
  }

  function loadDeferredAromaImages(root) {
    root.querySelectorAll('img[data-aroma-src]').forEach(image => {
      const src = image.dataset.aromaSrc;
      if (!src) return;
      image.loading = 'eager';
      image.decoding = 'async';
      image.setAttribute('fetchpriority', 'high');
      image.src = src;
      delete image.dataset.aromaSrc;
    });
  }

  function applicationLabel(application) {
    const no = String(application.no).padStart(2, '0');
    if (application.drink !== 'wine') return no;
    return `${application.set === 'standard' ? 'S' : 'P'}${no}`;
  }

  function drinkRail(compound) {
    return `<div class="drink-rail final-drink-rail">${['sake','shochu','wine','beer'].map(drink => {
      const refs = compound.apps.filter(item => item.drink === drink);
      const enabled = refs.length > 0;
      return `<button class="drink-ref ${enabled ? 'on' : ''}" data-jump="${drink}" ${enabled ? '' : 'disabled'}><span>${DRINKS[drink].label}</span><strong>${enabled ? refs.map(applicationLabel).join(' / ') : '—'}</strong></button>`;
    }).join('')}</div>`;
  }

  function clearTransientHover(card) {
    card.classList.remove('hover-revealed');
    delete card.dataset.hoverSuppressed;
  }

  function bindHoverState(card) {
    card.addEventListener('pointerenter', () => {
      if (!FINE_POINTER.matches || card.classList.contains('pinned') || card.dataset.hoverSuppressed === '1') return;
      loadDeferredAromaImages(card);
      card.classList.add('hover-revealed');
    });

    const leave = () => clearTransientHover(card);
    card.addEventListener('pointerleave', leave);
    card.addEventListener('pointercancel', leave);
  }

  function bindNewControls(card, compound) {
    card.querySelectorAll('[data-jump]').forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        if (!button.classList.contains('on')) return;
        const drink = button.dataset.jump;
        const id = card.dataset.id;
        state.drink = drink;
        state.family = null;
        if (drink === 'wine') state.wine = 'all';
        render();
        setTimeout(() => {
          const target = document.getElementById(`compound-${id}`);
          if (!target) return;
          clearTransientHover(target);
          loadDeferredAromaImages(target);
          target.scrollIntoView({behavior:'smooth', block:'center'});
          target.classList.add('revealed','pinned');
          target.setAttribute('aria-expanded','true');
          discover(id);
        }, 80);
      };
    });

    const related = card.querySelector('[data-family]');
    if (related) related.onclick = event => {
      event.stopPropagation();
      state.family = related.dataset.family;
      render();
    };

    const structure = card.querySelector('.final-structure img');
    if (structure) structure.onerror = () => {
      structure.style.display = 'none';
      const fallback = card.querySelector('.structure-fallback');
      if (fallback) fallback.style.display = 'grid';
    };

    bindHoverState(card);

    card.addEventListener('click', () => {
      loadDeferredAromaImages(card);
      requestAnimationFrame(() => {
        const revealed = card.classList.contains('revealed');
        card.setAttribute('aria-expanded', String(revealed));

        if (revealed) {
          clearTransientHover(card);
          return;
        }

        card.classList.remove('hover-revealed');
        if (FINE_POINTER.matches && card.matches(':hover')) card.dataset.hoverSuppressed = '1';
        else delete card.dataset.hoverSuppressed;
      });
    });
  }

  function transformCard(card) {
    if (card.dataset.nameFirstReady === '1') return;
    const compound = byId[card.dataset.id];
    if (!compound) return;
    const front = card.querySelector('.front');
    const back = card.querySelector('.back-face');
    if (!front || !back) return;

    card.dataset.nameFirstReady = '1';
    card.setAttribute('aria-label', `${compound.ja}。操作すると香り、構造式、酒をまたぐ情報を表示`);
    card.setAttribute('aria-expanded', 'false');

    const drinks = [...new Set(compound.apps.map(item => item.drink))];
    const cross = drinks.length >= 2;
    const index = state.drink === 'cross' ? 'X' : officialNo(compound);
    const assets = AROMA_BY_COMPOUND[compound.id] || [];

    front.innerHTML = `
      <span class="card-index">${index} / NAME</span>
      ${cross ? `<span class="cross-badge">×${drinks.length} DRINKS</span>` : ''}
      <div class="name-front"><small>AROMA MOLECULE</small><h3>${esc(compound.ja)}</h3><div class="name-front-en">${esc(compound.en)}</div></div>
      <div class="name-front-foot"><span>${esc(compound.family)}</span><span class="tap-cue"><span class="desktop-only">HOVER</span><span class="mobile-only">TAP</span> ↗</span></div>`;

    back.innerHTML = `
      <div class="reveal-head"><span>${index} / REVEAL</span><span>AROMA → MOLECULE → DRINKS</span></div>
      <div class="reveal-body">
        <section class="reveal-stage aroma-stage"><div class="stage-label">01 / AROMA</div><div class="aroma-stage-images">${assets.slice(0,2).map(slug => deferredAromaImage(slug, compound.aroma)).join('')}</div><div class="aroma-stage-copy"><strong>${esc(compound.aroma)}</strong></div></section>
        <section class="reveal-stage molecule-stage"><div class="stage-label">02 / MOLECULE</div><div class="structure-wrap final-structure"><img loading="lazy" decoding="async" alt="${esc(compound.ja)}の構造式" src="${structureUrl(compound)}"><span class="structure-fallback">2D STRUCTURE<br>NOT LOADED</span></div><div class="molecule-copy"><strong>${esc(compound.ja)}</strong><span>${esc(compound.en)}</span><em>${esc(compound.family)}</em>${compound.note ? `<small>${esc(compound.note)}</small>` : ''}</div></section>
        <section class="reveal-stage drinks-stage"><div class="stage-label">03 / ACROSS DRINKS</div>${drinkRail(compound)}<button class="related" data-family="${esc(compound.family)}">SIMILAR SHAPES / ${esc(compound.family)} ↗</button></section>
      </div>`;

    bindNewControls(card, compound);
  }

  let queued = false;
  function transformAll() {
    queued = false;
    document.querySelectorAll('#cards .card').forEach(transformCard);
  }
  function queueTransform() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(transformAll);
  }

  function buildVisualIndex() {
    if (document.getElementById('aromaVisualIndex')) return;
    const progress = document.querySelector('.progress-panel');
    if (!progress) return;
    const section = document.createElement('details');
    section.id = 'aromaVisualIndex';
    section.className = 'visual-index';
    section.innerHTML = '<summary><span><b>AROMA VISUAL INDEX</b><small>完成版 60種類</small></span><i>OPEN / 60 ↗</i></summary>';
    section.addEventListener('toggle', () => {
      if (!section.open || section.dataset.ready === '1') return;
      section.dataset.ready = '1';
      const grid = document.createElement('div');
      grid.className = 'visual-index-grid';
      grid.innerHTML = VISUAL_INDEX.map(([slug, label], index) => `<figure><span>${String(index + 1).padStart(2,'0')}</span>${aromaImage(slug, label)}<figcaption>${esc(label)}</figcaption></figure>`).join('');
      section.appendChild(grid);
    });
    progress.parentNode.insertBefore(section, progress);
  }

  const cards = document.getElementById('cards');
  if (cards) {
    new MutationObserver(queueTransform).observe(cards, {childList:true, subtree:false});
    transformAll();
  }
  buildVisualIndex();
})();