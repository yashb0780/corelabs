import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'

export default function Generate() {
  return (
    <PageShell
      breadcrumb={['Tools', 'Generate']}
      title="Generate"
      subtitle="Draft outreach from an account's signals."
    >
      <EmptyState title="Not built yet">
        The brief for this screen has not been written. Replace this file when
        it is.
      </EmptyState>
    </PageShell>
  )
}
