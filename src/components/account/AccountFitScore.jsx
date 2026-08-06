/**
 * ACCOUNT PAGE, main column, section 2: ICP FIT SCORE.
 * One file per section. To change this section, this is the only file to open.
 */
import { useState } from 'react'
import { getPhase } from '../../data/companies'
import { EMPTY_STATES } from '../../data/emptyStates'
import { computeWindow } from '../../lib/window'
import { Chip, EmptyNote, SectionCard, TonePill } from '../ui'

/** How many signal rows show before the toggle is needed. */
const VISIBLE = 3

export function AccountFitScore({ company, archetype }) {
  const [expanded, setExpanded] = useState(false)

  const phase = getPhase(company.phase)
  const window = computeWindow(company.phase, archetype)
  const signals = company.signalsFired ?? []
  const hidden = Math.max(0, signals.length - VISIBLE)
  const rows = expanded ? signals : signals.slice(0, VISIBLE)

  return (
    <SectionCard
      icon="target"
      label="ICP fit score"
      aside={
        <>
          <TonePill
            tone={phase.tone}
            dashed={phase.dashed}
            title={phase.description}
          >
            {phase.label}
          </TonePill>
          <TonePill
            tone={window.tone}
            dashed={window.dashed}
            title={window.description}
          >
            {window.label}
          </TonePill>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[35fr_65fr]">
        {/* Left: the score itself */}
        <div>
          <p className="flex items-baseline gap-1.5">
            <span className="text-score font-num tabular-nums text-accent">
              {company.icpFitScore}
            </span>
            <span className="text-sm text-txt-3">/ 100</span>
          </p>
          <p className="mt-2 text-2xs text-txt-3">
            Weighted from public job-posting, hiring and filing signals
          </p>
          {company.evidenceConfidence && (
            <Chip
              className="mt-2"
              title={company.evidenceConfidence.detail}
            >
              Evidence confidence: {company.evidenceConfidence.level}
            </Chip>
          )}
        </div>

        {/* Right: what fired */}
        <div>
          <p className="lp-label">Signals that fired</p>
          {signals.length === 0 ? (
            <div className="mt-[var(--lp-label-gap)]">
              <EmptyNote>{EMPTY_STATES.signals}</EmptyNote>
            </div>
          ) : (
            <>
              <ul className="mt-[var(--lp-label-gap)] divide-y divide-line">
                {rows.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-baseline justify-between gap-3 py-1.5 first:pt-0"
                  >
                    <span className="text-sm text-txt-2">{s.label}</span>
                    <span className="shrink-0 text-sm font-num tabular-nums text-accent">
                      +{s.points}
                    </span>
                  </li>
                ))}
              </ul>
              {hidden > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="mt-2 text-2xs font-name text-accent transition-colors duration-150 ease-lp hover:text-accent-hover"
                >
                  {expanded
                    ? 'Hide additional signals'
                    : `Show all signals (+${hidden} more)`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </SectionCard>
  )
}
