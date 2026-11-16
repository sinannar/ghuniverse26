# Iteration 02: workflow trigger refinement

## Reducing repeated PR assessments

User quotation:

> for the issues, I am OK with it, but I feel PR one is getting triggerred a lot. what would be better trigger scenario for these workflows, what should we change them to

Decision summary: retain automatic issue labeling on opening and edits. Replace
PR review on every new commit with automatic review when a PR opens non-draft
or transitions from draft to ready, plus explicit `/review` requests in PR
comments. Subsequent commits do not automatically refresh an assessment.

## Explicit issue reclassification

User quotation:

> I think `/review` is really good idea, can we do this for issue labeler as `/label` or `/re-label` as well

Confirmed selection summary: keep issue `opened` and `edited` triggers and
add `/label` in issue comments. Use `/label` for both initial classification
and reclassification; `/re-label` is not a configured alias.

Confirmed PR selection summary: automatic review when opened non-draft or
marked ready, plus `/review`.
