/**
 * Email sequence: the second tab on a campaign's page. Read only; editing
 * a sequence once it has started is out of scope (section 9 of BRIEF.md).
 *
 * For each step: its number and name, its type, the day and time it goes
 * out, its subject line, and two figures worked out from the activity: how
 * many contacts it has been sent to, and how many replies followed it.
 *
 * Clicking a step, anywhere on its row, opens what it says: its subject
 * line and body, in StepEmailModal.jsx.
 *
 * Under the day and time, the date: when the step first went out, or when
 * it is due if it has not. A paused campaign says its unsent steps are on
 * hold, and a step nobody is left to receive shows no date at all, rather
 * than a date that will never happen.
 */
import { cx } from '../cx'
import { StepLink } from './StepEmailModal'
import { CAMPAIGN_SCREEN_COPY, STEP_TYPES } from '../../data/campaigns'
import { campaignStepTimes, stepName } from '../../lib/campaignActivity'
import { atMs, formatShortDateTime, formatTime, msToAt, splitAt } from '../../lib/schedule'

const COPY = CAMPAIGN_SCREEN_COPY.detail.sequence

const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]'
const TH = `lp-label ${CELL_PAD} text-left align-bottom`
const TD = `${CELL_PAD} align-top`
const WIDTHS = ['w-[12rem]', 'w-[14rem]', 'w-[12.5rem]', null, 'w-[8rem]', 'w-[8rem]']

const typeLabel = Object.fromEntries(STEP_TYPES.map((t) => [t.value, t.label]))

const shortAt = (at) => {
  const { date, time } = splitAt(at)
  return formatShortDateTime(date, time)
}

export function CampaignSequence({ campaign, view, onViewStep }) {
  const now = Date.now()
  const times = campaignStepTimes(campaign)
  const stillSending = view.activity.some((a) => a.nextSendAt)

  const rows = view.sequence.map((step, i) => {
    const sent = view.activity.filter((a) => a.sends.some((s) => s.index === i))
    const first = sent
      .map((a) => atMs(a.sends.find((s) => s.index === i).at))
      .reduce((m, t) => Math.min(m, t), Infinity)
    let when = null
    if (first !== Infinity) when = COPY.firstSent(shortAt(msToAt(first)))
    else if (view.status === 'paused') when = COPY.onHold
    else if (view.status !== 'draft' && stillSending && times[i] !== null && times[i] > now)
      when = COPY.due(shortAt(msToAt(times[i])))
    return {
      step,
      when,
      sentTo: sent.length,
      replies: view.activity.filter((a) => a.replyType && a.replyStepIndex === i).length,
    }
  })

  return (
    <div className="lp-stack">
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[960px] table-fixed border-collapse">
          <colgroup>
            {WIDTHS.map((w, i) => (
              <col key={i} className={w ?? undefined} />
            ))}
          </colgroup>
          <thead className="bg-surface-sunken">
            <tr className="border-b border-line">
              <th scope="col" className={TH}>{COPY.columns.step}</th>
              <th scope="col" className={TH}>{COPY.columns.type}</th>
              <th scope="col" className={TH}>{COPY.columns.when}</th>
              <th scope="col" className={TH}>{COPY.columns.subject}</th>
              <th scope="col" className={cx(TH, 'text-right')}>{COPY.columns.sent}</th>
              <th scope="col" className={cx(TH, 'text-right')}>{COPY.columns.replies}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ step, when, sentTo, replies }, i) => (
              <tr
                key={i}
                onClick={() => onViewStep(i)}
                className="cursor-pointer border-b border-line bg-surface transition-colors duration-150 ease-lp last:border-b-0 hover:bg-surface-hover"
              >
                <td className={TD}>
                  <p className="flex items-baseline gap-2 leading-tight">
                    <span className="text-2xs font-num tabular-nums text-txt-3">{i + 1}</span>
                    <span className="min-w-0 text-sm font-name text-txt">
                      <StepLink onOpen={() => onViewStep(i)}>{stepName(step)}</StepLink>
                    </span>
                  </p>
                </td>
                <td className={cx(TD, 'text-sm text-txt-2')}>{typeLabel[step.type] ?? step.type}</td>
                <td className={TD}>
                  <p className="text-sm leading-tight text-txt">{COPY.day(step.day, formatTime(step.time))}</p>
                  {when && <p className="mt-1 text-2xs leading-tight text-txt-3">{when}</p>}
                </td>
                <td className={cx(TD, 'text-sm text-txt-2')}>
                  <span className="block truncate" title={step.subject}>
                    {step.subject}
                  </span>
                </td>
                <td className={cx(TD, 'text-right text-sm font-num tabular-nums text-txt')}>
                  {sentTo.toLocaleString('en-US')}
                </td>
                <td className={cx(TD, 'text-right text-sm font-num tabular-nums text-txt')}>
                  {replies.toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-2xs text-txt-3">{view.status === 'draft' ? COPY.draftNote : COPY.startedNote}</p>
    </div>
  )
}
