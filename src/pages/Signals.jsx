import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'

export default function Signals() {
  return (
    <PageShell
      breadcrumb={['Workspace', 'Signals']}
      title="Signals"
      subtitle="Hiring, roadmap and budget signals across your ICP."
    >
      <EmptyState title="Not built yet">
        The brief for this screen has not been written. Replace this file when
        it is.
      </EmptyState>
    </PageShell>
  )
}
