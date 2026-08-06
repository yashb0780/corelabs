/**
 * ACCOUNT PAGE - contacts section.
 *
 * One file per section of the account page. To change this section, this is
 * the only file you open.
 */
import { SectionLabel } from '../ui'

export function AccountContacts({ company }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-5">
      <SectionLabel className="mb-3">Contacts</SectionLabel>
      <ul className="divide-y divide-line">
        {company.contacts.map((c) => (
          <li key={c.name} className="flex items-center gap-3 py-2.5 first:pt-0">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-sunken font-mono text-2xs text-txt-2">
              {c.name
                .split(' ')
                .slice(0, 2)
                .map((p) => p[0])
                .join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-txt">{c.name}</p>
              <p className="truncate text-2xs text-txt-3">{c.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
