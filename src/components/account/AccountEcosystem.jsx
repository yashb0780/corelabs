/**
 * ACCOUNT PAGE, main column, section 7: ECOSYSTEM SIGNALS.
 *
 * Marked Secondary: useful colour on scope, not a reason to act.
 * One file per section. To change this section, this is the only file to open.
 */
import { EMPTY_STATES } from '../../data/emptyStates'
import { Icon } from '../Icon'
import { EmptyNote, SectionCard } from '../ui'

export function AccountEcosystem({ company }) {
  const rows = company.ecosystem ?? []

  return (
    <SectionCard
      icon="network"
      label="Ecosystem signals"
      aside={<span className="text-2xs text-txt-3">Secondary</span>}
    >
      {rows.length === 0 ? (
        <EmptyNote>{EMPTY_STATES.ecosystem}</EmptyNote>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row} className="flex gap-2">
              <Icon
                name="network"
                className="mt-0.5 size-3.5 shrink-0 text-accent"
              />
              <span className="text-sm text-txt-2">{row}</span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
