import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'

export default function NotFound() {
  return (
    <PageShell breadcrumb={['Not found']} title="Page not found">
      <EmptyState title="That page does not exist">
        <Link to="/leads" className="text-accent hover:underline">
          Back to Company Search
        </Link>
      </EmptyState>
    </PageShell>
  )
}
