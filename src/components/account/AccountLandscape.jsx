/**
 * ACCOUNT PAGE, main column, section 4: ERP LANDSCAPE VERDICT.
 *
 * The most important section on the page. It has to read as a conclusion
 * drawn from several sources, not as a list of technologies, so the verdict
 * sits at the top and the four evidence rows that produced it sit underneath,
 * tied together by a "sources agree" marker and a connector line.
 *
 * One file per section. To change this section, this is the only file to open.
 */
import { PROVENANCE, STACK_LAYERS } from '../../data/companies'
import { EMPTY_STATES } from '../../data/emptyStates'
import { Icon } from '../Icon'
import { Chip, EmptyNote, SectionCard } from '../ui'

/**
 * The dot in front of a stack chip.
 * Filled = observed, half filled = inferred from a posting, hollow =
 * inferred from a new hire's background.
 */
function ProvenanceDot({ kind }) {
  return (
    <svg
      viewBox="0 0 8 8"
      className="size-2 shrink-0 text-txt-3"
      aria-hidden="true"
    >
      <circle
        cx="4"
        cy="4"
        r="3"
        fill={kind === 'observed' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.25"
      />
      {kind === 'posting' && (
        <path d="M4 1a3 3 0 0 1 0 6z" fill="currentColor" stroke="none" />
      )}
    </svg>
  )
}

function StackGroup({ layer, chips }) {
  if (chips.length === 0) return null
  return (
    <div>
      <p className="lp-label">{layer}</p>
      <div className="mt-[var(--lp-label-gap)] flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span
            key={c.name}
            title={c.source}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-0.5 text-2xs font-name text-txt-2"
          >
            <ProvenanceDot kind={c.provenance} />
            {c.name}
          </span>
        ))}
      </div>
    </div>
  )
}

function EvidenceRow({ row }) {
  return (
    <li className="grid gap-1.5 py-2.5 sm:grid-cols-[132px_1fr_minmax(0,32%)] sm:gap-4">
      <p className="lp-label pt-px">{row.source}</p>
      <p className="text-sm text-txt-2">{row.observed}</p>
      <p className="flex gap-1.5 text-sm text-txt-3">
        <Icon name="arrowRight" className="mt-1 size-3 shrink-0" />
        <span>{row.implies}</span>
      </p>
    </li>
  )
}

export function AccountLandscape({ company }) {
  const { landscape } = company
  const stack = landscape?.stack ?? []
  const evidence = landscape?.evidence ?? []

  return (
    <SectionCard
      icon="layers"
      label="ERP landscape verdict"
      aside={<Chip>{landscape?.state ?? 'Unknown'}</Chip>}
    >
      {/* a) The verdict */}
      {landscape?.verdict ? (
        <div className="border-l-2 border-accent pl-3">
          <p className="text-sm text-txt">{landscape.verdict}</p>
          {evidence.length > 0 && (
            <p className="mt-1.5 flex items-center gap-1.5 text-2xs font-name text-accent">
              <Icon name="check" className="size-3" />
              {evidence.length} sources agree
            </p>
          )}
        </div>
      ) : (
        <EmptyNote>{EMPTY_STATES.landscape}</EmptyNote>
      )}

      {/* b) The stack, grouped by layer */}
      {stack.length > 0 && (
        <div className="mt-3.5 space-y-2.5 border-t border-line pt-3">
          {STACK_LAYERS.map((layer) => (
            <StackGroup
              key={layer}
              layer={layer}
              chips={stack.filter((s) => s.layer === layer)}
            />
          ))}

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-2xs text-txt-3">
            {Object.values(PROVENANCE).map((p) => (
              <span key={p.id} className="flex items-center gap-1.5">
                <ProvenanceDot kind={p.id} />
                {p.label}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* c) How we got here */}
      {evidence.length > 0 && (
        <div className="mt-3.5 border-t border-line pt-3">
          <p className="lp-label">How we got here</p>
          <ul className="mt-[var(--lp-label-gap)] divide-y divide-line border-l border-line pl-3">
            {evidence.map((row) => (
              <EvidenceRow key={row.source} row={row} />
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  )
}
