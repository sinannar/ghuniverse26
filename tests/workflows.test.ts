import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = (name: string) =>
  readFileSync(new URL(`../.github/workflows/${name}.lock.yml`, import.meta.url), 'utf8');

test('issue label removal is bounded to all six managed labels on the triggering issue', () => {
  const lock = workflow('issue-labeler');
  for (const variable of ['GH_AW_SAFE_OUTPUTS_CONFIG', 'GH_AW_SAFE_OUTPUTS_HANDLER_CONFIG']) {
    const encoded = lock.match(new RegExp(`^\\s+${variable}: (".*")$`, 'm'))?.[1];
    assert.ok(encoded);
    const config = JSON.parse(JSON.parse(encoded));
    assert.deepEqual(config.remove_labels, {
      allowed: ['bug', 'enhancement', 'documentation', 'accessibility', 'question', 'maintenance'],
      max: 6,
      target: 'triggering',
    });
  }
});

test('reviewer skips its introducing PR before activation and keeps the trusted base checkout', () => {
  const lock = workflow('pr-reviewer');
  const activation = lock.split('\n  activation:\n')[1].split('\n  agent:\n')[0];
  const preActivation = lock.split('\n  pre_activation:\n')[1].split('\n  safe_outputs:\n')[0];
  assert.match(preActivation, /if: >\s+\(\(github\.event\.pull_request\.number != 7\)/);
  assert.match(activation, /needs\.pre_activation\.outputs\.activated == 'true'.*github\.event\.pull_request\.number != 7/);
  assert.match(activation, /ref: \$\{\{[^\n]*github\.event\.pull_request\.base\.sha[^\n]*\}\}/);
});
