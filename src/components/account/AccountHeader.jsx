/**
 * ACCOUNT PAGE - header section.
 * Logo tile, company name, "Industry · City, ST", segment pills, the two
 * actions, and the four-stat strip.
 *
 * One file per section. To change this section, this is the only file to open.
 */
import { formatEmployees, getPhase } from '../../data/companies'
import { getSegment } from '../../data/segments'
import { computeWindow } from '../../lib/window'
import { Button, TonePill } from '../ui'

function Fact({ label, children }) {
  return (
    <div>
      <p className="lp-label">{label}</p>
      <div className="mt-[var(--lp-label-gap)] text-sm text-txt">{children}</div>
    </div>
  )
}

export function AccountHeader({ company, archetype }) {
  const phase = getPhase(company.phase)
  const window = computeWindow(company.phase, archetype)

  return (
    <section className="lp-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <img
            src={company.logo}
            alt=""
            width="36"
            height="36"
            className="size-9 shrink-0 rounded-md"
          />
          <div className="min-w-0">
            <h2 className="text-xl text-txt">{company.name}</h2>
            <p className="mt-0.5 text-sm text-txt-2">
              {company.industry} · {company.city}, {company.state}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {company.segments.map((id) => {
                const segment = getSegment(id)
                return (
                  <span
                    key={id}
                    className="inline-flex items-center rounded-full border border-line px-2 py-0.5 text-2xs font-name text-txt-2"
                  >
                    {segment ? segment.label : id}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button>Add to sequence</Button>
          <Button variant="primary" icon="download">
            Export
          </Button>
        </div>
      </div>

      <div className="mt-3.5 grid gap-4 border-t border-line pt-3 sm:grid-cols-4">
        <Fact label="ICP Fit Score">
          <span className="text-lg font-num tabular-nums text-accent">
            {company.icpFitScore}
          </span>
        </Fact>
        <Fact label="Decision Phase">
          <TonePill
            tone={phase.tone}
            dashed={phase.dashed}
            title={phase.description}
          >
            {phase.label}
          </TonePill>
        </Fact>
        <Fact label="Window">
          <TonePill
            tone={window.tone}
            dashed={window.dashed}
            title={window.description}
          >
            {window.label}
          </TonePill>
        </Fact>
        <Fact label="Employees">
          <span className="text-lg font-num tabular-nums text-txt">
            {formatEmployees(company.employees)}
          </span>
        </Fact>
      </div>
    </section>
  )
}
