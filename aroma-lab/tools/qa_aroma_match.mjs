import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';

const BASE = process.env.AROMA_MATCH_BASE || 'http://127.0.0.1:4173/aroma-lab/aroma-match/';
const REQUIRED_FIRST_ROUND = ['ethyl-acetate','isoamyl-acetate','4vg','dms'];

function attachDiagnostics(page, label) {
  const pageErrors = [];
  const badResponses = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  return () => {
    assert.deepEqual(pageErrors, [], `${label}: page errors: ${pageErrors.join(' | ')}`);
    assert.deepEqual(badResponses, [], `${label}: bad same-origin responses: ${badResponses.join(' | ')}`);
  };
}

async function waitForRound(page) {
  await page.waitForFunction(() =>
    document.querySelectorAll('#compoundColumn .compound-card').length === 6 &&
    document.querySelectorAll('#aromaColumn .aroma-card').length === 6
  );
}

async function assertBeginnerUniqueness(page, label) {
  const result = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('#compoundColumn .compound-card')].map(button => button.dataset.compoundId);
    const compounds = new Map(window.AROMA_MATCH_DATA.compounds.map(compound => [compound.id, compound]));
    const seen = new Map();
    const overlaps = [];
    ids.forEach(id => {
      const compound = compounds.get(id);
      compound.aromaIds.forEach(aromaId => {
        if (seen.has(aromaId)) overlaps.push(`${aromaId}: ${seen.get(aromaId)} / ${id}`);
        else seen.set(aromaId, id);
      });
    });
    return { ids, overlaps };
  });

  assert.equal(result.ids.length, 6, `${label}: round must contain six compounds`);
  assert.deepEqual(result.overlaps, [], `${label}: BEGINNER aroma concepts overlap: ${result.overlaps.join(' | ')}`);
  return result.ids;
}

async function assertFirstRoundExamples(page, label) {
  const ids = await page.locator('#compoundColumn .compound-card').evaluateAll(buttons => buttons.map(button => button.dataset.compoundId));
  for (const id of REQUIRED_FIRST_ROUND) {
    assert(ids.includes(id), `${label}: first round missing required example ${id}`);
  }
}

async function assertAromaImagesDecoded(page, label) {
  const images = page.locator('#aromaColumn img');
  const count = await images.count();
  assert(count >= 6, `${label}: expected at least six aroma images, got ${count}`);
  for (let i = 0; i < count; i += 1) {
    const image = images.nth(i);
    await image.scrollIntoViewIfNeeded();
    await page.waitForFunction(index => {
      const img = document.querySelectorAll('#aromaColumn img')[index];
      return Boolean(img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
    }, i, { timeout: 5000 });
  }
}

async function makeOneWrongMatch(page, useTap) {
  const left = page.locator('#compoundColumn .compound-card').first();
  const leftId = await left.getAttribute('data-compound-id');
  const wrongRight = page.locator(`#aromaColumn .aroma-card:not([data-owner-id="${leftId}"])`).first();
  if (useTap) {
    await left.tap();
    await wrongRight.tap();
  } else {
    await left.click();
    await wrongRight.click();
  }
  await page.waitForFunction(() => document.getElementById('missValue')?.textContent === '1');
  await page.waitForTimeout(480);
  assert.equal(await page.locator('.match-card.selected').count(), 0, 'wrong match must clear both selections');
  assert.equal(await page.locator('.match-card.wrong').count(), 0, 'wrong feedback class must clear');
}

async function solveRound(page, useTap) {
  const ids = await page.locator('#compoundColumn .compound-card').evaluateAll(buttons => buttons.map(button => button.dataset.compoundId));
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    const left = page.locator(`#compoundColumn .compound-card[data-compound-id="${id}"]`);
    const right = page.locator(`#aromaColumn .aroma-card[data-owner-id="${id}"]`);
    if (useTap) {
      await left.tap();
      await right.tap();
    } else {
      await left.click();
      await right.click();
    }

    await page.waitForFunction(expected => Number(document.getElementById('matchCount')?.textContent) === expected, index + 1);
    assert.equal(await page.locator('#connectionLayer .connection-path').count(), index + 1, `connection count after match ${index + 1}`);

    if (index === 0) {
      await page.waitForFunction(() => document.getElementById('structureFlash')?.classList.contains('show'));
      const structure = page.locator('#structureImage');
      await page.waitForFunction(() => {
        const image = document.getElementById('structureImage');
        return Boolean(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
      }, { timeout: 5000 });
      const src = await structure.getAttribute('src');
      assert(src?.includes(`/assets/structures/${id}.svg`) || src?.includes(`../assets/structures/${id}.svg`), `structure flash src for ${id}`);
    }
  }

  await page.waitForFunction(() => !document.getElementById('resultLayer')?.hasAttribute('hidden'), { timeout: 3000 });
  assert.equal(await page.locator('#matchCount').textContent(), '6');
  assert.equal(await page.locator('#resultMiss').textContent(), '1');
  const score = Number(await page.locator('#scoreValue').textContent());
  assert(Number.isFinite(score) && score >= 100, `score should be numeric, got ${score}`);
}

async function assertReplay(page, useTap) {
  const replay = page.locator('#replayButton');
  if (useTap) await replay.tap();
  else await replay.click();
  await waitForRound(page);
  await page.waitForFunction(() => document.getElementById('resultLayer')?.hasAttribute('hidden'));
  assert.equal(await page.locator('#matchCount').textContent(), '0');
  assert.equal(await page.locator('#missValue').textContent(), '0');
  assert.equal(await page.locator('#connectionLayer .connection-path').count(), 0);
  await assertBeginnerUniqueness(page, 'replay');
}

async function testChromium() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const finishDiagnostics = attachDiagnostics(page, 'chromium');

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await waitForRound(page);
  await assertFirstRoundExamples(page, 'chromium');
  await assertBeginnerUniqueness(page, 'chromium');
  await assertAromaImagesDecoded(page, 'chromium');
  await makeOneWrongMatch(page, false);
  await solveRound(page, false);
  await page.screenshot({ path: 'qa-artifacts/aroma-match-chromium-clear.png', fullPage: true });
  await assertReplay(page, false);

  finishDiagnostics();
  await browser.close();
  console.log('PASS AROMA MATCH Chromium: unique 6-pair round, wrong feedback, structure flash, locked connections, score, and replay');
}

async function testIPhoneWebKit() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  const finishDiagnostics = attachDiagnostics(page, 'iphone-webkit');

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await waitForRound(page);
  await assertFirstRoundExamples(page, 'iphone-webkit');
  await assertBeginnerUniqueness(page, 'iphone-webkit');
  await assertAromaImagesDecoded(page, 'iphone-webkit');

  const viewport = await page.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert(viewport.scrollWidth <= viewport.innerWidth + 1, `iPhone horizontal overflow: ${viewport.scrollWidth} > ${viewport.innerWidth}`);

  const board = await page.locator('#matchBoard').boundingBox();
  const left = await page.locator('#compoundColumn').boundingBox();
  const right = await page.locator('#aromaColumn').boundingBox();
  assert(board && left && right, 'iPhone match board bounding boxes unavailable');
  assert(left.x < right.x, 'iPhone columns must stay left/right');
  assert(right.x < board.x + board.width, 'iPhone right column must fit in board');

  await makeOneWrongMatch(page, true);
  await solveRound(page, true);
  await page.screenshot({ path: 'qa-artifacts/aroma-match-iphone-webkit-clear.png', fullPage: true });
  await assertReplay(page, true);

  finishDiagnostics();
  await browser.close();
  console.log('PASS AROMA MATCH iPhone 13 WebKit: portrait two-column touch UX, no horizontal overflow, full round, and replay');
}

await testChromium();
await testIPhoneWebKit();
console.log('AROMA MATCH BROWSER QA: PASS');
