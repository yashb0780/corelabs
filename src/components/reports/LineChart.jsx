/**
 * Line chart, one line per series, one point per period.
 *
 * Hovering anywhere over the plot snaps a thin vertical line to the nearest
 * period and lists every series' value there, so you never have to land on
 * a 2px line to read it. A legend always names the series, so identity is
 * never carried by colour alone. A series marked `dashed` (Unknown) draws
 * dashed and grey, matching how the product shows "we could not tell"
 * everywhere else.
 */
import { useState } from 'react'
import { Legend, Tooltip } from './chartKit'
import { useTooltip, useWidth } from './chartParts'
import { formatTick, formatValue, niceTicks, seriesColor } from '../../lib/charts'

export function LineChart({ report, height }) {
  const [ref, width] = useWidth()
  const { boxRef, tip, show, hide } = useTooltip()
  const [hover, setHover] = useState(null)

  const { periods, series } = report.data
  const max = Math.max(...series.flatMap((s) => s.values))
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1]

  const m = { left: 40, right: 16, top: 10, bottom: 26 }
  const plotW = Math.max(0, width - m.left - m.right)
  const plotH = height - m.top - m.bottom
  const step = periods.length > 1 ? plotW / (periods.length - 1) : 0
  const x = (i) => m.left + i * step
  const y = (v) => m.top + plotH - (v / top) * plotH
  // On a narrow chart, label every other period so the labels never touch.
  const every = plotW / periods.length < 56 ? 2 : 1

  const onMove = (e) => {
    const box = boxRef.current.getBoundingClientRect()
    const px = e.clientX - box.left
    const i = Math.max(0, Math.min(periods.length - 1, Math.round((px - m.left) / step)))
    setHover(i)
    show(e, {
      title: periods[i],
      rows: series.map((s) => ({
        value: formatValue(s.values[i], report.format),
        label: s.label,
        color: seriesColor(s.color),
        dashed: s.dashed,
      })),
    })
  }

  return (
    <div className="space-y-2">
      {series.length > 1 && (
        <Legend
          items={series.map((s) => ({
            label: s.label,
            color: seriesColor(s.color),
            dashed: s.dashed,
            shape: 'line',
          }))}
        />
      )}
      <div ref={ref} className="w-full">
        <div
          ref={boxRef}
          className="relative"
          onPointerLeave={() => {
            hide()
            setHover(null)
          }}
        >
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

              {periods.map((p, i) =>
                i % every === 0 || i === periods.length - 1 ? (
                  <text
                    key={p}
                    x={x(i)}
                    y={height - 8}
                    textAnchor={i === 0 ? 'start' : i === periods.length - 1 ? 'end' : 'middle'}
                    className="fill-txt-3 text-2xs"
                  >
                    {p}
                  </text>
                ) : null,
              )}

              {hover !== null && (
                <line
                  x1={x(hover)}
                  x2={x(hover)}
                  y1={m.top}
                  y2={m.top + plotH}
                  stroke="var(--lp-line-strong)"
                  strokeWidth="1"
                  shapeRendering="crispEdges"
                />
              )}

              {series.map((s) => (
                <path
                  key={s.label}
                  d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('')}
                  fill="none"
                  stroke={seriesColor(s.color)}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={s.dashed ? '5 4' : undefined}
                />
              ))}

              {hover !== null &&
                series.map((s) => (
                  <circle
                    key={s.label}
                    cx={x(hover)}
                    cy={y(s.values[hover])}
                    r="4"
                    fill={seriesColor(s.color)}
                    stroke="var(--lp-surface)"
                    strokeWidth="2"
                  />
                ))}

              {/* One transparent layer catches the pointer anywhere on the
                  plot, so the reader aims at a period, not at a line. */}
              <rect
                x={m.left - step / 2}
                y={m.top}
                width={plotW + step}
                height={plotH}
                fill="transparent"
                onPointerMove={onMove}
              />
            </svg>
          )}
          <Tooltip tip={tip} />
        </div>
      </div>
    </div>
  )
}
