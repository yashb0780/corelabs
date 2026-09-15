/**
 * CHECKS FOR THE CAMPAIGNS STORE.
 *
 * Run it from the project folder:
 *
 *   node scripts/check-campaigns.mjs
 *
 * It prints one line per group of checks and ends with "All checks passed"
 * or a list of what failed. Nothing is installed, and nothing in the
 * prototype changes: it only reads.
 *
 * Why it exists: every date in src/data/campaigns.js is written relative to
 * today, and everything on the Campaigns screen is worked out from those
 * dates and the time of day. A seed campaign that looks right at 2:00 PM can
 * go wrong at 8:59 AM, a minute before its steps go out. So this loads the
 * real store (through Vite, the same way the app does) at several times of
 * day and checks every case section 9 of BRIEF.md names, then checks the
 * changes the screen can make: schedule, send now, duplicate, launch a
 * draft, pause and resume, correct a reply, resume outreach.
 *
 * Run it after changing anything in src/data/campaigns.js,
 * src/lib/campaigns.js or src/lib/campaignActivity.js.
 */
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

/* --- A clock the checks can set ------------------------------------------ */

// The store and every date helper read the time from Date, so replacing it
// moves the whole prototype to whatever moment a check needs.
const RealDate = globalThis.Date
let clock = RealDate.now()

class TestDate extends RealDate {
  constructor(...args) {
    super(...(args.length ? args : [clock]))
  }
  static now() {
    return clock
  }
}
globalThis.Date = TestDate

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Today, or `days` from today, at "HH:MM" local time. */
function at(time, days = 0) {
  const d = new RealDate()
  const [h, m] = time.split(':').map(Number)
  return new RealDate(d.getFullYear(), d.getMonth(), d.getDate() + days, h, m).getTime()
}

/* --- Loading the prototype's own code ------------------------------------ */

const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true },
})

/** A fresh copy of every module, so each run starts from the seed data. */
async function load() {
  server.moduleGraph.invalidateAll()
  const get = (path) => server.ssrLoadModule(path)
  return {
    store: await get('/src/lib/campaigns.js'),
    activity: await get('/src/lib/campaignActivity.js'),
    data: await get('/src/data/campaigns.js'),
    lists: await get('/src/data/savedLists.js'),
    companies: await get('/src/data/companies.js'),
    reports: await get('/src/data/reports.js'),
    listActions: await get('/src/lib/listActions.js'),
    listMembers: await get('/src/lib/listMembers.js'),
    schedule: await get('/src/lib/schedule.js'),
  }
}

/* --- Reporting ------------------------------------------------------------ */

const failures = []
let group = ''
let groups = 0

function check(ok, message) {
  if (!ok) failures.push(`${group}: ${message}`)
}

function section(name, fn) {
  group = name
  groups++
  const before = failures.length
  try {
    fn()
  } catch (e) {
    failures.push(`${name}: threw ${e.stack ?? e}`)
  }
  console.log(`${failures.length === before ? 'ok  ' : 'FAIL'}  ${name}`)
}

/* --- What the brief says each seed campaign shows ------------------------- */

const EXPECTED = {
  'priority-accounts': { status: 'active', lastStep: 1, nextSend: true },
  'leanix-signal-q3-outreach': { status: 'active', lastStep: 2, nextSend: true },
  'legacy-ecc-healthcare-outreach': { status: 'active', lastStep: 1, nextSend: true },
  's4hana-2027-mid-market-outreach': { status: 'active', lastStep: 0, nextSend: true },
  'tx-manufacturing-outreach': { status: 'paused', lastStep: 1, nextSend: false },
  'rise-evaluators-midwest-outreach': { status: 'completed', lastStep: 3, nextSend: false },
  'clean-core-chemicals-email': { status: 'completed', lastStep: 0, nextSend: false },
  'warm-accounts': { status: 'active', lastStep: 1, nextSend: false },
  'industrial-first-touch': { status: 'active', lastStep: 0, nextSend: true },
  'btp-postings-outreach': { status: 'scheduled', lastStep: null, nextSend: true },
  'ohio-food-beverage-draft': { status: 'draft', lastStep: null, nextSend: false },
}

const person = (view, name) => view.activity.find((a) => a.contactName === name)
const atCompany = (view, companyId) => view.activity.filter((a) => a.companyId === companyId)

/* --- The seed data, at one moment ----------------------------------------- */

async function checkSeeds(label, now) {
  clock = now
  console.log(`\n${label}`)
  const m = await load()
  const { store, activity, data } = m
  const views = store.getCampaigns().map((c) => activity.campaignView(c, now))
  const byId = Object.fromEntries(views.map((v) => [v.id, v]))

  section('every seed campaign is present, with the status and last step the brief gives', () => {
    check(views.length === data.SEED_CAMPAIGNS.length, `expected ${data.SEED_CAMPAIGNS.length} campaigns, got ${views.length}`)
    for (const [id, want] of Object.entries(EXPECTED)) {
      const v = byId[id]
      if (!v) {
        check(false, `${id} is missing`)
        continue
      }
      check(v.status === want.status, `${id} is ${v.status}, expected ${want.status}`)
      const last = v.stats.lastSend ? v.stats.lastSend.stepIndex : null
      check(last === want.lastStep, `${id} last step sent is index ${last}, expected ${want.lastStep}`)
      check(Boolean(v.stats.nextSendAt) === want.nextSend, `${id} next send is ${v.stats.nextSendAt}`)
    }
  })

  section('nothing is sent, received or due at the wrong time', () => {
    for (const v of views) {
      for (const a of v.activity) {
        if (a.nextSendAt) check(m.schedule.atMs(a.nextSendAt) > now, `${v.id}: ${a.contactName} has a next send in the past`)
        for (const s of a.sends) check(m.schedule.atMs(s.at) <= now, `${v.id}: ${a.contactName} was sent a step in the future`)
        if (a.replyReceivedAt) {
          check(m.schedule.atMs(a.replyReceivedAt) <= now, `${v.id}: ${a.contactName} replied in the future`)
          check(a.replyStepIndex !== null && a.sends.some((s) => s.index === a.replyStepIndex), `${v.id}: ${a.contactName} replied after a step they were never sent`)
        }
        if (a.status === 'paused_colleague') check(a.nextSendAt === null, `${v.id}: ${a.contactName} is paused but has a next send`)
      }
    }
  })

  section('Priority accounts shows the four named cases, and Coca-Cola for contrast', () => {
    const v = byId['priority-accounts']
    const helena = person(v, 'Helena Voss')
    check(helena.replyType === 'interested' && helena.status === 'stopped', `Helena Voss is ${helena.status}, ${helena.replyType}`)
    for (const name of ['Raymond Cho', 'Anita Brenner']) {
      const p = person(v, name)
      check(p.status === 'paused_colleague', `${name} is ${p.status}, expected paused_colleague`)
      check(p.suppressedBy === helena.id, `${name} is not paused by Helena Voss`)
    }
    const jonah = person(v, 'Jonah Weiss')
    check(jonah.replyType === 'ooo' && jonah.resumeAt, `Jonah Weiss is ${jonah.replyType} with return date ${jonah.resumeAt}`)
    for (const name of ['Camille Duarte', 'Peter Halloran']) {
      check(person(v, name).status === 'in_sequence', `${name} is ${person(v, name).status}`)
    }
    const tobias = person(v, 'Tobias Nguyen')
    check(tobias.replyType === 'unclear', `Tobias Nguyen is ${tobias.replyType}`)
    for (const p of atCompany(v, 'colgate-palmolive').filter((p) => p !== tobias)) {
      check(p.status === 'in_sequence', `${p.contactName} at Colgate-Palmolive is ${p.status}`)
    }
    check(person(v, 'Neil Vasquez').status === 'unsubscribed', 'Neil Vasquez has not unsubscribed')
    const coke = atCompany(v, 'coca-cola')
    check(coke.length === 4, `Coca-Cola has ${coke.length} contacts, expected 4`)
    check(coke.every((p) => p.status === 'in_sequence' && !p.replyType), 'a Coca-Cola contact is not simply in sequence')
  })

  section('Warm accounts: every company paused by an interested reply', () => {
    const v = byId['warm-accounts']
    for (const companyId of ['kimberly-clark', 'emerson-electric']) {
      const people = atCompany(v, companyId)
      check(people.some((p) => p.replyType === 'interested' && p.status === 'stopped'), `${companyId} has no stopped interested reply`)
      check(people.filter((p) => !p.replyType).every((p) => p.status === 'paused_colleague'), `a colleague at ${companyId} is not paused`)
    }
  })

  section('Industrial accounts: sent, and no replies', () => {
    const v = byId['industrial-first-touch']
    check(v.stats.replies.total === 0, `${v.stats.replies.total} replies`)
    check(v.stats.emailsSent === v.stats.contacts, `${v.stats.emailsSent} emails for ${v.stats.contacts} contacts`)
  })

  section('generated replies match the counts in the data file, one per account', () => {
    for (const seed of data.SEED_CAMPAIGNS.filter((s) => s.replies || s.unsubscribes)) {
      const v = byId[seed.id]
      for (const [kind, n] of Object.entries(seed.replies ?? {})) {
        check(v.stats.replies[kind] === n, `${seed.id} has ${v.stats.replies[kind]} ${kind}, the data file says ${n}`)
      }
      check(v.stats.unsubscribed === (seed.unsubscribes ?? 0), `${seed.id} has ${v.stats.unsubscribed} unsubscribes`)
      const touched = v.activity.filter((a) => a.replyType || a.unsubscribedAt).map((a) => a.companyId)
      check(new Set(touched).size === touched.length, `${seed.id} has two replies at one account`)
    }
  })

  section('each suppression setting does what it says', () => {
    const contactOnly = byId['legacy-ecc-healthcare-outreach']
    check(contactOnly.activity.every((a) => a.status !== 'paused_colleague'), 'Stop for that contact only paused a colleague')
    check(contactOnly.activity.filter((a) => a.replyType === 'interested').every((a) => a.status === 'stopped'), 'an interested contact kept going under Stop for that contact only')
    const keep = byId['s4hana-2027-mid-market-outreach']
    check(keep.activity.every((a) => a.status !== 'paused_colleague'), 'Keep sending to everyone paused a colleague')
    check(keep.activity.filter((a) => a.replyType === 'interested').every((a) => a.status === 'in_sequence'), 'Keep sending to everyone stopped an interested contact')
    for (const v of views) {
      check(v.activity.filter((a) => a.replyType === 'ooo' || a.replyType === 'unclear').every((a) => a.status !== 'stopped'), `${v.id}: an out of office or unclear reply stopped someone`)
    }
  })

  section('an interested reply pauses only colleagues who still had steps to come', () => {
    for (const v of views) {
      for (const a of v.activity.filter((a) => a.status === 'paused_colleague')) {
        check(a.lastStepIndex === null || a.lastStepIndex < v.sequence.length - 1, `${v.id}: ${a.contactName} is paused after every step was sent`)
      }
    }
    check(byId['clean-core-chemicals-email'].activity.every((a) => a.status !== 'paused_colleague'), 'a single email paused someone')
  })

  section('Companies and Activity lists companies needing attention first', () => {
    const groups = activity.companyGroups(byId['priority-accounts'])
    const order = groups.map((g) => g.id).join(', ')
    check(order === 'cummins, colgate-palmolive, caterpillar, coca-cola, whirlpool', `order is ${order}`)
    const cummins = groups[0]
    check(cummins.suppression?.by.contactName === 'Helena Voss' && cummins.suppression.paused === 2, 'the Cummins banner does not name Helena Voss and 2 paused colleagues')
    check(cummins.topReply === 'interested', `Cummins shows ${cummins.topReply}`)
    check(groups.find((g) => g.id === 'caterpillar').topReply === null, 'Caterpillar shows a reply badge for an unsubscribe')
    check(activity.companyGroups(byId['warm-accounts']).every((g) => g.suppression), 'a Warm accounts company has no banner')
  })

  section('every seed reply is decided under its own campaign’s setting', () => {
    for (const c of store.getCampaigns()) {
      for (const p of c.contacts.filter((p) => p.reply)) {
        check(p.reply.rule === c.suppressionRule, `${c.id}: ${p.contactName}'s reply was decided under ${p.reply.rule}, the campaign says ${c.suppressionRule}`)
      }
      const paused = byId[c.id].activity.some((a) => a.status === 'paused_colleague')
      check(!paused || c.suppressionRule === 'stop_company', `${c.id} (${c.suppressionRule}) has paused colleagues`)
    }
  })

  section('every seed step has a subject and body of its own', () => {
    const steps = Object.values(data.SEED_SEQUENCES).flat()
    check(steps.every((s) => s.subject?.trim() && s.body?.trim()), 'a seed step has no subject or no body')
    check(new Set(steps.map((s) => s.subject)).size === steps.length, 'two seed steps share a subject line')
    check(new Set(steps.map((s) => s.body)).size === steps.length, 'two seed steps share a body')
  })

  section('step 1 of every seed campaign goes out at its start time', () => {
    for (const c of store.getCampaigns().filter((c) => c.start)) {
      check(c.start.time === c.sequence[0].time, `${c.id} starts at ${c.start.time} but step 1 goes at ${c.sequence[0].time}`)
    }
  })

  section('the metrics and the funnel rules in section 9', () => {
    const metrics = activity.campaignMetrics(views, now)
    const { contacted, replied } = activity.funnelCounts(views)
    const interested = data.SEED_CAMPAIGNS.reduce(
      (n, s) => n + (s.replies?.interested ?? 0) + (s.events ?? []).filter((e) => e.reply === 'interested').length,
      0,
    )
    check(metrics.interestedReplies === interested, `${metrics.interestedReplies} interested replies, the data file adds up to ${interested}`)
    check(metrics.replyRate === replied / contacted, 'the Reply rate card does not match the funnel counts')
    check(metrics.activeCampaigns === views.filter((v) => v.status === 'active').length, 'Active campaigns miscounted')

    const funnel = m.reports.REPORTS.find((r) => r.id === 'account-funnel').data.stages
    const stage = (label) => funnel.find((s) => s.label === label).value
    const ceiling =
      m.lists.SAVED_LISTS.reduce((n, l) => n + l.records, 0) +
      m.companies.companies.filter((c) => c.contacts.length > 0).length
    check(stage('Enriched') > ceiling, `Enriched (${stage('Enriched')}) is not above the most Contacted can reach (${ceiling})`)
    check(contacted <= ceiling, `Contacted (${contacted}) is above its own ceiling (${ceiling})`)
    check(stage('Meeting booked') < interested, `Meeting booked (${stage('Meeting booked')}) is not below interested replies (${interested})`)
    console.log(`      reply rate ${(100 * metrics.replyRate).toFixed(1)}%, contacted ${contacted}, replied ${replied}, interested ${interested}`)
  })
}

/* --- The changes the screens can make ------------------------------------- */

async function checkChanges() {
  clock = at('12:00')
  console.log('\nChanges made during a session (today, 12:00 PM)')
  const m = await load()
  const { store, activity, schedule, data } = m
  const view = (id) => activity.campaignView(store.getCampaigns().find((c) => c.id === id), clock)
  const people = m.listMembers.membersFromCompanies(['coca-cola'])
  const pickers = people.flatMap((a) =>
    a.contacts.map((c) => ({ id: c.id, name: c.name, title: c.title, companyId: a.id, companyName: a.name })),
  )
  const input = {
    name: 'Check campaign',
    listName: null,
    source: { accounts: 1, contacts: pickers.length, companyIds: ['coca-cola'] },
    inbox: data.CAMPAIGN_INBOXES[0],
    suppressionRule: 'stop_company',
    contacts: pickers,
  }

  section('a scheduled sequence goes to the top as Scheduled, everyone Not started', () => {
    const start = { date: schedule.tomorrowIso(), time: '09:00' }
    const c = store.addCampaign({ ...input, type: 'sequence', start, sequence: data.CAMPAIGN_SEQUENCE.map((s) => ({ ...s })) })
    check(store.getCampaigns()[0].id === c.id, 'it is not first in the store')
    const v = view(c.id)
    check(v.status === 'scheduled', `it is ${v.status}`)
    check(v.activity.every((a) => a.status === 'not_started'), 'someone has already started')
    check(v.stats.nextSendAt === schedule.joinAt(start.date, '09:00'), `next send is ${v.stats.nextSendAt}`)
  })

  section('a single email sent now is Completed straight away', () => {
    const now = schedule.nowParts()
    const c = store.addCampaign({ ...input, type: 'email', start: now, sequence: [{ type: 'email', day: 0, time: now.time, subject: 'Hi', body: 'Hello' }] })
    const v = view(c.id)
    check(v.status === 'completed', `it is ${v.status}`)
    check(v.stats.emailsSent === pickers.length, `${v.stats.emailsSent} sent to ${pickers.length} contacts`)
  })

  section('Duplicate makes a draft copy at the top with nothing sent', () => {
    const copy = store.duplicateCampaign('priority-accounts')
    check(store.getCampaigns()[0].id === copy.id, 'the copy is not first')
    const v = view(copy.id)
    check(v.status === 'draft', `the copy is ${v.status}`)
    check(v.name === 'Priority accounts (copy)', `the copy is called ${v.name}`)
    check(v.stats.replies.total === 0 && v.stats.emailsSent === 0, 'the copy has activity')
    check(v.activity.every((a) => a.status === 'not_started'), 'a contact in the copy has started')
  })

  section('a draft reopens Start a campaign on its own accounts, then launches in place', () => {
    const draft = store.getCampaigns().find((c) => c.id === 'ohio-food-beverage-draft')
    const scope = m.listActions.scopeForCampaign(draft)
    const memberIds = new Set(m.listMembers.scopeMembers(scope).flatMap((a) => a.contacts.map((c) => c.id)))
    check(draft.contacts.every((c) => memberIds.has(store.memberId(c))), 'a draft contact is missing from its scope')

    const count = store.getCampaigns().length
    const members = m.listMembers.scopeMembers(scope)
    store.launchDraft(draft.id, {
      ...input,
      name: draft.name,
      listName: draft.listName,
      source: draft.source,
      type: 'sequence',
      start: { date: schedule.tomorrowIso(), time: '09:00' },
      sequence: draft.sequence,
      contacts: members.flatMap((a) => a.contacts.map((c) => ({ id: c.id, name: c.name, title: c.title, companyId: a.id, companyName: a.name }))),
    })
    check(store.getCampaigns().length === count, 'launching made a second campaign')
    check(view(draft.id).status === 'scheduled', `the launched draft is ${view(draft.id).status}`)
  })

  section('Pause stops every send; Resume three days later puts none in the past', () => {
    store.pauseCampaign('priority-accounts')
    let v = view('priority-accounts')
    check(v.status === 'paused', `it is ${v.status}`)
    check(v.activity.every((a) => a.nextSendAt === null), 'a paused campaign still has a next send')

    clock += 3 * DAY
    store.resumeCampaign('priority-accounts')
    v = view('priority-accounts')
    check(v.status === 'active', `after resuming it is ${v.status}`)
    const times = new Set(v.sequence.map((s) => s.time))
    for (const a of v.activity.filter((a) => a.nextSendAt)) {
      check(schedule.atMs(a.nextSendAt) > clock, `${a.contactName}'s next send is in the past`)
      check(times.has(schedule.splitAt(a.nextSendAt).time), `${a.contactName}'s next send moved off its step time, to ${a.nextSendAt}`)
    }
    clock = at('12:00')
  })

  section('marking an unclear reply interested pauses colleagues from then on', () => {
    const before = view('priority-accounts')
    const tobias = person(before, 'Tobias Nguyen')
    const colleagues = atCompany(before, 'colgate-palmolive').filter((p) => p.id !== tobias.id)
    store.classifyReply('priority-accounts', tobias.id, 'interested')
    const after = view('priority-accounts')
    check(person(after, 'Tobias Nguyen').status === 'stopped', 'Tobias Nguyen was not stopped')
    for (const p of colleagues) {
      const now = after.activity.find((a) => a.id === p.id)
      check(now.status === 'paused_colleague', `${p.contactName} is ${now.status}`)
      check(now.lastStepIndex === p.lastStepIndex, `${p.contactName} lost a step they were already sent`)
    }
  })

  section('changing the setting never undoes a pause that already happened', () => {
    store.setSuppressionRule('warm-accounts', 'keep_sending')
    const v = view('warm-accounts')
    check(v.activity.filter((a) => !a.replyType).every((a) => a.status === 'paused_colleague'), 'a paused colleague was released by the new setting')
    // What lets the banner say the pause came from the earlier setting.
    const by = activity.companyGroups(v)[0].suppression.by
    check(by.replyRule === 'stop_company' && v.suppressionRule === 'keep_sending', 'the pausing reply does not keep the setting it was decided under')
  })

  section('Resume outreach puts colleagues back; the person who replied stays stopped', () => {
    store.resumeOutreach('priority-accounts', 'cummins')
    const v = view('priority-accounts')
    check(person(v, 'Helena Voss').status === 'stopped', 'Helena Voss was put back into the sequence')
    for (const name of ['Raymond Cho', 'Anita Brenner']) {
      const p = person(v, name)
      check(p.status === 'in_sequence', `${name} is ${p.status}`)
      check(p.nextSendAt && schedule.atMs(p.nextSendAt) > clock, `${name} has no next send in the future`)
    }
  })
}

/* --- Run ------------------------------------------------------------------ */

try {
  const times = ['00:01', '08:59', '09:00', '09:01', '10:00', '12:00', '17:30', '23:59']
  for (const t of times) await checkSeeds(`Seed campaigns, today at ${t}`, at(t))
  await checkChanges()
} finally {
  await server.close()
  globalThis.Date = RealDate
}

if (failures.length) {
  console.log(`\n${failures.length} checks failed:`)
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
console.log(`\nAll checks passed (${groups} groups).`)
