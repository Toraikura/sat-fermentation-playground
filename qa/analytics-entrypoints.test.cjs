const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const analyticsSource = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
const entrypoints = [
  { file: 'index.html', pathname: '/sat-fermentation-playground/', group: 'FERMENTATION PLAYGROUND' },
  { file: 'aroma-lab/index.html', pathname: '/sat-fermentation-playground/aroma-lab/', group: 'AROMA LABO' },
  { file: 'aroma-lab/aroma-match/index.html', pathname: '/sat-fermentation-playground/aroma-lab/aroma-match/', group: 'AROMA MATCH' },
  { file: 'rice-lineage/index.html', pathname: '/sat-fermentation-playground/rice-lineage/', group: 'RICE LINEAGE' },
];

function analyticsCallsForDirectVisit(pathname) {
  const calls = [];
  const appendedScripts = [];
  const storage = new Map();
  const document = {
    currentScript: { src: 'https://example.test/sat-fermentation-playground/analytics.js' },
    referrer: '',
    readyState: 'loading',
    head: { appendChild: script => appendedScripts.push(script) },
    createElement: () => ({}),
    querySelector: () => null,
    addEventListener: () => {},
  };
  class Element {}
  const window = {
    dataLayer: [],
    gtag: (...args) => calls.push(args),
  };
  const sandbox = {
    window,
    document,
    location: { pathname, search: '?utm_source=direct-test' },
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    Element,
    URL,
    URLSearchParams,
    encodeURIComponent,
  };
  vm.runInNewContext(analyticsSource, sandbox, { filename: 'analytics.js' });
  assert.equal(appendedScripts.length, 2, 'only local script elements are staged; no script is executed in this mock');
  return calls;
}

for (const entry of entrypoints) {
  test(`${entry.file} includes shared analytics once and configures its direct experience`, () => {
    const html = fs.readFileSync(path.join(root, entry.file), 'utf8');
    const includes = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*(["'])([^"']*analytics\.js(?:\?[^"']*)?)\1[^>]*>/gi)];
    assert.equal(includes.length, 1, 'expected exactly one analytics.js script include');
    assert.equal(new URL(includes[0][2], 'https://example.test' + entry.pathname).pathname,
      '/sat-fermentation-playground/analytics.js', 'include should resolve to the shared analytics.js');

    const calls = analyticsCallsForDirectVisit(entry.pathname);
    const config = calls.find(call => call[0] === 'config');
    assert.ok(config, 'expected a gtag config call');
    assert.equal(config[1], 'G-3L1Q0VYVRH');
    assert.equal(config[2].content_group, entry.group);
    assert.equal(config[2].page_path, entry.pathname + '?utm_source=direct-test');

    const view = calls.find(call => call[0] === 'event' && call[1] === 'experience_view');
    assert.ok(view, 'expected direct-link experience_view');
    assert.equal(view[2].experience, entry.group);
    assert.equal(view[2].page_path, entry.pathname);
    assert.equal(view[2].landing_path, entry.pathname + '?utm_source=direct-test');
    assert.equal(calls.filter(call => call[0] === 'event').length, 1,
      'mock should record only experience_view and no real analytics event traffic');
  });
}
