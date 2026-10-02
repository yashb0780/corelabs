/**
 * The panel that opens on the right of a chat thread when a company row is
 * clicked. It is not a new view of the company: it stacks the account
 * page's own sections, so it always says exactly what that page says.
 *
 * The expand icon opens the full account page; the cross, or Escape,
 * closes the panel.
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import REPLIES from '../../../content/chat/replies.json'
import { getCompany } from '../../data/companies'
import { Icon } from '../Icon'
import { AccountBrief } from '../account/AccountBrief'
import { AccountFitScore } from '../account/AccountFitScore'
import { AccountPhase } from '../account/AccountPhase'
import { RailJobPostings } from '../account/RailJobPostings'
import { RailKeyContacts } from '../account/RailKeyContacts'
import { CompanyLogo } from '../ui'

const ICON_BUTTON =
  'grid size-7 shrink-0 place-items-center rounded-md text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-hover hover:text-txt'

export function CompanyPanel({ companyId, archetype, onClose }) {
  const company = getCompany(companyId)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!company) return null

  return (
    <aside
      aria-label={company.name}
      className="flex h-full shrink-0 flex-col border-l border-line bg-canvas"
      style={{ width: 'min(var(--lp-chat-panel-w), 50%)' }}
    >
      <header className="flex h-12 shrink-0 items-center gap-2.5 border-b border-line px-4">
        <CompanyLogo company={company} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-name text-txt">{company.name}</p>
          <p className="truncate text-2xs text-txt-3">
            {company.industry} · {company.hq}
          </p>
        </div>
        <Link
          to={`/leads/${company.id}`}
          aria-label={REPLIES.panel.openFull}
          title={REPLIES.panel.openFull}
          className={ICON_BUTTON}
        >
          <Icon name="expand" className="size-3.5" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label={REPLIES.panel.close}
          title={REPLIES.panel.close}
          className={ICON_BUTTON}
        >
          <Icon name="close" className="size-4" />
        </button>
      </header>

      {/* Extra room at the bottom so the floating assistant button never
          covers the last card. */}
      <div className="lp-stack flex-1 overflow-y-auto px-4 pt-4 pb-24">
        <AccountBrief company={company} />
        <AccountFitScore company={company} archetype={archetype} />
        <AccountPhase company={company} />
        <RailKeyContacts company={company} />
        <RailJobPostings company={company} />
      </div>
    </aside>
  )
}
