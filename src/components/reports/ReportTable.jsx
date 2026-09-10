/**
 * The table under the chart on a report's detail page: the same numbers the
 * chart draws, so nothing can only be read by hovering. Built by
 * reportTable() in src/lib/reports.js.
 *
 * Styled like the other tables, with padding from the density tokens.
 */
import { cx } from '../cx'
import { formatValue } from '../../lib/charts'
import { reportTable } from '../../lib/reports'

const CELL_PAD = 'px-[var(--lp-row-pad-x)] py-[var(--lp-row-pad-y)]'

export function ReportTable({ report }) {
  const { columns, rows, total } = reportTable(report, (v) =>
    formatValue(v, report.format),
  )

  // The first column is the label; every other column is a number.
  const align = (i) => (i === 0 ? 'text-left' : 'text-right tabular-nums')

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[560px] border-collapse">
        <thead className="bg-surface-sunken">
          <tr className="border-b border-line">
            {columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={cx('lp-label whitespace-nowrap', CELL_PAD, align(i))}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-line bg-surface last:border-b-0">
              {row.map((cell, i) => (
                <td
                  key={columns[i]}
                  className={cx(
                    CELL_PAD,
                    'text-sm',
                    align(i),
                    i === 0 ? 'font-name text-txt' : 'text-txt-2',
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {total && (
          <tfoot>
            <tr className="border-t border-line bg-surface-sunken">
              {total.map((cell, i) => (
                <td
                  key={columns[i]}
                  className={cx(CELL_PAD, 'text-sm font-num text-txt', align(i))}
                >
                  {cell}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
