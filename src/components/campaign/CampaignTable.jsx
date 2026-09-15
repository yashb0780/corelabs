/**
 * The campaign table on the Campaigns screen.
 *
 * Columns, in order:
 *   Campaign | Status | Accounts / Contacts | Last activity | Last step sent |
 *   Next send | Replies | menu
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
 * Eight columns share about 1,150px on a laptop, so the widths are fixed
 * below and the campaign name takes what is left. Dates put their time on
 * a second, muted line: a row is two lines tall anyway, and a date on one
 * line would take the room the name needs.
 */
import { Link, useNavigate } from 'react-router-dom'
import { cx } from '../cx'
import { RowMenu } from '../overlay'
import { TonePill } from '../ui'
import { CAMPAIGN_SCREEN_COPY as COPY, CAMPAIGN_STATUSES } from '../../data/campaigns'
import { formatShortDate, formatTime, splitAt } from '../../lib/schedule'

const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]'
const TH = `lp-label ${CELL_PAD} text-left align-bottom`
const TD = `${CELL_PAD} align-top`

// Every column but the name, in order. The name takes the rest.
const WIDTHS = ['w-[6.75rem]', 'w-[6.5rem]', 'w-[10rem]', 'w-[11rem]', 'w-[7rem]', 'w-[12.25rem]', 'w-[3.25rem]']

// The reply kinds in the order the breakdown lists them.
const REPLY_ORDER = ['interested', 'ooo', 'not_interested', 'unclear']

const None = () => <span className="text-sm text-txt-3">{COPY.none}</span>

/* The main line of a cell, and an optional muted line under it. */
function Stacked({ main, sub, mainClass = 'text-sm text-txt', title }) {
  return (
    <div className="min-w-0 leading-tight" title={title}>
      <p className={cx('truncate', mainClass)}>{main}</p>
      {sub && <p className="mt-1 truncate text-2xs text-txt-3">{sub}</p>}
    </div>
  )
}

/* "Mon 14 Sep" over "9:00 AM". `label` wraps the date, for "Created". */
function When({ at, label = (d) => d }) {
  const { date, time } = splitAt(at)
  return <Stacked main={label(formatShortDate(date))} sub={formatTime(time)} mainClass="text-sm text-txt-2" />
}

export function CampaignTable({ campaigns, onLaunch, onPause, onResume, onDuplicate }) {
  const navigate = useNavigate()
  const open = (id) => navigate(`/campaigns/${id}`)

  const menuFor = (c) => [
    { label: COPY.menu.view, icon: 'arrowRight', onSelect: () => open(c.id) },
    c.status === 'draft' && { label: COPY.menu.launch, icon: 'clock', onSelect: () => onLaunch(c.id) },
    (c.status === 'active' || c.status === 'scheduled') && {
      label: COPY.menu.pause,
      icon: 'pause',
      onSelect: () => onPause(c.id),
    },
    c.status === 'paused' && { label: COPY.menu.resume, icon: 'play', onSelect: () => onResume(c.id) },
    { label: COPY.menu.duplicate, icon: 'copy', onSelect: () => onDuplicate(c.id) },
  ].filter(Boolean)

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[1110px] table-fixed border-collapse">
        <colgroup>
          <col />
          {WIDTHS.map((w, i) => (
            <col key={i} className={w} />
          ))}
        </colgroup>
        <thead className="bg-surface-sunken">
          <tr className="border-b border-line">
            <th scope="col" className={TH}>{COPY.columns.campaign}</th>
            <th scope="col" className={TH}>{COPY.columns.status}</th>
            <th scope="col" className={cx(TH, 'text-right')}>{COPY.columns.size}</th>
            <th scope="col" className={TH}>{COPY.columns.lastActivity}</th>
            <th scope="col" className={TH}>{COPY.columns.lastStep}</th>
            <th scope="col" className={TH}>{COPY.columns.nextSend}</th>
            <th scope="col" className={TH}>{COPY.columns.replies}</th>
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
            const stepLine = last && COPY.lastStep(last.stepIndex + 1, c.sequence.length, last.stepName)
            const toLine = last && COPY.sentTo(last.contactName, last.companyName)
            const breakdown = REPLY_ORDER.filter((k) => stats.replies[k] > 0)
              .map((k) => COPY.replyKinds[k](stats.replies[k]))
              .join(' · ')

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
                      className="block truncate text-sm font-name text-txt hover:underline"
                    >
                      {c.name}
                    </Link>
                    <p className="mt-1 truncate text-2xs text-txt-3" title={c.listName ?? undefined}>
                      {c.listName ?? COPY.fromCompanySearch}
                    </p>
                  </div>
                </td>

                <td className={TD}>
                  <TonePill tone={status.tone} dashed={status.dashed}>
                    {status.label}
                  </TonePill>
                </td>

                <td className={cx(TD, 'text-right text-sm font-num tabular-nums whitespace-nowrap text-txt')}>
                  {stats.accounts.toLocaleString('en-US')}
                  <span className="text-txt-3"> / </span>
                  {stats.contacts.toLocaleString('en-US')}
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
                    <Stacked main={stepLine} sub={toLine} title={`${stepLine} ${toLine}`} />
                  ) : (
                    <None />
                  )}
                </td>

                <td className={TD}>
                  {stats.nextSendAt ? <When at={stats.nextSendAt} /> : <None />}
                </td>

                <td className={TD}>
                  <p className="text-sm font-num tabular-nums text-txt leading-tight">
                    {stats.replies.total.toLocaleString('en-US')}
                  </p>
                  {breakdown && <p className="mt-1 text-2xs text-txt-3 leading-tight">{breakdown}</p>}
                </td>

                <td className={cx(TD, 'py-[calc(var(--lp-row-pad-y)-4px)] text-right')}>
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
