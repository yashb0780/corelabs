/**
 * ACCOUNT PAGE - contacts section.
 *
 * One file per section of the account page. To change this section, this is
 * the only file you open. Row height comes from --lp-contact-pad-y in
 * src/styles/tokens.css.
 */
import { SectionLabel } from '../ui'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

export function AccountContacts({ company }) {
  return (
    <section className="lp-card">
      <SectionLabel icon="users" className="mb-[var(--lp-label-gap)]">
        Contacts
      </SectionLabel>
      <ul className="divide-y divide-line">
        {company.contacts.map((c) => (
          <li
            key={c.name}
            className="flex items-center gap-2.5 py-[var(--lp-contact-pad-y)] first:pt-0 last:pb-0"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-sunken text-2xs font-name text-txt-2">
              {initials(c.name)}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-name text-txt">{c.name}</p>
              <p className="truncate text-2xs text-txt-3">{c.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
