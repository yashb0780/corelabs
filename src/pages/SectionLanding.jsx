/**
 * The landing page for Settings, Tenant, Vendor and Customer.
 *
 * Instead of expanding a nested list in the sidebar, each of those four opens
 * here and shows its options as a grid of cards. Clicking a card opens that
 * option's own page.
 *
 * One generic page serves all four sections, because the only thing that
 * differs between them is the card list, which lives in src/data/sections.js.
 */
import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { Icon } from '../components/Icon'
import { EmptyState } from '../components/ui'
import { getSection } from '../data/sections'

function OptionCard({ sectionId, card }) {
  return (
    <Link
      to={`/${sectionId}/${card.id}`}
      className="lp-card group transition-colors duration-150 ease-lp hover:border-accent hover:bg-accent-quiet"
    >
      <span className="flex size-7 items-center justify-center rounded-md border border-line bg-surface-sunken text-accent transition-colors duration-150 ease-lp group-hover:border-accent">
        <Icon name={card.icon} className="size-3.5" />
      </span>
      <p className="mt-2 text-base font-label text-txt">{card.label}</p>
      <p className="mt-[var(--lp-label-gap)] text-xs text-txt-2">
        {card.description}
      </p>
    </Link>
  )
}

export default function SectionLanding({ sectionId }) {
  const section = getSection(sectionId)

  if (!section) {
    return (
      <PageShell breadcrumb={['Not found']} title="Section not found">
        <EmptyState title="That section does not exist">
          <Link to="/leads" className="text-accent hover:underline">
            Back to Company Search
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  return (
    <PageShell
      breadcrumb={[section.root, section.label]}
      title={section.label}
      subtitle={section.description}
    >
      <div className="grid gap-[var(--lp-card-gap)] sm:grid-cols-2 xl:grid-cols-3">
        {section.cards.map((card) => (
          <OptionCard key={card.id} sectionId={section.id} card={card} />
        ))}
      </div>
    </PageShell>
  )
}
