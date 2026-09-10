/* ==========================================================================
   SAVED LISTS: the lists on the Saved lists screen, and every word on it.

   Dummy lists for the prototype. Nothing is saved: assigning or sharing a
   list changes the screen until you navigate away, then it resets to what is
   written here.

   DELIBERATE EXCEPTION: these list names use SAP terms (ECC, S/4HANA,
   LeanIX, BTP). The product is going generic and new copy normally avoids
   ecosystem language (see CLAUDE.md), but the owner asked for these so the
   lists read like a real SAP systems integrator's, matching the leads
   dataset. Swap them for generic names whenever that stops being wanted.

   TO ADD A LIST: copy one entry and change it.

   Fields:
     id            unique slug
     name          the list's name
     records       how many companies are on it
     createdBy     a teammate id from src/data/teammates.js
     assignedTo    a teammate id, or null for "Unassigned"
     lastModified  the date, written YYYY-MM-DD
   ========================================================================== */

export const SAVED_LISTS = [
  {
    id: 'tx-manufacturing-under-500',
    name: 'TX Manufacturing under 500',
    records: 214,
    createdBy: 'marcus-webb',
    assignedTo: 'priya-raman',
    lastModified: '2026-09-09',
  },
  {
    id: 'legacy-ecc-healthcare',
    name: 'Confirmed legacy ECC · Healthcare',
    records: 87,
    createdBy: 'elena-sokolova',
    assignedTo: 'elena-sokolova',
    lastModified: '2026-09-08',
  },
  {
    id: 'leanix-signal-q3',
    name: 'LeanIX signal · Q3',
    records: 38,
    createdBy: 'jordan-reyes',
    assignedTo: null,
    lastModified: '2026-09-02',
  },
  {
    id: 's4hana-2027-mid-market',
    name: 'S/4HANA 2027 deadline · Mid-market',
    records: 1284,
    createdBy: 'sam-okafor',
    assignedTo: 'tomas-alvarez',
    lastModified: '2026-08-27',
  },
  {
    id: 'btp-postings-30-days',
    name: 'BTP job postings · last 30 days',
    records: 57,
    createdBy: 'dev-malhotra',
    assignedTo: null,
    lastModified: '2026-08-19',
  },
  {
    id: 'ohio-food-beverage',
    name: 'Ohio food and beverage · 1,000 to 5,000 staff',
    records: 142,
    createdBy: 'hannah-cho',
    assignedTo: 'hannah-cho',
    lastModified: '2026-08-11',
  },
  {
    id: 'clean-core-chemicals',
    name: 'Clean core candidates · Chemicals',
    records: 19,
    createdBy: 'dev-malhotra',
    assignedTo: 'aisha-bello',
    lastModified: '2026-07-30',
  },
  {
    id: 'rise-evaluators-midwest',
    name: 'RISE evaluators · Midwest',
    records: 406,
    createdBy: 'marcus-webb',
    assignedTo: null,
    lastModified: '2026-07-14',
  },
]

/* Every word on the screen. The ones written as `(a, b) => ...` build a
   sentence from a number or a name; edit the words inside the backticks. */
export const SAVED_LISTS_COPY = {
  title: 'Saved lists',
  subtitle: 'Lists you have pinned for a campaign or a call block.',

  columns: {
    name: 'List Name',
    records: 'Records',
    createdBy: 'Created By',
    assignedTo: 'Assigned To',
    lastModified: 'Last Modified',
    actions: 'Actions', // read out by screen readers, not shown
  },
  unassigned: 'Unassigned',

  selectAll: 'Select all lists',
  selectRow: (list) => `Select ${list}`,
  rowMenu: (list) => `Actions for ${list}`,
  selectedCount: (count) => `${count} selected`,
  clearSelection: 'Clear',

  assign: 'Assign',
  assignTo: 'Assign to…',
  share: 'Share',

  assignModal: {
    title: (count) => (count === 1 ? 'Assign list' : `Assign ${count} lists`),
    search: 'Search teammates…',
    noMatch: 'No teammates match',
    current: 'Assigned',
    noteLabel: 'Note',
    noteHint: 'Optional. Sent to them with the assignment.',
    notePlaceholder: 'Start with the Houston accounts this week',
    confirm: 'Assign',
    cancel: 'Cancel',
  },

  shareModal: {
    title: (count) => (count === 1 ? 'Share list' : `Share ${count} lists`),
    linkLabel: 'Link',
    copy: 'Copy link',
    copied: 'Copied',
    accessLabel: 'Anyone with the link can',
    view: 'View',
    edit: 'Edit',
    done: 'Done',
  },

  toast: {
    assignedOne: (list, person) => `Assigned “${list}” to ${person}`,
    assignedMany: (count, person) => `Assigned ${count} lists to ${person}`,
    withNote: 'with a note',
  },
}

/* "2026-09-08" becomes "Sep 8, 2026". Built from the parts, not parsed, so
   the date never slips a day in a timezone behind UTC. */
export function formatListDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRecords(n) {
  return n.toLocaleString('en-US')
}
