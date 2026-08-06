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
     windowState   Window, must be one of the ids in WINDOW_STATES
     segments      which segment pills this company belongs to
                   (ids come from src/data/segments.js)
     logo          path to its SVG in public/logos/. If the file is missing
                   the table falls back to a colored monogram tile.
     monogram      the 1-2 letters for that fallback tile
     monogramColor the fallback tile color
     contacts      people on the account, shown in the Contacts column
   ========================================================================== */

/* --- Decision Phase -------------------------------------------------------
   Seven phases. `tone` picks the pill color from the tone palette in
   src/styles/tokens.css.

   `unclassified` is the fallback: a company whose phase cannot be determined
   gets it automatically, so the column is never blank.
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
  {
    id: 'landed',
    label: 'Landed',
    tone: 'green',
    // NOTE: tone assumed. BRIEF.md was not available to confirm it.
    description: 'Migration complete and running.',
  },
  {
    id: 're-expanding',
    label: 'Re-expanding',
    tone: 'teal',
    // NOTE: tone assumed. BRIEF.md was not available to confirm it.
    description: 'Post-migration, opening new scope.',
  },
  {
    id: 'unclassified',
    label: 'Unclassified',
    tone: 'grey',
    // NOTE: tone assumed. BRIEF.md was not available to confirm it.
    description: 'Not enough signal to place this account.',
  },
]

/** Falls back to Unclassified rather than guessing a phase. */
export function getPhase(id) {
  return (
    DECISION_PHASES.find((p) => p.id === id) ??
    DECISION_PHASES.find((p) => p.id === 'unclassified')
  )
}

/* --- THE WINDOW COLUMN ----------------------------------------------------
   Four states. The "Selling as:" dropdown changes which one a company shows.

   !! THE COMPUTATION RULE IS STILL A PLACEHOLDER !!
   The real rule lives in BRIEF.md, which does not exist on disk - it could
   not be read, so it could not be implemented. What is correct here is the
   set of four values and the fact that the dropdown shifts between them.
   What is invented is HOW it shifts (the `shift` numbers below).

   When the real rule arrives, only computeWindow() and the `shift` values
   need to change. Nothing else reads these.
   ------------------------------------------------------------------------ */

export const WINDOW_STATES = [
  {
    id: 'open',
    label: 'Open',
    tone: 'green',
    description: 'Buying window is open now.',
  },
  {
    id: 'narrowing',
    label: 'Narrowing',
    tone: 'amber',
    description: 'Window is closing, decisions are being locked.',
  },
  {
    id: 'closed',
    label: 'Closed',
    tone: 'grey',
    description: 'No route in at the moment.',
  },
  {
    id: 're-opening',
    label: 'Re-opening',
    tone: 'blue',
    description: 'A closed window is coming back around.',
  },
]

/** The order the states sit in when the archetype shifts a company along. */
const WINDOW_ORDER = ['closed', 're-opening', 'narrowing', 'open']

export const SELLING_ARCHETYPES = [
  {
    id: 'migration-si',
    label: 'Migration SI',
    // The baseline. A company shows the windowState set in its own data.
    shift: 0,
  },
  {
    id: 'ecc-continuity',
    label: 'ECC continuity',
    // Staying on ECC suits accounts that are not ready to move, so windows
    // that look shut to a migration seller look better here. PLACEHOLDER.
    shift: 1,
  },
  {
    id: 'alternative-erp',
    label: 'Alternative ERP',
    // Hardest sell: you need to arrive before the account commits, so most
    // windows read tighter. PLACEHOLDER.
    shift: -1,
  },
]

export const DEFAULT_ARCHETYPE = SELLING_ARCHETYPES[0].id

export function getWindowState(id) {
  return WINDOW_STATES.find((w) => w.id === id) ?? WINDOW_STATES[2]
}

/**
 * Returns the Window state for one company under one selling archetype.
 * @returns {{ id, label, tone, description }}
 */
export function computeWindow(company, archetypeId) {
  const archetype =
    SELLING_ARCHETYPES.find((a) => a.id === archetypeId) ??
    SELLING_ARCHETYPES[0]

  const at = WINDOW_ORDER.indexOf(company.windowState)
  if (at === -1) return getWindowState(company.windowState)

  const moved = Math.min(
    WINDOW_ORDER.length - 1,
    Math.max(0, at + archetype.shift),
  )
  return getWindowState(WINDOW_ORDER[moved])
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
    windowState: 'open',
    segments: ['scm'],
    logo: '/logos/meridian-foods.svg',
    monogram: 'MF',
    monogramColor: '#5b5bd6',
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
    windowState: 'open',
    segments: ['multi-erp'],
    logo: '/logos/calder-industrial.svg',
    monogram: 'CI',
    monogramColor: '#14764a',
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
    windowState: 'narrowing',
    segments: ['fico'],
    logo: '/logos/aventine-health.svg',
    monogram: 'AH',
    monogramColor: '#1361c0',
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
    windowState: 'open',
    segments: ['greenfield'],
    logo: '/logos/ridgeline-energy.svg',
    monogram: 'RE',
    monogramColor: '#8a6300',
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
    windowState: 'narrowing',
    segments: ['scm'],
    logo: '/logos/halcyon-retail.svg',
    monogram: 'HR',
    monogramColor: '#bc3229',
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
    windowState: 'narrowing',
    segments: ['scm'],
    logo: '/logos/portsmith-logistics.svg',
    monogram: 'PL',
    monogramColor: '#14746c',
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
    windowState: 're-opening',
    segments: ['greenfield', 'multi-erp'],
    logo: '/logos/brightmoor-chemical.svg',
    monogram: 'BC',
    monogramColor: '#97398f',
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
    windowState: 'closed',
    segments: ['fico'],
    logo: '/logos/kestrel-financial.svg',
    monogram: 'KF',
    monogramColor: '#4a4ac2',
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
    windowState: 'closed',
    segments: ['greenfield'],
    logo: '/logos/talloak-materials.svg',
    monogram: 'TM',
    monogramColor: '#5f6470',
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
