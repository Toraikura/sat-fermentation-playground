(() => {
  'use strict';

  const MOBILE_DETAIL = window.matchMedia ? window.matchMedia('(max-width:600px)') : { matches:false };
  const cards = document.getElementById('cards');
  if (!cards) return;

  let modal = null;
  let host = null;
  let closeButton = null;
  let activeSource = null;
  let closeTimer = null;

  function ensureModal() {
    if (modal) return;

    modal = document.createElement('div');
    modal.id = 'mobileCardModal';
    modal.className = 'mobile-card-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="mobile-card-dialog" role="dialog" aria-modal="true" aria-label="香り成分の詳細">
        <button class="mobile-card-close" type="button" aria-label="詳細を閉じる">CLOSE ×</button>
        <div class="mobile-card-host"></div>
      </div>`;

    document.body.appendChild(modal);
    host = modal.querySelector('.mobile-card-host');
    closeButton = modal.querySelector('.mobile-card-close');

    closeButton.addEventListener('click', () => closeMobileDetail());
    modal.addEventListener('click', event => {
      if (event.target === modal) closeMobileDetail();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) closeMobileDetail();
    });
  }

  function bindOverlayControls(card, compound) {
    card.querySelectorAll('[data-jump]').forEach(button => {
      button.onclick = event => {
        event.stopPropagation();
        if (!button.classList.contains('on')) return;

        const drink = button.dataset.jump;
        const id = compound.id;
        closeMobileDetail({ restoreFocus:false });
        state.drink = drink;
        state.family = null;
        if (drink === 'wine') state.wine = 'all';
        render();

        window.setTimeout(() => {
          const target = document.getElementById(`compound-${id}`);
          if (!target) return;
          target.scrollIntoView({ behavior:'smooth', block:'center' });
          openMobileDetail(target);
        }, 120);
      };
    });

    const related = card.querySelector('[data-family]');
    if (related) related.onclick = event => {
      event.stopPropagation();
      closeMobileDetail({ restoreFocus:false });
      state.family = related.dataset.family;
      render();
    };

    const structure = card.querySelector('.final-structure img');
    if (structure) structure.onerror = () => {
      structure.style.display = 'none';
      const fallback = card.querySelector('.structure-fallback');
      if (fallback) fallback.style.display = 'grid';
    };
  }

  function hydrateDeferredAromaImages(root) {
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

  function openMobileDetail(sourceCard) {
    if (!MOBILE_DETAIL.matches) return;
    const compound = byId[sourceCard.dataset.id];
    if (!compound) return;

    ensureModal();
    window.clearTimeout(closeTimer);
    activeSource = sourceCard;

    const expanded = sourceCard.cloneNode(true);
    expanded.removeAttribute('id');
    expanded.classList.remove('revealed', 'pinned', 'hover-revealed');
    expanded.classList.add('mobile-expanded-card');
    expanded.removeAttribute('tabindex');
    expanded.setAttribute('aria-expanded', 'true');
    hydrateDeferredAromaImages(expanded);
    expanded.querySelectorAll('img').forEach(image => {
      image.loading = 'eager';
      image.decoding = 'async';
    });

    host.replaceChildren(expanded);
    bindOverlayControls(expanded, compound);

    document.body.classList.add('mobile-detail-open');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modal.dataset.activeId = compound.id;
    discover(compound.id);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => expanded.classList.add('is-flipped'));
    });

    closeButton.focus({ preventScroll:true });
  }

  function closeMobileDetail({ restoreFocus=true } = {}) {
    if (!modal || !modal.classList.contains('open')) return;

    const expanded = host.querySelector('.mobile-expanded-card');
    if (expanded) expanded.classList.remove('is-flipped');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    delete modal.dataset.activeId;
    document.body.classList.remove('mobile-detail-open');

    const focusTarget = activeSource;
    activeSource = null;
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      if (!modal.classList.contains('open')) host.replaceChildren();
    }, 240);

    if (restoreFocus && focusTarget && focusTarget.isConnected) {
      focusTarget.focus({ preventScroll:true });
    }
  }

  cards.addEventListener('click', event => {
    if (!MOBILE_DETAIL.matches) return;
    const card = event.target.closest('.card');
    if (!card || !cards.contains(card) || event.target.closest('button')) return;

    event.preventDefault();
    event.stopPropagation();
    openMobileDetail(card);
  }, true);

  cards.addEventListener('keydown', event => {
    if (!MOBILE_DETAIL.matches || (event.key !== 'Enter' && event.key !== ' ')) return;
    const card = event.target.closest('.card');
    if (!card || !cards.contains(card) || event.target.closest('button')) return;

    event.preventDefault();
    event.stopPropagation();
    openMobileDetail(card);
  }, true);

  if (typeof MOBILE_DETAIL.addEventListener === 'function') {
    MOBILE_DETAIL.addEventListener('change', event => {
      if (!event.matches) closeMobileDetail({ restoreFocus:false });
    });
  }

  const mobileHint = document.querySelector('.instructions .mobile-only');
  if (mobileHint) mobileHint.textContent = 'TAP = OPEN / FLIP';
})();