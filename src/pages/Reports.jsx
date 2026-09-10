/**
 * REPORTS.
 *
 * A dashboard of report cards in two columns, modelled on Attio's Business
 * Metrics screen but in our own tokens. Each card opens its report's detail
 * page. Its menu can rename, duplicate or remove it, and "Add report" adds a
 * new one. "Refresh data" is dummy: the cards fade while it "loads", then a
 * toast confirms it.
 *
 * The dashboard lives in src/lib/reports.js rather than in this page, so
 * changes survive a trip into a report and back. Nothing is persisted.
 *
 * The pieces this page uses:
 *   src/components/reports/ReportCard.jsx         one card
 *   src/components/reports/ReportChart.jsx        picks the chart for a report
 *   src/components/reports/AddReportModal.jsx     the Add report modal
 *   src/components/reports/RenameReportModal.jsx  the Rename modal
 */
import { useEffect, useRef, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Toast } from '../components/overlay'
import { AddReportModal } from '../components/reports/AddReportModal'
import { ReportCard } from '../components/reports/ReportCard'
import { RenameReportModal } from '../components/reports/RenameReportModal'
import { Button, EmptyState } from '../components/ui'
import { cx } from '../components/cx'
import { REPORTS_COPY as COPY } from '../data/reports'
import {
  addReport,
  duplicateReport,
  removeReport,
  renameReport,
  useReports,
} from '../lib/reports'

// How long the dummy refresh "loads" for.
const REFRESH_MS = 900

export default function Reports() {
  const reports = useReports()
  const [adding, setAdding] = useState(false)
  const [renaming, setRenaming] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)
  const [revealId, setRevealId] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  // Bring a newly added or duplicated card into view. Done after render,
  // because until then the card is not on the page to scroll to.
  useEffect(() => {
    if (!revealId) return
    document
      .getElementById(`report-${revealId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setRevealId(null)
  }, [revealId, reports])

  const say = (message) => setToast({ id: Date.now(), message })
  const reveal = setRevealId

  const refresh = () => {
    setRefreshing(true)
    timerRef.current = window.setTimeout(() => {
      setRefreshing(false)
      say(COPY.toast.refreshed)
    }, REFRESH_MS)
  }

  return (
    <PageShell
      breadcrumb={['Workspace', 'Reports']}
      title={COPY.title}
      subtitle={COPY.subtitle}
      actions={
        <>
          <Button
            variant="secondary"
            icon="refresh"
            onClick={refresh}
            disabled={refreshing}
          >
            {refreshing ? COPY.refreshing : COPY.refresh}
          </Button>
          <Button variant="primary" icon="plus" onClick={() => setAdding(true)}>
            {COPY.add}
          </Button>
        </>
      }
    >
      {reports.length === 0 ? (
        <EmptyState title={COPY.empty.title}>{COPY.empty.body}</EmptyState>
      ) : (
        // While refreshing, the charts keep their shape and fade, rather
        // than blanking or jumping.
        <div
          aria-busy={refreshing}
          className={cx(
            'grid gap-[var(--lp-card-gap)] transition-opacity duration-200 lg:grid-cols-2',
            refreshing && 'opacity-50',
          )}
        >
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              onRename={setRenaming}
              onDuplicate={(report) => {
                const copy = duplicateReport(report.id)
                say(COPY.toast.duplicated(report.title))
                reveal(copy.id)
              }}
              onRemove={(report) => {
                removeReport(report.id)
                say(COPY.toast.removed(report.title))
              }}
            />
          ))}
        </div>
      )}

      {adding && (
        <AddReportModal
          onClose={() => setAdding(false)}
          onAdd={(type, source) => {
            const report = addReport(type, source)
            setAdding(false)
            say(COPY.toast.added(report.title))
            reveal(report.id)
          }}
        />
      )}

      {renaming && (
        <RenameReportModal
          report={renaming}
          onClose={() => setRenaming(null)}
          onRename={(title) => {
            renameReport(renaming.id, title)
            setRenaming(null)
            say(COPY.toast.renamed(title))
          }}
        />
      )}

      <Toast toast={toast} onDone={() => setToast(null)} />
    </PageShell>
  )
}
