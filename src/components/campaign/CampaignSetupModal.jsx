/**
 * Start a campaign: one modal, five screens.
 *
 *   choose    the campaign name, the accounts and contacts in scope, and a
 *             choice of Multi-step sequence or Single email
 *   accounts  pick which accounts are in scope (opened from the Accounts card)
 *   contacts  pick which contacts are in scope (opened from the Contacts card)
 *   sequence  the sequence builder: when it starts, editable steps (type,
 *             day, time, subject) each showing the date it will send, Add
 *             step, remove a step, and the sending inbox
 *   email     compose one email: subject, body from a template, inbox, and
 *             when to send it (now, or scheduled for a date and time)
 *
 * The scope starts with every account and contact ticked. Both pickers edit
 * one set of selected contacts (see ScopePickers.jsx), so the Accounts and
 * Contacts numbers always agree, and every later screen reads the narrowed
 * numbers. If nothing is left, the two campaign options are disabled.
 *
 * Back returns to the first screen without losing what was typed or
 * scheduled. Nothing sends or schedules: the caller closes the modal and
 * confirms with a toast. Dates that have passed cannot be picked, and a
 * schedule that has passed disables the primary button.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { cx } from '../cx'
import {
  AddButton,
  Field,
  RemoveButton,
  SegmentedControl,
  Select,
  TextArea,
  TextInput,
} from '../form'
import { Modal } from '../overlay'
import { Button } from '../ui'
import { AccountsPicker, ContactsPicker } from './ScopePickers'
import {
  CAMPAIGN_COPY,
  CAMPAIGN_INBOXES,
  CAMPAIGN_SEQUENCE,
  CAMPAIGN_TYPES,
  DEFAULT_SEND_TIME,
  EMAIL_TEMPLATE,
  MAX_STEPS,
  NEW_STEP,
  STEP_TYPES,
} from '../../data/campaigns'
import { scopeMembers } from '../../lib/listMembers'
import {
  addDays,
  formatLongDate,
  formatLongDateTime,
  formatShortDateTime,
  isPast,
  timeOptions,
  todayIso,
  tomorrowIso,
} from '../../lib/schedule'

const COPY = CAMPAIGN_COPY.campaignModal
const INBOX_OPTIONS = CAMPAIGN_INBOXES.map((i) => ({ value: i, label: i }))

/* An Accounts or Contacts card. Clicking it opens that picker. Once the
   scope has been narrowed it also says how many there were to start with. */
function ScopeCard({ label, value, total, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-lg border border-line bg-surface-sunken px-3 py-2 text-left transition-colors duration-150 ease-lp hover:border-accent hover:bg-accent-quiet"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="lp-label">{label}</span>
        <span className="flex items-center gap-0.5 text-2xs text-txt-3 transition-colors duration-150 ease-lp group-hover:text-accent">
          {COPY.edit}
          <Icon name="chevronRight" className="size-3" />
        </span>
      </span>
      <span className="mt-1 flex items-baseline gap-1.5">
        <span className="text-lg font-num text-txt">{value.toLocaleString('en-US')}</span>
        {value !== total && (
          <span className="text-2xs tabular-nums text-txt-3">{COPY.ofTotal(total)}</span>
        )}
      </span>
    </button>
  )
}

/* --- Screen 1: choose ---------------------------------------------------- */

function ChooseView({ name, onNameChange, counts, totals, onOpen, onPick }) {
  const empty = counts.contacts === 0
  const blocked = !name.trim() || empty

  return (
    <div className="space-y-4">
      <Field label={COPY.nameLabel} htmlFor="campaign-name">
        <TextInput id="campaign-name" value={name} onChange={onNameChange} />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <ScopeCard
          label={COPY.accounts}
          value={counts.accounts}
          total={totals.accounts}
          onClick={() => onOpen('accounts')}
        />
        <ScopeCard
          label={COPY.contacts}
          value={counts.contacts}
          total={totals.contacts}
          onClick={() => onOpen('contacts')}
        />
      </div>

      <fieldset>
        <legend className="lp-label">{COPY.chooseLabel}</legend>
        <div className="mt-[var(--lp-label-gap)] grid gap-2 sm:grid-cols-2">
          {CAMPAIGN_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={blocked}
              onClick={() => onPick(t.id)}
              className="group flex h-full items-start gap-3 rounded-lg border border-line px-3.5 py-3 text-left transition-colors duration-150 ease-lp hover:border-accent hover:bg-accent-quiet disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-line text-txt-3 transition-colors duration-150 ease-lp group-hover:border-accent group-hover:text-accent">
                <Icon name={t.icon} className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-sm font-name text-txt">{t.label}</span>
                <span className="mt-1 block text-2xs text-txt-3">{t.description}</span>
              </span>
              <Icon
                name="chevronRight"
                className="mt-1 size-3.5 shrink-0 text-txt-3 transition-colors duration-150 ease-lp group-hover:text-accent"
              />
            </button>
          ))}
        </div>
        {empty && <p className="mt-2 text-2xs text-txt-2">{COPY.emptyScope}</p>}
      </fieldset>
    </div>
  )
}

/* A date picker and a time picker side by side. Past dates cannot be picked,
   and on today's date the times that have gone by are disabled. */
function DateTime({ id, value, onChange, dateLabel, timeLabel }) {
  return (
    <div className="grid grid-cols-[minmax(0,11rem)_minmax(0,8.5rem)] gap-2">
      <TextInput
        id={id}
        type="date"
        min={todayIso()}
        value={value.date}
        onChange={(date) => onChange({ ...value, date })}
        aria-label={dateLabel}
      />
      <Select
        value={value.time}
        onChange={(time) => onChange({ ...value, time })}
        options={timeOptions(value.date)}
        aria-label={timeLabel}
      />
    </div>
  )
}

/* --- Screen 2a: sequence builder ----------------------------------------- */

// Number, step type (wide enough for "LinkedIn connection request"), day,
// time, subject line, the date it sends, remove.
const ROW =
  'grid grid-cols-[1.25rem_minmax(0,14.5rem)_4rem_7.5rem_minmax(0,1fr)_8.5rem_2.25rem] items-center gap-2'

/** When a step sends: the start date plus its day offset, at its time. */
function stepSend(start, step) {
  if (step.day === '') return null
  return { date: addDays(start.date, Number(step.day)), time: step.time }
}

function SequenceView({ counts, start, onStartChange, steps, onStepsChange, inbox, onInboxChange }) {
  const S = COPY.sequence
  // Start above every key in use: this screen remounts after Back, possibly
  // with some steps removed, and a reused key would confuse the rows.
  const nextKey = useRef(Math.max(-1, ...steps.map((s) => s.key)) + 1)
  const atMax = steps.length >= MAX_STEPS

  const update = (key, patch) =>
    onStepsChange(steps.map((s) => (s.key === key ? { ...s, ...patch } : s)))

  const remove = (key) => onStepsChange(steps.filter((s) => s.key !== key))

  const add = () => {
    const lastDay = Math.max(0, ...steps.map((s) => Number(s.day) || 0))
    onStepsChange([
      ...steps,
      {
        key: nextKey.current++,
        type: NEW_STEP.type,
        day: lastDay + NEW_STEP.gapDays,
        time: NEW_STEP.time,
        subject: NEW_STEP.subject,
      },
    ])
  }

  return (
    <div className="space-y-4">
      <Field label={S.startLabel} htmlFor="sequence-start">
        <DateTime
          id="sequence-start"
          value={start}
          onChange={onStartChange}
          dateLabel={S.startDate}
          timeLabel={S.startTime}
        />
        {isPast(start.date, start.time) && (
          <p className="mt-1.5 text-2xs text-bad">{S.startPast}</p>
        )}
      </Field>

      <div>
        <p className="lp-label">{S.stepsLabel}</p>
        {/* Scrolls sideways on a narrow screen rather than squashing rows. */}
        <div className="mt-[var(--lp-label-gap)] overflow-x-auto rounded-lg border border-line">
          <div className="min-w-[48rem]">
            <div
              aria-hidden="true"
              className={cx(ROW, 'border-b border-line bg-surface-sunken px-3 py-1.5')}
            >
              <span />
              <span className="lp-label">{S.stepType}</span>
              <span className="lp-label">{S.day}</span>
              <span className="lp-label">{S.time}</span>
              <span className="lp-label">{S.subject}</span>
              <span className="lp-label">{S.sends}</span>
              <span />
            </div>

            <ol className="divide-y divide-line">
              {steps.map((step, i) => {
                const n = i + 1
                const send = stepSend(start, step)
                const past = send && isPast(send.date, send.time)
                return (
                  <li key={step.key} className={cx(ROW, 'px-3 py-2')}>
                    <span className="text-2xs font-num tabular-nums text-txt-3">{n}</span>
                    <Select
                      value={step.type}
                      onChange={(type) => update(step.key, { type })}
                      options={STEP_TYPES}
                      aria-label={`${S.step(n)}: ${S.stepType}`}
                    />
                    <TextInput
                      type="number"
                      min="0"
                      value={step.day}
                      onChange={(day) => update(step.key, { day: day === '' ? '' : Math.max(0, Number(day)) })}
                      aria-label={`${S.step(n)}: ${S.day}`}
                    />
                    <Select
                      value={step.time}
                      onChange={(time) => update(step.key, { time })}
                      options={timeOptions(send?.date ?? start.date)}
                      aria-label={`${S.step(n)}: ${S.time}`}
                    />
                    <TextInput
                      value={step.subject}
                      onChange={(subject) => update(step.key, { subject })}
                      placeholder={S.subjectPlaceholder}
                      aria-label={`${S.step(n)}: ${S.subject}`}
                    />
                    <span
                      className={cx(
                        'text-2xs tabular-nums whitespace-nowrap',
                        !send ? 'text-txt-3' : past ? 'text-bad' : 'text-txt-2',
                      )}
                    >
                      {!send ? S.noDay : past ? S.stepPast : formatShortDateTime(send.date, send.time)}
                    </span>
                    <RemoveButton
                      onClick={() => remove(step.key)}
                      label={S.remove(n)}
                      disabled={steps.length === 1}
                    />
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <AddButton onClick={add} disabled={atMax}>
            {S.add}
          </AddButton>
          {atMax && <span className="text-2xs text-txt-3">{S.max(MAX_STEPS)}</span>}
        </div>
      </div>

      <Field label={COPY.inboxLabel} htmlFor="sequence-inbox">
        <Select
          id="sequence-inbox"
          value={inbox}
          onChange={onInboxChange}
          options={INBOX_OPTIONS}
        />
      </Field>

      <div className="space-y-1">
        <p className="text-xs text-txt-2">{COPY.recipients(counts.contacts, counts.accounts)}</p>
        <p className="text-2xs text-txt-3">{S.note}</p>
      </div>
    </div>
  )
}

/* --- Screen 2b: single email --------------------------------------------- */

function EmailView({ counts, email, onEmailChange, schedule, onScheduleChange, inbox, onInboxChange }) {
  const E = COPY.email
  const later = schedule.mode === 'later'

  return (
    <div className="space-y-4">
      <Field label={COPY.inboxLabel} htmlFor="email-inbox">
        <Select
          id="email-inbox"
          value={inbox}
          onChange={onInboxChange}
          options={INBOX_OPTIONS}
        />
      </Field>

      <Field label={E.subject} htmlFor="email-subject">
        <TextInput
          id="email-subject"
          value={email.subject}
          onChange={(subject) => onEmailChange({ ...email, subject })}
        />
      </Field>

      <Field label={E.body} hint={E.bodyHint} htmlFor="email-body">
        <TextArea
          id="email-body"
          rows={10}
          value={email.body}
          onChange={(body) => onEmailChange({ ...email, body })}
        />
      </Field>

      <div>
        <p className="lp-label">{E.whenLabel}</p>
        <div className="mt-[var(--lp-label-gap)] space-y-2.5">
          <SegmentedControl
            label={E.whenLabel}
            value={schedule.mode}
            onChange={(mode) => onScheduleChange({ ...schedule, mode })}
            options={[
              { value: 'now', label: E.now },
              { value: 'later', label: E.later },
            ]}
          />
          {later && (
            <>
              <DateTime
                value={schedule}
                onChange={onScheduleChange}
                dateLabel={E.date}
                timeLabel={E.time}
              />
              <p
                className={cx(
                  'text-xs',
                  isPast(schedule.date, schedule.time) ? 'text-bad' : 'text-txt-2',
                )}
              >
                {isPast(schedule.date, schedule.time)
                  ? E.past
                  : E.summary(formatLongDateTime(schedule.date, schedule.time))}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-txt-2">{COPY.recipients(counts.contacts, counts.accounts)}</p>
        <p className="text-2xs text-txt-3">{E.note}</p>
      </div>
    </div>
  )
}

/* --- The modal ----------------------------------------------------------- */

export function CampaignSetupModal({ scope, onLaunch, onClose }) {
  const [view, setView] = useState('choose')
  const [name, setName] = useState(scope.name)
  // Until the name is edited by hand, its account count follows the scope.
  const [nameEdited, setNameEdited] = useState(false)
  const [inbox, setInbox] = useState(CAMPAIGN_INBOXES[0])
  const [steps, setSteps] = useState(() =>
    CAMPAIGN_SEQUENCE.map((s, key) => ({ ...s, key })),
  )
  const [email, setEmail] = useState(EMAIL_TEMPLATE)
  // Scheduling lives up here with everything else, so Back keeps it.
  const [start, setStart] = useState(() => ({ date: tomorrowIso(), time: DEFAULT_SEND_TIME }))
  const [schedule, setSchedule] = useState(() => ({
    mode: 'now',
    date: tomorrowIso(),
    time: DEFAULT_SEND_TIME,
  }))

  const sequenceReady =
    steps.length > 0 &&
    !isPast(start.date, start.time) &&
    steps.every((st) => {
      const send = stepSend(start, st)
      return send && !isPast(send.date, send.time)
    })
  const emailLater = schedule.mode === 'later'
  const emailReady =
    email.subject.trim() !== '' && (!emailLater || !isPast(schedule.date, schedule.time))
  const bodyRef = useRef(null)

  // Every account in scope, with its contacts, and which contacts are
  // ticked. Everything starts ticked.
  const members = useMemo(() => scopeMembers(scope), [scope])
  const [selected, setSelected] = useState(
    () => new Set(members.flatMap((a) => a.contacts.map((c) => c.id))),
  )

  const totals = {
    accounts: members.length,
    contacts: members.reduce((n, a) => n + a.contacts.length, 0),
  }
  const counts = {
    accounts: members.filter((a) => a.contacts.some((c) => selected.has(c.id))).length,
    contacts: selected.size,
  }

  const shownName = !nameEdited && scope.nameFor ? scope.nameFor(counts.accounts) : name
  const trimmed = shownName.trim()
  const editName = (value) => {
    setName(value)
    setNameEdited(true)
  }

  // The button that switched screens is gone, so move focus into the new
  // screen rather than leaving it nowhere. The first screen is handled by
  // the modal itself when it opens.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    bodyRef.current?.querySelector('input, select, textarea')?.focus()
  }, [view])

  const back = (
    <Button variant="secondary" icon="chevronLeft" onClick={() => setView('choose')}>
      {COPY.back}
    </Button>
  )

  const pickerFooter = (text) => (
    <>
      {back}
      <span className="text-xs tabular-nums text-txt-2">{text}</span>
    </>
  )

  const screens = {
    choose: {
      title: COPY.title,
      subtitle: null,
      body: (
        <ChooseView
          name={shownName}
          onNameChange={editName}
          counts={counts}
          totals={totals}
          onOpen={setView}
          onPick={setView}
        />
      ),
      footer: (
        <Button variant="secondary" onClick={onClose} className="ml-auto">
          {COPY.cancel}
        </Button>
      ),
    },
    accounts: {
      title: COPY.accountsPicker.title,
      subtitle: trimmed,
      body: <AccountsPicker members={members} selected={selected} onChange={setSelected} />,
      footer: pickerFooter(COPY.accountsPicker.count(counts.accounts, totals.accounts)),
    },
    contacts: {
      title: COPY.contactsPicker.title,
      subtitle: trimmed,
      body: <ContactsPicker members={members} selected={selected} onChange={setSelected} />,
      footer: pickerFooter(COPY.contactsPicker.count(counts.contacts, totals.contacts)),
    },
    sequence: {
      title: CAMPAIGN_TYPES[0].label,
      subtitle: trimmed,
      body: (
        <SequenceView
          counts={counts}
          start={start}
          onStartChange={setStart}
          steps={steps}
          onStepsChange={setSteps}
          inbox={inbox}
          onInboxChange={setInbox}
        />
      ),
      footer: (
        <>
          {back}
          <Button
            variant="primary"
            icon="clock"
            disabled={!sequenceReady}
            onClick={() => onLaunch('sequence', trimmed, formatLongDate(start.date))}
          >
            {COPY.sequence.confirm}
          </Button>
        </>
      ),
    },
    email: {
      title: CAMPAIGN_TYPES[1].label,
      subtitle: trimmed,
      body: (
        <EmailView
          counts={counts}
          email={email}
          onEmailChange={setEmail}
          schedule={schedule}
          onScheduleChange={setSchedule}
          inbox={inbox}
          onInboxChange={setInbox}
        />
      ),
      footer: (
        <>
          {back}
          <Button
            variant="primary"
            icon={emailLater ? 'clock' : 'send'}
            disabled={!emailReady}
            onClick={() =>
              emailLater
                ? onLaunch('emailScheduled', trimmed, formatLongDateTime(schedule.date, schedule.time))
                : onLaunch('email', trimmed)
            }
          >
            {emailLater ? COPY.email.confirmScheduled : COPY.email.confirm}
          </Button>
        </>
      ),
    },
  }

  const screen = screens[view]

  return (
    <Modal
      title={screen.title}
      subtitle={screen.subtitle}
      onClose={onClose}
      size={view === 'sequence' ? '2xl' : 'lg'}
      footer={<div className="flex w-full items-center justify-between gap-2">{screen.footer}</div>}
    >
      <div ref={bodyRef}>{screen.body}</div>
    </Modal>
  )
}
