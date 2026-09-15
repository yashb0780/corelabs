/**
 * Companies and Activity: the first tab on a campaign's page.
 *
 * One row per company, expandable to show its contacts. The company row
 * shows the logo and a link to the account page when it is one of the real
 * companies, how many contacts are in the campaign, the furthest step any
 * of them has reached, and the reply most worth acting on.
 *
 * Each contact row shows name, role and email, the last step sent to them
 * ("Step 2 of 4, Follow up"), when it went, their next send, where they are
 * in the campaign, and how their reply was classified. This is where the
 * Campaigns table's "who did the last step go to" lives now. Clicking the
 * step opens what it said.
 *
 * Where an interested reply has paused a company, a banner on the company
 * row, visible even when it is collapsed, names who replied and when, and
 * offers Resume outreach. Companies that need attention come first; see
 * companyGroups() in src/lib/campaignActivity.js.
 *
 * A big list draws the first PICKER_ROW_LIMIT companies, the same limit and
 * wording as the Accounts picker, and the search finds the rest.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { SearchInput } from '../form'
import { Button, CompanyLogo, EmptyNote, TonePill } from '../ui'
import { StepLink } from './StepEmailModal'
import {
  CAMPAIGN_SCREEN_COPY,
  PARTICIPATION,
  PICKER_ROW_LIMIT,
  REPLY_TYPES,
  SUPPRESSION_RULES,
} from '../../data/campaigns'
import { getCompany } from '../../data/companies'
import { companyGroups } from '../../lib/campaignActivity'
import { formatLongDateTime, formatShortDate, formatShortDateTime, splitAt } from '../../lib/schedule'

const COPY = CAMPAIGN_SCREEN_COPY.detail.companies
const NONE = CAMPAIGN_SCREEN_COPY.none

const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]'
const TH = `lp-label ${CELL_PAD} text-left align-bottom`
const TD = `${CELL_PAD} align-top`

// Every column but the contact, in order. The contact takes the rest.
const WIDTHS = ['w-[12rem]', 'w-[11rem]', 'w-[11rem]', 'w-[13rem]', 'w-[9.5rem]']

const shortAt = (at) => {
  const { date, time } = splitAt(at)
  return formatShortDateTime(date, time)
}

const longAt = (at) => {
  const { date, time } = splitAt(at)
  return formatLongDateTime(date, time)
}

export function ReplyBadge({ type }) {
  const t = REPLY_TYPES[type]
  return (
    <TonePill tone={t.tone} dashed={t.dashed}>
      {t.label}
    </TonePill>
  )
}

/* The banner on a paused company, with the button that lifts the pause.
   If the campaign's setting has changed since the pause, it says so: a
   change never lifts a pause, and without the sentence a "Stop for that
   contact only" campaign with paused colleagues looks contradictory. */
function SuppressionBanner({ suppression, rule, onResume }) {
  const { by, paused } = suppression
  const earlier = by.replyRule !== rule && SUPPRESSION_RULES.find((r) => r.id === by.replyRule)
  return (
    <div
      className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md px-3 py-2"
      style={{ backgroundColor: 'var(--lp-tone-amber-bg)' }}
    >
      <Icon name="pause" className="size-3.5 shrink-0 text-[var(--lp-tone-amber)]" />
      <p className="min-w-0 flex-1 text-sm text-txt">
        {COPY.banner(by.contactName, longAt(by.replyReceivedAt), paused)}
        {earlier && <span className="text-txt-2"> {COPY.earlierRule(earlier.label)}</span>}
      </p>
      <Button variant="secondary" size="sm" icon="play" onClick={onResume}>
        {COPY.resumeOutreach}
      </Button>
    </div>
  )
}

function CompanyRow({ group, steps, rule, open, onToggle, onResumeOutreach }) {
  const real = getCompany(group.id)
  const panelId = `company-${group.id}`
  const furthest =
    group.furthestStepIndex === null ? COPY.notStarted : COPY.furthest(group.furthestStepIndex + 1, steps)

  return (
    <tr
      onClick={onToggle}
      className="cursor-pointer border-b border-line bg-surface transition-colors duration-150 ease-lp hover:bg-surface-hover"
    >
      <th scope="rowgroup" colSpan={6} className={cx(CELL_PAD, 'text-left font-normal')}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={COPY.toggle(group.name)}
            className="-ml-1 grid size-6 shrink-0 place-items-center rounded text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-sunken hover:text-txt"
          >
            <Icon
              name="chevronRight"
              className={cx('size-3.5 transition-transform duration-150 ease-lp', open && 'rotate-90')}
            />
          </button>

          {real && <CompanyLogo company={real} />}

          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
            {real ? (
              <Link
                to={`/leads/${real.id}`}
                onClick={(e) => e.stopPropagation()}
                title={COPY.accountPage(real.name)}
                className="truncate text-sm font-name text-txt hover:underline"
              >
                {group.name}
              </Link>
            ) : (
              <span className="truncate text-sm font-name text-txt">{group.name}</span>
            )}
            <span className="text-2xs tabular-nums text-txt-3">
              {COPY.contacts(group.contacts.length)} · {furthest}
            </span>
          </div>

          {group.topReply && <ReplyBadge type={group.topReply} />}
        </div>

        {group.suppression && (
          // Its own clicks, so resuming never also opens or closes the row.
          <div onClick={(e) => e.stopPropagation()} className="pl-9">
            <SuppressionBanner
              suppression={group.suppression}
              rule={rule}
              onResume={() => onResumeOutreach(group.id)}
            />
          </div>
        )}
      </th>
    </tr>
  )
}

function ContactRow({ a, steps, onViewStep }) {
  return (
    <tr className="border-b border-line bg-canvas">
      <td className={cx(TD, 'pl-12')}>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-name text-txt">{a.contactName}</p>
          <p className="mt-1 truncate text-2xs text-txt-2" title={a.role}>
            {a.role}
          </p>
          <p className="mt-0.5 truncate text-2xs text-txt-3" title={a.email}>
            {a.email}
          </p>
        </div>
      </td>
      <td className={cx(TD, 'text-sm text-txt')}>
        {a.lastStepIndex === null ? (
          <span className="text-txt-3">{NONE}</span>
        ) : (
          <StepLink onOpen={() => onViewStep(a.lastStepIndex)}>
            {CAMPAIGN_SCREEN_COPY.lastStep(a.lastStepIndex + 1, steps, a.lastStepName)}
          </StepLink>
        )}
      </td>
      <td className={cx(TD, 'text-sm whitespace-nowrap text-txt-2')}>
        {a.lastSentAt ? shortAt(a.lastSentAt) : <span className="text-txt-3">{NONE}</span>}
      </td>
      <td className={cx(TD, 'text-sm whitespace-nowrap text-txt-2')}>
        {a.nextSendAt ? shortAt(a.nextSendAt) : <span className="text-txt-3">{NONE}</span>}
      </td>
      <td className={cx(TD, 'text-sm text-txt-2')}>{PARTICIPATION[a.status]}</td>
      <td className={TD}>
        {a.replyType && <ReplyBadge type={a.replyType} />}
        {a.resumeAt && (
          <p className="mt-1 text-2xs text-txt-3">{COPY.back(formatShortDate(a.resumeAt))}</p>
        )}
      </td>
    </tr>
  )
}

export function CampaignCompanies({ view, onResumeOutreach, onViewStep }) {
  const groups = useMemo(() => companyGroups(view), [view])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(() => new Set())

  const q = query.trim().toLowerCase()
  const matches = q
    ? groups.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.contacts.some((a) => a.contactName.toLowerCase().includes(q) || a.email.includes(q)),
      )
    : groups
  const shown = matches.slice(0, PICKER_ROW_LIMIT)
  const allOpen = shown.length > 0 && shown.every((g) => open.has(g.id))
  const allSuppressed = groups.length > 0 && groups.every((g) => g.suppression)
  const steps = view.sequence.length

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="lp-stack">
      {allSuppressed && <EmptyNote>{COPY.allSuppressed}</EmptyNote>}

      <div className="flex items-center gap-2">
        <div className="w-full sm:w-80">
          <SearchInput value={query} onChange={setQuery} placeholder={COPY.search} aria-label={COPY.search} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(allOpen ? new Set() : new Set(shown.map((g) => g.id)))}
          disabled={shown.length === 0}
        >
          {allOpen ? COPY.collapseAll : COPY.expandAll}
        </Button>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-line px-3 py-3 text-sm text-txt-3">
          {COPY.noMatch} “{query.trim()}”
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[1000px] table-fixed border-collapse">
            <colgroup>
              <col />
              {WIDTHS.map((w, i) => (
                <col key={i} className={w} />
              ))}
            </colgroup>
            <thead className="bg-surface-sunken">
              <tr className="border-b border-line">
                <th scope="col" className={TH}>{COPY.columns.contact}</th>
                <th scope="col" className={TH}>{COPY.columns.lastStep}</th>
                <th scope="col" className={TH}>{COPY.columns.lastSent}</th>
                <th scope="col" className={TH}>{COPY.columns.nextSend}</th>
                <th scope="col" className={TH}>{COPY.columns.status}</th>
                <th scope="col" className={TH}>{COPY.columns.reply}</th>
              </tr>
            </thead>
            {shown.map((g) => {
              const isOpen = open.has(g.id)
              return (
                <tbody key={g.id} id={`company-${g.id}`} className="[&:last-child>tr:last-child]:border-b-0">
                  <CompanyRow
                    group={g}
                    steps={steps}
                    rule={view.suppressionRule}
                    open={isOpen}
                    onToggle={() => toggle(g.id)}
                    onResumeOutreach={onResumeOutreach}
                  />
                  {isOpen &&
                    g.contacts.map((a) => <ContactRow key={a.id} a={a} steps={steps} onViewStep={onViewStep} />)}
                </tbody>
              )
            })}
          </table>
        </div>
      )}
      {shown.length < matches.length && (
        <p className="text-2xs text-txt-3">{COPY.limited(shown.length, matches.length)}</p>
      )}
    </div>
  )
}
