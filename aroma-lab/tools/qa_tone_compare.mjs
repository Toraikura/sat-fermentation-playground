import assert from 'node:assert/strict';
import { chromium, webkit, devices } from 'playwright';

const ORIGIN = process.env.AROMA_LAB_ORIGIN || 'http://127.0.0.1:4173';
const FINAL_CANONICAL = 'https://sakearttokyo.com/playground/aroma-lab/';
const VARIANTS = {
  b:{ path:'/aroma-lab/preview/b/', label:'B' },
  c:{ path:'/aroma-lab/preview/c/', label:'C' }
};

function attachDiagnostics(page, label) {
  const pageErrors = [];
  const badResponses = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('response', response => {
    if (response.url().startsWith(ORIGIN) && response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  return () => {
    assert.deepEqual(pageErrors, [], `${label}: JS/page errors: ${pageErrors.join(' | ')}`);
    assert.deepEqual(badResponses, [], `${label}: bad same-origin responses: ${badResponses.join(' | ')}`);
  };
}

async function assertNoHorizontalOverflow(page, label) {
  const geometry = await page.evaluate(() => ({
    innerWidth:window.innerWidth,
    clientWidth:document.documentElement.clientWidth,
    docScrollWidth:document.documentElement.scrollWidth,
    bodyScrollWidth:document.body.scrollWidth
  }));
  assert(geometry.docScrollWidth <= geometry.clientWidth + 1, `${label}: document overflow ${JSON.stringify(geometry)}`);
  assert(geometry.bodyScrollWidth <= geometry.clientWidth + 1, `${label}: body overflow ${JSON.stringify(geometry)}`);
}

async function assertCoreContent(page, key, label) {
  await page.waitForSelector('#cards .card');
  assert.equal(await page.locator('#cards .card').count(), 19, `${label}: initial SAKE count changed`);
  assert(await page.locator('#compound-4vg').count() === 1, `${label}: 4VG card missing`);

  const metadata = await page.evaluate(() => ({
    canonical:document.querySelector('link[rel="canonical"]')?.href || '',
    robots:document.querySelector('meta[name="robots"]')?.content || '',
    matchHref:document.querySelector('.lab-mode-link')?.getAttribute('href') || '',
    matchResolved:document.querySelector('.lab-mode-link')?.href || '',
    hintDisplay:getComputedStyle(document.getElementById('hintToggle')).display,
    chemistryText:document.querySelector('#cards .name-front-foot > span:first-child')?.textContent?.trim() || ''
  }));
  assert.equal(metadata.canonical, FINAL_CANONICAL, `${label}: canonical changed`);
  assert(metadata.robots.includes('noindex'), `${label}: preview is indexable`);
  assert.equal(metadata.matchHref, './aroma-match/', `${label}: AROMA MATCH href changed`);
  assert(metadata.matchResolved.endsWith('/aroma-lab/aroma-match/'), `${label}: AROMA MATCH resolves outside AROMA LAB`);
  assert.equal(metadata.hintDisplay, 'none', `${label}: permanent Chemistry Hint behavior changed`);
  assert(metadata.chemistryText.length > 0, `${label}: Chemistry Hint/family label missing`);

  const matchResponse = await page.request.get(metadata.matchResolved);
  assert.equal(matchResponse.status(), 200, `${label}: AROMA MATCH target is not reachable`);

  const expectedTone = await page.evaluate(k => document.body.dataset.tone, key);
  assert.equal(expectedTone, key, `${label}: tone marker mismatch`);
}

async function testTabs(page, label) {
  await page.locator('.tab[data-tab="shochu"]').click();
  await page.waitForFunction(() => document.getElementById('sectionTitle')?.textContent.includes('焼酎'));
  assert.equal(await page.locator('#cards .card').count(), 20, `${label}: shochu tab count changed`);
  await page.locator('.tab[data-tab="sake"]').click();
  await page.waitForFunction(() => document.getElementById('sectionTitle')?.textContent.includes('日本酒'));
  assert.equal(await page.locator('#cards .card').count(), 19, `${label}: sake tab did not restore`);
}

async function assertExpandedContent(card, label) {
  const content = await card.evaluate(el => {
    const aromaImages = [...el.querySelectorAll('.aroma-stage .final-aroma-img')];
    const structure = el.querySelector('.final-structure img');
    const activeDrinks = el.querySelectorAll('.drink-ref.on').length;
    return {
      aromaCount:aromaImages.length,
      aromaLoaded:aromaImages.every(img => img.complete && img.naturalWidth > 0),
      structureLoaded:!!structure && structure.complete && structure.naturalWidth > 0,
      activeDrinks,
      stageLabels:[...el.querySelectorAll('.stage-label')].map(n => n.textContent.trim())
    };
  });
  assert(content.aromaCount >= 1 && content.aromaLoaded, `${label}: aroma image missing or not decoded`);
  assert(content.structureLoaded, `${label}: molecular structure missing or not decoded`);
  assert(content.activeDrinks >= 2, `${label}: cross-drink display missing for 4VG`);
  assert.deepEqual(content.stageLabels, ['01 / AROMA','02 / MOLECULE','03 / ACROSS DRINKS'], `${label}: expanded information hierarchy changed`);
}

async function assertDesktopTone(page, key, label) {
  const tone = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const mode = document.querySelector('.lab-mode-entry');
    const front = document.querySelector('#cards .front');
    return {
      heroBg:getComputedStyle(hero).backgroundColor,
      modeBg:getComputedStyle(mode).backgroundColor,
      radius:parseFloat(getComputedStyle(front).borderRadius),
      shadow:getComputedStyle(front).boxShadow
    };
  });
  if (key === 'b') {
    assert.equal(tone.heroBg, 'rgb(23, 21, 28)', `${label}: B must preserve dark CURRENT hero`);
    assert.equal(tone.modeBg, 'rgb(37, 32, 50)', `${label}: B AROMA MATCH entry must stay deep purple`);
    assert(tone.radius <= 4.1, `${label}: B cards should stay editorial/flat`);
    assert.equal(tone.shadow, 'none', `${label}: B cards should not regain tactile shadow`);
  } else {
    assert.equal(tone.heroBg, 'rgb(243, 239, 227)', `${label}: C hero must return to light cream`);
    assert.notEqual(tone.modeBg, 'rgb(37, 32, 50)', `${label}: C AROMA MATCH entry is too dark`);
    assert(tone.radius >= 10, `${label}: C cards lost tactile rounded presence`);
    assert.notEqual(tone.shadow, 'none', `${label}: C cards lost refined tactile shadow`);
  }
}

async function testDesktop(key) {
  const variant = VARIANTS[key];
  const label = `tone-${key}-desktop`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{ width:1440, height:1120 }, deviceScaleFactor:1 });
  const finishDiagnostics = attachDiagnostics(page, label);

  await page.goto(ORIGIN + variant.path, { waitUntil:'networkidle' });
  await assertCoreContent(page, key, label);
  await assertNoHorizontalOverflow(page, label);
  await assertDesktopTone(page, key, label);

  await page.locator('.hero').screenshot({ path:`qa-artifacts/tone-${key}-desktop-hero.png` });
  await page.evaluate(() => window.scrollTo(0,0));
  await page.screenshot({ path:`qa-artifacts/tone-${key}-desktop-hero-match.png`, fullPage:false });

  await testTabs(page, label);
  const firstCard = page.locator('#cards .card').first();
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  await page.screenshot({ path:`qa-artifacts/tone-${key}-desktop-cards.png`, fullPage:false });

  const card = page.locator('#compound-4vg');
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await page.waitForFunction(() => document.getElementById('compound-4vg')?.classList.contains('hover-revealed'));
  await page.mouse.move(0,0);
  await page.waitForFunction(() => !document.getElementById('compound-4vg')?.classList.contains('hover-revealed'));
  await card.click();
  await page.waitForFunction(() => {
    const card = document.getElementById('compound-4vg');
    return card?.classList.contains('revealed') && card?.classList.contains('pinned');
  });
  await page.waitForTimeout(650);
  await assertExpandedContent(card, label);
  await card.screenshot({ path:`qa-artifacts/tone-${key}-desktop-expanded-4vg.png` });

  finishDiagnostics();
  await browser.close();
  console.log(`PASS ${variant.label} desktop: no overflow, tabs, Chemistry Hint, hover reveal, click pin, 4VG aroma/structure/cross-drink, AROMA MATCH link, no JS errors`);
}

async function testIPhone(key) {
  const variant = VARIANTS[key];
  const label = `tone-${key}-iphone`;
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  const finishDiagnostics = attachDiagnostics(page, label);

  await page.goto(ORIGIN + variant.path, { waitUntil:'networkidle' });
  await assertCoreContent(page, key, label);
  await assertNoHorizontalOverflow(page, `${label}-initial`);

  await page.locator('.hero').screenshot({ path:`qa-artifacts/tone-${key}-iphone-hero.png` });
  await page.locator('.lab-mode-entry').scrollIntoViewIfNeeded();
  await page.locator('.lab-mode-entry').screenshot({ path:`qa-artifacts/tone-${key}-iphone-aroma-match.png` });

  await testTabs(page, label);
  const firstCard = page.locator('#cards .card').first();
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await assertNoHorizontalOverflow(page, `${label}-cards`);
  await page.screenshot({ path:`qa-artifacts/tone-${key}-iphone-cards.png`, fullPage:false });

  const card = page.locator('#compound-4vg');
  await card.scrollIntoViewIfNeeded();
  await card.tap();
  await page.waitForFunction(() => document.getElementById('mobileCardModal')?.classList.contains('open'));
  await page.waitForTimeout(720);
  await assertNoHorizontalOverflow(page, `${label}-modal`);

  const modalCard = page.locator('#mobileCardModal .mobile-expanded-card');
  await assertExpandedContent(modalCard, label);
  const geometry = await page.evaluate(() => {
    const dialog = document.querySelector('#mobileCardModal .mobile-card-dialog')?.getBoundingClientRect();
    const expanded = document.querySelector('#mobileCardModal .mobile-expanded-card')?.getBoundingClientRect();
    return { dialog, expanded, viewport:window.innerWidth };
  });
  assert(geometry.dialog && geometry.expanded, `${label}: mobile expanded geometry missing`);
  assert(geometry.dialog.left >= -1 && geometry.dialog.right <= geometry.viewport + 1, `${label}: dialog escapes viewport`);
  assert(geometry.expanded.left >= -1 && geometry.expanded.right <= geometry.viewport + 1, `${label}: expanded card escapes viewport`);
  await page.screenshot({ path:`qa-artifacts/tone-${key}-iphone-expanded-4vg.png`, fullPage:false });

  await page.locator('.mobile-card-close').tap();
  await page.waitForFunction(() => !document.getElementById('mobileCardModal')?.classList.contains('open'));
  finishDiagnostics();
  await browser.close();
  console.log(`PASS ${variant.label} iPhone: 390-class portrait, no overflow, tabs, mobile tap, 4VG expanded aroma/structure/cross-drink, AROMA MATCH link, no JS errors`);
}

for (const key of ['b','c']) {
  await testDesktop(key);
  await testIPhone(key);
}
console.log('AROMA LAB B/C TONE COMPARISON QA: PASS');
