/* ==========================================================================
   RUNNING A SKILL.

   There is no model. Each seed skill has a script here that reads the dummy
   data and writes its answer as markdown, using the wording in
   content/skills/outputs.json. Because the answer is built from
   src/data/companies.js and the campaign store, the names and numbers
   always match the rest of the prototype, whichever account it runs on.

   The same script draws the Example output on a skill's page, run on the
   skill's `example` input, so the example can never drift from a real run.

   A skill written in the editor has no script. Its run says so and shows
   the output format it asks for.

   runSkill(skill, input) returns
     { steps: [text], markdown, companies: [company] }
   `companies` is what the run found, for the result card under it.
   ========================================================================== */

import LIBRARY from '../../content/skills/library.json'
import OUT from '../../content/skills/outputs.json'
import { CAMPAIGN_STATUSES } from '../data/campaigns'
import { companies, getCompany, getPhase } from '../data/companies'
import { getSegment, segments } from '../data/segments'
import { campaignView, companyGroups } from './campaignActivity'
import { getCampaigns } from './campaigns'
import { fill, listOf, plural } from './fill'
import { getSavedLists } from './savedLists'
import { computeWindow } from './window'
import { workspaceArchetype } from '../data/workspace'

/* --- Inputs ------------------------------------------------------------- */

const liveCampaigns = () => getCampaigns().filter((c) => !c.draft)

/** What a skill can be run on, for the dropdown beside its pill. */
export function inputOptions(type) {
  switch (type) {
    case 'account':
      return companies.map((c) => ({ value: c.id, label: c.name }))
    case 'list':
      return getSavedLists().map((l) => ({ value: l.id, label: l.name }))
    case 'segment':
      return segments.map((s) => ({ value: s.id, label: s.label }))
    case 'campaign':
      return liveCampaigns().map((c) => ({ value: c.id, label: campaignView(c).name }))
    default:
      return []
  }
}

/** The input a skill starts on: its example if that fits, else the first. */
export function defaultInput(skill) {
  const type = skill.inputs[0] ?? 'workspace'
  const options = inputOptions(type)
  const id = options.some((o) => o.value === skill.example) ? skill.example : options[0]?.value
  return type === 'workspace' ? { type } : { type, id: id ?? null }
}

/** "Cummins", "Priority accounts", "The whole workspace". */
export function inputLabel(input) {
  if (!input || input.type === 'workspace') return LIBRARY.inputs.workspace.label
  const hit = inputOptions(input.type).find((o) => o.value === input.id)
  return hit?.label ?? LIBRARY.inputs[input.type]?.label ?? ''
}

/* --- Small helpers ------------------------------------------------------ */

const lines = (...parts) => parts.flat().filter((p) => p !== null && p !== undefined && p !== '').join('\n')
const heading = (text) => `\n### ${text}`
const bullets = (items) => items.map((i) => `- ${i}`)
const has = (text, needle) => String(text ?? '').toLowerCase().includes(needle.toLowerCase())
const age = (days) => plural(OUT.age, days)

const topSignals = (c, n) =>
  [...(c.signalsFired ?? [])].sort((a, b) => b.points - a.points).slice(0, n)

const champion = (c) => c.contacts.find((p) => p.likelyChampion) ?? c.contacts[0] ?? null

/** Every sentence on an account's record, with where it came from. */
function recordLines(c) {
  const out = []
  const add = (where, text) => text && out.push({ where, text })
  add('verdict', c.landscape?.verdict)
  for (const e of c.landscape?.evidence ?? []) {
    add('evidence', e.observed)
    add('evidence', e.implies)
  }
  for (const s of c.signalsFired ?? []) add('signals', s.label)
  add('phase', c.phaseNote)
  add('whyNow', c.whyNow?.title)
  add('whyNow', c.whyNow?.body)
  add('brief', c.brief?.fitNote)
  return out
}

/* --- One script per seed skill ------------------------------------------ */

function eccHoldoutFinder() {
  const T = OUT['ecc-holdout-finder']
  const holdouts = []
  const dropped = []
  const notJudged = []

  for (const c of companies) {
    const stack = c.landscape?.stack ?? []
    if (!stack.length) {
      notJudged.push(c)
      continue
    }
    if (!stack.some((s) => has(s.name, 'SAP ECC'))) continue

    const where = []
    if (stack.some((s) => has(s.name, 'S/4HANA'))) where.push('stack')
    if ((c.signalsFired ?? []).some((s) => has(s.label, 'S/4HANA'))) where.push('signals')
    if ((c.jobPostings ?? []).some((j) => has(`${j.title} ${j.snippet} ${(j.keywords ?? []).join(' ')}`, 'S/4HANA')))
      where.push('postings')
    if ((c.momentum ?? []).some((m) => has(m.term, 'S/4HANA') && m.counts.at(-1) >= T.momentumFloor))
      where.push('momentum')

    if (where.length) dropped.push({ c, where })
    else holdouts.push(c)
  }
  holdouts.sort((a, b) => b.icpFitScore - a.icpFitScore)

  return {
    steps: [plural(OUT.steps.searched, companies.length)],
    markdown: lines(
      plural(T.lead, holdouts.length, { total: companies.length }),
      dropped.length && heading(T.droppedHeading),
      bullets(
        dropped.map(({ c, where }) =>
          fill(T.dropped, { company: c.name, where: listOf(where.map((w) => T.where[w]), T.whereJoin) }),
        ),
      ),
      notJudged.length && `\n${plural(OUT.notJudged, notJudged.length, { names: listOf(notJudged.map((c) => c.name)) })}`,
    ),
    companies: holdouts,
  }
}

function preRfpDetector() {
  const T = OUT['pre-rfp-detector']
  const hits = []
  for (const c of companies) {
    const places = [
      ...(c.landscape?.stack ?? []).map((s) => ({ where: 'the stack', text: s.name })),
      ...(c.jobPostings ?? []).map((j) => ({ where: 'a job posting', text: `${j.title} ${j.snippet}` })),
      ...recordLines(c).map((l) => ({ where: 'the record', text: l.text })),
    ]
    for (const tool of T.tools) {
      const place = places.find((p) => has(p.text, tool))
      if (place) hits.push({ c, tool, where: place.where })
    }
  }

  if (hits.length) {
    return {
      steps: [plural(OUT.steps.searched, companies.length)],
      markdown: lines(
        plural(T.hitsLead, new Set(hits.map((h) => h.c.id)).size),
        bullets(hits.map((h) => fill(T.hit, { company: h.c.name, tool: h.tool, where: h.where }))),
      ),
      companies: [...new Set(hits.map((h) => h.c))],
    }
  }

  const nearest = companies
    .filter((c) => c.phase === 'evaluating')
    .sort((a, b) => b.icpFitScore - a.icpFitScore)
  return {
    steps: [plural(OUT.steps.searched, companies.length)],
    markdown: lines(
      fill(T.none, { total: companies.length }),
      heading(T.nearestHeading),
      nearest.length
        ? bullets(nearest.map((c) => fill(T.nearest, { company: c.name, whyNow: c.whyNow?.title ?? '' })))
        : T.noNearest,
    ),
    companies: nearest,
  }
}

function jobPostDecoder(c) {
  const T = OUT['job-post-decoder']
  const postings = c.jobPostings ?? []
  const phase = getPhase(postings.length ? c.phase : 'unclassified')

  return {
    steps: [plural(OUT.steps.postings, postings.length)],
    markdown: postings.length
      ? lines(
          heading(T.postingsHeading).trim(),
          postings.flatMap((j) => [
            `- ${fill(T.posting, { title: j.title, team: j.team, age: age(j.ageDays), snippet: j.snippet })}`,
            j.keywords?.length
              ? `  - ${fill(T.keyPhrases, { phrases: j.keywords.map((k) => `\`${k}\``).join(', ') })}`
              : null,
          ]),
          heading(T.phaseHeading),
          fill(T.phase, { phase: phase.label, description: phase.description }),
          c.phaseNote,
        )
      : fill(T.none, { company: c.name }),
    companies: [c],
  }
}

function accountBrief(c) {
  const T = OUT['account-brief']
  const erp = (c.landscape?.stack ?? []).filter((s) => s.layer === 'ERP core')
  const signals = topSignals(c, 3)
  const phase = getPhase(c.phase)

  return {
    steps: [plural(OUT.steps.signals, c.signalsFired?.length ?? 0)],
    markdown: lines(
      fill(T.header, { company: c.name, industry: c.industry, hq: c.hq, score: c.icpFitScore }),
      heading(T.footprintHeading),
      erp.length ? bullets(erp.map((s) => s.name)) : T.noStack,
      c.landscape?.verdict && `\n${c.landscape.verdict}`,
      heading(T.signalsHeading),
      signals.length ? bullets(signals.map((s) => fill(T.signal, s))) : T.noSignals,
      heading(T.phaseHeading),
      fill(T.phase, { phase: phase.label, note: c.phaseNote ?? T.noPhaseNote }),
      heading(T.contactsHeading),
      c.contacts.length
        ? bullets(
            c.contacts.map(
              (p) => fill(T.contact, p) + (p.likelyChampion ? T.champion : ''),
            ),
          )
        : T.noContacts,
    ),
    companies: [c],
  }
}

function riseRiskCheck(c) {
  const T = OUT['rise-risk-check']
  // RISE in capitals, as a word, so "rise" in ordinary prose never counts.
  const mentions = recordLines(c)
    .flatMap((l) => l.text.split(/(?<=[.!?])\s+/))
    .filter((sentence) => /\bRISE\b/.test(sentence))
  const flagged = mentions.filter(
    (sentence) => !T.negations.some((n) => sentence.toLowerCase().includes(n)),
  )
  const verdict = flagged.length ? T.flagged : mentions.length ? T.absent : T.notJudged

  return {
    steps: [plural(OUT.steps.signals, c.signalsFired?.length ?? 0)],
    markdown: lines(
      fill(verdict, { company: c.name }),
      mentions.length && heading(T.quotesHeading),
      bullets(mentions.map((m) => `"${m}"`)),
    ),
    companies: [c],
  }
}

function buyingCommitteeMap(c) {
  const T = OUT['buying-committee-map']
  if (!c.contacts.length) {
    return {
      steps: [plural(OUT.steps.contacts, 0)],
      markdown: lines(
        fill(T.noContacts, { company: c.name }),
        bullets(T.seats.map((s) => fill(T.empty, { role: s.role }))),
      ),
      companies: [c],
    }
  }

  const used = new Set()
  const pick = (words) =>
    c.contacts.find((p) => !used.has(p.name) && words.some((w) => has(p.title, w)))

  const seats = T.seats.map((seat) => {
    let person = pick(seat.match)
    let standIn = false
    if (!person && seat.standIn) {
      person = pick(seat.standIn)
      standIn = Boolean(person)
    }
    if (person) used.add(person.name)
    return { seat, person, standIn }
  })
  const others = c.contacts.filter((p) => !used.has(p.name))

  return {
    steps: [plural(OUT.steps.contacts, c.contacts.length)],
    markdown: lines(
      bullets(
        seats.map(({ seat, person, standIn }) =>
          person
            ? fill(T.filled, { role: seat.role, name: person.name, title: person.title }) +
              (standIn ? T.standIn : '') +
              (person.likelyChampion ? T.champion : '')
            : fill(T.empty, { role: seat.role }),
        ),
      ),
      others.length && heading(T.othersHeading),
      bullets(others.map((p) => fill(T.other, p))),
    ),
    companies: [c],
  }
}

function partnerOfRecordCheck(c) {
  const T = OUT['partner-of-record-check']
  const open = []
  const engaged = []
  for (const { text } of recordLines(c)) {
    if (T.openPhrases.some((p) => has(text, p))) open.push(text)
    else if (T.engagedPhrases.some((p) => has(text, p))) engaged.push(text)
  }
  const [verdict, opening, quotes] = engaged.length && !open.length
    ? [T.engaged, T.engagedOpening, engaged]
    : open.length
      ? [T.open, T.openOpening, open]
      : [T.unknown, null, []]

  return {
    steps: [plural(OUT.steps.signals, c.signalsFired?.length ?? 0)],
    markdown: lines(
      fill(verdict, { company: c.name }),
      opening,
      quotes.length && heading(T.evidenceHeading),
      bullets([...new Set(quotes)].slice(0, 3).map((q) => fill(T.quote, { text: q }))),
    ),
    companies: [c],
  }
}

function signalBasedFirstTouch(c) {
  const T = OUT['signal-based-first-touch']
  const [signal] = topSignals(c, 1)
  if (!signal) {
    return { steps: [plural(OUT.steps.signals, 0)], markdown: fill(T.noSignals, { company: c.name }), companies: [c] }
  }

  const to = champion(c)
  const phase = getPhase(c.phase)
  const body = [
    to ? fill(T.greeting, { first: to.name.split(' ')[0] }) : T.greetingNobody,
    fill(T.opener, { company: c.name, signal: signal.label }),
    fill(T.decision, { phase: phase.label, decision: T.decisions[c.phase] ?? T.decisions.unclassified }),
    T.ask,
    T.signOff,
  ]
  const words = body.join(' ').split(/\s+/).filter(Boolean).length

  return {
    steps: [plural(OUT.steps.signals, c.signalsFired.length)],
    markdown: lines(
      to ? fill(T.to, to) : T.toNobody,
      fill(T.subject, { company: c.name }),
      '',
      // A quote block, so the email reads as one piece with its line breaks.
      body.flatMap((line, i) => (i < body.length - 1 ? [`> ${line}`, '>'] : [`> ${line}`])),
      '',
      fill(words <= 80 ? T.words : T.over, { n: words }),
    ),
    companies: [c],
  }
}

function meetingPrep(c) {
  const T = OUT['meeting-prep']
  const phase = getPhase(c.phase)
  const window = computeWindow(c.phase, workspaceArchetype())
  const people = [...c.contacts].sort((a, b) => Number(b.likelyChampion) - Number(a.likelyChampion))

  return {
    steps: [plural(OUT.steps.signals, c.signalsFired?.length ?? 0), plural(OUT.steps.contacts, c.contacts.length)],
    markdown: lines(
      heading(T.whoHeading).trim(),
      people.length
        ? bullets(people.map((p) => fill(T.contact, p) + (p.likelyChampion ? T.champion : '')))
        : T.noContacts,
      heading(T.changedHeading),
      topSignals(c, 3).length ? bullets(topSignals(c, 3).map((s) => s.label)) : T.noSignals,
      heading(T.whyNowHeading),
      c.whyNow ? fill(T.whyNow, c.whyNow) : T.noWhyNow,
      heading(T.windowHeading),
      fill(T.window, { phase: phase.label, window: window.label, description: window.description }),
      heading(T.questionsHeading),
      (T.questions[c.phase] ?? T.questions.unclassified).map((q, i) => `${i + 1}. ${q}`),
      heading(T.watchHeading),
      c.evidenceConfidence ? fill(T.confidence, c.evidenceConfidence) : T.noConfidence,
    ),
    companies: [c],
  }
}

function weeklySignalDigest() {
  const T = OUT['weekly-signal-digest']
  const fresh = companies
    .flatMap((c) => (c.jobPostings ?? []).map((j) => ({ c, j })))
    .filter(({ j }) => j.ageDays <= T.maxAge)
    .sort((a, b) => a.j.ageDays - b.j.ageDays)
  const accounts = [...new Set(fresh.map(({ c }) => c))]
  const act = companies
    .filter((c) => c.phase === 'mobilizing')
    .sort((a, b) => b.icpFitScore - a.icpFitScore)

  return {
    steps: [plural(OUT.steps.searched, companies.length)],
    markdown: lines(
      plural(T.lead, fresh.length, { accounts: accounts.length }),
      fresh.length && heading(T.postingsHeading),
      bullets(fresh.map(({ c, j }) => fill(T.posting, { company: c.name, title: j.title, team: j.team, age: age(j.ageDays) }))),
      heading(T.actHeading),
      act.length
        ? bullets(act.map((c) => fill(T.act, { company: c.name, score: c.icpFitScore, whyNow: c.whyNow?.title ?? '' })))
        : T.noAct,
    ),
    companies: [...new Set([...act, ...accounts])],
  }
}

function campaignReview(campaign) {
  const T = OUT['campaign-review']
  const v = campaignView(campaign)
  const s = v.stats
  const rate = s.accountsContacted ? `${Math.round((1000 * s.accountsReplied) / s.accountsContacted) / 10}%` : null
  const replied = v.activity
    .filter((a) => a.replyType)
    .sort((a, b) => Object.keys(T.next).indexOf(a.replyType) - Object.keys(T.next).indexOf(b.replyType))
  const reached = companyGroups(v).map((g) => getCompany(g.id)).filter(Boolean)

  return {
    steps: [plural(OUT.steps.replies, s.replies.total)],
    markdown: lines(
      fill(T.lead, {
        campaign: v.name,
        status: CAMPAIGN_STATUSES[v.status]?.label ?? v.status,
        accounts: s.accounts,
        contacts: s.contacts,
      }),
      rate
        ? fill(T.numbers, { contacted: s.accountsContacted, replied: s.accountsReplied, rate })
        : T.nothingSent,
      heading(T.repliesHeading),
      bullets(Object.entries(T.replyTypes).map(([type, line]) => fill(line, { n: s.replies[type] ?? 0 }))),
      heading(T.nextHeading),
      replied.length
        ? bullets(replied.map((a) => fill(T.next[a.replyType], { contact: a.contactName, company: a.companyName })))
        : T.noReplies,
    ),
    companies: reached,
  }
}

/* --- Running ------------------------------------------------------------ */

/** Seed skill id -> its script, and what kind of input the script reads. */
const SCRIPTS = {
  'ecc-holdout-finder': { input: 'workspace', run: eccHoldoutFinder },
  'pre-rfp-detector': { input: 'workspace', run: preRfpDetector },
  'job-post-decoder': { input: 'account', run: jobPostDecoder },
  'account-brief': { input: 'account', run: accountBrief },
  'rise-risk-check': { input: 'account', run: riseRiskCheck },
  'buying-committee-map': { input: 'account', run: buyingCommitteeMap },
  'partner-of-record-check': { input: 'account', run: partnerOfRecordCheck },
  'signal-based-first-touch': { input: 'account', run: signalBasedFirstTouch },
  'meeting-prep': { input: 'account', run: meetingPrep },
  'weekly-signal-digest': { input: 'workspace', run: weeklySignalDigest },
  'campaign-review': { input: 'campaign', run: campaignReview },
}

function resolve(type, id) {
  if (type === 'account') return getCompany(id)
  if (type === 'campaign') return liveCampaigns().find((c) => c.id === id) ?? null
  if (type === 'list') return getSavedLists().find((l) => l.id === id) ?? null
  if (type === 'segment') return getSegment(id) ?? null
  return {}
}

export function runSkill(skill, input) {
  const label = inputLabel(input)
  const steps = [fill(OUT.steps.ran, { skill: skill.name }), fill(OUT.steps.read, { input: label })]
  const script = skill.seeded ? SCRIPTS[skill.id] : null
  const target = script && input?.type === script.input ? resolve(input.type, input.id) : null

  if (script && target) {
    const result = script.run(target)
    // The result card under a run says "ranked by ICP fit", so make it so
    // whatever order a script found them in.
    const ranked = [...result.companies].sort((a, b) => b.icpFitScore - a.icpFitScore)
    return { ...result, companies: ranked, steps: [...steps, ...result.steps] }
  }

  // A skill written in the editor, or a seed run on something its script
  // cannot read: say so, and show the format it asks for.
  return {
    steps,
    markdown: skill.outputFormat
      ? `${fill(OUT.generic, { skill: skill.name, input: label })}\n\n${skill.outputFormat}`
      : fill(OUT.genericNoFormat, { skill: skill.name, input: label }),
    companies: input?.type === 'account' && getCompany(input.id) ? [getCompany(input.id)] : [],
  }
}
