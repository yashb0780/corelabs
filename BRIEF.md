# LeadPlus prototype: screen specifications

This file is the source of truth for the screens it covers.

- Sections 1 to 5: the Account Detail screen.
- Section 6: guardrails for the whole prototype. `CLAUDE.md` copies these.
- Section 7: the Vendor Profile screen.
- Section 8: Refine by ICP on Company Search.

Sections 1 to 5 were written first, when Account Detail was the only screen in
scope, so they still read as though it is. Screen 1 (the Leads table) is built,
and is in scope in sections 2 and 8.

A note on direction: the product is going generic. It will serve services firms
across any technology ecosystem, so no screen should hardcode SAP or ERP
language. Sections 1 to 5 predate that decision and still contain
ecosystem-specific examples. They are illustrative, not a licence to add more.

---

## 1. Layout

Two columns, not a single stacked list. This is a deliberate revert: the earlier
full-width stacked-card version lost the scannability of the original design.

- Main column: roughly 65 percent width, contains sections 1 through 7 below
- Right rail: roughly 35 percent width, sticky on scroll, contains the three
  rail cards
- On narrow viewports the rail drops below the main column

Keep the existing page header exactly as it is now: logo tile, company name,
"Industry · City, ST", segment pill, and the four-stat strip
(ICP Fit Score / Decision Phase / Window / Employees).

Add two buttons to the top right of the header, aligned with the company name:
- "Add to sequence" (secondary, outlined)
- "Export" (primary, filled accent, with a download icon)

Every section below is a card with:
- A small uppercase section label at the top left, 11px, weight 600,
  0.06em letter spacing, with a small icon to its left
- A thin divider directly under the label
- Consistent internal padding

One file per section in `src/components/account/`.

---

## 2. Phase and Window rules

These correct values that were invented earlier. Apply them everywhere,
including Screen 1.

### Decision Phase, six values plus one non-phase state

| Value | Colour | What it means |
|---|---|---|
| Latent | grey | ECC present, maintenance-only hiring, no program exists |
| Evaluating | blue | Architects, roadmap and business-case language, readiness checks |
| Mobilizing | soft black, filled (the `--lp-accent` token, white text) | Program governance cluster, budget language, partner not signed |
| Executing | amber | Module consultants, build and data roles, partner named |
| Landed | green | S/4 live, hypercare and AMS language |
| Re-expanding | teal | Parent modern, subsidiaries still legacy, wave 2 rollout |
| Unclassified | light grey, dashed border | Insufficient evidence. Not a phase. |

Delete any values named "Stalled" or "Live". They were placeholders.

Mobilizing was violet until the accent became a soft black. It is the
highest-value phase, so it now fills with the accent rather than tinting like
the other tones: white text on soft black, inverting in dark mode. This is
deliberate. Do not put violet back.

### Window, computed not stored

Window is derived from the phase AND the "Selling as" archetype selector.
Put the logic in a single pure function in `src/lib/window.js` called
`computeWindow(phase, archetype)`.

| Phase | Migration SI | ECC continuity | Alternative ERP |
|---|---|---|---|
| Latent | Open | Open | Open |
| Evaluating | Open | Narrowing | Open |
| Mobilizing | Narrowing | Closed | Narrowing |
| Executing | Closed | Closed | Closed |
| Landed | Closed | Closed | Closed |
| Re-expanding | Re-opening | Closed | Open |
| Unclassified | Unknown | Unknown | Unknown |

Window must never render a date range. It renders one of:
Open, Narrowing, Closed, Re-opening, Unknown.

### Consistency fix

Meridian Foods currently shows Executing with Window "Open", which the table
above makes impossible. Set Meridian Foods to phase **Mobilizing**, ICP Fit
Score 91. Mobilizing plus Narrowing is the account this product exists to find,
so Meridian is the hero account and should be the most fully populated.

---

## 3. Main column sections, in order

### Section 1: AI COMPANY BRIEF

Fields:
- **What they sell** — one or two sentences of plain prose
- **What likely drives revenue** — one or two sentences
- **Fit note** — a callout box with a left accent border, prefixed with the
  label "FIT NOTE · FOR AN SAP IMPLEMENTATION FIRM"
- **Milestones** — a single horizontal row of short facts separated by middots,
  each fact in medium weight

Top right of the card, small and muted: "Cached brief · refreshed 3 days ago"
with a sparkle icon.

### Section 2: ICP FIT SCORE

Two-column interior.

Left, roughly 35 percent:
- The score as a large number, e.g. `91` at around 56px, weight 600, in the
  accent colour, followed by `/ 100` in muted grey at normal size
- Under it, caption: "Weighted from public job-posting, hiring and filing signals"
- Under that, a small chip: "Evidence confidence: High" with a tooltip reading
  "4 independent signal families, 12 source records, dates present on most."

Right, roughly 65 percent:
- Label: "SIGNALS THAT FIRED"
- A list of rows, each with the signal text on the left and its point value on
  the right in the accent colour, prefixed with a plus sign
- Show the first three rows, then a "Show all signals (+4 more)" toggle that
  expands to reveal the rest and flips to "Hide additional signals"

Card header, top right: the Decision Phase pill and the Window chip side by side.

### Section 3: DECISION PHASE

A horizontal five-step timeline: Latent, Evaluating, Mobilizing, Executing,
Landed. A short branch line drops from Landed to a sixth node, Re-expanding,
positioned slightly below and to the right.

- Steps before the current one: filled in a muted tone with a check
- Current step: filled in that phase's colour, label in weight 600
- Steps after: outlined only, muted label

Under the timeline, one line of plain explanatory text describing why the
company sits in this phase. For Meridian Foods:

"A transformation office, PMO lead and two global process owner roles all
appeared within one quarter. Budget language is present but no implementation
partner is named anywhere. The decision to go has been made and the partner
seat is still open."

### Section 4: ERP LANDSCAPE VERDICT

This is the most important section on the page. It must read as a conclusion
drawn from multiple sources, not as a list of technologies.

**a) Verdict statement.** One or two sentences in normal prose weight, plus a
state chip to its right. State chip values: "Confirmed legacy", "Confirmed
legacy · migrating", "Confirmed modern", "Unknown".

For Meridian Foods:
> "Running SAP ECC 6.0 (EHP 7) as the core with Infor M3 in at least one
> subsidiary. A migration program is forming but no target platform is locked
> and no partner is named. Deployment is on-premise today with no RISE or GROW
> commitment detected."

**b) Stack, grouped by layer.** Chips grouped under four small sub-labels, not
one flat list:

- ERP core: SAP ECC 6.0, Infor M3
- Data and analytics: Snowflake, SAP SLT
- Supply chain: Blue Yonder
- Finance and HCM: Coupa, Workday

Each chip carries a small provenance dot before its text:
- Filled dot = observed in technographic data
- Half-filled dot = inferred from job posting language
- Hollow dot = inferred from new-hire backgrounds

Show the dot legend once, small and muted, under the chip groups. Each chip
gets a tooltip naming its specific source.

**c) "How we got here".** Four evidence rows. Each row has three parts: a
source label on the left in uppercase small caps, what was observed in the
middle, and what it implies on the right in muted text prefixed with an arrow.

```
TECHNOGRAPHICS
SAP ECC 6.0 and Infor M3 both present. No S/4HANA licence record.
-> Core is still legacy. Multi-ERP estate, not a single-instance shop.

JOB POSTINGS (3 recent)
"Stand up the transformation office ahead of ERP platform selection"
(Transformation Director, 6 days ago). "Own the global process design for
order-to-cash across both ERP instances" (Global Process Owner, 11 days ago).
On-premise Basis administration referenced. No SAP GROW or RISE language.
-> Governance is standing up before any platform or partner is chosen.

PEOPLE MOVEMENT
Arun Patel joined 5 months ago as Director, ERP Program, prior Capgemini.
New CIO within the trailing 9 months.
-> SI-side practitioners moving client-side. A program is being staffed.

PUBLIC FILINGS
SAP ECC end-of-support referenced in the FY26 10-K risk factors. No partner
or spend figure disclosed.
-> Board-visible pressure, budget not yet publicly committed.
```

Make it visually obvious that the verdict at the top is derived from the four
rows below it. Use a thin connector line, indentation, or a small
"4 sources agree" marker near the verdict.

### Section 5: SIGNAL MOMENTUM

Three rows, each showing a term and its count across three time windows with
arrows between them, plus a small sparkline on the right.

```
SAP ECC       4 -> 6 -> 7
S/4HANA       3 -> 7 -> 12
go-live       1 -> 3 -> 5
```

The final number in each row in the accent colour and weight 600. A "trending
up" chip next to the section label. Footnote under the rows, small and muted:
"Counts of each term across this company's public job postings, by window
(90d, 60d, 30d). Not third-party intent data."

### Section 6: WHY NOW

An amber callout card with a left accent border. Contains:
- A title on the left, e.g. "Program forming · partner not named"
- A chip on the right, e.g. "Partner seat open"
- A body sentence beginning with a bold "Why now" label

For Meridian Foods:
> **Why now** — Governance roles landed this quarter and no implementation
> partner appears in any posting or release. Assume two to four competitors are
> already circling. Multi-thread immediately.

### Section 7: ECOSYSTEM SIGNALS

Marked "Secondary" in muted text at the top right of the card. One or more rows,
each with a small icon and a sentence.

For Meridian Foods:
> Runs SAP alongside Blue Yonder. Any platform decision drags a supply chain
> integration workstream with it, which widens the scope of the eventual RFP.

---

## 4. Right rail cards, in order

### COMPANY FACTS
A two-column grid of label and value pairs: Industry, Employees, HQ, Founded,
Est. revenue, Contacts. Labels uppercase and muted, values weight 600.

### KEY CONTACTS
Header shows a count, e.g. "4 mapped". Each contact row has an avatar circle
with initials, name in weight 600, title, tenure line ("Joined 5 months ago"),
an optional "Prior:" line, and a "View" button on the right.

One contact per company is flagged as a likely champion: give that row a subtle
tinted background and a star chip reading "Likely champion".

For Meridian Foods, Arun Patel (Director, ERP Program, joined 5 months ago,
Prior: Capgemini) is the likely champion.

### JOB POSTINGS
Header shows "3 recent". Each posting shows the title in weight 600, a
"Team · N days ago" line, and a one-line snippet with matched keywords
highlighted in a subtle tinted background.

---

## 5. Data model

Every field above lives in `src/data/companies.js`. No content strings inside
component files. Each company object:

```js
{
  id, name, logo, city, state, industry, employees, revenue, founded, hq,
  icpFitScore, phase, evidenceConfidence, segments: [],
  brief: { whatTheySell, revenueDrivers, fitNote, milestones: [] },
  signalsFired: [ { label, points } ],
  phaseNote,
  landscape: {
    verdict,
    state,
    stack: [ { name, layer, provenance } ],
    evidence: [ { source, observed, implies } ]
  },
  momentum: [ { term, counts: [n, n, n] } ],
  whyNow: { title, chip, body },
  ecosystem: [ string ],
  contacts: [ { name, title, tenure, prior, likelyChampion } ],
  jobPostings: [ { title, team, ageDays, snippet, keywords: [] } ]
}
```

Fully populate **Meridian Foods** with everything above. For the other eight
companies, populate every field but with lighter, plausible content so each row
in the table is clickable and lands on a complete-looking page.

CoreWeave is phase Unclassified. Its account page should visibly degrade: show
the sections, but with honest empty states saying what was not found, rather
than fabricated content. This is deliberate and should look intentional.

(This was written as "Cirrus Software" before the dataset moved to real company
names. CoreWeave took the slot: a company founded in 2017 genuinely has no
legacy estate to find, which makes the empty states believable.)

---

## 6. Guardrails

Copy this section into `CLAUDE.md`, replacing any placeholder note there.

- Click-through prototype with dummy data. No backend, no API calls, no auth,
  no localStorage.
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

Three exceptions have been granted against these since they were written: logo
CDN image URLs, remembering the theme in `localStorage`, and a drop shadow on
the assistant widget. Each is recorded in `CLAUDE.md` with its reasoning. Do
not remove them on the strength of the rule alone.

---

## 7. Vendor Profile

### What this screen is for

The vendor profile is the input that produces the first account list. Every
field on it must change which companies get surfaced. If a field does not
change the list, it does not belong here yet.

That is the test to apply to any proposed addition.

### Layout

One page, one scroll. Two clearly separated groups. Not a stepper, and no
sections sidebar: the screen is short enough to read in one pass.

### Group one: "What we found about you"

Pre-filled from the website scrape and editable. Helper text says we pulled it
from their website and they should correct anything wrong.

- Company name
- Website
- Headquarters location
- Other delivery locations (repeatable)
- Founding year
- Employee size
- What you do (multi line, a few plain sentences)
- Key offerings (repeatable list of services)

### Group two: "Tell us who you sell to"

Asked, not scraped. A website does not reliably state any of these, and these
are the fields Refine by ICP acts on. Helper text: "This helps us sharpen your
company search and the signals we surface."

- Technologies and platforms you work with (multi select with free entry,
  suggested: AWS, Azure, SAP, Oracle, Salesforce, NetSuite, ServiceNow,
  Snowflake). The suggestions are a shortcut, never a fixed vocabulary.
- Partner and vendor certifications (repeatable rows: provider, and level or
  tier)
- Company size you sell to (revenue band and employee band)
- Industries you win in (two fields: include and exclude)
- Key customer wins (3 to 5 free text entries)

### Two behaviours that matter

**Never pre-fill a guess.** If the scrape fails or returns nothing, fields stay
empty. Size bands sit at "Not set". A plausible looking default reads as
confirmed to the user and silently produces wrong data, which is worse than a
blank field. The whole page must be completable by hand. Setting
`SCRAPE_RESULT` to `null` in `src/data/vendorProfile.js` renders the whole page
blank and switches the helper text to say the scrape found nothing.

**The primary action reads "Save and continue"** and routes to Company Search.
Not "Save Changes": this screen is a step towards the list, not a settings page.

### Explicitly out of scope

Not on this screen: profile completeness bar or percentage, any "more
visibility" nudge, tagline, company video link, scheduling link, admin contact
phone, social media, languages spoken, About the Team, Certifications as its
own section, and Portfolio.

These are marketplace directory fields. None of them changes which companies
get surfaced, so none passes the test at the top of this section. See the
scoped decision in `CLAUDE.md`.

---

## 8. Refine by ICP, on Company Search

### Default state

Company Search opens on the full unfiltered set. We do not narrow the view
automatically from what was inferred about the vendor, because that quietly
hides accounts the user might want with no way for them to know what was
removed.

The subtitle states the count with no ICP claim: "All companies · N in view".
No ecosystem-specific wording.

### The control

A single button, top right, above the results list, sized and positioned like
the Upgrade button in Gmail. Labelled "Refine by ICP". Uses the existing near
black accent token, not a new colour.

On click it applies filters derived from the vendor profile: technologies,
revenue band, employee band, industries include and industries exclude.

It refines the view only. It does not create a saved list.

### Narrowing is never invisible

This is the point of the feature, not decoration on it. When refined:

- The button reflects the active state.
- A strip under the filter row names every filter that was applied, one chip
  each, in the user's own words from their profile.
- The strip states how many companies were removed from view.
- The subtitle changes to "Refined by ICP · N of M in view".
- Clearing back to the unfiltered view is available from both the strip and
  the button.

### Filter semantics

**Size bands are a floor, not an exact bracket.** A firm selling to "$1B to
$10B" also sells above it. Exact-bracket matching would remove nearly
everything and would surprise the user. Chips read "$10B+" and "5,000+" so
what was applied is unambiguous.

**Missing data keeps a company in, never removes it.** A company with no
revenue on record or no technology stack identified cannot be judged against
those filters. Dropping it would hide an account for a reason the user cannot
see, which is the exact failure this screen is designed to avoid.

**An empty profile does not silently do nothing.** Group two is never scraped,
so on a fresh profile there is nothing to filter by. The control says so and
links to the vendor profile rather than appearing to work and changing nothing.
