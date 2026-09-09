(() => {
  'use strict';

  const data = window.AROMA_MATCH_DATA;
  if (!data || !Array.isArray(data.compounds)) throw new Error('AROMA_MATCH_DATA is missing');

  const ROUND_SIZE = 6;
  const FIRST_ROUND_PRIORITY = ['ethyl-acetate','isoamyl-acetate','4vg','dms'];
  const aromaById = new Map(data.aromas.map(aroma => [aroma.id, aroma]));
  const compoundById = new Map(data.compounds.map(compound => [compound.id, compound]));

  const els = {
    board: document.getElementById('matchBoard'),
    compoundColumn: document.getElementById('compoundColumn'),
    aromaColumn: document.getElementById('aromaColumn'),
    layer: document.getElementById('connectionLayer'),
    matchCount: document.getElementById('matchCount'),
    time: document.getElementById('timeValue'),
    miss: document.getElementById('missValue'),
    live: document.getElementById('liveStatus'),
    newRound: document.getElementById('newRound'),
    flash: document.getElementById('structureFlash'),
    structureImage: document.getElementById('structureImage'),
    structureName: document.getElementById('structureName'),
    result: document.getElementById('resultLayer'),
    score: document.getElementById('scoreValue'),
    resultTime: document.getElementById('resultTime'),
    resultMiss: document.getElementById('resultMiss'),
    replay: document.getElementById('replayButton')
  };

  const state = {
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

  function canJoinRound(compound, usedAromas) {
    return compound.aromaIds.length > 0 && compound.aromaIds.every(aromaId => !usedAromas.has(aromaId));
  }

  function findUniqueRound(candidates, seed = []) {
    const selected = seed.slice();
    const usedAromas = new Set(seed.flatMap(compound => compound.aromaIds));
    const seedIds = new Set(seed.map(compound => compound.id));
    const pool = shuffle(candidates.filter(compound => !seedIds.has(compound.id)));

    function search(startIndex) {
      if (selected.length === ROUND_SIZE) return selected.slice();
      const needed = ROUND_SIZE - selected.length;
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
    const candidates = data.compounds.filter(compound => compound.aromaIds.length > 0);
    let round = null;

    if (state.roundIndex === 0) {
      const priority = FIRST_ROUND_PRIORITY.map(id => compoundById.get(id)).filter(Boolean);
      const priorityAromas = new Set();
      const validPriority = priority.every(compound => {
        if (!canJoinRound(compound, priorityAromas)) return false;
        compound.aromaIds.forEach(aromaId => priorityAromas.add(aromaId));
        return true;
      });
      if (validPriority) round = findUniqueRound(candidates, priority);
    }

    if (!round) round = findUniqueRound(candidates);
    if (!round || round.length !== ROUND_SIZE) throw new Error('Could not build a unique BEGINNER round');
    return shuffle(round);
  }

  function aromaCardFor(compound) {
    return {
      id: `beginner-${compound.id}`,
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
    updateStats();

    els.board.querySelectorAll('.match-card').forEach(button => button.addEventListener('click', onCardClick));
    requestAnimationFrame(drawConnections);
    state.roundIndex += 1;
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

    if (state.matched.size === ROUND_SIZE) finishRound();
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
    const score = Math.max(100, 1200 - Math.round(seconds * 8) - state.misses * 80);
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
  window.addEventListener('resize', scheduleDraw, {passive:true});
  window.addEventListener('orientationchange', scheduleDraw, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.startedAt !== null && state.finishedAt === null) updateStats();
  });

  renderRound();
})();
