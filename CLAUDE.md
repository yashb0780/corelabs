# LeadPlus prototype - rules for Claude

## What this project is

A click-through prototype for a sales intelligence product. All data is dummy.
It is edited by hand over time, not regenerated. The owner is non-technical,
so explain changes in plain language and give exact commands to run.

`BRIEF.md` in the project root is the source of truth for the Account Detail
screen. Read it before changing that screen.

## Guardrails

Copied verbatim from section 6 of `BRIEF.md`.

- Click-through prototype with dummy data. No backend, no API calls, no auth,
  no localStorage.
  - **Sanctioned exception:** company logos are loaded as image URLs from a
    logo CDN, keyed on each company's domain in `src/data/companies.js`. This
    rule was meant to rule out a server and live API calls, not `<img>` URLs.
    Do not strip these out. Every logo falls back to a monogram tile if the
    image fails, so the prototype still works with no network.
  - **Sanctioned exception:** the light/dark theme is remembered in
    `localStorage` under one key, `lp-theme`, holding the string "light" or
    "dark". Added deliberately so the theme survives navigation and reload.
    No user data is stored. Do not remove it.
- Tokens in `src/styles/tokens.css` are the only place colours, radii and font
  sizes are defined. No hex codes in component files.
- All data lives in `src/data/`. Never move content strings into components.
- One file per section. Never combine two sections into one file or split one
  section across files.
- Design reference is Linear: minimal but high contrast and information dense.
  Body text never below weight 400. Primary text near-black, not grey. No
  gradients, no shadows, no colours outside the token set.
- Do not use em dashes in UI copy. Use a middot, a colon, or restructure.
- Keep the "Prototype · dummy data" pill visible on every screen.
- When asked for a change, change the smallest number of files possible and
  report which files were touched.

## How those guardrails are implemented here

- **Tokens.** `src/styles/tokens.css` holds colours, the tone palette, the
  type scale, font weights and a DENSITY block. Components reference density
  through arbitrary values such as `py-[var(--lp-row-pad-y)]`, and use
  `.lp-card`, `.lp-stack` and `.lp-label` rather than restating padding, gaps
  or label styling.
- **Weights.** `font-name` (550) for primary nouns, `font-label` (600) for
  labels and headers, `font-num` (600) with `tabular-nums` for figures. Body
  is 450, set once on `body`. Never below 400.
- **One file per section.** Every Account Detail section, main column and
  right rail alike, is one file in `src/components/account/`. `SectionCard` in
  `src/components/ui.jsx` is the shared shell (label, icon, divider, padding),
  not a section itself.
- **Theme.** The theme value lives at module scope in `src/lib/theme.js`, not
  in a component. Every page renders its own `PageShell` and therefore its own
  `TopBar`, so state held in the toggle is destroyed on navigation. Read it
  with `useTheme()`, change it with `toggleTheme()`, and let that module be
  the only thing that writes `data-theme` on `<html>`.

## The Window rule

Window is never stored on a company. It is computed from the Decision Phase
and the selected archetype by `computeWindow(phase, archetype)` in
`src/lib/window.js`, using the table in section 2 of `BRIEF.md`. It renders
one of Open, Narrowing, Closed, Re-opening, Unknown, and never a date range.

If a phase and a window ever look contradictory on screen, the data is wrong,
not the function. Fix the phase.

## Folder structure

```
src/data/          all dummy data and empty-state copy
src/lib/           pure logic with no UI (the window rule)
src/styles/        tokens.css - colours, radii, sizes, weights, density
src/components/layout/   Sidebar, TopBar, PageShell
src/components/leads/    LeadsTable, FilterBar, ArchetypeSelector
src/components/account/  one file per section of the account page
src/pages/         one file per screen
```

## When making changes

- Run `npm run build` before saying a change works. It compiles every file and
  catches broken imports.
- Comments explain *why*, not *what*. Data files carry plain-language
  instructions for a non-technical editor - keep that voice.
- Commit after each working milestone with a message that describes the
  visible change.
- Do not add dependencies without asking.

## Known gaps

- `src/pages/AdminSection.jsx` - one file covers all five Admin nav items,
  because none of them has a brief. Split it up when they do.
- Signals, Saved lists, Campaigns, Generate, Resources - placeholder screens,
  no brief written yet.
- CoreWeave is phase Unclassified and renders honest empty states across most
  of its account page. That is deliberate, not a bug. Its data fields are
  `null` or `[]` and the copy comes from `src/data/emptyStates.js`.
- Company names, domains and logos are real. Everything else about them is
  invented for demonstration: scores, phases, windows, signals, verdicts,
  contacts and postings are illustrative, not real classifications. Contact
  names are fictional. See the banner comment at the top of
  `src/data/companies.js`.
- Dover Corporation has no logo on the CDN, so it renders the monogram tile.
  That path is working as intended, not broken.
