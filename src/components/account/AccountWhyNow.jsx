/**
 * ACCOUNT PAGE, main column, section 6: WHY NOW.
 *
 * An amber callout. This is the one card that is allowed to look different
 * from the others, because it is the one that says act or do not act.
 *
 * One file per section. To change this section, this is the only file to open.
 */
import { EMPTY_STATES } from '../../data/emptyStates'
import { EmptyNote, SectionCard, TonePill } from '../ui'

export function AccountWhyNow({ company }) {
  const whyNow = company.whyNow

  return (
    <SectionCard
      icon="clock"
      label="Why now"
      className="border-l-2 border-l-[var(--lp-tone-amber)] bg-[var(--lp-tone-amber-bg)]"
      aside={whyNow ? <TonePill tone="amber">{whyNow.chip}</TonePill> : null}
    >
      {whyNow ? (
        <div>
          <p className="text-sm font-name text-txt">{whyNow.title}</p>
          <p className="mt-[var(--lp-label-gap)] text-sm text-txt-2">
            <span className="font-label text-txt">Why now</span>
            <span className="text-txt-3"> · </span>
            {whyNow.body}
          </p>
        </div>
      ) : (
        <EmptyNote>{EMPTY_STATES.whyNow}</EmptyNote>
      )}
    </SectionCard>
  )
}
