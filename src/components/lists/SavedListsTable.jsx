/**
 * The saved lists table.
 *
 * Columns, in order:
 *   checkbox | List Name | Records | Created By | Assigned To | Last Modified | menu
 *
 * Ticking rows is what brings up the Assign and Share buttons at the top of
 * the page. A click anywhere on a row ticks it too, as in Linear; the
 * checkbox and the row menu handle their own clicks.
 *
 * Row padding comes from the density tokens in src/styles/tokens.css, the
 * same as the leads table.
 */
import { cx } from '../cx'
import { Checkbox } from '../form'
import { RowMenu } from '../overlay'
import { Avatar } from '../ui'
import {
  SAVED_LISTS_COPY as COPY,
  formatListDate,
  formatRecords,
} from '../../data/savedLists'
import { getTeammate } from '../../data/teammates'

const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]'
const TH = `lp-label ${CELL_PAD} text-left whitespace-nowrap`
const TD = `${CELL_PAD} align-middle`

function PersonCell({ id }) {
  const person = id ? getTeammate(id) : null

  return (
    <div className="flex items-center gap-2">
      <Avatar person={person} />
      {person ? (
        <span className="truncate text-sm text-txt">{person.name}</span>
      ) : (
        <span className="text-sm text-txt-3">{COPY.unassigned}</span>
      )}
    </div>
  )
}

export function SavedListsTable({ lists, selected, onSelectedChange, onAssign, onShare }) {
  const allOn = lists.length > 0 && lists.every((l) => selected.has(l.id))
  const someOn = !allOn && lists.some((l) => selected.has(l.id))

  // Works from the latest selection rather than the one this render saw, so
  // two quick clicks never lose one.
  const toggle = (id) =>
    onSelectedChange((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAll = () =>
    onSelectedChange(allOn ? new Set() : new Set(lists.map((l) => l.id)))

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[900px] border-collapse">
        <thead className="bg-surface-sunken">
          <tr className="border-b border-line">
            <th scope="col" className={cx(CELL_PAD, 'w-10 pr-0')}>
              <span className="flex items-center">
                <Checkbox
                  checked={allOn}
                  indeterminate={someOn}
                  onChange={toggleAll}
                  label={COPY.selectAll}
                />
              </span>
            </th>
            <th scope="col" className={TH}>{COPY.columns.name}</th>
            <th scope="col" className={cx(TH, 'text-right')}>
              {COPY.columns.records}
            </th>
            <th scope="col" className={TH}>{COPY.columns.createdBy}</th>
            <th scope="col" className={TH}>{COPY.columns.assignedTo}</th>
            <th scope="col" className={TH}>{COPY.columns.lastModified}</th>
            <th scope="col" className={cx(CELL_PAD, 'w-12')}>
              <span className="sr-only">{COPY.columns.actions}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {lists.map((list) => {
            const on = selected.has(list.id)

            return (
              <tr
                key={list.id}
                onClick={() => toggle(list.id)}
                aria-selected={on}
                className={cx(
                  'cursor-pointer border-b border-line transition-colors duration-150 ease-lp last:border-b-0',
                  on ? 'bg-accent-quiet' : 'bg-surface hover:bg-surface-hover',
                )}
              >
                <td
                  className={cx(TD, 'pr-0')}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="flex items-center">
                    <Checkbox
                      checked={on}
                      onChange={() => toggle(list.id)}
                      label={COPY.selectRow(list.name)}
                    />
                  </span>
                </td>
                <td className={cx(TD, 'w-[34%]')}>
                  <p className="truncate text-sm font-name text-txt">
                    {list.name}
                  </p>
                </td>
                <td
                  className={cx(
                    TD,
                    'text-right text-sm font-num tabular-nums text-txt',
                  )}
                >
                  {formatRecords(list.records)}
                </td>
                <td className={TD}>
                  <PersonCell id={list.createdBy} />
                </td>
                <td className={TD}>
                  <PersonCell id={list.assignedTo} />
                </td>
                <td className={cx(TD, 'text-sm whitespace-nowrap text-txt-2')}>
                  {formatListDate(list.lastModified)}
                </td>
                <td className={cx(TD, 'py-0 text-right')}>
                  <RowMenu
                    label={COPY.rowMenu(list.name)}
                    items={[
                      {
                        label: COPY.assignTo,
                        icon: 'userPlus',
                        onSelect: () => onAssign([list.id]),
                      },
                      {
                        label: COPY.share,
                        icon: 'share',
                        onSelect: () => onShare([list.id]),
                      },
                    ]}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
