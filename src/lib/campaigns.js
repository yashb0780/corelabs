/* ==========================================================================
   THE CAMPAIGNS FOR THIS SESSION.

   Held at module scope, like the saved lists and the vendor profile,
   because a campaign can be started from Company Search, from the
   assistant or from the Campaigns screen, and must be on the Campaigns
   screen afterwards. Kept in a page's state it would vanish the moment you
   navigated, which is exactly the silent failure this store exists to stop.

   In memory only. Nothing is persisted, so a reload goes back to the seed
   campaigns in src/data/campaigns.js. That keeps the no-localStorage
   guardrail intact.

   A campaign here records only what happened (see "What is stored, and
   what is worked out" in section 9 of BRIEF.md). Read it through
   campaignView() in src/lib/campaignActivity.js, which works out its
   status, where each contact is and every count.

   FIGURES OTHER SCREENS SHOW come from getCampaignSummary() below, never
   from recalculating: the Campaigns screen's cards and the Reports
   screen's Contacted, Replied and reply rate bars read the same result,
   so the two can never disagree.

   Campaigns are never changed in place: every change replaces the campaign
   object, which is how campaignView() knows to work it out again.
   ========================================================================== */

import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  CAMPAIGN_COPY,
  CAMPAIGN_INBOXES,
  CONTACT_EMAIL_DOMAIN,
  DEFAULT_SUPPRESSION_RULE,
  REPLY_SNIPPETS,
  SEED_CAMPAIGNS,
  SEED_SEQUENCES,
} from '../data/campaigns'
import { SAVED_LISTS } from '../data/savedLists'
import { membersForList, membersFromCompanies, seededRandom } from './listMembers'
import { addDays, atMs, joinAt, msToAt, nowAt, splitAt, todayIso } from './schedule'
import {
  applyDelays,
  campaignMetrics,
  campaignStepTimes,
  campaignView,
  daysToCatchUp,
  funnelCounts,
  HOUR,
  replyRateBars,
} from './campaignActivity'

/* --- Contacts ------------------------------------------------------------- */

/** "Helena Voss" becomes "helena.voss@example.com". */
function emailFor(name) {
  const local = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .trim()
    .split(/\s+/)
    .join('.')
  return `${local}@${CONTACT_EMAIL_DOMAIN}`
}

/** The id the Accounts and Contacts pickers know a contact by, without
    the campaign prefix contactsFrom() adds. */
export const memberId = (contact) => contact.id.slice(contact.id.indexOf(':') + 1)

/**
 * A campaign's contacts from the pickers' shape: accounts, each with its
 * contacts. Ids are prefixed with the campaign's, so the same person in two
 * campaigns has two separate histories.
 */
function contactsFrom(campaignId, accounts) {
  return accounts.flatMap((a) =>
    a.contacts.map((p) => ({
      id: `${campaignId}:${p.id}`,
      companyId: a.id,
      companyName: a.name,
      contactName: p.name,
      role: p.title,
      email: emailFor(p.name),
      reply: null,
      unsubscribedAt: null,
      // The colleagues whose interested replies no longer pause this
      // contact, because someone clicked Resume outreach.
      resumedFrom: [],
      delays: [],
    })),
  )
}

/* --- Seeding -------------------------------------------------------------- */

const round5 = (ms) => Math.round(ms / (5 * 60 * 1000)) * 5 * 60 * 1000

/** The replies and unsubscribes written by hand for a real-company campaign. */
function placeEvents(record, seed, times, now) {
  for (const e of seed.events ?? []) {
    const contact = record.contacts.find(
      (c) => c.companyId === e.company && c.contactName === e.contact,
    )
    if (!contact) {
      throw new Error(`Seed campaign "${seed.id}": no contact called ${e.contact} at ${e.company}.`)
    }
    const index = e.afterStep - 1
    const ms = times[index] + e.hoursLater * HOUR
    if (times[index] === null || ms > now) {
      throw new Error(
        `Seed campaign "${seed.id}": ${e.contact}'s event would be in the future. Make hoursLater smaller or afterStep earlier.`,
      )
    }
    if (e.unsubscribe) {
      contact.unsubscribedAt = msToAt(ms)
    } else {
      contact.reply = {
        type: e.reply,
        rule: record.suppressionRule,
        receivedAt: msToAt(ms),
        decidedAt: null,
        stepIndex: index,
        snippet: e.snippet,
        resumeAt: e.backInDays != null ? addDays(todayIso(), e.backInDays) : null,
      }
    }
  }
}

/**
 * The replies and unsubscribes on a saved list campaign: the counts from
 * the data file, spread one per account at random, the same way every time.
 * Each lands between one hour after a step that has gone out and one hour
 * before the next step, so "which step it followed" is always true.
 */
function placeGenerated(record, seed, times, pausedMs, now) {
  const plan = [
    ...Object.entries(seed.replies ?? {}).flatMap(([type, n]) => Array(n).fill(type)),
    ...Array(seed.unsubscribes ?? 0).fill('unsubscribe'),
  ]
  if (plan.length === 0) return

  const windows = times
    .map((t, index) => {
      if (t === null || t > now || t >= pausedMs) return null
      const next = Math.min(...times.filter((u) => u !== null && u > t), Infinity)
      const lo = t + HOUR
      const hi = Math.min(now - HOUR, next - HOUR, t + 48 * HOUR)
      return hi > lo ? { index, lo, hi } : null
    })
    .filter(Boolean)
  if (windows.length === 0) {
    throw new Error(`Seed campaign "${seed.id}" has replies but has not sent anything yet.`)
  }

  const rand = seededRandom(record.id)
  const pick = (list) => list[Math.floor(rand() * list.length)]
  const accounts = [...new Set(record.contacts.map((c) => c.companyId))]
  // Shuffle, so replies spread across the list rather than bunching at the top.
  for (let i = accounts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[accounts[i], accounts[j]] = [accounts[j], accounts[i]]
  }
  if (plan.length > accounts.length) {
    throw new Error(`Seed campaign "${seed.id}" has more replies and unsubscribes than accounts.`)
  }

  plan.forEach((kind, k) => {
    const contact = pick(record.contacts.filter((c) => c.companyId === accounts[k]))
    const w = pick(windows)
    const ms = round5(w.lo + rand() * (w.hi - w.lo))
    if (kind === 'unsubscribe') {
      contact.unsubscribedAt = msToAt(ms)
      return
    }
    contact.reply = {
      type: kind,
      rule: record.suppressionRule,
      receivedAt: msToAt(ms),
      decidedAt: null,
      stepIndex: w.index,
      snippet: pick(REPLY_SNIPPETS[kind]),
      // Most out of office replies give a return date, a few days on.
      resumeAt: kind === 'ooo' && rand() < 0.6 ? addDays(splitAt(msToAt(ms)).date, 3 + Math.floor(rand() * 8)) : null,
    }
  })
}

function seedCampaign(seed, now) {
  const today = todayIso()
  const list = seed.list ? SAVED_LISTS.find((l) => l.id === seed.list) : null
  if (seed.list && !list) throw new Error(`Seed campaign "${seed.id}": no saved list "${seed.list}".`)
  const accounts = list
    ? membersForList(list.id, list.records, list.contacts)
    : membersFromCompanies(seed.companies)
  const sequence = SEED_SEQUENCES[seed.sequence].map((s) => ({ ...s }))
  const startDay = seed.startsInDays ?? (seed.startedDaysAgo == null ? null : -seed.startedDaysAgo)

  const record = {
    id: seed.id,
    name: seed.name ?? list.name,
    listName: list ? list.name : null,
    type: seed.type,
    draft: Boolean(seed.draft),
    createdAt: joinAt(addDays(today, -seed.createdDaysAgo), '11:00'),
    start: seed.draft || startDay === null ? null : { date: addDays(today, startDay), time: sequence[0].time },
    pausedAt: seed.pausedDaysAgo != null ? joinAt(addDays(today, -seed.pausedDaysAgo), '12:00') : null,
    delays: [],
    suppressionRule: seed.suppression ?? DEFAULT_SUPPRESSION_RULE,
    inbox: seed.inbox ?? CAMPAIGN_INBOXES[0],
    sequence,
    source: list
      ? { accounts: list.records, contacts: list.contacts, seed: list.id }
      : {
          accounts: accounts.length,
          contacts: accounts.reduce((n, a) => n + a.contacts.length, 0),
          companyIds: seed.companies,
        },
    contacts: contactsFrom(seed.id, accounts),
  }

  const times = campaignStepTimes(record)
  const pausedMs = record.pausedAt ? atMs(record.pausedAt) : Infinity
  placeEvents(record, seed, times, now)
  placeGenerated(record, seed, times, pausedMs, now)
  return record
}

/* --- The store ------------------------------------------------------------ */

const listeners = new Set()
let campaigns = null // seeded on first use, so pages that never ask pay nothing
let nextId = 1

function current() {
  if (!campaigns) {
    const now = Date.now()
    campaigns = SEED_CAMPAIGNS.map((s) => seedCampaign(s, now))
  }
  return campaigns
}

function set(next) {
  campaigns = next
  listeners.forEach((fn) => fn())
}

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

/** Every campaign, as stored. Pass each to campaignView() to read it. */
export const getCampaigns = () => current()

export function useCampaigns() {
  return useSyncExternalStore(subscribe, getCampaigns, getCampaigns)
}

export function useCampaign(id) {
  return useCampaigns().find((c) => c.id === id) ?? null
}

/* --- Figures for the screens -------------------------------------------- */

let summaryCache = { campaigns: null, minute: null, summary: null }

/**
 * Every figure worked out across all campaigns, in one place:
 *   views          every campaign as the screens see it (campaignView)
 *   metrics        the five cards on the Campaigns screen
 *   contacted      accounts sent at least one step, each counted once:
 *                  the Account funnel's Contacted stage
 *   replied        those with a reply that is not out of office: the
 *                  funnel's Replied stage, and the top of the Reply rate
 *   replyRateBars  the "Campaign reply rate" report's bars
 * Worked out once each time the campaigns change or the minute turns
 * over, and the same object is handed to everyone who asks until then.
 */
export function getCampaignSummary(now = Date.now()) {
  const list = current()
  const minute = Math.floor(now / 60000)
  if (summaryCache.campaigns === list && summaryCache.minute === minute) return summaryCache.summary

  const views = list.map((c) => campaignView(c, now))
  const { contacted, replied } = funnelCounts(views)
  const summary = {
    views,
    metrics: campaignMetrics(views, now),
    contacted,
    replied,
    replyRateBars: replyRateBars(views),
  }
  summaryCache = { campaigns: list, minute, summary }
  return summary
}

/** getCampaignSummary() for a screen: redraws when a campaign changes,
    and as time passes. */
export function useCampaignSummary() {
  useCampaigns()
  useCampaignClock()
  return getCampaignSummary()
}

/** Every campaign as the screens see it, in the order they were added. */
export function useCampaignViews() {
  return useCampaignSummary().views
}

/**
 * Redraws the screen every half minute. Sends go out and statuses change as
 * time passes, not only when the store changes, so a scheduled campaign
 * turns Active, and a step shows as sent, while the page is open.
 */
export function useCampaignClock() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30 * 1000)
    return () => window.clearInterval(t)
  }, [])
}

/** Replaces one campaign with a changed copy. */
function update(id, change) {
  set(current().map((c) => (c.id === id ? change(c) : c)))
}

function updateContacts(campaign, ids, change) {
  return {
    ...campaign,
    contacts: campaign.contacts.map((c) => (ids.includes(c.id) ? change(c) : c)),
  }
}

/* --- Changes -------------------------------------------------------------- */

/**
 * The fields Start a campaign hands over, shared by a new campaign and a
 * launched draft:
 *   { type, name, listName, source, contacts, sequence, start, inbox, suppressionRule }
 * `contacts` is the pickers' shape: [{ id, name, title, companyId, companyName }].
 * `source` is what the scope was drawn from, { accounts, contacts } plus
 * `companyIds` or a saved list's `seed`, so a draft (a duplicate, say) can
 * reopen Start a campaign on the same accounts. See scopeForCampaign() in
 * src/lib/listActions.js.
 */
function fromSetup(id, input) {
  return {
    name: input.name,
    listName: input.listName ?? null,
    type: input.type,
    draft: false,
    start: input.start,
    pausedAt: null,
    delays: [],
    suppressionRule: input.suppressionRule ?? DEFAULT_SUPPRESSION_RULE,
    inbox: input.inbox,
    sequence: input.sequence,
    source: input.source,
    contacts: contactsFrom(
      id,
      Object.values(
        input.contacts.reduce((byCompany, c) => {
          byCompany[c.companyId] ??= { id: c.companyId, name: c.companyName, contacts: [] }
          byCompany[c.companyId].contacts.push({ id: c.id, name: c.name, title: c.title })
          return byCompany
        }, {}),
      ),
    ),
  }
}

/** A campaign scheduled, or an email sent, from Start a campaign. It goes
    to the top of the list. */
export function addCampaign(input) {
  const id = `campaign-${nextId++}`
  const campaign = { id, createdAt: nowAt(), ...fromSetup(id, input) }
  set([campaign, ...current()])
  return campaign
}

/** A draft launched from Start a campaign. The draft itself becomes the
    campaign; no second one is made. */
export function launchDraft(id, input) {
  update(id, (c) => ({ id, createdAt: c.createdAt, ...fromSetup(id, input) }))
}

export function pauseCampaign(id) {
  update(id, (c) => ({ ...c, pausedAt: nowAt() }))
}

/** Picks up where it stopped. Anything that fell due while paused moves to
    the next occurrence of its step time. */
export function resumeCampaign(id) {
  update(id, (c) => {
    const pausedMs = atMs(c.pausedAt)
    const days = daysToCatchUp(
      campaignStepTimes(c).filter((t) => t !== null && t >= pausedMs),
      Date.now(),
    )
    return {
      ...c,
      pausedAt: null,
      delays: days ? [...c.delays, { from: c.pausedAt, days }] : c.delays,
    }
  })
}

/** A new draft with the same list, steps and setting, and nothing sent. */
export function duplicateCampaign(id) {
  const source = current().find((c) => c.id === id)
  const copyId = `campaign-${nextId++}`
  const copy = {
    ...source,
    id: copyId,
    name: CAMPAIGN_COPY.listCopyName(source.name),
    draft: true,
    createdAt: nowAt(),
    start: null,
    pausedAt: null,
    delays: [],
    contacts: source.contacts.map((c) => ({
      ...c,
      id: `${copyId}:${memberId(c)}`,
      reply: null,
      unsubscribedAt: null,
      resumedFrom: [],
      delays: [],
    })),
  }
  set([copy, ...current()])
  return copy
}

/** Changes what an interested reply does, from now on. A reply keeps the
    setting it was decided under, so pauses that already happened stay
    until outreach is resumed. */
export function setSuppressionRule(id, rule) {
  update(id, (c) => ({ ...c, suppressionRule: rule }))
}

/** Corrects a reply's classification from the review queue. It is decided
    now, under the setting in force now, so it acts from this moment and
    never un-sends a step a colleague already had. */
export function classifyReply(campaignId, contactId, type) {
  update(campaignId, (c) =>
    updateContacts(c, [contactId], (p) => ({
      ...p,
      reply: { ...p.reply, type, rule: c.suppressionRule, decidedAt: nowAt() },
    })),
  )
}

/**
 * Undoes a company's suppression: every colleague paused by an interested
 * reply goes back to where they were, their next step moved to its next
 * occurrence from now. The person who replied stays stopped.
 */
export function resumeOutreach(campaignId, companyId) {
  update(campaignId, (c) => {
    const now = Date.now()
    const paused = campaignView(c, now).activity.filter(
      (a) => a.companyId === companyId && a.status === 'paused_colleague',
    )
    const stepTimes = campaignStepTimes(c)
    return paused.reduce(
      (next, a) =>
        updateContacts(next, [a.id], (p) => {
          const since = atMs(a.pausedSince)
          const days = daysToCatchUp(
            stepTimes.map((t) => applyDelays(t, p.delays)).filter((t) => t !== null && t >= since),
            now,
          )
          return {
            ...p,
            resumedFrom: [...p.resumedFrom, a.suppressedBy],
            delays: days ? [...p.delays, { from: a.pausedSince, days }] : p.delays,
          }
        }),
      c,
    )
  })
}
