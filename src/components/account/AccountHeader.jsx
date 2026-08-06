/**
 * ACCOUNT PAGE - header section.
 * Logo, name, location, industry, segment tags, and the four headline facts.
 *
 * One file per section of the account page. To change this section, this is
 * the only file you open.
 */
import { computeWindow, formatEmployees, getPhase } from '../../data/companies'
import { getSegment } from '../../data/segments'
import { TonePill } from '../ui'

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
  const window = computeWindow(company, archetype)

  return (
    <section className="lp-card">
      <div className="flex items-start gap-3">
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

      <div className="mt-3.5 grid gap-4 border-t border-line pt-3 sm:grid-cols-4">
        <Fact label="ICP Fit Score">
          <span className="text-lg font-num tabular-nums text-accent">
            {company.fitScore}
          </span>
        </Fact>
        <Fact label="Decision Phase">
          <TonePill tone={phase.tone} title={phase.description}>
            {phase.label}
          </TonePill>
        </Fact>
        <Fact label="Window">
          <TonePill tone={window.tone} title={window.description}>
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
