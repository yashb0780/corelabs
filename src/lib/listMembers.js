/**
 * The accounts and contacts a campaign scope is made of, for the Accounts
 * and Contacts pickers in Start a campaign. Pure logic, no UI.
 *
 * Every account comes back in one shape:
 *   { id, name, industry, contacts: [{ id, name, title }] }
 *
 * Company Search scopes use the real companies and their contact records.
 * A saved list only records counts, so its accounts and contacts are
 * generated from the word lists in src/data/listMembers.js, to exactly its
 * counts. The generator is seeded by the list's id, so the same list always
 * produces the same accounts and people.
 */
import { companies } from '../data/companies'
import {
  COMMITTEE_TITLES,
  DEFAULT_INDUSTRIES,
  FIRST_NAMES,
  INDUSTRIES,
  LAST_NAMES,
  LIST_INDUSTRIES,
  MAX_CONTACTS_PER_ACCOUNT,
  NAME_FORMS,
  NAME_STARTS,
  SENIOR_TITLES,
} from '../data/listMembers'

/* --- Real companies ------------------------------------------------------ */

export function membersFromCompanies(ids) {
  return companies
    .filter((c) => ids.includes(c.id))
    .map((c) => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      contacts: c.contacts.map((p, i) => ({ id: `${c.id}-${i}`, name: p.name, title: p.title })),
    }))
}

/* --- Generated for a saved list ------------------------------------------ */

/** A small seeded random number generator, so output is repeatable. Also
    used to place the replies on a saved list's seed campaign. */
export function seededRandom(seed) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)]

/**
 * How many contacts each account gets: at least one each, the rest spread
 * at random, never more than the cap, always adding up to `total`.
 */
function spread(rand, accounts, total) {
  const counts = Array(accounts).fill(1)
  let left = total - accounts
  while (left > 0) {
    const i = Math.floor(rand() * accounts)
    if (counts[i] < MAX_CONTACTS_PER_ACCOUNT) {
      counts[i]++
      left--
    }
  }
  return counts
}

function companyName(rand, industryKeys, used) {
  for (let tries = 0; tries < 200; tries++) {
    const industry = INDUSTRIES[pick(rand, industryKeys)]
    const form = pick(rand, NAME_FORMS)
    const name = [pick(rand, NAME_STARTS), pick(rand, industry.endings), form]
      .filter(Boolean)
      .join(' ')
    if (!used.has(name)) {
      used.add(name)
      return { name, industry: industry.label }
    }
  }
  // Only reachable if a list is far bigger than the word lists allow.
  const name = `${pick(rand, NAME_STARTS)} ${used.size + 1}`
  used.add(name)
  return { name, industry: INDUSTRIES[industryKeys[0]].label }
}

/** One account's people: a senior lead, then the rest of the committee. */
function people(rand, accountId, count) {
  const titles = [pick(rand, SENIOR_TITLES)]
  while (titles.length < count) {
    const t = pick(rand, [...SENIOR_TITLES, ...COMMITTEE_TITLES])
    if (!titles.includes(t)) titles.push(t)
  }
  const names = new Set()
  return titles.map((title, i) => {
    let name
    do name = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`
    while (names.has(name))
    names.add(name)
    return { id: `${accountId}-c${i}`, name, title }
  })
}

const generated = new Map()

export function membersForList(seed, accounts, contacts) {
  const key = `${seed}:${accounts}:${contacts}`
  if (generated.has(key)) return generated.get(key)

  const rand = seededRandom(seed)
  const industryKeys = LIST_INDUSTRIES[seed] ?? DEFAULT_INDUSTRIES
  const counts = spread(rand, accounts, Math.max(contacts, accounts))
  const used = new Set()

  const members = counts.map((n, i) => {
    const id = `${seed}-a${i}`
    const { name, industry } = companyName(rand, industryKeys, used)
    return { id, name, industry, contacts: people(rand, id, n) }
  })

  generated.set(key, members)
  return members
}

/* --- Any scope ----------------------------------------------------------- */

/** The accounts behind a scope from src/lib/listActions.js. */
export function scopeMembers(scope) {
  if (scope.companyIds) return membersFromCompanies(scope.companyIds)
  if (scope.seed) return membersForList(scope.seed, scope.accounts, scope.contacts)
  return []
}
