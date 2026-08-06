/**
 * ACCOUNT PAGE, main column, section 5: SIGNAL MOMENTUM.
 *
 * Term counts across three windows (90d, 60d, 30d) with a sparkline.
 * One file per section. To change this section, this is the only file to open.
 */
import { EMPTY_STATES } from '../../data/emptyStates'
import { Icon } from '../Icon'
import { Chip, EmptyNote, SectionCard } from '../ui'

/** A flat little line chart. No axes, no labels: it is a shape, not a chart. */
function Sparkline({ counts }) {
  const max = Math.max(...counts, 1)
  const points = counts
    .map((n, i) => {
      const x = (i / (counts.length - 1)) * 56
      const y = 16 - (n / max) * 14
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      viewBox="0 0 56 18"
      className="h-4 w-14 shrink-0 text-accent"
      fill="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MomentumRow({ row }) {
  const last = row.counts.length - 1

  return (
    <li className="flex items-center gap-3 py-1.5">
      <span className="w-28 shrink-0 truncate text-sm font-name text-txt">
        {row.term}
      </span>

      <span className="flex flex-1 items-center gap-1.5">
        {row.counts.map((n, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <Icon name="arrowRight" className="size-3 shrink-0 text-txt-3" />
            )}
            <span
              className={
                i === last
                  ? 'text-sm font-num tabular-nums text-accent'
                  : 'text-sm tabular-nums text-txt-3'
              }
            >
              {n}
            </span>
          </span>
        ))}
      </span>

      <Sparkline counts={row.counts} />
    </li>
  )
}

export function AccountMomentum({ company }) {
  const rows = company.momentum ?? []
  const trendingUp = rows.some((r) => r.counts[r.counts.length - 1] > r.counts[0])

  return (
    <SectionCard
      icon="activity"
      label="Signal momentum"
      aside={
        rows.length > 0 && trendingUp ? (
          <Chip>
            <Icon name="trendingUp" className="size-3 text-accent" />
            Trending up
          </Chip>
        ) : null
      }
    >
      {rows.length === 0 ? (
        <EmptyNote>{EMPTY_STATES.momentum}</EmptyNote>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <MomentumRow key={r.term} row={r} />
            ))}
          </ul>
          <p className="mt-2 text-2xs text-txt-3">
            Counts of each term across this company&rsquo;s public job postings,
            by window (90d, 60d, 30d). Not third-party intent data.
          </p>
        </>
      )}
    </SectionCard>
  )
}
