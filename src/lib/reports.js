/* ==========================================================================
   THE REPORTS DASHBOARD THE USER IS LOOKING AT.

   Held at module scope, like the vendor profile, because clicking a card
   opens its detail page and every page renders its own PageShell: kept in
   the Reports page's state, a rename or an added report would be gone by
   the time you clicked into it and back.

   In memory only. Nothing is persisted, so a reload goes back to
   src/data/reports.js. That keeps the no-localStorage guardrail intact.

   The campaign numbers are not kept here. A report stores only a marker
   (`campaigns: 'contacted'` and so on, see src/data/reports.js), and
   useReports() fills it in from getCampaignSummary() in
   src/lib/campaigns.js every time it is read. So Reports shows exactly
   what the Campaigns screen shows, including campaigns changed during the
   session, and a renamed or duplicated report keeps reading them too.
   ========================================================================== */

import { useMemo, useSyncExternalStore } from 'react'
import { useCampaignSummary } from './campaigns'
import {
  REPORTS,
  REPORTS_COPY as COPY,
  REPORT_SOURCES,
  REPORT_TEMPLATES,
  REPORT_TYPES,
} from '../data/reports'

const listeners = new Set()
let reports = REPORTS
let nextId = 1

function set(next) {
  reports = next
  listeners.forEach((fn) => fn())
}

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

const getReports = () => reports

/**
 * A report with its campaign markers replaced by the numbers they stand
 * for, taken from `summary` (getCampaignSummary in src/lib/campaigns.js).
 * A report with no markers comes back unchanged. Pure, so the checks can
 * call it too.
 */
export function withCampaignFigures(report, summary) {
  const { data } = report
  if (data.campaigns) {
    const { campaigns, ...rest } = data
    return { ...report, data: { ...rest, bars: summary[campaigns] } }
  }
  if (data.stages?.some((st) => st.campaigns)) {
    return {
      ...report,
      data: {
        ...data,
        stages: data.stages.map((st) => (st.campaigns ? { label: st.label, value: summary[st.campaigns] } : st)),
      },
    }
  }
  return report
}

/** The dashboard, with every campaign number filled in. */
export function useReports() {
  const stored = useSyncExternalStore(subscribe, getReports, getReports)
  const summary = useCampaignSummary()
  return useMemo(() => stored.map((r) => withCampaignFigures(r, summary)), [stored, summary])
}

export function useReport(id) {
  return useReports().find((r) => r.id === id)
}

function uniqueId(base) {
  let id = `${base}-${nextId++}`
  while (reports.some((r) => r.id === id)) id = `${base}-${nextId++}`
  return id
}

export function renameReport(id, title) {
  set(reports.map((r) => (r.id === id ? { ...r, title } : r)))
}

/** Puts the copy straight after the original, and returns it. */
export function duplicateReport(id) {
  const i = reports.findIndex((r) => r.id === id)
  const original = reports[i]
  const copy = {
    ...original,
    id: uniqueId(original.id),
    title: `${original.title} ${COPY.copySuffix}`,
  }
  set([...reports.slice(0, i + 1), copy, ...reports.slice(i + 1)])
  return copy
}

export function removeReport(id) {
  set(reports.filter((r) => r.id !== id))
}

/**
 * A new card at the end of the dashboard, showing the sample numbers for
 * its chart type until the real report is built. Returns it.
 */
export function addReport(type, source) {
  const template = REPORT_TEMPLATES[type]
  const report = {
    ...template,
    id: uniqueId(`${type}-${source}`),
    title: COPY.newTitle(REPORT_TYPES[type].label, REPORT_SOURCES[source].label),
    description: REPORT_TYPES[type].hint,
    type,
    source,
    sample: true,
  }
  set([...reports, report])
  return report
}

/* --- The table under the chart on a report's detail page ----------------- */

/**
 * The same numbers the chart draws, as rows, so nothing is only readable
 * by hovering. Returns { columns, rows, total }, every cell already a
 * string. `format` turns a value into text.
 */
export function reportTable(report, format) {
  const t = COPY.table
  const pct = (n) => `${(n * 100).toFixed(1)}%`
  // The number column is headed with what the numbers are: "Accounts".
  const valueHeader = report.unit
    ? report.unit[0].toUpperCase() + report.unit.slice(1)
    : t.value

  if (report.type === 'funnel') {
    const { stages } = report.data
    const first = stages[0].value
    return {
      columns: [t.stage, valueHeader, t.ofFirst, t.stepConversion],
      rows: stages.map((s, i) => [
        s.label,
        format(s.value),
        pct(s.value / first),
        i === 0 ? '' : pct(s.value / stages[i - 1].value),
      ]),
    }
  }

  if (report.type === 'line') {
    const { periods, series } = report.data
    return {
      columns: [t.period, ...series.map((s) => s.label)],
      rows: periods.map((p, i) => [p, ...series.map((s) => format(s.values[i]))]),
    }
  }

  // Bar and pie: one row per group, with its share of the whole. A share
  // means nothing for rates, so percent reports leave it out.
  const items = report.type === 'pie' ? report.data.slices : report.data.bars
  const sum = items.reduce((acc, it) => acc + it.value, 0)
  const withShare = report.format !== 'percent'

  return {
    columns: [
      report.categoryLabel ?? t.category,
      valueHeader,
      ...(withShare ? [t.share] : []),
    ],
    rows: items.map((it) => [
      it.label,
      format(it.value),
      ...(withShare ? [pct(it.value / sum)] : []),
    ]),
    total: withShare ? [t.total, format(sum), '100.0%'] : null,
  }
}
