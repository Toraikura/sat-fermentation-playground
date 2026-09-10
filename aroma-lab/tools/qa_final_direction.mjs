import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';

const BASE = process.env.AROMA_LAB_BASE || 'http://127.0.0.1:4173/aroma-lab/';

function diagnostics(page, label) {
  const errors = [];
  const bad = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('response', response => {
    if (response.url().startsWith(BASE) && response.status() >= 400) bad.push(`${response.status()} ${response.url()}`);
  });
  return () => {
    assert.deepEqual(errors, [], `${label}: JS errors: ${errors.join(' | ')}`);
    assert.deepEqual(bad, [], `${label}: bad same-origin responses: ${bad.join(' | ')}`);
  };
}

async function waitForSake(page) {
  await page.waitForFunction(() => document.querySelectorAll('#cards .card[data-name-first-ready="1"]').length === 19);
}

async function assertNoOverflow(page, label) {
  const result = await page.evaluate(() => ({ scrollWidth:document.documentElement.scrollWidth, innerWidth:window.innerWidth }));
  assert(result.scrollWidth <= result.innerWidth + 1, `${label}: horizontal overflow ${result.scrollWidth} > ${result.innerWidth}`);
}

async function assertFinalShell(page, label) {
  await assertNoOverflow(page, label);
  assert.equal((await page.locator('.hero h1').innerText()).replace(/\s+/g, ' ').trim(), 'AROMA LABO', `${label}: hero must say AROMA LABO`);
  assert.equal((await page.locator('.brand-context small').innerText()).trim(), 'AROMA LABO / 01', `${label}: header context must say AROMA LABO`);
  assert.equal((await page.locator('.explore-label').innerText()).trim(), 'AROMA LABO / EXPLORE', `${label}: explore label must say AROMA LABO`);
  assert((await page.locator('.lab-mode-entry').innerText()).includes('AROMA LABO / GAME MODE'), `${label}: AROMA MATCH must be presented as AROMA LABO game mode`);
  assert((await page.locator('footer').innerText()).includes('AROMA LABO'), `${label}: footer must say AROMA LABO`);

  const colors = await page.evaluate(() => {
    const bg = selector => getComputedStyle(document.querySelector(selector)).backgroundColor;
    return {
      hero:bg('.hero'),
      portal:bg('.lab-mode-entry'),
      lab:bg('.lab'),
      front:bg('#cards .front'),
      aroma:bg('#cards .aroma-stage'),
      molecule:bg('#cards .molecule-stage'),
      drinks:bg('#cards .drinks-stage')
    };
  });
  assert.notEqual(colors.hero, 'rgb(23, 21, 28)', `${label}: hero should remain light`);
  assert.equal(colors.portal, 'rgb(37, 32, 50)', `${label}: AROMA MATCH portal must be SAT deep purple`);
  assert.notEqual(colors.lab, 'rgb(23, 21, 28)', `${label}: explore workspace must remain light`);
  assert.notEqual(colors.front, 'rgb(23, 21, 28)', `${label}: cards must remain light`);
  assert.notEqual(colors.aroma, 'rgb(23, 21, 28)', `${label}: aroma stage must remain light`);
  assert.notEqual(colors.molecule, 'rgb(23, 21, 28)', `${label}: molecule stage must remain light`);
  assert.notEqual(colors.drinks, 'rgb(23, 21, 28)', `${label}: across-drinks stage must remain light`);

  const hintVisible = await page.locator('#cards .name-front-foot > span:first-child').first().evaluate(el => {
    const style = getComputedStyle(el);
    return style.opacity === '1' && style.visibility !== 'hidden' && style.display !== 'none';
  });
  assert.equal(hintVisible, true, `${label}: permanent chemistry hint must remain visible`);

  const matchHref = await page.locator('.lab-mode-link').getAttribute('href');
  assert.equal(matchHref, './aroma-match/', `${label}: AROMA MATCH route changed unexpectedly`);
}

async function testDesktop() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 }, deviceScaleFactor:1 });
  const finish = diagnostics(page, 'final desktop');
  await page.goto(BASE, { waitUntil:'networkidle' });
  await waitForSake(page);
  await assertFinalShell(page, 'final desktop');

  await page.locator('.hero').screenshot({ path:'qa-artifacts/aroma-labo-final-desktop-hero.png' });
  await page.locator('.lab-mode-entry').screenshot({ path:'qa-artifacts/aroma-labo-final-desktop-aroma-match-entry.png' });

  const card = page.locator('#compound-4vg');
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path:'qa-artifacts/aroma-labo-final-desktop-cards.png', fullPage:false });
  await card.hover();
  await page.waitForFunction(() => document.querySelector('#compound-4vg')?.classList.contains('hover-revealed'));
  await card.click();
  await page.waitForFunction(() => document.querySelector('#compound-4vg')?.classList.contains('pinned'));

  const expandedState = await card.evaluate(el => ({
    aromaImages:[...el.querySelectorAll('.aroma-stage .final-aroma-img')].map(img => img.complete && img.naturalWidth > 0),
    structure:Boolean(el.querySelector('.final-structure img')?.complete && el.querySelector('.final-structure img')?.naturalWidth > 0),
    drinks:[...el.querySelectorAll('.drink-ref.on')].length
  }));
  assert(expandedState.aromaImages.length > 0 && expandedState.aromaImages.every(Boolean), 'desktop 4VG aroma images failed');
  assert.equal(expandedState.structure, true, 'desktop 4VG structure failed');
  assert(expandedState.drinks > 0, 'desktop 4VG across-drink display failed');
  await card.screenshot({ path:'qa-artifacts/aroma-labo-final-desktop-expanded-4vg.png' });

  const matchPage = await browser.newPage({ viewport:{ width:1200, height:900 } });
  await matchPage.goto(new URL('aroma-match/', BASE).href, { waitUntil:'networkidle' });
  assert((await matchPage.locator('.brand').innerText()).includes('AROMA LABO'), 'AROMA MATCH parent brand must say AROMA LABO');
  assert((await matchPage.locator('.expert-note').innerText()).includes('AROMA LABO'), 'AROMA MATCH relation copy must say AROMA LABO');
  await matchPage.close();

  finish();
  await browser.close();
  console.log('PASS final desktop: C-led light shell, B-style AROMA MATCH portal, AROMA LABO naming, 4VG expanded content, no overflow');
}

async function testIPhone() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  const finish = diagnostics(page, 'final iPhone');
  await page.goto(BASE, { waitUntil:'networkidle' });
  await waitForSake(page);
  await assertFinalShell(page, 'final iPhone');
  assert.equal(await page.evaluate(() => innerWidth), 390, 'iPhone QA must run at 390 CSS px');

  await page.locator('.hero').screenshot({ path:'qa-artifacts/aroma-labo-final-iphone-hero.png' });
  await page.locator('.lab-mode-entry').screenshot({ path:'qa-artifacts/aroma-labo-final-iphone-aroma-match-entry.png' });

  const card = page.locator('#compound-4vg');
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path:'qa-artifacts/aroma-labo-final-iphone-cards.png', fullPage:false });
  await card.tap();
  await page.waitForFunction(() => document.querySelector('#mobileCardModal')?.classList.contains('open') && document.querySelector('#mobileCardModal .mobile-expanded-card')?.classList.contains('is-flipped'));
  await page.waitForTimeout(700);
  await assertNoOverflow(page, 'final iPhone expanded');

  const expanded = page.locator('#mobileCardModal .mobile-expanded-card');
  const state = await expanded.evaluate(el => {
    const back = el.querySelector('.back-face');
    const structure = el.querySelector('.final-structure img');
    const aroma = [...el.querySelectorAll('.aroma-stage .final-aroma-img')];
    return {
      backDisplay:getComputedStyle(back).display,
      backTransform:getComputedStyle(back).transform,
      aromaOk:aroma.length > 0 && aroma.every(img => img.complete && img.naturalWidth > 0),
      structureOk:Boolean(structure && structure.complete && structure.naturalWidth > 0),
      drinks:el.querySelectorAll('.drink-ref.on').length,
      width:el.getBoundingClientRect().width,
      viewport:innerWidth
    };
  });
  assert.notEqual(state.backDisplay, 'none', 'iPhone expanded back face must be visible');
  assert.equal(state.aromaOk, true, 'iPhone 4VG aroma images failed');
  assert.equal(state.structureOk, true, 'iPhone 4VG structure failed');
  assert(state.drinks > 0, 'iPhone 4VG across-drink display failed');
  assert(state.width <= state.viewport - 20, `iPhone expanded card too wide: ${state.width}/${state.viewport}`);
  await page.locator('#mobileCardModal').screenshot({ path:'qa-artifacts/aroma-labo-final-iphone-expanded-4vg.png' });
  await page.locator('.mobile-card-close').tap();
  await page.waitForFunction(() => !document.querySelector('#mobileCardModal')?.classList.contains('open'));

  finish();
  await browser.close();
  console.log('PASS final iPhone 390: hero, dark AROMA MATCH entry, compact cards, readable 4VG expanded aroma/structure/across-drinks, no overflow');
}

await testDesktop();
await testIPhone();
console.log('AROMA LABO FINAL DIRECTION QA: PASS');
