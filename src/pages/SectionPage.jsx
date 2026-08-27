/**
 * The detail page behind one card on a section landing page, for example
 * /tenant/users or /settings/territory-mapping.
 *
 * The breadcrumb at the top is clickable back up to the landing page. The
 * sidebar item for the section stays active while you are in here, because
 * its NavLink matches the whole /<section> path rather than just the exact
 * landing route.
 *
 * The screens themselves have no brief yet, so each shows a placeholder. One
 * generic page serves all of them until they are specified.
 */
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'
import { getCard, getSection } from '../data/sections'

export default function SectionPage({ sectionId }) {
  const { cardId } = useParams()
  const section = getSection(sectionId)
  const card = getCard(sectionId, cardId)

  if (!section || !card) {
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

  return (
    <PageShell
      breadcrumb={[
        section.root,
        { label: section.label, to: `/${section.id}` },
        card.label,
      ]}
      title={card.label}
      subtitle={card.description}
    >
      <EmptyState title="Not built yet">
        The brief for this screen has not been written. Replace this file when
        it is.
      </EmptyState>
    </PageShell>
  )
}
