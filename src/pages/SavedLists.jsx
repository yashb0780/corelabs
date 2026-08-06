import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'

export default function SavedLists() {
  return (
    <PageShell
      breadcrumb={['Workspace', 'Saved lists']}
      title="Saved lists"
      subtitle="Lists you have pinned for a campaign or a call block."
    >
      <EmptyState title="Not built yet">
        The brief for this screen has not been written. Replace this file when
        it is.
      </EmptyState>
    </PageShell>
  )
}
