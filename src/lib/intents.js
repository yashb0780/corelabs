/* ==========================================================================
   CHAT INTENT MATCHING.

   Turns a chat prompt into filters on the dummy companies, then runs them.
   Pure logic, no UI. The phrases, negation words and chip labels all live
   in content/chat/intents.json; this file only knows how to apply them.

   There is no model. It looks for known phrases, longest first, and checks
   the few words before each one for a negation. That is enough for the
   prompts a demo uses, and it fails loudly (the "could not match" reply)
   rather than guessing.

   A FILTER IS STORED AS { id, negate } and nothing more. The chip label and
   the test are looked up from intents.json every time, so a reworded chip
   shows up in old chats too, and chats can be saved as plain JSON.

   MISSING DATA IS NEVER A SILENT DROP. Same standard as Refine by ICP
   (section 8 of BRIEF.md): a company with nothing on record for a filter's
   field cannot be judged against it. It is not counted as a match and not
   hidden either; it comes back in `notJudged` so the reply can name it.
   ========================================================================== */

import INTENTS from '../../content/chat/intents.json'
import { companies, getCompany, getPhase } from '../data/companies'

const FILTERS = Object.fromEntries(INTENTS.filters.map((f) => [f.id, f]))

/** Lower case, punctuation to spaces. Keeps "/" so "s/4hana" survives. */
const words = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)

const byLength = (a, b) => b.tokens.length - a.tokens.length

const PHRASES = INTENTS.filters
  .flatMap((f) => f.phrases.map((p) => ({ id: f.id, tokens: words(p) })))
  .sort(byLength)

const NEGATIONS = INTENTS.negations.map((n) => ({ tokens: words(n) })).sort(byLength)
const CONJUNCTIONS = new Set(INTENTS.conjunctions)

const COMPANY_NAMES = [
  ...companies.map((c) => ({ id: c.id, tokens: words(c.name) })),
  ...Object.entries(INTENTS.companyAliases).map(([alias, id]) => ({ id, tokens: words(alias) })),
].sort(byLength)

const BRIEF_PHRASES = INTENTS.briefPhrases.map((p) => ({ tokens: words(p) }))

const startsAt = (tokens, i, seq) => seq.every((w, k) => tokens[i + k] === w)
const findIn = (tokens, list) =>
  tokens.some((_, i) => list.some((item) => startsAt(tokens, i, item.tokens)))

/**
 * Whether a negation ends within reach of position `at`, looking no further
 * back than `from` (the end of the previous filter's phrase), so one "not"
 * never flips two filters on its own.
 */
function negatedAt(tokens, from, at) {
  for (let j = from; j < at; j++) {
    const neg = NEGATIONS.find((n) => startsAt(tokens, j, n.tokens))
    if (neg && at - (j + neg.tokens.length) <= INTENTS.negationReach) return true
  }
  return false
}

/** Every filter the prompt names, in order, each with its negation. */
export function findFilters(text) {
  const tokens = words(text)
  const found = []
  let lastEnd = 0
  let lastNegate = false

  for (let i = 0; i < tokens.length; ) {
    const hit = PHRASES.find((p) => startsAt(tokens, i, p.tokens))
    if (!hit) {
      i++
      continue
    }

    const gap = tokens.slice(lastEnd, i)
    // "excluding S/4HANA and Oracle": the exclusion carries over a plain
    // "and" or "or", or no words at all, to the next filter.
    const carried = found.length > 0 && lastNegate && gap.every((w) => CONJUNCTIONS.has(w))
    const negate = carried || negatedAt(tokens, lastEnd, i)

    if (!found.some((f) => f.id === hit.id)) found.push({ id: hit.id, negate })

    lastEnd = i + hit.tokens.length
    lastNegate = negate
    i = lastEnd
  }

  return found
}

/** The company a prompt names, if any. Longest name first. */
export function findCompany(text) {
  const tokens = words(text)
  for (let i = 0; i < tokens.length; i++) {
    const hit = COMPANY_NAMES.find((n) => startsAt(tokens, i, n.tokens))
    if (hit) return getCompany(hit.id)
  }
  return null
}

/**
 * What a prompt is asking for:
 *   { kind: 'brief', companyId }   a named company, with "brief", "prep" and
 *                                  the like, or with no filters at all
 *   { kind: 'results', filters }   one or more filters
 *   { kind: 'nomatch' }            nothing recognised
 */
export function interpret(text) {
  const filters = findFilters(text)
  const company = findCompany(text)
  const asksForBrief = findIn(words(text), BRIEF_PHRASES)

  if (company && (asksForBrief || filters.length === 0)) {
    return { kind: 'brief', companyId: company.id }
  }
  if (filters.length) return { kind: 'results', filters }
  return { kind: 'nomatch' }
}

/* --- Running the filters ------------------------------------------------ */

const contains = (haystack, needle) =>
  String(haystack).toLowerCase().includes(String(needle).toLowerCase())

/**
 * Where each field's values come from on a company, and whether there is
 * anything on record to judge. Unclassified is not a phase, so a company in
 * it has no phase to judge.
 */
const FIELDS = {
  stack: {
    has: (c) => (c.landscape?.stack ?? []).length > 0,
    values: (c) => c.landscape.stack.map((s) => s.name),
  },
  jobs: {
    has: (c) => (c.jobPostings ?? []).length > 0,
    values: (c) => c.jobPostings.flatMap((j) => [j.title, j.snippet, ...(j.keywords ?? [])]),
  },
  phase: {
    has: (c) => getPhase(c.phase).isPhase !== false,
    values: (c) => [c.phase],
  },
  industry: {
    has: (c) => Boolean(c.industry),
    values: (c) => [c.industry],
  },
  segment: {
    has: () => true,
    values: (c) => c.segments ?? [],
  },
}

/** The definition behind a stored { id, negate }, or null if it is gone. */
export function filterDef(filter) {
  return FILTERS[filter.id] ?? null
}

export function filterLabel(filter) {
  const def = filterDef(filter)
  return def ? (filter.negate ? def.exclude : def.include) : ''
}

/**
 * Runs the filters over every company, then any Refine by ICP filters (from
 * src/lib/icp.js) over what is left.
 *
 * @returns {{ matched, notJudged, missing, total }}
 *   matched    passed every filter, highest ICP fit first
 *   notJudged  passed every filter it could be judged on, but had nothing
 *              on record for at least one. Never counted as a match.
 *   missing    the noData names of the fields notJudged companies lack
 *   total      how many companies were searched
 */
export function runFilters(filters, icpFilters = []) {
  const defs = filters.map((f) => ({ f, def: filterDef(f) })).filter((x) => x.def)
  const matched = []
  const notJudged = []
  const missing = new Set()

  for (const company of companies) {
    const lacks = []
    let passes = true

    for (const { f, def } of defs) {
      const field = FIELDS[def.field]
      if (!field.has(company)) {
        lacks.push(def.noData)
        continue
      }
      const hit = field.values(company).some((v) => def.match.some((m) => contains(v, m)))
      if (hit === f.negate) {
        passes = false
        break
      }
    }

    if (passes) passes = icpFilters.every((icp) => icp.test(company))
    if (!passes) continue

    if (lacks.length) {
      notJudged.push(company)
      lacks.forEach((l) => missing.add(l))
    } else {
      matched.push(company)
    }
  }

  matched.sort((a, b) => b.icpFitScore - a.icpFitScore)
  return { matched, notJudged, missing: [...missing], total: companies.length }
}
