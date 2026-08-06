# LeadPlus prototype - rules for Claude

> **AWAITING THE REAL GUARDRAILS.**
> The brief referred to a "GUARDRAILS" section but the message was cut off
> before it. The rules below are the ones that could be derived from the rest
> of the brief. Paste the real guardrails in here, replacing this note, and
> delete anything below that contradicts them.

## What this project is

A click-through prototype for a sales intelligence product. All data is dummy.
It is edited by hand over time, not regenerated. The owner is non-technical,
so explain changes in plain language and give exact commands to run.

## Design system - do not redesign

The look is modelled on Linear. Keep it exactly as-is.

- Light background, near-white content area, subtle 1px borders.
- Indigo/violet accent for primary buttons and active nav only.
- Inter or system sans-serif. Generous whitespace. Restrained, muted colors.
- **No gradients. No shadows. No decoration.** If a change adds visual
  flourish, it is wrong.
- Body text sits at 13-14px. Do not make it bigger.
- Color is meaning, never decoration.

## Hard structural rules

1. **All dummy data lives in `src/data/`.** No data - no company names, no
   scores, no counts, no labels that vary by row - anywhere else. Components
   read from `src/data/`, they never contain their own.

2. **All colors, radii, font sizes, font weights and density live in
   `src/styles/tokens.css`.** No hex codes and no hardcoded weights in any
   `.jsx` file. If a component needs a value that does not exist, add a token
   first, then use it.

   Components reference density through arbitrary values, e.g.
   `py-[var(--lp-row-pad-y)]`, and use `.lp-card`, `.lp-stack` and `.lp-label`
   rather than re-specifying padding, gaps or label styling. This is what
   keeps a density change to a single file.

   Body text is never below weight 400. Use `font-name` (550) for primary
   nouns, `font-label` (600) for labels and headers, `font-num` (600) with
   `tabular-nums` for figures.

3. **One file per section of the account page**, in `src/components/account/`.
   A person changing one section must only ever open one file. If a change
   requires editing two files to alter one visible thing, the structure is
   wrong - fix the structure, do not work around it.

4. **Counts are computed, never typed.** Segment pill counts, "All (9)", and
   anything else numeric derives from the data. Nobody should have to update a
   number by hand after adding a company.

5. **Fold, do not fork.** Prefer editing an existing file over adding a
   parallel one. New folders need a reason.

## Folder structure

```
src/data/          all dummy data
src/styles/        tokens.css - all colors, radii, sizes, spacing
src/components/layout/   Sidebar, TopBar, PageShell
src/components/leads/    LeadsTable, FilterBar, ArchetypeSelector
src/components/account/  one file per section of the account page
src/pages/         one file per screen
public/logos/      company logo SVGs
```

## When making changes

- Run `npm run build` before saying a change works. It compiles every file and
  catches broken imports.
- Comments explain *why*, not *what*. Data files carry plain-language
  instructions for a non-technical editor - keep that voice.
- Commit after each working milestone with a message that describes the
  visible change.
- Do not add dependencies without asking. The project is deliberately small:
  React, React Router, Tailwind, Inter. That is all.

## BRIEF.md

Several things in this project are waiting on `BRIEF.md`. **That file does not
exist on this machine.** It has been searched for by name across the project
and the home directory. Do not pretend to have read it, and do not invent its
contents - if a task refers to it and it is still missing, say so.

## Known placeholders

These exist so the app runs and must be replaced once `BRIEF.md` is available.
They are flagged with a `NOTE:` comment in the code.

- `computeWindow()` in `src/data/companies.js` - the four Window states
  (Open / Narrowing / Closed / Re-opening) are correct, but the rule deciding
  which one a company shows under each selling archetype is invented. Only
  this function and the `shift` values need to change.
- `DECISION_PHASES` in `src/data/companies.js` - the seven phase names are
  correct. The pill colours for `landed`, `re-expanding` and `unclassified`
  are assumed; the other four came from the original brief.
- `src/pages/AccountDetail.jsx` - only the header and contacts sections exist.
  Every other section is still unbuilt.
- `src/pages/AdminSection.jsx` - one file covers all five Admin nav items,
  because none of them had a brief. Split it up when they do.
- Signals, Saved lists, Campaigns, Generate, Resources - placeholder screens.
