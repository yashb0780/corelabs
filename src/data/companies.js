/* ==========================================================================
   ALL DUMMY COMPANY DATA LIVES HERE. Nowhere else.

   TO CHANGE THE TABLE: edit the `companies` array below. Add, remove or
   reword anything. The screens read from this file, so nothing else needs
   touching.

   Fields on a company:
     id            short slug, used in the URL of the account page
     name          company name shown in the table
     city, state   the "City, ST" line under the name
     industry      Industry column
     employees     Employees column (a number, formatted for you)
     fitScore      ICP Fit Score, 0-100
     phase         Decision Phase, must be one of the ids in DECISION_PHASES
     segments      which segment pills this company belongs to
                   (ids come from src/data/segments.js)
     logo          path to its SVG in public/logos/. If the file is missing
                   the table falls back to a colored monogram tile.
     monogram      the 1-2 letters for that fallback tile
     monogramColor the fallback tile color
     contacts      people on the account, shown in the Contacts column
     windowStart   see "THE WINDOW COLUMN" below
     windowLength  see "THE WINDOW COLUMN" below
   ========================================================================== */

/* --- Decision Phase -------------------------------------------------------
   Six phases. `tone` picks the pill color, defined in src/styles/tokens.css.

   NOTE: your brief listed four phases (Latent, Evaluating, Mobilizing,
   Executing) and was cut off before the last two. `stalled` and `live` below
   are placeholders so the app runs. No company currently uses them - rename
   or replace them once you have the real names.
   ------------------------------------------------------------------------ */
export const DECISION_PHASES = [
  {
    id: 'latent',
    label: 'Latent',
    tone: 'grey',
    description: 'No program exists, maintenance-only hiring.',
  },
  {
    id: 'evaluating',
    label: 'Evaluating',
    tone: 'blue',
    description: 'Architects, roadmap and business-case language.',
  },
  {
    id: 'mobilizing',
    label: 'Mobilizing',
    tone: 'violet',
    description: 'Program governance cluster, budget language.',
  },
  {
    id: 'executing',
    label: 'Executing',
    tone: 'amber',
    description: 'Program is underway and staffed.',
  },
  // ---- PLACEHOLDERS, awaiting the rest of the brief ----
  {
    id: 'stalled',
    label: 'Stalled',
    tone: 'red',
    description: 'PLACEHOLDER - real phase name not yet supplied.',
  },
  {
    id: 'live',
    label: 'Live',
    tone: 'green',
    description: 'PLACEHOLDER - real phase name not yet supplied.',
  },
]

export function getPhase(id) {
  return DECISION_PHASES.find((p) => p.id === id) ?? DECISION_PHASES[0]
}

/* --- THE WINDOW COLUMN ----------------------------------------------------
   The "Selling as:" dropdown changes how the Window value is computed.

   NOTE: your brief said "see below" for the exact rule and was cut off
   before it. The rule below is a stand-in so the control does something
   visible. It is deliberately all in one function - replace the numbers in
   SELLING_ARCHETYPES and the body of computeWindow() and you are done.

   How the stand-in works:
     Each company has a window that opens `windowStart` months from now and
     lasts `windowLength` months. The archetype shifts when it opens and
     stretches or shrinks how long it lasts.
   ------------------------------------------------------------------------ */

/** The prototype's "today". Fixed so screenshots stay stable. */
const ANCHOR = { year: 2026, month: 7 } // month is 0-indexed, so 7 = August

export const SELLING_ARCHETYPES = [
  {
    id: 'migration-si',
    label: 'Migration SI',
    shiftMonths: 0,
    lengthDelta: 0,
  },
  {
    id: 'ecc-continuity',
    label: 'ECC continuity',
    shiftMonths: 6,
    lengthDelta: 6,
  },
  {
    id: 'alternative-erp',
    label: 'Alternative ERP',
    shiftMonths: -3,
    lengthDelta: -2,
  },
]

export const DEFAULT_ARCHETYPE = SELLING_ARCHETYPES[0].id

function quarterLabel(monthsFromAnchor) {
  const total = ANCHOR.year * 12 + ANCHOR.month + monthsFromAnchor
  const year = Math.floor(total / 12)
  const quarter = Math.floor((total % 12) / 3) + 1
  return `Q${quarter} ${year}`
}

/**
 * Returns the Window cell for one company under one selling archetype.
 * @returns {{ label: string, detail: string }}
 */
export function computeWindow(company, archetypeId) {
  const archetype =
    SELLING_ARCHETYPES.find((a) => a.id === archetypeId) ??
    SELLING_ARCHETYPES[0]

  const start = Math.max(0, company.windowStart + archetype.shiftMonths)
  const length = Math.max(3, company.windowLength + archetype.lengthDelta)

  const from = quarterLabel(start)
  const to = quarterLabel(start + length)

  return {
    label: from === to ? from : `${from} – ${to}`,
    detail: `${length} month window`,
  }
}

/* --- The companies ------------------------------------------------------ */

export const companies = [
  {
    id: 'meridian-foods',
    name: 'Meridian Foods',
    city: 'Columbus',
    state: 'OH',
    industry: 'Food & Beverage',
    employees: 14200,
    fitScore: 91,
    phase: 'executing',
    segments: ['scm'],
    logo: '/logos/meridian-foods.svg',
    monogram: 'MF',
    monogramColor: '#5b5bd6',
    windowStart: 0,
    windowLength: 6,
    contacts: [
      { name: 'Dana Whitfield', title: 'VP Supply Chain Systems' },
      { name: 'Arun Patel', title: 'Director, ERP Program' },
      { name: 'Grace Lindqvist', title: 'Head of Finance Ops' },
    ],
  },
  {
    id: 'calder-industrial',
    name: 'Calder Industrial',
    city: 'Milwaukee',
    state: 'WI',
    industry: 'Industrial Manufacturing',
    employees: 9800,
    fitScore: 82,
    phase: 'mobilizing',
    segments: ['multi-erp'],
    logo: '/logos/calder-industrial.svg',
    monogram: 'CI',
    monogramColor: '#1a7f52',
    windowStart: 2,
    windowLength: 6,
    contacts: [
      { name: 'Marcus Feldt', title: 'CIO' },
      { name: 'Priya Raman', title: 'Enterprise Architect' },
    ],
  },
  {
    id: 'aventine-health',
    name: 'Aventine Health',
    city: 'Nashville',
    state: 'TN',
    industry: 'Healthcare',
    employees: 22500,
    fitScore: 74,
    phase: 'mobilizing',
    segments: ['fico'],
    logo: '/logos/aventine-health.svg',
    monogram: 'AH',
    monogramColor: '#1667c2',
    windowStart: 3,
    windowLength: 9,
    contacts: [
      { name: 'Elena Marsh', title: 'SVP Finance Transformation' },
      { name: 'Tobias Nguyen', title: 'Controller' },
      { name: 'Rachel Okafor', title: 'Director, Applications' },
      { name: 'Sam Delacroix', title: 'Program Manager' },
    ],
  },
  {
    id: 'ridgeline-energy',
    name: 'Ridgeline Energy',
    city: 'Denver',
    state: 'CO',
    industry: 'Utilities',
    employees: 6400,
    fitScore: 66,
    phase: 'evaluating',
    segments: ['greenfield'],
    logo: '/logos/ridgeline-energy.svg',
    monogram: 'RE',
    monogramColor: '#8a6a00',
    windowStart: 5,
    windowLength: 9,
    contacts: [
      { name: 'Holly Vance', title: 'Head of Digital Core' },
      { name: 'Idris Bello', title: 'Solution Architect' },
    ],
  },
  {
    id: 'halcyon-retail',
    name: 'Halcyon Retail Group',
    city: 'Atlanta',
    state: 'GA',
    industry: 'Retail',
    employees: 31000,
    fitScore: 61,
    phase: 'evaluating',
    segments: ['scm'],
    logo: '/logos/halcyon-retail.svg',
    monogram: 'HR',
    monogramColor: '#c2372f',
    windowStart: 6,
    windowLength: 9,
    contacts: [
      { name: 'Jonah Weiss', title: 'VP Merchandising Systems' },
      { name: 'Camille Duarte', title: 'Director, Supply Chain IT' },
      { name: 'Peter Halloran', title: 'ERP Lead' },
    ],
  },
  {
    id: 'portsmith-logistics',
    name: 'Portsmith Logistics',
    city: 'Long Beach',
    state: 'CA',
    industry: 'Transportation & Logistics',
    employees: 4900,
    fitScore: 55,
    phase: 'evaluating',
    segments: ['scm'],
    logo: '/logos/portsmith-logistics.svg',
    monogram: 'PL',
    monogramColor: '#1d7a71',
    windowStart: 7,
    windowLength: 6,
    contacts: [
      { name: 'Winona Pearce', title: 'Director of IT' },
      { name: 'Felix Adeyemi', title: 'Logistics Systems Manager' },
    ],
  },
  {
    id: 'brightmoor-chemical',
    name: 'Brightmoor Chemical',
    city: 'Baton Rouge',
    state: 'LA',
    industry: 'Chemicals',
    employees: 3200,
    fitScore: 45,
    phase: 'latent',
    segments: ['greenfield', 'multi-erp'],
    logo: '/logos/brightmoor-chemical.svg',
    monogram: 'BC',
    monogramColor: '#97398f',
    windowStart: 10,
    windowLength: 9,
    contacts: [{ name: 'Theodore Kwan', title: 'IT Director' }],
  },
  {
    id: 'kestrel-financial',
    name: 'Kestrel Financial',
    city: 'Charlotte',
    state: 'NC',
    industry: 'Financial Services',
    employees: 12700,
    fitScore: 38,
    phase: 'latent',
    segments: ['fico'],
    logo: '/logos/kestrel-financial.svg',
    monogram: 'KF',
    monogramColor: '#4f4fc4',
    windowStart: 12,
    windowLength: 12,
    contacts: [
      { name: 'Odessa Grant', title: 'Head of Finance Systems' },
      { name: 'Bram Sutherland', title: 'Senior Manager, Reporting' },
    ],
  },
  {
    id: 'talloak-materials',
    name: 'Talloak Materials',
    city: 'Scranton',
    state: 'PA',
    industry: 'Building Materials',
    employees: 2100,
    fitScore: 22,
    phase: 'latent',
    segments: ['greenfield'],
    logo: '/logos/talloak-materials.svg',
    monogram: 'TM',
    monogramColor: '#6b7280',
    windowStart: 15,
    windowLength: 12,
    contacts: [{ name: 'Iris Baumann', title: 'Operations Manager' }],
  },
]

export function getCompany(id) {
  return companies.find((c) => c.id === id)
}

/** 14200 -> "14,200" */
export function formatEmployees(n) {
  return n.toLocaleString('en-US')
}
