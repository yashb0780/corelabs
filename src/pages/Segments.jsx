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
      <div className="grid gap-3 sm:grid-cols-2">
        {segments.map((s) => (
          <Link
            key={s.id}
            to="/leads"
            className="rounded-lg border border-line bg-surface p-4 transition-colors duration-150 ease-lp hover:border-line-strong hover:bg-surface-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-txt">{s.label}</p>
              <span className="font-mono text-2xs tabular-nums text-txt-3">
                {s.count}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-txt-2">{s.description}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
