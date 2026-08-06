/**
 * The leads table.
 *
 * Columns, in order:
 *   Company | Industry | Employees | ICP Fit Score | Decision Phase | Window | Contacts
 *
 * Clicking a row opens that company's account page.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  computeWindow,
  formatEmployees,
  getPhase,
} from '../../data/companies'
import { Icon } from '../Icon'
import { PhasePill, cx } from '../ui'

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
        className="grid size-8 shrink-0 place-items-center rounded-md text-xs font-semibold text-white"
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
      width="32"
      height="32"
      onError={() => setFailed(true)}
      className="size-8 shrink-0 rounded-md"
    />
  )
}

function CompanyCell({ company }) {
  return (
    <div className="flex items-center gap-2.5">
      <CompanyLogo company={company} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-txt">{company.name}</p>
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
        className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-surface-sunken"
      >
        <span
          className="block h-full rounded-full bg-accent"
          style={{ width: `${score}%` }}
        />
      </span>
      <span className="font-mono text-xs tabular-nums text-txt">{score}</span>
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
  const extra = contacts.length - shown.length

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {shown.map((c) => (
          <span
            key={c.name}
            title={`${c.name} · ${c.title}`}
            className="grid size-6 place-items-center rounded-full border border-surface bg-surface-sunken font-mono text-2xs text-txt-2"
          >
            {initials(c.name)}
          </span>
        ))}
      </div>
      <span className="font-mono text-2xs tabular-nums text-txt-3">
        {contacts.length}
        {extra > 0 ? '' : ''}
      </span>
    </div>
  )
}

/* --- Table -------------------------------------------------------------- */

const TH = 'px-3 py-2 text-left text-2xs font-medium text-txt-3 whitespace-nowrap'
const TD = 'px-3 py-2.5 align-middle'

export function LeadsTable({ companies, archetype }) {
  const navigate = useNavigate()
  // Highest fit score first. Click the header to flip it.
  const [descending, setDescending] = useState(true)

  const rows = [...companies].sort((a, b) =>
    descending ? b.fitScore - a.fitScore : a.fitScore - b.fitScore,
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
                className="inline-flex items-center gap-1 text-2xs font-medium text-txt-3 transition-colors duration-150 ease-lp hover:text-txt-2"
              >
                ICP Fit Score
                <Icon
                  name="arrowDown"
                  className={cx(
                    'size-3 transition-transform duration-150 ease-lp',
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
            const window = computeWindow(company, archetype)

            return (
              <tr
                key={company.id}
                onClick={() => navigate(`/leads/${company.id}`)}
                className="cursor-pointer border-b border-line bg-surface transition-colors duration-150 ease-lp last:border-b-0 hover:bg-surface-hover"
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
                    'text-right font-mono text-xs tabular-nums text-txt-2',
                  )}
                >
                  {formatEmployees(company.employees)}
                </td>
                <td className={TD}>
                  <FitScoreCell score={company.fitScore} />
                </td>
                <td className={TD}>
                  <PhasePill tone={phase.tone} title={phase.description}>
                    {phase.label}
                  </PhasePill>
                </td>
                <td className={TD}>
                  <p className="text-sm whitespace-nowrap text-txt">
                    {window.label}
                  </p>
                  <p className="text-2xs whitespace-nowrap text-txt-3">
                    {window.detail}
                  </p>
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
