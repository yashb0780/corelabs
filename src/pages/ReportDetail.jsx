/**
 * One report, full width, with its numbers in a table underneath.
 *
 * Reads the report from the dashboard in src/lib/reports.js, so a renamed,
 * duplicated or added report opens here too. A report that is not on the
 * dashboard, because it was removed or the page was reloaded after adding
 * it, gets a plain "not on the dashboard" message instead.
 */
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { ReportChart } from '../components/reports/ReportChart'
import { SampleChip, SourceChip } from '../components/reports/ReportCard'
import { ReportTable } from '../components/reports/ReportTable'
import { EmptyState } from '../components/ui'
import { Icon } from '../components/Icon'
import { REPORTS_COPY as COPY, REPORT_TYPES } from '../data/reports'
import { useReport } from '../lib/reports'

const DETAIL_CHART_HEIGHT = 340

export default function ReportDetail() {
  const { reportId } = useParams()
  const report = useReport(reportId)

  if (!report) {
    return (
      <PageShell
        breadcrumb={['Workspace', { label: COPY.title, to: '/reports' }, COPY.notFound.title]}
        title={COPY.title}
      >
        <EmptyState title={COPY.notFound.title}>
          {COPY.notFound.body}{' '}
          <Link to="/reports" className="text-accent hover:underline">
            {COPY.notFound.back}
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  const type = REPORT_TYPES[report.type]

  return (
    <PageShell
      breadcrumb={['Workspace', { label: COPY.title, to: '/reports' }, report.title]}
      title={report.title}
      subtitle={report.description}
    >
      <div className="lp-stack">
        <section className="lp-card">
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <SourceChip source={report.source} />
            <span className="inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-2xs text-txt-2">
              <Icon name={type.icon} className="size-3 text-txt-3" />
              {type.label}
            </span>
            {report.sample && <SampleChip />}
          </div>
          <ReportChart report={report} height={DETAIL_CHART_HEIGHT} />
        </section>

        <ReportTable report={report} />
      </div>
    </PageShell>
  )
}
