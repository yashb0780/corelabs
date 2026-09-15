/**
 * The five cards above the campaign table: Active campaigns, Contacts in
 * sequence, Emails sent in the last 30 days, Reply rate and Interested
 * replies. One row, wrapping on a narrow screen.
 *
 * Every figure comes from campaignMetrics() in src/lib/campaignActivity.js,
 * worked out from the campaigns and their activity. None is typed in. They
 * cover every campaign, and never follow the table's search or status
 * filter, so the numbers do not shift while someone looks for something.
 */
import { CAMPAIGN_SCREEN_COPY } from '../../data/campaigns'

const M = CAMPAIGN_SCREEN_COPY.metrics

const count = (n) => n.toLocaleString('en-US')

/* Each card shares its three rows (label, figure, note) with the cards
   beside it, so a label that wraps to two lines never knocks its figure
   out of line with the others. */
function Metric({ label, value, note }) {
  return (
    <div className="lp-card row-span-3 grid grid-rows-subgrid gap-y-1">
      <dt className="lp-label">{label}</dt>
      <dd className="mt-1 self-end text-2xl font-num tabular-nums text-txt">{value}</dd>
      <dd className="text-2xs text-txt-3">{note}</dd>
    </div>
  )
}

export function CampaignMetrics({ metrics }) {
  const rate =
    metrics.replyRate === null
      ? CAMPAIGN_SCREEN_COPY.none
      : `${(Math.round(metrics.replyRate * 1000) / 10).toFixed(1)}%`

  return (
    <dl
      aria-label={M.label}
      className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-[var(--lp-card-gap)]"
    >
      <Metric
        label={M.active}
        value={count(metrics.activeCampaigns)}
        note={M.activeNote(metrics.scheduledCampaigns)}
      />
      <Metric label={M.inSequence} value={count(metrics.contactsInSequence)} note={M.inSequenceNote} />
      <Metric label={M.emailsSent} value={count(metrics.emailsLast30Days)} note={M.emailsSentNote} />
      <Metric label={M.replyRate} value={rate} note={M.replyRateNote} />
      <Metric
        label={M.interested}
        value={count(metrics.interestedReplies)}
        note={metrics.needReview > 0 ? M.needReview(metrics.needReview) : M.interestedNote}
      />
    </dl>
  )
}
