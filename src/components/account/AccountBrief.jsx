/**
 * ACCOUNT PAGE, main column, section 1: AI COMPANY BRIEF.
 * One file per section. To change this section, this is the only file to open.
 */
import { EMPTY_STATES } from '../../data/emptyStates'
import { Icon } from '../Icon'
import { EmptyNote, SectionCard } from '../ui'

function Field({ label, children }) {
  return (
    <div>
      <p className="lp-label">{label}</p>
      <p className="mt-[var(--lp-label-gap)] text-sm text-txt-2">{children}</p>
    </div>
  )
}

export function AccountBrief({ company }) {
  const { brief } = company
  const empty = !brief || !brief.whatTheySell

  return (
    <SectionCard
      icon="sparkle"
      label="AI company brief"
      aside={
        <span className="flex items-center gap-1.5 text-2xs text-txt-3">
          <Icon name="sparkle" className="size-3" />
          Cached brief · refreshed 3 days ago
        </span>
      }
    >
      {empty ? (
        <EmptyNote>{EMPTY_STATES.brief}</EmptyNote>
      ) : (
        <div className="space-y-3">
          <Field label="What they sell">{brief.whatTheySell}</Field>
          <Field label="What likely drives revenue">
            {brief.revenueDrivers}
          </Field>

          <div
            className="rounded-md border-l-2 border-accent bg-accent-quiet px-3 py-2.5"
            style={{ borderLeftColor: 'var(--lp-accent)' }}
          >
            <p className="lp-label text-accent">
              Fit note · for an SAP implementation firm
            </p>
            <p className="mt-[var(--lp-label-gap)] text-sm text-txt">
              {brief.fitNote}
            </p>
          </div>

          {brief.milestones.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs text-txt-2">
              {brief.milestones.map((m, i) => (
                <span key={m} className="flex items-center gap-2">
                  {i > 0 && <span className="text-txt-3">·</span>}
                  <span className="font-name">{m}</span>
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </SectionCard>
  )
}
