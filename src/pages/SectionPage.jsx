/**
 * The detail page behind one card in a Settings section, for example
 * /tenant/users or /settings/territory-mapping.
 *
 * The breadcrumb runs Admin > Settings > Section > Card, and is clickable
 * back up to the section. The sidebar stays on the settings list in here,
 * with this card's section highlighted (see src/lib/settings.js), even
 * though these pages kept their original addresses outside /settings.
 *
 * The screens themselves have no brief yet, so each shows a placeholder. One
 * generic page serves all of them until they are specified.
 */
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'
import { getCard, getSection } from '../data/sections'
import { settingsCrumbs, settingsNavForSection } from '../lib/settings'

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
        ...settingsCrumbs(settingsNavForSection(section.id)?.id),
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
