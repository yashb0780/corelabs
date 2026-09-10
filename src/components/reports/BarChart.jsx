/**
 * Bar chart. Upright columns by default; sideways bars when the report sets
 * `horizontal: true`, which is for long labels such as campaign names.
 *
 * One series, so every bar is the accent and there is no legend: the card
 * title says what is plotted. Values sit on the end of each bar. Hovering a
 * bar dims the others and shows its tooltip.
 */
import { useState } from 'react'
import { Tooltip } from './chartKit'
import { BAR_MAX, barPath, useTooltip, useWidth } from './chartParts'
import { cx } from '../cx'
import { formatTick, formatValue, niceTicks } from '../../lib/charts'

function tipFor(report, bar) {
  return {
    title: report.categoryLabel ? `${report.categoryLabel}: ${bar.label}` : bar.label,
    rows: [{ value: formatValue(bar.value, report.format), label: report.unit }],
  }
}

/* --- Upright columns ----------------------------------------------------- */

function Columns({ report, height }) {
  const [ref, width] = useWidth()
  const { boxRef, tip, show, hide } = useTooltip()
  const [hover, setHover] = useState(null)

  const bars = report.data.bars
  const ticks = niceTicks(Math.max(...bars.map((b) => b.value)))
  const top = ticks[ticks.length - 1]

  const m = { left: 40, right: 8, top: 22, bottom: 26 }
  const plotW = Math.max(0, width - m.left - m.right)
  const plotH = height - m.top - m.bottom
  const band = plotW / bars.length
  const barW = Math.min(BAR_MAX, band * 0.6)
  const y = (v) => m.top + plotH - (v / top) * plotH

  return (
    <div ref={ref} className="w-full">
      <div ref={boxRef} className="relative" onPointerLeave={() => { hide(); setHover(null) }}>
        {width > 0 && (
          <svg width={width} height={height} role="img" aria-label={report.title}>
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={m.left}
                  x2={width - m.right}
                  y1={y(t)}
                  y2={y(t)}
                  stroke={t === 0 ? 'var(--lp-line-strong)' : 'var(--lp-line)'}
                  strokeWidth="1"
                  shapeRendering="crispEdges"
                />
                <text
                  x={m.left - 8}
                  y={y(t)}
                  dy="0.32em"
                  textAnchor="end"
                  className="fill-txt-3 text-2xs tabular-nums"
                >
                  {formatTick(t, report.format)}
                </text>
              </g>
            ))}

            {bars.map((b, i) => {
              const x = m.left + i * band + (band - barW) / 2
              const h = Math.max(0, y(0) - y(b.value))
              const dim = hover !== null && hover !== i
              return (
                <g key={b.label}>
                  <path
                    d={barPath(x, y(b.value), barW, h)}
                    fill="var(--lp-accent)"
                    opacity={dim ? 0.35 : 1}
                    className="transition-opacity duration-150"
                  />
                  <text
                    x={x + barW / 2}
                    y={y(b.value) - 6}
                    textAnchor="middle"
                    className="fill-txt-2 text-2xs tabular-nums"
                  >
                    {formatValue(b.value, report.format)}
                  </text>
                  <text
                    x={m.left + i * band + band / 2}
                    y={height - 8}
                    textAnchor="middle"
                    className="fill-txt-3 text-2xs"
                  >
                    {b.label}
                  </text>
                  {/* The whole column slot is the hover target, not just
                      the painted bar. */}
                  <rect
                    x={m.left + i * band}
                    y={m.top}
                    width={band}
                    height={plotH}
                    fill="transparent"
                    onPointerMove={(e) => {
                      setHover(i)
                      show(e, tipFor(report, b))
                    }}
                  />
                </g>
              )
            })}
          </svg>
        )}
        <Tooltip tip={tip} />
      </div>
    </div>
  )
}

/* --- Sideways bars ------------------------------------------------------- */

function Bars({ report, height }) {
  const { boxRef, tip, show, hide } = useTooltip()
  const [hover, setHover] = useState(null)

  const bars = report.data.bars
  const top = niceTicks(Math.max(...bars.map((b) => b.value))).at(-1)
  // Rows share the height evenly, with the bar capped at 24px.
  const rowH = Math.max(28, Math.floor(height / bars.length))

  return (
    <div
      ref={boxRef}
      className="relative"
      style={{ height }}
      onPointerLeave={() => {
        hide()
        setHover(null)
      }}
    >
      <ul role="img" aria-label={report.title}>
        {bars.map((b, i) => {
          const dim = hover !== null && hover !== i
          return (
            <li
              key={b.label}
              className="flex items-center gap-3"
              style={{ height: rowH }}
              onPointerMove={(e) => {
                setHover(i)
                show(e, tipFor(report, b))
              }}
            >
              <span
                className={cx(
                  'w-2/5 shrink-0 truncate text-right text-2xs transition-colors duration-150',
                  dim ? 'text-txt-3' : 'text-txt-2',
                )}
                title={b.label}
              >
                {b.label}
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-2 border-l border-line-strong">
                <span
                  className="block rounded-r transition-opacity duration-150"
                  style={{
                    width: `${(b.value / top) * 85}%`,
                    height: Math.min(18, rowH - 10),
                    backgroundColor: 'var(--lp-accent)',
                    opacity: dim ? 0.35 : 1,
                  }}
                />
                <span className="shrink-0 text-2xs tabular-nums text-txt-2">
                  {formatValue(b.value, report.format)}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
      <Tooltip tip={tip} />
    </div>
  )
}

export function BarChart({ report, height }) {
  return report.data.horizontal ? (
    <Bars report={report} height={height} />
  ) : (
    <Columns report={report} height={height} />
  )
}
