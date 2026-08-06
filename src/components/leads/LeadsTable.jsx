/**
 * The leads table.
 *
 * Columns, in order:
 *   Company | Industry | Employees | ICP Fit Score | Decision Phase | Window | Contacts
 *
 * Clicking a row opens that company's account page.
 *
 * Row padding comes from --lp-row-pad-x / --lp-row-pad-y in
 * src/styles/tokens.css. Change the density there, not here.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatEmployees, getPhase } from '../../data/companies'
import { computeWindow } from '../../lib/window'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { TonePill } from '../ui'

/* --- Company cell ------------------------------------------------------- */

/**
 * Shows the company's SVG logo. If the file is missing or fails to load,
 * falls back to the colored monogram tile.
 */
function CompanyLogo({ company }) {
  const [failed, setFailed] = useState(false)

  if (!company.logo || failed) {
    return (
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-md text-xs font-num text-white"
        style={{ backgroundColor: company.monogramColor }}
      >
        {company.monogram}
      </span>
    )
  }

  return (
    <img
      src={company.logo}
      alt=""
      width="28"
      height="28"
      onError={() => setFailed(true)}
      className="size-7 shrink-0 rounded-md"
    />
  )
}

function CompanyCell({ company }) {
  return (
    <div className="flex items-center gap-2.5">
      <CompanyLogo company={company} />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-name text-txt">{company.name}</p>
        <p className="truncate text-2xs text-txt-3">
          {company.city}, {company.state}
        </p>
      </div>
    </div>
  )
}

/* --- ICP Fit Score cell ------------------------------------------------- */

function FitScoreCell({ score }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-surface-sunken"
      >
        <span
          className="block h-full rounded-full bg-accent"
          style={{ width: `${score}%` }}
        />
      </span>
      <span className="text-sm font-num tabular-nums text-accent">{score}</span>
    </div>
  )
}

/* --- Contacts cell ------------------------------------------------------ */

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function ContactsCell({ contacts }) {
  const shown = contacts.slice(0, 3)

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {shown.map((c) => (
          <span
            key={c.name}
            title={`${c.name} · ${c.title}`}
            className="grid size-5.5 place-items-center rounded-full border border-surface bg-surface-sunken text-2xs font-name text-txt-2"
          >
            {initials(c.name)}
          </span>
        ))}
      </div>
      <span className="text-2xs font-num tabular-nums text-txt-3">
        {contacts.length}
      </span>
    </div>
  )
}

/* --- Table -------------------------------------------------------------- */

/* Padding is driven by the density tokens so it can be tuned in one place. */
const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]'
const TH = `lp-label ${CELL_PAD} text-left whitespace-nowrap`
const TD = `${CELL_PAD} align-middle`

export function LeadsTable({ companies, archetype }) {
  const navigate = useNavigate()
  // Highest fit score first. Click the header to flip it.
  const [descending, setDescending] = useState(true)

  const rows = [...companies].sort((a, b) =>
    descending
      ? b.icpFitScore - a.icpFitScore
      : a.icpFitScore - b.icpFitScore,
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[980px] border-collapse">
        <thead className="bg-surface-sunken">
          <tr className="border-b border-line">
            <th scope="col" className={TH}>Company</th>
            <th scope="col" className={TH}>Industry</th>
            <th scope="col" className={cx(TH, 'text-right')}>Employees</th>
            <th scope="col" className={TH}>
              <button
                type="button"
                onClick={() => setDescending((d) => !d)}
                aria-label={`Sort by ICP Fit Score, currently ${descending ? 'highest' : 'lowest'} first`}
                className="lp-label inline-flex items-center gap-1 transition-colors duration-150 ease-lp hover:text-accent"
              >
                ICP Fit Score
                <Icon
                  name="arrowDown"
                  className={cx(
                    'size-3 text-accent transition-transform duration-150 ease-lp',
                    descending ? '' : 'rotate-180',
                  )}
                />
              </button>
            </th>
            <th scope="col" className={TH}>Decision Phase</th>
            <th scope="col" className={TH}>Window</th>
            <th scope="col" className={TH}>Contacts</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((company) => {
            const phase = getPhase(company.phase)
            const window = computeWindow(company.phase, archetype)

            return (
              <tr
                key={company.id}
                onClick={() => navigate(`/leads/${company.id}`)}
                className="cursor-pointer border-b border-line bg-surface transition-colors duration-150 ease-lp last:border-b-0 hover:bg-accent-quiet"
              >
                <td className={cx(TD, 'w-[26%]')}>
                  <CompanyCell company={company} />
                </td>
                <td className={cx(TD, 'text-sm text-txt-2 whitespace-nowrap')}>
                  {company.industry}
                </td>
                <td
                  className={cx(
                    TD,
                    'text-right text-sm font-num tabular-nums text-txt',
                  )}
                >
                  {formatEmployees(company.employees)}
                </td>
                <td className={TD}>
                  <FitScoreCell score={company.icpFitScore} />
                </td>
                <td className={TD}>
                  <TonePill
                    tone={phase.tone}
                    dashed={phase.dashed}
                    title={phase.description}
                  >
                    {phase.label}
                  </TonePill>
                </td>
                <td className={TD}>
                  <TonePill
                    tone={window.tone}
                    dashed={window.dashed}
                    title={window.description}
                  >
                    {window.label}
                  </TonePill>
                </td>
                <td className={TD}>
                  <ContactsCell contacts={company.contacts} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
