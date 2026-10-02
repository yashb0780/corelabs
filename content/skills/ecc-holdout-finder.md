---
name: ECC holdout finder
description: SAP ECC companies with no S/4HANA signal anywhere on record.
category: find
scope: system
order: 1
inputs: [workspace]
knowledge: [ICP definition, Signal library, Decision phase model]
---

## When to use

At the start of a quarter, or before building a new outbound list, when you want the accounts still on SAP ECC that show no sign of having moved, or of moving, to S/4HANA. These are the accounts a migration conversation has not reached yet.

## Instructions

1. Take every account in the workspace.
2. Keep an account only if SAP ECC appears in its technology stack.
3. Drop it if S/4HANA appears anywhere on record: the stack, a fired signal, a job posting, or S/4HANA mentions that have reached three or more in the latest period.
4. Rank what is left by ICP fit score, highest first.
5. List the accounts that were dropped and say why, so nothing is removed without a reason.

**Constraints**

- An account with no stack data is never counted as a holdout. Name it as not judged.
- Do not infer ECC from industry or size. It has to be on record.
- A single stray S/4HANA mention is noise, not a signal.

## Output format

One line with the count, then the holdouts ranked by ICP fit, then the accounts dropped for an S/4HANA signal.
