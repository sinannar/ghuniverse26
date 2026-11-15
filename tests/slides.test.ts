import assert from 'node:assert/strict';
import test from 'node:test';
import { slideDestination, presentationSlides } from '../src/lib/slides';
import { topics } from '../src/data/topics';

test('presentation keys advance slides without crossing the topic boundary', () => {
  for (const key of ['ArrowRight', 'PageDown', ' ']) {
    assert.equal(slideDestination(0, 5, key), 1);
    assert.equal(slideDestination(4, 5, key), 4);
  }
  for (const key of ['ArrowLeft', 'PageUp']) {
    assert.equal(slideDestination(2, 5, key), 1);
    assert.equal(slideDestination(0, 5, key), 0);
  }
  assert.equal(slideDestination(2, 5, 'Home'), 0);
  assert.equal(slideDestination(2, 5, 'End'), 4);
  assert.equal(slideDestination(0, 0, 'ArrowRight'), undefined);
  assert.equal(slideDestination(2, 5, 'Escape'), undefined);
});

test('the opening slide is report evidence and only the selected demos have optional handoffs', () => {
  const first = presentationSlides(topics[0]);
  assert.equal(topics[0].id, 'momentum');
  assert.equal(first[0].kind, 'chart');
  assert.equal(first[0].chartIndex, 0);
  const demos = topics.filter((topic) => presentationSlides(topic).some((slide) => slide.kind === 'demo'));
  assert.deepEqual(demos.map((topic) => topic.id), ['stacked-pull-requests', 'cli-attachments']);
  assert.ok(demos.every((topic) => presentationSlides(topic).find((slide) => slide.kind === 'demo')!.optional));
  assert.ok(presentationSlides(topics.find((topic) => topic.id === 'fusion')!).some((slide) => slide.kind === 'creation'));
  for (const topic of topics) {
    const slides = presentationSlides(topic);
    assert.equal(new Set(slides.map((slide) => slide.id)).size, slides.length);
    assert.ok(slides.filter((slide) => !slide.optional).length >= 2);
    if (topic.category !== 'octoverse') {
      assert.equal(slides.filter((slide) => !slide.optional).length, topic.creationStory ? 3 : 2);
    }
  }
});
