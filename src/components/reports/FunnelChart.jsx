/**
 * Funnel: one column per stage, left to right, with a faint wash joining
 * each column to the next so the drop between stages reads at a glance.
 * Under each stage label is its percentage of the first stage.
 *
 * Hovering a stage shows its count, its share of the first stage, and how
 * many of the previous stage made it through.
 */
import { useState } from 'react'
import { Tooltip } from './chartKit'
import { barPath, useTooltip, useWidth } from './chartParts'
import { cx } from '../cx'
import { formatValue } from '../../lib/charts'
import { REPORTS_COPY as COPY } from '../../data/reports'

const pct = (n) => `${(n * 100).toFixed(1)}%`

export function FunnelChart({ report, height }) {
  const [ref, width] = useWidth()
  const { boxRef, tip, show, hide } = useTooltip()
  const [hover, setHover] = useState(null)

  const stages = report.data.stages
  const first = stages[0].value

  const m = { top: 20, bottom: 2 }
  const plotH = height - m.top - m.bottom
  const band = width / stages.length
  // Wider than a plain bar: a funnel's columns are the whole story.
  const colW = Math.min(48, band * 0.5)
  const y = (v) => m.top + plotH - (v / first) * plotH
  const colX = (i) => i * band + (band - colW) / 2

  const tipFor = (s, i) => ({
    title: s.label,
    rows: [
      { value: formatValue(s.value, report.format), label: report.unit },
      { value: pct(s.value / first), label: COPY.tooltip.ofFirst },
      ...(i > 0
        ? [{ value: pct(s.value / stages[i - 1].value), label: COPY.tooltip.fromPrevious }]
        : []),
    ],
  })

  return (
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
            <line
              x1="0"
              x2={width}
              y1={m.top + plotH}
              y2={m.top + plotH}
              stroke="var(--lp-line-strong)"
              strokeWidth="1"
              shapeRendering="crispEdges"
            />

            {/* The wash from each column's top to the next one's. */}
            {stages.slice(0, -1).map((s, i) => {
              const x0 = colX(i) + colW
              const x1 = colX(i + 1)
              const base = m.top + plotH
              return (
                <path
                  key={`wash-${s.label}`}
                  d={`M${x0},${y(s.value)}L${x1},${y(stages[i + 1].value)}L${x1},${base}L${x0},${base}z`}
                  fill="var(--lp-accent)"
                  fillOpacity="0.07"
                />
              )
            })}

            {stages.map((s, i) => {
              const dim = hover !== null && hover !== i
              return (
                <g key={s.label}>
                  <path
                    d={barPath(colX(i), y(s.value), colW, m.top + plotH - y(s.value))}
                    fill="var(--lp-accent)"
                    opacity={dim ? 0.35 : 1}
                    className="transition-opacity duration-150"
                  />
                  <text
                    x={colX(i) + colW / 2}
                    y={y(s.value) - 6}
                    textAnchor="middle"
                    className="fill-txt-2 text-2xs tabular-nums"
                  >
                    {formatValue(s.value, report.format)}
                  </text>
                  <rect
                    x={i * band}
                    y="0"
                    width={band}
                    height={height}
                    fill="transparent"
                    onPointerMove={(e) => {
                      setHover(i)
                      show(e, tipFor(s, i))
                    }}
                  />
                </g>
              )
            })}
          </svg>
        )}

        {/* Labels are HTML, not SVG, so a long stage name can wrap. */}
        <ol
          className="mt-2 grid"
          style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
        >
          {stages.map((s, i) => (
            <li
              key={s.label}
              className={cx(
                'px-1 text-center leading-tight transition-opacity duration-150',
                hover !== null && hover !== i && 'opacity-50',
              )}
            >
              <span className="block text-2xs text-txt-2">{s.label}</span>
              <span className="mt-0.5 block text-2xs font-num tabular-nums text-txt">
                {pct(s.value / first)}
              </span>
            </li>
          ))}
        </ol>

        <Tooltip tip={tip} />
      </div>
    </div>
  )
}
