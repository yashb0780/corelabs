/**
 * ACCOUNT PAGE, main column, section 3: DECISION PHASE.
 *
 * A five step timeline (Latent, Evaluating, Mobilizing, Executing, Landed)
 * with a branch dropping from Landed to a sixth node, Re-expanding.
 *
 * One file per section. To change this section, this is the only file to open.
 */
import { Fragment } from 'react'
import {
  getPhase,
  PHASE_BRANCH,
  PHASE_TIMELINE,
} from '../../data/companies'
import { EMPTY_STATES } from '../../data/emptyStates'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { EmptyNote, SectionCard, TonePill } from '../ui'

/**
 * One node on the timeline.
 * @param {'done'|'current'|'todo'} status
 */
function Step({ phase, status }) {
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
      <span
        aria-hidden="true"
        className={cx(
          'grid size-5 place-items-center rounded-full border',
          status === 'todo' && 'border-line bg-surface',
          status === 'done' && 'border-transparent bg-surface-sunken',
          status === 'current' && 'border-transparent',
        )}
        style={
          status === 'current'
            ? { backgroundColor: `var(--lp-tone-${phase.tone})` }
            : undefined
        }
      >
        {status === 'done' && (
          <Icon name="check" className="size-3 text-txt-3" />
        )}
      </span>
      <span
        className={cx(
          'text-2xs leading-tight',
          status === 'current' ? 'font-label text-txt' : 'text-txt-3',
        )}
        style={
          status === 'current' ? { color: `var(--lp-tone-${phase.tone})` } : undefined
        }
      >
        {phase.label}
      </span>
    </div>
  )
}

export function AccountPhase({ company }) {
  const current = getPhase(company.phase)
  const currentIndex = PHASE_TIMELINE.indexOf(company.phase)
  const branch = getPhase(PHASE_BRANCH)
  const onBranch = company.phase === PHASE_BRANCH

  const statusFor = (i) => {
    if (onBranch) return 'done'
    if (currentIndex === -1) return 'todo'
    if (i < currentIndex) return 'done'
    if (i === currentIndex) return 'current'
    return 'todo'
  }

  return (
    <SectionCard
      icon="timeline"
      label="Decision phase"
      aside={
        <TonePill
          tone={current.tone}
          dashed={current.dashed}
          title={current.description}
        >
          {current.label}
        </TonePill>
      }
    >
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[520px]">
          <div className="flex items-start">
            {PHASE_TIMELINE.map((id, i) => (
              <Fragment key={id}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px min-w-4 flex-1 bg-line"
                  />
                )}
                <Step phase={getPhase(id)} status={statusFor(i)} />
              </Fragment>
            ))}
          </div>

          {/* The branch: Landed can lead on to Re-expanding. */}
          <div className="flex justify-end">
            <span aria-hidden="true" className="mt-2.5 h-px w-8 bg-line" />
            <div className="relative pt-8">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2.5 h-[22px] w-px bg-line"
              />
              <Step phase={branch} status={onBranch ? 'current' : 'todo'} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        {company.phaseNote ? (
          <p className="text-sm text-txt-2">{company.phaseNote}</p>
        ) : (
          <EmptyNote>{EMPTY_STATES.phase}</EmptyNote>
        )}
      </div>
    </SectionCard>
  )
}
