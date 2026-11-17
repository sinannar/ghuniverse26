import assert from 'node:assert/strict';
import test from 'node:test';
import { ANNOUNCEMENTS, TOUR_IDS } from '../src/keynote/data/announcements';
import { SECTIONS } from '../src/keynote/data/sections';
import { DECKS } from '../src/keynote/deck/scenes';

test('every keynote announcement has reachable, uniquely identified scenes and sources', () => {
  const announcementIds = new Set(ANNOUNCEMENTS.map((announcement) => announcement.id));
  assert.equal(announcementIds.size, ANNOUNCEMENTS.length);

  for (const [deck, scenes] of Object.entries(DECKS)) {
    assert.equal(new Set(scenes.map((scene) => scene.id)).size, scenes.length, `${deck} scene ids`);
    for (const scene of scenes) {
      assert.ok(Number.isInteger(scene.steps) && scene.steps >= 0, scene.id);
      if (scene.announcementId) assert.ok(announcementIds.has(scene.announcementId), scene.id);
    }
  }

  for (const announcement of ANNOUNCEMENTS) {
    assert.ok(SECTIONS.some((section) => section.id === announcement.section), announcement.id);
    assert.ok(announcement.sources.length > 0, announcement.id);
    for (const source of announcement.sources) assert.equal(new URL(source.url).protocol, 'https:');
    const scenes = DECKS.main.filter((scene) => scene.announcementId === announcement.id);
    assert.ok(scenes.length > 0, `Missing scene for ${announcement.id}`);
    assert.ok(scenes.every((scene) => scene.section === announcement.section), announcement.id);
  }

  for (const id of TOUR_IDS) {
    assert.ok(DECKS.future.some((scene) => scene.announcementId === id && scene.kind === 'demo'), id);
  }
});
