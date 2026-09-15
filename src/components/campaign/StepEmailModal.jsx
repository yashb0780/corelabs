/**
 * What one step of a campaign says: its subject line and body, read only.
 *
 * Laid out like the Single email screen in Start a campaign (the same
 * Field, TextInput and TextArea, the same labels and the same hint), so it
 * reads as the same email, just no longer editable. {{first_name}} and the
 * other placeholders are shown as written rather than filled in, because
 * the step is the same for every contact.
 *
 * Opened from anywhere a step is named on a campaign's page, through
 * StepLink below: the Email sequence tab, a contact's last step sent, a
 * reply's "After step 2, Follow up", and an unsubscribe's step.
 */
import { useLayoutEffect, useRef } from 'react'
import { Field, TextArea, TextInput } from '../form'
import { Modal } from '../overlay'
import { Button } from '../ui'
import { CAMPAIGN_COPY, CAMPAIGN_SCREEN_COPY, STEP_TYPES } from '../../data/campaigns'
import { stepName } from '../../lib/campaignActivity'
import { formatTime } from '../../lib/schedule'

const D = CAMPAIGN_SCREEN_COPY.detail
const V = D.stepView
// The Single email screen's own labels, so the two can never drift apart.
const E = CAMPAIGN_COPY.campaignModal.email
const typeLabel = Object.fromEntries(STEP_TYPES.map((t) => [t.value, t.label]))
const ignore = () => {}

/**
 * A step's name, as a button that opens what it says. Looks like the text
 * around it, with a dotted underline so it reads as something to click.
 */
export function StepLink({ onOpen, children }) {
  return (
    <button
      type="button"
      title={V.open}
      onClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      className="max-w-full truncate text-left underline decoration-line-strong decoration-dotted underline-offset-4 transition-colors duration-150 ease-lp hover:text-accent hover:decoration-current"
    >
      {children}
    </button>
  )
}

export function StepEmailModal({ view, index, onClose }) {
  const step = view.sequence[index]
  const body = step.body ?? ''
  const isEmail = step.type === 'email'

  // Grows to fit the whole message. The Single email screen scrolls a
  // fixed box because you type in it; here you only read, so nothing
  // should be hidden below a scroll.
  const bodyRef = useRef(null)
  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }, [body])

  return (
    <Modal
      title={CAMPAIGN_SCREEN_COPY.lastStep(index + 1, view.sequence.length, stepName(step))}
      subtitle={V.subtitle(typeLabel[step.type] ?? step.type, D.sequence.day(step.day, formatTime(step.time)))}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-2xs text-txt-3">
            {view.status === 'draft' ? D.sequence.draftNote : D.sequence.startedNote}
          </span>
          <Button variant="secondary" onClick={onClose}>
            {V.close}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label={E.subject} htmlFor="step-subject">
          <TextInput id="step-subject" value={step.subject} onChange={ignore} readOnly />
        </Field>

        <Field label={isEmail ? E.body : V.linkedInBody} hint={E.bodyHint} htmlFor="step-body">
          <TextArea
            ref={bodyRef}
            id="step-body"
            rows={10}
            value={body}
            onChange={ignore}
            placeholder={V.noBody}
            readOnly
          />
        </Field>
      </div>
    </Modal>
  )
}
