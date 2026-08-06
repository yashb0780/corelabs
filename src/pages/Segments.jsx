import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { segmentsWithCounts } from '../data/segments'

export default function Segments() {
  const segments = segmentsWithCounts()

  return (
    <PageShell
      breadcrumb={['Workspace', 'Segments']}
      title="Segments"
      subtitle="Saved groupings of companies that share a buying pattern."
    >
      <div className="grid gap-[var(--lp-card-gap)] sm:grid-cols-2">
        {segments.map((s) => (
          <Link
            key={s.id}
            to="/leads"
            className="lp-card transition-colors duration-150 ease-lp hover:border-accent hover:bg-accent-quiet"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-name text-txt">{s.label}</p>
              <span className="text-2xs font-num tabular-nums text-accent">
                {s.count}
              </span>
            </div>
            <p className="mt-[var(--lp-label-gap)] text-sm text-txt-2">
              {s.description}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
