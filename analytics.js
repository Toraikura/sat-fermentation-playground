/* The optional navigation loads independently of GA, consent, and ad blockers. */
(() => {
  if (window.__fpgNavigationRequested) return;
  window.__fpgNavigationRequested = true;
  try {
    const base = document.currentScript && document.currentScript.src;
    const navigation = document.createElement('script');
    navigation.defer = true;
    navigation.src = new URL('fpg-navigation.js?v=20260923-1', base || 'https://toraikura.github.io/sat-fermentation-playground/analytics.js').href;
    document.head.appendChild(navigation);
  } catch (_) { /* Games remain usable if the optional navigation cannot load. */ }
})();

(() => {
  'use strict';
  if (window.__satFpgAnalytics) return;
  window.__satFpgAnalytics = true;
  const MEASUREMENT_ID = 'G-3L1Q0VYVRH';
  const path = location.pathname;
  const contentGroup =
    path.includes('/rice-lineage/') ? 'RICE LINEAGE' :
    path.includes('/aroma-lab/aroma-match/') ? 'AROMA MATCH' :
    path.includes('/aroma-lab/') ? 'AROMA LABO' :
    path.includes('/shubo-dive/') ? 'SHUBO DIVE' :
    path.includes('/shubo-world/') ? 'SHUBO' :
    path.includes('/shubo-run/') ? 'SHUBO RUN' :
    path.includes('/sake-clash/') ? 'SAKE CLASH' :
    'FERMENTATION PLAYGROUND';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }
  const params = new URLSearchParams(location.search);
  const landingKey = 'sat_fpg_landing';
  let landing = null;
  try {
    landing = sessionStorage.getItem(landingKey);
    if (!landing) {
      landing = JSON.stringify({
        path: path + location.search,
        referrer: document.referrer || '(direct)',
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || ''
      });
      sessionStorage.setItem(landingKey, landing);
    }
  } catch (_) {}
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { content_group: contentGroup, page_path: path + location.search });
  window.satAnalytics = {
    track(name, detail = {}) {
      window.gtag('event', name, { experience: contentGroup, page_path: path, ...detail });
    }
  };
  window.satAnalytics.track('experience_view', {
    landing_path: (() => { try { return JSON.parse(landing || '{}').path || path; } catch (_) { return path; } })()
  });
  const gameEvent = name => window.satAnalytics.track(name, { game_name: contentGroup });
  let matchStarted = false;
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const target = event.target;
    const link = target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href') || '';
      if (href && !href.startsWith('#')) window.satAnalytics.track('experience_link_click', {
        link_text: (link.textContent || '').trim().slice(0, 80), link_url: link.href
      });
    }
    if (contentGroup === 'RICE LINEAGE') {
      if (target.closest('#startMission')) gameEvent('game_start');
      if (target.closest('#retryMission')) gameEvent('game_retry');
    } else if (contentGroup === 'AROMA MATCH') {
      if (target.closest('#newRound')) { matchStarted = false; gameEvent('game_new_round'); }
      if (target.closest('#replayButton')) { matchStarted = false; gameEvent('game_retry'); }
      if (!matchStarted && target.closest('#matchBoard button, #matchBoard [role="button"]')) {
        matchStarted = true; gameEvent('game_start');
      }
    } else if (contentGroup === 'SHUBO RUN') {
      const card = target.closest('.overlay-card');
      if (card && target.closest('button.primary')) {
        if (card.classList.contains('result-card')) gameEvent('game_retry');
        else if (card.querySelector('button[aria-label="プレイ開始"]')) gameEvent('game_start');
      }
    } else if (contentGroup === 'SAKE CLASH' && target.closest('.paper-card button.primary')) {
      const status = document.querySelector('canvas[data-status]')?.dataset.status;
      if (status === 'ready') gameEvent('game_start');
      else if (['won', 'lost', 'draw'].includes(status)) gameEvent('game_retry');
    } else if (contentGroup === 'SHUBO DIVE' && target.closest('button[data-action="start"]')) {
      gameEvent(document.querySelector('#menuContent .result-stats') ? 'game_retry' : 'game_start');
    }
  }, { passive: true, capture: true });

  function observeGameState() {
    function observeVisibility(selector, name) {
      const element = document.querySelector(selector);
      if (!element) return;
      let seen = false;
      const check = () => {
        const visible = !element.hidden;
        if (visible && !seen) gameEvent(name);
        seen = visible;
      };
      new MutationObserver(check).observe(element, { attributes: true, attributeFilter: ['hidden'] });
      check();
    }
    if (contentGroup === 'RICE LINEAGE') {
      observeVisibility('#clearScreen', 'game_clear');
      observeVisibility('#gameOver', 'game_over');
    } else if (contentGroup === 'AROMA MATCH') {
      observeVisibility('#resultLayer', 'game_clear');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observeGameState, { once: true });
  else observeGameState();
})();
