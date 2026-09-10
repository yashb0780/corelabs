/**
 * The tooltip and legend every chart shares. The hooks and the bar shape
 * they draw with are in chartParts.js.
 *
 * Tooltip values lead and labels follow, because on hover the reader
 * already knows the series and wants the number. Text stays in text
 * colours; only the small key beside it carries the series colour.
 */
import { cx } from '../cx'

function Key({ color, dashed }) {
  return (
    <svg width="12" height="8" aria-hidden="true" className="shrink-0">
      <line
        x1="0"
        y1="4"
        x2="12"
        y2="4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={dashed ? '3 3' : undefined}
      />
    </svg>
  )
}

export function Tooltip({ tip }) {
  if (!tip) return null
  const { x, y, content, boxW } = tip
  // Sit to the right of the pointer, or flip left near the right edge.
  const flip = x > boxW - 200

  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-10 min-w-36 rounded-md border border-line-strong bg-surface px-2.5 py-2"
      style={{
        left: flip ? undefined : x + 14,
        right: flip ? boxW - x + 14 : undefined,
        top: Math.max(0, y - 12),
      }}
    >
      {content.title && (
        <p className="mb-1 text-2xs text-txt-3">{content.title}</p>
      )}
      <div className="space-y-1">
        {content.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            {row.color && <Key color={row.color} dashed={row.dashed} />}
            <span className="text-sm font-num tabular-nums text-txt">
              {row.value}
            </span>
            <span className="truncate text-2xs text-txt-3">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Legend for charts with more than one series. Text stays in text colours. */
export function Legend({ items, className }) {
  return (
    <ul className={cx('flex flex-wrap items-center gap-x-4 gap-y-1', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-2xs text-txt-2">
          {item.shape === 'line' ? (
            <Key color={item.color} dashed={item.dashed} />
          ) : (
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span>{item.label}</span>
          {item.value && (
            <span className="font-num tabular-nums text-txt">{item.value}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
