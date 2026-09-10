import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';

const BASE = process.env.AROMA_LAB_BASE || 'http://127.0.0.1:4173/aroma-lab/';

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

async function assertNoHorizontalOverflow(page, label) {
  const geometry = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    documentClientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth
  }));
  assert(
    geometry.documentScrollWidth <= geometry.documentClientWidth + 1,
    `${label}: document horizontal overflow ${JSON.stringify(geometry)}`
  );
  assert(
    geometry.bodyScrollWidth <= geometry.documentClientWidth + 1,
    `${label}: body horizontal overflow ${JSON.stringify(geometry)}`
  );
}

async function testDesktopVisualDirection() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 }, deviceScaleFactor:1 });
  const finishDiagnostics = attachDiagnostics(page, 'visual-desktop');

  await page.goto(BASE, { waitUntil:'networkidle' });
  await page.waitForSelector('#cards .card');
  await assertNoHorizontalOverflow(page, 'desktop');

  const visual = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const mode = document.querySelector('.lab-mode-entry');
    const firstFace = document.querySelector('#cards .card .face');
    const specimen = document.querySelector('.name-first-specimen');
    const matchLink = document.querySelector('.lab-mode-link');
    return {
      heroBackground:getComputedStyle(hero).backgroundColor,
      modeBackground:getComputedStyle(mode).backgroundColor,
      cardRadius:parseFloat(getComputedStyle(firstFace).borderRadius),
      cardShadow:getComputedStyle(firstFace).boxShadow,
      specimenTransform:getComputedStyle(specimen).transform,
      matchHref:matchLink?.getAttribute('href') || '',
      canonical:document.querySelector('link[rel="canonical"]')?.href || ''
    };
  });

  assert.equal(visual.heroBackground, 'rgb(23, 21, 28)', 'desktop hero must use SAT ink');
  assert.equal(visual.modeBackground, 'rgb(37, 32, 50)', 'AROMA MATCH entry must use SAT deep purple');
  assert(visual.cardRadius <= 4.1, `desktop aroma cards must stay restrained, got radius ${visual.cardRadius}`);
  assert.equal(visual.cardShadow, 'none', 'desktop aroma cards must not use offset shadows');
  assert.notEqual(visual.specimenTransform, 'none', 'hero specimen must keep its intentional tilt');
  assert.equal(visual.matchHref, './aroma-match/', 'AROMA MATCH must remain an internal AROMA LAB mode');
  assert.equal(visual.canonical, 'https://sakearttokyo.com/playground/aroma-lab/', 'canonical must stay on final SAT URL');

  await page.screenshot({ path:'qa-artifacts/aroma-lab-desktop-hero.png', fullPage:false });
  finishDiagnostics();
  await browser.close();
  console.log('PASS AROMA LAB visual desktop: SAT palette, restrained cards, tilted specimen, internal AROMA MATCH entry, canonical, no horizontal overflow');
}

async function testIPhoneVisualDirection() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  const finishDiagnostics = attachDiagnostics(page, 'visual-iphone');

  await page.goto(BASE, { waitUntil:'networkidle' });
  await page.waitForSelector('#cards .card');
  await assertNoHorizontalOverflow(page, 'iPhone initial');

  const topGeometry = await page.evaluate(() => {
    const specimen = document.querySelector('.name-first-specimen')?.getBoundingClientRect();
    const mode = document.querySelector('.lab-mode-link')?.getBoundingClientRect();
    return {
      specimen:specimen ? { left:specimen.left, right:specimen.right, width:specimen.width } : null,
      mode:mode ? { left:mode.left, right:mode.right, width:mode.width } : null,
      viewport:window.innerWidth
    };
  });
  assert(topGeometry.specimen, 'iPhone specimen geometry missing');
  assert(topGeometry.specimen.left >= -1 && topGeometry.specimen.right <= topGeometry.viewport + 1, `iPhone specimen escapes viewport: ${JSON.stringify(topGeometry)}`);
  assert(topGeometry.mode, 'iPhone AROMA MATCH entry geometry missing');
  assert(topGeometry.mode.left >= -1 && topGeometry.mode.right <= topGeometry.viewport + 1, `iPhone AROMA MATCH entry escapes viewport: ${JSON.stringify(topGeometry)}`);

  await page.screenshot({ path:'qa-artifacts/aroma-lab-iphone-hero.png', fullPage:false });

  const card = page.locator('#compound-4vg');
  await card.scrollIntoViewIfNeeded();
  await card.tap();
  await page.waitForFunction(() => document.getElementById('mobileCardModal')?.classList.contains('open'));
  await page.waitForTimeout(700);
  await assertNoHorizontalOverflow(page, 'iPhone modal');

  const modalGeometry = await page.evaluate(() => {
    const dialog = document.querySelector('#mobileCardModal .mobile-card-dialog')?.getBoundingClientRect();
    const expanded = document.querySelector('#mobileCardModal .mobile-expanded-card')?.getBoundingClientRect();
    return {
      dialog:dialog ? { left:dialog.left, right:dialog.right, width:dialog.width } : null,
      expanded:expanded ? { left:expanded.left, right:expanded.right, width:expanded.width } : null,
      viewport:window.innerWidth
    };
  });
  assert(modalGeometry.dialog && modalGeometry.expanded, `iPhone modal geometry missing: ${JSON.stringify(modalGeometry)}`);
  assert(modalGeometry.dialog.left >= -1 && modalGeometry.dialog.right <= modalGeometry.viewport + 1, `iPhone dialog escapes viewport: ${JSON.stringify(modalGeometry)}`);
  assert(modalGeometry.expanded.left >= -1 && modalGeometry.expanded.right <= modalGeometry.viewport + 1, `iPhone expanded card escapes viewport: ${JSON.stringify(modalGeometry)}`);

  await page.locator('.mobile-card-close').tap();
  await page.waitForFunction(() => !document.getElementById('mobileCardModal')?.classList.contains('open'));

  finishDiagnostics();
  await browser.close();
  console.log('PASS AROMA LAB visual iPhone: hero/specimen/mode entry/modal fit viewport with no horizontal overflow');
}

await testDesktopVisualDirection();
await testIPhoneVisualDirection();
console.log('AROMA LAB VISUAL DIRECTION QA: PASS');
