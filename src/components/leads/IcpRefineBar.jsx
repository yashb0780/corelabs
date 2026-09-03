/**
 * The strip that appears under the filter row once "Refine by ICP" is on.
 *
 * Its whole job is to make the narrowing visible: which filters came off the
 * vendor profile, and how many companies they removed. Refining the view is
 * fine. Refining it silently is not, which is why this is not collapsible
 * and the clear control sits next to the count.
 *
 * It also covers the case where the profile has nothing to filter on yet,
 * rather than letting the button appear to do nothing.
 */
import { Link } from 'react-router-dom'
import { ICP_REFINE_COPY as COPY } from '../../data/vendorProfile'
import { Icon } from '../Icon'

const VENDOR_PROFILE_PATH = '/vendor/vendor-profile'

export function IcpRefineBar({ filters, removedCount, onClear }) {
  /* Nothing in the profile to filter on. Say so, and point at the fix. */
  if (filters.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface px-3.5 py-3">
        <p className="text-sm font-name text-txt">{COPY.nothingTitle}</p>
        <p className="mt-1 text-sm text-txt-2">{COPY.nothingBody}</p>
        <Link
          to={VENDOR_PROFILE_PATH}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-name text-accent hover:text-accent-hover"
        >
          {COPY.nothingLink}
          <Icon name="arrowRight" className="size-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-accent bg-accent-quiet px-3.5 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="lp-label text-accent">{COPY.summary}</p>

          <div className="mt-[var(--lp-label-gap)] flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-txt-2"
              >
                {f.label}
              </span>
            ))}
          </div>

          <p className="mt-2 text-sm text-txt-2">
            {removedCount > 0 ? (
              <>
                <span className="font-num tabular-nums text-txt">
                  {removedCount}
                </span>{' '}
                {removedCount === 1 ? 'company' : 'companies'} removed from
                view
              </>
            ) : (
              COPY.removedNone
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs font-name text-txt-2 transition-colors duration-150 ease-lp hover:border-accent hover:text-accent"
        >
          <Icon name="close" className="size-3" />
          {COPY.clear}
        </button>
      </div>
    </div>
  )
}
