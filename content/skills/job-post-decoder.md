---
name: Job post decoder
description: Reads an account's SAP job postings and infers which migration phase they point to.
category: find
scope: workspace
order: 3
inputs: [account]
knowledge: [Decision phase model, Signal library]
example: caterpillar
---

## When to use

When an account's postings look busy but you are not sure what they mean. The roles a company hires for say more about where it is in a migration than anything it announces.

## Instructions

1. Read every open posting for the account: title, team, age and the text.
2. Pull out the phrases that carry phase meaning, such as "programme office", "cutover" or "maintenance".
3. Map the pattern to a decision phase:
   - maintenance only roles: Latent
   - architects and roadmap language: Evaluating
   - programme office, process owners, budget language: Mobilizing
   - module consultants, build and data migration roles: Executing
   - support and hypercare roles: Landed
4. State the phase and quote the postings that decided it.

**Constraints**

- Quote postings, do not paraphrase them.
- With no postings on record, return Unclassified. Do not guess from other signals.

## Output format

Each posting with its key phrases, then the inferred phase and why.
