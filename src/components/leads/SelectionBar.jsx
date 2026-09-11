/**
 * The bar that floats at the bottom centre of Company Search while any
 * accounts are ticked, after Attio's: how many are selected, Clear, then
 * the three campaign action pills.
 *
 * It is positioned against the page frame (PageShell), not the scrolling
 * content, so it stays put while the table scrolls under it. Flat like
 * the rest of the product: a strong border lifts it, not a shadow.
 */
import { ActionPills } from '../campaign/ActionPills'
import { Button } from '../ui'
import { CAMPAIGN_COPY as COPY } from '../../data/campaigns'

export function SelectionBar({ count, onClear, onAction }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div
        role="toolbar"
        aria-label={COPY.barLabel}
        className="pointer-events-auto flex max-w-full flex-wrap items-center gap-2 rounded-xl border border-line-strong bg-surface py-1.5 pr-2 pl-3.5"
      >
        <span className="text-sm font-num tabular-nums text-txt whitespace-nowrap">
          {COPY.selectedCount(count)}
        </span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          {COPY.clear}
        </Button>
        <span aria-hidden="true" className="h-5 w-px bg-line" />
        <ActionPills actions={['campaign', 'save', 'enrich']} onPick={onAction} />
      </div>
    </div>
  )
}
