import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { presentationSlides } from '../../src/lib/slides';
import { topics } from '../../src/data/topics';

const dist = path.resolve('dist');
const files = readdirSync(dist, { recursive: true }).map(String);
const pages = files.filter((file) => file.endsWith('.html')).sort();
const read = (file: string) => readFileSync(path.join(dist, file), 'utf8');
const basePath = `${(process.env.ASTRO_BASE || '/').replace(/\/$/, '')}/`;

test('the build contains exactly the three approved chapters and fourteen chosen topics', () => {
  const expected = {
    octoverse: ['momentum', 'global-growth', 'industries', 'agentic-workflows', 'model-choice', 'languages', 'open-source'],
    platform: ['stacked-pull-requests', 'cli-attachments', 'issue-artifacts', 'pull-request-overview'],
    copilot: ['fusion', 'projects', 'automations'],
  };
  assert.deepEqual(pages, [
    'index.html', '404.html', 'making-of/index.html',
    ...Object.entries(expected).flatMap(([category, ids]) => [
      `${category}/index.html`, ...ids.map((id) => `${category}/${id}/index.html`),
    ]),
  ].sort());
  const opening = read('index.html');
  assert.match(opening, /data-slide-title="Pushes to GitHub"/);
  assert.ok(opening.indexOf('id="chart-1"') < opening.indexOf('id="chart-2"'));
  assert.match(opening, /17\.9B/);
  assert.doesNotMatch(opening, /data-coverage-form|href="[^"]*\/security\/|href="[^"]*\/connectors\//);
});

test('all generated internal links, fragments, and assets resolve under the Pages base', () => {
  for (const file of pages) {
    const html = read(file);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `Duplicate id in ${file}`);
    for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|data:|mailto:)/.test(value)) continue;
      const url = new URL(value, `https://sinannar.github.io${basePath}${file.replace(/index\.html$/, '')}`);
      assert.ok(url.pathname.startsWith(basePath), `${file}: wrong base in ${value}`);
      const relative = url.pathname.slice(basePath.length);
      const target = !relative || relative.endsWith('/') ? `${relative}index.html` : relative;
      assert.ok(existsSync(path.join(dist, target)), `${file}: missing ${value}`);
      if (url.hash) assert.ok(read(target).includes(`id="${url.hash.slice(1)}"`), `${file}: missing fragment ${value}`);
    }
  }
});

test('every slide target is rendered once and optional demos do not appear on undecided topics', () => {
  for (const topic of topics) {
    const html = read(`${topic.category}/${topic.id}/index.html`);
    const slides = presentationSlides(topic);
    for (const slide of slides) assert.equal([...html.matchAll(new RegExp(`id="${slide.id}"`, 'g'))].length, 1);
    assert.equal(html.includes('id="demo"'), Boolean(topic.demo));
    assert.ok(!html.includes('data-coverage-form'));
  }
});
