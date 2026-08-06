/**
 * SCREEN 2 - the account page for one company.
 *
 * Layout is two columns: a wide main column carrying sections 1 to 7, and a
 * sticky right rail carrying the three rail cards. On narrow viewports the
 * rail drops below the main column.
 *
 * This file only orders the sections. Each one lives in its own file in
 * src/components/account/ - open that file to change a section.
 */
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { AccountHeader } from '../components/account/AccountHeader'
import { AccountBrief } from '../components/account/AccountBrief'
import { AccountFitScore } from '../components/account/AccountFitScore'
import { AccountPhase } from '../components/account/AccountPhase'
import { AccountLandscape } from '../components/account/AccountLandscape'
import { AccountMomentum } from '../components/account/AccountMomentum'
import { AccountWhyNow } from '../components/account/AccountWhyNow'
import { AccountEcosystem } from '../components/account/AccountEcosystem'
import { RailCompanyFacts } from '../components/account/RailCompanyFacts'
import { RailKeyContacts } from '../components/account/RailKeyContacts'
import { RailJobPostings } from '../components/account/RailJobPostings'
import { EmptyState } from '../components/ui'
import { DEFAULT_ARCHETYPE, getCompany } from '../data/companies'

export default function AccountDetail() {
  const { companyId } = useParams()
  const company = getCompany(companyId)

  if (!company) {
    return (
      <PageShell breadcrumb={['Workspace', 'Leads']} title="Company not found">
        <EmptyState title="No company with that id">
          <Link to="/leads" className="text-accent hover:underline">
            Back to Company Search
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  const archetype = DEFAULT_ARCHETYPE

  return (
    <PageShell breadcrumb={['Workspace', 'Leads', company.name]}>
      <div className="lp-stack">
        <AccountHeader company={company} archetype={archetype} />

        <div className="grid items-start gap-[var(--lp-card-gap)] lg:grid-cols-[65fr_35fr]">
          {/* Main column: sections 1 to 7 */}
          <div className="lp-stack min-w-0">
            <AccountBrief company={company} />
            <AccountFitScore company={company} archetype={archetype} />
            <AccountPhase company={company} />
            <AccountLandscape company={company} />
            <AccountMomentum company={company} />
            <AccountWhyNow company={company} />
            <AccountEcosystem company={company} />
          </div>

          {/* Right rail: sticky on wide screens, drops below on narrow ones */}
          <div className="lp-stack min-w-0 lg:sticky lg:top-5">
            <RailCompanyFacts company={company} />
            <RailKeyContacts company={company} />
            <RailJobPostings company={company} />
          </div>
        </div>
      </div>
    </PageShell>
  )
}
