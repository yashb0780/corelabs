/**
 * The companies an agent reply found: a count, then one compact row per
 * company with its logo, ICP fit score, Decision Phase and Window.
 *
 * The company and score cells are the Company Search table's own, so the
 * two never drift apart. Window follows the workspace's seller type, set
 * at onboarding in src/data/workspace.js.
 *
 * Clicking a row opens that company in the panel on the right.
 */
import REPLIES from '../../../content/chat/replies.json'
import { getPhase } from '../../data/companies'
import { plural } from '../../lib/fill'
import { computeWindow } from '../../lib/window'
import { cx } from '../cx'
import { CompanyCell, FitScoreCell } from '../leads/LeadsTable'
import { TonePill } from '../ui'

function Row({ company, archetype, open, onOpen }) {
  const phase = getPhase(company.phase)
  const window = computeWindow(company.phase, archetype)

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(company.id)}
        aria-pressed={open}
        className={cx(
          'flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-[var(--lp-row-pad-x)] py-[var(--lp-compact-row-pad-y)] text-left transition-colors duration-150 ease-lp',
          open ? 'bg-accent-quiet' : 'hover:bg-surface-hover',
        )}
      >
        {/* A floor under the name, so a narrow column (the panel open)
            wraps the pills onto a second line rather than crushing it. */}
        <div className="min-w-44 flex-1">
          <CompanyCell company={company} />
        </div>
        <FitScoreCell score={company.icpFitScore} />
        {/* Fixed widths, wide enough for the longest label, so the scores
            and pills line up down the card whatever each row says. */}
        <span className="flex items-center gap-1.5">
          <span className="w-32">
            <TonePill tone={phase.tone} dashed={phase.dashed} title={phase.description}>
              {phase.label}
            </TonePill>
          </span>
          <span className="w-26">
            <TonePill tone={window.tone} dashed={window.dashed} title={window.description}>
              {window.label}
            </TonePill>
          </span>
        </span>
      </button>
    </li>
  )
}

export function ResultCard({ companies, archetype, openId, onOpen }) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-surface-sunken px-[var(--lp-row-pad-x)] py-2">
        <p className="text-sm font-label text-txt">
          {plural(REPLIES.results.found, companies.length)}
        </p>
        {companies.length > 1 && <p className="lp-label">{REPLIES.results.ranked}</p>}
      </header>
      {companies.length > 0 && (
        <ul className="divide-y divide-line">
          {companies.map((c) => (
            <Row
              key={c.id}
              company={c}
              archetype={archetype}
              open={c.id === openId}
              onOpen={onOpen}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
