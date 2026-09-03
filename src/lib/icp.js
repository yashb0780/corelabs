/* ==========================================================================
   REFINE BY ICP.

   Turns the vendor profile into a set of filters, and applies them to a list
   of companies. Pure logic: no UI, no copy beyond the labels passed in.

   TWO DECISIONS WORTH KNOWING ABOUT

   1. Size bands are treated as a floor, not an exact bracket. A firm that
      sells to "$1B to $10B" also sells to anything larger, so the band is
      read as "this size and above". Reading it as an exact bracket would
      remove nearly everything and would surprise the user. The chip says
      "and above" so what was applied is never ambiguous.

   2. Missing data keeps a company in, it never removes it. A company with no
      revenue on record, or no technology stack identified, cannot be judged
      against those filters, and dropping it would hide an account for a
      reason the user cannot see. That is the exact failure this screen is
      designed to avoid.
   ========================================================================== */

import { EMPLOYEE_BANDS, ICP_REFINE_COPY as COPY, REVENUE_BANDS } from '../data/vendorProfile'

/** The lower bound of each band. See decision 1 above. */
const EMPLOYEE_FLOOR = {
  '1-10': 1,
  '11-50': 11,
  '51-200': 51,
  '201-1000': 201,
  '1001-5000': 1001,
  '5000+': 5001,
}

const REVENUE_FLOOR = {
  '<10m': 0,
  '10m-50m': 10e6,
  '50m-250m': 50e6,
  '250m-1b': 250e6,
  '1b-10b': 1e9,
  '10b+': 10e9,
}

/**
 * The chip wording for a band. Bands carry their own floor phrasing
 * ("$10B+", "5,000+") so the chip does not have to bolt "and above" onto a
 * label that already says "Over $10B".
 */
const bandFloorLabel = (bands, value) => {
  const band = bands.find((b) => b.value === value)
  return band?.atLeast ?? band?.label ?? value
}

/**
 * "$47.1B est." -> 47100000000. Returns null when there is no figure to
 * read, which keeps the company in rather than dropping it.
 */
export function parseRevenue(text) {
  if (!text) return null
  const match = String(text).match(/([\d.]+)\s*([BbMmKk])?/)
  if (!match) return null

  const amount = Number.parseFloat(match[1])
  if (Number.isNaN(amount)) return null

  const scale = { b: 1e9, m: 1e6, k: 1e3 }[(match[2] || '').toLowerCase()] ?? 1
  return amount * scale
}

const contains = (haystack, needle) =>
  String(haystack).toLowerCase().includes(String(needle).toLowerCase())

/**
 * The filters this profile produces. Each carries the label shown on its
 * chip and a test the company has to pass.
 *
 * @returns {Array<{id, label, test: (company) => boolean}>}
 */
export function deriveIcpFilters(profile) {
  if (!profile) return []
  const filters = []

  if (profile.technologies?.length) {
    const wanted = profile.technologies
    filters.push({
      id: 'technologies',
      label: `${COPY.technologies}: ${wanted.join(', ')}`,
      test: (c) => {
        const stack = c.landscape?.stack ?? []
        if (stack.length === 0) return true // nothing on record, so keep
        return stack.some((s) => wanted.some((w) => contains(s.name, w)))
      },
    })
  }

  if (profile.sellsToRevenue) {
    const floor = REVENUE_FLOOR[profile.sellsToRevenue] ?? 0
    filters.push({
      id: 'revenue',
      label: `${COPY.revenue}: ${bandFloorLabel(REVENUE_BANDS, profile.sellsToRevenue)}`,
      test: (c) => {
        const value = parseRevenue(c.revenue)
        if (value === null) return true // not disclosed, so keep
        return value >= floor
      },
    })
  }

  if (profile.sellsToEmployees) {
    const floor = EMPLOYEE_FLOOR[profile.sellsToEmployees] ?? 0
    filters.push({
      id: 'employees',
      label: `${COPY.employees}: ${bandFloorLabel(EMPLOYEE_BANDS, profile.sellsToEmployees)}`,
      test: (c) =>
        typeof c.employees === 'number' ? c.employees >= floor : true,
    })
  }

  if (profile.industriesInclude?.length) {
    const wanted = profile.industriesInclude
    filters.push({
      id: 'industriesInclude',
      label: `${COPY.industriesInclude}: ${wanted.join(', ')}`,
      test: (c) => (c.industry ? wanted.some((w) => contains(c.industry, w)) : true),
    })
  }

  if (profile.industriesExclude?.length) {
    const unwanted = profile.industriesExclude
    filters.push({
      id: 'industriesExclude',
      label: `${COPY.industriesExclude}: ${unwanted.join(', ')}`,
      test: (c) =>
        c.industry ? !unwanted.some((w) => contains(c.industry, w)) : true,
    })
  }

  return filters
}

/**
 * Runs the filters over a list.
 * @returns {{ kept: Array, removed: Array }} both halves, because the screen
 *   has to be able to say how many were taken out.
 */
export function applyIcpFilters(companies, filters) {
  if (!filters.length) return { kept: companies, removed: [] }

  const kept = []
  const removed = []
  for (const company of companies) {
    if (filters.every((f) => f.test(company))) kept.push(company)
    else removed.push(company)
  }
  return { kept, removed }
}
