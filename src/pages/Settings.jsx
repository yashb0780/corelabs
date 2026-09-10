/**
 * SETTINGS.
 *
 * One page, five sections: General, Tenant, Vendor, Customer, Workspace.
 * Every section has its own address (/settings, /settings/tenant, ...), so
 * each can be linked to directly. The list of sections is not drawn here: the
 * left sidebar swaps over to it while you are in Settings (see Sidebar.jsx).
 *
 * The panel takes the full remaining width, exactly as every other screen
 * does. It is not a narrow centred column.
 *
 * A section shows its options as a grid of cards, and clicking a card opens
 * that option's own page. A section with no cards shows a placeholder. The
 * lists live in src/data/sections.js.
 */
import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { Icon } from '../components/Icon'
import { EmptyState } from '../components/ui'
import { getSection } from '../data/sections'
import { getSettingsNav, settingsCrumbs } from '../lib/settings'

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

export default function Settings({ sectionId }) {
  const nav = getSettingsNav(sectionId)
  const section = getSection(nav.section)

  return (
    <PageShell
      breadcrumb={settingsCrumbs(nav.id)}
      title={nav.label}
      subtitle={section?.description}
    >
      {section ? (
        <div className="grid gap-[var(--lp-card-gap)] sm:grid-cols-2 xl:grid-cols-3">
          {section.cards.map((card) => (
            <OptionCard key={card.id} sectionId={section.id} card={card} />
          ))}
        </div>
      ) : (
        <EmptyState title={nav.empty.title}>{nav.empty.body}</EmptyState>
      )}
    </PageShell>
  )
}
