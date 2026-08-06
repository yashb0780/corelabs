import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'

export default function Campaigns() {
  return (
    <PageShell
      breadcrumb={['Workspace', 'Campaigns']}
      title="Campaigns"
      subtitle="Outbound sequences running against your segments."
    >
      <EmptyState title="Not built yet">
        The brief for this screen has not been written. Replace this file when
        it is.
      </EmptyState>
    </PageShell>
  )
}
