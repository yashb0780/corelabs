/* ==========================================================================
   THE WINDOW RULE.

   Window is never stored on a company. It is computed from the company's
   Decision Phase and the "Selling as" archetype, using the table below,
   which comes from section 2 of BRIEF.md.

   Window never renders a date range. It renders exactly one of:
   Open, Narrowing, Closed, Re-opening, Unknown.
   ========================================================================== */

export const WINDOW_STATES = {
  open: {
    id: 'open',
    label: 'Open',
    tone: 'green',
    description: 'Buying window is open.',
  },
  narrowing: {
    id: 'narrowing',
    label: 'Narrowing',
    tone: 'amber',
    description: 'Window is closing. Decisions are being locked in.',
  },
  closed: {
    id: 'closed',
    label: 'Closed',
    tone: 'grey',
    description: 'No route in at the moment.',
  },
  're-opening': {
    id: 're-opening',
    label: 'Re-opening',
    tone: 'blue',
    description: 'A closed window is coming back around.',
  },
  unknown: {
    id: 'unknown',
    label: 'Unknown',
    tone: 'grey',
    dashed: true,
    description: 'Not enough evidence to place this account.',
  },
}

/**
 * Phase, by archetype, gives the window state. Straight from the brief.
 * Rows are phase ids, columns are archetype ids.
 */
const WINDOW_BY_PHASE = {
  latent: {
    'migration-si': 'open',
    'ecc-continuity': 'open',
    'alternative-erp': 'open',
  },
  evaluating: {
    'migration-si': 'open',
    'ecc-continuity': 'narrowing',
    'alternative-erp': 'open',
  },
  mobilizing: {
    'migration-si': 'narrowing',
    'ecc-continuity': 'closed',
    'alternative-erp': 'narrowing',
  },
  executing: {
    'migration-si': 'closed',
    'ecc-continuity': 'closed',
    'alternative-erp': 'closed',
  },
  landed: {
    'migration-si': 'closed',
    'ecc-continuity': 'closed',
    'alternative-erp': 'closed',
  },
  're-expanding': {
    'migration-si': 're-opening',
    'ecc-continuity': 'closed',
    'alternative-erp': 'open',
  },
  unclassified: {
    'migration-si': 'unknown',
    'ecc-continuity': 'unknown',
    'alternative-erp': 'unknown',
  },
}

/**
 * The one place the Window value is decided.
 * @param {string} phase     a Decision Phase id
 * @param {string} archetype a selling archetype id
 * @returns {{id, label, tone, description, dashed?}}
 */
export function computeWindow(phase, archetype) {
  const row = WINDOW_BY_PHASE[phase]
  if (!row) return WINDOW_STATES.unknown
  return WINDOW_STATES[row[archetype]] ?? WINDOW_STATES.unknown
}
