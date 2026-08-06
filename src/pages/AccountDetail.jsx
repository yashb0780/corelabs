/**
 * SCREEN 2 - the account page for one company.
 *
 * NOTE: the brief for this screen was cut off, so only the two sections that
 * could be built from the leads data exist so far. Each section is its own
 * file in src/components/account/ - add the remaining sections there as one
 * file each, then list them below.
 */
import { useParams, Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { AccountHeader } from '../components/account/AccountHeader'
import { AccountContacts } from '../components/account/AccountContacts'
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

  return (
    <PageShell breadcrumb={['Workspace', 'Leads', company.name]}>
      <div className="space-y-4">
        <AccountHeader company={company} archetype={DEFAULT_ARCHETYPE} />
        <AccountContacts company={company} />
        <EmptyState title="More sections to come">
          The rest of the account page brief has not been written yet. Add each
          new section as its own file in src/components/account/.
        </EmptyState>
      </div>
    </PageShell>
  )
}
