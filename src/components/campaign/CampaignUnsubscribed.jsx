/**
 * Unsubscribed: the last tab on a campaign's page. Everyone who asked to
 * stop, newest first: contact, company, the step they unsubscribed after,
 * and when. An unsubscribed contact is never sent another step, under any
 * suppression setting, so the last step they were sent is the one they
 * unsubscribed after. Clicking it opens what that step said.
 */
import { EmptyNote } from '../ui'
import { StepLink } from './StepEmailModal'
import { CAMPAIGN_SCREEN_COPY } from '../../data/campaigns'
import { atMs, formatShortDateTime, splitAt } from '../../lib/schedule'

const COPY = CAMPAIGN_SCREEN_COPY.detail.unsubscribed
const AFTER = CAMPAIGN_SCREEN_COPY.detail.replies.after

const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]'
const TH = `lp-label ${CELL_PAD} text-left align-bottom`
const TD = `${CELL_PAD} align-top`

const shortAt = (at) => {
  const { date, time } = splitAt(at)
  return formatShortDateTime(date, time)
}

export function CampaignUnsubscribed({ view, onViewStep }) {
  const rows = view.activity
    .filter((a) => a.unsubscribedAt)
    .sort((a, b) => atMs(b.unsubscribedAt) - atMs(a.unsubscribedAt))

  if (rows.length === 0) return <EmptyNote>{COPY.none}</EmptyNote>

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[760px] border-collapse">
        <thead className="bg-surface-sunken">
          <tr className="border-b border-line">
            <th scope="col" className={TH}>{COPY.columns.contact}</th>
            <th scope="col" className={TH}>{COPY.columns.company}</th>
            <th scope="col" className={TH}>{COPY.columns.after}</th>
            <th scope="col" className={TH}>{COPY.columns.when}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-line bg-surface last:border-b-0">
              <td className={TD}>
                <p className="text-sm leading-tight font-name text-txt">{a.contactName}</p>
                <p className="mt-1 text-2xs leading-tight text-txt-2">{a.role}</p>
              </td>
              <td className={`${TD} text-sm text-txt-2`}>{a.companyName}</td>
              <td className={`${TD} text-sm text-txt`}>
                {a.lastStepIndex === null ? (
                  CAMPAIGN_SCREEN_COPY.none
                ) : (
                  <StepLink onOpen={() => onViewStep(a.lastStepIndex)}>
                    {AFTER(a.lastStepIndex + 1, a.lastStepName)}
                  </StepLink>
                )}
              </td>
              <td className={`${TD} text-sm whitespace-nowrap text-txt-2`}>{shortAt(a.unsubscribedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
