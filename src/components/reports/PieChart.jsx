/**
 * Pie chart, with a legend beside it that lists every slice's share.
 *
 * The legend carries the numbers as well as the names, because two of the
 * chart colours are too light on white to be read as colour alone. Slices
 * are separated by a 2px gap in the surface colour rather than an outline.
 * Hovering a slice, or its legend row, dims the rest and shows its tooltip.
 */
import { useState } from 'react'
import { Tooltip } from './chartKit'
import { useTooltip } from './chartParts'
import { cx } from '../cx'
import { formatValue, seriesColor } from '../../lib/charts'
import { REPORTS_COPY as COPY } from '../../data/reports'

function slicePath(cx0, cy0, r, a0, a1) {
  // A whole circle cannot be drawn as one arc, so a single slice is a circle.
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    return `M${cx0 - r},${cy0}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0z`
  }
  const p = (a) => [cx0 + r * Math.cos(a), cy0 + r * Math.sin(a)]
  const [x0, y0] = p(a0)
  const [x1, y1] = p(a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${cx0},${cy0}L${x0},${y0}A${r},${r} 0 ${large} 1 ${x1},${y1}z`
}

export function PieChart({ report, height }) {
  const { boxRef, tip, show, hide } = useTooltip()
  const [hover, setHover] = useState(null)

  const slices = report.data.slices
  const total = slices.reduce((acc, s) => acc + s.value, 0)
  const share = (v) => `${((v / total) * 100).toFixed(1)}%`

  const size = Math.min(height, 260)
  const r = size / 2 - 2
  let angle = -Math.PI / 2 // start at twelve o'clock, go clockwise

  const arcs = slices.map((s) => {
    const a0 = angle
    angle += (s.value / total) * Math.PI * 2
    return { ...s, a0, a1: angle }
  })

  const tipFor = (s) => ({
    title: s.label,
    rows: [
      { value: formatValue(s.value, report.format), label: report.unit },
      { value: share(s.value), label: COPY.tooltip.ofTotal },
    ],
  })

  const enter = (e, i) => {
    setHover(i)
    show(e, tipFor(slices[i]))
  }

  return (
    <div
      ref={boxRef}
      className="relative flex flex-wrap items-center gap-x-8 gap-y-4"
      style={{ minHeight: height }}
      onPointerLeave={() => {
        hide()
        setHover(null)
      }}
    >
      <svg width={size} height={size} role="img" aria-label={report.title} className="shrink-0">
        {arcs.map((s, i) => (
          <path
            key={s.label}
            d={slicePath(size / 2, size / 2, r, s.a0, s.a1)}
            fill={seriesColor(s.color)}
            stroke="var(--lp-surface)"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity={hover !== null && hover !== i ? 0.35 : 1}
            className="transition-opacity duration-150"
            onPointerMove={(e) => enter(e, i)}
          />
        ))}
      </svg>

      <ul className="min-w-0 flex-1 space-y-1.5">
        {slices.map((s, i) => (
          <li
            key={s.label}
            onPointerMove={(e) => enter(e, i)}
            className={cx(
              'flex items-center gap-2 text-sm transition-opacity duration-150',
              hover !== null && hover !== i && 'opacity-50',
            )}
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: seriesColor(s.color) }}
            />
            <span className="min-w-0 flex-1 truncate text-txt-2">{s.label}</span>
            <span className="shrink-0 font-num tabular-nums text-txt">
              {share(s.value)}
            </span>
          </li>
        ))}
      </ul>

      <Tooltip tip={tip} />
    </div>
  )
}
