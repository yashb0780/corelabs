/**
 * The campaign table on the Campaigns screen.
 *
 * Columns, in order:
 *   Campaign | Status | Accounts | Last activity | Last step sent |
 *   Next send | Replies | menu
 * Contacts are not shown here; they are on the campaign's own page.
 *
 * Built on the Saved lists table: the same row padding from the density
 * tokens, the same header style and the same row menu. There are no tick
 * boxes, because there is no bulk action. A click anywhere on a row opens
 * that campaign.
 *
 * It is handed campaigns as campaignView() in src/lib/campaignActivity.js
 * sees them, already searched, filtered and sorted. Every figure in a row is
 * worked out there; this file only lays them out.
 *
 * Kept short on purpose, at the owner's request: dates without a time, and
 * the last step as "Step 2 of 4" only. The step's name, when it went, and
 * who it went to are on each contact's row on the campaign's own page. The
 * widths are fixed below and the campaign name takes everything left.
 *
 * Compact, also at the owner's request: 15px row text, 14px for the grey
 * line under each name and for the column headers, the compact status
 * pill, and less padding than other tables (--lp-compact-row-pad-y). The
 * reply total opens its breakdown with the same chevron disclosure as the
 * company rows on a campaign's page.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { RowMenu } from '../overlay'
import { TonePill } from '../ui'
import { actionsFor } from './useCampaignActions'
import { CAMPAIGN_SCREEN_COPY as COPY, CAMPAIGN_STATUSES } from '../../data/campaigns'
import { formatShortDate, splitAt } from '../../lib/schedule'

const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-compact-row-pad-y)]'
// A column header, aligned like the values under it.
const th = (align = 'text-left') => cx('lp-label lp-label-lg align-bottom', CELL_PAD, align)
const TD = `${CELL_PAD} align-top`

// Every column but the name, in order, as wide as its values. The name
// takes the rest. At 14px the longer headers (Last activity, Last step
// sent) wrap onto two lines rather than take width the campaign names
// need; a "Created Mon 14 Sep" date wraps the same way.
const WIDTHS = ['w-[7rem]', 'w-[7rem]', 'w-[7.5rem]', 'w-[7.5rem]', 'w-[7rem]', 'w-[9.5rem]', 'w-[3rem]']

// The reply kinds in the order the breakdown lists them.
const REPLY_ORDER = ['interested', 'ooo', 'not_interested', 'unclear']

const None = () => <span className="text-sm text-txt-3">{COPY.none}</span>

/* "Mon 14 Sep". `label` wraps the date, for "Created Mon 14 Sep". The
   date's own spaces do not break, so a date too wide for its column wraps
   as "Created" over "Mon 14 Sep", never mid-date. */
function When({ at, label = (d) => d }) {
  const date = formatShortDate(splitAt(at).date).replace(/ /g, '\u00a0')
  return <span className="block text-sm/tight text-txt-2">{label(date)}</span>
}

/* The reply total, centred in its column, and a chevron beside it that
   opens its breakdown underneath, one kind per line. The same disclosure
   as a company row on a campaign's page. A campaign with no replies shows
   only the 0. */
function RepliesCell({ campaign, open, onToggle }) {
  const { replies } = campaign.stats
  const kinds = REPLY_ORDER.filter((k) => replies[k] > 0)
  const total = (
    <span className="text-sm font-num tabular-nums text-txt">{replies.total.toLocaleString('en-US')}</span>
  )
  if (kinds.length === 0) return <p className="text-center leading-tight">{total}</p>

  const id = `replies-${campaign.id}`
  return (
    <div className="text-center leading-tight">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={COPY.repliesToggle(replies.total, campaign.name)}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className="-mx-1 inline-flex items-center gap-1 rounded px-1 text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-sunken hover:text-txt"
      >
        {total}
        <Icon
          name="chevronRight"
          className={cx('size-3 transition-transform duration-150 ease-lp', open && 'rotate-90')}
        />
      </button>
      {/* Its own clicks, so reading it never opens the campaign. */}
      <ul id={id} hidden={!open} onClick={(e) => e.stopPropagation()} className="mt-1 space-y-0.5 text-xs text-txt-3">
        {kinds.map((k) => (
          <li key={k}>{COPY.replyKinds[k](replies[k])}</li>
        ))}
      </ul>
    </div>
  )
}

export function CampaignTable({ campaigns, onLaunch, onPause, onResume, onDuplicate }) {
  const navigate = useNavigate()
  const open = (id) => navigate(`/campaigns/${id}`)
  // Which campaigns have their reply breakdown open.
  const [openReplies, setOpenReplies] = useState(() => new Set())
  const toggleReplies = (id) =>
    setOpenReplies((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const menuFor = (c) => {
    const can = actionsFor(c.status)
    return [
      { label: COPY.menu.view, icon: 'arrowRight', onSelect: () => open(c.id) },
      can.launch && { label: COPY.menu.launch, icon: 'clock', onSelect: () => onLaunch(c.id) },
      can.pause && { label: COPY.menu.pause, icon: 'pause', onSelect: () => onPause(c.id) },
      can.resume && { label: COPY.menu.resume, icon: 'play', onSelect: () => onResume(c.id) },
      { label: COPY.menu.duplicate, icon: 'copy', onSelect: () => onDuplicate(c.id) },
    ].filter(Boolean)
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[960px] table-fixed border-collapse">
        <colgroup>
          <col />
          {WIDTHS.map((w, i) => (
            <col key={i} className={w} />
          ))}
        </colgroup>
        <thead className="bg-surface-sunken">
          <tr className="border-b border-line">
            <th scope="col" className={th()}>{COPY.columns.campaign}</th>
            <th scope="col" className={th()}>{COPY.columns.status}</th>
            <th scope="col" className={th('text-right')}>{COPY.columns.accounts}</th>
            <th scope="col" className={th()}>{COPY.columns.lastActivity}</th>
            <th scope="col" className={th()}>{COPY.columns.lastStep}</th>
            <th scope="col" className={th()}>{COPY.columns.nextSend}</th>
            <th scope="col" className={th('text-center')}>{COPY.columns.replies}</th>
            <th scope="col" className={CELL_PAD}>
              <span className="sr-only">{COPY.columns.actions}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((c) => {
            const { stats } = c
            const status = CAMPAIGN_STATUSES[c.status]
            const last = stats.lastSend

            return (
              <tr
                key={c.id}
                onClick={() => open(c.id)}
                className="cursor-pointer border-b border-line bg-surface transition-colors duration-150 ease-lp last:border-b-0 hover:bg-surface-hover"
              >
                <td className={TD}>
                  <div className="min-w-0 leading-tight">
                    {/* A real link, so the row can be reached and opened
                        from the keyboard. */}
                    <Link
                      to={`/campaigns/${c.id}`}
                      onClick={(e) => e.stopPropagation()}
                      title={c.name}
                      className="block truncate text-sm/tight font-name text-txt hover:underline"
                    >
                      {c.name}
                    </Link>
                    <p className="mt-0.5 truncate text-xs/tight text-txt-3" title={c.listName ?? undefined}>
                      {c.listName ?? COPY.fromCompanySearch}
                    </p>
                  </div>
                </td>

                <td className={TD}>
                  <TonePill tone={status.tone} dashed={status.dashed} size="compact">
                    {status.label}
                  </TonePill>
                </td>

                <td className={cx(TD, 'text-right text-sm font-num tabular-nums whitespace-nowrap text-txt')}>
                  {stats.accounts.toLocaleString('en-US')}
                </td>

                <td className={TD}>
                  {stats.lastActivityAt ? (
                    <When at={stats.lastActivityAt} />
                  ) : (
                    <When at={c.createdAt} label={COPY.created} />
                  )}
                </td>

                <td className={TD}>
                  {last ? (
                    <span className="block truncate text-sm text-txt">
                      {COPY.stepOf(last.stepIndex + 1, c.sequence.length)}
                    </span>
                  ) : (
                    <None />
                  )}
                </td>

                <td className={TD}>
                  {stats.nextSendAt ? <When at={stats.nextSendAt} /> : <None />}
                </td>

                <td className={TD}>
                  <RepliesCell campaign={c} open={openReplies.has(c.id)} onToggle={() => toggleReplies(c.id)} />
                </td>

                <td className={cx(TD, 'py-[calc(var(--lp-compact-row-pad-y)-4px)] text-right')}>
                  <RowMenu label={COPY.menu.label(c.name)} items={menuFor(c)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
