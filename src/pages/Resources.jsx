import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'

export default function Resources() {
  return (
    <PageShell
      breadcrumb={['Tools', 'Resources']}
      title="Resources"
      subtitle="Playbooks, talk tracks and objection handling."
    >
      <EmptyState title="Not built yet">
        The brief for this screen has not been written. Replace this file when
        it is.
      </EmptyState>
    </PageShell>
  )
}
