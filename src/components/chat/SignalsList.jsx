/**
 * "Today's signals" on the New chat page: a quiet list, modelled on the
 * meetings list on Attio's home. One row per signal, company on the left,
 * time on the right. Clicking a row opens that account.
 *
 * The rows come from content/chat/home.json; the company's name and logo
 * come from src/data/companies.js by id.
 */
import { Link } from 'react-router-dom'
import HOME from '../../../content/chat/home.json'
import { getCompany } from '../../data/companies'
import { CompanyLogo } from '../ui'

export function SignalsList() {
  const rows = HOME.signals
    .map((s) => ({ ...s, company: getCompany(s.companyId) }))
    .filter((s) => s.company)

  if (!rows.length) return null

  return (
    <section>
      <p className="lp-label px-1 pb-2">{HOME.signalsLabel}</p>
      <ul className="divide-y divide-line border-y border-line">
        {rows.map((s) => (
          <li key={`${s.companyId}-${s.time}`}>
            <Link
              to={`/leads/${s.company.id}`}
              className="flex items-center gap-3 px-1 py-2.5 transition-colors duration-150 ease-lp hover:bg-surface-hover"
            >
              <CompanyLogo company={s.company} />
              <span className="w-36 shrink-0 truncate text-sm font-name text-txt">
                {s.company.name}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-txt-2">{s.text}</span>
              <span className="shrink-0 text-2xs tabular-nums text-txt-3">{s.time}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
