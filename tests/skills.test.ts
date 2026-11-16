import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('agentic workflow skill lives alongside gh-stack under .agents/skills', () => {
  const skill = new URL('../.agents/skills/agentic-workflows/SKILL.md', import.meta.url);
  assert.ok(existsSync(skill));
  assert.ok(existsSync(new URL('../.agents/skills/gh-stack/SKILL.md', import.meta.url)));
  assert.equal(existsSync(new URL('../.github/skills/agentic-workflows/SKILL.md', import.meta.url)), false);
  assert.match(readFileSync(skill, 'utf8'), /^---\nname: agentic-workflows\ndescription: .+\n---\n/);
});
