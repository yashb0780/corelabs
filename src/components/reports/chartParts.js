/**
 * Pieces every chart shares: measuring its width, the hover tooltip, and
 * the bar shape.
 *
 * The charts are plain SVG drawn at the size they are shown, so text stays
 * the same size on a card and on a full-width detail page instead of
 * scaling with the picture. Colours come from tokens.css through CSS
 * variables, never hex.
 *
 * Mark rules, the same on every chart: bars at most 24px thick with a 4px
 * rounded end and a square base, 2px lines, gridlines as solid 1px
 * hairlines, and a 2px gap in the surface colour between touching marks.
 */
import { useLayoutEffect, useRef, useState } from 'react'

export const BAR_MAX = 24
export const BAR_RADIUS = 4

/** The rendered width of an element, kept up to date as it resizes. */
export function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, width]
}

/**
 * A bar with a rounded end and a square base. `horizontal` bars grow right
 * from x; vertical ones grow up from the baseline at y + h.
 */
export function barPath(x, y, w, h, horizontal = false) {
  if (horizontal) {
    const r = Math.min(BAR_RADIUS, w, h / 2)
    return `M${x},${y}h${w - r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${-(w - r)}z`
  }
  const r = Math.min(BAR_RADIUS, h, w / 2)
  return `M${x},${y + h}v${-(h - r)}a${r},${r} 0 0 1 ${r},${-r}h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${h - r}z`
}

/**
 * The chart box plus its tooltip. Charts call `show(event, content)` on
 * hover and `hide()` on leave. `content` is { title, rows }, each row
 * { value, label, color, dashed }. The value leads and the label follows,
 * because on hover the reader already knows the series and wants the
 * number.
 */
export function useTooltip() {
  const boxRef = useRef(null)
  const [tip, setTip] = useState(null)

  const show = (e, content) => {
    const box = boxRef.current.getBoundingClientRect()
    setTip({ x: e.clientX - box.left, y: e.clientY - box.top, content, boxW: box.width })
  }
  const hide = () => setTip(null)

  return { boxRef, tip, show, hide }
}
