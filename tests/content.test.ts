import assert from 'node:assert/strict';
import test from 'node:test';
import { categories, topics } from '../src/data/topics';
import { neighbors, withBase } from '../src/lib/navigation';

test('every curated topic has a unique route, real sources, and a complete presentation', () => {
  const ids = new Set<string>();
  for (const topic of topics) {
    assert.match(topic.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!ids.has(topic.id), `Duplicate topic: ${topic.id}`);
    ids.add(topic.id);
    assert.ok(categories.some((category) => category.id === topic.category));
    assert.ok(topic.title && topic.headline && topic.summary && topic.takeaway);
    assert.ok(topic.points.length > 0);
    assert.ok(topic.sources.length > 0);
    for (const source of [...topic.sources, ...(topic.examples ?? [])]) {
      assert.equal(new URL(source.url).protocol, 'https:');
    }
    if (topic.category !== 'octoverse') assert.ok(topic.flow);
    else assert.ok(topic.charts?.length || topic.examples?.length);
  }
});

test('track navigation stays inside its category and has explicit boundaries', () => {
  for (const category of categories) {
    const track = topics.filter((topic) => topic.category === category.id);
    assert.ok(track.length > 0);
    for (const [index, topic] of track.entries()) {
      const result = neighbors(track, topic.id);
      assert.equal(result.index, index);
      assert.equal(result.previous?.id, track[index - 1]?.id);
      assert.equal(result.next?.id, track[index + 1]?.id);
    }
    assert.equal(neighbors(track, track[0].id).previous, undefined);
    assert.equal(neighbors(track, track.at(-1)!.id).next, undefined);
  }
  assert.throws(() => neighbors(topics, 'missing-topic'), /Unknown topic/);
});

test('Pages paths work at root and at the repository base without doubled separators', () => {
  for (const base of ['/ghuniverse26', '/ghuniverse26/']) {
    assert.equal(withBase('copilot/fusion/', base), '/ghuniverse26/copilot/fusion/');
    assert.equal(withBase('/favicon.svg', base), '/ghuniverse26/favicon.svg');
    assert.equal(withBase('', base), '/ghuniverse26/');
  }
  assert.equal(withBase('platform/', '/'), '/platform/');
});

test('report charts retain their units, notes, finite values, and source context', () => {
  const stories = topics.filter((topic) => topic.category === 'octoverse');
  assert.equal(stories.length, 7);
  for (const topic of stories) {
    assert.ok(topic.caveat);
    for (const chart of topic.charts ?? []) {
      assert.ok(chart.title && chart.unit && chart.note);
      for (const row of chart.rows) {
        assert.ok(Number.isFinite(row.value) && row.value >= 0);
        assert.ok(row.label && row.display);
      }
    }
  }
  const momentum = stories.find((topic) => topic.id === 'momentum')!;
  assert.deepEqual(momentum.charts![0].rows.map((row) => row.value), [5.2, 6.7, 17.9]);
  const choices = stories.find((topic) => topic.id === 'model-choice')!;
  assert.equal(choices.charts![0].rows.reduce((sum, row) => sum + row.value, 0), 100);
  assert.match(choices.charts![0].note, /Excludes automatic model selection/);
  const agents = stories.find((topic) => topic.id === 'agentic-workflows')!;
  assert.equal(agents.charts![0].rows[1].display, '>40%');
  assert.match(agents.charts![0].note, /lower bound/);
});
