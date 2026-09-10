import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';

const BASE = process.env.AROMA_LAB_BASE || 'http://127.0.0.1:4173/aroma-lab/';
const STRUCTURE_IDS = [
  'ethyl-acetate','isoamyl-acetate','ethyl-hexanoate','ethanol','isoamyl-alcohol','phenethyl-alcohol','acetaldehyde','isovaleraldehyde','4vg','sotolon',
  'ethanethiol','dms','dmts','tca246','diacetyl','hexanoic-acid','acetic-acid','butyric-acid','isovaleric-acid','linalool','beta-damascenone','vanillin',
  'edmp','furfural','ethyl-laurate','octenol','furaneol','ibmp','3mh','beta-ionone','tdn','4vp','4eg','2ap','so2','eugenol','hexadienol','cis3hexenol',
  'geraniol','isobutanol','h2s','4ep','athp','geosmin','styrene','guaiacol','tca236','3mbt','trans2nonenal','citronellol','dcp26'
];

const EXPECTED_COUNTS = { sake:19, shochu:20, wineStandard:18, wineProfessional:20, beer:17 };

function attachDiagnostics(page, label) {
  const pageErrors = [];
  const badResponses = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('response', response => {
    if (response.url().startsWith(BASE) && response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
  });
  return () => {
    assert.deepEqual(pageErrors, [], `${label}: page errors: ${pageErrors.join(' | ')}`);
    assert.deepEqual(badResponses, [], `${label}: bad same-origin responses: ${badResponses.join(' | ')}`);
  };
}

async function waitForCards(page, expected) {
  await page.waitForFunction(count => document.querySelectorAll('#cards .card[data-name-first-ready="1"]').length === count, expected);
}

async function visibleIds(page) {
  return page.locator('#cards .card').evaluateAll(cards => cards.map(card => card.dataset.id));
}

async function assertAllStructureAssets(page, label) {
  const result = await page.evaluate(async ids => {
    const loadSvg = id => new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve({ id, ok:image.naturalWidth > 0 && image.naturalHeight > 0 });
      image.onerror = () => resolve({ id, ok:false, error:'image decode failed' });
      image.src = `./assets/structures/${encodeURIComponent(id)}.svg`;
    });

    const decoded = await Promise.all(ids.map(loadSvg));
    const decodedFailures = decoded.filter(item => !item.ok);
    const centerFailures = [];
    let maxDx = 0;
    let maxDy = 0;

    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:-10000px;top:0;width:480px;height:280px;opacity:0;pointer-events:none;';
    document.body.appendChild(host);

    for (const id of ids) {
      const response = await fetch(`./assets/structures/${encodeURIComponent(id)}.svg`, { cache:'no-store' });
      if (!response.ok) {
        centerFailures.push(`${id}: HTTP ${response.status}`);
        continue;
      }
      host.innerHTML = await response.text();
      const svg = host.querySelector('svg');
      if (!svg || svg.getAttribute('viewBox') !== '0 0 480 280') {
        centerFailures.push(`${id}: invalid/missing 480x280 viewBox`);
        continue;
      }
      svg.setAttribute('width','480');
      svg.setAttribute('height','280');
      await new Promise(requestAnimationFrame);
      const boxes = [...svg.querySelectorAll('path')].map(path => path.getBBox()).filter(box => box.width || box.height);
      if (!boxes.length) {
        centerFailures.push(`${id}: no drawable paths`);
        continue;
      }
      const left = Math.min(...boxes.map(box => box.x));
      const top = Math.min(...boxes.map(box => box.y));
      const right = Math.max(...boxes.map(box => box.x + box.width));
      const bottom = Math.max(...boxes.map(box => box.y + box.height));
      const dx = Math.abs((left + right) / 2 - 240);
      const dy = Math.abs((top + bottom) / 2 - 140);
      maxDx = Math.max(maxDx, dx);
      maxDy = Math.max(maxDy, dy);
      if (dx > 1 || dy > 1) centerFailures.push(`${id}: bbox center delta (${dx.toFixed(2)}, ${dy.toFixed(2)})`);
    }

    host.remove();
    return { decodedFailures, centerFailures, maxDx, maxDy };
  }, STRUCTURE_IDS);

  assert.deepEqual(result.decodedFailures, [], `${label} SVG decode failures: ${JSON.stringify(result.decodedFailures)}`);
  assert.deepEqual(result.centerFailures, [], `${label} SVG center failures: ${result.centerFailures.join(' | ')}`);
  console.log(`PASS ${label}: ${STRUCTURE_IDS.length}/51 decoded; max browser bbox delta x=${result.maxDx.toFixed(2)} y=${result.maxDy.toFixed(2)}`);
}

async function assertVisibleStructures(page, label) {
  const failures = await page.locator('#cards .card').evaluateAll(cards => cards.flatMap(card => {
    const image = card.querySelector('.final-structure img');
    const fallback = card.querySelector('.structure-fallback');
    const style = image ? getComputedStyle(image) : null;
    const issues = [];
    if (!image) issues.push('missing final structure img');
    else {
      if (!image.complete || image.naturalWidth === 0) issues.push('structure image not decoded');
      if (style.transform !== 'none') issues.push(`unexpected transform ${style.transform}`);
      if (style.objectPosition !== '50% 50%') issues.push(`unexpected object-position ${style.objectPosition}`);
    }
    if (fallback && getComputedStyle(fallback).display !== 'none') issues.push('fallback visible');
    return issues.map(issue => `${card.dataset.id}: ${issue}`);
  }));
  assert.deepEqual(failures, [], `${label}: ${failures.join(' | ')}`);
}

async function testDesktop() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 }, deviceScaleFactor:1 });
  const finishDiagnostics = attachDiagnostics(page, 'desktop');

  await page.goto(BASE, { waitUntil:'networkidle' });
  await waitForCards(page, EXPECTED_COUNTS.sake);
  await assertVisibleStructures(page, 'desktop sake');
  await assertAllStructureAssets(page, 'Chromium structure assets');

  const firstBox = await page.locator('#cards .card').nth(0).boundingBox();
  const secondBox = await page.locator('#cards .card').nth(1).boundingBox();
  assert(firstBox && secondBox, 'desktop card bounding boxes unavailable');
  assert(Math.abs(firstBox.y - secondBox.y) < 2 && secondBox.x > firstBox.x, 'desktop cards must remain multi-column');

  const allIds = new Set(await visibleIds(page));
  await page.locator('[data-tab="shochu"]').click();
  await waitForCards(page, EXPECTED_COUNTS.shochu);
  (await visibleIds(page)).forEach(id => allIds.add(id));

  await page.locator('[data-tab="wine"]').click();
  await waitForCards(page, EXPECTED_COUNTS.wineStandard);
  (await visibleIds(page)).forEach(id => allIds.add(id));

  await page.locator('[data-wine="professional"]').click();
  await waitForCards(page, EXPECTED_COUNTS.wineProfessional);
  (await visibleIds(page)).forEach(id => allIds.add(id));

  await page.locator('[data-tab="beer"]').click();
  await waitForCards(page, EXPECTED_COUNTS.beer);
  (await visibleIds(page)).forEach(id => allIds.add(id));

  assert.equal(allIds.size, 51, `desktop tabs expose ${allIds.size}/51 unique compounds`);
  assert.deepEqual([...allIds].sort(), [...STRUCTURE_IDS].sort(), 'desktop tabs do not expose the exact 51-compound ledger');

  await page.locator('[data-tab="sake"]').click();
  await waitForCards(page, EXPECTED_COUNTS.sake);
  const card = page.locator('#compound-4vg');
  await card.hover();
  await page.waitForFunction(() => document.querySelector('#compound-4vg')?.classList.contains('hover-revealed'));
  assert.equal(await card.getAttribute('aria-expanded'), 'false', 'desktop hover must not pin card');

  await card.click();
  await page.waitForFunction(() => {
    const card = document.querySelector('#compound-4vg');
    return card?.classList.contains('revealed') && card.getAttribute('aria-expanded') === 'true';
  });
  await card.click();
  await page.waitForFunction(() => {
    const card = document.querySelector('#compound-4vg');
    return card && !card.classList.contains('revealed') && card.getAttribute('aria-expanded') === 'false';
  });

  await page.screenshot({ path:'qa-artifacts/aroma-lab-desktop.png', fullPage:true });
  finishDiagnostics();
  await browser.close();
  console.log('PASS desktop Chromium: counts, 51 unique compounds, SVG centering, multi-column layout, and 4VG hover/click');
}

async function testIPhone() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  const finishDiagnostics = attachDiagnostics(page, 'iphone-webkit');

  await page.goto(BASE, { waitUntil:'networkidle' });
  await waitForCards(page, EXPECTED_COUNTS.sake);
  await assertAllStructureAssets(page, 'iPhone WebKit structure assets');

  const cards = page.locator('#cards .card');
  const firstBox = await cards.nth(0).boundingBox();
  const secondBox = await cards.nth(1).boundingBox();
  const thirdBox = await cards.nth(2).boundingBox();
  assert(firstBox && secondBox && thirdBox, 'iPhone compact card bounding boxes unavailable');
  assert(Math.abs(firstBox.x - secondBox.x) < 2, 'iPhone compact cards should be single-column aligned');
  assert(firstBox.width / firstBox.height > 2, `iPhone card should be landscape, got ${firstBox.width}x${firstBox.height}`);
  assert(secondBox.y - firstBox.y < 190, 'iPhone compact cards should stack densely');
  assert(thirdBox.y + thirdBox.height - firstBox.y < 510, 'roughly three compact cards should fit within 510px');

  const hint = await page.locator('.instructions .mobile-only').textContent();
  assert.equal(hint.trim(), 'TAP = OPEN / FLIP', 'mobile instruction should describe expanded flip behavior');

  await cards.nth(0).scrollIntoViewIfNeeded();
  await page.screenshot({ path:'qa-artifacts/aroma-lab-iphone-compact-list.png', fullPage:false });

  const card = page.locator('#compound-4vg');
  await card.tap();
  await page.waitForFunction(() => {
    const modal = document.getElementById('mobileCardModal');
    const expanded = modal?.querySelector('.mobile-expanded-card');
    return modal?.classList.contains('open') && expanded?.classList.contains('is-flipped');
  });
  await page.waitForTimeout(700);

  assert.equal(await card.evaluate(el => el.classList.contains('revealed')), false, 'mobile list card must stay compact/front-only after tap');
  assert.equal(await card.getAttribute('aria-expanded'), 'false', 'mobile list card must not pin itself open');

  const modal = page.locator('#mobileCardModal');
  const expanded = modal.locator('.mobile-expanded-card');
  const expandedBox = await expanded.boundingBox();
  assert(expandedBox && expandedBox.height > 500, `expanded mobile card must be large/readable, got ${expandedBox?.height}`);

  const flipState = await expanded.evaluate(element => {
    const inner = element.querySelector('.card-inner');
    const front = element.querySelector('.front');
    const back = element.querySelector('.back-face');
    const aromaCopy = element.querySelector('.aroma-stage-copy');
    const moleculeCopy = element.querySelector('.molecule-copy');
    return {
      innerTransform:getComputedStyle(inner).transform,
      frontTransform:getComputedStyle(front).transform,
      backTransform:getComputedStyle(back).transform,
      frontBackface:getComputedStyle(front).backfaceVisibility,
      backBackface:getComputedStyle(back).backfaceVisibility,
      frontDisplay:getComputedStyle(front).display,
      backDisplay:getComputedStyle(back).display,
      aromaCopyDisplay:getComputedStyle(aromaCopy).display,
      moleculeCopyDisplay:getComputedStyle(moleculeCopy).display
    };
  });
  assert.equal(flipState.innerTransform, 'none', 'expanded mobile inner should stay fixed while faces rotate independently');
  assert.notEqual(flipState.frontTransform, 'none', 'expanded mobile front face must rotate away');
  assert.notEqual(flipState.backTransform, 'none', 'expanded mobile back face must rotate into view');
  assert.equal(flipState.frontBackface, 'hidden', 'expanded front backface must be hidden');
  assert.equal(flipState.backBackface, 'hidden', 'expanded back backface must be hidden');
  assert.notEqual(flipState.frontDisplay, 'none', 'expanded card front face must remain in the 3D stack');
  assert.notEqual(flipState.backDisplay, 'none', 'expanded card back face must remain in the 3D stack');
  assert.notEqual(flipState.aromaCopyDisplay, 'none', 'expanded aroma copy must be readable');
  assert.notEqual(flipState.moleculeCopyDisplay, 'none', 'expanded molecule copy must be readable');

  await page.waitForFunction(() => {
    const image = document.querySelector('#mobileCardModal .mobile-expanded-card .final-structure img');
    return Boolean(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
  }, { timeout:5000 });

  await modal.screenshot({ path:'qa-artifacts/aroma-lab-iphone-expanded-4vg.png' });
  await page.locator('.mobile-card-close').tap();
  await page.waitForFunction(() => {
    const modal = document.getElementById('mobileCardModal');
    return modal && !modal.classList.contains('open') && modal.getAttribute('aria-hidden') === 'true' && !document.body.classList.contains('mobile-detail-open');
  });

  finishDiagnostics();
  await browser.close();
  console.log('PASS iPhone WebKit: landscape compact list, ~3-card density, independent-face 3D flip detail, readable back face, structure decode, and close');
}

await testDesktop();
await testIPhone();
console.log('AROMA LAB BROWSER QA: PASS');
