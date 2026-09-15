/**
 * The five cards above the campaign table: Active campaigns, Contacts in
 * sequence, Emails sent in the last 30 days, Reply rate and Interested
 * replies. One row on a wide screen; three and two, or two by two, on a
 * narrower one.
 *
 * Every figure comes from campaignMetrics() in src/lib/campaignActivity.js,
 * worked out from the campaigns and their activity. None is typed in. They
 * cover every campaign, and never follow the table's search or status
 * filter, so the numbers do not shift while someone looks for something.
 *
 * Compact on purpose: a title and a number, nothing under it. The two whose
 * number needs explaining (Emails sent and Reply rate) carry a hint on the
 * title, shown when you hover it; the dotted underline says one is there.
 * Screen readers hear the hint as part of the title.
 */
import { cx } from '../cx'
import { CAMPAIGN_SCREEN_COPY } from '../../data/campaigns'

const M = CAMPAIGN_SCREEN_COPY.metrics

const count = (n) => n.toLocaleString('en-US')

/* Each card shares its two rows (title, figure) with the cards beside it,
   so a title that wraps to two lines never knocks its figure out of line
   with the others. */
function Metric({ label, value, hint }) {
  return (
    <div className="lp-card row-span-2 grid grid-rows-subgrid gap-y-1 px-[var(--lp-stat-pad-x)] py-[var(--lp-stat-pad-y)]">
      <dt className="lp-label lp-label-lg">
        <span
          title={hint}
          className={cx(hint && 'cursor-help underline decoration-line-strong decoration-dotted underline-offset-4')}
        >
          {label}
        </span>
        {hint && <span className="sr-only">. {hint}</span>}
      </dt>
      <dd className="self-end text-xl font-num tabular-nums text-txt">{value}</dd>
    </div>
  )
}

export function CampaignMetrics({ metrics }) {
  const rate =
    metrics.replyRate === null
      ? CAMPAIGN_SCREEN_COPY.none
      : `${(Math.round(metrics.replyRate * 1000) / 10).toFixed(1)}%`

  return (
    // Five across on a wide screen, then three and two, then two by two:
    // never four and one left on its own.
    <dl aria-label={M.label} className="grid grid-cols-2 gap-[var(--lp-card-gap)] md:grid-cols-3 xl:grid-cols-5">
      <Metric label={M.active} value={count(metrics.activeCampaigns)} />
      <Metric label={M.inSequence} value={count(metrics.contactsInSequence)} />
      <Metric label={M.emailsSent} value={count(metrics.emailsLast30Days)} hint={M.emailsSentHint} />
      <Metric label={M.replyRate} value={rate} hint={M.replyRateHint} />
      <Metric label={M.interested} value={count(metrics.interestedReplies)} />
    </dl>
  )
}
