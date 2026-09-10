/**
 * One report on the dashboard: title, the chip naming the object it reads
 * from, a menu, and the chart.
 *
 * The whole card opens the report's detail page. The title is a real link
 * so the card can be reached with the keyboard; a click anywhere else on
 * the card does the same thing. The menu and the chart's hover handle their
 * own pointer events.
 */
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../Icon'
import { RowMenu } from '../overlay'
import { ReportChart } from './ReportChart'
import { REPORTS_COPY as COPY, REPORT_SOURCES } from '../../data/reports'

const CARD_CHART_HEIGHT = 210

/** The small chip naming the object a report reads from. */
export function SourceChip({ source }) {
  const s = REPORT_SOURCES[source]
  if (!s) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-line bg-surface-sunken px-1.5 py-0.5 text-2xs font-name text-txt-2">
      <Icon name={s.icon} className="size-3 text-txt-3" />
      {s.label}
    </span>
  )
}

export function SampleChip() {
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-line-strong px-1.5 py-0.5 text-2xs text-txt-3">
      {COPY.sample}
    </span>
  )
}

export function ReportCard({ report, onRename, onDuplicate, onRemove }) {
  const navigate = useNavigate()
  const to = `/reports/${report.id}`

  return (
    <article
      id={`report-${report.id}`}
      onClick={() => navigate(to)}
      className="lp-card flex cursor-pointer flex-col transition-colors duration-150 ease-lp hover:border-line-strong"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base text-txt">
            <Link
              to={to}
              onClick={(e) => e.stopPropagation()}
              className="hover:underline focus-visible:underline"
            >
              {report.title}
            </Link>
          </h2>
          <div className="mt-1.5 flex items-center gap-1.5">
            <SourceChip source={report.source} />
            {report.sample && <SampleChip />}
          </div>
        </div>
        <RowMenu
          label={COPY.cardMenu(report.title)}
          items={[
            { label: COPY.rename, icon: 'pencil', onSelect: () => onRename(report) },
            { label: COPY.duplicate, icon: 'copy', onSelect: () => onDuplicate(report) },
            { label: COPY.remove, icon: 'trash', onSelect: () => onRemove(report) },
          ]}
        />
      </header>

      <ReportChart report={report} height={CARD_CHART_HEIGHT} />
    </article>
  )
}
