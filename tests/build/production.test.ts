import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { presentationSlides } from '../../src/lib/slides';
import { topics } from '../../src/data/topics';

const dist = path.resolve('dist');
const files = readdirSync(dist, { recursive: true }).map((file) => String(file).replaceAll('\\', '/'));
const pages = files.filter((file) => file.endsWith('.html')).sort();
const read = (file: string) => readFileSync(path.join(dist, file), 'utf8');
const basePath = `${(process.env.ASTRO_BASE || '/').replace(/\/$/, '')}/`;

test('the build contains exactly the four approved chapters and nineteen chosen topics', () => {
  const expected = {
    octoverse: ['momentum', 'global-growth', 'industries', 'agentic-workflows', 'model-choice', 'languages', 'open-source'],
    platform: ['stacked-pull-requests', 'cli-attachments', 'issue-artifacts', 'pull-request-overview'],
    copilot: ['fusion', 'projects', 'automations'],
    sessions: ['stacked-prs-in-practice', 'custom-review-instructions', 'model-harness', 'factory-mindset', 'worth-building'],
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

test('making-of publishes iteration timelines with inline records and distinct cloud evidence', () => {
  const html = read('making-of/index.html');
  assert.match(html, /<ol class="creation-timeline" aria-label="Creation timeline">/);
  assert.match(html, /<li data-session-type="review">\s*<h2[^>]*>Parallel reviews · PR #1<\/h2>[\s\S]*?<ul class="creation-reviews" aria-label="Parallel reviews">\s*<li data-session-type="review">[\s\S]*?Copilot CLI · review PR #1 on the side[\s\S]*?<\/li>\s*<li data-session-type="review">[\s\S]*?Cloud code review · a second review track[\s\S]*?<\/li>\s*<\/ul>\s*<\/li>/);
  assert.equal((html.match(/<li data-session-type="change">/g) || []).length, 6);
  assert.match(html, /<li data-session-type="failure">\s*<h2[^>]*>Pages · the post-merge build failed<\/h2>/);
  const stages = [
    'Copilot app · create the presentation and PR #1',
    'Copilot CLI · review PR #1 on the side',
    'Cloud code review · a second review track',
    'Copilot app · apply corrections, then Agent Merge',
    'Pages · the post-merge build failed',
    'Cloud agent · fix the test and deploy',
  ];
  let previous = -1;
  for (const stage of stages) {
    const position = html.indexOf(stage);
    assert.ok(position > previous, `Missing or out-of-order stage: ${stage}`);
    previous = position;
  }
  for (const source of [
    '43672715559/job/132686090551',
    '43762614333/job/132960560040',
    '43762250561/job/132960129681',
    '43763557916',
  ]) assert.ok(html.includes(`https://github.com/sinannar/ghuniverse26/actions/runs/${source}`));
  assert.match(html, /not the attached transcript/);
  assert.match(html, /HTTP 404/);
  for (const summary of ['Read the Copilot CLI side-review record', 'Read the discovery conversation', 'Read the implementation plan']) {
    assert.ok(html.includes(`<summary>${summary}</summary>`));
  }
  assert.match(html, /<ol class="creation-timeline" aria-label="Iteration 02 timeline">[\s\S]*?Skills · prepare the tools[\s\S]*?Copilot CLI · plan workflows and open PR #7[\s\S]*?<li data-session-type="review">\s*<h2[^>]*>Parallel reviews · PR #7<\/h2>[\s\S]*?<ul class="creation-reviews" aria-label="Iteration 02 parallel reviews">\s*<li data-session-type="review">[\s\S]*?Copilot CLI · local review[\s\S]*?<\/li>\s*<li data-session-type="review">[\s\S]*?Cloud Code Review · issue labeler review[\s\S]*?<\/li>\s*<\/ul>\s*<\/li>[\s\S]*?Cloud agent · address review feedback/);
  for (const summary of ['Read the iteration 02 session record', 'Read the iteration 02 local CLI review', 'Read the iteration 02 cloud review', 'Read the iteration 02 discovery conversation', 'Read the iteration 02 implementation plan']) {
    assert.ok(html.includes(`<summary>${summary}</summary>`));
  }
  for (const source of ['pull/7', 'pull/7#discussion_r4580921412', 'pull/7#pullrequestreview-5913526033', 'actions/runs/43775484590']) {
    assert.ok(html.includes(`https://github.com/sinannar/ghuniverse26/${source}`));
  }
  assert.doesNotMatch(html, /href="[^"]*\/(?:iteration01|iteration01-review|iteration02|iteration02-review)\/[^"]*"/);
});
