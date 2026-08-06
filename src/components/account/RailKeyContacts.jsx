/**
 * ACCOUNT PAGE, right rail card 2: KEY CONTACTS.
 *
 * One contact per company can be flagged `likelyChampion` in the data. That
 * row gets a tinted background and a star chip.
 *
 * One file per section. To change this section, this is the only file to open.
 */
import { EMPTY_STATES } from '../../data/emptyStates'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { Button, EmptyNote, SectionCard } from '../ui'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

function ContactRow({ contact }) {
  return (
    <li
      className={cx(
        'flex items-start gap-2.5 rounded-md px-2 py-2',
        contact.likelyChampion && 'bg-accent-quiet',
      )}
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-sunken text-2xs font-name text-txt-2">
        {initials(contact.name)}
      </span>

      <div className="min-w-0 flex-1 leading-tight">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-name text-txt">{contact.name}</p>
          {contact.likelyChampion && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface px-1.5 py-0.5 text-2xs font-name text-accent">
              <Icon name="star" className="size-2.5" />
              Likely champion
            </span>
          )}
        </div>
        <p className="truncate text-2xs text-txt-2">{contact.title}</p>
        <p className="text-2xs text-txt-3">{contact.tenure}</p>
        {contact.prior && (
          <p className="text-2xs text-txt-3">Prior: {contact.prior}</p>
        )}
      </div>

      <Button size="sm" variant="ghost" className="shrink-0">
        View
      </Button>
    </li>
  )
}

export function RailKeyContacts({ company }) {
  const contacts = company.contacts ?? []

  return (
    <SectionCard
      icon="users"
      label="Key contacts"
      aside={
        contacts.length > 0 ? (
          <span className="text-2xs text-txt-3">{contacts.length} mapped</span>
        ) : null
      }
    >
      {contacts.length === 0 ? (
        <EmptyNote>{EMPTY_STATES.contacts}</EmptyNote>
      ) : (
        <ul className="-mx-2 space-y-0.5">
          {contacts.map((c) => (
            <ContactRow key={c.name} contact={c} />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
