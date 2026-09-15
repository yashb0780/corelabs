/**
 * Replies: the third tab on a campaign's page. Every reply, newest first:
 * contact and company, the step it followed, a one-line snippet, how it was
 * classified, and when it arrived.
 *
 * Filter pills above: All, Interested, Out of office, Not interested and
 * Needs review, which shows the unclear replies. Each unclear reply has a
 * button for every label the classifier could have given it. Whichever is
 * picked, the store decides the reply at that moment (see classifyReply in
 * src/lib/campaigns.js): interested applies the campaign's suppression
 * setting now, out of office stops no one, not interested stops only that
 * contact. The reply then leaves the review queue with its new badge.
 *
 * "After step 2, Follow up" opens what that step said, so a reply can be
 * read against the email it answered.
 */
import { useState } from 'react'
import { cx } from '../cx'
import { Button, EmptyNote, FilterPill } from '../ui'
import { ReplyBadge } from './CampaignCompanies'
import { StepLink } from './StepEmailModal'
import { CAMPAIGN_SCREEN_COPY } from '../../data/campaigns'
import { stepName } from '../../lib/campaignActivity'
import { atMs, formatShortDateTime, splitAt } from '../../lib/schedule'

const COPY = CAMPAIGN_SCREEN_COPY.detail.replies
const FILTERS = ['all', 'interested', 'ooo', 'not_interested', 'unclear']
const MARKS = ['interested', 'ooo', 'not_interested']

const shortAt = (at) => {
  const { date, time } = splitAt(at)
  return formatShortDateTime(date, time)
}

// Contact | what they said | badge | when. Scrolls sideways on a narrow
// screen rather than squashing the snippet.
const ROW = 'grid grid-cols-[minmax(0,15rem)_minmax(0,1fr)_9rem_10.5rem] items-start gap-4'

export function CampaignReplies({ view, onClassify, onViewStep }) {
  const [filter, setFilter] = useState('all')

  const replies = view.activity
    .filter((a) => a.replyType)
    .sort((a, b) => atMs(b.replyReceivedAt) - atMs(a.replyReceivedAt))
  const shown = filter === 'all' ? replies : replies.filter((a) => a.replyType === filter)
  const countOf = (f) => (f === 'all' ? replies.length : replies.filter((a) => a.replyType === f).length)
  const reached = view.activity.filter((a) => a.sends.length > 0).length

  if (replies.length === 0) {
    return <EmptyNote>{reached === 0 ? COPY.nothingSent : COPY.none(reached)}</EmptyNote>
  }

  return (
    <div className="lp-stack">
      <div role="group" aria-label={COPY.filterLabel} className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <FilterPill
            key={f}
            active={filter === f}
            count={countOf(f)}
            onClick={() => setFilter(f === filter ? 'all' : f)}
          >
            {COPY.filters[f]}
          </FilterPill>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyNote>{filter === 'unclear' ? COPY.noneToReview : COPY.noneOfKind(COPY.filters[filter])}</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line">
          <ul className="min-w-[860px] divide-y divide-line">
            {shown.map((a) => (
              <li key={a.id} className={cx(ROW, 'bg-surface px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]')}>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-name text-txt">{a.contactName}</p>
                  <p className="mt-1 truncate text-2xs text-txt-2">{a.companyName}</p>
                </div>

                <div className="min-w-0 leading-tight">
                  <p className="text-2xs text-txt-3">
                    <StepLink onOpen={() => onViewStep(a.replyStepIndex)}>
                      {COPY.after(a.replyStepIndex + 1, stepName(view.sequence[a.replyStepIndex]))}
                    </StepLink>
                  </p>
                  <p className="mt-1 truncate text-sm text-txt" title={a.replySnippet}>
                    “{a.replySnippet}”
                  </p>
                  {a.replyType === 'unclear' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {MARKS.map((type) => (
                        <Button key={type} size="sm" onClick={() => onClassify(a.id, type)}>
                          {COPY.mark[type]}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <ReplyBadge type={a.replyType} />
                </div>

                <p className="text-sm whitespace-nowrap text-txt-2">{shortAt(a.replyReceivedAt)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
