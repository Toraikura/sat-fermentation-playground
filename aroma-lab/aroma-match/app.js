(() => {
  'use strict';

  const data = window.AROMA_MATCH_DATA;
  if (!data || !Array.isArray(data.compounds)) throw new Error('AROMA_MATCH_DATA is missing');

  const MODE_CONFIG = {
    easy: {label:'EASY', level:'LEVEL 1', roundSize:6, meta:'6 PAIRS / UNIQUE ANSWERS'},
    hard: {label:'HARD', level:'LEVEL 2', roundSize:8, meta:'8 PAIRS / UNIQUE ANSWERS'}
  };

  const ROUND_PRIORITY = {
    easy: {
      all: ['ethyl-acetate','isoamyl-acetate','4vg','dms'],
      sake: ['isoamyl-acetate','ethyl-hexanoate','isovaleraldehyde','dms'],
      shochu: ['isoamyl-acetate','linalool','sotolon','furfural'],
      wine: ['3mh','tdn','ibmp','so2'],
      beer: ['4vg','diacetyl','dms','3mbt'],
      cross: ['isoamyl-acetate','4vg','dms','diacetyl']
    },
    hard: {
      all: ['athp','tdn','dcp26','tca236','dmts','octenol','ibmp','2ap'],
      sake: ['ethanethiol','dmts','tca246','hexanoic-acid','isovaleric-acid','isovaleraldehyde'],
      shochu: ['edmp','furfural','octenol','ethyl-laurate','tca246','dmts'],
      wine: ['athp','tdn','ibmp','so2','4ep','geosmin','h2s','furaneol'],
      beer: ['trans2nonenal','3mbt','dcp26','ethanethiol','isoamyl-alcohol','linalool','diacetyl','4vg'],
      cross: ['ethanethiol','dmts','tca246','isovaleric-acid','linalool','beta-damascenone','acetaldehyde','4vg']
    }
  };

  const filters = Array.isArray(data.filters) && data.filters.length
    ? data.filters
    : [{id:'all',label:'ALL',ja:'全て',count:data.compounds.length}];
  const filterById = new Map(filters.map(filter => [filter.id, filter]));
  const aromaById = new Map(data.aromas.map(aroma => [aroma.id, aroma]));
  const compoundById = new Map(data.compounds.map(compound => [compound.id, compound]));

  const els = {
    board: document.getElementById('matchBoard'),
    compoundColumn: document.getElementById('compoundColumn'),
    aromaColumn: document.getElementById('aromaColumn'),
    layer: document.getElementById('connectionLayer'),
    matchCount: document.getElementById('matchCount'),
    matchTotal: document.getElementById('matchTotal'),
    time: document.getElementById('timeValue'),
    miss: document.getElementById('missValue'),
    live: document.getElementById('liveStatus'),
    newRound: document.getElementById('newRound'),
    flash: document.getElementById('structureFlash'),
    structureImage: document.getElementById('structureImage'),
    structureName: document.getElementById('structureName'),
    result: document.getElementById('resultLayer'),
    resultKicker: document.getElementById('resultKicker'),
    resultTitle: document.getElementById('resultTitle'),
    resultMode: document.getElementById('resultMode'),
    score: document.getElementById('scoreValue'),
    resultTime: document.getElementById('resultTime'),
    resultMiss: document.getElementById('resultMiss'),
    replay: document.getElementById('replayButton'),
    filterStatus: document.getElementById('filterStatus'),
    gameNote: document.getElementById('gameNote'),
    modeMeta: document.getElementById('modeMeta'),
    filterButtons: Array.from(document.querySelectorAll('[data-drink-filter]')),
    modeButtons: Array.from(document.querySelectorAll('[data-game-mode]'))
  };

  const state = {
    filter: 'all',
    mode: 'easy',
    roundIndex: 0,
    round: [],
    leftSelected: null,
    rightSelected: null,
    matched: new Set(),
    misses: 0,
    startedAt: null,
    finishedAt: null,
    timer: null,
    locked: false,
    flashTimer: null
  };

  function shuffle(input) {
    const array = input.slice();
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function roundSize() {
    return MODE_CONFIG[state.mode].roundSize;
  }

  function isInFilter(compound, filterId = state.filter) {
    if (filterId === 'all') return true;
    if (filterId === 'cross') return Boolean(compound.crossDrink);
    return Array.isArray(compound.categories) && compound.categories.includes(filterId);
  }

  function candidatesForFilter(filterId = state.filter) {
    return data.compounds.filter(compound => compound.aromaIds.length > 0 && isInFilter(compound, filterId));
  }

  function canJoinRound(compound, usedAromas) {
    return compound.aromaIds.length > 0 && compound.aromaIds.every(aromaId => !usedAromas.has(aromaId));
  }

  function findUniqueRound(candidates, seed = [], targetSize = roundSize()) {
    const selected = seed.slice(0, targetSize);
    const usedAromas = new Set(selected.flatMap(compound => compound.aromaIds));
    const seedIds = new Set(selected.map(compound => compound.id));
    const pool = shuffle(candidates.filter(compound => !seedIds.has(compound.id)));

    function search(startIndex) {
      if (selected.length === targetSize) return selected.slice();
      const needed = targetSize - selected.length;
      if (pool.length - startIndex < needed) return null;

      for (let i = startIndex; i < pool.length; i += 1) {
        const compound = pool[i];
        if (!canJoinRound(compound, usedAromas)) continue;

        selected.push(compound);
        compound.aromaIds.forEach(aromaId => usedAromas.add(aromaId));
        const result = search(i + 1);
        if (result) return result;
        selected.pop();
        compound.aromaIds.forEach(aromaId => usedAromas.delete(aromaId));
      }
      return null;
    }

    return search(0);
  }

  function chooseRound() {
    const candidates = candidatesForFilter();
    const targetSize = roundSize();
    if (candidates.length < targetSize) {
      throw new Error(`Not enough compounds for ${state.filter}: ${candidates.length}`);
    }

    let round = null;
    if (state.roundIndex === 0) {
      const candidateIds = new Set(candidates.map(compound => compound.id));
      const priorityIds = (ROUND_PRIORITY[state.mode] && ROUND_PRIORITY[state.mode][state.filter]) || [];
      const priority = priorityIds
        .filter(id => candidateIds.has(id))
        .map(id => compoundById.get(id))
        .filter(Boolean)
        .slice(0, targetSize);

      const priorityAromas = new Set();
      const validPriority = priority.every(compound => {
        if (!canJoinRound(compound, priorityAromas)) return false;
        compound.aromaIds.forEach(aromaId => priorityAromas.add(aromaId));
        return true;
      });
      if (validPriority) round = findUniqueRound(candidates, priority, targetSize);
    }

    if (!round) round = findUniqueRound(candidates, [], targetSize);
    if (!round || round.length !== targetSize) {
      throw new Error(`Could not build a unique ${state.mode.toUpperCase()} round for ${state.filter}`);
    }
    return shuffle(round);
  }

  function aromaCardFor(compound) {
    return {
      id: `${state.mode}-${compound.id}`,
      label: compound.aroma,
      aromaIds: compound.aromaIds.slice(),
      acceptedCompoundIds: [compound.id]
    };
  }

  function compactId(id) {
    return /^[0-9]/.test(id) || ['dms','dmts','tdn','ibmp','h2s','so2','athp'].includes(id) ? id.toUpperCase() : '';
  }

  function compoundButton(compound) {
    const alias = compactId(compound.id);
    return `<button type="button" class="match-card compound-card" data-side="left" data-compound-id="${compound.id}" aria-pressed="false">
      <small>${alias || compound.family}</small>
      <strong>${compound.ja}</strong>
      <span>${compound.en}</span>
    </button>`;
  }

  function aromaButton(card) {
    const images = card.aromaIds.slice(0, 2).map(aromaId => aromaById.get(aromaId)).filter(Boolean);
    const imageHtml = images.map(aroma => `<img src="${aroma.image}" alt="${aroma.label}" loading="lazy" decoding="async" width="80" height="80">`).join('');
    return `<button type="button" class="match-card aroma-card" data-side="right" data-aroma-card-id="${card.id}" data-owner-id="${card.acceptedCompoundIds[0]}" aria-pressed="false">
      <span class="aroma-thumb ${images.length > 1 ? 'multi' : ''}">${imageHtml}</span>
      <span class="aroma-copy"><strong>${card.label}</strong><small>AROMA CARD</small></span>
    </button>`;
  }

  function currentFilter() {
    return filterById.get(state.filter) || filterById.get('all') || {id:'all',label:'ALL',ja:'全て',count:data.compounds.length};
  }

  function updateControls() {
    const filter = currentFilter();
    const mode = MODE_CONFIG[state.mode];
    const count = candidatesForFilter().length;

    document.documentElement.style.setProperty('--round-size', String(mode.roundSize));

    els.filterButtons.forEach(button => {
      const active = button.dataset.drinkFilter === state.filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    els.modeButtons.forEach(button => {
      const active = button.dataset.gameMode === state.mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (els.filterStatus) els.filterStatus.textContent = `${filter.label} · ${count}`;
    if (els.modeMeta) els.modeMeta.textContent = mode.meta;
    if (els.matchTotal) els.matchTotal.textContent = String(mode.roundSize);
    if (els.resultKicker) els.resultKicker.textContent = `ROUND CLEAR / ${filter.label}`;
    if (els.resultMode) els.resultMode.textContent = `${mode.level} / ${mode.label}`;
    if (els.resultTitle) els.resultTitle.textContent = `${mode.roundSize} / ${mode.roundSize} MATCHED`;

    if (els.gameNote) {
      const pool = state.filter === 'all' ? '全51化合物' : `${filter.ja}の香り成分`;
      const difficulty = state.mode === 'hard'
        ? `HARDは${mode.roundSize}組。より専門的な成分を優先して出題します。`
        : `EASYは${mode.roundSize}組。香りの答えが重ならない組み合わせです。`;
      els.gameNote.textContent = `${pool}から出題。${difficulty} 構造式は正解時に短く表示します。`;
    }
  }

  function renderRound() {
    state.round = chooseRound();
    state.leftSelected = null;
    state.rightSelected = null;
    state.matched.clear();
    state.misses = 0;
    state.startedAt = null;
    state.finishedAt = null;
    state.locked = false;
    stopClock();
    hideFlash();
    els.result.hidden = true;

    const rightCards = shuffle(state.round.map(aromaCardFor));
    els.compoundColumn.innerHTML = state.round.map(compoundButton).join('');
    els.aromaColumn.innerHTML = rightCards.map(aromaButton).join('');
    els.layer.innerHTML = '';
    updateControls();
    updateStats();

    els.board.querySelectorAll('.match-card').forEach(button => button.addEventListener('click', onCardClick));
    requestAnimationFrame(drawConnections);
    state.roundIndex += 1;
  }

  function setFilter(filterId) {
    if (!filterById.has(filterId) || state.filter === filterId) return;
    state.filter = filterId;
    state.roundIndex = 0;
    renderRound();
    els.live.textContent = `${currentFilter().ja}モードに変更しました。`;
  }

  function setMode(modeId) {
    if (!MODE_CONFIG[modeId] || state.mode === modeId) return;
    state.mode = modeId;
    state.roundIndex = 0;
    renderRound();
    els.live.textContent = `${MODE_CONFIG[modeId].label}に変更しました。`;
  }

  function onCardClick(event) {
    const button = event.currentTarget;
    if (state.locked || button.classList.contains('matched')) return;
    startClock();

    if (button.dataset.side === 'left') selectLeft(button);
    else selectRight(button);

    if (state.leftSelected && state.rightSelected) evaluateSelection();
  }

  function selectLeft(button) {
    clearSelected('left');
    state.leftSelected = button.dataset.compoundId;
    button.classList.add('selected');
    button.setAttribute('aria-pressed','true');
  }

  function selectRight(button) {
    clearSelected('right');
    state.rightSelected = button.dataset.aromaCardId;
    button.classList.add('selected');
    button.setAttribute('aria-pressed','true');
  }

  function clearSelected(side) {
    const selector = side === 'left' ? '.compound-card.selected' : '.aroma-card.selected';
    els.board.querySelectorAll(selector).forEach(button => {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed','false');
    });
    if (side === 'left') state.leftSelected = null;
    else state.rightSelected = null;
  }

  function evaluateSelection() {
    const compound = compoundById.get(state.leftSelected);
    const rightButton = els.aromaColumn.querySelector(`[data-aroma-card-id="${CSS.escape(state.rightSelected)}"]`);
    const isCorrect = compound && rightButton && rightButton.dataset.ownerId === compound.id;

    if (isCorrect) handleCorrect(compound, rightButton);
    else handleWrong();
  }

  function handleCorrect(compound, rightButton) {
    const leftButton = els.compoundColumn.querySelector(`[data-compound-id="${CSS.escape(compound.id)}"]`);
    state.matched.add(compound.id);
    [leftButton,rightButton].forEach(button => {
      button.classList.remove('selected');
      button.classList.add('matched');
      button.setAttribute('aria-pressed','false');
      button.disabled = true;
    });
    state.leftSelected = null;
    state.rightSelected = null;
    els.live.textContent = `正解。${compound.ja} と ${compound.aroma}`;
    showStructure(compound);
    updateStats();
    drawConnections();

    if (state.matched.size === roundSize()) finishRound();
  }

  function handleWrong() {
    state.locked = true;
    state.misses += 1;
    const left = els.compoundColumn.querySelector('.compound-card.selected');
    const right = els.aromaColumn.querySelector('.aroma-card.selected');
    [left,right].forEach(button => button && button.classList.add('wrong'));
    els.live.textContent = '不正解。もう一度選んでください。';
    updateStats();
    window.setTimeout(() => {
      [left,right].forEach(button => button && button.classList.remove('wrong','selected'));
      [left,right].forEach(button => button && button.setAttribute('aria-pressed','false'));
      state.leftSelected = null;
      state.rightSelected = null;
      state.locked = false;
    }, 420);
  }

  function showStructure(compound) {
    window.clearTimeout(state.flashTimer);
    els.structureImage.src = compound.structure;
    els.structureImage.alt = `${compound.ja}の構造式`;
    els.structureName.textContent = compound.ja;
    els.flash.classList.add('show');
    els.flash.setAttribute('aria-hidden','false');
    state.flashTimer = window.setTimeout(hideFlash, 900);
  }

  function hideFlash() {
    window.clearTimeout(state.flashTimer);
    els.flash.classList.remove('show');
    els.flash.setAttribute('aria-hidden','true');
  }

  function startClock() {
    if (state.startedAt !== null) return;
    state.startedAt = performance.now();
    state.timer = window.setInterval(updateStats, 100);
  }

  function stopClock() {
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
  }

  function elapsedSeconds() {
    if (state.startedAt === null) return 0;
    const end = state.finishedAt === null ? performance.now() : state.finishedAt;
    return Math.max(0, (end - state.startedAt) / 1000);
  }

  function updateStats() {
    els.matchCount.textContent = String(state.matched.size);
    els.miss.textContent = String(state.misses);
    els.time.textContent = `${elapsedSeconds().toFixed(1)}s`;
  }

  function finishRound() {
    state.finishedAt = performance.now();
    stopClock();
    updateStats();
    const seconds = elapsedSeconds();
    const base = state.mode === 'hard' ? 1700 : 1200;
    const score = Math.max(100, base - Math.round(seconds * 8) - state.misses * 80);
    window.setTimeout(() => {
      hideFlash();
      els.score.textContent = String(score);
      els.resultTime.textContent = `${seconds.toFixed(1)}s`;
      els.resultMiss.textContent = String(state.misses);
      els.result.hidden = false;
      els.replay.focus();
    }, 940);
  }

  function drawConnections() {
    const boardRect = els.board.getBoundingClientRect();
    if (!boardRect.width || !boardRect.height) return;
    els.layer.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);
    els.layer.setAttribute('preserveAspectRatio','none');

    const paths = [];
    state.matched.forEach(id => {
      const left = els.compoundColumn.querySelector(`[data-compound-id="${CSS.escape(id)}"]`);
      const right = els.aromaColumn.querySelector(`[data-owner-id="${CSS.escape(id)}"]`);
      if (!left || !right) return;
      const l = left.getBoundingClientRect();
      const r = right.getBoundingClientRect();
      const x1 = l.right - boardRect.left;
      const y1 = l.top + l.height / 2 - boardRect.top;
      const x2 = r.left - boardRect.left;
      const y2 = r.top + r.height / 2 - boardRect.top;
      const bend = Math.max(10, (x2 - x1) * .52);
      paths.push(`<path class="connection-path" d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1+bend).toFixed(1)} ${y1.toFixed(1)}, ${(x2-bend).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`);
    });
    els.layer.innerHTML = paths.join('');
  }

  let resizeFrame = null;
  function scheduleDraw() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      drawConnections();
    });
  }

  els.newRound.addEventListener('click', renderRound);
  els.replay.addEventListener('click', renderRound);
  els.filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.drinkFilter)));
  els.modeButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.gameMode)));
  window.addEventListener('resize', scheduleDraw, {passive:true});
  window.addEventListener('orientationchange', scheduleDraw, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.startedAt !== null && state.finishedAt === null) updateStats();
  });

  renderRound();
})();
