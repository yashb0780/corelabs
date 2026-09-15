/**
 * Everything about a campaign that is worked out rather than stored. Pure
 * logic, no UI and no store.
 *
 * The store (src/lib/campaigns.js) keeps only what happened: when a
 * campaign starts, when it was paused, who replied and how, who
 * unsubscribed, when outreach was resumed. This file turns that and the
 * current time into what the screens show: each campaign's status, where
 * each contact is, when they next get a step, and every count.
 *
 * Nothing here is typed in anywhere, so nothing can contradict it. It is the
 * same rule as the Window in src/lib/window.js: if a status ever looks wrong,
 * the recorded events are wrong, not this file.
 *
 * The rules it applies are section 9 of BRIEF.md:
 *   - a not interested reply, or an unsubscribe, stops that contact
 *   - an interested reply stops that contact, unless the campaign keeps
 *     sending to everyone, and under "Stop for the whole company" also
 *     pauses every colleague who still had steps to come
 *   - out of office and unclear stop no one
 *   - the setting that applies is the one in force when the reply was
 *     decided (when it arrived, or when someone corrected it in review),
 *     which the store writes onto the reply as `rule`. Changing the setting
 *     later cannot reach back and rewrite a pause that already happened.
 */
import { STEP_TYPES } from '../data/campaigns'
import { atMs, msToAt, stepSend, joinAt } from './schedule'

const MINUTE = 60 * 1000
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

const stepTypeLabel = Object.fromEntries(STEP_TYPES.map((t) => [t.value, t.label]))

/** What a step is called on screen: its name, or else its type. */
export function stepName(step) {
  return step.name || stepTypeLabel[step.type] || stepTypeLabel.email
}

/* --- When steps go out ---------------------------------------------------- */

/**
 * Pushes a moment back by every delay that reaches it. A delay is
 * { from, days }: anything due at or after `from` moves `days` later.
 * Resuming a pause adds one, so sends that fell due while paused move to
 * the next occurrence of their step time rather than into the past.
 */
export function applyDelays(ms, delays) {
  if (ms === null) return null
  return delays.reduce((t, d) => (t >= atMs(d.from) ? t + d.days * DAY : t), ms)
}

/** When each step of a campaign goes out, before any one contact's delays.
    Null for a step with no day, and for every step of an unstarted draft. */
export function campaignStepTimes(campaign) {
  return campaign.sequence.map((step) => {
    if (!campaign.start) return null
    const send = stepSend(campaign.start, step)
    return send ? applyDelays(atMs(joinAt(send.date, send.time)), campaign.delays) : null
  })
}

/**
 * The fewest whole days to push a set of sends back so the first one is in
 * the future. Used when a pause is lifted: sends keep their time of day.
 */
export function daysToCatchUp(times, now) {
  const due = times.filter((t) => t !== null)
  if (due.length === 0) return 0
  const first = Math.min(...due)
  let days = 0
  while (first + days * DAY <= now) days++
  return days
}

/** When a reply counts from: when it arrived, or when it was corrected. */
const decidedMs = (reply) => atMs(reply.decidedAt ?? reply.receivedAt)

/* --- One contact ---------------------------------------------------------- */

function deriveContact(campaign, contact, stepTimes, companyStops, pausedMs, now) {
  const times = stepTimes.map((t) => applyDelays(t, contact.delays))

  // A reply or unsubscribe written for a moment not yet reached is ignored.
  const reply = contact.reply && atMs(contact.reply.receivedAt) <= now ? contact.reply : null
  const unsubMs =
    contact.unsubscribedAt && atMs(contact.unsubscribedAt) <= now ? atMs(contact.unsubscribedAt) : Infinity

  // Their own reply stops them if it is a no, or a yes the campaign does not
  // keep sending after.
  let ownStop = Infinity
  if (reply) {
    const at = decidedMs(reply)
    if (at <= now) {
      if (reply.type === 'not_interested') ownStop = at
      if (reply.type === 'interested' && reply.rule !== 'keep_sending') ownStop = at
    }
  }

  // A colleague's interested reply pauses them, unless outreach was resumed
  // for them from that reply.
  const colleague = (companyStops.get(contact.companyId) ?? [])
    .filter((s) => s.by !== contact.id && !contact.resumedFrom.includes(s.by))
    .sort((a, b) => a.at - b.at)[0]
  const colleagueStop = colleague ? colleague.at : Infinity

  // Nothing goes out at or after the first thing that stops it.
  const cutoff = Math.min(ownStop, unsubMs, colleagueStop, pausedMs)
  const sends = []
  times.forEach((t, index) => {
    if (t !== null && t <= now && t < cutoff) sends.push({ index, ms: t })
  })
  const last = sends.reduce((a, b) => (!a || b.ms >= a.ms ? b : a), null)

  let status
  if (unsubMs !== Infinity) status = 'unsubscribed'
  else if (ownStop !== Infinity) status = 'stopped'
  else if (colleagueStop <= now) status = 'paused_colleague'
  else if (!last) status = 'not_started'
  else if (sends.length === times.filter((t) => t !== null).length) status = 'finished'
  else status = 'in_sequence'

  const halted = status === 'unsubscribed' || status === 'stopped' || status === 'paused_colleague'
  const upcoming = times.filter((t) => t !== null && t > now)
  const next = halted || pausedMs !== Infinity || upcoming.length === 0 ? null : Math.min(...upcoming)

  return {
    id: contact.id,
    campaignId: campaign.id,
    companyId: contact.companyId,
    companyName: contact.companyName,
    contactName: contact.contactName,
    role: contact.role,
    email: contact.email,
    lastStepIndex: last ? last.index : null,
    lastStepName: last ? stepName(campaign.sequence[last.index]) : null,
    lastSentAt: last ? msToAt(last.ms) : null,
    nextSendAt: next === null ? null : msToAt(next),
    status,
    replyType: reply ? reply.type : null,
    replySnippet: reply ? reply.snippet : null,
    replyReceivedAt: reply ? reply.receivedAt : null,
    replyStepIndex: reply ? reply.stepIndex : null,
    resumeAt: reply && reply.type === 'ooo' ? reply.resumeAt : null,
    unsubscribedAt: unsubMs === Infinity ? null : contact.unsubscribedAt,
    suppressedBy: status === 'paused_colleague' ? colleague.by : null,
    // When the colleague's reply paused them, for Resume outreach.
    pausedSince: status === 'paused_colleague' ? msToAt(colleague.at) : null,
    // Every step they have been sent, for the counts.
    sends: sends.map((s) => ({ index: s.index, at: msToAt(s.ms) })),
  }
}

/* --- One campaign --------------------------------------------------------- */

function campaignStatus(campaign, stepTimes, activity, now) {
  if (campaign.draft) return 'draft'
  if (campaign.pausedAt) return 'paused'
  const times = stepTimes.filter((t) => t !== null)
  if (times.length === 0 || Math.min(...times) > now) return 'scheduled'
  if (Math.max(...times) <= now && activity.every((a) => a.nextSendAt === null)) return 'completed'
  return 'active'
}

function campaignStats(campaign, activity) {
  const replies = { interested: 0, ooo: 0, not_interested: 0, unclear: 0, total: 0 }
  const accounts = new Set()
  const contacted = new Set()
  const replied = new Set()
  let emailsSent = 0
  let unsubscribed = 0
  let lastActivity = null
  let lastSend = null
  let nextSend = null

  const later = (a, b) => (a === null || atMs(b) > atMs(a) ? b : a)

  for (const a of activity) {
    accounts.add(a.companyId)
    if (a.sends.length) contacted.add(a.companyId)
    for (const s of a.sends) {
      if (campaign.sequence[s.index].type === 'email') emailsSent++
      lastActivity = later(lastActivity, s.at)
      if (!lastSend || atMs(s.at) > atMs(lastSend.at)) {
        lastSend = {
          stepIndex: s.index,
          stepName: stepName(campaign.sequence[s.index]),
          contactName: a.contactName,
          companyName: a.companyName,
          at: s.at,
        }
      }
    }
    if (a.replyType) {
      replies[a.replyType]++
      replies.total++
      if (a.replyType !== 'ooo') replied.add(a.companyId)
      lastActivity = later(lastActivity, a.replyReceivedAt)
    }
    if (a.unsubscribedAt) {
      unsubscribed++
      lastActivity = later(lastActivity, a.unsubscribedAt)
    }
    if (a.nextSendAt && (!nextSend || atMs(a.nextSendAt) < atMs(nextSend))) nextSend = a.nextSendAt
  }

  return {
    accounts: accounts.size,
    contacts: activity.length,
    emailsSent,
    accountsContacted: contacted.size,
    accountsReplied: replied.size,
    replies,
    unsubscribed,
    lastActivityAt: lastActivity,
    lastSend,
    nextSendAt: nextSend,
  }
}

function derive(campaign, now) {
  const stepTimes = campaignStepTimes(campaign)
  const pausedMs = campaign.pausedAt ? atMs(campaign.pausedAt) : Infinity

  // Every interested reply that pauses the rest of its company, by company.
  const companyStops = new Map()
  if (!campaign.draft) {
    for (const c of campaign.contacts) {
      const r = c.reply
      if (!r || r.type !== 'interested' || atMs(r.receivedAt) > now) continue
      const at = decidedMs(r)
      if (at > now || r.rule !== 'stop_company') continue
      if (!companyStops.has(c.companyId)) companyStops.set(c.companyId, [])
      companyStops.get(c.companyId).push({ at, by: c.id })
    }
  }

  const activity = campaign.contacts.map((c) =>
    deriveContact(campaign, c, stepTimes, companyStops, pausedMs, now),
  )
  const status = campaignStatus(campaign, stepTimes, activity, now)

  return {
    id: campaign.id,
    name: campaign.name,
    listName: campaign.listName,
    type: campaign.type,
    status,
    createdAt: campaign.createdAt,
    startedAt: campaign.start ? joinAt(campaign.start.date, campaign.start.time) : null,
    pausedAt: campaign.pausedAt,
    suppressionRule: campaign.suppressionRule,
    inbox: campaign.inbox,
    sequence: campaign.sequence,
    stats: campaignStats(campaign, activity),
    activity,
  }
}

/*
 * Working out a big list's activity takes a moment, and the screens ask for
 * it on every render, so the answer is kept until the campaign changes (the
 * store replaces a campaign object whenever it changes) or the minute turns
 * over (sends and statuses move with the clock).
 */
const cache = new WeakMap()

/** A campaign as the screens see it. See "Data shape" in section 9 of BRIEF.md. */
export function campaignView(campaign, now = Date.now()) {
  const minute = Math.floor(now / MINUTE)
  const hit = cache.get(campaign)
  if (hit && hit.minute === minute) return hit.view
  const view = derive(campaign, now)
  cache.set(campaign, { minute, view })
  return view
}

/* --- Across every campaign ------------------------------------------------ */

/**
 * Accounts contacted and accounts that replied, across every campaign. Each
 * account counts once however many campaigns reached it. Out of office is
 * not a reply here, because an auto reply is not a person answering. These
 * are the Contacted and Replied stages of the Account funnel report.
 */
export function funnelCounts(views) {
  const contacted = new Set()
  const replied = new Set()
  for (const v of views) {
    for (const a of v.activity) {
      if (a.sends.length) contacted.add(a.companyId)
      if (a.replyType && a.replyType !== 'ooo') replied.add(a.companyId)
    }
  }
  return { contacted: contacted.size, replied: replied.size }
}

/** The five cards above the campaign table. They cover every campaign. */
export function campaignMetrics(views, now = Date.now()) {
  const monthAgo = now - 30 * DAY
  let contactsInSequence = 0
  let emailsLast30Days = 0
  let interested = 0
  let needReview = 0

  for (const v of views) {
    for (const a of v.activity) {
      if (v.status === 'active' && (a.status === 'not_started' || a.status === 'in_sequence')) {
        contactsInSequence++
      }
      for (const s of a.sends) {
        if (v.sequence[s.index].type === 'email' && atMs(s.at) > monthAgo) emailsLast30Days++
      }
      if (a.replyType === 'interested') interested++
      if (a.replyType === 'unclear') needReview++
    }
  }

  const { contacted, replied } = funnelCounts(views)
  return {
    activeCampaigns: views.filter((v) => v.status === 'active').length,
    scheduledCampaigns: views.filter((v) => v.status === 'scheduled').length,
    contactsInSequence,
    emailsLast30Days,
    replyRate: contacted ? replied / contacted : null,
    interestedReplies: interested,
    needReview,
  }
}

/**
 * The bars of the "Campaign reply rate" report: every campaign run from a
 * saved list that has contacted someone, as a percentage to one decimal,
 * highest first. Same definition as the Reply rate card.
 */
export function replyRateBars(views) {
  return views
    .filter((v) => v.listName && v.stats.accountsContacted > 0)
    .map((v) => ({
      label: v.name,
      value: Math.round((1000 * v.stats.accountsReplied) / v.stats.accountsContacted) / 10,
    }))
    .sort((a, b) => b.value - a.value)
}
