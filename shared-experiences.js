(() => {
  'use strict';

  const script = document.currentScript;
  const surface = script?.dataset.catalogSurface;
  if (!script?.src || !['sat', 'hub'].includes(surface)) return;

  const catalogURL = new URL('shared-experiences.json', script.src);
  const english = document.documentElement.lang.toLowerCase().startsWith('en');
  const groups = ['aroma', 'rice', 'shubo'];
  const hosts = new Set(['toraikura.github.io', 'sakearttokyo.com']);
  // These experiences retain their existing, site-specific launch controllers.
  const reservedIDs = new Set(['sake-clash', 'rice-lineage', 'aroma-labo', 'aroma-match', 'shubo-run', 'pathway']);

  function requireValue(condition) {
    if (!condition) throw new Error('Invalid shared experience catalog');
  }

  function text(value, limit = 500) {
    requireValue(typeof value === 'string' && value.trim().length > 0 && value.length <= limit);
    return value.trim();
  }

  function publicURL(value) {
    const url = new URL(text(value, 2000));
    requireValue(url.protocol === 'https:' && hosts.has(url.hostname)
      && !url.username && !url.password && !url.port);
    return url.href;
  }

  function imagePosition(value) {
    const position = text(value, 60);
    const parts = position.split(/\s+/);
    requireValue(parts.length <= 2 && parts.every(part => {
      if (['left', 'right', 'top', 'bottom', 'center'].includes(part)) return true;
      return /^\d+(?:\.\d+)?%$/.test(part) && parseFloat(part) <= 100;
    }));
    requireValue(CSS.supports('object-position', position));
    return position;
  }

  function validate(data) {
    requireValue(data && data.version === 1 && Array.isArray(data.games) && data.games.length <= 100);
    const ids = new Set();
    return data.games.map(game => {
      requireValue(game && typeof game === 'object');
      const id = text(game.id, 80);
      requireValue(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id) && !ids.has(id) && !reservedIDs.has(id));
      ids.add(id);
      requireValue(Array.isArray(game.title) && game.title.length > 0 && game.title.length <= 2);
      requireValue(groups.includes(game.group) && game.description && game.image);
      const { width, height } = game.image;
      requireValue(Number.isInteger(width) && Number.isInteger(height)
        && width > 0 && height > 0 && width <= 10000 && height <= 10000);
      return {
        id,
        title: game.title.map(part => text(part, 100)),
        url: publicURL(game.url),
        group: game.group,
        type: text(game.type, 120),
        description: { ja: text(game.description.ja), en: text(game.description.en) },
        route: text(game.route, 160),
        image: {
          src: publicURL(game.image.src), width, height,
          position: imagePosition(game.image.position)
        }
      };
    });
  }

  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function arrow(symbol, className) {
    const node = element('span', className, symbol);
    node.setAttribute('aria-hidden', 'true');
    return node;
  }

  function managedCards(containers, cardClass) {
    const cards = new Map();
    for (const container of containers) {
      for (const card of container.children) {
        if (!card.classList.contains(cardClass) || !card.hasAttribute('data-shared-experience')) continue;
        const id = card.dataset.sharedExperience;
        requireValue(card.tagName === 'A' && !reservedIDs.has(id) && !cards.has(id));
        cards.set(id, card);
      }
    }
    return cards;
  }

  function updateLink(card, game) {
    card.href = game.url;
    card.dataset.sharedExperience = game.id;
    card.setAttribute('aria-label', english ? `Play ${game.title.join(' ')}` : `${game.title.join(' ')}を遊ぶ`);
  }

  function removeRetired(cards, games) {
    const ids = new Set(games.map(game => game.id));
    cards.forEach((card, id) => { if (!ids.has(id)) card.remove(); });
  }

  function renderSAT(games) {
    const grid = document.querySelector('#play .fpg-game-grid');
    requireValue(grid);
    const cards = managedCards([grid], 'fpg-game');
    const pathway = Array.from(grid.children).find(card => card.classList.contains('fpg-game--pathway')) || null;
    const updates = games.map(game => {
      const card = cards.get(game.id) || element('a');
      const title = element('strong', 'fpg-game-title');
      game.title.forEach(part => title.append(element('span', '', part)));
      const preview = element('span', 'fpg-preview fpg-preview--catalog');
      preview.setAttribute('aria-hidden', 'true');
      // The existing near-viewport CSS gate controls loading; do not create an Image here.
      const cssURL = game.image.src.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      preview.style.setProperty('--catalog-preview', `url("${cssURL}")`);
      preview.style.setProperty('--catalog-position', game.image.position);
      const status = element('span', 'fpg-game-status', 'PLAY NOW ');
      status.append(arrow('↗'));
      return { card, game, children: [element('span', 'fpg-game-index'), title, preview, status] };
    });

    removeRetired(cards, games);
    updates.forEach(({ card, game, children }) => {
      updateLink(card, game);
      card.className = 'fpg-game fpg-game--live fpg-game--catalog';
      card.dataset.event = 'sat_to_fpg';
      card.dataset.experience = game.id;
      card.dataset.sourcePage = english ? '/en/' : '/';
      card.replaceChildren(...children);
      grid.insertBefore(card, pathway);
    });
    Array.from(grid.children).filter(card => card.classList.contains('fpg-game')).forEach((card, index) => {
      const number = card.querySelector('.fpg-game-index');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });
  }

  function hubChildren(game) {
    const content = element('div');
    const top = element('div', 'experience-top');
    top.append(element('span', 'experience-type', game.type), element('span', 'live', 'LIVE'));
    const preview = element('div', 'experience-preview preview-image');
    preview.setAttribute('aria-hidden', 'true');
    const image = element('img');
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = game.image.width;
    image.height = game.image.height;
    image.style.objectPosition = game.image.position;
    image.src = game.image.src;
    preview.append(image);
    content.append(top, element('h3', '', game.title.join(' ')), preview,
      element('p', '', game.description[english ? 'en' : 'ja']));
    const footer = element('div');
    const foot = element('div', 'card-foot');
    foot.append(element('span', '', 'PLAY'), arrow('→', 'card-arrow'));
    footer.append(foot, element('div', 'route', game.route));
    return [content, footer];
  }

  function renderHub(games) {
    const lists = new Map(groups.map(group => [group,
      document.querySelector(`.experience-list[data-catalog-group="${group}"]`)]));
    requireValue(Array.from(lists.values()).every(Boolean));
    const cards = managedCards(lists.values(), 'experience-card');
    const structuredNode = document.getElementById('experience-structured-data');
    const structured = structuredNode ? JSON.parse(structuredNode.textContent) : null;
    if (structured) requireValue(structured.mainEntity?.['@type'] === 'ItemList');
    const updates = games.map(game => ({
      card: cards.get(game.id) || element('a'), game, children: hubChildren(game)
    }));

    removeRetired(cards, games);
    updates.forEach(({ card, game, children }) => {
      updateLink(card, game);
      card.classList.add('experience-card');
      card.replaceChildren(...children);
    });
    // Reuse the actual anchors, preserving listeners and the five bespoke cards.
    lists.forEach((list, group) => {
      const firstLegacy = Array.from(list.children).find(card => !card.hasAttribute('data-shared-experience')) || null;
      updates.filter(update => update.game.group === group).forEach(({ card }) => list.insertBefore(card, firstLegacy));
    });

    const visibleCards = Array.from(document.querySelectorAll('.experience-list > a.experience-card'));
    document.querySelectorAll('[data-experience-count]').forEach(count => { count.textContent = String(visibleCards.length); });
    document.querySelectorAll('.hero-count').forEach(count => {
      count.setAttribute('aria-label', english
        ? `${lists.size} entrances and ${visibleCards.length} experiences`
        : `${lists.size}つの入口と${visibleCards.length}つの体験があります`);
    });
    if (structured) {
      structured.mainEntity.numberOfItems = visibleCards.length;
      structured.mainEntity.itemListElement = visibleCards.map((card, index) => ({
        '@type': 'ListItem', position: index + 1,
        name: card.querySelector('h3')?.textContent.trim() || '', url: card.href
      }));
      structuredNode.textContent = JSON.stringify(structured);
    }
  }

  async function loadCatalog() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(catalogURL, { cache: 'no-cache', credentials: 'omit', signal: controller.signal });
      requireValue(response.ok);
      const games = validate(await response.json());
      if (surface === 'sat') renderSAT(games);
      else renderHub(games);
      document.documentElement.dataset.sharedCatalogVersion = '1';
    } catch {
      // Offline, unavailable, or invalid catalogs leave the shipped static cards usable.
    } finally {
      clearTimeout(timeout);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadCatalog, { once: true });
  else loadCatalog();
})();
