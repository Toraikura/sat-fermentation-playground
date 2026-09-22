/* FERMENTATION PLAYGROUND: optional, dependency-free cross-game navigation. */
(() => {
  'use strict';
  if (window.__fpgNavigationV1) return;
  window.__fpgNavigationV1 = true;
  const ROOT = 'https://toraikura.github.io/';
  const HUB = ROOT + 'sat-fermentation-playground/';
  const games = [
    { id: 'aroma-labo', name: 'AROMA LABO', label: '香りをめくる', description: '香りの名前から、分子とお酒のつながりを探る。', url: HUB + 'aroma-lab/' },
    { id: 'aroma-match', name: 'AROMA MATCH', label: '香りをつなぐ', description: '香り成分と、その香りを結ぶマッチングゲーム。', url: HUB + 'aroma-lab/aroma-match/' },
    { id: 'rice-lineage', name: 'RICE LINEAGE', label: '酒米のルーツを走る', description: 'レトロなドライブで、酒米の親子関係をたどる。', url: HUB + 'rice-lineage/' },
    { id: 'shubo-dive', name: 'SHUBO DIVE', label: '米の世界を飛ぶ', description: '菌糸の森を飛び、酵母の仲間を救って帰る。', url: ROOT + 'shubo-dive/' },
    { id: 'shubo-world', name: 'SHUBO', label: '小さな世界をのぞく', description: '蔵から木桶へ。発酵の小さな生命の世界へ。', url: ROOT + 'shubo-world/' },
    { id: 'shubo-run', name: 'SHUBO RUN', label: '糖を集めて走る', description: '競合をかわし、糖を集める3ステージのアーケード。', url: ROOT + 'shubo-run/' },
    { id: 'sake-clash', name: 'SAKE CLASH', label: '酒蔵の陣取りに挑む', description: 'カードを配置し、陣地を奪い合うCPU対戦。', url: ROOT + 'sake-clash/' }
  ];
  const path = location.pathname.replace(/\/?$/, '/');
  const current = games.slice().sort((a, b) => new URL(b.url).pathname.length - new URL(a.url).pathname.length)
    .find(game => path.startsWith(new URL(game.url).pathname));
  const source = current ? current.id : 'hub';
  const nextIds = { 'aroma-labo': 'aroma-match', 'aroma-match': 'rice-lineage', 'rice-lineage': 'shubo-dive', 'shubo-dive': 'shubo-world', 'shubo-world': 'shubo-run', 'shubo-run': 'sake-clash', 'sake-clash': 'aroma-labo', hub: 'aroma-match' };
  const next = games.find(game => game.id === nextIds[source]);
  const css = `
    :host{display:block;max-width:100%;min-width:0;margin:14px 0;color:#172d28;font:14px/1.5 system-ui,-apple-system,'Noto Sans JP',sans-serif;text-align:left;letter-spacing:normal;text-transform:none;color-scheme:light}
    *{box-sizing:border-box}a{color:inherit;text-decoration:none}a:focus-visible,summary:focus-visible{outline:3px solid #097e6a;outline-offset:3px;border-radius:8px}
    .box{padding:16px;background:#f5f1e7;border:1px solid #ccc9bb;border-radius:12px;max-width:680px;margin:auto}
    .kicker{margin:0 0 5px;font:700 10px/1.4 ui-monospace,monospace;letter-spacing:.14em;color:#50675b}
    h2{font-size:18px;line-height:1.45;margin:0 0 12px;font-weight:800}p{margin:0}
    .next{display:block;background:#174d40;color:#fff;padding:14px;border-radius:9px;transition:background .15s}
    .next:hover{background:#103d33}.next small{display:block;color:#d7e9d7;font-size:11px}.next strong{display:block;margin:3px 0;font:800 19px/1.3 ui-monospace,monospace;letter-spacing:.02em}.next span{display:block;font-size:12px}.next b{display:block;margin-top:9px;font-size:13px}
    .hub{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;margin-top:5px;font-size:13px;font-weight:700}
    .places{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;padding-top:12px;border-top:1px solid #d5d2c7}
    .place{padding:11px;background:#fffdf6;border:1px solid #dbd7ca;border-radius:8px;min-width:0}.place small{font:700 9px/1.5 ui-monospace,monospace;color:#566b60;letter-spacing:.06em;display:block}.place strong{font-size:14px;line-height:1.5;display:block;margin:4px 0}.place span{font-size:11px;display:block;color:#44594f}
    .age{margin-top:10px;font-size:10px;line-height:1.5;color:#607066}
    details{max-width:680px;margin:auto;border:1px solid #ccc9bb;border-radius:10px;background:#f5f1e7}summary{cursor:pointer;padding:11px 13px;min-height:44px;font-size:12px;font-weight:750;list-style-position:inside;color:#1b4b3c;touch-action:manipulation}details[open]>summary{border-bottom:1px solid #d5d2c7}details .box{border:0;border-radius:0 0 10px 10px}
    @media(max-width:360px){.box{padding:12px}.places{grid-template-columns:1fr}.next strong{font-size:17px}}
    @media(prefers-reduced-motion:reduce){*{transition:none!important}}
  `;
  function track(name, data) {
    try {
      const detail = { from_game: source, ...data };
      if (window.satAnalytics && typeof window.satAnalytics.track === 'function') window.satAnalytics.track(name, detail);
      else if (typeof window.gtag === 'function') window.gtag('event', name, detail);
    } catch (_) { /* Navigation must not depend on analytics or storage. */ }
  }
  function link(url, destination, toGame, markup) {
    return `<a href="${url}" data-destination="${destination}" data-to-game="${toGame || ''}"${destination === 'game' ? ' class="next"' : ''}>${markup}</a>`;
  }
  const mounts = new Set();
  function create(placement, compact) {
    const host = document.createElement('fpg-next');
    host.dataset.fpgPlacement = placement;
    host.dataset.fpgCompact = String(compact);
    const shadow = host.attachShadow({ mode: 'open' });
    const content = `<section class="box" aria-label="次のゲームと、お酒を楽しむ場所">
      <p class="kicker">FERMENTATION PLAYGROUND / PLAY NEXT</p>
      <h2>${placement === 'result' || placement === 'game-over' ? 'もう一本、遊んでいく？' : '次は、どこで遊ぶ？'}</h2>
      ${link(next.url, 'game', next.id, `<small>${next.label}</small><strong>${next.name}</strong><span>${next.description}</span><b>このゲームで遊ぶ →</b>`)}
      <a class="hub" href="${HUB}" data-destination="hub"><span>全7体験から選ぶ</span><span aria-hidden="true">→</span></a>
      <div class="places">
        <a class="place" href="https://chilllabo.com/" data-destination="chill-labo"><small>DRINK / CHILL LABO AKASAKA</small><strong>今度は、赤坂で飲み比べる。</strong><span>お店の楽しみ方を見る ↗</span></a>
        <a class="place" href="https://sakearttokyo.com/" data-destination="sake-art-tokyo"><small>DISCOVER / SAKE ART TOKYO</small><strong>日本酒を、もっと知る。</strong><span>SATのお酒・つくり手を見る ↗</span></a>
      </div><p class="age">飲酒・お酒の購入は20歳以上の方へ。</p>
    </section>`;
    shadow.innerHTML = `<style>${css}</style>${compact ? `<details><summary>ほかのゲーム・赤坂で飲む・SATのお酒を見る</summary>${content}</details>` : content}`;
    shadow.addEventListener('click', event => {
      const anchor = event.target instanceof Element && event.target.closest('a[data-destination]');
      if (!anchor) return;
      const destination = anchor.dataset.destination;
      track('fpg_navigation_click', { placement, destination, to_game: anchor.dataset.toGame || '', link_url: anchor.href });
      if (destination === 'game' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
        try { sessionStorage.setItem('fpg_navigation_pending', JSON.stringify({ from: source, to: anchor.dataset.toGame, placement, at: Date.now() })); } catch (_) {}
      }
    });
    let reported = false;
    const box = shadow.querySelector('.box');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (!reported && entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .2)) {
          reported = true;
          track('fpg_navigation_view', { placement, to_game: next.id });
          observer.disconnect();
        }
      }, { threshold: .2 });
      observer.observe(box);
      host._fpgObserver = observer;
    }
    mounts.add(host);
    return host;
  }
  function mount(target, placement, compact = true, after = false) {
    if (!target) return;
    const parent = after ? target.parentElement : target;
    if (!parent) return;
    const existing = Array.from(parent.children).find(node => node.tagName === 'FPG-NEXT' && node.dataset.fpgPlacement === placement);
    if (existing && existing.dataset.fpgCompact === String(compact)) return;
    if (existing) { existing._fpgObserver?.disconnect(); existing.remove(); mounts.delete(existing); }
    const host = create(placement, compact);
    if (after) target.after(host); else target.append(host);
  }
  function tidy() {
    for (const host of mounts) if (!host.isConnected) { host._fpgObserver?.disconnect(); mounts.delete(host); }
  }
  function watch(target, callback, options = { childList: true }) {
    let scheduled = false;
    const observer = new MutationObserver(records => {
      if (records.every(record => record.type === 'childList' && [...record.addedNodes, ...record.removedNodes].every(node => node.nodeType === 1 && node.tagName === 'FPG-NEXT'))) return;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; tidy(); callback(); });
    });
    observer.observe(target, options);
    return observer;
  }
  function init() {
    const style = document.createElement('style');
    style.dataset.fpgNavigation = 'layout';
    style.textContent = `
      #gameOver>div:has(>fpg-next),#resultLayer>.result-card:has(>fpg-next){max-height:calc(100dvh - 32px);overflow-y:auto;overscroll-behavior:contain}
      .overlay>.overlay-card:has(>fpg-next),.overlay>.paper-card:has(>fpg-next){max-height:calc(100% - 16px);overflow-y:auto;overscroll-behavior:contain}
      fpg-next{min-width:0;width:100%}
    `;
    document.head.append(style);
    if (source === 'rice-lineage') {
      mount(document.querySelector('.board-heading'), 'start', true, true);
      mount(document.querySelector('#clearScreen .clear-stage'), 'result', false);
      mount(document.querySelector('#gameOver > div'), 'game-over', false);
    } else if (source === 'aroma-match') {
      mount(document.querySelector('.expert-note'), 'menu', true, true);
      mount(document.querySelector('#resultLayer .result-card'), 'result', false);
    } else if (source === 'aroma-labo') {
      mount(document.querySelector('main') || document.body, 'explore', false);
      const header = document.querySelector('header');
      if (header) mount(header, 'start', true, true);
    } else if (source === 'shubo-dive') {
      const menu = document.querySelector('#menuContent');
      if (menu) {
        const render = () => mount(menu, 'menu', !menu.querySelector('.result-stats'));
        render(); watch(menu, render);
      }
    } else if (source === 'shubo-run' || source === 'sake-clash') {
      let bootstrap;
      const connect = () => {
        const arena = source === 'shubo-run' ? document.querySelector('.arena') : document.querySelector('canvas[data-status]')?.parentElement;
        if (!arena) return;
        bootstrap?.disconnect();
        const render = () => {
          const card = arena.querySelector(source === 'shubo-run' ? '.overlay > .overlay-card' : '.overlay > .paper-card');
          const isResult = card && (card.classList.contains('result-card') || card.classList.contains('result'));
          mount(card, 'menu', !isResult);
        };
        render(); watch(arena, render);
      };
      bootstrap = watch(document.querySelector('#root') || document.body, connect, { childList: true, subtree: true });
      connect();
    } else if (source === 'shubo-world') {
      // Optional mount supplied by the standalone game's publication step.
      mount(document.querySelector('[data-fpg-world-navigation]'), 'explore', true);
    } else {
      const exit = document.querySelector('.sat-exit');
      if (exit) mount(exit, 'hub', false, true);
    }
    try {
      const raw = sessionStorage.getItem('fpg_navigation_pending');
      if (raw) {
        const pending = JSON.parse(raw);
        if (pending.to === source) {
          sessionStorage.removeItem('fpg_navigation_pending');
          if (Date.now() - pending.at >= 0 && Date.now() - pending.at < 30 * 60 * 1000) {
            track('fpg_navigation_arrival', { from_game: pending.from, to_game: source, placement: pending.placement });
          }
        }
      }
    } catch (_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
