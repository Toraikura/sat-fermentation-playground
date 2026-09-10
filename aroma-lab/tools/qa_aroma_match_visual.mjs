import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';

const BASE = process.env.AROMA_MATCH_BASE || 'http://127.0.0.1:4173/aroma-lab/aroma-match/';

function attachDiagnostics(page, label) {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  return () => assert.deepEqual(errors, [], `${label}: JS errors: ${errors.join(' | ')}`);
}

async function waitForCount(page, count) {
  await page.waitForFunction(expected =>
    document.querySelectorAll('#compoundColumn .compound-card').length === expected &&
    document.querySelectorAll('#aromaColumn .aroma-card').length === expected,
  count);
}

async function assertDirection(page, label) {
  const values = await page.evaluate(() => {
    const css = selector => getComputedStyle(document.querySelector(selector));
    return {
      heroBg: css('.match-hero').backgroundColor,
      boardBg: css('.game-panel').backgroundColor,
      activeModeBg: css('.mode-switch button.active').backgroundColor,
      bodyBg: css('body').backgroundColor,
      title: document.querySelector('#gameTitle')?.textContent.replace(/\s+/g, ' ').trim(),
      header: document.querySelector('.brand-context')?.textContent.replace(/\s+/g, ' ').trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });

  assert.equal(values.heroBg, 'rgb(37, 32, 50)', `${label}: hero must use SAT deep purple`);
  assert.equal(values.boardBg, 'rgb(255, 250, 240)', `${label}: board must return to light specimen paper`);
  assert.equal(values.activeModeBg, 'rgb(197, 172, 243)', `${label}: active level must use SAT lilac`);
  assert.equal(values.bodyBg, 'rgb(243, 239, 227)', `${label}: page workspace must remain light`);
  assert.match(values.title, /AROMA MATCH/, `${label}: AROMA MATCH title missing`);
  assert.match(values.header, /AROMA LABO \/ GAME MODE/, `${label}: AROMA LABO parent context missing`);
  assert(values.overflow <= 1, `${label}: horizontal overflow ${values.overflow}px`);
}

async function testDesktop() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{width:1440,height:1000}, deviceScaleFactor:1 });
  const finish = attachDiagnostics(page, 'desktop visual');
  await page.goto(BASE, {waitUntil:'networkidle'});
  await waitForCount(page, 6);
  await assertDirection(page, 'desktop');

  await page.locator('[data-game-mode="hard"]').click();
  await waitForCount(page, 8);
  assert.equal(await page.locator('#matchTotal').textContent(), '8', 'desktop: HARD must produce 8 pairs');

  await page.locator('[data-drink-filter="sake"]').click();
  await waitForCount(page, 8);
  assert.match(await page.locator('#filterStatus').textContent(), /SAKE/, 'desktop: SAKE filter must remain functional');

  await page.locator('[data-game-mode="easy"]').click();
  await waitForCount(page, 6);
  await page.locator('[data-drink-filter="all"]').click();
  await waitForCount(page, 6);
  await page.screenshot({path:'qa-artifacts/aroma-match-final-desktop.png', fullPage:true});
  finish();
  await browser.close();
  console.log('PASS AROMA MATCH final desktop visual direction + HARD/filter regression');
}

async function testIPhone() {
  const browser = await webkit.launch();
  const context = await browser.newContext({...devices['iPhone 13']});
  const page = await context.newPage();
  const finish = attachDiagnostics(page, 'iphone visual');
  await page.goto(BASE, {waitUntil:'networkidle'});
  await waitForCount(page, 6);
  await assertDirection(page, 'iPhone');

  await page.locator('[data-game-mode="hard"]').tap();
  await waitForCount(page, 8);
  assert.equal(await page.locator('#matchTotal').textContent(), '8', 'iPhone: HARD must produce 8 pairs');
  await page.locator('[data-game-mode="easy"]').tap();
  await waitForCount(page, 6);
  await page.screenshot({path:'qa-artifacts/aroma-match-final-iphone.png', fullPage:true});
  finish();
  await browser.close();
  console.log('PASS AROMA MATCH final iPhone visual direction + EASY/HARD touch regression');
}

await testDesktop();
await testIPhone();
console.log('AROMA MATCH FINAL VISUAL QA: PASS');
