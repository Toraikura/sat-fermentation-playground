import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';

const BASE = process.env.AROMA_LAB_BASE || 'http://127.0.0.1:4173/aroma-lab/';
const STRUCTURE_IDS = [
  'ethyl-acetate','isoamyl-acetate','ethyl-hexanoate','ethanol','isoamyl-alcohol','phenethyl-alcohol','acetaldehyde','isovaleraldehyde','4vg','sotolon',
  'ethanethiol','dms','dmts','tca246','diacetyl','hexanoic-acid','acetic-acid','butyric-acid','isovaleric-acid','linalool','beta-damascenone','vanillin',
  'edmp','furfural','ethyl-laurate','octenol','furaneol','ibmp','3mh','beta-ionone','tdn','4vp','4eg','2ap','so2','eugenol','hexadienol','cis3hexenol',
  'geraniol','isobutanol','h2s','4ep','athp','geosmin','styrene','guaiacol','tca236','3mbt','trans2nonenal','citronellol','dcp26'
];

const EXPECTED_COUNTS = {
  sake: 19,
  shochu: 20,
  wineStandard: 18,
  wineProfessional: 20,
  beer: 17
};

function attachDiagnostics(page, label) {
  const pageErrors = [];
  const badResponses = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('response', response => {
    if (response.url().startsWith(BASE) && response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  return () => {
    assert.deepEqual(pageErrors, [], `${label}: page errors: ${pageErrors.join(' | ')}`);
    assert.deepEqual(badResponses, [], `${label}: bad same-origin responses: ${badResponses.join(' | ')}`);
  };
}

async function waitForCards(page, expected) {
  await page.waitForFunction(
    count => document.querySelectorAll('#cards .card[data-name-first-ready="1"]').length === count,
    expected
  );
}

async function waitForFrontTransform(page, id) {
  await page.waitForFunction(compoundId => {
    const inner = document.querySelector(`#compound-${compoundId} .card-inner`);
    if (!inner) return false;
    const transform = getComputedStyle(inner).transform;
    return transform === 'none' ||
      transform === 'matrix(1, 0, 0, 1, 0, 0)' ||
      transform === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
  }, id, { timeout: 1600 });
}

async function visibleIds(page) {
  return page.locator('#cards .card').evaluateAll(cards => cards.map(card => card.dataset.id));
}

async function waitForCardStructureDecoded(page, id, label) {
  await page.waitForFunction(compoundId => {
    const image = document.querySelector(`#compound-${compoundId} .final-structure img`);
    return Boolean(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
  }, id, { timeout: 5000 });

  const failures = await page.locator(`#compound-${id}`).evaluate(card => {
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
    return issues;
  });

  assert.deepEqual(failures, [], `${label} ${id}: ${failures.join(' | ')}`);
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

async function assertAllStructureAssets(page, label) {
  const result = await page.evaluate(async ids => {
    const loadSvg = id => new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve({ id, ok: image.naturalWidth > 0 && image.naturalHeight > 0 });
      image.onerror = () => resolve({ id, ok: false, error: 'image decode failed' });
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
      const response = await fetch(`./assets/structures/${encodeURIComponent(id)}.svg`, { cache: 'no-store' });
      if (!response.ok) {
        centerFailures.push(`${id}: HTTP ${response.status}`);
        continue;
      }
      const text = await response.text();
      host.innerHTML = text;
      const svg = host.querySelector('svg');
      if (!svg || svg.getAttribute('viewBox') !== '0 0 480 280') {
        centerFailures.push(`${id}: invalid/missing 480x280 viewBox`);
        continue;
      }
      svg.setAttribute('width', '480');
      svg.setAttribute('height', '280');
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

async function testDesktop() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const finishDiagnostics = attachDiagnostics(page, 'desktop');

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await waitForCards(page, EXPECTED_COUNTS.sake);
  await assertVisibleStructures(page, 'desktop sake');
  await assertAllStructureAssets(page, 'Chromium structure assets');

  const allIds = new Set(await visibleIds(page));

  await page.locator('[data-tab="shochu"]').click();
  await waitForCards(page, EXPECTED_COUNTS.shochu);
  (await visibleIds(page)).forEach(id => allIds.add(id));
  await assertVisibleStructures(page, 'desktop shochu');

  await page.locator('[data-tab="wine"]').click();
  await waitForCards(page, EXPECTED_COUNTS.wineStandard);
  (await visibleIds(page)).forEach(id => allIds.add(id));
  await assertVisibleStructures(page, 'desktop wine standard');

  await page.locator('[data-wine="professional"]').click();
  await waitForCards(page, EXPECTED_COUNTS.wineProfessional);
  (await visibleIds(page)).forEach(id => allIds.add(id));
  await assertVisibleStructures(page, 'desktop wine professional');

  await page.locator('[data-tab="beer"]').click();
  await waitForCards(page, EXPECTED_COUNTS.beer);
  (await visibleIds(page)).forEach(id => allIds.add(id));
  await assertVisibleStructures(page, 'desktop beer');

  assert.equal(allIds.size, 51, `desktop tabs expose ${allIds.size}/51 unique compounds`);
  assert.deepEqual([...allIds].sort(), [...STRUCTURE_IDS].sort(), 'desktop tabs do not expose the exact 51-compound ledger');

  await page.locator('[data-tab="sake"]').click();
  await waitForCards(page, EXPECTED_COUNTS.sake);
  const card = page.locator('#compound-4vg');

  await card.hover();
  await page.waitForFunction(() => document.querySelector('#compound-4vg')?.classList.contains('hover-revealed'));
  assert.equal(await card.getAttribute('aria-expanded'), 'false', 'hover must not pin/expand aria state');

  await card.click();
  await page.waitForFunction(() => {
    const card = document.querySelector('#compound-4vg');
    return card?.classList.contains('revealed') && card.getAttribute('aria-expanded') === 'true';
  });
  assert.equal(await card.getAttribute('aria-expanded'), 'true', 'first click should pin 4VG open');

  await card.click();
  await page.waitForFunction(() => {
    const card = document.querySelector('#compound-4vg');
    return card && !card.classList.contains('revealed') && !card.classList.contains('hover-revealed') && card.getAttribute('aria-expanded') === 'false';
  });
  await waitForFrontTransform(page, '4vg');
  assert.equal(await card.getAttribute('aria-expanded'), 'false', 'second click should close 4VG');

  await page.mouse.move(10, 10);
  await card.hover();
  await page.waitForFunction(() => document.querySelector('#compound-4vg')?.classList.contains('hover-revealed'));

  await page.screenshot({ path: 'qa-artifacts/aroma-lab-desktop.png', fullPage: true });
  finishDiagnostics();
  await browser.close();
  console.log('PASS desktop Chromium: counts, 51 unique compounds, SVG centering, and 4VG hover/click reset');
}

async function testIPhone() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  const finishDiagnostics = attachDiagnostics(page, 'iphone-webkit');

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await waitForCards(page, EXPECTED_COUNTS.sake);
  await assertAllStructureAssets(page, 'iPhone WebKit structure assets');
  await waitForCardStructureDecoded(page, 'ethyl-acetate', 'iPhone initial viewport');

  const cards = page.locator('#cards .card');
  const firstBox = await cards.nth(0).boundingBox();
  const secondBox = await cards.nth(1).boundingBox();
  assert(firstBox && secondBox, 'iPhone card bounding boxes unavailable');
  assert(Math.abs(firstBox.x - secondBox.x) < 2, 'iPhone cards should be single-column aligned');
  assert(secondBox.y > firstBox.y + 500, 'iPhone cards should stack vertically at the 520px mobile card height');

  const card = page.locator('#compound-4vg');
  await card.tap();
  await page.waitForFunction(() => {
    const card = document.querySelector('#compound-4vg');
    return card?.classList.contains('revealed') && card.getAttribute('aria-expanded') === 'true';
  });
  await waitForCardStructureDecoded(page, '4vg', 'iPhone revealed card');
  assert.equal(await card.getAttribute('aria-expanded'), 'true', 'iPhone first tap should reveal 4VG');

  const revealedFaces = await card.evaluate(element => {
    const front = element.querySelector('.front');
    const back = element.querySelector('.back-face');
    return {
      frontDisplay: getComputedStyle(front).display,
      backDisplay: getComputedStyle(back).display,
      backTransform: getComputedStyle(back).transform
    };
  });
  assert.equal(revealedFaces.frontDisplay, 'none', 'iPhone revealed state must explicitly hide the front face');
  assert.notEqual(revealedFaces.backDisplay, 'none', 'iPhone revealed state must explicitly show the back face');
  assert.equal(revealedFaces.backTransform, 'none', 'iPhone revealed back face must not be mirrored by a 3D transform');
  await card.screenshot({ path: 'qa-artifacts/aroma-lab-iphone-4vg-revealed.png' });

  await card.tap();
  await page.waitForFunction(() => {
    const card = document.querySelector('#compound-4vg');
    return card && !card.classList.contains('revealed') && card.getAttribute('aria-expanded') === 'false';
  });
  await waitForFrontTransform(page, '4vg');
  assert.equal(await card.getAttribute('aria-expanded'), 'false', 'iPhone second tap should close 4VG');
  assert.equal(await card.evaluate(el => el.classList.contains('hover-revealed')), false, 'touch mode must not leave a hover-revealed state');

  const closedFaces = await card.evaluate(element => {
    const front = element.querySelector('.front');
    const back = element.querySelector('.back-face');
    return {
      frontDisplay: getComputedStyle(front).display,
      frontTransform: getComputedStyle(front).transform,
      backDisplay: getComputedStyle(back).display
    };
  });
  assert.notEqual(closedFaces.frontDisplay, 'none', 'iPhone closed state must explicitly show the front face');
  assert.equal(closedFaces.frontTransform, 'none', 'iPhone closed front face must not be mirrored by a 3D transform');
  assert.equal(closedFaces.backDisplay, 'none', 'iPhone closed state must explicitly hide the back face');
  await card.screenshot({ path: 'qa-artifacts/aroma-lab-iphone-4vg-front.png' });

  finishDiagnostics();
  await browser.close();
  console.log('PASS iPhone WebKit: one-column layout, lazy-loaded structure reveal, explicit face switching, and 4VG tap reset');
}

await testDesktop();
await testIPhone();
console.log('AROMA LAB BROWSER QA: PASS');
