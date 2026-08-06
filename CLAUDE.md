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

2. **All colors, radii, font sizes and spacing live in `src/styles/tokens.css`.**
   No hex codes in any `.jsx` file. If a component needs a color that does not
   exist, add a token first, then use it.

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

## Known placeholders

These exist so the app runs and must be replaced once the full brief arrives.
They are flagged with a `NOTE:` comment in the code.

- `DECISION_PHASES` in `src/data/companies.js` - the 5th and 6th phase names
  (`stalled`, `live`) are invented. The brief was cut off after `Executing`.
- `computeWindow()` in `src/data/companies.js` - the rule for how "Selling as:"
  changes the Window value is a stand-in. The brief said "see below" and was
  cut off.
- `src/pages/AccountDetail.jsx` - only the header and contacts sections exist.
- `src/pages/AdminSection.jsx` - one file covers all five Admin nav items,
  because none of them had a brief. Split it up when they do.
- Signals, Saved lists, Campaigns, Generate, Resources - placeholder screens.
