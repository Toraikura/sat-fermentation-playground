(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-3L1Q0VYVRH';
  const path = location.pathname;
  const contentGroup =
    path.includes('/rice-lineage/') ? 'RICE LINEAGE' :
    path.includes('/aroma-lab/aroma-match/') ? 'AROMA MATCH' :
    path.includes('/aroma-lab/') ? 'AROMA LABO' :
    'FERMENTATION PLAYGROUND';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(script);

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
  window.gtag('config', MEASUREMENT_ID, {
    content_group: contentGroup,
    page_path: path + location.search
  });

  window.satAnalytics = {
    track(name, detail = {}) {
      window.gtag('event', name, {
        experience: contentGroup,
        page_path: path,
        ...detail
      });
    }
  };

  window.satAnalytics.track('experience_view', {
    landing_path: (() => { try { return JSON.parse(landing || '{}').path || path; } catch (_) { return path; } })()
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href') || '';
      if (href && !href.startsWith('#')) {
        window.satAnalytics.track('experience_link_click', {
          link_text: (link.textContent || '').trim().slice(0, 80),
          link_url: link.href
        });
      }
    }

    if (path.includes('/rice-lineage/')) {
      const start = event.target.closest('#startMission');
      const retry = event.target.closest('#retryMission');
      if (start) window.satAnalytics.track('game_start', { game_name: 'RICE LINEAGE' });
      if (retry) window.satAnalytics.track('game_retry', { game_name: 'RICE LINEAGE' });
    }

    if (path.includes('/aroma-lab/aroma-match/')) {
      const start = event.target.closest('#newRound');
      const retry = event.target.closest('#replay');
      if (start) window.satAnalytics.track('game_start', { game_name: 'AROMA MATCH' });
      if (retry) window.satAnalytics.track('game_retry', { game_name: 'AROMA MATCH' });
    }
  }, { passive: true });

  function observeGameState() {
    if (path.includes('/rice-lineage/')) {
      const clear = document.querySelector('#clearScreen');
      const gameOver = document.querySelector('#gameOver');
      let clearSeen = false;
      let gameOverSeen = false;
      const check = () => {
        const clearVisible = !!clear && !clear.hidden;
        const overVisible = !!gameOver && !gameOver.hidden;
        if (clearVisible && !clearSeen) window.satAnalytics.track('game_clear', { game_name: 'RICE LINEAGE' });
        if (overVisible && !gameOverSeen) window.satAnalytics.track('game_over', { game_name: 'RICE LINEAGE' });
        clearSeen = clearVisible;
        gameOverSeen = overVisible;
      };
      const observer = new MutationObserver(check);
      if (clear) observer.observe(clear, { attributes: true, attributeFilter: ['hidden', 'class'] });
      if (gameOver) observer.observe(gameOver, { attributes: true, attributeFilter: ['hidden', 'class'] });
      check();
    }

    if (path.includes('/aroma-lab/aroma-match/')) {
      const result = document.querySelector('#result');
      if (!result) return;
      let seen = !result.hidden;
      const observer = new MutationObserver(() => {
        const visible = !result.hidden;
        if (visible && !seen) window.satAnalytics.track('game_clear', { game_name: 'AROMA MATCH' });
        seen = visible;
      });
      observer.observe(result, { attributes: true, attributeFilter: ['hidden'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeGameState, { once: true });
  } else {
    observeGameState();
  }
})();