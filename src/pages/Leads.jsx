/**
 * SCREEN 1 - Company Search (the leads list).
 *
 * Opens on the full unfiltered set on purpose. We do not narrow the view
 * from the vendor profile automatically: that would quietly hide accounts
 * the user might want, with no way for them to know what was taken out.
 * Narrowing is something they choose, through "Refine by ICP", and when they
 * do the strip under the filter row says exactly what was applied and how
 * many companies it removed.
 *
 * Ticking accounts brings up a bar at the bottom of the page with the
 * campaign actions: Start a campaign, Save as a list, Enrich contacts. They
 * act only on ticked accounts that are still in view, so a refinement that
 * hides some never leaves them silently in scope.
 *
 * The pieces this page uses:
 *   src/components/leads/FilterBar.jsx         the filter row
 *   src/components/leads/IcpRefineBar.jsx      what the refinement did
 *   src/components/leads/LeadsTable.jsx        the table
 *   src/components/leads/SelectionBar.jsx      the bar for ticked accounts
 *   src/components/campaign/useListActions.jsx what the action pills do
 *   src/lib/icp.js                             profile to filters, and applying them
 */
import { useEffect, useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { FilterBar } from '../components/leads/FilterBar'
import { IcpRefineBar } from '../components/leads/IcpRefineBar'
import { LeadsTable } from '../components/leads/LeadsTable'
import { SelectionBar } from '../components/leads/SelectionBar'
import { useListActions } from '../components/campaign/useListActions'
import { Button } from '../components/ui'
import { companies, DEFAULT_ARCHETYPE } from '../data/companies'
import { ICP_REFINE_COPY as COPY } from '../data/vendorProfile'
import { applyIcpFilters, deriveIcpFilters } from '../lib/icp'
import { setLeadsInView } from '../lib/leadsView'
import { scopeForCompanies } from '../lib/listActions'
import { useVendorProfile } from '../lib/profile'

export default function Leads() {
  const [activeSegment, setActiveSegment] = useState(null)
  const [archetype, setArchetype] = useState(DEFAULT_ARCHETYPE)
  const [refined, setRefined] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const actions = useListActions()

  const profile = useVendorProfile()
  const icpFilters = useMemo(() => deriveIcpFilters(profile), [profile])

  // Segment pills narrow first, then the ICP refinement runs on what is left,
  // so the removed count always describes this view rather than the whole set.
  const inSegment = activeSegment
    ? companies.filter((c) => c.segments.includes(activeSegment))
    : companies

  const { kept, removed } = refined
    ? applyIcpFilters(inSegment, icpFilters)
    : { kept: inSegment, removed: [] }

  const ticked = kept.filter((c) => selected.has(c.id))

  // Tell the assistant what is in view, so its pills can act on it. On
  // leaving, it falls back to the unfiltered set this page opens with.
  useEffect(() => {
    setLeadsInView(kept)
    return () => setLeadsInView(null)
  }, [kept])

  const subtitle = refined
    ? `${COPY.applied} · ${kept.length} of ${inSegment.length} in view`
    : `All companies · ${inSegment.length} in view`

  return (
    <PageShell
      breadcrumb={['Workspace', 'Leads']}
      title="Company Search"
      subtitle={subtitle}
      actions={
        <Button
          variant={refined ? 'secondary' : 'primary'}
          icon={refined ? 'check' : 'filter'}
          onClick={() => setRefined((r) => !r)}
          className={refined ? 'border-accent text-accent' : undefined}
          aria-pressed={refined}
        >
          {refined ? COPY.applied : COPY.apply}
        </Button>
      }
    >
      <div className="lp-stack">
        <FilterBar
          activeSegment={activeSegment}
          onSegmentChange={setActiveSegment}
          archetype={archetype}
          onArchetypeChange={setArchetype}
        />

        {refined && (
          <IcpRefineBar
            filters={icpFilters}
            removedCount={removed.length}
            onClear={() => setRefined(false)}
          />
        )}

        <LeadsTable
          companies={kept}
          archetype={archetype}
          selected={selected}
          onSelectedChange={setSelected}
        />

        {/* Room under the table so the floating bar never covers the last
            row. */}
        {ticked.length > 0 && <div aria-hidden="true" className="h-16" />}
      </div>

      {ticked.length > 0 && (
        <SelectionBar
          count={ticked.length}
          onClear={() => setSelected(new Set())}
          onAction={(action) =>
            actions.run(action, scopeForCompanies(ticked), () =>
              setSelected(new Set()),
            )
          }
        />
      )}

      {actions.overlay}
    </PageShell>
  )
}
