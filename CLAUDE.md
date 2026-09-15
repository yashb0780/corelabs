# LeadPlus prototype - rules for Claude

## What this project is

A click-through prototype for a sales intelligence product. All data is dummy.
It is edited by hand over time, not regenerated. The owner is non-technical,
so explain changes in plain language and give exact commands to run.

`BRIEF.md` in the project root is the source of truth for the screens it
covers: Account Detail (sections 1 to 5), the Vendor Profile (section 7) and
Refine by ICP on Company Search (section 8). Read the relevant section before
changing that screen.

The product is going generic. It will serve services firms across any
technology ecosystem, so do not add SAP or ERP specific language to any new
screen or copy. The Account Detail sections and the leads dataset predate that
decision and are still ecosystem-specific. That is known, not a licence to add
more.

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
  - **Sanctioned exception:** the assistant widget carries a soft drop shadow,
    because it floats above the page and has to read as lifted off it. The
    three shadow values are tokens (`--lp-shadow-widget`, `-lift`, `-panel`)
    and are the only shadows in the product. Everything else stays flat.
- Do not use em dashes in UI copy. Use a middot, a colon, or restructure.
- No real or plausibly real domains anywhere: not in email addresses,
  sending or receiving, and not in websites, including the vendor's own and
  placeholder hints. Use `example.com`, which is reserved and can never reach
  or belong to anyone. A fictional name at a real domain could be a real
  person's address, and the prototype goes into demos. Company logos still
  load from the real companies' domains: that is an image URL, the
  sanctioned logo exception, not an address or a website.
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
src/data/          all dummy data, copy and empty-state text
src/lib/           pure logic with no UI: window rule, ICP filters, theme,
                   the vendor profile store, settings paths and search
src/styles/        tokens.css - colours, radii, sizes, weights, density
src/components/layout/   Sidebar, TopBar, PageShell, AssistantWidget,
                         SettingsSearch
src/components/leads/    LeadsTable, FilterBar, ArchetypeSelector, IcpRefineBar
src/components/account/  one file per section of the account page
src/components/vendor/   one file per group of the vendor profile
src/components/lists/    SavedListsTable, AssignModal, ShareModal
src/components/campaign/ the action pills, campaign preview, save-as-list
src/components/reports/  report cards, modals, and the hand-drawn SVG charts
src/components/form.jsx  shared form controls
src/components/overlay.jsx  Modal, RowMenu, Toast. No shadows: a modal is
                         lifted by the --lp-scrim backdrop instead
src/pages/         one file per screen
```

State that has to outlive navigation lives at module scope in `src/lib/`, not
in a component. Every page renders its own `PageShell`, so anything held in a
page's state is destroyed the moment you navigate. That is what broke dark
mode, and it is why `src/lib/profile.js` holds the vendor profile that Company
Search reads.

## When making changes

- Run `npm run build` before saying a change works. It compiles every file and
  catches broken imports.
- Comments explain *why*, not *what*. Data files carry plain-language
  instructions for a non-technical editor - keep that voice.
- Commit after each working milestone with a message that describes the
  visible change.
- Do not add dependencies without asking.

## Scoped decisions

### Marketplace fields are out of scope for the vendor profile

The vendor profile has one job: be the input that produces a good first
account list. The test for any field on it is whether it changes which
companies get surfaced. If it does not, it does not belong there yet.

These fail that test and are deliberately not on the screen: profile
completeness bar and percentage, any "more visibility" nudge, tagline, company
video link, scheduling link, admin contact phone, social media, languages
spoken, About the Team, Certifications as its own section, Portfolio, and a
sections sidebar. See section 7 of `BRIEF.md`.

**Parked, not rejected.** They are the right fields for a vendor marketplace
module, where a buyer is browsing vendors and a fuller profile is the product.
When that module is built, this list is its starting point. Do not treat their
absence as a judgement that they are bad fields.

**Nothing was deleted from this repo to achieve this.** The instruction that
produced this decision described removing them from an existing screen, but
`/vendor/vendor-profile` was a "Not built yet" placeholder here and none of
those fields had ever been implemented. The screen was built to the new spec
directly. If those components exist in another build of LeadPlus, the parking
job still needs doing there.

### Company Search does not auto-narrow

Company Search opens unfiltered. Narrowing by the vendor's inferred ICP is
something the user asks for, through "Refine by ICP", and when they do it the
screen names every filter applied and the number of companies removed.

The reasoning is worth keeping: a list that quietly hides accounts, for
reasons the user cannot see and did not choose, is worse than a long list. Any
future filtering should hold to the same standard. Section 8 of `BRIEF.md` has
the detail, including why size bands read as a floor and why missing data
keeps a company in rather than dropping it.

## Known gaps

- Settings is one page (`src/pages/Settings.jsx`) with five sections:
  General, Tenant, Vendor, Customer, Workspace, fed by `SETTINGS_NAV` in
  `src/data/sections.js`. None of these has a brief. While you are in
  Settings the left sidebar swaps its menu for that section list, Attio
  style, with a back chevron that returns to the last screen outside
  Settings (remembered in `src/lib/settings.js`). Never add a second nav
  column beside the sidebar. The card pages that open
  from it (`/tenant/users`, `/vendor/vendor-profile` and so on) kept their
  original addresses and stay full-width standalone pages. The old addresses
  `/tenant`, `/vendor`, `/customer` and `/admin/*` forward into Settings;
  `src/pages/AdminSection.jsx` is now only that redirect.
- Signals, Campaigns, Generate, Resources - placeholder screens, no brief
  written yet.
- Reports (`/reports`, `/reports/<id>`) is built but has no brief. It is
  modelled on Attio's Business Metrics screen. Charts are plain SVG drawn
  in `src/components/reports/`, not a library: none was installed, and
  adding one needs the owner's say-so. Multi-series charts use the
  `--lp-chart-*` tokens, which were checked as a set for colour-blind
  separation and contrast in both themes; keep their order, and re-check
  if one changes. The dashboard lives at module scope in
  `src/lib/reports.js` so renames and added reports survive opening a
  report and coming back; a reload resets it. Some report copy is
  SAP-specific at the owner's request, noted in `src/data/reports.js`.
- Saved lists is built but has no brief. It exists to show the Assign and
  Share interactions to the dev team. The lists live at module scope in
  `src/lib/savedLists.js`, because lists can also be saved from Company
  Search and the assistant and must appear there; a reload resets them to
  `src/data/savedLists.js`.
- Campaign flow: the floating bar on Company Search (when accounts are
  ticked) has Start a campaign, Save as a list and Enrich contacts. Every
  assistant reply has two pills: Start a campaign from this list, and Save
  as a list. They act on a saved list the message names, or else on what
  is in view on Company Search, which the Leads page reports to
  `src/lib/leadsView.js` (the unfiltered set when Leads is not open). Both
  places use `src/components/campaign/useListActions.jsx`, so they behave
  the same. Start a campaign opens `CampaignSetupModal`: a choice of
  Multi-step sequence (an editable step builder) or Single email (a compose
  view). Its Accounts and Contacts cards open pickers (`ScopePickers.jsx`)
  that both edit one set of selected contacts, so the two counts always
  agree: an account counts only while one of its contacts is ticked.
  Company Search scopes use the real companies' contacts. Saved lists only
  hold counts, so their accounts and people are generated to exactly those
  counts by `src/lib/listMembers.js` from the word lists in
  `src/data/listMembers.js`; they are fictional, unlike the 12 real
  companies. Both paths can be scheduled: a sequence has a start date and
  time plus a time per step, with each step's send date worked out live;
  a single email is sent now or scheduled. Dates and times are handled in
  `src/lib/schedule.js` (local time, 15 minute steps, nothing in the past).
  Nothing runs or schedules: every path ends in a toast. "Send email" exists only
  as the final button of the Single email path, at the owner's request; do
  not add it as an action anywhere else. Its list names are SAP-specific at the owner's
  request, a deliberate exception to the generic-copy rule, noted at the top
  of that file.
- The assistant widget is visual only. There is no model behind it: it waits a
  moment and replies from `src/data/assistant.js`, recognising only the name
  of a saved list. It is rendered by `App.jsx` outside `<Routes>` so the
  conversation survives navigation.
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
