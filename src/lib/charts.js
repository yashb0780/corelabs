/**
 * Number helpers shared by every chart. Pure logic, no UI.
 */

/** A report value as text: "4,820" for counts, "14.6%" for rates. */
export function formatValue(value, format) {
  if (format === 'percent') return `${value.toFixed(1)}%`
  return value.toLocaleString('en-US')
}

/**
 * Round axis ticks from 0 up to just past `max`, about four steps: 0 / 200 /
 * 400 / 600 / 800 rather than 0 / 173 / 346. Steps come from 1, 2, 2.5 and 5
 * times a power of ten, which is what reads as "round".
 */
export function niceTicks(max, target = 4) {
  if (max <= 0) return [0, 1]
  const rough = max / target
  const mag = 10 ** Math.floor(Math.log10(rough))
  const norm = rough / mag
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag
  const top = Math.ceil(max / step) * step
  const ticks = []
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Number(v.toFixed(6)))
  return ticks
}

/** Axis tick text: compact, "1.2K" rather than "1,200", and "10%" for rates. */
export function formatTick(value, format) {
  if (format === 'percent') return `${value}%`
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}K`
  return String(value)
}

/** A token name from the data ("chart-1", "other") as a CSS colour. */
export function seriesColor(name) {
  return name === 'other' ? 'var(--lp-chart-other)' : `var(--lp-${name})`
}
