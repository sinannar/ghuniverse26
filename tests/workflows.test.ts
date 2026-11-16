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
  for (const job of [preActivation, activation]) {
    assert.match(job, /github\.event\.pull_request\.number \|\| github\.event\.issue\.number \|\|\s+fromJSON\(inputs\.aw_context \|\| '\{\}'\)\.item_number\) != 7/);
  }
  assert.match(activation, /needs\.pre_activation\.outputs\.activated == 'true'/);
  assert.match(activation, /ref: \$\{\{[^\n]*github\.event\.pull_request\.base\.sha[^\n]*\}\}/);
});

test('reviewer runs automatically only at readiness and admits command context for PRs only', () => {
  const lock = workflow('pr-reviewer');
  const triggers = lock.split('\non:\n')[1].split('\npermissions:')[0];
  assert.match(triggers, /pull_request:\s+types:\s+- opened\s+- ready_for_review/);
  assert.doesNotMatch(triggers, /synchronize/);
  assert.match(triggers, /workflow_dispatch:\s+inputs:\s+aw_context:/);
  const activation = lock.split('\n  activation:\n')[1].split('\n  agent:\n')[0];
  const preActivation = lock.split('\n  pre_activation:\n')[1].split('\n  safe_outputs:\n')[0];
  for (const job of [preActivation, activation]) {
    assert.match(job, /github\.event_name != 'pull_request' \|\| github\.event\.pull_request\.draft == false/);
    assert.match(job, /github\.event_name != 'workflow_dispatch' \|\|\s+fromJSON\(inputs\.aw_context \|\| '\{\}'\)\.item_type == 'pull_request'/);
    assert.match(job, /github\.event\.pull_request\.head\.repo\.id == github\.repository_id/);
  }
  assert.match(preActivation, /GH_AW_REQUIRED_ROLES: "admin,maintainer,write"/);
});

test('command routing separates issue labeling from PR reviewing without status comments', () => {
  const dispatcher = readFileSync(
    new URL('../.github/workflows/agentic_commands.yml', import.meta.url), 'utf8',
  );
  const encoded = dispatcher.match(/^\s+GH_AW_SLASH_ROUTING: '(.*)'$/m)?.[1];
  assert.ok(encoded);
  const routing = JSON.parse(encoded);
  assert.deepEqual(Object.keys(routing).sort(), ['label', 'review']);
  assert.equal(routing.label[0].workflow, 'issue-labeler');
  assert.deepEqual(routing.label[0].events, ['issue_comment']);
  assert.equal(routing.review[0].workflow, 'pr-reviewer');
  assert.deepEqual(routing.review[0].events, ['pull_request_comment']);
  const issueLock = workflow('issue-labeler');
  assert.match(issueLock, /issues:\s+types:\s+- opened\s+- edited/);
  for (const name of ['issue-labeler', 'pr-reviewer']) {
    const source = readFileSync(
      new URL(`../.github/workflows/${name}.md`, import.meta.url), 'utf8',
    );
    assert.match(source, /status-comment: false/);
  }
});
