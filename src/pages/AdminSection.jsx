/**
 * The five Admin nav items (Vendor, Customer, Tenant, Workspace, Settings)
 * all land here. They were in the sidebar list but had no screens of their
 * own in the brief, so one file covers all five rather than five near-empty
 * files. Split it up when the real screens are specified.
 */
import { useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'

const TITLES = {
  vendor: 'Vendor',
  customer: 'Customer',
  tenant: 'Tenant',
  workspace: 'Workspace',
  settings: 'Settings',
}

export default function AdminSection() {
  const { section } = useParams()
  const title = TITLES[section] ?? 'Admin'

  return (
    <PageShell breadcrumb={['Admin', title]} title={title}>
      <EmptyState title="Not built yet">
        The brief for this screen has not been written. Replace this file when
        it is.
      </EmptyState>
    </PageShell>
  )
}
