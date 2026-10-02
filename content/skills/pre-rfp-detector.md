---
name: Pre-RFP detector
description: Flags LeanIX or Signavio adoption as the analyze-and-plan phase, before an RFP is written.
category: find
scope: workspace
order: 2
inputs: [workspace]
knowledge: [Signal library, Decision phase model, Competitor SIs]
---

## When to use

When you want to reach accounts before the RFP exists. Teams that adopt LeanIX (architecture mapping) or Signavio (process mining) are usually documenting their landscape ahead of a platform decision. That is the analyze-and-plan phase, and the best time to be the first firm they talk to.

## Instructions

1. Search every account's stack, job postings, fired signals and evidence for LeanIX or Signavio.
2. Flag each hit as analyze-and-plan, with the exact place it was found.
3. If nothing is found, say so plainly. Then list the accounts already in the Evaluating phase as the nearest analyze-and-plan evidence, with their why-now line.

**Constraints**

- Never report a hit that is not on record. A missing tool is not a guess.
- Keep the reason for every flag visible.

## Output format

The hits, each with where it was found. If there are none, one line saying so, then the closest Evaluating accounts.
