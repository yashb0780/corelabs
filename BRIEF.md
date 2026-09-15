# LeadPlus prototype: screen specifications

This file is the source of truth for the screens it covers.

- Sections 1 to 5: the Account Detail screen.
- Section 6: guardrails for the whole prototype. `CLAUDE.md` copies these.
- Section 7: the Vendor Profile screen.
- Section 8: Refine by ICP on Company Search.
- Section 9: the Campaigns screen and the campaign detail page.

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

---

## 9. Campaigns

### What this screen is for

Campaigns is where outbound runs after it has been started. A campaign is
started from Company Search, from the assistant, or from this screen, and all
three use the same Start a campaign window. This screen answers three
questions: what is running, who has replied, and who we have stopped writing
to and why.

**A campaign you schedule must appear here.** Until now, scheduling a campaign
showed a toast and then the campaign vanished. That is a silent failure, the
kind this prototype exists to avoid. Every campaign scheduled anywhere is
added to an in-memory store in `src/lib/campaigns.js`, the same way saved lists
work, and appears at the top of the table straight away. A reload resets the
store to the seed data. Nothing is written to `localStorage`.

**Replies, never opens.** Every count on this screen is of replies. Open
tracking is not a feature here, and the word "opens" does not appear.

Both pages use the `PageShell`, so the "Prototype · dummy data" pill stays
visible.

### Header

- Breadcrumb: Workspace, Campaigns
- Title: "Campaigns"
- Subtitle: "Outbound sequences running against your saved lists."
- Top right: a primary "New campaign" button (see "Starting a campaign from
  this screen" below)

### Metrics row

Five cards in one row, wrapping on a narrow screen. Each card has a small
label, one large figure, and one muted line that says what the figure counts.
Every figure is worked out from the campaign and activity data. None is typed
into a data file.

The cards cover every campaign. They do not change with the table's search or
status filter, so the numbers never shift under the user while they look for
something.

| Card | What it counts |
|---|---|
| Active campaigns | Campaigns with status active. Muted line: "N scheduled". |
| Contacts in sequence | Contacts in active campaigns who still have steps to come: status Not started or In sequence. Paused, stopped, finished and unsubscribed contacts do not count. |
| Emails sent · last 30 days | Email steps sent in the last 30 days, across every campaign. LinkedIn steps are not emails and do not count. |
| Reply rate | Accounts with at least one reply, as a share of accounts contacted. Out of office replies do not count, because an auto reply is not a person answering. Unclear replies do count. |
| Interested replies | Replies classified interested, across every campaign. Muted line: "N need review" when any replies are unclear. |

Reply rate is counted per account, not per contact, to match the "Campaign
reply rate" report, which is defined as "replies as a share of accounts
contacted". Both read from the same numbers (see "Where the numbers come
from").

### Campaign table

Built on the Saved lists table pattern: the same row padding from the density
tokens, the same header style, a menu at the end of each row. Unlike Saved
lists, there are no tick boxes, because there is no bulk action. A click
anywhere on a row opens that campaign.

Columns, in order:

1. **Campaign.** The name in the primary weight. Underneath, small and muted,
   the saved list it runs against. A campaign started from Company Search, or
   from the assistant with no list named, has no saved list and says "From
   Company Search" instead.
2. **Status.** A pill: Active (green), Scheduled (blue), Paused (amber),
   Completed (grey), Draft (grey, dashed). Draft is dashed because nothing
   has gone out yet, which matches how the dashed style already means "absent"
   elsewhere. The accent tone is not used: it means Mobilizing.
3. **Accounts / Contacts.** Two figures, e.g. "38 / 104".
4. **Last activity.** The most recent send, reply or unsubscribe, e.g.
   "Mon 14 Sep, 9:00 AM". A campaign with no activity yet shows its creation
   date prefixed "Created".
5. **Last step sent.** The most recent send in the campaign, e.g. "Step 2 of
   4, Follow up", and under it, muted, who it went to: "to Raymond Cho ·
   Cummins". A dash if nothing has been sent.
6. **Next send.** The earliest upcoming send, e.g. "Tue 15 Sep, 9:00 AM". A
   dash when nothing is due: paused, completed, draft, or every contact
   stopped or paused.
7. **Replies.** The total, and under it the breakdown with zero types left
   out: "3 interested · 2 out of office · 1 not interested · 1 needs review".
   The total counts every reply including out of office. That differs from
   the Reply rate card on purpose, and the breakdown makes the difference
   visible.
8. **Menu.** View, then Launch, Pause or Resume, then Duplicate.
   - Launch shows for drafts only (see "Launching a draft").
   - Pause shows for active and scheduled campaigns. Resume shows for paused
     ones. Neither shows for draft or completed.
   - Resume picks up where the campaign stopped. A send that fell due while
     it was paused moves to the next occurrence of its step time, so nothing
     is ever scheduled in the past.
   - Duplicate makes a new draft named "<name> (copy)", with the same list,
     sequence and suppression setting and no activity. It lands at the top of
     the table.
   - Each action confirms with a toast.

Above the table:

- A search box that matches the campaign name.
- A row of status filter pills: All, Active, Scheduled, Paused, Completed,
  Draft, each with its count, as on Company Search.

Sort is fixed: last activity, newest first. There is no sort control.

### Starting a campaign from this screen

"New campaign" opens a small window titled "Choose a saved list":

- A search box, then every saved list, including any saved earlier in the
  session. Each row shows the list name, its number of accounts and its
  number of contacts.
- One list can be picked. "Continue" stays disabled until one is.
- Continue closes this window and opens the existing Start a campaign window
  with that list in scope, exactly as the assistant does when a message names
  a list. Nothing about that window changes for this screen.

It never sends the user to Company Search.

### Changes to Start a campaign

Four changes. Nothing else about the window moves.

1. **The suppression setting.** The sequence screen gains one field: "When
   someone replies interested", a choice of the three options described
   under "Company level suppression" below, defaulting to the first. A single
   email has one send and nothing left to stop, so it does not show the
   field.
2. **It hands over the whole campaign.** On confirm it gives the store the
   full campaign: type, name, contacts in scope, steps or email, inbox,
   suppression setting, and the start date and time as values rather than a
   sentence. Today it passes only a name and a sentence.
3. **It can open on a draft.** Launching a draft opens the window straight at
   its scheduling screen, filled in from the draft. See "Launching a draft".
4. **Send now is recorded as sent.** A single email sent now is recorded as
   Completed, with step 1 of 1 sent to every contact at that moment, and
   lands at the top of the table. The toast changes from "created as a draft
   email" to "“<name>” sent to N contacts". A Draft appearing after the user
   clicked "Send email" would read as the send having failed. Nothing is
   actually sent, and the window's existing note already says so.

### Launching a draft

A draft can be launched from this screen: from Launch in its row menu, or the
Launch button in its detail header.

- Launch opens Start a campaign at its scheduling screen: the sequence
  builder for a sequence, the compose screen for a single email. Everything
  is filled in from the draft: name, contacts in scope, steps or email, inbox
  and suppression setting. The start date begins at tomorrow, 9:00 AM, as it
  does for a new campaign.
- Back goes to the window's first screen, as it does today, where the scope
  or the type can still be changed.
- Confirming turns the draft itself into a scheduled campaign, or a completed
  one for a single email sent now. It does not create a second campaign. The
  toast is the same one used everywhere else.
- Cancel leaves the draft exactly as it was.

Without this, Duplicate would produce drafts that could never be used.

### Campaign detail

Address: `/campaigns/<id>`.

**Header.**

- Breadcrumb: Workspace, Campaigns, then the campaign name
- Title: the campaign name, with its status pill beside it
- Subtitle: the saved list (or "From Company Search") · Multi-step sequence or
  Single email · the sending inbox
- Top right: Launch, Pause or Resume, and Duplicate, with the same rules as
  the menu in the table
- The suppression setting, shown and changeable. A change applies to replies
  from then on. It does not undo pauses that have already happened: those
  stay until someone clicks "Resume outreach".

**Tabs,** in this order: Companies and Activity, Email sequence, Replies,
Unsubscribed. No tabs control exists in the prototype yet. Build a small one
rather than reusing the segmented control, which is a form choice, not
navigation.

#### Companies and Activity

One row per company, expandable to show its contacts.

- **The company row** shows the company name (with its logo and a link to the
  account page when it is one of the real companies), how many contacts are
  in the campaign, the furthest step any of them has reached, and the most
  important reply badge among them.
- **The contact rows** show, for each contact:
  - name, role and email address
  - last step sent ("Step 2 of 4, Follow up")
  - last sent date
  - next send date, or a dash
  - participation status (below), as plain text
  - reply classification badge, or nothing if they have not replied
- Companies are listed with any that need attention first: suppressed, then
  those with an unclear reply, then the rest in alphabetical order.
- A large list draws the first 200 companies, with a line saying so, and a
  search box finds the rest. This is the same limit and wording pattern as the
  Accounts picker.

#### Email sequence

The steps, read only. For each step: its number, name, type, the day and time
it goes out, its subject line, and two worked-out figures: how many contacts
it has been sent to and how many replies followed it. Editing a sequence after
it has started is out of scope.

#### Replies

Every reply in the campaign, newest first. Each row shows:

- contact and company
- which step it followed ("After step 2, Follow up")
- a one-line snippet of the reply
- the classification badge
- when it arrived

Filter pills above the list: All, Interested, Out of office, Not interested,
Needs review. "Needs review" shows the unclear replies. Each of those rows
has three buttons, one for every label the classifier can give: "Mark as
interested", "Mark as out of office" and "Mark as not interested". The person
correcting the classifier needs every label it could have produced.

- Mark as interested applies the campaign's suppression setting at that
  moment. Under "Stop for the whole company" that pauses the colleagues and
  raises the banner on the company row, and the toast says so.
- Mark as out of office stops nothing.
- Mark as not interested stops that contact only. Their colleagues carry on.
- Whichever is picked, the reply leaves the review queue and shows its new
  badge.

#### Unsubscribed

Contacts who unsubscribed: contact, company, the step they unsubscribed
after, and when. An unsubscribed contact is never sent another step, under
any suppression setting.

### Reply classification

Stored as a field on each contact's activity, `replyType`:

| Value | Badge | Colour |
|---|---|---|
| `interested` | Interested | green |
| `ooo` | Out of office | amber |
| `not_interested` | Not interested | grey |
| `unclear` | Unclear | grey, dashed |
| `null` | no badge | |

Unclear is dashed for the same reason as Unclassified and Unknown: it is the
state where we could not tell. In the prototype the classification is written
into the seed data. There is no classifier.

### Participation status

Stored as `status` on each contact's activity. It is separate from the reply,
because under "Keep sending to everyone" a contact can reply interested and
still be in sequence.

| Value | Shown as | Means |
|---|---|---|
| `not_started` | Not started | In the campaign, no step sent yet |
| `in_sequence` | In sequence | At least one step sent, more to come |
| `finished` | Finished | Every step sent, no reply |
| `stopped` | Stopped, replied | Their own reply stopped the sequence for them |
| `paused_colleague` | Paused, colleague replied | A colleague's interested reply paused them |
| `unsubscribed` | Unsubscribed | They asked to stop. Final. |

### Company level suppression

A per campaign setting, `suppressionRule`, with three options. The first is the
default.

1. **Stop for the whole company** (`stop_company`). An interested reply stops
   the person who replied and pauses every colleague at that company who
   still had steps to come.
2. **Stop for that contact only** (`stop_contact`). An interested reply stops
   the person who replied. Colleagues carry on.
3. **Keep sending to everyone** (`keep_sending`). An interested reply stops
   no one, including the person who replied. The helper text under the option
   says this in plain words, so nobody picks it by accident.

Only the interested reply changes between the options. These hold under every
option:

- **Out of office** stops no one. If the reply gives a return date, it shows
  on that contact's row as "Back Mon 21 Sep".
- **Not interested** stops that contact only. Their colleagues carry on.
- **Unclear** stops no one and goes to the review queue on the Replies tab.
- **Unsubscribe** stops that contact, permanently.

**When a company is suppressed:**

- A banner on the company row names who replied and when, e.g. "Helena Voss
  replied interested on Thu 10 Sep, 2:14 PM. Outreach to 2 colleagues is
  paused." It is visible with the row collapsed.
- The paused colleagues show "Paused, colleague replied" and a dash for next
  send.
- A "Resume outreach" button on the banner undoes the pause. The colleagues
  go back to where they were and their next step moves to its next
  occurrence from now. The person who replied stays stopped: resuming never
  puts an interested contact back into an automated sequence. A toast
  confirms, and the banner goes.

### Data shape

The screen receives the objects below. Fields marked "worked out" are filled
in by `src/lib/campaigns.js` from the rest, never typed into the data file,
so they cannot contradict each other. This is the same rule as the Window and
the segment counts.

```js
// A campaign
{
  id, name,
  listName,          // the saved list it runs against, or null (Company Search)
  type,              // 'sequence' or 'email'
  status,            // 'active' | 'scheduled' | 'paused' | 'completed' | 'draft'
  createdAt,
  startedAt,         // null for a draft
  suppressionRule,   // 'stop_company' (default) | 'stop_contact' | 'keep_sending'
  inbox,             // one of CAMPAIGN_INBOXES
  sequence: [ { name, type, day, time, subject } ],
  stats,             // worked out: see below
}

// One contact's activity in one campaign
{
  id, campaignId, companyId,
  companyName, contactName, role, email,
  lastStepIndex,     // null until the first step is sent
  lastStepName,      // worked out from the sequence
  lastSentAt,        // worked out from startedAt and the sequence
  nextSendAt,        // worked out: null when nothing is due
  status,            // participation status, above
  replyType,         // 'interested' | 'ooo' | 'not_interested' | 'unclear' | null
  replySnippet,
  replyReceivedAt,
  replyStepIndex,    // the step the reply followed
  resumeAt,          // out of office only: their return date, if the reply gave one
  unsubscribedAt,
  suppressedBy,      // the activity id of the colleague whose reply paused them
}
```

`stats`, worked out per campaign: accounts, contacts, emails sent, accounts
contacted, accounts replied, replies by type, last activity, the last send
(step, contact, company, when) and the next send.

These fields go beyond the list agreed for this section, each for a reason:

- `id`, `campaignId` and `companyId` group contacts under their company and
  link the real companies to their account pages.
- `inbox` is shown in the detail header.
- `replyStepIndex` keeps "which step it followed" true after the contact
  moves on.
- `resumeAt` carries the out of office return date.
- `unsubscribedAt` feeds the Unsubscribed tab.

Sequence steps gain a `name` ("Intro", "Follow up") for "Step 2 of 4, Follow
up". A step with no name shows its type instead, so steps built in Start a
campaign need no new field. A single email is stored as a one-step sequence
whose step also carries the email `body`, so a draft single email reopens
with its text.

**Email addresses** use the reserved domain `example.com` for every contact,
hand-written and generated alike: `helena.voss@example.com`. It is plainly
fake on screen and can never reach anyone. The real company's domain is never
used in an address: a fictional name at a real domain could be a real
person's address, and these screens go into demos. Two generated people can
share a name, and so an address. Nothing relies on addresses being unique.

**Dates and times** use the `src/lib/schedule.js` style throughout, since
sends have a time of day: "Mon 14 Sep, 9:00 AM" in tables, "Monday, 14
September at 9:00 AM" in banners and toasts. The `stepSend` helper that works
out when a step goes out moves out of `CampaignSetupModal.jsx` into
`schedule.js`, so the modal and this screen share one copy.

**Seed dates are written relative to today** (for example, started 9 days
ago) and turned into real dates when the page loads. Fixed dates would go
stale within days, leaving active campaigns whose next send had already
passed.

**What happens when a campaign is scheduled in the session:** it enters the
store with every contact from the Start a campaign window at Not started, and
status Scheduled. The prototype does not advance time, so it stays Scheduled
until the page is reloaded, at which point it is gone like everything else
added in the session. A single email sent now enters as Completed instead
(see "Changes to Start a campaign").

### Where the numbers come from

- **Campaigns on real companies** (started from Company Search) have their
  activity written by hand in `src/data/campaigns.js`, using the contacts
  already in `src/data/companies.js`.
- **Campaigns on saved lists** get their accounts and contacts from the
  existing generator in `src/lib/listMembers.js`, which already produces the
  same people for the same list every time. Their activity is generated the
  same repeatable way, from a few inputs written in the data file: how far
  through the sequence the campaign is, and how many replies of each type it
  has had. The suppression setting is applied to generated replies by the same
  logic that applies it to hand-written ones.
- **The "Campaign reply rate" report** reads its bars from these campaigns,
  so the two screens cannot disagree. It keeps its own definition: saved
  list campaigns only, and only once they have contacted someone.
- **The "Account funnel" report** calculates its Contacted and Replied stages
  from these campaigns, replacing the typed 864 and 173. Contacted is every
  account, in any campaign, that has been sent at least one step. Replied is
  every one of those with a reply that is not out of office, the same rule
  as the Reply rate card.

**No number is tuned to match another.** Each seed campaign's reply counts
are written once as plausible inputs, and every report shows whatever they
produce. Nobody adjusts an input to bring a report figure back to its old
value. The old values could not all have survived anyway: three of the six
reply rates cannot be produced from their list sizes at all. For example,
9.8 percent of 19 accounts would need 1.86 accounts to reply.

The funnel stages that campaigns cannot calculate (Sourced, Signal matched,
Enriched, Meeting booked) stay as typed numbers for now. That causes a
problem, recorded under Open questions, and it has to be settled before the
funnel is changed.

### Seed campaigns

The six campaigns named in the reply rate report reuse those names, and each
runs against the saved list of the same name. **Deliberate exception:** those
names use SAP terms (ECC, S/4HANA, LeanIX, RISE, BTP) because the saved lists
do, at the owner's request (see the note at the top of
`src/data/savedLists.js`). Every other word on these screens, including the
names of the campaigns on real companies, is generic.

| Campaign | Runs against | Type and status | Suppression | What it demonstrates |
|---|---|---|---|---|
| Priority accounts · September | Company Search: Coca-Cola, Cummins, Whirlpool, Colgate-Palmolive, Caterpillar | Sequence, active, step 2 of 4 | Stop for the whole company | The hero campaign, see below |
| LeanIX signal · Q3 | saved list | Sequence, active, step 3 of 4 | Stop for the whole company | A mid-sequence campaign on a generated list |
| Confirmed legacy ECC · Healthcare | saved list | Sequence, active, step 2 of 3 | Stop for that contact only | Colleagues carrying on after an interested reply |
| S/4HANA 2027 deadline · Mid-market | saved list | Sequence, active, step 1 of 3 | Keep sending to everyone | The largest list, and the third setting |
| TX Manufacturing under 500 | saved list | Sequence, paused at step 2 of 4 | Stop for the whole company | Pause and Resume |
| RISE evaluators · Midwest | saved list | Sequence, completed | Stop for the whole company | A completed sequence |
| Clean core candidates · Chemicals | saved list | Single email, completed | not used | A completed single email |
| Warm accounts · re-engage | Company Search: Kimberly-Clark, Emerson Electric | Sequence, active | Stop for the whole company | Every company suppressed |
| Industrial accounts · October | Company Search: Sherwin-Williams, Illinois Tool Works, Air Products, Avery Dennison | Sequence, active, step 1 sent yesterday | Stop for the whole company | Sent, zero replies |
| BTP job postings · last 30 days | saved list | Sequence, scheduled, starts in 3 days | Stop for the whole company | A scheduled campaign with a next send |
| Ohio food and beverage · 1,000 to 5,000 staff | saved list | Sequence, draft | Stop for the whole company | A draft with zero sends |

**The hero campaign, Priority accounts · September,** holds the four named
cases on real companies, with real logos and links to account pages:

- **Cummins.** Helena Voss replied interested after step 1. Raymond Cho and
  Anita Brenner show "Paused, colleague replied", with the banner and
  "Resume outreach".
- **Whirlpool.** Jonah Weiss sent an out of office with a return date.
  Camille Duarte and Peter Halloran are still in sequence.
- **Colgate-Palmolive.** Tobias Nguyen's reply is unclear and sits in Needs
  review. His colleagues are still in sequence.
- **Caterpillar.** Neil Vasquez unsubscribed after step 1, so the
  Unsubscribed tab has a row.
- **Coca-Cola.** All four contacts are in sequence with no replies. This is
  the ordinary case, for contrast.

**Warm accounts · re-engage:** Rosalind Fyfe at Kimberly-Clark and Holly Vance
at Emerson Electric both replied interested. Their one colleague each is
paused, so nothing more will send.

Reply snippets are written in the data file, in plain generic language.

### Empty states

Every message lives in `src/data/campaigns.js`. Each should read as an honest
statement of what is there, not as an error.

| State | Where | What it says, in substance |
|---|---|---|
| No campaigns at all | the page | No campaigns yet. Start one from a saved list, with the "New campaign" button. Setting the seed list to `[]` shows it. |
| No campaign matches | the table | No campaigns match the search or filter, with a way to clear it. |
| Draft, nothing sent | detail, every tab | Nothing has been sent from this draft yet. Launch it to schedule it. Companies and Activity still lists who is in scope, at Not started. |
| All companies suppressed | detail, Companies and Activity | Every company in this campaign is paused because someone there replied. Nothing more will send until outreach is resumed. |
| Zero replies | detail, Replies | Sent to N contacts, no replies yet. For a draft or scheduled campaign: nothing has been sent, so there are no replies. |
| Nothing to review | detail, Replies, Needs review | No replies need review. |
| No unsubscribes | detail, Unsubscribed | No one has unsubscribed from this campaign. |
| Campaign not found | detail | That campaign is not here. It may have been added in an earlier visit: campaigns reset when the page reloads. Link back to Campaigns. |

### Reuse

- `PageShell` for both pages.
- The Saved lists table pattern for the campaign table.
- `TonePill` for status and reply badges, `Chip` for small markers.
- `FilterPill` for the status filters and the Replies filters.
- `SearchInput` for every search box.
- `EmptyState` and `EmptyNote` for the empty states.
- `Toast` and `Modal` from `overlay.jsx`, and `RowMenu` for the row menu.
- `useListActions` to open Start a campaign from "New campaign", with
  `scopeForList` for the picked list.
- `useSavedLists` for the list picker.
- The `schedule.js` formatters for every date.

New pieces:

- the store, `src/lib/campaigns.js`
- the list picker window
- the metrics row
- the campaign table
- the detail page with its tabs and a small tabs control
- the suppression and reply logic, as pure functions in `src/lib/`

### Out of scope

- Sending anything. Every action ends in a toast.
- A real reply classifier. Classifications come from the seed data or from
  the review buttons.
- A backend, and any saving beyond the session.
- Writing anything back to a CRM.
- Open tracking.
- Editing a sequence after it has started.

### Open questions

1. **The funnel will rise at Contacted.** Counting every seed campaign,
   Contacted comes to about 2,059 accounts: 2,048 in the six saved list
   campaigns that have sent, plus 11 real companies. The typed stages above
   it are smaller: Signal matched is 1,936 and Enriched is 1,412. The chart
   would show more accounts contacted than enriched, which a funnel cannot
   do. Below it, the typed Meeting booked (58) must also stay under the
   calculated Replied, which is not guaranteed.

   There is no data in the prototype to calculate the upper stages from, and
   shrinking the seed campaigns until the numbers fit would be tuning under
   another name. The choices:

   - **Start the funnel where campaigns can calculate it** (recommended). The
     stages become In a campaign, Contacted, Replied, Interested, all worked
     out. Sourced, Signal matched and Enriched leave this report, and so does
     Meeting booked, since campaigns record no meetings. The report is then
     honest end to end, but it no longer starts at "first sourced".
   - **Calculate the upper stages from the saved lists and the company
     dataset.** This exposes a deeper mismatch: the other reports put the
     dataset at 1,712 companies, fewer than the 2,059 contacted, and the
     saved lists alone hold 2,247 accounts.
   - **Keep the typed upper stages** and let the funnel rise at Contacted.
     Not recommended: it looks like a bug in a demo.

   Settle this before building the funnel change. Calculating Contacted on
   its own produces the rising chart.
